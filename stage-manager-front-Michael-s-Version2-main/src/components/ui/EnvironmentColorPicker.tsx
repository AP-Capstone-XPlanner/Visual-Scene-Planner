import { ENVIRONMENT_COLOR_PRESETS } from '../../constants/stage';
import { normalizeHexColor } from '../../utils/color';

interface EnvironmentColorPickerProps {
  label: string;
  color: string;
  defaultColor: string;
  onChange: (color: string) => void;
}

export function EnvironmentColorPicker({
  label,
  color,
  defaultColor,
  onChange,
}: EnvironmentColorPickerProps) {
  const apply = (value: string) =>
    onChange(normalizeHexColor(value, defaultColor));

  return (
    <div className="color-picker">
      <span className="color-picker-heading">{label}</span>
      <div className="color-presets">
        {ENVIRONMENT_COLOR_PRESETS.map((preset) => (
          <button
            key={preset.hex}
            type="button"
            className={`color-swatch ${color.toLowerCase() === preset.hex ? 'active' : ''}`}
            style={{ background: preset.hex }}
            title={`${preset.label} (${preset.hex})`}
            aria-label={`${label} preset ${preset.label}`}
            onClick={() => apply(preset.hex)}
          />
        ))}
        <button
          type="button"
          className="color-swatch reset"
          title="Reset"
          aria-label={`Reset ${label}`}
          onClick={() => apply(defaultColor)}
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
            aria-label={`${label} color palette`}
            title="调色盘"
          />
          <input
            type="text"
            className="color-hex-input"
            value={color}
            maxLength={7}
            onChange={(e) => apply(e.target.value)}
            spellCheck={false}
            aria-label={`${label} hex color`}
          />
        </div>
      </div>
    </div>
  );
}
