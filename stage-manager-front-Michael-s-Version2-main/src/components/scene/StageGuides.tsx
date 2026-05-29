import { Line } from '@react-three/drei';
import { useStageStore } from '../../store/stageStore';

const CENTER_LINE_COLOR = '#38bdf8';

/** Center cross baseline — always renders above area grid when enabled. */
export function StageGuides() {
  const showStageBaseline = useStageStore((s) => s.showStageBaseline);
  const { length, width, height } = useStageStore((s) => s.stage);

  if (!showStageBaseline) return null;

  const y = height + 0.014;
  const halfLength = length / 2;
  const halfWidth = width / 2;

  return (
    <group renderOrder={10}>
      <Line
        points={[
          [-halfLength, y, 0],
          [halfLength, y, 0],
        ]}
        color={CENTER_LINE_COLOR}
        lineWidth={2}
        transparent
        opacity={0.95}
        depthWrite={false}
      />
      <Line
        points={[
          [0, y, -halfWidth],
          [0, y, halfWidth],
        ]}
        color={CENTER_LINE_COLOR}
        lineWidth={2}
        transparent
        opacity={0.95}
        depthWrite={false}
      />
    </group>
  );
}
