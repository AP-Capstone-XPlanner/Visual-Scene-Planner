import { isTextInput } from './keyboard.js';
import { KEYBOARD_MOVE_STEP, KEYBOARD_MOVE_STEP_FAST } from './propPosition.js';
import { useStageStore } from '../store/stageStore.js';

const processedEvents = new WeakSet();

function isEscapeKey(event) {
  return event.key === 'Escape' || event.code === 'Escape';
}

function isDeleteKey(event) {
  return (
    event.key === 'Backspace' ||
    event.code === 'Backspace' ||
    event.key === 'Delete' ||
    event.code === 'Delete'
  );
}

function isMetaChord(event) {
  return event.metaKey || event.ctrlKey;
}

/** Global keydown handler (attach with capture on `window` / `document` / canvas). */
export function handleGlobalKeyDown(event) {
  if (processedEvents.has(event)) return;
  processedEvents.add(event);

  if (isEscapeKey(event)) {
    const target = event.target;
    const blurredTextInput =
      isTextInput(target) && target instanceof HTMLElement;
    if (blurredTextInput) {
      target.blur();
    }

    const handled = useStageStore.getState().handleEscapeKey({
      fromTextInput: blurredTextInput
        ? false
        : isTextInput(document.activeElement),
    });
    if (handled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
    return;
  }

  if (isTextInput(event.target)) return;

  const state = useStageStore.getState();

  if (isMetaChord(event)) {
    const key = event.key.toLowerCase();
    if (key === 'c' && state.selectedPropId) {
      event.preventDefault();
      state.copySelectedProp();
      return;
    }
    if (key === 'v' && state.clipboardDraft) {
      event.preventDefault();
      state.pasteProp();
      return;
    }
  }

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
    default:
      if (isDeleteKey(event)) {
        event.preventDefault();
        state.deleteSelectedProp();
      } else if (event.key === 'h' || event.key === 'H') {
        event.preventDefault();
        state.togglePropVisibility();
      } else if (event.key === '[') {
        event.preventDefault();
        state.setSelectedPropScale(
          (state.props.find((p) => p.id === selectedPropId)?.scale ?? 1) - 0.1,
        );
      } else if (event.key === ']') {
        event.preventDefault();
        state.setSelectedPropScale(
          (state.props.find((p) => p.id === selectedPropId)?.scale ?? 1) + 0.1,
        );
      }
      break;
  }
}
