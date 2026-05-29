export default function Harp() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.05, 0]} castShadow><boxGeometry args={[0.42, 0.1, 0.31]} /><meshStandardMaterial color="#d2b48c" roughness={0.6} /></mesh>
      <mesh position={[-0.15, 0.02, 0.10]}><cylinderGeometry args={[0.03, 0.03, 0.04]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[0.15, 0.02, 0.10]}><cylinderGeometry args={[0.03, 0.03, 0.04]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[-0.15, 0.02, -0.10]}><cylinderGeometry args={[0.03, 0.03, 0.04]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[0.15, 0.02, -0.10]}><cylinderGeometry args={[0.03, 0.03, 0.04]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[0, 0.8, 0.18]} rotation={[0.05, 0, 0]} castShadow><cylinderGeometry args={[0.025, 0.035, 1.45, 16]} /><meshStandardMaterial color="#d2b48c" roughness={0.5} /></mesh>
      <mesh position={[0, 0.65, -0.15]} rotation={[-0.35, 0, 0]} castShadow><cylinderGeometry args={[0.05, 0.15, 1.3, 4]} /><meshStandardMaterial color="#b59975" roughness={0.6} /></mesh>
      <mesh position={[0, 1.35, -0.05]} rotation={[-0.3, 0, 0]} castShadow><boxGeometry args={[0.06, 0.1, 0.6]} /><meshStandardMaterial color="#d2b48c" roughness={0.5} /></mesh>
      {Array.from({ length: 15 }).map((_, i) => {
        const p = i / 14
        const topZ = 0.15 - (p * 0.4)
        const topY = 1.45 - (p * 0.2)
        const botZ = -0.10 - (p * 0.2)
        const botY = 0.10 + (p * 0.1)
        const height = Math.hypot(topY - botY, topZ - botZ)
        const angle = Math.atan2(botZ - topZ, botY - topY)
        return <mesh key={`hs-${i}`} position={[0, (topY + botY) / 2, (topZ + botZ) / 2]} rotation={[angle, 0, 0]}><cylinderGeometry args={[0.001, 0.001, height, 4]} /><meshStandardMaterial color="#e0e0e0" metalness={0.8} /></mesh>
      })}
    </group>
  )
}
