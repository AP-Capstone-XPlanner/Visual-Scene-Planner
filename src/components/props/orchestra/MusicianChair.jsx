export default function MusicianChair() {
  return (
    <group>
      <mesh position={[-0.19, 0.23, -0.19]} castShadow><cylinderGeometry args={[0.01, 0.01, 0.46]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[0.19, 0.23, -0.19]} castShadow><cylinderGeometry args={[0.01, 0.01, 0.46]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[-0.19, 0.23, 0.19]} castShadow><cylinderGeometry args={[0.01, 0.01, 0.46]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[0.19, 0.23, 0.19]} castShadow><cylinderGeometry args={[0.01, 0.01, 0.46]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[0, 0.46, 0]} castShadow receiveShadow><boxGeometry args={[0.43, 0.05, 0.43]} /><meshStandardMaterial color="#222" roughness={0.8} /></mesh>
      <mesh position={[-0.19, 0.70, -0.19]} castShadow><cylinderGeometry args={[0.01, 0.01, 0.5]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[0.19, 0.70, -0.19]} castShadow><cylinderGeometry args={[0.01, 0.01, 0.5]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[0, 0.85, -0.19]} castShadow><boxGeometry args={[0.40, 0.20, 0.04]} /><meshStandardMaterial color="#222" roughness={0.8} /></mesh>
    </group>
  )
}
