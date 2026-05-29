/**
 * @file Stage constants — textures, colors, enclosure limits, guide palettes.
 */

export const ENVIRONMENT_COLOR_PRESETS = Object.freeze([
  { label: 'Black', hex: '#000000' },
  { label: 'White', hex: '#ffffff' },
  { label: 'Midnight Blue', hex: '#191970' },
  { label: 'Light Blue', hex: '#87ceeb' },
]);

export const DEFAULT_SKY_COLOR = '#000000';
export const DEFAULT_GROUND_COLOR = '#ffffff';

export const DEFAULT_STAGE_TEXTURE = 'dark_wood';
export const DEFAULT_SHOW_STAGE_BASELINE = true;

export const STAGE_ENCLOSURE_HEIGHT_LIMITS = Object.freeze({
  min: 0.5,
  max: 15,
  default: 4,
});

export const STAGE_ENCLOSURE_OPACITY_LIMITS = Object.freeze({
  min: 0.05,
  max: 1,
  default: 0.22,
});

export const STAGE_TEXTURE_OPTIONS = Object.freeze([
  { id: 'dark_wood', label: 'Dark hardwood' },
  { id: 'light_wood', label: 'Light hardwood' },
  { id: 'matte_black', label: 'Matte black (PVC)' },
]);

export const STAGE_SURFACE_COLORS = Object.freeze({
  dark_wood: {
    body: '#4a3520',
    edge: '#8b6914',
    roughness: 0.82,
    metalness: 0.02,
  },
  light_wood: {
    body: '#a08050',
    edge: '#d4b896',
    roughness: 0.78,
    metalness: 0.02,
  },
  matte_black: {
    body: '#121212',
    edge: '#3a3a3a',
    roughness: 0.92,
    metalness: 0.04,
  },
});

export const CENTER_BASELINE_COLOR = '#38bdf8';

export const STAGE_GUIDE_PALETTES = Object.freeze({
  dark_wood: {
    zone: { line: '#f0abfc', text: '#fae8ff' },
    grid: { line: '#f0d8a8', opacity: 0.82, lineWidth: 1.25 },
    enclosure: { fill: '#c4b5fd', edge: '#ede9fe', opacity: 0.22 },
  },
  light_wood: {
    zone: { line: '#1d4ed8', text: '#1e3a8a' },
    grid: { line: '#422006', opacity: 0.7, lineWidth: 1.05 },
    enclosure: { fill: '#2563eb', edge: '#1e3a8a', opacity: 0.18 },
  },
  matte_black: {
    zone: { line: '#fbbf24', text: '#fef9c3' },
    grid: { line: '#b8c9e0', opacity: 0.72, lineWidth: 1.15 },
    enclosure: { fill: '#fcd34d', edge: '#fef08a', opacity: 0.2 },
  },
});

export const DEFAULT_STAGE_ENCLOSURE_COLOR =
  STAGE_GUIDE_PALETTES.dark_wood.enclosure.fill;

export const FLOOR_GRID = Object.freeze({
  cellSize: 1,
  cellThickness: 0.5,
  cellColor: '#374151',
  sectionSize: 5,
  sectionThickness: 1,
  sectionColor: '#6b7280',
});
