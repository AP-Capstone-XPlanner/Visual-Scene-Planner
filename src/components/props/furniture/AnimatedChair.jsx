import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function AnimatedChair({ posX, posZ, rotY }) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef()

  useFrame(() => {
    if (ref.current) ref.current.position.z += ((isOpen ? (posZ > 0 ? posZ + 0.25 : posZ - 0.25) : posZ) - ref.current.position.z) * 0.08
  })

  return (
    <group ref={ref} position={[posX, 0, posZ]} rotation={[0, rotY, 0]} onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen) }}>
      <mesh position={[-0.195, 0.24, -0.195]} castShadow><boxGeometry args={[0.02, 0.48, 0.02]} /><meshStandardMaterial color="#b59975" roughness={0.5} /></mesh>
      <mesh position={[0.195, 0.24, -0.195]} castShadow><boxGeometry args={[0.02, 0.48, 0.02]} /><meshStandardMaterial color="#b59975" roughness={0.5} /></mesh>
      <mesh position={[-0.195, 0.24, 0.195]} castShadow><boxGeometry args={[0.02, 0.48, 0.02]} /><meshStandardMaterial color="#b59975" roughness={0.5} /></mesh>
      <mesh position={[0.195, 0.24, 0.195]} castShadow><boxGeometry args={[0.02, 0.48, 0.02]} /><meshStandardMaterial color="#b59975" roughness={0.5} /></mesh>
      <mesh position={[-0.195, 0.715, -0.195]} castShadow><boxGeometry args={[0.02, 0.47, 0.02]} /><meshStandardMaterial color="#b59975" roughness={0.5} /></mesh>
      <mesh position={[0.195, 0.715, -0.195]} castShadow><boxGeometry args={[0.02, 0.47, 0.02]} /><meshStandardMaterial color="#b59975" roughness={0.5} /></mesh>
      <mesh position={[0, 0.91, -0.195]} castShadow><boxGeometry args={[0.42, 0.08, 0.018]} /><meshStandardMaterial color="#b59975" roughness={0.4} /></mesh>
      <mesh position={[0, 0.668, -0.195]} castShadow><boxGeometry args={[0.39, 0.03, 0.015]} /><meshStandardMaterial color="#b59975" roughness={0.5} /></mesh>
      <mesh position={[0, 0.48, 0]} castShadow receiveShadow><boxGeometry args={[0.42, 0.03, 0.42]} /><meshStandardMaterial color="#eae2d5" roughness={0.75} /></mesh>
    </group>
  )
}
