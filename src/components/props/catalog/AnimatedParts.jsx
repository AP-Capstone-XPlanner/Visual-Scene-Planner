import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CoffeeTableWoodMaterial } from '../materials/StagePropMaterials.jsx';

export function AnimatedWardrobe({ isOpen }) {
  const leftDoorRef = useRef(null);
  const centerDoorRef = useRef(null);
  const rightDoorRef = useRef(null);

  const wWidth = 1.2;
  const wHeight = 1.82;
  const wDepth = 0.55;
  const wWoodTone = '#8d6e63';
  const wMetalTone = '#b0bec5';

  useFrame(() => {
    const openAngle = Math.PI * 0.75;
    const targetCenterAngle = isOpen ? openAngle : 0;
    const targetLeftAngle = isOpen ? -openAngle : 0;
    const targetRightAngle = isOpen ? openAngle : 0;

    if (leftDoorRef.current) {
      leftDoorRef.current.rotation.y +=
        (targetLeftAngle - leftDoorRef.current.rotation.y) * 0.05;
    }
    if (centerDoorRef.current) {
      centerDoorRef.current.rotation.y +=
        (targetCenterAngle - centerDoorRef.current.rotation.y) * 0.05;
    }
    if (rightDoorRef.current) {
      rightDoorRef.current.rotation.y +=
        (targetRightAngle - rightDoorRef.current.rotation.y) * 0.05;
    }
  });

  return (
    <group position={[0, wHeight / 2, 0]}>
      <mesh position={[0, wHeight * 0.005, -(wDepth / 2) + 0.01]} castShadow receiveShadow>
        <boxGeometry args={[wWidth, wHeight - 0.06, 0.02]} />
        <meshStandardMaterial color={wWoodTone} roughness={0.5} />
      </mesh>
      <mesh position={[-(wWidth / 2) + 0.015, wHeight * 0.005, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.03, wHeight - 0.06, wDepth - 0.02]} />
        <CoffeeTableWoodMaterial baseColor={wWoodTone} roughness={0.45} />
      </mesh>
      <mesh position={[wWidth / 2 - 0.015, wHeight * 0.005, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.03, wHeight - 0.06, wDepth - 0.02]} />
        <CoffeeTableWoodMaterial baseColor={wWoodTone} roughness={0.45} />
      </mesh>
      <mesh position={[0, wHeight / 2 - 0.015, 0]} castShadow>
        <boxGeometry args={[wWidth + 0.04, 0.04, wDepth + 0.03]} />
        <CoffeeTableWoodMaterial baseColor={wWoodTone} roughness={0.4} />
      </mesh>
      <mesh position={[0, -(wHeight / 2) + 0.03, 0]} castShadow receiveShadow>
        <boxGeometry args={[wWidth, 0.06, wDepth]} />
        <CoffeeTableWoodMaterial baseColor={wWoodTone} roughness={0.6} />
      </mesh>
      <mesh position={[0.15, wHeight * 0.005, 0.01]} castShadow receiveShadow>
        <boxGeometry args={[0.02, wHeight - 0.1, wDepth - 0.04]} />
        <meshStandardMaterial color={wWoodTone} roughness={0.5} />
      </mesh>
      <mesh position={[-0.2, wHeight / 2 - 0.18, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.73, 16]} />
        <meshStandardMaterial color={wMetalTone} metalness={0.8} roughness={0.2} />
      </mesh>
      <group ref={leftDoorRef} position={[-wWidth / 3, 0, wDepth / 2]}>
        <mesh castShadow>
          <boxGeometry args={[wWidth / 3 - 0.015, wHeight - 0.06, 0.03]} />
          <meshStandardMaterial color={wWoodTone} roughness={0.5} />
        </mesh>
      </group>
      <group ref={centerDoorRef} position={[0, 0, wDepth / 2]}>
        <mesh castShadow>
          <boxGeometry args={[wWidth / 3 - 0.015, wHeight - 0.06, 0.03]} />
          <meshStandardMaterial color={wWoodTone} roughness={0.5} />
        </mesh>
      </group>
      <group ref={rightDoorRef} position={[wWidth / 3, 0, wDepth / 2]}>
        <mesh castShadow>
          <boxGeometry args={[wWidth / 3 - 0.015, wHeight - 0.06, 0.03]} />
          <meshStandardMaterial color={wWoodTone} roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

export function AnimatedNightstand({ isDrawerOpen }) {
  const drawerRef = useRef(null);
  const drawerOffset = 0.25;

  useFrame(() => {
    if (!drawerRef.current) return;
    const target = isDrawerOpen ? drawerOffset : 0;
    drawerRef.current.position.z += (target - drawerRef.current.position.z) * 0.08;
  });

  return (
    <group>
      <mesh position={[0, 0.34, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.47, 0.68, 0.4]} />
        <meshStandardMaterial color="#fcfdfd" roughness={0.5} />
      </mesh>
      <group ref={drawerRef} position={[0, 0.38, 0.2]}>
        <mesh castShadow>
          <boxGeometry args={[0.43, 0.12, 0.36]} />
          <meshStandardMaterial color="#f0f0f0" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.02, 0.18]}>
          <boxGeometry args={[0.06, 0.02, 0.01]} />
          <meshStandardMaterial color="#b0bec5" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

export function AnimatedDiningChair({
  posX, posZ, rotY, chairW, chairD, chairSeatH, chairBackH, chairColor, cushionTone,
  isPulled, onTogglePull,
}) {
  const pullDist = 0.45;

  return (
    <group
      position={[
        posX + (isPulled ? (posX > 0 ? 1 : posX < 0 ? -1 : 0) * pullDist * 0.5 : 0),
        0,
        posZ + (isPulled ? (posZ > 0 ? 1 : posZ < 0 ? -1 : 0) * pullDist : 0),
      ]}
      rotation={[0, rotY, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onTogglePull?.();
      }}
    >
      {/* Legs */}
      {[
        [-chairW / 2 + 0.03, chairSeatH / 2, -chairD / 2 + 0.03],
        [chairW / 2 - 0.03, chairSeatH / 2, -chairD / 2 + 0.03],
        [-chairW / 2 + 0.03, chairSeatH / 2, chairD / 2 - 0.03],
        [chairW / 2 - 0.03, chairSeatH / 2, chairD / 2 - 0.03],
      ].map(([lx, ly, lz], i) => (
        <mesh key={`chair-leg-${i}`} position={[lx, ly, lz]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, chairSeatH, 12]} />
          <meshStandardMaterial color={chairColor} roughness={0.3} />
        </mesh>
      ))}
      {/* Seat */}
      <mesh position={[0, chairSeatH, 0]} castShadow>
        <boxGeometry args={[chairW, 0.03, chairD]} />
        <meshStandardMaterial color={cushionTone} roughness={0.7} />
      </mesh>
      {/* Back + posts */}
      {[-chairW / 2 + 0.02, chairW / 2 - 0.02].map((bx, i) => (
        <mesh key={`back-post-${i}`} position={[bx, (chairSeatH + chairBackH) / 2, -chairD / 2 + 0.02]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, chairBackH - chairSeatH, 12]} />
          <meshStandardMaterial color={chairColor} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[0, chairBackH - 0.08, -chairD / 2 + 0.02]} castShadow>
        <boxGeometry args={[chairW - 0.04, 0.16, 0.03]} />
        <meshStandardMaterial color={chairColor} roughness={0.3} />
      </mesh>
    </group>
  );
}
