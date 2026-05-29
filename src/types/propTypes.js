/**
 * @file Prop type definitions (JavaScript — JSDoc for IDE hints).
 *
 * @typedef {'dark_wood'|'light_wood'|'matte_black'} StageTexture
 * @typedef {'select'|'place'} EditorMode
 */

/** All prop type keys (snake_case). */
export const PROPTYPES = Object.freeze({
  // Living room & bedroom
  sofa: 'sofa',
  coffee_table: 'coffee_table',
  dining_set: 'dining_set',
  bed: 'bed',
  wardrobe: 'wardrobe',
  bookshelf: 'bookshelf',
  nightstand: 'nightstand',

  // Appliances & decor
  refrigerator: 'refrigerator',
  television: 'television',
  kitchen_cabinets: 'kitchen_cabinets',
  window_curtain: 'window_curtain',
  floor_lamp_wood: 'floor_lamp_wood',
  floor_lamp_metal: 'floor_lamp_metal',

  // Backstage & set flats
  stage_curtain: 'stage_curtain',
  stage_couches: 'stage_couches',
  prop_table: 'prop_table',
  door_flat: 'door_flat',
  cube: 'cube',
  cylinder: 'cylinder',
  sphere: 'sphere',
  cone: 'cone',
  pyramid: 'pyramid',
  rect_prism: 'rect_prism',
  drama_chair_red: 'drama_chair_red',
  drama_chair_blue: 'drama_chair_blue',
  drama_chair_green: 'drama_chair_green',

  // Orchestra & concert
  musician_chair: 'musician_chair',
  conductor_podium: 'conductor_podium',
  music_stand: 'music_stand',
  drum_set: 'drum_set',
  microphones: 'microphones',
  harp: 'harp',
  piano: 'piano',
});

/**
 * @typedef {Object} PropInteractionState
 * @property {boolean} [open] - Wardrobe/nightstand doors, curtain, door_flat
 * @property {boolean[]} [chairsPulled] - dining_set chair pull-out states
 * @property {boolean} [lampOn] - floor_lamp toggle
 * @property {boolean[]} [chairsSpawned] - prop_table spawned chairs
 */

/**
 * @typedef {Object} PlacedProp
 * @property {string} id
 * @property {string} type - PropType key from PROPTYPES
 * @property {[number,number,number]} position
 * @property {number} rotation
 * @property {number} scale
 * @property {boolean} visible
 * @property {string} tag
 * @property {string} color
 * @property {PropInteractionState} [interactionState]
 */

/**
 * @typedef {Object} StageDimensions
 * @property {number} length
 * @property {number} width
 * @property {number} height
 */

export const STAGE_TEXTURES = Object.freeze(['dark_wood', 'light_wood', 'matte_black']);
export const EDITOR_MODES = Object.freeze(['select', 'place']);
