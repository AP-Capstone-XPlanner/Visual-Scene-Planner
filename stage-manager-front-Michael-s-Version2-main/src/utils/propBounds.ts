import { resolvePropDimensions } from '../constants/propDimensions';
import type { ChairVariant, PlacedProp, PropType } from '../types';

const PROP_LOCAL_BOTTOM_Y: Record<PropType, number> = {
  big_screen: 0,
  screen: 0,
  table: 0,
  platform: 0,
  square: 0,
  circle: 0,
  chair: 0,
  stairs: 0,
  box: 0,
};

/** Default half-extent on XZ before prop scale (matches PropMesh geometry). */
const PROP_XZ_HALF: Record<PropType, number> = {
  big_screen: 2.5,
  screen: 0.9,
  table: 0.95,
  platform: 1.25,
  square: 0.75,
  circle: 0.85,
  chair: 0.28,
  stairs: 0.9,
  box: 0.5,
};

const GROUND_EPSILON = 0.03;

/** World-space ring band thickness (inner/outer radius difference). */
export const SELECTION_RING_THICKNESS = 0.07;

const SELECTION_RING_PADDING = 0.2;
const SELECTION_RING_MIN_INNER = 0.34;

export function getPropLocalBottom(
  type: PropType,
  _chairVariant?: ChairVariant,
): number {
  return PROP_LOCAL_BOTTOM_Y[type];
}

export function getPropBottomY(prop: PlacedProp): number {
  return prop.position[1] + getPropLocalBottom(prop.type, prop.chairVariant) * prop.scale;
}

export function isPropGroundedOnStage(prop: PlacedProp, stageTopY: number): boolean {
  return getPropBottomY(prop) <= stageTopY + GROUND_EPSILON;
}

export function shiftGroundedPropsForStageHeight(
  props: PlacedProp[],
  oldStageTopY: number,
  newStageTopY: number,
): PlacedProp[] {
  const delta = newStageTopY - oldStageTopY;
  if (delta === 0) return props;
  return props.map((p) => {
    if (!isPropGroundedOnStage(p, oldStageTopY)) return p;
    return {
      ...p,
      position: [p.position[0], p.position[1] + delta, p.position[2]],
    };
  });
}

/** Inner/outer radius for the selection ring in world units (thickness fixed). */
export function getPropSelectionRingRadii(prop: PlacedProp): {
  inner: number;
  outer: number;
} {
  const s = prop.scale;
  const dims = resolvePropDimensions(prop);
  let half: number;
  if (dims) {
    half = Math.max(dims.width, dims.depth) * 0.5 * s;
  } else {
    half = PROP_XZ_HALF[prop.type] * s;
  }
  const inner = Math.max(SELECTION_RING_MIN_INNER, half + SELECTION_RING_PADDING);
  return { inner, outer: inner + SELECTION_RING_THICKNESS };
}

/** Max Y extent for clamping elevated props (approximate). */
export function getPropTopExtent(prop: PlacedProp): number {
  const dims = resolvePropDimensions(prop);
  if (dims) {
    return prop.position[1] + dims.height * prop.scale;
  }
  const scale = prop.scale;
  switch (prop.type) {
    case 'big_screen':
      return prop.position[1] + 3 * scale;
    case 'chair':
      return prop.position[1] + (prop.chairVariant === 'high' ? 1.1 : 0.95) * scale;
    default:
      return prop.position[1] + 2 * scale;
  }
}
