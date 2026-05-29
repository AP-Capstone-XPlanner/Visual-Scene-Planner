import { PROP_SCALE_LIMITS } from '../constants/props.js';
import { getDefaultPropInteractionState } from '../constants/propCatalogSpecs.js';
import { getDefaultPropColor } from '../constants/propColors.js';
import { normalizeHexColor } from './color.js';

export const DEFAULT_PROP_SCALE = PROP_SCALE_LIMITS.default;

export function propToPlacementDraft(prop) {
  return {
    type: prop.type,
    rotation: prop.rotation,
    scale: prop.scale,
    visible: prop.visible,
    color: prop.color,
    ...(prop.interactionState
      ? { interactionState: structuredClone(prop.interactionState) }
      : {}),
  };
}

export function createNewProp(partial) {
  const interactionState =
    partial.interactionState ?? getDefaultPropInteractionState(partial.type);

  return {
    type: partial.type,
    position: partial.position,
    rotation: partial.rotation,
    scale: partial.scale ?? DEFAULT_PROP_SCALE,
    visible: partial.visible ?? true,
    tag: partial.tag?.trim() ?? '',
    color: partial.color
      ? normalizeHexColor(partial.color, getDefaultPropColor(partial.type))
      : getDefaultPropColor(partial.type),
    ...(interactionState ? { interactionState } : {}),
  };
}

export function clampPropScale(scale) {
  return Math.min(
    PROP_SCALE_LIMITS.max,
    Math.max(PROP_SCALE_LIMITS.min, scale),
  );
}
