export function CouchFabricMaterial({ color, roughness = 0.85 }) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness}
      metalness={0.05}
      bumpScale={0.012}
      onBeforeCompile={(shader) => {
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <normal_fragment_maps>',
          `
          #include <normal_fragment_maps>
          float weaveU = step(0.5, fract(vViewPosition.x * 280.0));
          float weaveV = step(0.5, fract(vViewPosition.y * 280.0));
          float edgeNoise = (weaveU == weaveV ? 1.0 : 0.0) * 0.15;
          normal = normalize(normal + vec3(edgeNoise * 0.1, edgeNoise * 0.1, 0.0));
          `,
        );
      }}
    />
  );
}

export function CoffeeTableWoodMaterial({ baseColor, roughness = 0.45 }) {
  return (
    <meshStandardMaterial
      color={baseColor}
      roughness={roughness}
      metalness={0.05}
      onBeforeCompile={(shader) => {
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <color_fragment>',
          `
          #include <color_fragment>
          float grainLines = sin((vViewPosition.x + vViewPosition.z * 0.3) * 95.0) * 0.5 + 0.5;
          grainLines += cos(vViewPosition.y * 140.0) * 0.15;
          grainLines = clamp(grainLines, 0.0, 1.0);
          vec3 darkStreakColor = diffuseColor.rgb * 0.72;
          diffuseColor.rgb = mix(diffuseColor.rgb, darkStreakColor, grainLines * 0.28);
          `,
        );
      }}
    />
  );
}

export const BRASS_MATERIAL = (
  <meshStandardMaterial
    color="rgb(222, 185, 65)"
    metalness={0.95}
    roughness={0.15}
  />
);

export const SILVER_MATERIAL = (
  <meshStandardMaterial
    color="rgb(220, 220, 225)"
    metalness={0.9}
    roughness={0.1}
  />
);

export const PAD_MATERIAL = (
  <meshStandardMaterial color="#efdfbb" roughness={0.6} />
);
