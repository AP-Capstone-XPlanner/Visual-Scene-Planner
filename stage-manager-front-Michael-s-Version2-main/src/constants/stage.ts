import type { StageTexture } from '../types';

export const ENVIRONMENT_COLOR_PRESETS = [
  { label: 'Black', hex: '#000000' },
  { label: 'White', hex: '#ffffff' },
  { label: 'Midnight Blue', hex: '#191970' },
  { label: 'Light Blue', hex: '#87ceeb' },
] as const;

export const DEFAULT_SKY_COLOR = '#000000';
export const DEFAULT_GROUND_COLOR = '#ffffff';

export const DEFAULT_STAGE_TEXTURE: StageTexture = 'dark_wood';
export const DEFAULT_SHOW_STAGE_BASELINE = true;

export const STAGE_TEXTURE_OPTIONS: {
  id: StageTexture;
  label: string;
}[] = [
  { id: 'dark_wood', label: 'Dark hardwood' },
  { id: 'light_wood', label: 'Light hardwood' },
  { id: 'matte_black', label: 'Matte black (PVC)' },
];

export const STAGE_SURFACE_COLORS: Record<
  StageTexture,
  { body: string; edge: string; roughness: number; metalness: number }
> = {
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
};

/** 1 m area grid lines on deck — contrast tuned per stage material. */
export const STAGE_GRID_LINE_COLORS: Record<
  StageTexture,
  { line: string; opacity: number; lineWidth: number }
> = {
  dark_wood: {
    line: '#f0d8a8',
    opacity: 0.82,
    lineWidth: 1.25,
  },
  light_wood: {
    line: '#3d2814',
    opacity: 0.65,
    lineWidth: 1,
  },
  matte_black: {
    line: '#b8c9e0',
    opacity: 0.72,
    lineWidth: 1.15,
  },
};

/** Floor grid at y ≈ 0 — stage overlay uses the same spacing. */
export const FLOOR_GRID = {
  cellSize: 1,
  sectionSize: 5,
  cellThickness: 0.6,
  sectionThickness: 1.2,
  cellColor: '#3a4055',
  sectionColor: '#5a6380',
} as const;
