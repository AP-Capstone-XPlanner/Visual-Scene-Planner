import { useEffect } from 'react';
import { isTextInput } from '../utils/keyboard';
import { KEYBOARD_MOVE_STEP, KEYBOARD_MOVE_STEP_FAST } from '../utils/propPosition';
import { useStageStore } from '../store/stageStore';

function isEscapeKey(event: KeyboardEvent): boolean {
  return event.key === 'Escape' || event.code === 'Escape';
}

export function useKeyboardShortcuts() {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isEscapeKey(event)) {
        const inTextInput = isTextInput(event.target);
        if (inTextInput && event.target instanceof HTMLElement) {
          event.target.blur();
        }

        const handled = useStageStore.getState().handleEscapeKey({
          fromTextInput: inTextInput,
        });
        if (handled) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
        return;
      }

      if (isTextInput(event.target)) return;

      const state = useStageStore.getState();
      const { selectedPropId } = state;

      if (!selectedPropId) return;

      const step = event.shiftKey ? KEYBOARD_MOVE_STEP_FAST : KEYBOARD_MOVE_STEP;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          state.moveSelectedProp(-step, 0);
          break;
        case 'ArrowRight':
          event.preventDefault();
          state.moveSelectedProp(step, 0);
          break;
        case 'ArrowUp':
          event.preventDefault();
          state.moveSelectedProp(0, -step);
          break;
        case 'ArrowDown':
          event.preventDefault();
          state.moveSelectedProp(0, step);
          break;
        case 'PageUp':
          event.preventDefault();
          state.moveSelectedPropVertical(step);
          break;
        case 'PageDown':
          event.preventDefault();
          state.moveSelectedPropVertical(-step);
          break;
        case 'Backspace':
          event.preventDefault();
          state.deleteSelectedProp();
          break;
        case 'h':
        case 'H':
          event.preventDefault();
          state.togglePropVisibility();
          break;
        case '[':
          event.preventDefault();
          state.setSelectedPropScale(
            (state.props.find((p) => p.id === selectedPropId)?.scale ?? 1) - 0.1,
          );
          break;
        case ']':
          event.preventDefault();
          state.setSelectedPropScale(
            (state.props.find((p) => p.id === selectedPropId)?.scale ?? 1) + 0.1,
          );
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, []);
}
