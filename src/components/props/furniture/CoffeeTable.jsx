import CoffeeTableWoodMaterial from '../../materials/CoffeeTableWoodMaterial.jsx'

export default function CoffeeTable() {
  return (
    <group>
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow><boxGeometry args={[0.965, 0.03, 0.965]} /><CoffeeTableWoodMaterial baseColor="#d2b48c" /></mesh>
      <mesh position={[0, 0.466, 0]}><boxGeometry args={[0.97, 0.002, 0.97]} /><meshStandardMaterial color="#fff" roughness={0.2} /></mesh>
      <mesh position={[-0.445, 0.22, -0.445]} castShadow><boxGeometry args={[0.075, 0.44, 0.075]} /><CoffeeTableWoodMaterial baseColor="#d2b48c" /></mesh>
      <mesh position={[0.445, 0.22, -0.445]} castShadow><boxGeometry args={[0.075, 0.44, 0.075]} /><CoffeeTableWoodMaterial baseColor="#d2b48c" /></mesh>
      <mesh position={[-0.445, 0.22, 0.445]} castShadow><boxGeometry args={[0.075, 0.44, 0.075]} /><CoffeeTableWoodMaterial baseColor="#d2b48c" /></mesh>
      <mesh position={[0.445, 0.22, 0.445]} castShadow><boxGeometry args={[0.075, 0.44, 0.075]} /><CoffeeTableWoodMaterial baseColor="#d2b48c" /></mesh>
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow><boxGeometry args={[0.885, 0.03, 0.885]} /><CoffeeTableWoodMaterial baseColor="#d2b48c" /></mesh>
      <mesh position={[0, 0.096, 0]}><boxGeometry args={[0.89, 0.002, 0.89]} /><meshStandardMaterial color="#fff" roughness={0.3} /></mesh>
      <group position={[0, 0.33, 0.415]}>
        <mesh castShadow><boxGeometry args={[0.81, 0.15, 0.03]} /><CoffeeTableWoodMaterial baseColor="#d2b48c" /></mesh>
        <mesh position={[0, 0, 0.016]}><boxGeometry args={[0.79, 0.13, 0.002]} /><meshStandardMaterial color="#fff" roughness={0.2} wireframe /></mesh>
        <mesh position={[0, -0.01, 0.02]}><boxGeometry args={[0.10, 0.04, 0.01]} /><meshStandardMaterial color="#2d2d2d" metalness={0.9} roughness={0.1} /></mesh>
      </group>
    </group>
  )
}
