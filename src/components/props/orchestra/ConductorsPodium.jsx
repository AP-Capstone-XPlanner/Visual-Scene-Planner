export default function ConductorsPodium() {
  return (
    <group>
      <mesh position={[0, 0.10, 0]} castShadow receiveShadow><boxGeometry args={[1.0, 0.20, 1.0]} /><meshStandardMaterial color="#1a1a1a" roughness={0.7} /></mesh>
      <mesh position={[0, 0.205, 0]} castShadow receiveShadow><boxGeometry args={[0.98, 0.01, 0.98]} /><meshStandardMaterial color="#7f8c8d" roughness={0.9} /></mesh>
      <group position={[0, 0.20, -0.45]}>
        <mesh position={[-0.36, 0.5, 0]} castShadow><cylinderGeometry args={[0.0175, 0.0175, 1.0]} /><meshStandardMaterial color="#222" metalness={0.5} roughness={0.4} /></mesh>
        <mesh position={[0.36, 0.5, 0]} castShadow><cylinderGeometry args={[0.0175, 0.0175, 1.0]} /><meshStandardMaterial color="#222" metalness={0.5} roughness={0.4} /></mesh>
        <mesh position={[0, 1.0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.0175, 0.0175, 0.72]} /><meshStandardMaterial color="#222" metalness={0.5} roughness={0.4} /></mesh>
        <mesh position={[0, 0.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.012, 0.012, 0.72]} /><meshStandardMaterial color="#222" metalness={0.5} roughness={0.4} /></mesh>
      </group>
    </group>
  )
}
