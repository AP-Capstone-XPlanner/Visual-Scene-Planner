import { DEFAULT_GROUND_COLOR } from '../../constants/stage';
import { EnvironmentColorPicker } from './EnvironmentColorPicker';

export function GroundColorPicker({
  color,
  onChange,
}: {
  color: string;
  onChange: (color: string) => void;
}) {
  return (
    <EnvironmentColorPicker
      label="Ground (floor)"
      color={color}
      defaultColor={DEFAULT_GROUND_COLOR}
      onChange={onChange}
    />
  );
}
