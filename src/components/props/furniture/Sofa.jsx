import CouchFabricMaterial from '../../materials/CouchFabricMaterial.jsx'

export default function Sofa() {
  return (
    <group>
      <mesh position={[0, 0.20, -0.325]} castShadow receiveShadow><boxGeometry args={[1.83, 0.10, 0.87]} /><CouchFabricMaterial color="rgb(143, 111, 51)" /></mesh>
      <mesh position={[-0.435, 0.20, 0.385]} castShadow receiveShadow><boxGeometry args={[0.85, 0.10, 0.55]} /><CouchFabricMaterial color="rgb(143, 111, 51)" /></mesh>
      <group position={[0, 0.525, -0.71]}>
        <mesh castShadow><boxGeometry args={[1.83, 0.43, 0.1]} /><CouchFabricMaterial color="rgb(143, 111, 51)" /></mesh>
        <mesh position={[0, 0.215, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.05, 0.05, 1.83, 16]} /><CouchFabricMaterial color="rgb(143, 111, 51)" /></mesh>
      </group>
      <group position={[-0.885, 0.39, -0.325]}>
        <mesh castShadow><boxGeometry args={[0.06, 0.38, 0.87]} /><CouchFabricMaterial color="rgb(143, 111, 51)" /></mesh>
        <mesh position={[0, 0.19, 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.87, 16]} /><CouchFabricMaterial color="rgb(143, 111, 51)" /></mesh>
      </group>
      <group position={[0.885, 0.39, -0.325]}>
        <mesh castShadow><boxGeometry args={[0.06, 0.38, 0.87]} /><CouchFabricMaterial color="rgb(143, 111, 51)" /></mesh>
        <mesh position={[0, 0.19, 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.87, 16]} /><CouchFabricMaterial color="rgb(143, 111, 51)" /></mesh>
      </group>
      <group position={[0.41, 0.35, -0.275]}>
        <mesh castShadow><boxGeometry args={[0.82, 0.18, 0.73]} /><CouchFabricMaterial color="rgb(201, 173, 119)" /></mesh>
        <mesh position={[0, 0, 0.365]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.09, 0.09, 0.82, 16]} /><CouchFabricMaterial color="rgb(201, 173, 119)" /></mesh>
      </group>
      <group position={[-0.435, 0.35, 0.1]}>
        <mesh castShadow><boxGeometry args={[0.85, 0.18, 1.48]} /><CouchFabricMaterial color="rgb(201, 173, 119)" /></mesh>
        <mesh position={[0, 0, 0.74]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.09, 0.09, 0.85, 16]} /><CouchFabricMaterial color="rgb(201, 173, 119)" /></mesh>
      </group>
      <mesh position={[0, 0.52, -0.64]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.12, 0.12, 1.2, 24]} /><CouchFabricMaterial color="rgb(201, 173, 119)" /></mesh>
      <mesh position={[-0.82, 0.44, -0.25]} rotation={[0, 0, 0.15]} castShadow><boxGeometry args={[0.05, 0.20, 0.50]} /><CouchFabricMaterial color="rgb(201, 173, 119)" /></mesh>
      <mesh position={[0.82, 0.44, -0.25]} rotation={[0, 0, -0.15]} castShadow><boxGeometry args={[0.05, 0.20, 0.50]} /><CouchFabricMaterial color="rgb(201, 173, 119)" /></mesh>
      {[[-0.84, -0.7], [0.84, -0.7], [-0.84, 0.05], [0.84, 0.05], [-0.84, 0.75], [-0.03, 0.75]].map((p, i) => (
        <mesh key={`leg${i}`} position={[p[0], 0.075, p[1]]} castShadow><cylinderGeometry args={[0.03, 0.015, 0.15]} /><meshStandardMaterial color="#2d1f18" roughness={0.5} /></mesh>
      ))}
    </group>
  )
}
