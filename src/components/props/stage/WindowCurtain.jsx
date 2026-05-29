import { useRef, useCallback } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

export default function AnimatedWindowCurtain({ isOpen, duration = 2 }) {
  const leftRef = useRef()
  const rightRef = useRef()
  const cWidth = 2.44
  const cHeight = 2.74
  const uniforms = useRef({ uTime: { value: 0 }, uProgress: { value: 0 }, uHeight: { value: cHeight }, uWidth: { value: cWidth } })

  useFrame((state, delta) => {
    uniforms.current.uTime.value = state.clock.elapsedTime
    const speed = 1.0 / duration
    uniforms.current.uProgress.value = isOpen
      ? Math.min(1.0, uniforms.current.uProgress.value + speed * delta)
      : Math.max(0.0, uniforms.current.uProgress.value - speed * delta)
    const p = uniforms.current.uProgress.value
    const easedP = p * p * (3.0 - 2.0 * p)
    const targetScaleX = 1.0 - (0.80 * easedP)
    const targetPosX = (cWidth / 4) + ((cWidth / 4) - ((cWidth / 2 * 0.20) / 2)) * easedP
    if (leftRef.current && rightRef.current) {
      leftRef.current.position.x = -targetPosX
      leftRef.current.scale.x = targetScaleX
      rightRef.current.position.x = targetPosX
      rightRef.current.scale.x = targetScaleX
    }
  })

  const compileWindowDrape = useCallback((shader) => {
    shader.uniforms.uTime = uniforms.current.uTime
    shader.uniforms.uProgress = uniforms.current.uProgress
    shader.uniforms.uHeight = uniforms.current.uHeight
    shader.vertexShader = `uniform float uTime; uniform float uProgress; uniform float uHeight; varying vec2 vCustomUv; varying float vShadow;\n${shader.vertexShader}`
    shader.vertexShader = shader.vertexShader.replace(
      '#include <beginnormal_vertex>',
      `#include <beginnormal_vertex>\n float clampSwingN = clamp((0.5 - (position.y / uHeight)) + 0.1, 0.0, 1.0); float dzdx = cos(position.x * 18.0) * 18.0 * mix(0.02, 0.2, uProgress) * clampSwingN * 2.0; float dwdx = cos(position.y * 3.0 + position.x * 2.0 + uTime * 1.5) * 2.0 * 0.02 * clampSwingN; objectNormal = normalize(vec3(-(dzdx + dwdx), 0.0, 1.0));`
    )
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>\n vCustomUv = uv; float structuralFolds = sin(position.x * 18.0); vShadow = structuralFolds; transformed.z += (structuralFolds * mix(0.02, 0.2, uProgress) + sin(position.y * 3.0 + position.x * 2.0 + uTime * 1.5) * 0.02) * clamp((0.5 - (position.y / uHeight)) + 0.1, 0.0, 1.0);`
    )
    shader.fragmentShader = `varying vec2 vCustomUv; varying float vShadow;\n${shader.fragmentShader}`
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <color_fragment>',
      `#include <color_fragment>\n diffuseColor.rgb *= mix(0.4, 1.2, (vShadow + 1.0) * 0.5);`
    )
  }, [])

  return (
    <group position={[0, cHeight / 2, 0]}>
      <mesh position={[0, 0, -0.1]}><boxGeometry args={[1.6, 1.8, 0.02]} /><meshStandardMaterial color="#f0f0f0" /></mesh>
      <mesh position={[0, 0, -0.09]}><boxGeometry args={[1.5, 1.7, 0.02]} /><meshStandardMaterial color="#88ccff" roughness={0.1} metalness={0.9} transparent opacity={0.6} /></mesh>
      <mesh position={[0, cHeight / 2 - 0.05, 0.05]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.015, 0.015, cWidth + 0.2, 16]} /><meshStandardMaterial color="#333" metalness={0.8} /></mesh>
      <mesh ref={leftRef} position={[-cWidth / 4, 0, 0]} castShadow side={THREE.DoubleSide}><planeGeometry args={[cWidth / 2, cHeight, 64, 32]} /><meshStandardMaterial color="#e6ddc5" roughness={0.9} side={THREE.DoubleSide} onBeforeCompile={compileWindowDrape} customProgramCacheKey={() => 'window_curtain'} /></mesh>
      <mesh ref={rightRef} position={[cWidth / 4, 0, 0]} castShadow side={THREE.DoubleSide}><planeGeometry args={[cWidth / 2, cHeight, 64, 32]} /><meshStandardMaterial color="#e6ddc5" roughness={0.9} side={THREE.DoubleSide} onBeforeCompile={compileWindowDrape} customProgramCacheKey={() => 'window_curtain'} /></mesh>
    </group>
  )
}
