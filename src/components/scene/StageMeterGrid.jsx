import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { STAGE_GUIDE_PALETTES } from '../../constants/stage.js';
import { useStageStore } from '../../store/stageStore.js';
import { getStageHalfExtents } from '../../utils/stageAxes.js';

const SPACING = 1;

export function StageMeterGrid() {
  const showStageAreaGrid = useStageStore((s) => s.showStageAreaGrid);
  const { length, width, height } = useStageStore((s) => s.stage);
  const texture = useStageStore((s) => s.stageTexture);
  const colors = STAGE_GUIDE_PALETTES[texture].grid;

  const lines = useMemo(() => {
    const y = height + 0.007;
    const { halfX, halfZ } = getStageHalfExtents(length, width);
    const items = [];

    for (let z = -halfZ; z <= halfZ + 0.001; z += SPACING) {
      items.push([
        [-halfX, y, z],
        [halfX, y, z],
      ]);
    }

    for (let x = -halfX; x <= halfX + 0.001; x += SPACING) {
      items.push([
        [x, y, -halfZ],
        [x, y, halfZ],
      ]);
    }

    return items;
  }, [length, width, height]);

  if (!showStageAreaGrid || lines.length === 0) return null;

  return (
    <group renderOrder={5}>
      {lines.map((points, index) => (
        <Line
          key={index}
          points={points}
          color={colors.line}
          lineWidth={colors.lineWidth}
          transparent
          opacity={colors.opacity}
          depthWrite={false}
        />
      ))}
    </group>
  );
}
