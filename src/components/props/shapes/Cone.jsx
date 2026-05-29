export default function Cone() {
  return <mesh position={[0, 0.25, 0]} castShadow><coneGeometry args={[0.28, 0.5, 32]} /><meshStandardMaterial color="#888888" /></mesh>
}
