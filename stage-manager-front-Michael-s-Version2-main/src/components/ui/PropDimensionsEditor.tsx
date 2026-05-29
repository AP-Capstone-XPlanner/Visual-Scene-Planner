import {
  BIG_SCREEN_DEPTH,
  BIG_SCREEN_LIMITS,
  BOX_LIMITS,
} from '../../constants/propDimensions';
import type { PlacedProp, PropDimensions } from '../../types';
import { DimensionControl } from './DimensionControl';

export function PropDimensionsEditor({
  prop,
  onChange,
  compact = false,
  slim = false,
}: {
  prop: PlacedProp;
  onChange: (key: keyof PropDimensions, value: number) => void;
  compact?: boolean;
  /** Slider + number (selected panel) */
  slim?: boolean;
}) {
  const dims = prop.dimensions!;
  const wrapClass = slim
    ? 'prop-dims-slim'
    : compact
      ? 'prop-dims-compact'
      : undefined;
  const useCompact = compact && !slim;

  if (prop.type === 'big_screen') {
    return (
      <div className={wrapClass}>
        <DimensionControl
          label={slim || compact ? 'W' : 'Screen width'}
          value={dims.width}
          min={BIG_SCREEN_LIMITS.width.min}
          max={BIG_SCREEN_LIMITS.width.max}
          step={BIG_SCREEN_LIMITS.width.step}
          unit="m"
          compact={useCompact}
          slim={slim}
          onChange={(v) => onChange('width', v)}
        />
        <DimensionControl
          label={slim || compact ? 'H' : 'Screen height'}
          value={dims.height}
          min={BIG_SCREEN_LIMITS.height.min}
          max={BIG_SCREEN_LIMITS.height.max}
          step={BIG_SCREEN_LIMITS.height.step}
          unit="m"
          compact={useCompact}
          slim={slim}
          onChange={(v) => onChange('height', v)}
        />
        {!compact && !slim && (
          <p className="panel-hint">
            Panel thickness fixed at {BIG_SCREEN_DEPTH} m.
          </p>
        )}
      </div>
    );
  }

  if (prop.type === 'box') {
    return (
      <div className={wrapClass}>
        <DimensionControl
          label="Length (X)"
          value={dims.width}
          min={BOX_LIMITS.width.min}
          max={BOX_LIMITS.width.max}
          step={BOX_LIMITS.width.step}
          unit="m"
          compact={useCompact}
          slim={slim}
          onChange={(v) => onChange('width', v)}
        />
        <DimensionControl
          label="Height (Y)"
          value={dims.height}
          min={BOX_LIMITS.height.min}
          max={BOX_LIMITS.height.max}
          step={BOX_LIMITS.height.step}
          unit="m"
          compact={useCompact}
          slim={slim}
          onChange={(v) => onChange('height', v)}
        />
        <DimensionControl
          label="Depth (Z)"
          value={dims.depth}
          min={BOX_LIMITS.depth.min}
          max={BOX_LIMITS.depth.max}
          step={BOX_LIMITS.depth.step}
          unit="m"
          compact={useCompact}
          slim={slim}
          onChange={(v) => onChange('depth', v)}
        />
      </div>
    );
  }

  return null;
}
