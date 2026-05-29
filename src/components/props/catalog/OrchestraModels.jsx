import { CoffeeTableWoodMaterial } from '../materials/StagePropMaterials.jsx';

export function MusicianChairModel() {
  const mC_width = 0.51;
  const mC_depth = 0.58;
  const mC_frameH = 0.47;
  const mC_totalH = 0.88;

  return (
    <group>
      <mesh position={[-(mC_width / 2) + 0.015, mC_frameH / 2, mC_depth / 2 - 0.02]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, mC_frameH, 16]} />
        <meshStandardMaterial color="#1f1f2e" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[mC_width / 2 - 0.015, mC_frameH / 2, mC_depth / 2 - 0.02]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, mC_frameH, 16]} />
        <meshStandardMaterial color="#1f1f2e" metalness={0.7} roughness={0.3} />
      </mesh>
      <group position={[0, 0, -(mC_depth / 2) + 0.02]}>
        <mesh position={[-(mC_width / 2) + 0.015, mC_totalH / 2, 0]} rotation={[-0.08, 0, 0]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, mC_totalH, 16]} />
          <meshStandardMaterial color="#1f1f2e" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[mC_width / 2 - 0.015, mC_totalH / 2, 0]} rotation={[-0.08, 0, 0]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, mC_totalH, 16]} />
          <meshStandardMaterial color="#1f1f2e" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
      <mesh position={[0, mC_frameH, 0]} castShadow receiveShadow>
        <boxGeometry args={[mC_width - 0.02, 0.035, mC_depth - 0.04]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>
      <mesh position={[0, mC_totalH - 0.14, -(mC_depth / 2) + 0.05]} rotation={[-0.08, 0, 0]} castShadow>
        <boxGeometry args={[mC_width - 0.04, 0.24, 0.025]} />
        <meshStandardMaterial color="#181818" roughness={0.7} />
      </mesh>
    </group>
  );
}

export function ConductorPodiumModel() {
  return (
    <group>
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.0, 0.2, 1.0]} />
        <meshStandardMaterial color="#333333" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.201, 0]} receiveShadow>
        <boxGeometry args={[0.96, 0.005, 0.96]} />
        <meshStandardMaterial color="#7f8c8d" roughness={0.9} />
      </mesh>
      {[
        [-0.46, -0.46], [0.46, -0.46], [-0.46, 0.46], [0.46, 0.46],
      ].map(([px, pz], idx) => (
        <mesh key={`podium-foot-${idx}`} position={[px, 0.025, pz]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.05, 12]} />
          <meshStandardMaterial color="#111" roughness={0.5} />
        </mesh>
      ))}
      <group position={[0, 0.2, -0.47]}>
        <mesh position={[-0.36, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.0175, 0.0175, 1.0, 16]} />
          <meshStandardMaterial color="#111111" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0.36, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.0175, 0.0175, 1.0, 16]} />
          <meshStandardMaterial color="#111111" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.0175, 0.0175, 0.72, 16]} />
          <meshStandardMaterial color="#111111" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.72, 16]} />
          <meshStandardMaterial color="#111111" metalness={0.5} roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}

export function MusicStandModel() {
  return (
    <group>
      <mesh position={[0, 0.01, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 0.02, 6]} />
        <meshStandardMaterial color="#333" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.48, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.93, 12]} />
        <meshStandardMaterial color="#222" metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.1, 0.15]} rotation={[-0.3, 0, 0]} castShadow>
        <boxGeometry args={[0.45, 0.32, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.95, 0.15]} rotation={[-0.3, 0, 0]} castShadow>
        <boxGeometry args={[0.48, 0.02, 0.04]} />
        <meshStandardMaterial color="#333" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

export function MusicalInstrumentsModel() {
  return (
    <group>
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.04, 8]} />
        <meshStandardMaterial color="#333" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.02, 0.52, 8]} />
        <meshStandardMaterial color="#deb941" metalness={0.9} roughness={0.15} />
      </mesh>
      <group position={[0, 0.55, 0]} rotation={[0.2, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.03, 0.04, 0.28, 16]} />
          <meshStandardMaterial color="#deb941" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0.04, 0, 0]} castShadow>
          <boxGeometry args={[0.06, 0.2, 0.01]} />
          <meshStandardMaterial color="#c4a030" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}
