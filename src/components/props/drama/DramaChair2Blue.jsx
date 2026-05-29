export default function DramaChair2Blue() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[-0.22, 0.24, -0.23]} castShadow><boxGeometry args={[0.03, 0.48, 0.03]} /><meshStandardMaterial color="#d2b48c" /></mesh>
      <mesh position={[0.22, 0.24, -0.23]} castShadow><boxGeometry args={[0.03, 0.48, 0.03]} /><meshStandardMaterial color="#d2b48c" /></mesh>
      <mesh position={[-0.22, 0.24, 0.23]} castShadow><boxGeometry args={[0.03, 0.48, 0.03]} /><meshStandardMaterial color="#d2b48c" /></mesh>
      <mesh position={[0.22, 0.24, 0.23]} castShadow><boxGeometry args={[0.03, 0.48, 0.03]} /><meshStandardMaterial color="#d2b48c" /></mesh>
      <mesh position={[0, 0.48, 0]} castShadow><boxGeometry args={[0.50, 0.05, 0.52]} /><meshStandardMaterial color="#2980b9" roughness={0.8} /></mesh>
      <mesh position={[-0.22, 0.65, -0.23]} castShadow><boxGeometry args={[0.03, 0.35, 0.03]} /><meshStandardMaterial color="#d2b48c" /></mesh>
      <mesh position={[0.22, 0.65, -0.23]} castShadow><boxGeometry args={[0.03, 0.35, 0.03]} /><meshStandardMaterial color="#d2b48c" /></mesh>
      <mesh position={[0, 0.70, -0.22]} castShadow><boxGeometry args={[0.41, 0.25, 0.04]} /><meshStandardMaterial color="#2980b9" roughness={0.8} /></mesh>
    </group>
  )
}
