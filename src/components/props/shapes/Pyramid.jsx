export default function Pyramid() {
  return <mesh position={[0, 0.25, 0]} castShadow><cylinderGeometry args={[0, 0.35, 0.5, 4]} /><meshStandardMaterial color="#888888" /></mesh>
}
