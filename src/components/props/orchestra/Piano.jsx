import * as THREE from 'three'

const pGold = "#cca43b"
const pianoGloss = { color: "#020202", roughness: 0.05, metalness: 0.4, clearcoat: 1.0, clearcoatRoughness: 0.05 }

const pianoShape = new THREE.Shape()
pianoShape.moveTo(-0.735, -0.45)
pianoShape.lineTo(0.735, -0.45)
pianoShape.lineTo(0.735, -0.2)
pianoShape.bezierCurveTo(0.735, 0.1, 0.3, 0.3, 0.3, 0.7)
pianoShape.bezierCurveTo(0.3, 1.2, 0.6, 1.55, 0.0, 1.55)
pianoShape.bezierCurveTo(-0.735, 1.55, -0.735, 1.0, -0.735, 0.7)
pianoShape.lineTo(-0.735, -0.45)

const extrudeBody = { depth: 0.25, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 3 }
const extrudeLid = { depth: 0.025, bevelEnabled: true, bevelThickness: 0.005, bevelSize: 0.005, bevelSegments: 3 }

export default function Piano() {
  return (
    <group>
      <spotLight position={[0, 3.5, 1.5]} angle={0.8} penumbra={0.3} intensity={4.5} color="#ffffff" castShadow />
      <pointLight position={[1.5, 1.5, -1]} intensity={2.0} color="#ffebc2" distance={6} />
      <mesh position={[0, 0.68, 0.65]} castShadow><boxGeometry args={[1.47, 0.10, 0.45]} /><meshPhysicalMaterial {...pianoGloss} /></mesh>
      <mesh position={[-0.673, 0.76, 0.80]} castShadow><boxGeometry args={[0.124, 0.06, 0.15]} /><meshPhysicalMaterial {...pianoGloss} /></mesh>
      <mesh position={[0.673, 0.76, 0.80]} castShadow><boxGeometry args={[0.124, 0.06, 0.15]} /><meshPhysicalMaterial {...pianoGloss} /></mesh>
      <mesh position={[0, 0.73, 0.885]} castShadow><boxGeometry args={[1.47, 0.02, 0.02]} /><meshPhysicalMaterial {...pianoGloss} /></mesh>
      <mesh position={[0, 0.68, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <extrudeGeometry args={[pianoShape, extrudeBody]} /><meshPhysicalMaterial {...pianoGloss} />
      </mesh>
      <mesh position={[0, 0.74, 0.715]}><boxGeometry args={[1.22, 0.02, 0.02]} /><meshStandardMaterial color="#8a0000" roughness={0.9} /></mesh>
      {Array.from({ length: 52 }).map((_, i) => (
        <mesh key={`wk-${i}`} position={[-0.60 + (i * 0.0235), 0.74, 0.80]} receiveShadow><boxGeometry args={[0.021, 0.02, 0.15]} /><meshStandardMaterial color="#f8f9fa" roughness={0.1} /></mesh>
      ))}
      {Array.from({ length: 51 }).map((_, i) => {
        const noteInOctave = (i + 5) % 7
        if (noteInOctave === 2 || noteInOctave === 6) return null
        return (
          <mesh key={`bk-${i}`} position={[-0.60 + (i * 0.0235) + 0.01175, 0.755, 0.77]} castShadow><boxGeometry args={[0.012, 0.025, 0.09]} /><meshStandardMaterial color="#0a0a0a" roughness={0.2} /></mesh>
        )
      })}
      <group position={[0, 0.95, 0.55]} rotation={[-0.25, 0, 0]}>
        <mesh castShadow><boxGeometry args={[0.8, 0.3, 0.02]} /><meshPhysicalMaterial {...pianoGloss} /></mesh>
        <mesh position={[0, -0.14, 0.05]} castShadow><boxGeometry args={[0.8, 0.02, 0.08]} /><meshPhysicalMaterial {...pianoGloss} /></mesh>
      </group>
      <group position={[-0.735, 0.93, 0]} rotation={[0, 0, 0.55]}>
        <mesh position={[0.735, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow><extrudeGeometry args={[pianoShape, extrudeLid]} /><meshPhysicalMaterial {...pianoGloss} /></mesh>
      </group>
      <mesh position={[0.6, 1.25, 0.1]} rotation={[0, 0, 0.1]} castShadow><cylinderGeometry args={[0.01, 0.01, 0.65]} /><meshStandardMaterial color="#050505" /></mesh>
      {[[-0.6, 0.35], [0.6, 0.35], [-0.1, -1.3]].map(([lx, lz], idx) => (
        <group key={`piano-leg-${idx}`} position={[lx, 0.35, lz]}>
          <mesh castShadow><boxGeometry args={[0.08, 0.6, 0.08]} /><meshPhysicalMaterial {...pianoGloss} /></mesh>
          <mesh position={[0, -0.32, 0]} castShadow rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.04, 16]} /><meshStandardMaterial color={pGold} roughness={0.3} metalness={0.8} /></mesh>
        </group>
      ))}
      <group position={[0, 0.35, 0.2]}>
        <mesh castShadow><boxGeometry args={[0.15, 0.45, 0.04]} /><meshPhysicalMaterial {...pianoGloss} /></mesh>
        <mesh position={[0, -0.22, 0.02]} castShadow><boxGeometry args={[0.2, 0.04, 0.08]} /><meshPhysicalMaterial {...pianoGloss} /></mesh>
        {[-0.05, 0, 0.05].map((px, pIdx) => (
          <mesh key={`pedal-${pIdx}`} position={[px, -0.25, 0.05]} castShadow><boxGeometry args={[0.015, 0.015, 0.08]} /><meshStandardMaterial color={pGold} roughness={0.3} metalness={0.8} /></mesh>
        ))}
      </group>
      <group position={[0, 0.25, 1.25]}>
        <mesh castShadow><boxGeometry args={[0.6, 0.08, 0.35]} /><meshStandardMaterial color="#111" roughness={0.8} /></mesh>
        {[[-0.26, -0.13], [0.26, -0.13], [-0.26, 0.13], [0.26, 0.13]].map(([bx, bz], bIdx) => (
          <mesh key={`bench-leg-${bIdx}`} position={[bx, -0.2, bz]} castShadow><boxGeometry args={[0.04, 0.4, 0.04]} /><meshPhysicalMaterial {...pianoGloss} /></mesh>
        ))}
      </group>
    </group>
  )
}
