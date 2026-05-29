import { useEffect, useRef, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { CAMERA_CONTROL_KEYS, isTextInput } from '../../utils/keyboard';

const MOVE_SPEED = 8;
const ROTATE_SPEED = 1.2;
const ZOOM_SPEED = 15;

const forward = new THREE.Vector3();
const right = new THREE.Vector3();
const move = new THREE.Vector3();
const offset = new THREE.Vector3();
const spherical = new THREE.Spherical();
const up = new THREE.Vector3(0, 1, 0);

export function CameraKeyboardControls({
  controlsRef,
}: {
  controlsRef: RefObject<OrbitControlsImpl | null>;
}) {
  const { camera } = useThree();
  const keysPressed = useRef(new Set<string>());

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTextInput(event.target)) return;

      const key = event.key.toLowerCase();
      if (!CAMERA_CONTROL_KEYS.has(key)) return;

      keysPressed.current.add(key);
      event.preventDefault();
    };

    const onKeyUp = (event: KeyboardEvent) => {
      keysPressed.current.delete(event.key.toLowerCase());
    };

    const clearKeys = () => {
      keysPressed.current.clear();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', clearKeys);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', clearKeys);
    };
  }, []);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    const keys = keysPressed.current;
    if (!controls || keys.size === 0) return;

    let changed = false;

    camera.getWorldDirection(forward);
    forward.y = 0;
    if (forward.lengthSq() > 0) {
      forward.normalize();
    } else {
      forward.set(0, 0, -1);
    }
    right.crossVectors(forward, up).normalize();

    move.set(0, 0, 0);
    if (keys.has('w')) move.add(forward);
    if (keys.has('s')) move.sub(forward);
    if (keys.has('a')) move.sub(right);
    if (keys.has('d')) move.add(right);

    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(MOVE_SPEED * delta);
      camera.position.add(move);
      controls.target.add(move);
      changed = true;
    }

    offset.subVectors(camera.position, controls.target);
    if (offset.lengthSq() === 0) return;

    spherical.setFromVector3(offset);

    if (keys.has('q')) {
      spherical.theta -= ROTATE_SPEED * delta;
      changed = true;
    }
    if (keys.has('e')) {
      spherical.theta += ROTATE_SPEED * delta;
      changed = true;
    }
    if (keys.has('r')) {
      spherical.phi = Math.max(
        controls.minPolarAngle ?? 0,
        spherical.phi - ROTATE_SPEED * delta,
      );
      changed = true;
    }
    if (keys.has('f')) {
      spherical.phi = Math.min(
        controls.maxPolarAngle ?? Math.PI,
        spherical.phi + ROTATE_SPEED * delta,
      );
      changed = true;
    }
    if (keys.has('z')) {
      spherical.radius = Math.max(
        controls.minDistance ?? 0,
        spherical.radius - ZOOM_SPEED * delta,
      );
      changed = true;
    }
    if (keys.has('x')) {
      spherical.radius = Math.min(
        controls.maxDistance ?? Infinity,
        spherical.radius + ZOOM_SPEED * delta,
      );
      changed = true;
    }

    if (changed) {
      offset.setFromSpherical(spherical);
      camera.position.copy(controls.target).add(offset);
      controls.update();
    }
  });

  return null;
}
