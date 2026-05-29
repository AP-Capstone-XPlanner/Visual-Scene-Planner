import * as THREE from 'three';

export function adjustColorBrightness(hex: string, amount: number): string {
  const color = new THREE.Color(hex);
  color.offsetHSL(0, 0, amount);
  return `#${color.getHexString()}`;
}

export function isValidHexColor(value: string): boolean {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value);
}

export function normalizeHexColor(value: string, fallback: string): string {
  if (!value.startsWith('#')) value = `#${value}`;
  return isValidHexColor(value) ? value.toLowerCase() : fallback;
}
