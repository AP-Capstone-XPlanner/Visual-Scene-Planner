import {
  DEFAULT_STAGE_ENCLOSURE_COLOR,
  STAGE_ENCLOSURE_OPACITY_LIMITS,
} from '../../constants/stage.js';
import { useStageStore } from '../../store/stageStore.js';
import { EnvironmentColorPicker } from './EnvironmentColorPicker.jsx';
import { DimensionControl } from './DimensionControl.jsx';

export function StageEnclosurePicker() {
  const color = useStageStore((s) => s.stageEnclosureColor);
  const opacity = useStageStore((s) => s.stageEnclosureOpacity);
  const setColor = useStageStore((s) => s.setStageEnclosureColor);
  const setOpacity = useStageStore((s) => s.setStageEnclosureOpacity);

  const opacityMinPct = STAGE_ENCLOSURE_OPACITY_LIMITS.min * 100;
  const opacityMaxPct = STAGE_ENCLOSURE_OPACITY_LIMITS.max * 100;

  return (
    <div className="stage-enclosure-picker">
      <EnvironmentColorPicker
        label="Enclosure color"
        color={color}
        defaultColor={DEFAULT_STAGE_ENCLOSURE_COLOR}
        onChange={setColor}
      />
      <DimensionControl
        label="Enclosure opacity"
        value={opacity * 100}
        min={opacityMinPct}
        max={opacityMaxPct}
        step={5}
        inputStep={1}
        unit="%"
        onChange={(v) => setOpacity(v / 100)}
      />
    </div>
  );
}
