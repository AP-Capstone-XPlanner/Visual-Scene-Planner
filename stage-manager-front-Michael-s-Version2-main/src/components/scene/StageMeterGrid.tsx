import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { STAGE_GRID_LINE_COLORS } from '../../constants/stage';
import { useStageStore } from '../../store/stageStore';

const SPACING = 1;

/**
 * 1 m area reference lines on the deck — visual only, does not change deck material.
 * Drawn above the textured plane; baseline renders on top (higher renderOrder).
 */
export function StageMeterGrid() {
  const showStageAreaGrid = useStageStore((s) => s.showStageAreaGrid);
  const { length, width, height } = useStageStore((s) => s.stage);
  const texture = useStageStore((s) => s.stageTexture);
  const colors = STAGE_GRID_LINE_COLORS[texture];

  const lines = useMemo(() => {
    const y = height + 0.007;
    const halfLength = length / 2;
    const halfWidth = width / 2;
    const items: [number, number, number][][] = [];

    for (let z = -halfWidth; z <= halfWidth + 0.001; z += SPACING) {
      items.push([
        [-halfLength, y, z],
        [halfLength, y, z],
      ]);
    }

    for (let x = -halfLength; x <= halfLength + 0.001; x += SPACING) {
      items.push([
        [x, y, -halfWidth],
        [x, y, halfWidth],
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
