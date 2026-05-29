import { GRID_SNAP } from '../constants/props.js';
import { getPropCatalogSpec } from '../constants/propCatalogSpecs.js';
import { getPropLocalBottom } from './propBounds.js';
import { snapValue } from './snap.js';

export const PROP_MAX_HEIGHT_ABOVE_STAGE = 12;
export const POSITION_PANEL_SNAP = 0.01;
export const KEYBOARD_MOVE_STEP = GRID_SNAP;
export const KEYBOARD_MOVE_STEP_FAST = 1;

export function clampPropXZ(x, z, halfX, halfZ, margin = 0.5) {
  return {
    x: Math.max(-halfX + margin, Math.min(halfX - margin, x)),
    z: Math.max(-halfZ + margin, Math.min(halfZ - margin, z)),
  };
}

export function clampPropOriginY(y, stageTopY, type, scale) {
  const localBottom = getPropLocalBottom(type);
  const minY = stageTopY - localBottom * scale;
  const maxY =
    stageTopY +
    PROP_MAX_HEIGHT_ABOVE_STAGE -
    getPropCatalogSpec(type).height * scale;
  return Math.max(minY, Math.min(maxY, y));
}

export function normalizePropPosition(
  x, y, z, halfX, halfZ, snapToGrid, stageTopY,
  prop, snapStep = GRID_SNAP,
) {
  let nx = snapValue(x, snapToGrid, snapStep);
  let ny = snapValue(y, snapToGrid, snapStep);
  let nz = snapValue(z, snapToGrid, snapStep);
  const clamped = clampPropXZ(nx, nz, halfX, halfZ);
  if (prop) {
    ny = clampPropOriginY(ny, stageTopY, prop.type, prop.scale);
  } else {
    ny = Math.max(
      stageTopY,
      Math.min(stageTopY + PROP_MAX_HEIGHT_ABOVE_STAGE, ny),
    );
  }
  return [clamped.x, ny, clamped.z];
}

export function radiansToDegrees(rad) {
  return (rad * 180) / Math.PI;
}

const TAU = Math.PI * 2;

export function normalizeRotation(radians) {
  let r = radians % TAU;
  if (r < 0) r += TAU;
  return r;
}

export function rotationDisplayDegrees(radians) {
  const deg = Math.round(radiansToDegrees(normalizeRotation(radians)));
  return deg >= 360 ? 0 : deg;
}

export function heightAboveStage(propY, stageTopY) {
  return Math.max(0, propY - stageTopY);
}
