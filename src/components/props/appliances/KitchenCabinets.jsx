import CoffeeTableWoodMaterial from '../../materials/CoffeeTableWoodMaterial.jsx'

export default function KitchenCabinets() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow><boxGeometry args={[2.3, 0.9, 0.6]} /><meshStandardMaterial color="#4a4f54" roughness={0.8} /></mesh>
      <mesh position={[0, 0.915, 0]} castShadow receiveShadow><boxGeometry args={[2.32, 0.03, 0.62]} /><CoffeeTableWoodMaterial baseColor="#cfae68" roughness={0.4} /></mesh>
      <mesh position={[-0.5, 1.9, -0.15]} castShadow receiveShadow><boxGeometry args={[1.3, 0.8, 0.3]} /><meshStandardMaterial color="#4a4f54" roughness={0.8} /></mesh>
      <mesh position={[0.85, 1.15, 0]} castShadow receiveShadow><boxGeometry args={[0.6, 2.3, 0.6]} /><meshStandardMaterial color="#4a4f54" roughness={0.8} /></mesh>
      <mesh position={[-0.2, 0.93, 0]} castShadow><boxGeometry args={[0.4, 0.01, 0.3]} /><meshStandardMaterial color="#bdc3c7" metalness={0.8} roughness={0.2} /></mesh>
      <mesh position={[-0.2, 1.1, -0.1]} castShadow><cylinderGeometry args={[0.01, 0.01, 0.3]} /><meshStandardMaterial color="#bdc3c7" metalness={0.8} roughness={0.2} /></mesh>
    </group>
  )
}
