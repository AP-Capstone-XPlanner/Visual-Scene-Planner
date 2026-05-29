import { DEFAULT_GROUND_COLOR } from '../../constants/stage.js';
import { EnvironmentColorPicker } from './EnvironmentColorPicker.jsx';

export function GroundColorPicker({ color, onChange }) {
  return (
    <EnvironmentColorPicker label="Ground (floor)" color={color} defaultColor={DEFAULT_GROUND_COLOR} onChange={onChange} />
  );
}
