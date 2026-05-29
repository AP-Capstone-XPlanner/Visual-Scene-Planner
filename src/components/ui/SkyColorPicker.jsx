import { DEFAULT_SKY_COLOR } from '../../constants/stage.js';
import { EnvironmentColorPicker } from './EnvironmentColorPicker.jsx';

export function SkyColorPicker({ color, onChange }) {
  return (
    <EnvironmentColorPicker label="Sky" color={color} defaultColor={DEFAULT_SKY_COLOR} onChange={onChange} />
  );
}
