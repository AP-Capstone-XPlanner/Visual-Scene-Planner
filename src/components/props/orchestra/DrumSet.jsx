import * as THREE from 'three'

function Drum({ pos, rot, radius, depth, color }) {
  return (
    <group position={pos} rotation={rot || [0, 0, 0]}>
      <mesh castShadow receiveShadow><cylinderGeometry args={[radius, radius, depth, 32, 1, true]} /><meshPhysicalMaterial color={color} metalness={0.2} roughness={0.1} clearcoat={1.0} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, depth / 2, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow><circleGeometry args={[radius, 32]} /><meshStandardMaterial color="#f4f4f4" roughness={0.8} /></mesh>
      <mesh position={[0, -depth / 2, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow><circleGeometry args={[radius, 32]} /><meshStandardMaterial color="#f4f4f4" roughness={0.8} /></mesh>
      <mesh position={[0, depth / 2, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow><torusGeometry args={[radius, 0.008, 8, 32]} /><meshStandardMaterial color="#cccccc" metalness={0.8} roughness={0.2} /></mesh>
      <mesh position={[0, -depth / 2, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow><torusGeometry args={[radius, 0.008, 8, 32]} /><meshStandardMaterial color="#cccccc" metalness={0.8} roughness={0.2} /></mesh>
    </group>
  )
}

function Cymbal({ posX, posZ, height, tiltRot, radius }) {
  return (
    <group position={[posX, 0, posZ]}>
      <mesh position={[0, 0.01, 0]} castShadow><cylinderGeometry args={[0.2, 0.01, 0.02, 3]} /><meshStandardMaterial color="#cccccc" metalness={0.8} roughness={0.2} /></mesh>
      <mesh position={[0, height / 2, 0]} castShadow><cylinderGeometry args={[0.01, 0.01, height, 16]} /><meshStandardMaterial color="#cccccc" metalness={0.8} roughness={0.2} /></mesh>
      <group position={[0, height, 0]} rotation={tiltRot || [0, 0, 0]}>
        <mesh castShadow receiveShadow><cylinderGeometry args={[0.015, radius, 0.005, 32]} /><meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.3} /></mesh>
        <mesh position={[0, 0.008, 0]} castShadow><cylinderGeometry args={[0.015, 0.015, 0.015, 16]} /><meshStandardMaterial color="#111111" roughness={0.9} /></mesh>
      </group>
    </group>
  )
}

export default function DrumSet() {
  return (
    <group position={[0, 0, 0]}>
      <Drum pos={[0, 0.28, 0]} rot={[Math.PI / 2, 0, 0]} radius={0.28} depth={0.43} color="#b30000" />
      <Drum pos={[0.4, 0.35, 0.25]} rot={[0.1, 0, 0]} radius={0.2} depth={0.38} color="#b30000" />
      <mesh position={[0.3, 0.15, 0.35]} castShadow><cylinderGeometry args={[0.006, 0.006, 0.3]} /><meshStandardMaterial color="#cccccc" metalness={0.8} /></mesh>
      <mesh position={[0.5, 0.15, 0.35]} castShadow><cylinderGeometry args={[0.006, 0.006, 0.3]} /><meshStandardMaterial color="#cccccc" metalness={0.8} /></mesh>
      <mesh position={[0.4, 0.15, 0.15]} castShadow><cylinderGeometry args={[0.006, 0.006, 0.3]} /><meshStandardMaterial color="#cccccc" metalness={0.8} /></mesh>
      <group position={[-0.35, 0, 0.2]}>
        <mesh position={[0, 0.225, 0]} castShadow><cylinderGeometry args={[0.015, 0.015, 0.45]} /><meshStandardMaterial color="#cccccc" metalness={0.8} /></mesh>
        <mesh position={[0, 0.01, 0]} castShadow><cylinderGeometry args={[0.15, 0.01, 0.02, 3]} /><meshStandardMaterial color="#cccccc" metalness={0.8} /></mesh>
        <group position={[0, 0.48, 0]} rotation={[0.1, 0, -0.1]}><Drum pos={[0, 0, 0]} rot={[0, 0, 0]} radius={0.175} depth={0.14} color="#cccccc" /></group>
      </group>
      <Drum pos={[-0.15, 0.7, -0.1]} rot={[0.2, 0.1, 0.1]} radius={0.125} depth={0.18} color="#b30000" />
      <Drum pos={[0.15, 0.72, -0.1]} rot={[0.2, -0.1, -0.1]} radius={0.15} depth={0.20} color="#b30000" />
      <mesh position={[-0.1, 0.6, -0.05]} rotation={[0, 0, 0.2]} castShadow><cylinderGeometry args={[0.01, 0.01, 0.2]} /><meshStandardMaterial color="#cccccc" metalness={0.8} /></mesh>
      <mesh position={[0.1, 0.6, -0.05]} rotation={[0, 0, -0.2]} castShadow><cylinderGeometry args={[0.01, 0.01, 0.2]} /><meshStandardMaterial color="#cccccc" metalness={0.8} /></mesh>
      <Cymbal posX={-0.6} posZ={0.1} height={0.8} tiltRot={[0, 0, -0.05]} radius={0.175} />
      <group position={[-0.6, 0.78, 0.1]} rotation={[0, 0, -0.05]}><mesh castShadow receiveShadow><cylinderGeometry args={[0.175, 0.015, 0.005, 32]} /><meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.3} /></mesh></group>
      <Cymbal posX={-0.45} posZ={-0.2} height={1.05} tiltRot={[0.2, 0, 0.1]} radius={0.2} />
      <Cymbal posX={0.45} posZ={-0.1} height={0.9} tiltRot={[0.15, 0, -0.1]} radius={0.25} />
      <group position={[0, 0, 0.6]}>
        <mesh position={[0, 0.01, 0]} castShadow><cylinderGeometry args={[0.15, 0.01, 0.02, 3]} /><meshStandardMaterial color="#cccccc" metalness={0.8} /></mesh>
        <mesh position={[0, 0.225, 0]} castShadow><cylinderGeometry args={[0.015, 0.015, 0.45]} /><meshStandardMaterial color="#cccccc" metalness={0.8} /></mesh>
        <mesh position={[0, 0.49, 0]} castShadow receiveShadow><cylinderGeometry args={[0.15, 0.15, 0.08, 32]} /><meshStandardMaterial color="#111111" roughness={0.8} /></mesh>
      </group>
    </group>
  )
}
