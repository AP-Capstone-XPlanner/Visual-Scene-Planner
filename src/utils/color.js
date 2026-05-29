import * as THREE from 'three';

export function adjustColorBrightness(hex, amount) {
  const color = new THREE.Color(hex);
  color.offsetHSL(0, 0, amount);
  return `#${color.getHexString()}`;
}

export function isValidHexColor(value) {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value);
}

export function normalizeHexColor(value, fallback) {
  if (!value.startsWith('#')) value = `#${value}`;
  return isValidHexColor(value) ? value.toLowerCase() : fallback;
}

export function getContrastHighlightColor(baseHex) {
  const luminance = getRelativeLuminance(baseHex);
  return luminance > 0.62 ? '#0f4cff' : '#8be9ff';
}

export function getRelativeLuminance(hex) {
  const color = new THREE.Color(hex);
  return 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
}

export function getContrastOnBackground(hex) {
  const lum = getRelativeLuminance(hex);
  const onLight = lum > 0.52;
  if (onLight) {
    return {
      line: '#1c1917',
      text: '#18181b',
      textShadow:
        '0 0 4px rgba(255, 255, 255, 0.85), 0 1px 2px rgba(255, 255, 255, 0.7)',
    };
  }
  return {
    line: '#f4f4f5',
    text: '#fafafa',
    textShadow:
      '0 0 4px rgba(0, 0, 0, 0.75), 0 1px 2px rgba(0, 0, 0, 0.6)',
  };
}
