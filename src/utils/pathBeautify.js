/**
 * @file Path beautification — straightens lines, fits arcs, smooths curves.
 *
 * Pipeline:
 *   1. Try straight-line fit on the whole path.
 *   2. Try circular-arc fit on the whole path.
 *   3. Segment into straight + curved parts via curvature analysis,
 *      then smooth curved parts with moving-average.
 */

// ── helpers ──────────────────────────────────────────────────────────

function dist(a, b) {
  return Math.hypot(a[0] - b[0], a[2] - b[2]);
}

function toXZ(p) {
  return [p[0], p[2]];
}

function fromXZ(xz, y) {
  return [xz[0], y, xz[1]];
}

// ── 1. circle / arc fitting (least-squares algebraic fit) ────────────

const ARC_TOLERANCE = 0.2; // meters — max radial deviation

/**
 * Algebraic circle fit (Taubin).
 * Returns { cx, cz, radius } or null if fit fails.
 */
function fitCircleAlgebraic(points2D) {
  const n = points2D.length;
  if (n < 3) return null;

  // Centroid
  let sx = 0, sz = 0;
  for (const p of points2D) { sx += p[0]; sz += p[1]; }
  const cx0 = sx / n, cz0 = sz / n;

  // Build moments
  let Mxx = 0, Mxz = 0, Mzz = 0;
  let Mxxx = 0, Mxxz = 0, Mxzz = 0, Mzzz = 0;
  for (const p of points2D) {
    const xi = p[0] - cx0, zi = p[1] - cz0;
    const xi2 = xi * xi, zi2 = zi * zi;
    Mxx += xi2; Mxz += xi * zi; Mzz += zi2;
    Mxxx += xi2 * xi; Mxxz += xi2 * zi; Mxzz += xi * zi2; Mzzz += zi2 * zi;
  }
  Mxx /= n; Mxz /= n; Mzz /= n;
  Mxxx /= n; Mxxz /= n; Mxzz /= n; Mzzz /= n;

  // Solve for center
  const denom = 2 * (Mxx * Mzz - Mxz * Mxz);
  if (Math.abs(denom) < 1e-12) return null;

  const uc = (Mzz * (Mxxx + Mxzz) - Mxz * (Mxxz + Mzzz)) / denom;
  const vc = (Mxx * (Mxxz + Mzzz) - Mxz * (Mxxx + Mxzz)) / denom;

  const cx = cx0 + uc;
  const cz = cz0 + vc;

  // Radius = mean distance from center
  let rSum = 0;
  for (const p of points2D) {
    rSum += Math.hypot(p[0] - cx, p[1] - cz);
  }
  const radius = rSum / n;

  return { cx, cz, radius };
}

/**
 * Check if points2D are close to a circular arc.
 * Returns { cx, cz, radius, startAngle, endAngle } or null.
 */
function tryFitArc(points2D) {
  const circle = fitCircleAlgebraic(points2D);
  if (!circle) return null;

  // Check max radial deviation
  let maxDev = 0;
  for (const p of points2D) {
    const d = Math.abs(Math.hypot(p[0] - circle.cx, p[1] - circle.cz) - circle.radius);
    if (d > maxDev) maxDev = d;
  }
  if (maxDev > ARC_TOLERANCE) return null;

  // Compute angular range
  const angles = points2D.map((p) =>
    Math.atan2(p[1] - circle.cz, p[0] - circle.cx),
  );

  return {
    cx: circle.cx,
    cz: circle.cz,
    radius: circle.radius,
    angles,
  };
}

/**
 * Sample an arc into N evenly-spaced points.
 */
function sampleArc(cx, cz, radius, angles, numSamples) {
  // Determine consistent angular order
  let start = angles[0];
  let end = angles[angles.length - 1];

  // Ensure we go the short way around
  let diff = end - start;
  while (diff > Math.PI) diff -= 2 * Math.PI;
  while (diff < -Math.PI) diff += 2 * Math.PI;

  const points = [];
  for (let i = 0; i < numSamples; i++) {
    const t = i / (numSamples - 1);
    const a = start + diff * t;
    points.push([cx + radius * Math.cos(a), cz + radius * Math.sin(a)]);
  }
  return points;
}

// ── 3. segmentation via curvature ────────────────────────────────────

function curvatureAt(points2D, i, windowSize = 3) {
  if (i < windowSize || i >= points2D.length - windowSize) return 0;
  const prev = points2D[i - windowSize];
  const next = points2D[i + windowSize];
  const mid = points2D[i];
  // Menger curvature = 4 * area / (a * b * c)
  const a = dist(prev, mid);
  const b = dist(mid, next);
  const c = dist(next, prev);
  const s = (a + b + c) / 2;
  const area = Math.sqrt(Math.max(0, s * (s - a) * (s - b) * (s - c)));
  const denom = a * b * c;
  return denom === 0 ? 0 : (4 * area) / denom;
}

const CORNER_CURVATURE_THRESHOLD = 1.5; // high curvature = corner
const STRAIGHT_CURVATURE_THRESHOLD = 0.15;

function classifySegments(points2D) {
  if (points2D.length < 4) return [{ type: 'segment', start: 0, end: points2D.length - 1 }];

  const curvatures = points2D.map((_, i) => curvatureAt(points2D, i));

  // Find corner points (high curvature)
  const corners = [];
  for (let i = 1; i < curvatures.length - 1; i++) {
    if (curvatures[i] > CORNER_CURVATURE_THRESHOLD &&
        curvatures[i] > curvatures[i - 1] &&
        curvatures[i] > curvatures[i + 1]) {
      corners.push(i);
    }
  }

  // Build segments between corners
  const segments = [];
  let start = 0;
  for (const corner of corners) {
    if (corner > start + 2) {
      segments.push([start, corner]);
    }
    start = corner;
  }
  if (points2D.length - 1 > start + 2) {
    segments.push([start, points2D.length - 1]);
  }
  if (segments.length === 0) {
    segments.push([0, points2D.length - 1]);
  }

  // Classify each segment (all treated as curves now — straightening removed)
  return segments.map(([a, b]) => ({ type: 'segment', start: a, end: b }));
}

// ── 4. curve smoothing (moving average) ──────────────────────────────

const SMOOTH_WINDOW = 5;

function smoothCurve(points2D, windowSize = SMOOTH_WINDOW) {
  if (points2D.length < windowSize) return points2D;
  const half = Math.floor(windowSize / 2);
  const result = [];
  for (let i = 0; i < points2D.length; i++) {
    const lo = Math.max(0, i - half);
    const hi = Math.min(points2D.length - 1, i + half);
    let sx = 0, sz = 0, count = 0;
    for (let j = lo; j <= hi; j++) {
      sx += points2D[j][0];
      sz += points2D[j][1];
      count++;
    }
    result.push([sx / count, sz / count]);
  }
  return result;
}

// ── 5. main beautify ─────────────────────────────────────────────────

/**
 * Beautify a drag path.
 * @param {Array<[x, y, z]>} path3D — raw path points from the drag
 * @returns {Array<[x, y, z]>} — beautified path points
 */
export function beautifyPath(path3D) {
  if (path3D.length < 2) return path3D;

  const y = path3D[0][1];
  const points2D = path3D.map(toXZ);

  // 1. Try whole-path circle arc
  const arc = tryFitArc(points2D);
  if (arc) {
    const sampled = sampleArc(arc.cx, arc.cz, arc.radius, arc.angles, points2D.length);
    return sampled.map((xz) => fromXZ(xz, y));
  }

  // 2. Segment and process each part
  const segments = classifySegments(points2D);
  const result = [];

  for (const seg of segments) {
    const segPoints = points2D.slice(seg.start, seg.end + 1);

    // Try arc fit on sub-segment
    const subArc = tryFitArc(segPoints);
    if (subArc) {
        const sampled = sampleArc(subArc.cx, subArc.cz, subArc.radius, subArc.angles, segPoints.length);
        for (const xz of sampled) {
          result.push(xz);
        }
    } else {
      // Smooth with moving average
      const smoothed = smoothCurve(segPoints);
      for (const xz of smoothed) {
        result.push(xz);
      }
    }
  }

  // Remove consecutive duplicates
  const deduped = [result[0]];
  for (let i = 1; i < result.length; i++) {
    if (dist(result[i], deduped[deduped.length - 1]) > 0.001) {
      deduped.push(result[i]);
    }
  }

  return deduped.map((xz) => fromXZ(xz, y));
}
