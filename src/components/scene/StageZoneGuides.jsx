import { useMemo } from 'react';
import { Html, Line } from '@react-three/drei';
import {
  STAGE_GUIDE_PALETTES,
  STAGE_SURFACE_COLORS,
} from '../../constants/stage.js';
import {
  STAGE_AUDIENCE_LABEL,
  STAGE_NINE_ZONE_LABELS,
  STAGE_ZONE_LINE_OPACITY,
  STAGE_ZONE_LINE_WIDTH,
} from '../../constants/stageZones.js';
import { useStageStore } from '../../store/stageStore.js';
import { getContrastOnBackground } from '../../utils/color.js';
import { getStageHalfExtents } from '../../utils/stageAxes.js';

const Y_EPSILON = 0.016;
const RENDER_ORDER = 12;

function thirdCenter(half, index) {
  const third = (2 * half) / 3;
  return -half + third * (index + 0.5);
}

function buildAudienceArc(halfX, halfZ, y, bulge, segments = 48) {
  const points = [];
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const x = -halfX + t * 2 * halfX;
    const nx = halfX > 0 ? x / halfX : 0;
    const z = halfZ + bulge * (1 - nx * nx);
    points.push([x, y, z]);
  }
  return points;
}

function ZoneLabel({ x, z, y, text, distanceFactor, textColor, textShadow }) {
  return (
    <Html
      position={[x, y, z]}
      center
      occlude={false}
      distanceFactor={distanceFactor}
      zIndexRange={[500, 0]}
      style={{ pointerEvents: 'none' }}
      transform={false}
    >
      <div
        className="stage-zone-label"
        style={{ color: textColor, textShadow }}
      >
        {text}
      </div>
    </Html>
  );
}

export function StageZoneGuides() {
  const showStageZones = useStageStore((s) => s.showStageZones);
  const stageTexture = useStageStore((s) => s.stageTexture);
  const { length, width, height } = useStageStore((s) => s.stage);

  const colors = useMemo(() => {
    const stageBg = STAGE_SURFACE_COLORS[stageTexture].body;
    const zonePalette = STAGE_GUIDE_PALETTES[stageTexture].zone;
    const shadow = getContrastOnBackground(stageBg).textShadow;
    return {
      zone: {
        line: zonePalette.line,
        text: zonePalette.text,
        textShadow: shadow,
      },
    };
  }, [stageTexture]);

  const geometry = useMemo(() => {
    const { halfX, halfZ } = getStageHalfExtents(length, width);
    const y = height + Y_EPSILON;
    return { halfX, halfZ, y };
  }, [length, width, height]);

  if (!showStageZones) return null;

  const { halfX, halfZ, y } = geometry;
  const thirdX = (2 * halfX) / 3;
  const thirdZ = (2 * halfZ) / 3;

  const zoneLines = [
    // Horizontal zone lines
    ...[-1, 1].map((sign) => ({
      points: [
        [-halfX, y, sign * thirdCenter(halfZ, 0)],
        [halfX, y, sign * thirdCenter(halfZ, 0)],
      ],
      key: `zh-${sign}`,
    })),
    // Vertical zone lines
    ...[-1, 1].map((sign) => ({
      points: [
        [sign * thirdCenter(halfX, 0), y, -halfZ],
        [sign * thirdCenter(halfX, 0), y, halfZ],
      ],
      key: `zv-${sign}`,
    })),
  ];

  return (
    <group renderOrder={RENDER_ORDER}>
      {zoneLines.map(({ points, key }) => (
        <Line
          key={key}
          points={points}
          color={colors.zone.line}
          lineWidth={STAGE_ZONE_LINE_WIDTH}
          transparent
          opacity={STAGE_ZONE_LINE_OPACITY}
          depthWrite={false}
        />
      ))}
      {STAGE_NINE_ZONE_LABELS.map((zone) => (
        <ZoneLabel
          key={zone.text}
          x={thirdCenter(halfX, zone.alongX)}
          z={thirdCenter(halfZ, zone.alongZ)}
          y={y}
          text={zone.text}
          distanceFactor={14}
          textColor={colors.zone.text}
          textShadow={colors.zone.textShadow}
        />
      ))}
      <Line
        points={buildAudienceArc(halfX, halfZ, y, 1.2)}
        color={colors.zone.line}
        lineWidth={STAGE_ZONE_LINE_WIDTH * 0.8}
        transparent
        opacity={STAGE_ZONE_LINE_OPACITY * 0.7}
        depthWrite={false}
        dashed
        dashSize={0.6}
        gapSize={0.3}
      />
      <ZoneLabel
        x={0}
        z={halfZ + 1.6}
        y={y}
        text={STAGE_AUDIENCE_LABEL}
        distanceFactor={15}
        textColor={colors.zone.text}
        textShadow={colors.zone.textShadow}
      />
    </group>
  );
}
