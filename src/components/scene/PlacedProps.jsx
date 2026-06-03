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
  const { camera, raycaster, gl } = useThree();
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

  // --- Dancer mouse-drag (basic, no paths) ---
  const isDancer = prop.type === 'dancer';
  const choreographyOpen = useStageStore((s) => s.choreographyOpen);
  const choreographyOpenRef = useRef(choreographyOpen);
  choreographyOpenRef.current = choreographyOpen;
  const savedPaths = useStageStore((s) => s.savedPaths);
  const savedPathsRef = useRef([]);
  savedPathsRef.current = savedPaths;
  const savePath = useStageStore((s) => s.savePath);
  const dancerTravelTimes = useStageStore((s) => s.dancerTravelTimes);
  const stageTexture = useStageStore((s) => s.stageTexture);
  const formations = useStageStore((s) => s.formations);
  const stationaryMarkers = useStageStore((s) => s.stationaryMarkers);
  const selectedFormationId = useStageStore((s) => s.selectedFormationId);
  const hiddenPathIds = useStageStore((s) => s.hiddenPathIds);
  const dancerDragging = useRef(false);
  const propRef = useRef(prop);
  propRef.current = prop;
  const dancerDragOffset = useRef({ x: 0, z: 0 });
  const dragStartPos = useRef(null);
  const [dancerPath, setDancerPath] = useState([]);
  const dancerPathRef = useRef([]);
  dancerPathRef.current = dancerPath;
  const lastPathPoint = useRef(null);
  const preDragPosition = useRef(null);
  const lastMoveTime = useRef(0);
  const pathStraightened = useRef(false);
  const [dancerHovered, setDancerHovered] = useState(false);
  const DRAG_THRESHOLD = 3;

  // Clear local path when choreography closes
  useEffect(() => {
    if (!choreographyOpen) { setDancerPath([]); lastPathPoint.current = null; }
  }, [choreographyOpen]);

  // Determine which saved paths to render
  const visiblePaths = useMemo(() => {
    if (!isDancer) return [];
    return [...savedPaths].filter((p) => p.dancerId === prop.id).sort((a, b) => a.startTime - b.startTime);
  }, [isDancer, savedPaths, prop.id]);

  // --- Animation ---
  const playTriggeredIds = useStageStore((s) => s.playTriggeredIds);
  const clearPlayTriggerFor = useStageStore((s) => s.clearPlayTriggerFor);
  const isPaused = useStageStore((s) => s.isPaused);
  const animating = useRef(false);
  const animSegments = useRef([]);
  const animSegmentIdx = useRef(0);

  const startDancerAnimation = useCallback(() => {
    const paths = useStageStore.getState().savedPaths;
    const markers = useStageStore.getState().stationaryMarkers;
    const dancerPaths = paths.filter((p) => p.dancerId === prop.id).sort((a, b) => a.startTime - b.startTime);
    if (dancerPaths.length === 0) return;
    const segments = [];
    let prevEnd = 0;
    dancerPaths.forEach((path) => {
      // Insert holds that fall between the previous end and this path's start
      const pathStart = path.startTime;
      markers
        .filter((m) => m.time >= prevEnd && m.time + m.duration <= pathStart)
        .sort((a, b) => a.time - b.time)
        .forEach((m) => {
          if (m.time > prevEnd) {
            segments.push({ kind: 'wait', duration: m.time - prevEnd });
            prevEnd = m.time;
          }
          segments.push({ kind: 'wait', duration: m.duration });
          prevEnd += m.duration;
        });
      if (pathStart > prevEnd) {
        segments.push({ kind: 'wait', duration: pathStart - prevEnd });
      }
      segments.push({ kind: 'path', path, progress: 0, duration: path.duration });
      prevEnd = Math.max(path.endTime || pathStart + path.duration, pathStart + path.duration);
    });
    animSegments.current = segments;
    animSegmentIdx.current = 0;
    animating.current = true;
  }, [prop.id]);

  const startDancerAnimationRef = useRef(startDancerAnimation);
  startDancerAnimationRef.current = startDancerAnimation;

  // Respond to play trigger
  useEffect(() => {
    if (!isDancer || !playTriggeredIds.includes(prop.id)) return;
    startDancerAnimationRef.current();
    clearPlayTriggerFor(prop.id);
  }, [isDancer, playTriggeredIds, prop.id, clearPlayTriggerFor]);

  useFrame((_, delta) => {
    if (!animating.current || isPaused) return;
    const segments = animSegments.current;
    const idx = animSegmentIdx.current;
    if (idx >= segments.length) { animating.current = false; useStageStore.getState().setPlaybackTime(0); return; }
    const seg = segments[idx];
    // Compute current playback time: sum of completed segment durations + current progress
    let currentTime = 0;
    for (let i = 0; i < idx; i++) currentTime += segments[i].duration;
    if (seg.kind === 'wait') {
      seg.progress = (seg.progress || 0) + delta / seg.duration;
      currentTime += (seg.progress || 0) * seg.duration;
      if (seg.progress >= 1) { animSegmentIdx.current = idx + 1; }
      if (!seg._lastPbReport || Math.abs(currentTime - seg._lastPbReport) > 0.1) {
        seg._lastPbReport = currentTime;
        useStageStore.getState().setPlaybackTime(currentTime);
      }
      return;
    }
    const path = seg.path;
    seg.progress += delta / path.duration;
    if (seg.progress >= 1) { seg.progress = 1; animSegmentIdx.current = idx + 1; }
    // Report playback time (throttled to ~10fps to avoid store spam)
    let ct = 0;
    for (let i = 0; i < idx; i++) ct += segments[i].duration;
    ct += seg.progress * path.duration;
    if (!seg._lastPbReport || Math.abs(ct - seg._lastPbReport) > 0.1) {
      seg._lastPbReport = ct;
      useStageStore.getState().setPlaybackTime(ct);
    }
    const pts = path.points;
    let total = 0;
    for (let i = 1; i < pts.length; i++) total += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][2] - pts[i - 1][2]);
    const dist = seg.progress * total;
    let traveled = 0;
    for (let i = 1; i < pts.length; i++) {
      const sl = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][2] - pts[i - 1][2]);
      if (traveled + sl >= dist || i === pts.length - 1) {
        const t = sl > 0 ? (dist - traveled) / sl : 0;
        const tc = Math.max(0, Math.min(1, t));
        const x = pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * tc;
        const z = pts[i - 1][2] + (pts[i][2] - pts[i - 1][2]) * tc;
        updateProp(prop.id, { position: normalizePropPosition(x, topY, z, halfX, halfZ, false, topY, propRef.current) });
        break;
      }
      traveled += sl;
    }
  });

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

  const handleDancerPointerDown = useCallback(
    (e) => {
      if (!isDancer) return;
      useStageStore.getState().selectProp(prop.id);
      dragStartPos.current = { x: e.clientX, y: e.clientY };
      dancerDragging.current = false;
      const pos = projectPointerToStage(e);
      if (pos) {
        dancerDragOffset.current = {
          x: propRef.current.position[0] - pos[0],
          z: propRef.current.position[2] - pos[1],
        };
      } else {
        dancerDragOffset.current = { x: 0, z: 0 };
      }
    },
    [isDancer, projectPointerToStage],
  );

  useEffect(() => {
    if (!isDancer) return;

    const onMove = (event) => {
      if (!dancerDragging.current && dragStartPos.current) {
        const dx = event.clientX - dragStartPos.current.x;
        const dy = event.clientY - dragStartPos.current.y;
        if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return;
        dancerDragging.current = true;
        setOrbitEnabled(false);
        gl.domElement.style.cursor = 'grabbing';
        // Save pre-drag position for redo
        preDragPosition.current = [...propRef.current.position];
        lastMoveTime.current = Date.now();
        pathStraightened.current = false;
        // Start path recording
        const startPt = [propRef.current.position[0], topY + 0.02, propRef.current.position[2]];
        lastPathPoint.current = startPt;
        setDancerPath([startPt]);
      }
      if (!dancerDragging.current) return;
      const pos = projectPointerToStage(event);
      if (pos) {
        let newX = pos[0] + dancerDragOffset.current.x;
        let newZ = pos[1] + dancerDragOffset.current.z;

        // Magnetic guides toward cheer mat lines/centers (hold Shift to bypass)
        if (stageTexture === 'cheer_mats' && !event.shiftKey) {
          const stageW = halfX * 2;
          const matW = stageW / 9;
          const targets = [];
          for (let i = 0; i <= 9; i++) targets.push(-halfX + i * matW);
          for (let i = 0; i < 9; i++) targets.push(-halfX + (i + 0.5) * matW);
          const maxPull = matW * 0.35;
          for (const t of targets) {
            const d = Math.abs(newX - t);
            if (d < maxPull) {
              // Smooth magnetic pull: stronger when closer, fades to 0 at maxPull
              const strength = Math.pow(1 - d / maxPull, 2);
              newX = newX + (t - newX) * strength;
            }
          }
        }

        const newPosition = normalizePropPosition(
          newX, topY, newZ, halfX, halfZ, false, topY, propRef.current,
        );
        updateProp(prop.id, { position: newPosition });

        // Collect path point when choreography mode is active
        if (!choreographyOpenRef.current) return;
        const point = [newPosition[0], topY + 0.02, newPosition[2]];
        if (!lastPathPoint.current || Math.hypot(point[0] - lastPathPoint.current[0], point[2] - lastPathPoint.current[2]) > 0.1) {
          lastPathPoint.current = point;
          lastMoveTime.current = Date.now();
          if (pathStraightened.current && dancerPathRef.current.length === 2) {
            // Update the endpoint of the straight line
            setDancerPath([dancerPathRef.current[0], point]);
          } else {
            pathStraightened.current = false;
            setDancerPath((prev) => [...prev, point]);
          }
        } else if (!pathStraightened.current && lastMoveTime.current > 0 && Date.now() - lastMoveTime.current > 300 && dancerPathRef.current.length > 1) {
          pathStraightened.current = true;
          setDancerPath([dancerPathRef.current[0], point]);
        }
      }
    };

    const onUp = () => {
      dancerDragging.current = false;
      dragStartPos.current = null;
      setOrbitEnabled(true);
      gl.domElement.style.cursor = '';
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      dancerDragging.current = false;
      dragStartPos.current = null;
      setOrbitEnabled(true);
      gl.domElement.style.cursor = '';
    };
  }, [isDancer, projectPointerToStage, updateProp, prop.id, topY, halfX, halfZ, setOrbitEnabled, gl]);

  return (
    <>
      <group
        ref={groupRef}
        position={prop.position}
        rotation={[0, prop.rotation, 0]}
        scale={[prop.scale, prop.scale, prop.scale]}
        visible={showInScene}
        onClick={handleClick}
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
        {isDancer && (
          <mesh visible={false} position={[0, 0.85, 0]}>
            <sphereGeometry args={[1.0, 16, 16]} />
          </mesh>
        )}
        {!isDancer && <PropTagLabel tag={prop.tag} />}
        {isSelected && showInScene && !isDancer && <PropCoordinateLabel prop={prop} />}
      </group>
      {isDancer && dancerHovered && prop.tag && (
        <Html position={(() => {
          const isTopView = camera.position.y > Math.abs(camera.position.x) && camera.position.y > Math.abs(camera.position.z);
          if (isTopView) {
            const dx = camera.position.x - prop.position[0];
            const dz = camera.position.z - prop.position[2];
            const dist = Math.hypot(dx, dz) || 1;
            return [prop.position[0] + (dx / dist) * 0.6, prop.position[1] + 0.9, prop.position[2] + (dz / dist) * 0.6];
          }
          return [prop.position[0], prop.position[1] + 1.9, prop.position[2]];
        })()} center>
          <div style={{ background: 'rgba(0,0,0,0.75)', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
            {prop.tag}
          </div>
        </Html>
      )}
      {isDancer && isSelected && showInScene && (
        <>
          <Line points={[[-halfX, topY + 0.01, prop.position[2]], [halfX, topY + 0.01, prop.position[2]]]}
            color="#fbbf24" lineWidth={0.5} transparent opacity={0.35} depthTest />
          <Line points={[[prop.position[0], topY + 0.01, -halfZ], [prop.position[0], topY + 0.01, halfZ]]}
            color="#fbbf24" lineWidth={0.5} transparent opacity={0.35} depthTest />
        </>
      )}
      {isDancer && choreographyOpen && visiblePaths.map((vpath) => (
        <Line key={vpath.id}
          points={vpath.points}
          color="#ef4444"
          lineWidth={6}
          transparent
          opacity={0.8}
          depthTest
        />
      ))}
      {isDancer && choreographyOpen && dancerPath.length > 1 && (
        <>
          <Line points={dancerPath} color="#ef4444" lineWidth={6} transparent opacity={0.8} depthTest />
          <mesh
            position={[dancerPath[0][0], dancerPath[0][1] + 0.15, dancerPath[0][2]]}
            onClick={(e) => {
              e.stopPropagation();
              const dur = dancerTravelTimes[prop.id] ?? 5;
              const holdsEnd = Math.max(0, ...stationaryMarkers.map((m) => m.time + m.duration));
              const myPaths = savedPathsRef.current.filter((p) => p.dancerId === prop.id);
              const prevPathEnd = myPaths.length > 0
                ? Math.max(...myPaths.map((p) => p.endTime || p.startTime + p.duration))
                : 0;
              // Start after whichever is later: previous path or holds
              const startT = Math.max(prevPathEnd, holdsEnd);
              savePath(prop.id, dancerPathRef.current, startT, dur);
              setDancerPath([]);
            }}
            renderOrder={20}
          >
            <cylinderGeometry args={[0.12, 0.12, 0.06, 8]} />
            <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.5} />
          </mesh>
          <mesh
            position={[dancerPath[0][0] + 0.3, dancerPath[0][1] + 0.15, dancerPath[0][2]]}
            onClick={(e) => {
              e.stopPropagation();
              setDancerPath([]);
              if (preDragPosition.current) {
                updateProp(prop.id, { position: preDragPosition.current });
              }
            }}
            renderOrder={20}
          >
            <cylinderGeometry args={[0.12, 0.12, 0.06, 8]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
          </mesh>
        </>
      )}
      {isDancer && choreographyOpen && visiblePaths.length > 0 && !animating.current && (
        <mesh
          position={[visiblePaths[0].points[0][0], visiblePaths[0].points[0][1] + 0.2, visiblePaths[0].points[0][2]]}
          onClick={(e) => { e.stopPropagation(); startDancerAnimation(); }}
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
          {!isDancer && <PropTagLabel tag={prop.tag} />}
          {!isDancer && <PropCoordinateLabel prop={prop} />}
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
