export default function Microphones() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.02, 0]} castShadow><cylinderGeometry args={[0.16, 0.16, 0.04, 32]} /><meshStandardMaterial color="#1a1a1a" roughness={0.8} /></mesh>
      <mesh position={[0, 0.75, 0]} castShadow><cylinderGeometry args={[0.012, 0.015, 1.4, 16]} /><meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.5} /></mesh>
      <mesh position={[0, 1.0, 0]} castShadow><cylinderGeometry args={[0.02, 0.02, 0.06]} /><meshStandardMaterial color="#333" /></mesh>
      <mesh position={[0, 1.46, 0]} castShadow><sphereGeometry args={[0.015, 16, 16]} /><meshStandardMaterial color="#111" /></mesh>
      <group position={[0, 1.46, 0]} rotation={[0, 0, Math.PI / 4]}>
        <mesh position={[0, 0.03, 0]} castShadow><cylinderGeometry args={[0.015, 0.01, 0.06]} /><meshStandardMaterial color="#111" /></mesh>
        <mesh position={[0, 0.12, 0]} castShadow><cylinderGeometry args={[0.022, 0.018, 0.14]} /><meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.4} /></mesh>
        <mesh position={[0, 0.22, 0]} castShadow><sphereGeometry args={[0.038, 16, 16]} /><meshStandardMaterial color="#ccc" metalness={0.8} roughness={0.2} wireframe /></mesh>
        <mesh position={[0, 0.22, 0]} castShadow><sphereGeometry args={[0.036, 16, 16]} /><meshStandardMaterial color="#888" metalness={0.5} roughness={0.5} /></mesh>
      </group>
    </group>
  )
}
