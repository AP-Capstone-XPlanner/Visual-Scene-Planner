import { useEffect, useState } from 'react';

function decimalsForStep(step: number) {
  if (step >= 1) return 0;
  if (step >= 0.1) return 1;
  return 2;
}

export function DimensionControl({
  label,
  value,
  min,
  max,
  step,
  inputStep = step,
  unit,
  onChange,
  compact = false,
  slim = false,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  /** Step for the range slider */
  step: number;
  /** Step for the number input spinner arrows (defaults to `step`) */
  inputStep?: number;
  unit: string;
  onChange: (v: number) => void;
  /** Inline number only (no slider) for tight panels */
  compact?: boolean;
  /** Smaller slider + number input (selected panel scale props) */
  slim?: boolean;
}) {
  const decimals = decimalsForStep(inputStep);
  const [inputText, setInputText] = useState(() => value.toFixed(decimals));

  useEffect(() => {
    setInputText(value.toFixed(decimals));
  }, [value, decimals]);

  const commitInput = () => {
    const parsed = parseFloat(inputText);
    const next = Number.isFinite(parsed) ? parsed : value;
    const clamped = Math.min(max, Math.max(min, next));
    onChange(clamped);
    setInputText(clamped.toFixed(decimals));
  };

  if (compact) {
    return (
      <label className="dimension-control-compact">
        <span className="dimension-control-compact-label">{label}</span>
        <input
          type="number"
          className="dimension-number"
          min={min}
          max={max}
          step={inputStep}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onBlur={commitInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commitInput();
            }
          }}
        />
        <span className="dimension-control-compact-unit">{unit}</span>
      </label>
    );
  }

  return (
    <label className={`control-row ${slim ? 'control-row--slim' : ''}`}>
      <div className="control-label">
        <span>{label}</span>
        <span className="control-value">
          {value.toFixed(decimals)} {unit}
        </span>
      </div>
      <div className="dimension-input-row">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
        />
        <input
          type="number"
          className="dimension-number"
          min={min}
          max={max}
          step={inputStep}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onBlur={commitInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commitInput();
            }
          }}
        />
      </div>
    </label>
  );
}
