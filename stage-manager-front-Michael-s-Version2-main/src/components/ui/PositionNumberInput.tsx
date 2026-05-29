import { useEffect, useState } from 'react';

export function PositionNumberInput({
  label,
  value,
  min,
  max,
  onCommit,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onCommit: (value: number) => void;
}) {
  const [text, setText] = useState(() => value.toFixed(2));

  useEffect(() => {
    setText(value.toFixed(2));
  }, [value]);

  const commit = () => {
    const parsed = parseFloat(text);
    onCommit(Number.isFinite(parsed) ? parsed : value);
    setText((Number.isFinite(parsed) ? parsed : value).toFixed(2));
  };

  return (
    <label className="position-field">
      <span>{label}</span>
      <input
        type="number"
        step={0.01}
        min={min}
        max={max}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            commit();
          }
        }}
      />
    </label>
  );
}
