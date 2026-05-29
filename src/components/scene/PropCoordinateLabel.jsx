import { Html } from '@react-three/drei';
import {
  PROP_COORD_Y_ABOVE_MARKER,
  PROP_COORD_Y_ABOVE_TAG,
} from '../../constants/propLabels.js';
import { heightAboveStage, rotationDisplayDegrees } from '../../utils/propPosition.js';
import { useStageStore } from '../../store/stageStore.js';

export function PropCoordinateLabel({ prop }) {
  const [x, y, z] = prop.position;
  const stageTopY = useStageStore((s) => s.stage.height);
  const lift = heightAboveStage(y, stageTopY);
  const rotationDeg = rotationDisplayDegrees(prop.rotation);
  const hasTag = Boolean(prop.tag.trim());
  const positionY = hasTag ? PROP_COORD_Y_ABOVE_TAG : PROP_COORD_Y_ABOVE_MARKER;

  return (
    <Html
      position={[0, positionY, 0]}
      center
      distanceFactor={12}
      zIndexRange={[200, 0]}
      style={{ pointerEvents: 'none' }}
    >
      <div className="prop-coord-label">
        <span>
          X {x.toFixed(2)} · Y {lift.toFixed(2)} m up · Z {z.toFixed(2)} m
        </span>
        <span>
          Rot {rotationDeg}° · Scl {prop.scale.toFixed(1)}×
        </span>
      </div>
    </Html>
  );
}
