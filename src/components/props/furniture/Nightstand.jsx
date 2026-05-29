import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function AnimatedNightstand({ isDrawerOpen }) {
  const drawerRef = useRef()
  const nW = 0.47
  const nH = 0.51
  const nD = 0.40
  const nLegH = 0.17

  useFrame(() => {
    if (drawerRef.current) drawerRef.current.position.z += ((isDrawerOpen ? 0.30 : 0) - drawerRef.current.position.z) * 0.05
  })

  return (
    <group position={[0, (nH + nLegH) / 2, 0]}>
      <mesh position={[-(nW / 2) + 0.01, nLegH / 2, 0]} castShadow receiveShadow><boxGeometry args={[0.02, nH, nD]} /><meshStandardMaterial color="#fcfdfd" roughness={0.4} /></mesh>
      <mesh position={[(nW / 2) - 0.01, nLegH / 2, 0]} castShadow receiveShadow><boxGeometry args={[0.02, nH, nD]} /><meshStandardMaterial color="#fcfdfd" roughness={0.4} /></mesh>
      <mesh position={[0, (nH / 2) + (nLegH / 2) - 0.01, 0]} castShadow><boxGeometry args={[nW + 0.01, 0.02, nD + 0.01]} /><meshStandardMaterial color="#fcfdfd" roughness={0.35} /></mesh>
      <mesh position={[0, (nH / 2) + (nLegH / 2) - 0.24, 0]} castShadow receiveShadow><boxGeometry args={[nW - 0.04, 0.015, nD - 0.02]} /><meshStandardMaterial color="#fcfdfd" roughness={0.45} /></mesh>
      <mesh position={[0, -(nH / 2) + (nLegH / 2) + 0.01, 0]} castShadow receiveShadow><boxGeometry args={[nW - 0.04, 0.02, nD - 0.02]} /><meshStandardMaterial color="#fcfdfd" roughness={0.4} /></mesh>
      <mesh position={[0, nLegH / 2, -(nD / 2) + 0.01]} castShadow receiveShadow><boxGeometry args={[nW - 0.04, nH - 0.02, 0.01]} /><meshStandardMaterial color="#fcfdfd" roughness={0.5} /></mesh>

      <group ref={drawerRef} position={[0, (nH / 2) + (nLegH / 2) - 0.12, 0]}>
        <mesh position={[0, 0, (nD / 2) - 0.01]} castShadow><boxGeometry args={[nW - 0.04, 0.22, 0.02]} /><meshStandardMaterial color="#fcfdfd" roughness={0.3} /></mesh>
        <mesh position={[0, 0, (nD / 2) + 0.005]} castShadow><boxGeometry args={[0.05, 0.02, 0.015]} /><meshStandardMaterial color="#151515" roughness={0.6} metalness={0.1} /></mesh>
        <mesh position={[-(nW / 2) + 0.03, -0.01, 0]} castShadow><boxGeometry args={[0.02, 0.20, nD - 0.04]} /><meshStandardMaterial color="#fcfdfd" roughness={0.3} /></mesh>
        <mesh position={[(nW / 2) - 0.03, -0.01, 0]} castShadow><boxGeometry args={[0.02, 0.20, nD - 0.04]} /><meshStandardMaterial color="#fcfdfd" roughness={0.3} /></mesh>
        <mesh position={[0, -0.10, 0]} castShadow><boxGeometry args={[nW - 0.08, 0.02, nD - 0.04]} /><meshStandardMaterial color="#fcfdfd" roughness={0.3} /></mesh>
        <mesh position={[0, -0.01, -(nD / 2) + 0.03]} castShadow><boxGeometry args={[nW - 0.08, 0.20, 0.02]} /><meshStandardMaterial color="#fcfdfd" roughness={0.3} /></mesh>
      </group>

      {[[-(nW / 2) + 0.02, -(nD / 2) + 0.03], [(nW / 2) - 0.02, -(nD / 2) + 0.03], [-(nW / 2) + 0.02, (nD / 2) - 0.03], [(nW / 2) - 0.02, (nD / 2) - 0.03]].map(([lx, lz], idx) => (
        <mesh key={`nl-${idx}`} position={[lx, -(nH / 2) + (nLegH / 2) - (nLegH / 2), lz]} castShadow><boxGeometry args={[0.035, nLegH, 0.035]} /><meshStandardMaterial color="#fcfdfd" roughness={0.45} /></mesh>
      ))}

      <group position={[0, (nH / 2) + (nLegH / 2), 0]}>
        <mesh position={[0, 0.04, 0]} castShadow><sphereGeometry args={[0.045, 24, 24]} /><meshStandardMaterial color="#cca471" roughness={0.2} metalness={0.1} /></mesh>
        <mesh position={[0, 0.09, 0]} castShadow><cylinderGeometry args={[0.005, 0.005, 0.04, 8]} /><meshStandardMaterial color="#cca43b" metalness={0.7} roughness={0.2} /></mesh>
        <mesh position={[0, 0.16, 0]} castShadow><cylinderGeometry args={[0.035, 0.075, 0.13, 24, 1, true]} /><meshStandardMaterial color="#f4ebd9" roughness={0.85} side={2} /></mesh>
      </group>
    </group>
  )
}
