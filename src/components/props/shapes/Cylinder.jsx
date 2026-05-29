export default function Cylinder() {
  return <mesh position={[0, 0.25, 0]} castShadow><cylinderGeometry args={[0.25, 0.25, 0.5, 32]} /><meshStandardMaterial color="#888888" /></mesh>
}
