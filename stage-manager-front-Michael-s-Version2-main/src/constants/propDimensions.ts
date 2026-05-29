import type { ChairVariant, PropDimensions, PropType } from '../types';

export const BIG_SCREEN_DEPTH = 0.15;

export const BIG_SCREEN_LIMITS = {
  width: { min: 1, max: 40, step: 0.5, default: 5 },
  height: { min: 0.5, max: 20, step: 0.25, default: 2.8 },
};

export const BOX_LIMITS = {
  width: { min: 0.25, max: 20, step: 0.25, default: 1 },
  height: { min: 0.25, max: 20, step: 0.25, default: 1 },
  depth: { min: 0.25, max: 20, step: 0.25, default: 1 },
};

export const CHAIR_VARIANT_OPTIONS: {
  id: ChairVariant;
  label: string;
}[] = [
  { id: 'with_back', label: 'With backrest' },
  { id: 'no_back', label: 'No backrest' },
  { id: 'low', label: 'Low chair' },
  { id: 'high', label: 'High chair' },
];

const DEFAULT_BIG_SCREEN: PropDimensions = {
  width: BIG_SCREEN_LIMITS.width.default,
  height: BIG_SCREEN_LIMITS.height.default,
  depth: BIG_SCREEN_DEPTH,
};

const DEFAULT_BOX: PropDimensions = {
  width: BOX_LIMITS.width.default,
  height: BOX_LIMITS.height.default,
  depth: BOX_LIMITS.depth.default,
};

export function getDefaultPropDimensions(
  type: PropType,
  _chairVariant?: ChairVariant,
): PropDimensions | undefined {
  switch (type) {
    case 'big_screen':
      return { ...DEFAULT_BIG_SCREEN };
    case 'box':
      return { ...DEFAULT_BOX };
    default:
      return undefined;
  }
}

export function resolvePropDimensions(
  prop: Pick<import('../types').PlacedProp, 'type' | 'dimensions' | 'chairVariant'>,
): PropDimensions | undefined {
  if (prop.dimensions) return prop.dimensions;
  return getDefaultPropDimensions(prop.type, prop.chairVariant);
}

export function usesCustomDimensions(type: PropType): boolean {
  return type === 'big_screen' || type === 'box';
}

export function clampBigScreenDimension(
  key: 'width' | 'height',
  value: number,
): number {
  const limits = BIG_SCREEN_LIMITS[key];
  if (!Number.isFinite(value)) return limits.default;
  return Math.min(limits.max, Math.max(limits.min, value));
}

export function clampBoxDimension(
  key: keyof PropDimensions,
  value: number,
): number {
  const limits = BOX_LIMITS[key];
  if (!Number.isFinite(value)) return limits.default;
  return Math.min(limits.max, Math.max(limits.min, value));
}
