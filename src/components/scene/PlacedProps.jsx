import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { TransformControls, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useStageStore } from '../../store/stageStore.js';
import { PropMesh } from '../props/PropMesh.jsx';
import { useStageBounds, useStageTopY } from './StagePlatform.jsx';
import { propSupportsToggleInteraction } from '../../constants/propCatalogSpecs.js';
import { getPropSelectionRingRadii } from '../../utils/propBounds.js';
import { normalizePropPosition, normalizeRotation } from '../../utils/propPosition.js';
import { snapValue } from '../../utils/snap.js';
import { PropCoordinateLabel } from './PropCoordinateLabel.jsx';
import { PropTagLabel } from './PropTagLabel.jsx';
import { BlueSelectionRing } from './SelectionRings.jsx';
import { beautifyPath } from '../../utils/pathBeautify.js';

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
  const { camera, raycaster, gl } = useThree();
  const ringDragging = useRef(false);
  const [ringDragActive, setRingDragActive] = useState(false);

  // --- Dancer mouse-drag state ---
  const isDancer = prop.type === 'dancer';
  const dancerDragging = useRef(false);
  const propRef = useRef(prop);
  propRef.current = prop;
  const [dancerPath, setDancerPath] = useState([]);
  const lastPathPoint = useRef(null);

  // --- Dancer animation state ---
  const dancerTravelTimes = useStageStore((s) => s.dancerTravelTimes);
  const dancerTravelDuration = dancerTravelTimes[prop.id] ?? 5;
  const playTriggeredIds = useStageStore((s) => s.playTriggeredIds);
  const clearPlayTriggerFor = useStageStore((s) => s.clearPlayTriggerFor);
  const animating = useRef(false);
  const animProgress = useRef(0);
  const animPath = useRef(null);
  const animTotalLen = useRef(0);

  // Respond to centralized play trigger
  useEffect(() => {
    if (!isDancer || !playTriggeredIds.includes(prop.id)) return;
    startDancerAnimationRef.current?.();
    clearPlayTriggerFor(prop.id);
  }, [isDancer, playTriggeredIds, prop.id, clearPlayTriggerFor]);

  // --- Dancer hover state ---
  const [dancerHovered, setDancerHovered] = useState(false);

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

  // --- Dancer mouse-drag: project pointer onto stage XZ plane ---
  const projectPointerToStage = useCallback(
    (event) => {
      const rect = gl.domElement.getBoundingClientRect();
      const px = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const py = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(new THREE.Vector2(px, py), camera);
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -topY);
      const target = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(plane, target)) {
        const x = THREE.MathUtils.clamp(target.x, -halfX + 0.25, halfX - 0.25);
        const z = THREE.MathUtils.clamp(target.z, -halfZ + 0.25, halfZ - 0.25);
        return [x, z];
      }
      return null;
    },
    [gl, camera, raycaster, topY, halfX, halfZ],
  );

  // --- Dancer press-drag-release: press to drag, release to fix ---
  const dancerDragOffset = useRef({ x: 0, z: 0 });

  useEffect(() => {
    if (!isDancer) return;

    const onMove = (event) => {
      if (!dancerDragging.current) return;
      const pos = projectPointerToStage(event);
      if (pos) {
        const newPosition = normalizePropPosition(
          pos[0] + dancerDragOffset.current.x,
          topY,
          pos[1] + dancerDragOffset.current.z,
          halfX, halfZ, false, topY, propRef.current,
        );
        updateProp(prop.id, { position: newPosition });

        // Collect path point (throttled by distance to avoid too many segments)
        const point = [newPosition[0], topY + 0.02, newPosition[2]];
        if (
          !lastPathPoint.current ||
          Math.hypot(
            point[0] - lastPathPoint.current[0],
            point[2] - lastPathPoint.current[2],
          ) > 0.1
        ) {
          lastPathPoint.current = point;
          setDancerPath((prev) => [...prev, point]);
        }
      }
    };

    const onUp = () => {
      if (!dancerDragging.current) return;
      dancerDragging.current = false;
      setOrbitEnabled(true);
      gl.domElement.style.cursor = '';
      // Beautify the path on release
      setDancerPath((prev) => {
        if (prev.length < 2) return prev;
        const beautified = beautifyPath(prev);
        return beautified.length >= 2 ? beautified : prev;
      });
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      dancerDragging.current = false;
      setOrbitEnabled(true);
      gl.domElement.style.cursor = '';
    };
  }, [isDancer, projectPointerToStage, updateProp, prop.id, topY, halfX, halfZ, setOrbitEnabled, gl]);

  const handleDancerPointerDown = useCallback(
    (e) => {
      if (!isDancer) return;
      e.stopPropagation();
      dancerDragging.current = true;
      setOrbitEnabled(false);
      gl.domElement.style.cursor = 'grabbing';
      // Clear previous path and record offset so the dancer stays put on press
      lastPathPoint.current = null;
      const pos = projectPointerToStage(e);
      if (pos) {
        const currentX = propRef.current.position[0];
        const currentZ = propRef.current.position[2];
        dancerDragOffset.current = { x: currentX - pos[0], z: currentZ - pos[1] };
        // Reset path to just the starting point
        const startPoint = [currentX, topY + 0.02, currentZ];
        lastPathPoint.current = startPoint;
        setDancerPath([startPoint]);
      } else {
        dancerDragOffset.current = { x: 0, z: 0 };
      }
    },
    [isDancer, setOrbitEnabled, gl, projectPointerToStage, topY],
  );

  const handleDancerClick = useCallback(
    (e) => {
      if (!isDancer) return;
      // If we were dragging, suppress the click
      if (dancerDragging.current) return;
      e.stopPropagation();
      handleClick(e);
    },
    [isDancer, handleClick],
  );

  // --- Dancer play animation ---
  const startDancerAnimation = useCallback(() => {
    if (dancerPath.length < 2) return;
    // Calculate total path length
    let totalLen = 0;
    for (let i = 1; i < dancerPath.length; i++) {
      totalLen += Math.hypot(
        dancerPath[i][0] - dancerPath[i - 1][0],
        dancerPath[i][2] - dancerPath[i - 1][2],
      );
    }
    if (totalLen < 0.001) return;
    animTotalLen.current = totalLen;
    animPath.current = dancerPath;
    animProgress.current = 0;
    animating.current = true;
  }, [dancerPath]);

  const startDancerAnimationRef = useRef(startDancerAnimation);
  startDancerAnimationRef.current = startDancerAnimation;

  useFrame((_, delta) => {
    if (!animating.current || !animPath.current) return;
    const speed = animTotalLen.current / Math.max(dancerTravelDuration, 0.1);
    animProgress.current += (speed * delta) / animTotalLen.current;
    if (animProgress.current >= 1) {
      animProgress.current = 1;
      animating.current = false;
    }
    // Interpolate position along path
    const path = animPath.current;
    const targetDist = animProgress.current * animTotalLen.current;
    let traveled = 0;
    for (let i = 1; i < path.length; i++) {
      const segLen = Math.hypot(
        path[i][0] - path[i - 1][0],
        path[i][2] - path[i - 1][2],
      );
      if (traveled + segLen >= targetDist || i === path.length - 1) {
        const t = segLen > 0 ? (targetDist - traveled) / segLen : 0;
        const tc = Math.max(0, Math.min(1, t));
        const x = path[i - 1][0] + (path[i][0] - path[i - 1][0]) * tc;
        const z = path[i - 1][2] + (path[i][2] - path[i - 1][2]) * tc;
        const newPosition = normalizePropPosition(
          x, topY, z, halfX, halfZ, false, topY, propRef.current,
        );
        updateProp(prop.id, { position: newPosition });
        break;
      }
      traveled += segLen;
    }
  });

  return (
    <>
      <group
        ref={groupRef}
        position={prop.position}
        rotation={[0, prop.rotation, 0]}
        scale={[prop.scale, prop.scale, prop.scale]}
        visible={showInScene}
        onClick={isDancer ? handleDancerClick : handleClick}
        onPointerDown={isDancer ? handleDancerPointerDown : undefined}
        onPointerOver={isDancer ? () => setDancerHovered(true) : undefined}
        onPointerOut={isDancer ? () => setDancerHovered(false) : undefined}
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
      {isDancer && dancerHovered && prop.tag && (
        <Html position={[prop.position[0], prop.position[1] + 1.9, prop.position[2]]} center>
          <div style={{
            background: 'rgba(0,0,0,0.75)',
            color: '#fff',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}>
            {prop.tag}
          </div>
        </Html>
      )}
      {isDancer && dancerPath.length > 1 && (
        <>
          <Line
            points={dancerPath}
            color="#ef4444"
            lineWidth={6}
            transparent
            opacity={0.8}
            depthTest
          />
          <Line
            points={[dancerPath[0], dancerPath[dancerPath.length - 1]]}
            color="#fca5a5"
            lineWidth={1}
            dashed
            dashSize={0.3}
            gapSize={0.2}
            transparent
            opacity={0.5}
            depthTest
          />
        </>
      )}
      {isDancer && dancerPath.length > 1 && !animating.current && (
        <mesh
          position={[dancerPath[0][0], dancerPath[0][1] + 0.15, dancerPath[0][2]]}
          onClick={(e) => { e.stopPropagation(); startDancerAnimation(); }}
          onPointerOver={() => { gl.domElement.style.cursor = 'pointer'; }}
          onPointerOut={() => { if (!dancerDragging.current) gl.domElement.style.cursor = ''; }}
          renderOrder={20}
        >
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.4} />
        </mesh>
      )}
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
