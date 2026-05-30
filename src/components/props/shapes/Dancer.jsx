export default function Dancer() {
  return (
    <mesh position={[0, 0.85, 0]} castShadow>
      <cylinderGeometry args={[0.25, 0.25, 1.7, 32]} />
      <meshStandardMaterial color="#87CEEB" />
    </mesh>
  );
}
