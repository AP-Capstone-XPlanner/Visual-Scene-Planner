import { useEffect } from 'react';
import { handleGlobalKeyDown } from '../utils/globalKeyboard.js';

function attachKeyboardListeners() {
  const opts = { capture: true };
  window.addEventListener('keydown', handleGlobalKeyDown, opts);
  document.addEventListener('keydown', handleGlobalKeyDown, opts);
  return () => {
    window.removeEventListener('keydown', handleGlobalKeyDown, opts);
    document.removeEventListener('keydown', handleGlobalKeyDown, opts);
  };
}

export function useKeyboardShortcuts() {
  useEffect(() => attachKeyboardListeners(), []);
}
