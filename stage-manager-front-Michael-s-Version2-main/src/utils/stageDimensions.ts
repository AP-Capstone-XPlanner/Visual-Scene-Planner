import { STAGE_LIMITS } from '../constants/props';
import type { StageDimensions } from '../types';

export function clampStageDimension(
  key: keyof StageDimensions,
  value: number,
): number {
  const limits = STAGE_LIMITS[key];
  if (!Number.isFinite(value)) return limits.min;
  return Math.min(limits.max, Math.max(limits.min, value));
}
