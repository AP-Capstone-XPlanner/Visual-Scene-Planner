export function isTextInput(target) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.tagName === 'TEXTAREA') return true;
  if (target.tagName === 'INPUT') {
    const type = target.type;
    return ['text', 'number', 'search', 'email', 'password'].includes(type);
  }
  return target.isContentEditable;
}

export const CAMERA_CONTROL_KEYS = new Set([
  'w', 'a', 's', 'd', 'q', 'e', 'r', 'f', 'z', 'x',
]);
