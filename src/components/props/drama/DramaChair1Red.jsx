export default function DramaChair1Red() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[-0.24, 0.21, -0.23]} castShadow><cylinderGeometry args={[0.015, 0.01, 0.42]} /><meshStandardMaterial color="#333" /></mesh>
      <mesh position={[0.24, 0.21, -0.23]} castShadow><cylinderGeometry args={[0.015, 0.01, 0.42]} /><meshStandardMaterial color="#333" /></mesh>
      <mesh position={[-0.24, 0.21, 0.23]} castShadow><cylinderGeometry args={[0.015, 0.01, 0.42]} /><meshStandardMaterial color="#333" /></mesh>
      <mesh position={[0.24, 0.21, 0.23]} castShadow><cylinderGeometry args={[0.015, 0.01, 0.42]} /><meshStandardMaterial color="#333" /></mesh>
      <mesh position={[0, 0.43, 0]} castShadow><boxGeometry args={[0.55, 0.04, 0.53]} /><meshStandardMaterial color="#c0392b" roughness={0.7} /></mesh>
      <mesh position={[0, 0.65, -0.24]} castShadow><boxGeometry args={[0.55, 0.20, 0.04]} /><meshStandardMaterial color="#c0392b" roughness={0.7} /></mesh>
      <mesh position={[-0.24, 0.54, -0.24]} castShadow><boxGeometry args={[0.03, 0.20, 0.03]} /><meshStandardMaterial color="#333" /></mesh>
      <mesh position={[0.24, 0.54, -0.24]} castShadow><boxGeometry args={[0.03, 0.20, 0.03]} /><meshStandardMaterial color="#333" /></mesh>
    </group>
  )
}
