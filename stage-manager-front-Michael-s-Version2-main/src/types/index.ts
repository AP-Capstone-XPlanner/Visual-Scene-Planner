export type PropType =
  | 'big_screen'
  | 'screen'
  | 'table'
  | 'chair'
  | 'stairs'
  | 'platform'
  | 'square'
  | 'circle'
  | 'box';

export type ChairVariant = 'with_back' | 'no_back' | 'low' | 'high';

export type StageTexture = 'dark_wood' | 'light_wood' | 'matte_black';

export interface StageDimensions {
  length: number;
  width: number;
  height: number;
}

/** Width (X), height (Y), depth (Z) in meters — used by big_screen and box. */
export interface PropDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface PlacedProp {
  id: string;
  type: PropType;
  position: [number, number, number];
  rotation: number;
  /** Uniform scale multiplier (1 = default size). */
  scale: number;
  /** When false, prop is hidden in the 3D view but kept in the layout. */
  visible: boolean;
  /** User label describing how this prop is used (e.g. "Host desk"). */
  tag: string;
  /** Primary surface color (hex). */
  color: string;
  /** Custom size for big_screen / box. */
  dimensions?: PropDimensions;
  /** Chair style when type is chair. */
  chairVariant?: ChairVariant;
}

export type EditorMode = 'select' | 'place';

export interface PlacementOptions {
  chairVariant?: ChairVariant;
}
