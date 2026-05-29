import { GRID_SNAP } from '../constants/props.js';

export function snapValue(value, enabled, step = GRID_SNAP) {
  if (!enabled) return value;
  return Math.round(value / step) * step;
}
