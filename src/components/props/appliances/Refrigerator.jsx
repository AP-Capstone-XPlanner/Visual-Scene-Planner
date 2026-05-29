export default function Refrigerator() {
  return (
    <group position={[0, 1.825 / 2, 0]}>
      <mesh castShadow receiveShadow><boxGeometry args={[0.912, 1.825, 0.72]} /><meshStandardMaterial color="#7f8c8d" metalness={0.6} roughness={0.3} /></mesh>
      <mesh position={[-0.23, 0.4, 0.37]} castShadow><boxGeometry args={[0.44, 1.0, 0.04]} /><meshStandardMaterial color="#bdc3c7" metalness={0.7} roughness={0.2} /></mesh>
      <mesh position={[0.23, 0.4, 0.37]} castShadow><boxGeometry args={[0.44, 1.0, 0.04]} /><meshStandardMaterial color="#bdc3c7" metalness={0.7} roughness={0.2} /></mesh>
      <mesh position={[0, -0.5, 0.37]} castShadow><boxGeometry args={[0.90, 0.75, 0.04]} /><meshStandardMaterial color="#bdc3c7" metalness={0.7} roughness={0.2} /></mesh>
      <mesh position={[-0.23, 0.3, 0.39]} castShadow><boxGeometry args={[0.15, 0.25, 0.02]} /><meshStandardMaterial color="#2c3e50" /></mesh>
    </group>
  )
}
