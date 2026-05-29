import { useStageStore } from '../../store/stageStore';

export function SceneFloor() {
  const groundColor = useStageStore((s) => s.groundColor);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[200, 200]} />
      <meshStandardMaterial color={groundColor} roughness={1} />
    </mesh>
  );
}
