import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { useStageStore } from '../../store/stageStore.js';

/**
 * Sets the default view once on load: camera on +Z (downstage), facing the stage.
 */
export function DefaultCamera() {
  const { camera } = useThree();
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const { length, width, height } = useStageStore.getState().stage;
    const viewDistance = Math.max(length * 0.55 + 9, 14);
    const viewHeight = height + 7.5;
    const slightSide = width * 0.06;

    camera.position.set(slightSide, viewHeight, viewDistance);
    camera.lookAt(0, height + 0.5, 0);
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
}
