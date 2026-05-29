import { GRID_SNAP } from '../constants/props';

export function snapValue(value: number, enabled: boolean, step = GRID_SNAP): number {
  if (!enabled) return value;
  return Math.round(value / step) * step;
}
