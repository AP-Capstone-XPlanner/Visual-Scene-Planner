/**
 * @file Prop label mapping — snake_case key → display label.
 */

const LABEL_MAP = Object.freeze({
  sofa: 'Sofa / Couch',
  coffee_table: 'Coffee table',
  dining_set: 'Dining table and chairs',
  bed: 'Bed frame and mattress',
  wardrobe: 'Wardrobe / Dresser',
  bookshelf: 'Bookshelf',
  nightstand: 'Nightstand',
  refrigerator: 'Refrigerator',
  television: 'Television',
  kitchen_cabinets: 'Kitchen Cabinets',
  window_curtain: 'Curtains / Blinds',
  floor_lamp_wood: 'Floor Lamp 1 (Wood)',
  floor_lamp_metal: 'Floor Lamp 2 (Metal)',
  stage_curtain: 'Stage Curtain',
  stage_couches: 'Stage couches or armchairs',
  prop_table: 'Prop tables and chairs',
  door_flat: 'Fake doors or window frames (flats)',
  cube: 'Cube (Grey)',
  cylinder: 'Cylinder (Grey)',
  sphere: 'Sphere (Grey)',
  cone: 'Cone (Grey)',
  pyramid: 'Pyramid (Grey)',
  rect_prism: 'Rectangular Prism (Grey)',
  drama_chair_red: 'Drama Chair 1 (Red)',
  drama_chair_blue: 'Drama Chair 2 (Blue)',
  drama_chair_green: 'Drama Chair 3 (Green)',
  musician_chair: 'Musician chairs',
  conductor_podium: "Conductor's podium",
  music_stand: 'Music stands',
  drum_set: 'Drum set',
  microphones: 'Microphones',
  harp: 'Harp',
  piano: 'Piano',
  dancer: 'Dancer',
});

export function getPropLabel(type) {
  return LABEL_MAP[type] || type;
}
