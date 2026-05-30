/**
 * @file Prop catalog specs — dimensions for all 35 prop types.
 */

export const PROP_CATALOG_SPECS = Object.freeze({
  // Living room & bedroom
  sofa: { width: 1.83, height: 0.79, depth: 1.52 },
  coffee_table: { width: 0.965, height: 0.47, depth: 0.965 },
  dining_set: { width: 2.5, height: 0.95, depth: 1.6 },
  bed: { width: 1.65, height: 1.12, depth: 2.15 },
  wardrobe: { width: 1.2, height: 1.82, depth: 0.55 },
  bookshelf: { width: 0.77, height: 1.22, depth: 0.3 },
  nightstand: { width: 0.47, height: 0.68, depth: 0.4 },

  // Appliances & decor
  refrigerator: { width: 0.912, height: 1.825, depth: 0.72 },
  television: { width: 1.8, height: 1.14, depth: 0.5 },
  kitchen_cabinets: { width: 2.3, height: 2.3, depth: 0.6 },
  window_curtain: { width: 2.44, height: 2.74, depth: 0.2 },
  floor_lamp_wood: { width: 0.4, height: 1.48, depth: 0.4 },
  floor_lamp_metal: { width: 0.4, height: 1.48, depth: 0.4 },

  // Backstage & set flats
  stage_curtain: { width: 0, height: 0, depth: 0.5 }, // dynamic — set from stage bounds
  stage_couches: { width: 1.83, height: 0.79, depth: 1.52 },
  prop_table: { width: 2.8, height: 0.76, depth: 1.6 },
  door_flat: { width: 1.22, height: 2.13, depth: 1.22 },
  cube: { width: 0.5, height: 0.5, depth: 0.5 },
  cylinder: { width: 0.5, height: 0.5, depth: 0.5 },
  sphere: { width: 0.56, height: 0.56, depth: 0.56 },
  cone: { width: 0.56, height: 0.5, depth: 0.56 },
  pyramid: { width: 0.7, height: 0.5, depth: 0.7 },
  rect_prism: { width: 0.8, height: 0.3, depth: 0.4 },
  drama_chair_red: { width: 0.55, height: 0.75, depth: 0.53 },
  drama_chair_blue: { width: 0.5, height: 0.83, depth: 0.52 },
  drama_chair_green: { width: 0.42, height: 0.92, depth: 0.49 },

  // Choreography
  dancer: { width: 0.5, height: 1.7, depth: 0.5 },

  // Orchestra & concert
  musician_chair: { width: 0.43, height: 0.97, depth: 0.43 },
  conductor_podium: { width: 1.0, height: 1.2, depth: 1.0 },
  music_stand: { width: 0.51, height: 1.22, depth: 0.4 },
  drum_set: { width: 1.5, height: 1.2, depth: 1.2 },
  microphones: { width: 0.4, height: 1.7, depth: 0.4 },
  harp: { width: 0.42, height: 1.52, depth: 0.72 },
  piano: { width: 1.47, height: 1.5, depth: 1.55 },
});

/** Prop types that support click-to-toggle interaction. */
export const INTERACTIVE_PROP_TYPES = new Set([
  'wardrobe',
  'nightstand',
  'dining_set',
  'stage_curtain',
  'window_curtain',
  'door_flat',
  'floor_lamp_wood',
  'floor_lamp_metal',
  'prop_table',
]);

export function getPropCatalogSpec(type) {
  return PROP_CATALOG_SPECS[type];
}

export function propSupportsToggleInteraction(type) {
  return (
    type === 'wardrobe' ||
    type === 'nightstand' ||
    type === 'dining_set' ||
    type === 'stage_curtain' ||
    type === 'window_curtain' ||
    type === 'door_flat' ||
    type === 'floor_lamp_wood' ||
    type === 'floor_lamp_metal' ||
    type === 'prop_table'
  );
}

export function getDefaultPropInteractionState(type) {
  if (type === 'wardrobe' || type === 'nightstand') {
    return { open: false };
  }
  if (type === 'dining_set') {
    return { chairsPulled: [false, false, false, false, false, false] };
  }
  if (type === 'stage_curtain' || type === 'window_curtain' || type === 'door_flat') {
    return { open: false };
  }
  if (type === 'floor_lamp_wood' || type === 'floor_lamp_metal') {
    return { lampOn: false };
  }
  if (type === 'prop_table') {
    return { chairsSpawned: [] };
  }
  return undefined;
}
