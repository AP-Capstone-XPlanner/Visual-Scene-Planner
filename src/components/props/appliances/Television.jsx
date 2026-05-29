export default function Television() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow><boxGeometry args={[1.8, 0.5, 0.5]} /><meshStandardMaterial color="#e0e0e0" roughness={0.1} /></mesh>
      <mesh position={[0, 0.525, 0]} castShadow><boxGeometry args={[0.4, 0.05, 0.2]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[0, 0.575, 0]} castShadow><cylinderGeometry args={[0.02, 0.02, 0.1]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[0, 0.975, 0]} castShadow><boxGeometry args={[1.11, 0.697, 0.05]} /><meshStandardMaterial color="#1a1a1a" /></mesh>
      <mesh position={[0, 0.975, 0.026]}><boxGeometry args={[1.08, 0.66, 0.001]} /><meshStandardMaterial color="#000" /></mesh>
    </group>
  )
}
