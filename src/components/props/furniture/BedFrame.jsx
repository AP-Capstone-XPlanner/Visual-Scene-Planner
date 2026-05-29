import CoffeeTableWoodMaterial from '../../materials/CoffeeTableWoodMaterial.jsx'
import CouchFabricMaterial from '../../materials/CouchFabricMaterial.jsx'

export default function BedFrame() {
  return (
    <group>
      <mesh position={[-0.785, 0.14, 0]} castShadow receiveShadow><boxGeometry args={[0.08, 0.28, 2.15]} /><CoffeeTableWoodMaterial baseColor="#c6a072" roughness={0.5} /></mesh>
      <mesh position={[0.785, 0.14, 0]} castShadow receiveShadow><boxGeometry args={[0.08, 0.28, 2.15]} /><CoffeeTableWoodMaterial baseColor="#c6a072" roughness={0.5} /></mesh>
      <mesh position={[0, 0.14, 1.035]} castShadow receiveShadow><boxGeometry args={[1.57, 0.28, 0.08]} /><CoffeeTableWoodMaterial baseColor="#c6a072" roughness={0.5} /></mesh>
      {[[-0.725, -0.875], [-0.925, -0.875], [-0.725, 0.675], [-0.925, 0.675]].map(([bx, bz], bIdx) => (
        <mesh key={`bl-${bIdx}`} position={[bx, 0.06, bz]} castShadow><boxGeometry args={[0.12, 0.12, 0.12]} /><meshStandardMaterial color="#3a2a1a" roughness={0.7} /></mesh>
      ))}
      <mesh position={[-0.785, 0.56, -1.035]} castShadow><boxGeometry args={[0.08, 1.12, 0.08]} /><CoffeeTableWoodMaterial baseColor="#c6a072" roughness={0.4} /></mesh>
      <mesh position={[0.785, 0.56, -1.035]} castShadow><boxGeometry args={[0.08, 1.12, 0.08]} /><CoffeeTableWoodMaterial baseColor="#c6a072" roughness={0.4} /></mesh>
      <mesh position={[0, 1.09, -1.035]} castShadow><boxGeometry args={[1.65, 0.06, 0.10]} /><CoffeeTableWoodMaterial baseColor="#c6a072" roughness={0.35} /></mesh>
      <mesh position={[0, 0.32, -1.035]} castShadow><boxGeometry args={[1.57, 0.06, 0.05]} /><meshStandardMaterial color="#c6a072" roughness={0.5} /></mesh>
      {[-0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6].map((sX, sIdx) => (
        <mesh key={`hs-${sIdx}`} position={[sX, 0.74, -1.035]} castShadow><boxGeometry args={[0.04, 0.72, 0.02]} /><meshStandardMaterial color="#c6a072" roughness={0.45} /></mesh>
      ))}
      <group position={[0, 0.42, 0.04]}>
        <mesh castShadow receiveShadow><boxGeometry args={[1.51, 0.26, 1.99]} /><CouchFabricMaterial color="#f5f5f0" roughness={0.9} /></mesh>
        <mesh position={[0, 0.12, 0]}><boxGeometry args={[1.47, 0.03, 1.95]} /><CouchFabricMaterial color="#f5f5f0" roughness={0.85} /></mesh>
      </group>
      <group position={[-0.35, 0.60, -0.755]} rotation={[0.18, 0, 0]}>
        <mesh castShadow><boxGeometry args={[0.56, 0.015, 0.42]} /><CouchFabricMaterial color="#eaeaea" roughness={0.85} /></mesh>
        <mesh castShadow scale={[1, 0.32, 1]}><cylinderGeometry args={[0.16, 0.16, 0.50, 24, 1, false, 0, Math.PI * 2]} rotation={[0, 0, Math.PI / 2]} /><CouchFabricMaterial color="#eaeaea" roughness={0.7} /></mesh>
      </group>
      <group position={[0.35, 0.60, -0.755]} rotation={[0.18, 0, 0]}>
        <mesh castShadow><boxGeometry args={[0.56, 0.015, 0.42]} /><CouchFabricMaterial color="#eaeaea" roughness={0.85} /></mesh>
        <mesh castShadow scale={[1, 0.32, 1]}><cylinderGeometry args={[0.16, 0.16, 0.50, 24, 1, false, 0, Math.PI * 2]} rotation={[0, 0, Math.PI / 2]} /><CouchFabricMaterial color="#eaeaea" roughness={0.7} /></mesh>
      </group>
    </group>
  )
}
