/**
 * @file Prop catalog — categories, labels, limits.
 */

import { getPropLabel } from '../utils/propLabelMap.js';

export const STAGE_LIMITS = Object.freeze({
  length: { min: 4, max: 30 },
  width: { min: 4, max: 30 },
  height: { min: 0.2, max: 8 },
});

export const GRID_SNAP = 0.25;

export const PROP_SCALE_LIMITS = Object.freeze({
  min: 0.1,
  max: 5,
  step: 0.1,
  default: 1,
});

export const PROP_TAG_MAX_LENGTH = 40;

export const PROP_CATALOG_CATEGORIES = Object.freeze([
  {
    id: 'living',
    label: 'Living room & bedroom',
    items: [
      { type: 'sofa', label: getPropLabel('sofa'), description: 'Sectional sofa with cushions', icon: '🛋️' },
      { type: 'coffee_table', label: getPropLabel('coffee_table'), description: 'Wood coffee table with shelf', icon: '☕' },
      { type: 'dining_set', label: getPropLabel('dining_set'), description: 'Table with six pull-out chairs', icon: '🍽️' },
      { type: 'bed', label: getPropLabel('bed'), description: 'Timber bed with pillows', icon: '🛏️' },
      { type: 'wardrobe', label: getPropLabel('wardrobe'), description: 'Three-door wardrobe', icon: '🚪' },
      { type: 'bookshelf', label: getPropLabel('bookshelf'), description: 'Bookshelf with decor', icon: '📚' },
      { type: 'nightstand', label: getPropLabel('nightstand'), description: 'Bedside table with lamp', icon: '🪔' },
    ],
  },
  {
    id: 'appliances',
    label: 'Appliances & decor',
    items: [
      { type: 'refrigerator', label: getPropLabel('refrigerator'), description: 'Double-door refrigerator', icon: '🧊' },
      { type: 'television', label: getPropLabel('television'), description: 'Flat-screen television', icon: '📺' },
      { type: 'kitchen_cabinets', label: getPropLabel('kitchen_cabinets'), description: 'Kitchen cabinet set', icon: '🗄️' },
      { type: 'window_curtain', label: getPropLabel('window_curtain'), description: 'Window curtains with physics', icon: '🪟' },
      { type: 'floor_lamp_wood', label: getPropLabel('floor_lamp_wood'), description: 'Floor lamp (wood base)', icon: '💡' },
      { type: 'floor_lamp_metal', label: getPropLabel('floor_lamp_metal'), description: 'Floor lamp (metal base)', icon: '🔦' },
    ],
  },
  {
    id: 'backstage',
    label: 'Backstage & set flats',
    items: [
      { type: 'stage_curtain', label: getPropLabel('stage_curtain'), description: 'Stage curtain with physics', icon: '🎭' },
      { type: 'stage_couches', label: getPropLabel('stage_couches'), description: 'Stage couches/armchairs', icon: '🛋️' },
      { type: 'prop_table', label: getPropLabel('prop_table'), description: 'Prop table with spawnable chairs', icon: '🪑' },
      { type: 'door_flat', label: getPropLabel('door_flat'), description: 'Animated door/window flat', icon: '🚪' },
      { type: 'cube', label: getPropLabel('cube'), description: 'Cube (Grey)', icon: '🟫' },
      { type: 'cylinder', label: getPropLabel('cylinder'), description: 'Cylinder (Grey)', icon: '🥫' },
      { type: 'sphere', label: getPropLabel('sphere'), description: 'Sphere (Grey)', icon: '⚪' },
      { type: 'cone', label: getPropLabel('cone'), description: 'Cone (Grey)', icon: '🔺' },
      { type: 'pyramid', label: getPropLabel('pyramid'), description: 'Pyramid (Grey)', icon: '🔻' },
      { type: 'rect_prism', label: getPropLabel('rect_prism'), description: 'Rectangular Prism (Grey)', icon: '📦' },
      { type: 'drama_chair_red', label: getPropLabel('drama_chair_red'), description: 'Drama chair (Red)', icon: '🪑' },
      { type: 'drama_chair_blue', label: getPropLabel('drama_chair_blue'), description: 'Drama chair (Blue)', icon: '🪑' },
      { type: 'drama_chair_green', label: getPropLabel('drama_chair_green'), description: 'Drama chair (Green)', icon: '🪑' },
    ],
  },
  {
    id: 'orchestra',
    label: 'Orchestra & concert',
    items: [
      { type: 'musician_chair', label: getPropLabel('musician_chair'), description: 'Orchestra chair', icon: '💺' },
      { type: 'conductor_podium', label: getPropLabel('conductor_podium'), description: "Conductor's podium with rails", icon: '🎼' },
      { type: 'music_stand', label: getPropLabel('music_stand'), description: 'Adjustable sheet stand', icon: '🎵' },
      { type: 'drum_set', label: getPropLabel('drum_set'), description: 'Drum set', icon: '🥁' },
      { type: 'microphones', label: getPropLabel('microphones'), description: 'Microphone set', icon: '🎤' },
      { type: 'harp', label: getPropLabel('harp'), description: 'Concert harp', icon: '🎶' },
      { type: 'piano', label: getPropLabel('piano'), description: 'Grand piano', icon: '🎹' },
    ],
  },
]);

/** Flat list for lookups (selected panel, etc.). */
export const PROP_CATALOG = PROP_CATALOG_CATEGORIES.flatMap((c) => c.items);
