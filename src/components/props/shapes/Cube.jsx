export default function Cube() {
  return <mesh position={[0, 0.25, 0]} castShadow><boxGeometry args={[0.5, 0.5, 0.5]} /><meshStandardMaterial color="#888888" /></mesh>
}
