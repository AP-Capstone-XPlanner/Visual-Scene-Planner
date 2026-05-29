import { DEFAULT_SKY_COLOR } from '../../constants/stage';
import { EnvironmentColorPicker } from './EnvironmentColorPicker';

export function SkyColorPicker({
  color,
  onChange,
}: {
  color: string;
  onChange: (color: string) => void;
}) {
  return (
    <EnvironmentColorPicker
      label="Sky"
      color={color}
      defaultColor={DEFAULT_SKY_COLOR}
      onChange={onChange}
    />
  );
}
