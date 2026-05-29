import { Html } from '@react-three/drei';

export function PropTagLabel({ tag }: { tag: string }) {
  const trimmed = tag.trim();
  if (!trimmed) return null;

  return (
    <Html
      position={[0, 2.1, 0]}
      center
      distanceFactor={10}
      style={{ pointerEvents: 'none' }}
    >
      <div className="prop-tag-label">{trimmed}</div>
    </Html>
  );
}
