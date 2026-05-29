import { STAGE_TEXTURE_OPTIONS } from '../../constants/stage.js';

export function StageTexturePicker({ value, onChange }) {
  return (
    <div className="texture-picker">
      <span className="texture-picker-label">Stage material</span>
      <div className="texture-options">
        {STAGE_TEXTURE_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`texture-btn texture-btn--${opt.id} ${value === opt.id ? 'active' : ''}`}
            onClick={() => onChange(opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <p className="panel-hint">
        Center baseline is on by default; area grid is off (toggle below stage size).
      </p>
    </div>
  );
}
