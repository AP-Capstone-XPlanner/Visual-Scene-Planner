export default function MusicStand() {
  return (
    <group>
      <mesh position={[0, 0.5, 0]} castShadow><cylinderGeometry args={[0.01, 0.015, 1.0]} /><meshStandardMaterial color="#111" metalness={0.6} /></mesh>
      <mesh position={[0, 0.05, 0]} rotation={[0, 0, 0]} castShadow><boxGeometry args={[0.02, 0.02, 0.4]} /><meshStandardMaterial color="#111" metalness={0.6} /></mesh>
      <mesh position={[0, 0.05, 0]} rotation={[0, Math.PI / 3, 0]} castShadow><boxGeometry args={[0.02, 0.02, 0.4]} /><meshStandardMaterial color="#111" metalness={0.6} /></mesh>
      <mesh position={[0, 0.05, 0]} rotation={[0, -Math.PI / 3, 0]} castShadow><boxGeometry args={[0.02, 0.02, 0.4]} /><meshStandardMaterial color="#111" metalness={0.6} /></mesh>
      <group position={[0, 1.0, 0]} rotation={[-0.3, 0, 0]}>
        <mesh position={[0, 0.15, 0]} castShadow><boxGeometry args={[0.51, 0.305, 0.005]} /><meshStandardMaterial color="#222" roughness={0.7} /></mesh>
        <mesh position={[0, 0, 0.02]} castShadow><boxGeometry args={[0.51, 0.02, 0.04]} /><meshStandardMaterial color="#222" roughness={0.7} /></mesh>
      </group>
    </group>
  )
}
