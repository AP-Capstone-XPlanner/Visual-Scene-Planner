import { Line } from '@react-three/drei';
import { CENTER_BASELINE_COLOR } from '../../constants/stage.js';
import { useStageStore } from '../../store/stageStore.js';
import { getStageHalfExtents } from '../../utils/stageAxes.js';

/** Center cross baseline — fixed cyan, always above area grid when enabled. */
export function StageGuides() {
  const showStageBaseline = useStageStore((s) => s.showStageBaseline);
  const { length, width, height } = useStageStore((s) => s.stage);

  if (!showStageBaseline) return null;

  const { halfX, halfZ } = getStageHalfExtents(length, width);
  const y = height + 0.014;

  return (
    <group renderOrder={10}>
      <Line
        points={[
          [0, y, -halfZ],
          [0, y, halfZ],
        ]}
        color={CENTER_BASELINE_COLOR}
        lineWidth={2}
        transparent
        opacity={0.95}
        depthWrite={false}
        depthTest={false}
      />
      <Line
        points={[
          [-halfX, y, 0],
          [halfX, y, 0],
        ]}
        color={CENTER_BASELINE_COLOR}
        lineWidth={2}
        transparent
        opacity={0.95}
        depthWrite={false}
        depthTest={false}
      />
    </group>
  );
}
