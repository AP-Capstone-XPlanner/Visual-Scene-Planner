import { useCallback } from 'react'

export default function CouchFabricMaterial({ color, roughness = 0.85 }) {
  const compileShader = useCallback((shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <normal_fragment_maps>',
      `#include <normal_fragment_maps>\n float weaveU = step(0.5, fract(vViewPosition.x * 280.0)); float weaveV = step(0.5, fract(vViewPosition.y * 280.0)); float edgeNoise = (weaveU == weaveV ? 1.0 : 0.0) * 0.15; normal = normalize(normal + vec3(edgeNoise * 0.1, edgeNoise * 0.1, 0.0));`
    )
  }, [])
  return <meshStandardMaterial color={color} roughness={roughness} metalness={0.05} bumpScale={0.012} onBeforeCompile={compileShader} customProgramCacheKey={() => 'couch_fabric'} />
}
