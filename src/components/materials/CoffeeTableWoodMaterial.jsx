import { useCallback } from 'react'

export default function CoffeeTableWoodMaterial({ baseColor, roughness = 0.45 }) {
  const compileShader = useCallback((shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <color_fragment>',
      `#include <color_fragment>\n float grainLines = sin((vViewPosition.x + vViewPosition.z * 0.3) * 95.0) * 0.5 + 0.5; grainLines += cos(vViewPosition.y * 140.0) * 0.15; grainLines = clamp(grainLines, 0.0, 1.0); vec3 darkStreakColor = diffuseColor.rgb * 0.72; diffuseColor.rgb = mix(diffuseColor.rgb, darkStreakColor, grainLines * 0.28);`
    )
  }, [])
  return <meshStandardMaterial color={baseColor} roughness={roughness} metalness={0.05} onBeforeCompile={compileShader} customProgramCacheKey={() => 'wood_grain'} />
}
