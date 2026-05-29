import { useState } from 'react'
import CoffeeTableWoodMaterial from '../../materials/CoffeeTableWoodMaterial.jsx'

const ptL = 1.83
const ptW = 0.91
const ptH = 0.76
const ptApron = 0.06
const ptChairSeatH = 0.48
const ptChairW = 0.42
const ptChairD = 0.42
const ptChairBackH = 0.95

const chairPositions = [
  { x: -(ptL / 2) - 0.25, z: 0, rot: Math.PI / 2 },
  { x: (ptL / 2) + 0.25, z: 0, rot: -Math.PI / 2 },
  { x: -0.55, z: (ptW / 2) + 0.18, rot: Math.PI },
  { x: 0.0, z: (ptW / 2) + 0.18, rot: Math.PI },
  { x: 0.55, z: (ptW / 2) + 0.18, rot: Math.PI },
  { x: -0.55, z: -(ptW / 2) - 0.18, rot: 0 },
  { x: 0.0, z: -(ptW / 2) - 0.18, rot: 0 },
  { x: 0.55, z: -(ptW / 2) - 0.18, rot: 0 },
]

export default function InteractivePropTable() {
  const [chairs, setChairs] = useState([true, true, true, true, true, true, true, true])

  const toggleChair = (idx, e) => {
    e.stopPropagation()
    setChairs(prev => { const next = [...prev]; next[idx] = !next[idx]; return next })
  }

  return (
    <group>
      {/* Table top */}
      <mesh position={[0, ptH - 0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[ptL, 0.04, ptW]} />
        <CoffeeTableWoodMaterial baseColor="#d2b48c" roughness={0.35} />
      </mesh>
      {/* Aprons */}
      <group position={[0, ptH - 0.04 - (ptApron / 2), 0]}>
        <mesh position={[0, 0, (ptW / 2) - 0.03]} castShadow><boxGeometry args={[ptL - 0.1, ptApron, 0.02]} /><meshStandardMaterial color="#d2b48c" roughness={0.5} /></mesh>
        <mesh position={[0, 0, -(ptW / 2) + 0.03]} castShadow><boxGeometry args={[ptL - 0.1, ptApron, 0.02]} /><meshStandardMaterial color="#d2b48c" roughness={0.5} /></mesh>
        <mesh position={[(ptL / 2) - 0.03, 0, 0]} castShadow><boxGeometry args={[0.02, ptApron, ptW - 0.06]} /><meshStandardMaterial color="#d2b48c" roughness={0.5} /></mesh>
        <mesh position={[-(ptL / 2) + 0.03, 0, 0]} castShadow><boxGeometry args={[0.02, ptApron, ptW - 0.06]} /><meshStandardMaterial color="#d2b48c" roughness={0.5} /></mesh>
      </group>
      {/* Legs */}
      {[[(ptL / 2) - 0.05, (ptW / 2) - 0.05], [(ptL / 2) - 0.05, -(ptW / 2) + 0.05],
        [-(ptL / 2) + 0.05, (ptW / 2) - 0.05], [-(ptL / 2) + 0.05, -(ptW / 2) + 0.05],
      ].map(([x, z], idx) => (
        <mesh key={`pt-table-leg-${idx}`} position={[x, (ptH - 0.04) / 2, z]} castShadow>
          <boxGeometry args={[0.07, ptH - 0.04, 0.07]} /><meshStandardMaterial color="#d2b48c" roughness={0.4} />
        </mesh>
      ))}

      {/* Chair slots */}
      {chairPositions.map((pos, i) => (
        <group key={`pt-chair-slot-${i}`} position={[pos.x, 0, pos.z]} rotation={[0, pos.rot, 0]} onClick={(e) => toggleChair(i, e)}>
          {chairs[i] ? (
            <group>
              <mesh position={[-(ptChairW / 2) + 0.015, ptChairSeatH / 2, -(ptChairD / 2) + 0.015]} castShadow><boxGeometry args={[0.02, ptChairSeatH, 0.02]} /><meshStandardMaterial color="#b59975" roughness={0.5} /></mesh>
              <mesh position={[(ptChairW / 2) - 0.015, ptChairSeatH / 2, -(ptChairD / 2) + 0.015]} castShadow><boxGeometry args={[0.02, ptChairSeatH, 0.02]} /><meshStandardMaterial color="#b59975" roughness={0.5} /></mesh>
              <mesh position={[-(ptChairW / 2) + 0.015, ptChairSeatH / 2, (ptChairD / 2) - 0.015]} castShadow><boxGeometry args={[0.02, ptChairSeatH, 0.02]} /><meshStandardMaterial color="#b59975" roughness={0.5} /></mesh>
              <mesh position={[(ptChairW / 2) - 0.015, ptChairSeatH / 2, (ptChairD / 2) - 0.015]} castShadow><boxGeometry args={[0.02, ptChairSeatH, 0.02]} /><meshStandardMaterial color="#b59975" roughness={0.5} /></mesh>
              <mesh position={[-(ptChairW / 2) + 0.015, ptChairSeatH + (ptChairBackH - ptChairSeatH) / 2, -(ptChairD / 2) + 0.015]} castShadow><boxGeometry args={[0.02, ptChairBackH - ptChairSeatH, 0.02]} /><meshStandardMaterial color="#b59975" roughness={0.5} /></mesh>
              <mesh position={[(ptChairW / 2) - 0.015, ptChairSeatH + (ptChairBackH - ptChairSeatH) / 2, -(ptChairD / 2) + 0.015]} castShadow><boxGeometry args={[0.02, ptChairBackH - ptChairSeatH, 0.02]} /><meshStandardMaterial color="#b59975" roughness={0.5} /></mesh>
              <mesh position={[0, ptChairBackH - 0.04, -(ptChairD / 2) + 0.015]} castShadow><boxGeometry args={[ptChairW, 0.08, 0.018]} /><meshStandardMaterial color="#b59975" roughness={0.4} /></mesh>
              <mesh position={[0, ptChairSeatH + (ptChairBackH - ptChairSeatH) * 0.4, -(ptChairD / 2) + 0.015]} castShadow><boxGeometry args={[ptChairW - 0.03, 0.03, 0.015]} /><meshStandardMaterial color="#b59975" roughness={0.5} /></mesh>
              <mesh position={[0, ptChairSeatH, 0]} castShadow receiveShadow><boxGeometry args={[ptChairW, 0.03, ptChairD]} /><meshStandardMaterial color="#eae2d5" roughness={0.75} /></mesh>
            </group>
          ) : (
            <mesh position={[0, ptChairSeatH / 2, 0]}>
              <boxGeometry args={[ptChairW, ptChairSeatH, ptChairD]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.1} depthWrite={false} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  )
}
