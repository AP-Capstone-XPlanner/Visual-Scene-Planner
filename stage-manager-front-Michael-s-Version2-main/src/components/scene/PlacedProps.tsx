import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import { TransformControls } from '@react-three/drei';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { useStageStore } from '../../store/stageStore';
import type { PlacedProp } from '../../types';
import { PropMesh } from '../props/PropMesh';
import { useStageBounds, useStageTopY } from './StagePlatform';
import { resolvePropDimensions } from '../../constants/propDimensions';
import { getPropSelectionRingRadii } from '../../utils/propBounds';
import { normalizePropPosition, normalizeRotation } from '../../utils/propPosition';
import { PropCoordinateLabel } from './PropCoordinateLabel';
import { PropTagLabel } from './PropTagLabel';
import { BlueSelectionRing } from './SelectionRings';

export function PlacedProps() {
  const props = useStageStore((s) => s.props);
  const selectedPropId = useStageStore((s) => s.selectedPropId);

  return (
    <group>
      {props.map((prop) => (
        <PlacedPropItem
          key={prop.id}
          prop={prop}
          isSelected={prop.id === selectedPropId}
        />
      ))}
    </group>
  );
}

function PlacedPropItem({
  prop,
  isSelected,
}: {
  prop: PlacedProp;
  isSelected: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const updateProp = useStageStore((s) => s.updateProp);
  const snapToGrid = useStageStore((s) => s.snapToGrid);
  const positioningMode = useStageStore((s) => s.positioningMode);
  const topY = useStageTopY();
  const { halfLength, halfWidth } = useStageBounds();
  const orbitControls = useThree((s) => s.controls);
  const ringDragging = useRef(false);
  const [ringDragActive, setRingDragActive] = useState(false);

  const ringRadii = useMemo(() => getPropSelectionRingRadii(prop), [prop]);

  const setOrbitEnabled = useCallback((enabled: boolean) => {
    if (orbitControls && 'enabled' in orbitControls) {
      (orbitControls as { enabled: boolean }).enabled = enabled;
    }
  }, [orbitControls]);

  const handleRingRotate = useCallback(
    (rotation: number) => {
      if (!groupRef.current) return;
      const r = normalizeRotation(rotation);
      groupRef.current.rotation.y = r;
      updateProp(prop.id, { rotation: r });
    },
    [prop.id, updateProp],
  );

  const handleRingDragChange = useCallback(
    (dragging: boolean) => {
      ringDragging.current = dragging;
      setRingDragActive(dragging);
      setOrbitEnabled(!dragging);
    },
    [setOrbitEnabled],
  );

  const showInScene = prop.visible;
  const showPositioning = isSelected && prop.visible && positioningMode;

  useEffect(() => {
    if (!showPositioning) {
      ringDragging.current = false;
      setRingDragActive(false);
      setOrbitEnabled(true);
    }
  }, [showPositioning, setOrbitEnabled]);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    const meshes: THREE.Mesh[] = [];
    group.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) meshes.push(child as THREE.Mesh);
    });

    const saved = meshes.map((mesh) => mesh.raycast.bind(mesh));
    if (showPositioning) {
      meshes.forEach((mesh) => {
        mesh.raycast = () => null;
      });
    }

    return () => {
      meshes.forEach((mesh, i) => {
        mesh.raycast = saved[i];
      });
    };
  }, [showPositioning, prop.id, prop.type, prop.scale]);

  const syncFromTransform = () => {
    if (!groupRef.current) return;
    const p = groupRef.current.position;
    const position = normalizePropPosition(
      p.x,
      p.y,
      p.z,
      halfLength,
      halfWidth,
      snapToGrid,
      topY,
      prop,
    );
    groupRef.current.position.set(...position);
    updateProp(prop.id, {
      position,
      rotation: normalizeRotation(groupRef.current.rotation.y),
    });
  };

  return (
    <>
      <group
        ref={groupRef}
        position={prop.position}
        rotation={[0, prop.rotation, 0]}
        scale={[prop.scale, prop.scale, prop.scale]}
        visible={showInScene}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          if (!prop.visible) return;
          e.stopPropagation();
          useStageStore.getState().selectProp(prop.id);
        }}
      >
        <PropMesh
          type={prop.type}
          color={prop.color}
          dimensions={resolvePropDimensions(prop)}
          chairVariant={prop.chairVariant}
        />
        <PropTagLabel tag={prop.tag} />
        {isSelected && showInScene && <PropCoordinateLabel prop={prop} />}
      </group>
      {showPositioning && (
        <group position={prop.position} rotation={[0, prop.rotation, 0]}>
          <BlueSelectionRing
            worldPosition={prop.position}
            rotation={prop.rotation}
            innerRadius={ringRadii.inner}
            outerRadius={ringRadii.outer}
            onRotate={handleRingRotate}
            onDragChange={handleRingDragChange}
          />
        </group>
      )}
      {isSelected && !prop.visible && (
        <group position={prop.position} rotation={[0, prop.rotation, 0]}>
          <HiddenPropMarker scale={prop.scale} color={prop.color} />
          <PropTagLabel tag={prop.tag} />
          <PropCoordinateLabel prop={prop} />
        </group>
      )}
      {showPositioning && (
        <TransformControls
          object={groupRef as RefObject<THREE.Object3D>}
          mode="translate"
          showX
          showY
          showZ
          enabled={!ringDragActive}
          onMouseDown={() => setOrbitEnabled(false)}
          onMouseUp={() => {
            if (!ringDragging.current) setOrbitEnabled(true);
          }}
          onChange={syncFromTransform}
        />
      )}
    </>
  );
}

function HiddenPropMarker({ scale, color }: { scale: number; color: string }) {
  return (
    <mesh scale={[1.6 * scale, 1.2 * scale, 1.6 * scale]} position={[0, 0.6 * scale, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial
        color={color}
        wireframe
        transparent
        opacity={0.45}
      />
    </mesh>
  );
}
