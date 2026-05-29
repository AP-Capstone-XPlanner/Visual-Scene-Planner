import { CouchFabricMaterial, CoffeeTableWoodMaterial } from '../materials/StagePropMaterials.jsx';
import { AnimatedDiningChair } from './AnimatedParts.jsx';

const TABLE_TAN = '#d2b48c';
const OUTLINE_WHITE = '#ffffff';

export function SofaModel() {
  const SOFA_BODY = 'rgb(143, 111, 51)';
  const SOFA_CUSHION = 'rgb(201, 173, 119)';

  return (
    <group>
      <mesh position={[0, 0.2, -0.325]} castShadow receiveShadow>
        <boxGeometry args={[1.83, 0.1, 0.87]} />
        <CouchFabricMaterial color={SOFA_BODY} />
      </mesh>
      <mesh position={[-0.435, 0.2, 0.385]} castShadow receiveShadow>
        <boxGeometry args={[0.85, 0.1, 0.55]} />
        <CouchFabricMaterial color={SOFA_BODY} />
      </mesh>
      <group position={[0, 0.525, -0.71]}>
        <mesh castShadow>
          <boxGeometry args={[1.83, 0.43, 0.1]} />
          <CouchFabricMaterial color={SOFA_BODY} />
        </mesh>
        <mesh position={[0, 0.215, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 1.83, 16]} />
          <CouchFabricMaterial color={SOFA_BODY} />
        </mesh>
      </group>
      <group position={[-0.885, 0.39, -0.325]}>
        <mesh castShadow>
          <boxGeometry args={[0.06, 0.38, 0.87]} />
          <CouchFabricMaterial color={SOFA_BODY} />
        </mesh>
        <mesh position={[0, 0.19, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.87, 16]} />
          <CouchFabricMaterial color={SOFA_BODY} />
        </mesh>
      </group>
      <group position={[0.885, 0.39, -0.325]}>
        <mesh castShadow>
          <boxGeometry args={[0.06, 0.38, 0.87]} />
          <CouchFabricMaterial color={SOFA_BODY} />
        </mesh>
        <mesh position={[0, 0.19, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.87, 16]} />
          <CouchFabricMaterial color={SOFA_BODY} />
        </mesh>
      </group>
      <group position={[0.41, 0.35, -0.275]}>
        <mesh castShadow>
          <boxGeometry args={[0.82, 0.18, 0.73]} />
          <CouchFabricMaterial color={SOFA_CUSHION} />
        </mesh>
        <mesh position={[0, 0, 0.365]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 0.82, 16]} />
          <CouchFabricMaterial color={SOFA_CUSHION} />
        </mesh>
      </group>
      <group position={[-0.435, 0.35, 0.1]}>
        <mesh castShadow>
          <boxGeometry args={[0.85, 0.18, 1.48]} />
          <CouchFabricMaterial color={SOFA_CUSHION} />
        </mesh>
        <mesh position={[0, 0, 0.74]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 0.85, 16]} />
          <CouchFabricMaterial color={SOFA_CUSHION} />
        </mesh>
      </group>
      <mesh position={[0, 0.52, -0.64]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 1.2, 24]} />
        <CouchFabricMaterial color={SOFA_CUSHION} />
      </mesh>
      <mesh position={[-0.82, 0.44, -0.25]} rotation={[0, 0, 0.15]} castShadow>
        <boxGeometry args={[0.05, 0.2, 0.5]} />
        <CouchFabricMaterial color={SOFA_CUSHION} />
      </mesh>
      <mesh position={[0.82, 0.44, -0.25]} rotation={[0, 0, -0.15]} castShadow>
        <boxGeometry args={[0.05, 0.2, 0.5]} />
        <CouchFabricMaterial color={SOFA_CUSHION} />
      </mesh>
      {[
        [-0.84, 0.075, -0.7],
        [0.84, 0.075, -0.7],
        [-0.84, 0.075, 0.05],
        [0.84, 0.075, 0.05],
        [-0.84, 0.075, 0.75],
        [-0.03, 0.075, 0.75],
      ].map(([x, y, z], i) => (
        <mesh key={`sofa-leg-${i}`} position={[x, y, z]} castShadow>
          <cylinderGeometry args={[0.03, 0.015, 0.15]} />
          <meshStandardMaterial color="#2d1f18" roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

export function CoffeeTableModel() {
  return (
    <group>
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.965, 0.03, 0.965]} />
        <CoffeeTableWoodMaterial baseColor={TABLE_TAN} />
      </mesh>
      <mesh position={[0, 0.466, 0]}>
        <boxGeometry args={[0.97, 0.002, 0.97]} />
        <meshStandardMaterial color={OUTLINE_WHITE} roughness={0.2} />
      </mesh>
      {[
        [-0.445, 0.22, -0.445],
        [0.445, 0.22, -0.445],
        [-0.445, 0.22, 0.445],
        [0.445, 0.22, 0.445],
      ].map(([x, y, z], i) => (
        <mesh key={`coffee-leg-${i}`} position={[x, y, z]} castShadow>
          <boxGeometry args={[0.075, 0.44, 0.075]} />
          <CoffeeTableWoodMaterial baseColor={TABLE_TAN} />
        </mesh>
      ))}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.885, 0.03, 0.885]} />
        <CoffeeTableWoodMaterial baseColor={TABLE_TAN} />
      </mesh>
      <mesh position={[0, 0.096, 0]}>
        <boxGeometry args={[0.89, 0.002, 0.89]} />
        <meshStandardMaterial color={OUTLINE_WHITE} roughness={0.3} />
      </mesh>
      <group position={[0, 0.33, 0.415]}>
        <mesh castShadow>
          <boxGeometry args={[0.81, 0.15, 0.03]} />
          <CoffeeTableWoodMaterial baseColor={TABLE_TAN} />
        </mesh>
        <mesh position={[0, 0, 0.016]}>
          <boxGeometry args={[0.79, 0.13, 0.002]} />
          <meshStandardMaterial color={OUTLINE_WHITE} roughness={0.2} wireframe />
        </mesh>
        <mesh position={[0, -0.01, 0.02]}>
          <boxGeometry args={[0.1, 0.04, 0.01]} />
          <meshStandardMaterial color="#2d2d2d" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
}

const DINING_W = 0.91;
const DINING_CHAIR_OFFSET = DINING_W / 2 + 0.18;

const DINING_CHAIRS = [
  { posX: -0.55, posZ: DINING_CHAIR_OFFSET, rotY: Math.PI },
  { posX: 0, posZ: DINING_CHAIR_OFFSET, rotY: Math.PI },
  { posX: 0.55, posZ: DINING_CHAIR_OFFSET, rotY: Math.PI },
  { posX: -0.55, posZ: -DINING_CHAIR_OFFSET, rotY: 0 },
  { posX: 0, posZ: -DINING_CHAIR_OFFSET, rotY: 0 },
  { posX: 0.55, posZ: -DINING_CHAIR_OFFSET, rotY: 0 },
];

export function DiningSetModel({ chairsPulled, onToggleChair }) {
  const diningL = 1.83;
  const diningW = 0.91;
  const diningH = 0.76;
  const apronThickness = 0.06;
  const chairSeatH = 0.48;
  const chairW = 0.42;
  const chairD = 0.42;
  const chairBackH = 0.95;
  const tableColor = '#d2b48c';
  const chairColor = '#b59975';
  const cushionTone = '#eae2d5';

  return (
    <group>
      <mesh position={[0, diningH - 0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[diningL, 0.04, diningW]} />
        <CoffeeTableWoodMaterial baseColor={tableColor} roughness={0.35} />
      </mesh>
      <group position={[0, diningH - 0.04 - apronThickness / 2, 0]}>
        <mesh position={[0, 0, diningW / 2 - 0.03]} castShadow>
          <boxGeometry args={[diningL - 0.1, apronThickness, 0.02]} />
          <meshStandardMaterial color={tableColor} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, -(diningW / 2) + 0.03]} castShadow>
          <boxGeometry args={[diningL - 0.1, apronThickness, 0.02]} />
          <meshStandardMaterial color={tableColor} roughness={0.5} />
        </mesh>
        <mesh position={[diningL / 2 - 0.03, 0, 0]} castShadow>
          <boxGeometry args={[0.02, apronThickness, diningW - 0.06]} />
          <meshStandardMaterial color={tableColor} roughness={0.5} />
        </mesh>
        <mesh position={[-(diningL / 2) + 0.03, 0, 0]} castShadow>
          <boxGeometry args={[0.02, apronThickness, diningW - 0.06]} />
          <meshStandardMaterial color={tableColor} roughness={0.5} />
        </mesh>
      </group>
      {[
        [diningL / 2 - 0.05, diningW / 2 - 0.05],
        [diningL / 2 - 0.05, -(diningW / 2) + 0.05],
        [-(diningL / 2) + 0.05, diningW / 2 - 0.05],
        [-(diningL / 2) + 0.05, -(diningW / 2) + 0.05],
      ].map(([x, z], idx) => (
        <mesh key={`table-leg-${idx}`} position={[x, (diningH - 0.04) / 2, z]} castShadow>
          <boxGeometry args={[0.07, diningH - 0.04, 0.07]} />
          <meshStandardMaterial color={tableColor} roughness={0.4} />
        </mesh>
      ))}
      {DINING_CHAIRS.map((chair, idx) => (
        <AnimatedDiningChair
          key={`dining-chair-${idx}`}
          posX={chair.posX}
          posZ={chair.posZ}
          rotY={chair.rotY}
          chairW={chairW}
          chairD={chairD}
          chairSeatH={chairSeatH}
          chairBackH={chairBackH}
          chairColor={chairColor}
          cushionTone={cushionTone}
          isPulled={chairsPulled?.[idx] ?? false}
          onTogglePull={onToggleChair ? () => onToggleChair(idx) : undefined}
        />
      ))}
    </group>
  );
}

export function BedModel() {
  const bedWidth = 1.65;
  const bedLength = 2.15;
  const baseFrameH = 0.28;
  const headHeight = 1.12;
  const naturalTimberColor = '#c6a072';
  const mattressWhite = '#f5f5f0';

  return (
    <group>
      <mesh position={[0, baseFrameH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[bedWidth, baseFrameH, bedLength]} />
        <meshStandardMaterial color={naturalTimberColor} roughness={0.45} />
      </mesh>
      <mesh position={[0, baseFrameH + 0.02, -(bedLength / 2) + 0.05]} castShadow>
        <boxGeometry args={[bedWidth, headHeight - baseFrameH, 0.06]} />
        <meshStandardMaterial color={naturalTimberColor} roughness={0.4} />
      </mesh>
      <mesh position={[0, baseFrameH + 0.13, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[bedWidth - 0.06, 0.22, bedLength - 0.04]} />
        <meshStandardMaterial color={mattressWhite} roughness={0.9} />
      </mesh>
      {[
        [-0.55, baseFrameH + 0.24, -(bedLength / 2) + 0.22],
        [0.55, baseFrameH + 0.24, -(bedLength / 2) + 0.22],
      ].map(([px, py, pz], i) => (
        <mesh key={`pillow-${i}`} position={[px, py, pz]} castShadow>
          <boxGeometry args={[0.52, 0.1, 0.72]} />
          <meshStandardMaterial color="#eaeaea" roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

export function BookshelfModel() {
  const shelfColor = '#6d4c41';
  return (
    <group>
      {/* frame */}
      <mesh position={[0, 0.61, 0]} castShadow>
        <boxGeometry args={[0.77, 1.22, 0.3]} />
        <meshStandardMaterial color={shelfColor} roughness={0.5} />
      </mesh>
      {/* shelves */}
      {[0.2, 0.45, 0.7, 0.95].map((y, i) => (
        <mesh key={`shelf-${i}`} position={[0, y, 0]} castShadow>
          <boxGeometry args={[0.73, 0.02, 0.28]} />
          <meshStandardMaterial color="#5d3a2e" roughness={0.4} />
        </mesh>
      ))}
      {/* decor items */}
      {[
        [-0.18, 0.33, 0.06],
        [0.2, 0.33, -0.04],
        [-0.2, 0.58, 0.0],
        [0.15, 0.58, -0.06],
        [0.05, 0.83, 0.04],
        [-0.12, 0.83, -0.04],
        [-0.2, 1.08, -0.02],
        [0.18, 1.08, 0.02],
      ].map(([x, y, z], i) => (
        <mesh key={`decor-${i}`} position={[x, y, z]} castShadow>
          <boxGeometry args={[0.06 + i * 0.005, 0.06 + i * 0.005, 0.06 + i * 0.005]} />
          <meshStandardMaterial color={['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'][i]} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}
