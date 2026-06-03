import { useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Grid, OrbitControls } from '@react-three/drei';
import { FLOOR_GRID } from '../../constants/stage.js';
import { useStageStore } from '../../store/stageStore.js';
import { CameraKeyboardControls } from './CameraKeyboardControls.jsx';
import { PlacementController } from './PlacementController.jsx';
import { PlacedProps } from './PlacedProps.jsx';
import { SceneBackground } from './SceneBackground.jsx';
import { SceneFloor } from './SceneFloor.jsx';
import { StageGuides } from './StageGuides.jsx';
import { StagePlatform } from './StagePlatform.jsx';
import { DefaultCamera } from './DefaultCamera.jsx';
import { StageZoneGuides } from './StageZoneGuides.jsx';
import { StageEnclosure } from './StageEnclosure.jsx';
import { KeyboardShortcutsBridge } from './KeyboardShortcutsBridge.jsx';
import { handleGlobalKeyDown } from '../../utils/globalKeyboard.js';

function SceneContent() {
  const controlsRef = useRef(null);
  const stage = useStageStore((s) => s.stage);
  const maxExtent = Math.max(stage.length, stage.width) + 8;
  const orbitTarget = useMemo(
    () => [0, useStageStore.getState().stage.height + 0.5, 0],
    [],
  );

  return (
    <>
      <DefaultCamera />
      <KeyboardShortcutsBridge />
      <SceneBackground />
      <ambientLight intensity={0.55} />
      <hemisphereLight args={['#b8c9e0', '#2a2d38', 0.45]} />
      <directionalLight
        position={[12, 18, 8]}
        intensity={1.1}
        castShadow={false}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <directionalLight position={[-8, 10, -6]} intensity={0.35} />
      <Grid
        args={[80, 80]}
        cellSize={FLOOR_GRID.cellSize}
        cellThickness={FLOOR_GRID.cellThickness}
        sectionSize={FLOOR_GRID.sectionSize}
        sectionThickness={FLOOR_GRID.sectionThickness}
        fadeDistance={50}
        position={[0, 0.001, 0]}
        cellColor={FLOOR_GRID.cellColor}
        sectionColor={FLOOR_GRID.sectionColor}
      />
      <SceneFloor />
      <StagePlatform />
      <StageGuides />
      <PlacedProps />
      <StageZoneGuides />
      <StageEnclosure />
      <PlacementController />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2 - 0.01}
        minDistance={5}
        maxDistance={maxExtent * 2}
        target={orbitTarget}
      />
      <CameraKeyboardControls controlsRef={controlsRef} />
    </>
  );
}

export function Scene3D() {
  return (
    <Canvas
      tabIndex={-1}
      style={{ width: '100%', height: '100%', display: 'block', outline: 'none' }}
      camera={{ position: [2, 8, 18], fov: 45, near: 0.1, far: 200 }}
      gl={{ antialias: true }}
      onPointerDown={(e) => e.currentTarget.focus()}
      onKeyDown={(e) => handleGlobalKeyDown(e.nativeEvent)}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.05;
      }}
    >
      <SceneContent />
    </Canvas>
  );
}
