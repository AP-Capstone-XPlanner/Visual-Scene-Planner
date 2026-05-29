import { useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStageStore } from '../../store/stageStore.js';
import { createNewProp } from '../../utils/propDefaults.js';
import { snapValue } from '../../utils/snap.js';
import { PropMesh } from '../props/PropMesh.jsx';
import { useStageBounds, useStageTopY } from './StagePlatform.jsx';

export function PlacementController() {
  const mode = useStageStore((s) => s.mode);
  const placementType = useStageStore((s) => s.placementType);
  const placementDraft = useStageStore((s) => s.placementDraft);
  const snapToGrid = useStageStore((s) => s.snapToGrid);
  const addProp = useStageStore((s) => s.addProp);
  const cancelPlacement = useStageStore((s) => s.cancelPlacement);
  const topY = useStageTopY();
  const { halfX, halfZ } = useStageBounds();
  const { camera, raycaster, gl } = useThree();

  const [ghostPos, setGhostPos] = useState(null);

  const isPlacing = mode === 'place' && placementType;
  const isCopyPlacement = Boolean(placementDraft);
  const snapPlacement = snapToGrid && !isCopyPlacement;
  const previewScale = placementDraft?.scale ?? 1;
  const previewRotation = placementDraft?.rotation ?? 0;

  useEffect(() => {
    if (!isPlacing) {
      setGhostPos(null);
      return;
    }

    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -topY);
    const target = new THREE.Vector3();
    const pointer = new THREE.Vector2();

    const onMove = (event) => {
      const rect = gl.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      if (raycaster.ray.intersectPlane(plane, target)) {
        let x = snapValue(target.x, snapPlacement);
        let z = snapValue(target.z, snapPlacement);
        x = THREE.MathUtils.clamp(x, -halfX + 0.5, halfX - 0.5);
        z = THREE.MathUtils.clamp(z, -halfZ + 0.5, halfZ - 0.5);
        setGhostPos([x, topY, z]);
      }
    };

    const onKey = (event) => {
      if (event.key === 'Escape') cancelPlacement();
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('keydown', onKey);
    };
  }, [isPlacing, camera, raycaster, gl, topY, snapPlacement, halfX, halfZ, cancelPlacement]);

  if (!isPlacing || !placementType) return null;

  const buildPlacementProp = (position) => {
    if (placementDraft) {
      return createNewProp({
        ...placementDraft,
        type: placementType,
        position,
      });
    }
    return createNewProp({
      type: placementType,
      position,
      rotation: 0,
    });
  };

  const placeAt = (position) => {
    addProp(buildPlacementProp(position));
  };

  const positionFromPoint = (x, z) => {
    let sx = snapValue(x, snapPlacement);
    let sz = snapValue(z, snapPlacement);
    sx = THREE.MathUtils.clamp(sx, -halfX + 0.5, halfX - 0.5);
    sz = THREE.MathUtils.clamp(sz, -halfZ + 0.5, halfZ - 0.5);
    return [sx, topY, sz];
  };

  const placeFromEvent = (point) => {
    placeAt(positionFromPoint(point.x, point.z));
  };

  return (
    <>
      <mesh
        position={[0, topY + 0.005, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          placeFromEvent(e.point);
        }}
      >
        <planeGeometry args={[halfX * 2, halfZ * 2]} />
        <meshBasicMaterial visible={false} />
      </mesh>
      {ghostPos && (
        <group
          position={ghostPos}
          rotation={[0, previewRotation, 0]}
          scale={[previewScale, previewScale, previewScale]}
        >
          <PropMesh
            type={placementType}
            ghost={!isCopyPlacement}
            interactionState={placementDraft?.interactionState}
          />
        </group>
      )}
    </>
  );
}
