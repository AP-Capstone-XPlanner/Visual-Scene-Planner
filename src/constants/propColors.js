/**
 * @file Prop color defaults and presets.
 */

export const DEFAULT_PROP_COLORS = Object.freeze({
  sofa: '#8f6f33',
  coffee_table: '#d2b48c',
  dining_set: '#d2b48c',
  bed: '#c6a072',
  wardrobe: '#8d6e63',
  bookshelf: '#6d4c41',
  nightstand: '#fcfdfd',
  refrigerator: '#f5f5f5',
  television: '#1a1a1a',
  kitchen_cabinets: '#d2b48c',
  window_curtain: '#8b4513',
  floor_lamp_wood: '#8d6e63',
  floor_lamp_metal: '#b0bec5',
  stage_curtain: '#800020',
  stage_couches: '#8f6f33',
  prop_table: '#d2b48c',
  door_flat: '#8d6e63',
  cube: '#808080',
  cylinder: '#808080',
  sphere: '#808080',
  cone: '#808080',
  pyramid: '#808080',
  rect_prism: '#808080',
  drama_chair_red: '#cc3333',
  drama_chair_blue: '#3355cc',
  drama_chair_green: '#33aa55',
  musician_chair: '#1a1a1a',
  conductor_podium: '#333333',
  music_stand: '#202020',
  drum_set: '#1a1a1a',
  microphones: '#333333',
  harp: '#deb941',
  piano: '#1a1a1a',
  dancer: '#87CEEB',
});

export const COLOR_PRESETS = Object.freeze([
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6',
  '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
  '#f43f5e', '#b91c1c', '#c2410c', '#a16207', '#854d0e',
  '#78716c', '#57534e', '#44403c', '#64748b', '#334155',
  '#1e293b', '#0f172a', '#000000', '#f8fafc', '#ffffff',
  '#fecaca', '#fef08a', '#bbf7d0', '#bae6fd', '#e9d5ff',
]);

export function getDefaultPropColor(type) {
  return DEFAULT_PROP_COLORS[type] || '#808080';
}
