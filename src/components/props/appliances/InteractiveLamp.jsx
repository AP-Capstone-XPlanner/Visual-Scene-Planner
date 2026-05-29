import { useState } from 'react'
import * as THREE from 'three'

export default function InteractiveLamp({ type }) {
  const [isOn, setIsOn] = useState(true)

  if (type === 1) {
    return (
      <group>
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.015, 0]} castShadow receiveShadow><boxGeometry args={[0.23, 0.03, 0.23]} /><meshStandardMaterial color="#d2b48c" roughness={0.6} /></mesh>
          <mesh position={[0, 0.65, 0]} castShadow><cylinderGeometry args={[0.015, 0.015, 1.3]} /><meshStandardMaterial color="#d2b48c" roughness={0.6} /></mesh>
          <mesh position={[0, 1.35, 0]} castShadow onClick={(e) => { e.stopPropagation(); setIsOn(!isOn) }}><cylinderGeometry args={[0.2, 0.2, 0.25, 32, 1, true]} /><meshStandardMaterial color={isOn ? "#ffffff" : "#f8f9fa"} roughness={0.9} side={THREE.DoubleSide} emissive={isOn ? "#fff1e0" : "#000"} emissiveIntensity={0.5} /></mesh>
          {isOn && <pointLight position={[0, 1.35, 0]} intensity={4.0} distance={8} color="#fff1e0" />}
          <mesh position={[0, 1.35, 0]}><sphereGeometry args={[0.04]} /><meshBasicMaterial color={isOn ? "#ffffff" : "#cccccc"} /></mesh>
        </group>
      </group>
    )
  }

  // type === 2
  return (
    <group>
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.015, 0]} castShadow receiveShadow><cylinderGeometry args={[0.15, 0.15, 0.03, 32]} /><meshStandardMaterial color="#bdc3c7" metalness={0.8} roughness={0.2} /></mesh>
        <mesh position={[0, 0.035, 0]} castShadow receiveShadow><cylinderGeometry args={[0.1, 0.1, 0.01, 32]} /><meshStandardMaterial color="#bdc3c7" metalness={0.8} roughness={0.2} /></mesh>
        <mesh position={[0, 0.65, 0]} castShadow><cylinderGeometry args={[0.01, 0.01, 1.3]} /><meshStandardMaterial color="#bdc3c7" metalness={0.8} roughness={0.2} /></mesh>
        <mesh position={[0, 1.35, 0]} castShadow onClick={(e) => { e.stopPropagation(); setIsOn(!isOn) }}><cylinderGeometry args={[0.12, 0.18, 0.25, 32, 1, true]} /><meshStandardMaterial color={isOn ? "#ffffff" : "#f8f9fa"} roughness={0.9} side={THREE.DoubleSide} emissive={isOn ? "#fff1e0" : "#000"} emissiveIntensity={0.5} /></mesh>
        <mesh position={[0.08, 1.15, 0]} castShadow><cylinderGeometry args={[0.002, 0.002, 0.15]} /><meshStandardMaterial color="#bdc3c7" metalness={0.8} roughness={0.2} /></mesh>
        <mesh position={[0.08, 1.07, 0]} castShadow><sphereGeometry args={[0.008]} /><meshStandardMaterial color="#bdc3c7" metalness={0.8} roughness={0.2} /></mesh>
        {isOn && <pointLight position={[0, 1.35, 0]} intensity={4.0} distance={8} color="#fff1e0" />}
        <mesh position={[0, 1.35, 0]}><sphereGeometry args={[0.04]} /><meshBasicMaterial color={isOn ? "#ffffff" : "#cccccc"} /></mesh>
      </group>
    </group>
  )
}
