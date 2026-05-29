import { getPropCatalogSpec } from '../constants/propCatalogSpecs.js';

const PROP_LOCAL_BOTTOM_Y = {
  sofa: 0, coffee_table: 0, dining_set: 0, bed: 0, wardrobe: 0,
  bookshelf: 0, nightstand: 0, refrigerator: 0, television: 0,
  kitchen_cabinets: 0, window_curtain: 0, floor_lamp_wood: 0,
  floor_lamp_metal: 0, stage_curtain: 0, stage_couches: 0,
  prop_table: 0, door_flat: 0, cube: 0, cylinder: 0, sphere: 0,
  cone: 0, pyramid: 0, rect_prism: 0, drama_chair_red: 0,
  drama_chair_blue: 0, drama_chair_green: 0, musician_chair: 0,
  conductor_podium: 0, music_stand: 0, drum_set: 0, microphones: 0,
  harp: 0, piano: 0,
};

const GROUND_EPSILON = 0.03;

export const SELECTION_RING_THICKNESS = 0.07;
export const POSITIONING_GIZMO_SIZE = 0.65;
export const RING_CLEAR_OF_GIZMO = 0.42;

const SELECTION_RING_PADDING = 0.2;
const SELECTION_RING_MIN_INNER = 0.34;

export function getPropLocalBottom(type) {
  return PROP_LOCAL_BOTTOM_Y[type] ?? 0;
}

export function getPropBottomY(prop) {
  return prop.position[1] + getPropLocalBottom(prop.type) * prop.scale;
}

export function isPropGroundedOnStage(prop, stageTopY) {
  return getPropBottomY(prop) <= stageTopY + GROUND_EPSILON;
}

export function shiftGroundedPropsForStageHeight(props, oldStageTopY, newStageTopY) {
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

export function getPropSelectionRingRadii(prop) {
  const s = prop.scale;
  const spec = getPropCatalogSpec(prop.type);
  const half = Math.max(spec.width, spec.depth) * 0.5 * s;
  const clearOfGizmo = POSITIONING_GIZMO_SIZE * s + RING_CLEAR_OF_GIZMO;
  const inner = Math.max(
    SELECTION_RING_MIN_INNER,
    half + SELECTION_RING_PADDING,
    clearOfGizmo,
  );
  return { inner, outer: inner + SELECTION_RING_THICKNESS };
}

export function getPropTopExtent(prop) {
  const spec = getPropCatalogSpec(prop.type);
  return prop.position[1] + spec.height * prop.scale;
}
