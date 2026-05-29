import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

export default function AnimatedDoorFlat({ isOpen }) {
  const doorRef = useRef()
  useFrame(() => {
    if (doorRef.current) doorRef.current.rotation.y += ((isOpen ? -Math.PI / 2.2 : 0) - doorRef.current.rotation.y) * 0.1
  })
  const triShape = new THREE.Shape()
  triShape.moveTo(0, 0)
  triShape.lineTo(0, 1.0)
  triShape.lineTo(-0.8, 0)
  triShape.lineTo(0, 0)
  const triExtrude = { depth: 0.04, bevelEnabled: false }

  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.02, -0.61]} castShadow receiveShadow><boxGeometry args={[1.22, 0.04, 1.22]} /><meshStandardMaterial color="#d2b48c" roughness={0.8} /></mesh>
      <mesh position={[-0.5, 1.065, 0]} castShadow><boxGeometry args={[0.1, 2.13, 0.1]} /><meshStandardMaterial color="#e0e0e0" roughness={0.9} /></mesh>
      <mesh position={[0.5, 1.065, 0]} castShadow><boxGeometry args={[0.1, 2.13, 0.1]} /><meshStandardMaterial color="#e0e0e0" roughness={0.9} /></mesh>
      <mesh position={[0, 2.08, 0]} castShadow><boxGeometry args={[1.1, 0.1, 0.1]} /><meshStandardMaterial color="#e0e0e0" roughness={0.9} /></mesh>
      <group position={[-0.45, 1.03, -0.02]} ref={doorRef}>
        <mesh position={[0.45, 0, 0]} castShadow><boxGeometry args={[0.9, 2.0, 0.04]} /><meshStandardMaterial color="#ffffff" roughness={0.7} /></mesh>
        <mesh position={[0.83, -0.03, 0.03]} castShadow><sphereGeometry args={[0.03]} /><meshStandardMaterial color="#111" metalness={0.8} /></mesh>
      </group>
      <mesh position={[-0.45, 0.04, -0.05]} rotation={[0, -Math.PI / 2, 0]} castShadow><extrudeGeometry args={[triShape, triExtrude]} /><meshStandardMaterial color="#d2b48c" roughness={0.8} /></mesh>
      <mesh position={[0.49, 0.04, -0.05]} rotation={[0, -Math.PI / 2, 0]} castShadow><extrudeGeometry args={[triShape, triExtrude]} /><meshStandardMaterial color="#d2b48c" roughness={0.8} /></mesh>
    </group>
  )
}
