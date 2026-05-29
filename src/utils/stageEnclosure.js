import {
  STAGE_ENCLOSURE_HEIGHT_LIMITS,
  STAGE_ENCLOSURE_OPACITY_LIMITS,
} from '../constants/stage.js';

export function clampStageEnclosureHeight(value) {
  const { min, max } = STAGE_ENCLOSURE_HEIGHT_LIMITS;
  if (!Number.isFinite(value)) return STAGE_ENCLOSURE_HEIGHT_LIMITS.default;
  return Math.min(max, Math.max(min, value));
}

export function clampStageEnclosureOpacity(value) {
  const { min, max } = STAGE_ENCLOSURE_OPACITY_LIMITS;
  if (!Number.isFinite(value)) return STAGE_ENCLOSURE_OPACITY_LIMITS.default;
  return Math.min(max, Math.max(min, value));
}
