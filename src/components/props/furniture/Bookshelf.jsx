import CoffeeTableWoodMaterial from '../../materials/CoffeeTableWoodMaterial.jsx'

function Book({ width = 0.03, height = 0.16, depth = 0.18, color = "#a63a3a", lean = 0 }) {
  return (
    <mesh castShadow receiveShadow rotation={[0, 0, lean]}>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color={color} roughness={0.7} />
    </mesh>
  )
}

export default function Bookshelf() {
  return (
    <group position={[0, 0.61, 0]}>
      <mesh position={[-0.375, 0.075, 0]} castShadow receiveShadow><boxGeometry args={[0.02, 1.07, 0.3]} /><meshStandardMaterial color="#6d4c41" roughness={0.5} /></mesh>
      <mesh position={[0.375, 0.075, 0]} castShadow receiveShadow><boxGeometry args={[0.02, 1.07, 0.3]} /><meshStandardMaterial color="#6d4c41" roughness={0.5} /></mesh>
      <mesh position={[0, 0.60, 0]} castShadow><boxGeometry args={[0.77, 0.02, 0.3]} /><CoffeeTableWoodMaterial baseColor="#6d4c41" roughness={0.4} /></mesh>
      <mesh position={[0, -0.45, 0]} castShadow receiveShadow><boxGeometry args={[0.73, 0.02, 0.3]} /><meshStandardMaterial color="#6d4c41" roughness={0.55} /></mesh>
      <mesh position={[-0.09, 0.19, 0]} castShadow receiveShadow><boxGeometry args={[0.55, 0.02, 0.29]} /><meshStandardMaterial color="#6d4c41" roughness={0.5} /></mesh>
      <mesh position={[0, 0.053, 0]} castShadow receiveShadow><boxGeometry args={[0.73, 0.02, 0.29]} /><meshStandardMaterial color="#6d4c41" roughness={0.5} /></mesh>
      <mesh position={[-0.10, -0.19, 0]} castShadow receiveShadow><boxGeometry args={[0.5, 0.02, 0.29]} /><meshStandardMaterial color="#6d4c41" roughness={0.5} /></mesh>
      <mesh position={[0.10, 0.34, 0]} castShadow><boxGeometry args={[0.02, 0.3, 0.28]} /><meshStandardMaterial color="#6d4c41" roughness={0.5} /></mesh>
      <mesh position={[-0.16, 0.12, 0]} castShadow><boxGeometry args={[0.02, 0.12, 0.28]} /><meshStandardMaterial color="#6d4c41" roughness={0.5} /></mesh>
      <mesh position={[-0.14, -0.23, 0]} castShadow><boxGeometry args={[0.02, 0.53, 0.28]} /><meshStandardMaterial color="#6d4c41" roughness={0.5} /></mesh>
      <mesh position={[0.10, -0.07, 0]} castShadow><boxGeometry args={[0.02, 0.25, 0.28]} /><meshStandardMaterial color="#6d4c41" roughness={0.5} /></mesh>
      <group position={[-0.30, 0.28, 0]}>
        <group position={[0.00, 0, 0]}><Book color="#2c3e50" height={0.17} /></group>
        <group position={[0.035, 0, 0]}><Book color="#c0392b" height={0.15} /></group>
        <group position={[0.07, 0, 0]}><Book color="#d35400" height={0.16} /></group>
        <group position={[0.105, 0, 0]}><Book color="#7f8c8d" height={0.14} /></group>
        <group position={[0.145, 0, 0]} rotation={[0, 0, -0.22]}><Book color="#16a085" height={0.16} /></group>
      </group>
      {[[-0.325, -0.1], [0.325, -0.1], [-0.325, 0.1], [0.325, 0.1]].map(([lx, lz], lIdx) => (
        <mesh key={`sh-${lIdx}`} position={[lx, -0.535, lz]} rotation={[0.08, 0, lx > 0 ? -0.05 : 0.05]} castShadow><cylinderGeometry args={[0.02, 0.012, 0.15, 16]} /><meshStandardMaterial color="#3e2723" roughness={0.6} /></mesh>
      ))}
    </group>
  )
}
