import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Grid, OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { FLOOR_GRID } from '../../constants/stage';
import { useStageStore } from '../../store/stageStore';
import { CameraKeyboardControls } from './CameraKeyboardControls';
import { PlacementController } from './PlacementController';
import { PlacedProps } from './PlacedProps';
import { SceneBackground } from './SceneBackground';
import { SceneFloor } from './SceneFloor';
import { StageGuides } from './StageGuides';
import { StagePlatform } from './StagePlatform';

function SceneContent() {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const stage = useStageStore((s) => s.stage);
  const maxExtent = Math.max(stage.length, stage.width) + 8;

  return (
    <>
      <SceneBackground />
      <ambientLight intensity={0.55} />
      <hemisphereLight args={['#b8c9e0', '#2a2d38', 0.45]} />
      <directionalLight
        position={[12, 18, 8]}
        intensity={1.1}
        castShadow
        shadow-mapSize={[1024, 1024]}
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
      <PlacementController />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2 - 0.08}
        minDistance={5}
        maxDistance={maxExtent * 2}
        target={[0, stage.height + 0.5, 0]}
      />
      <CameraKeyboardControls controlsRef={controlsRef} />
    </>
  );
}

export function Scene3D() {
  return (
    <Canvas
      shadows
      tabIndex={-1}
      style={{ width: '100%', height: '100%', display: 'block', outline: 'none' }}
      camera={{ position: [14, 10, 14], fov: 45, near: 0.1, far: 200 }}
      gl={{ antialias: true }}
      onPointerDown={(e) => e.currentTarget.focus()}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.05;
      }}
    >
      <SceneContent />
    </Canvas>
  );
}
