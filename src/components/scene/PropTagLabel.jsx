import { Html } from '@react-three/drei';
import { PROP_TAG_LABEL_Y } from '../../constants/propLabels.js';

export const PROP_SELECTION_MARKER_COLOR = '#ff4040';

export function PropTagLabel({ tag, selected = false, onSelect }) {
  const trimmed = tag.trim();
  if (!trimmed && !selected) return null;

  const clickable = Boolean(trimmed && onSelect);

  const handlePointer = (event) => {
    event.stopPropagation();
  };

  const handleClick = (event) => {
    event.stopPropagation();
    onSelect?.();
  };

  return (
    <Html
      position={[0, PROP_TAG_LABEL_Y, 0]}
      center
      distanceFactor={12}
      zIndexRange={[100, 0]}
      style={{ pointerEvents: clickable ? 'auto' : 'none' }}
      onPointerDown={clickable ? handlePointer : undefined}
      onClick={clickable ? handleClick : undefined}
    >
      <div className="prop-tag-label">
        {trimmed && (
          <span
            className={`prop-tag-pill ${clickable ? 'prop-tag-pill--clickable' : ''}`}
          >
            {trimmed}
          </span>
        )}
        {selected && (
          <span
            className="prop-tag-marker"
            style={{ background: PROP_SELECTION_MARKER_COLOR }}
          />
        )}
      </div>
    </Html>
  );
}
