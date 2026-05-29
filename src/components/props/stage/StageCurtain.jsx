import { useRef, useEffect, useCallback } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

export default function AnimatedCurtain({ isOpen, bounds, duration = 3 }) {
  const leftRef = useRef()
  const rightRef = useRef()
  const valanceRef = useRef()
  const { width, height } = bounds
  const uniforms = useRef({ uTime: { value: 0 }, uProgress: { value: 0 }, uHeight: { value: bounds.height }, uWidth: { value: bounds.width } })

  useEffect(() => {
    uniforms.current.uHeight.value = bounds.height
    uniforms.current.uWidth.value = bounds.width
  }, [bounds.height, bounds.width])

  useFrame((state, delta) => {
    uniforms.current.uTime.value = state.clock.elapsedTime
    const speed = 1.0 / duration
    uniforms.current.uProgress.value = isOpen
      ? Math.min(1.0, uniforms.current.uProgress.value + speed * delta)
      : Math.max(0.0, uniforms.current.uProgress.value - speed * delta)
    const p = uniforms.current.uProgress.value
    const easedP = p * p * (3.0 - 2.0 * p)
    const targetScaleX = 1.0 - (0.85 * easedP)
    const targetPosX = (width / 4) + ((width / 4) - ((width / 2 * 0.15) / 2)) * easedP

    if (leftRef.current && rightRef.current) {
      leftRef.current.position.x = -targetPosX
      leftRef.current.scale.x = targetScaleX
      rightRef.current.position.x = targetPosX
      rightRef.current.scale.x = targetScaleX
    }
  })

  const compileLeft = useCallback((shader) => {
    shader.uniforms.uTime = uniforms.current.uTime
    shader.uniforms.uProgress = uniforms.current.uProgress
    shader.uniforms.uHeight = uniforms.current.uHeight
    shader.vertexShader = `uniform float uTime; uniform float uProgress; uniform float uHeight; varying vec2 vCustomUv; varying float vShadow; \n${shader.vertexShader}`
    shader.vertexShader = shader.vertexShader.replace(
      '#include <beginnormal_vertex>',
      `#include <beginnormal_vertex>\n float pleatFreqN = 18.0; float pleatDepthN = mix(0.04, 0.35, uProgress); float clampSwingN = clamp((0.5 - (position.y / uHeight)) + 0.05, 0.0, 1.0); float dzdx = cos(position.x * pleatFreqN) * pleatFreqN * pleatDepthN * clampSwingN * 3.0; float dwdx = cos(position.y * 3.0 + position.x * 2.0 + uTime * 2.5) * 2.0 * 0.03 * clampSwingN; objectNormal = normalize(vec3(-(dzdx + dwdx), 0.0, 1.0));`
    )
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>\n vCustomUv = uv; float structuralFolds = sin(position.x * 18.0); vShadow = structuralFolds; float wind = sin(position.y * 3.0 + position.x * 2.0 + uTime * 2.5) * 0.03; transformed.z += (structuralFolds * mix(0.04, 0.35, uProgress) + wind) * clamp((0.5 - (position.y / uHeight)) + 0.05, 0.0, 1.0);`
    )
    shader.fragmentShader = `varying vec2 vCustomUv; varying float vShadow;\n${shader.fragmentShader}`
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <color_fragment>',
      `#include <color_fragment>\n float innerEdgeDist = (1.0 - vCustomUv.x); float isTrim = clamp(step(innerEdgeDist, 0.04) + (step(innerEdgeDist, 0.06) * (1.0 - step(innerEdgeDist, 0.05))) + step(vCustomUv.y, 0.03) + (step(vCustomUv.y, 0.05) * (1.0 - step(vCustomUv.y, 0.04))), 0.0, 1.0); diffuseColor.rgb *= mix(0.1, 1.4, (vShadow + 1.0) * 0.5); diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.95, 0.75, 0.25) * mix(0.7, 1.3, (vShadow + 1.0) * 0.5), isTrim);`
    )
  }, [])

  const compileRight = useCallback((shader) => {
    shader.uniforms.uTime = uniforms.current.uTime
    shader.uniforms.uProgress = uniforms.current.uProgress
    shader.uniforms.uHeight = uniforms.current.uHeight
    shader.vertexShader = `uniform float uTime; uniform float uProgress; uniform float uHeight; varying vec2 vCustomUv; varying float vShadow; \n${shader.vertexShader}`
    shader.vertexShader = shader.vertexShader.replace(
      '#include <beginnormal_vertex>',
      `#include <beginnormal_vertex>\n float pleatFreqN = 18.0; float pleatDepthN = mix(0.04, 0.35, uProgress); float clampSwingN = clamp((0.5 - (position.y / uHeight)) + 0.05, 0.0, 1.0); float dzdx = cos(position.x * pleatFreqN) * pleatFreqN * pleatDepthN * clampSwingN * 3.0; float dwdx = cos(position.y * 3.0 + position.x * 2.0 + uTime * 2.5) * 2.0 * 0.03 * clampSwingN; objectNormal = normalize(vec3(-(dzdx + dwdx), 0.0, 1.0));`
    )
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>\n vCustomUv = uv; float structuralFolds = sin(position.x * 18.0); vShadow = structuralFolds; float wind = sin(position.y * 3.0 + position.x * 2.0 + uTime * 2.5) * 0.03; transformed.z += (structuralFolds * mix(0.04, 0.35, uProgress) + wind) * clamp((0.5 - (position.y / uHeight)) + 0.05, 0.0, 1.0);`
    )
    shader.fragmentShader = `varying vec2 vCustomUv; varying float vShadow;\n${shader.fragmentShader}`
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <color_fragment>',
      `#include <color_fragment>\n float innerEdgeDist = vCustomUv.x; float isTrim = clamp(step(innerEdgeDist, 0.04) + (step(innerEdgeDist, 0.06) * (1.0 - step(innerEdgeDist, 0.05))) + step(vCustomUv.y, 0.03) + (step(vCustomUv.y, 0.05) * (1.0 - step(vCustomUv.y, 0.04))), 0.0, 1.0); diffuseColor.rgb *= mix(0.1, 1.4, (vShadow + 1.0) * 0.5); diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.95, 0.75, 0.25) * mix(0.7, 1.3, (vShadow + 1.0) * 0.5), isTrim);`
    )
  }, [])

  const injectValancePhysics = useCallback((shader) => {
    shader.uniforms.uWidth = uniforms.current.uWidth
    shader.vertexShader = `uniform float uWidth; varying vec2 vCustomUv; varying float vShadow; varying float vSag;\n${shader.vertexShader}`
    shader.vertexShader = shader.vertexShader.replace(
      '#include <beginnormal_vertex>',
      `#include <beginnormal_vertex>\n float swagCountN = max(3.0, floor(uWidth / 3.0)); float swagXN = fract(uv.x * swagCountN); float dropFactorN = (1.0 - uv.y); float dZdx = cos(swagXN * 3.14159) * 3.14159 * swagCountN / uWidth * 0.4 * dropFactorN * 2.0; float pleatDeriv = cos(swagXN * 3.14159 * 12.0) * 3.14159 * 12.0 * swagCountN / uWidth * 0.05 * dropFactorN * 2.0; objectNormal = normalize(vec3(-(dZdx + pleatDeriv), 0.0, 1.0));`
    )
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>\n vCustomUv = uv; float swagCount = max(3.0, floor(uWidth / 3.0)); float swagX = fract(uv.x * swagCount); float sag = sin(swagX * 3.14159265); float pleat = sin(swagX * 3.14159265 * 12.0); vShadow = pleat; vSag = sag; float dropFactor = (1.0 - uv.y); transformed.z += (sag * 0.4 + pleat * 0.05) * dropFactor;`
    )
    shader.fragmentShader = `uniform float uWidth; varying vec2 vCustomUv; varying float vShadow; varying float vSag;\n${shader.fragmentShader}`
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <color_fragment>',
      `#include <color_fragment>\n float swagCount = max(3.0, floor(uWidth / 3.0)); float swagX = fract(vCustomUv.x * swagCount); float sag = sin(swagX * 3.14159265); float cutoff = 0.40 - (sag * 0.35); if (vCustomUv.y < cutoff) discard; float isTrim = clamp(step(vCustomUv.y, cutoff + 0.03) + (step(vCustomUv.y, cutoff + 0.05) * (1.0 - step(vCustomUv.y, cutoff + 0.04))) + step(0.94, vCustomUv.y) + (step(0.90, vCustomUv.y) * (1.0 - step(0.92, vCustomUv.y))), 0.0, 1.0); float ao = mix(0.1, 1.4, (vShadow + 1.0) * 0.5) * mix(0.2, 1.0, 1.0 - vSag * 0.6); diffuseColor.rgb *= ao; diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.95, 0.75, 0.25) * mix(0.7, 1.3, (vShadow + 1.0) * 0.5), isTrim);`
    )
  }, [])

  return (
    <group position={[0, height / 2, 0]}>
      <spotLight position={[-width / 3, height / 2 + 4, 6]} angle={0.9} penumbra={0.5} intensity={3.5} color="#ffe5cc" />
      <spotLight position={[width / 3, height / 2 + 4, 6]} angle={0.9} penumbra={0.5} intensity={3.5} color="#ffccdd" />
      <pointLight position={[0, -height / 2 + 1, 4]} intensity={2.0} color="#ff1a40" distance={15} />
      <mesh ref={valanceRef} position={[0, height / 2 - 1.0, 0.15]} castShadow side={THREE.DoubleSide}>
        <planeGeometry args={[width + 1.0, 2.5, 128, 32]} />
        <meshStandardMaterial color="#8a0000" roughness={0.6} metalness={0.25} side={THREE.DoubleSide} onBeforeCompile={injectValancePhysics} customProgramCacheKey={() => 'curtain_valance'} />
      </mesh>
      <mesh ref={leftRef} position={[-width / 4, 0, -0.05]} castShadow side={THREE.DoubleSide}>
        <planeGeometry args={[width / 2, height, 64, 32]} />
        <meshStandardMaterial color="#8a0000" roughness={0.6} metalness={0.25} side={THREE.DoubleSide} onBeforeCompile={compileLeft} customProgramCacheKey={() => 'curtain_left'} />
      </mesh>
      <mesh ref={rightRef} position={[width / 4, 0, -0.05]} castShadow side={THREE.DoubleSide}>
        <planeGeometry args={[width / 2, height, 64, 32]} />
        <meshStandardMaterial color="#8a0001" roughness={0.6} metalness={0.25} side={THREE.DoubleSide} onBeforeCompile={compileRight} customProgramCacheKey={() => 'curtain_right'} />
      </mesh>
    </group>
  )
}
