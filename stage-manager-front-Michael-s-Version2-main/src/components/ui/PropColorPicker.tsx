import { COLOR_PRESETS, getDefaultPropColor } from '../../constants/propColors';
import type { PropType } from '../../types';
import { normalizeHexColor } from '../../utils/color';

interface PropColorPickerProps {
  color: string;
  propType: PropType;
  onChange: (color: string) => void;
  compact?: boolean;
}

export function PropColorPicker({
  color,
  propType,
  onChange,
  compact = false,
}: PropColorPickerProps) {
  const fallback = getDefaultPropColor(propType);
  const apply = (value: string) => onChange(normalizeHexColor(value, fallback));

  return (
    <div
      className={`color-picker ${compact ? 'color-picker--compact' : ''}`}
    >
      <span className="color-picker-heading">Color</span>
      <div className="color-presets">
        {COLOR_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            className={`color-swatch ${color.toLowerCase() === preset ? 'active' : ''}`}
            style={{ background: preset }}
            title={preset}
            aria-label={`Set color ${preset}`}
            onClick={() => apply(preset)}
          />
        ))}
        <button
          type="button"
          className="color-swatch reset"
          title="Reset to default"
          aria-label="Reset to default color"
          onClick={() => apply(fallback)}
        >
          ↺
        </button>
      </div>
      <div className="color-palette-section">
        <span className="color-palette-label">调色盘</span>
        <div className="color-palette-controls">
          <input
            type="color"
            value={color}
            onChange={(e) => apply(e.target.value)}
            aria-label="Prop color palette"
            title="调色盘"
          />
          <input
            type="text"
            className="color-hex-input"
            value={color}
            maxLength={7}
            onChange={(e) => apply(e.target.value)}
            spellCheck={false}
            aria-label="Prop hex color"
          />
        </div>
      </div>
    </div>
  );
}
