import { useLayoutEffect, useMemo } from 'react';
import { Edges } from '@react-three/drei';
import { STAGE_SURFACE_COLORS } from '../../constants/stage';
import {
  applyStageDeckTextureRepeat,
  getStageDeckTexture,
} from '../../utils/proceduralTextures';
import { useStageStore } from '../../store/stageStore';
import { StageMeterGrid } from './StageMeterGrid';

export function StagePlatform() {
  const { length, width, height } = useStageStore((s) => s.stage);
  const texture = useStageStore((s) => s.stageTexture);
  const surface = STAGE_SURFACE_COLORS[texture];
  const topY = height;

  const deckMap = useMemo(() => getStageDeckTexture(texture), [texture]);

  useLayoutEffect(() => {
    applyStageDeckTextureRepeat(deckMap, length, width);
  }, [deckMap, length, width]);

  return (
    <group>
      <mesh position={[0, height / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[length, height, width]} />
        <meshStandardMaterial
          color={surface.body}
          roughness={surface.roughness}
          metalness={surface.metalness}
        />
        <Edges color={surface.edge} threshold={15} />
      </mesh>
      <mesh
        position={[0, topY + 0.004, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        renderOrder={1}
      >
        <planeGeometry args={[length, width]} />
        <meshStandardMaterial
          map={deckMap}
          color="#ffffff"
          roughness={surface.roughness}
          metalness={surface.metalness}
        />
      </mesh>
      <StageMeterGrid />
    </group>
  );
}

export function useStageTopY(): number {
  return useStageStore((s) => s.stage.height);
}

export function useStageBounds() {
  const { length, width } = useStageStore((s) => s.stage);
  return { halfLength: length / 2, halfWidth: width / 2 };
}
