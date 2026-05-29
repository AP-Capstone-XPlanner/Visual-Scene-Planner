export default function Sphere() {
  return <mesh position={[0, 0.28, 0]} castShadow><sphereGeometry args={[0.28, 32, 32]} /><meshStandardMaterial color="#888888" /></mesh>
}
