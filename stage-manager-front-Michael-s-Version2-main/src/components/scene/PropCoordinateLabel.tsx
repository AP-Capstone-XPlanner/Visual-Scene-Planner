import { Html } from '@react-three/drei';
import { heightAboveStage, rotationDisplayDegrees } from '../../utils/propPosition';
import { useStageStore } from '../../store/stageStore';
import type { PlacedProp } from '../../types';

export function PropCoordinateLabel({ prop }: { prop: PlacedProp }) {
  const [x, y, z] = prop.position;
  const stageTopY = useStageStore((s) => s.stage.height);
  const lift = heightAboveStage(y, stageTopY);
  const rotationDeg = rotationDisplayDegrees(prop.rotation);

  return (
    <Html
      position={[0, 1.2, 0]}
      center
      distanceFactor={12}
      style={{ pointerEvents: 'none' }}
    >
      <div className="prop-coord-label">
        {prop.tag.trim() && <span className="prop-coord-tag">{prop.tag.trim()}</span>}
        <span>
          X {x.toFixed(2)} · Y {lift.toFixed(2)} m up · Z {z.toFixed(2)} m
        </span>
        <span>
          {rotationDeg.toFixed(0)} deg · {(prop.scale * 100).toFixed(0)}% · {prop.color}
        </span>
        {!prop.visible && <span className="prop-coord-hidden">Hidden</span>}
      </div>
    </Html>
  );
}
