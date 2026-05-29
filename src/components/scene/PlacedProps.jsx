import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { TransformControls } from '@react-three/drei';
import * as THREE from 'three';
import { useStageStore } from '../../store/stageStore.js';
import { PropMesh } from '../props/PropMesh.jsx';
import { useStageBounds, useStageTopY } from './StagePlatform.jsx';
import { propSupportsToggleInteraction } from '../../constants/propCatalogSpecs.js';
import { getPropSelectionRingRadii } from '../../utils/propBounds.js';
import { normalizePropPosition, normalizeRotation } from '../../utils/propPosition.js';
import { PropCoordinateLabel } from './PropCoordinateLabel.jsx';
import { PropTagLabel } from './PropTagLabel.jsx';
import { BlueSelectionRing } from './SelectionRings.jsx';

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

function PlacedPropItem({ prop, isSelected }) {
  const groupRef = useRef(null);
  const updateProp = useStageStore((s) => s.updateProp);
  const positioningMode = useStageStore((s) => s.positioningMode);
  const topY = useStageTopY();
  const { halfX, halfZ } = useStageBounds();
  const orbitControls = useThree((s) => s.controls);
  const ringDragging = useRef(false);
  const [ringDragActive, setRingDragActive] = useState(false);

  // Interactive toggle actions
  const togglePropInteraction = useStageStore((s) => s.togglePropInteraction);
  const toggleLamp = useStageStore((s) => s.toggleLamp);
  const toggleCurtain = useStageStore((s) => s.toggleCurtain);
  const togglePropTableChair = useStageStore((s) => s.togglePropTableChair);

  const ringRadii = useMemo(() => getPropSelectionRingRadii(prop), [prop]);

  const setOrbitEnabled = useCallback((enabled) => {
    if (orbitControls && 'enabled' in orbitControls) {
      orbitControls.enabled = enabled;
    }
  }, [orbitControls]);

  const handleRingRotate = useCallback(
    (rotation) => {
      if (!groupRef.current) return;
      const r = normalizeRotation(rotation);
      groupRef.current.rotation.y = r;
      updateProp(prop.id, { rotation: r });
    },
    [prop.id, updateProp],
  );

  const handleRingDragChange = useCallback(
    (dragging) => {
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

  // Disable raycasting on prop meshes during positioning so rings receive clicks
  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    const meshes = [];
    group.traverse((child) => {
      if (child.isMesh) meshes.push(child);
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

  const syncFromTransform = useCallback(() => {
    if (!groupRef.current) return;
    const p = groupRef.current.position;
    const position = normalizePropPosition(
      p.x, p.y, p.z, halfX, halfZ, false, topY, prop,
    );
    groupRef.current.position.set(...position);
    updateProp(prop.id, { position });
  }, [halfX, halfZ, topY, prop, updateProp]);

  const handleClick = (e) => {
    if (!prop.visible) return;
    e.stopPropagation();

    // If already selected and interactive, toggle instead of re-selecting
    if (isSelected && propSupportsToggleInteraction(prop.type)) {
      if (prop.type === 'dining_set') return; // handled by chair sub-clicks
      if (prop.type === 'prop_table') return; // handled by chair sub-clicks
      if (prop.type === 'floor_lamp_wood' || prop.type === 'floor_lamp_metal') {
        toggleLamp(prop.id);
        return;
      }
      if (prop.type === 'stage_curtain' || prop.type === 'window_curtain' || prop.type === 'door_flat') {
        toggleCurtain(prop.id);
        return;
      }
      togglePropInteraction(prop.id);
      return;
    }
    useStageStore.getState().selectProp(prop.id);
  };

  return (
    <>
      <group
        ref={groupRef}
        position={prop.position}
        rotation={[0, prop.rotation, 0]}
        scale={[prop.scale, prop.scale, prop.scale]}
        visible={showInScene}
        onClick={handleClick}
      >
        <PropMesh
          type={prop.type}
          interactionState={prop.interactionState}
          onTogglePropTableChair={
            isSelected && prop.type === 'prop_table'
              ? (index) => togglePropTableChair(prop.id, index)
              : undefined
          }
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
          object={groupRef}
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

function HiddenPropMarker({ scale, color }) {
  return (
    <mesh scale={[1.6 * scale, 1.2 * scale, 1.6 * scale]} position={[0, 0.6 * scale, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={0.45} />
    </mesh>
  );
}
