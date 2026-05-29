import { STAGE_LIMITS } from '../constants/props.js';

export function clampStageDimension(key, value) {
  const limits = STAGE_LIMITS[key];
  if (!Number.isFinite(value)) return limits.min;
  return Math.min(limits.max, Math.max(limits.min, value));
}
