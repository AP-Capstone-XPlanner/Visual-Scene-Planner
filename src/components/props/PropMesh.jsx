import { getPropCatalogSpec } from '../../constants/propCatalogSpecs.js';
import { PropCatalogModel } from './catalog/PropCatalogModel.jsx';

function GhostPlaceholder({ type }) {
  const { width, height, depth } = getPropCatalogSpec(type);
  return (
    <mesh position={[0, height / 2, 0]}>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial
        color="#60a5fa"
        transparent
        opacity={0.45}
        emissive="#1e3a5f"
        emissiveIntensity={0.3}
        roughness={0.72}
      />
    </mesh>
  );
}

export function PropMesh({ type, ghost, interactionState, onToggleDiningChair, onTogglePropTableChair }) {
  if (ghost) {
    return <GhostPlaceholder type={type} />;
  }

  return (
    <PropCatalogModel
      type={type}
      interactionState={interactionState}
      onToggleDiningChair={onToggleDiningChair}
      onTogglePropTableChair={onTogglePropTableChair}
    />
  );
}
