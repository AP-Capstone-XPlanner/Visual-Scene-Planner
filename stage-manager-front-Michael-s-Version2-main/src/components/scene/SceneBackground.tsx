import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useStageStore } from '../../store/stageStore';

export function SceneBackground() {
  const skyColor = useStageStore((s) => s.skyColor);
  const { gl } = useThree();

  useEffect(() => {
    gl.setClearColor(skyColor);
  }, [skyColor, gl]);

  return <color attach="background" args={[skyColor]} />;
}
