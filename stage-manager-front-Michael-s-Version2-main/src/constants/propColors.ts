import type { PropType } from '../types';

export const DEFAULT_PROP_COLORS: Record<PropType, string> = {
  big_screen: '#334155',
  screen: '#475569',
  table: '#78716c',
  chair: '#78716c',
  stairs: '#64748b',
  platform: '#57534e',
  square: '#0ea5e9',
  circle: '#8b5cf6',
  box: '#64748b',
};

/** Preset swatches for prop color (selected panel + future pickers). */
export const COLOR_PRESETS = [
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#eab308',
  '#84cc16',
  '#22c55e',
  '#14b8a6',
  '#06b6d4',
  '#0ea5e9',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#d946ef',
  '#ec4899',
  '#f43f5e',
  '#b91c1c',
  '#c2410c',
  '#a16207',
  '#854d0e',
  '#78716c',
  '#57534e',
  '#44403c',
  '#64748b',
  '#334155',
  '#1e293b',
  '#0f172a',
  '#000000',
  '#f8fafc',
  '#ffffff',
  '#fecaca',
  '#fef08a',
  '#bbf7d0',
  '#bae6fd',
  '#e9d5ff',
] as const;

export function getDefaultPropColor(type: PropType): string {
  return DEFAULT_PROP_COLORS[type];
}
