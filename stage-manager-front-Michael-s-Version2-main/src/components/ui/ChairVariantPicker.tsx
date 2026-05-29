import { CHAIR_VARIANT_OPTIONS } from '../../constants/propDimensions';
import type { ChairVariant } from '../../types';

export function ChairVariantPicker({
  value,
  onChange,
}: {
  value: ChairVariant;
  onChange: (variant: ChairVariant) => void;
}) {
  return (
    <div className="chair-variant-picker">
      <span className="chair-variant-label">Chair type</span>
      <div className="chair-variant-grid">
        {CHAIR_VARIANT_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`chair-variant-btn ${value === opt.id ? 'active' : ''}`}
            onClick={() => onChange(opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
