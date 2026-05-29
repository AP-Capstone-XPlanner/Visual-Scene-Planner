import type { PropType } from '../types';

export interface PropCatalogItem {
  type: PropType;
  label: string;
  description: string;
  icon: string;
}

export const PROP_CATALOG: PropCatalogItem[] = [
  {
    type: 'big_screen',
    label: 'Big Screen',
    description: 'Flat display panel (adjustable width & height)',
    icon: '🖥️',
  },
  {
    type: 'box',
    label: 'Box',
    description: 'Rectangular volume (L × W × H)',
    icon: '📦',
  },
  {
    type: 'screen',
    label: 'Monitor',
    description: 'Smaller display or confidence monitor',
    icon: '📺',
  },
  {
    type: 'table',
    label: 'Table',
    description: 'Stage table or desk',
    icon: '🧰',
  },
  {
    type: 'platform',
    label: 'Platform',
    description: 'Raised platform or riser block',
    icon: '🟫',
  },
  {
    type: 'square',
    label: 'Square',
    description: 'Square zone marker on stage',
    icon: '⬜',
  },
  {
    type: 'circle',
    label: 'Circle',
    description: 'Circular zone marker on stage',
    icon: '⭕',
  },
  {
    type: 'chair',
    label: 'Chair',
    description: 'Seating for performers or crew',
    icon: '💺',
  },
  {
    type: 'stairs',
    label: 'Stairs',
    description: 'Stage access stairs',
    icon: '🪜',
  },
];

export const GRID_SNAP = 0.25;

export const STAGE_LIMITS = {
  length: { min: 4, max: 40 },
  width: { min: 4, max: 40 },
  height: { min: 0, max: 3 },
};

export const PROP_SCALE_LIMITS = {
  min: 0.25,
  max: 30,
  step: 0.05,
  default: 1,
};

export const PROP_TAG_MAX_LENGTH = 48;
