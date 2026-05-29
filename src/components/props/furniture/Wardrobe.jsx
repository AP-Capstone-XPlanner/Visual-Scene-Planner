import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import CoffeeTableWoodMaterial from '../../materials/CoffeeTableWoodMaterial.jsx'

export default function AnimatedWardrobe({ isOpen }) {
  const lRef = useRef()
  const cRef = useRef()
  const rRef = useRef()
  const wW = 1.2
  const wH = 1.82
  const wD = 0.55

  useFrame(() => {
    const angle = Math.PI * 0.75
    if (lRef.current) lRef.current.rotation.y += ((isOpen ? -angle : 0) - lRef.current.rotation.y) * 0.05
    if (cRef.current) cRef.current.rotation.y += ((isOpen ? angle : 0) - cRef.current.rotation.y) * 0.05
    if (rRef.current) rRef.current.rotation.y += ((isOpen ? angle : 0) - rRef.current.rotation.y) * 0.05
  })

  return (
    <group position={[0, wH / 2, 0]}>
      <mesh position={[0, wH * 0.005, -(wD / 2) + 0.01]} castShadow receiveShadow><boxGeometry args={[wW, wH - 0.06, 0.02]} /><meshStandardMaterial color="#8d6e63" roughness={0.5} /></mesh>
      <mesh position={[-(wW / 2) + 0.015, wH * 0.005, 0]} castShadow receiveShadow><boxGeometry args={[0.03, wH - 0.06, wD - 0.02]} /><CoffeeTableWoodMaterial baseColor="#8d6e63" roughness={0.45} /></mesh>
      <mesh position={[(wW / 2) - 0.015, wH * 0.005, 0]} castShadow receiveShadow><boxGeometry args={[0.03, wH - 0.06, wD - 0.02]} /><CoffeeTableWoodMaterial baseColor="#8d6e63" roughness={0.45} /></mesh>
      <mesh position={[0, (wH / 2) - 0.015, 0]} castShadow><boxGeometry args={[wW + 0.04, 0.04, wD + 0.03]} /><CoffeeTableWoodMaterial baseColor="#8d6e63" roughness={0.4} /></mesh>
      <mesh position={[0, -(wH / 2) + 0.03, 0]} castShadow receiveShadow><boxGeometry args={[wW, 0.06, wD]} /><CoffeeTableWoodMaterial baseColor="#8d6e63" roughness={0.6} /></mesh>
      <mesh position={[0.15, wH * 0.005, 0.01]} castShadow receiveShadow><boxGeometry args={[0.02, wH - 0.10, wD - 0.04]} /><meshStandardMaterial color="#8d6e63" roughness={0.5} /></mesh>
      {[-0.50, -0.15, 0.15, 0.45].map((shY, sIdx) => (
        <mesh key={`ws-${sIdx}`} position={[0.365, shY, 0.01]} castShadow receiveShadow><boxGeometry args={[0.39, 0.02, wD - 0.04]} /><meshStandardMaterial color="#8d6e63" roughness={0.55} /></mesh>
      ))}

      <group ref={lRef} position={[-(wW / 2) + 0.03, 0, (wD / 2)]}>
        <mesh position={[0.19, wH * 0.005, -0.0075]} castShadow><boxGeometry args={[0.38, wH - 0.08, 0.015]} /><CoffeeTableWoodMaterial baseColor="#8d6e63" roughness={0.35} /></mesh>
        <mesh position={[0.35, 0.05, 0.01]} castShadow><boxGeometry args={[0.015, wH * 0.08, 0.015]} /><meshStandardMaterial color="#b0bec5" metalness={0.9} roughness={0.1} /></mesh>
      </group>
      <group ref={cRef} position={[0.15, 0, (wD / 2)]}>
        <mesh position={[-0.19, wH * 0.005, -0.0075]} castShadow><boxGeometry args={[0.38, wH - 0.08, 0.015]} /><CoffeeTableWoodMaterial baseColor="#8d6e63" roughness={0.35} /></mesh>
        <mesh position={[-0.35, 0.05, 0.01]} castShadow><boxGeometry args={[0.015, wH * 0.08, 0.015]} /><meshStandardMaterial color="#b0bec5" metalness={0.9} roughness={0.1} /></mesh>
      </group>
      <group ref={rRef} position={[(wW / 2) - 0.03, 0, (wD / 2)]}>
        <mesh position={[-0.19, wH * 0.005, -0.0075]} castShadow><boxGeometry args={[0.38, wH - 0.08, 0.015]} /><CoffeeTableWoodMaterial baseColor="#8d6e63" roughness={0.35} /></mesh>
        <mesh position={[-0.35, 0.05, 0.01]} castShadow><boxGeometry args={[0.015, wH * 0.08, 0.015]} /><meshStandardMaterial color="#b0bec5" metalness={0.9} roughness={0.1} /></mesh>
      </group>
    </group>
  )
}
