import * as THREE from 'three';
import type { StageTexture } from '../types';

const textureCache = new Map<StageTexture, THREE.CanvasTexture>();

function seededNoise(x: number, y: number, seed: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
  return n - Math.floor(n);
}

function drawDarkWood(ctx: CanvasRenderingContext2D, size: number) {
  const plankH = size / 8;
  for (let row = 0; row < 8; row++) {
    const y = row * plankH;
    const base = row % 2 === 0 ? '#3d2814' : '#4a3220';
    ctx.fillStyle = base;
    ctx.fillRect(0, y, size, plankH);

    for (let g = 0; g < 40; g++) {
      const gx = (g / 40) * size;
      ctx.strokeStyle = `rgba(20, 12, 6, ${0.08 + seededNoise(g, row, 2) * 0.12})`;
      ctx.lineWidth = 0.5 + seededNoise(g, row, 3);
      ctx.beginPath();
      ctx.moveTo(gx, y + 2);
      ctx.lineTo(gx + 8, y + plankH - 2);
      ctx.stroke();
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.fillRect(0, y + plankH - 1, size, 1);
  }

  for (let i = 0; i < 6000; i++) {
    const px = seededNoise(i, 0, 4) * size;
    const py = seededNoise(i, 1, 5) * size;
    const a = seededNoise(i, 2, 6) * 0.06;
    ctx.fillStyle = `rgba(30, 18, 8, ${a})`;
    ctx.fillRect(px, py, 1, 1);
  }
}

function drawLightWood(ctx: CanvasRenderingContext2D, size: number) {
  const plankH = size / 10;
  for (let row = 0; row < 10; row++) {
    const y = row * plankH;
    const base = row % 2 === 0 ? '#c9a66b' : '#d4b57a';
    ctx.fillStyle = base;
    ctx.fillRect(0, y, size, plankH);

    for (let g = 0; g < 50; g++) {
      const gx = (g / 50) * size;
      ctx.strokeStyle = `rgba(120, 80, 40, ${0.05 + seededNoise(g, row, 7) * 0.1})`;
      ctx.lineWidth = 0.4;
      ctx.beginPath();
      ctx.moveTo(gx, y + 1);
      ctx.lineTo(gx + 6, y + plankH - 1);
      ctx.stroke();
    }

    ctx.fillStyle = 'rgba(80, 50, 20, 0.1)';
    ctx.fillRect(0, y + plankH - 1, size, 1);
  }

  for (let i = 0; i < 5000; i++) {
    const px = seededNoise(i, 3, 8) * size;
    const py = seededNoise(i, 4, 9) * size;
    ctx.fillStyle = `rgba(160, 120, 70, ${seededNoise(i, 5, 10) * 0.05})`;
    ctx.fillRect(px, py, 1, 1);
  }
}

function drawMatteBlackPvc(ctx: CanvasRenderingContext2D, size: number) {
  ctx.fillStyle = '#161616';
  ctx.fillRect(0, 0, size, size);

  const sheetH = size / 6;
  for (let row = 0; row < 6; row++) {
    const y = row * sheetH;
    const shade = row % 2 === 0 ? '#181818' : '#141414';
    ctx.fillStyle = shade;
    ctx.fillRect(0, y, size, sheetH);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(0, y, size, 1);
    ctx.fillStyle = 'rgba(60, 60, 60, 0.08)';
    ctx.fillRect(0, y + sheetH - 1, size, 1);
  }

  for (let i = 0; i < 12000; i++) {
    const px = seededNoise(i, 6, 11) * size;
    const py = seededNoise(i, 7, 12) * size;
    const v = seededNoise(i, 8, 13) > 0.5 ? 22 : 14;
    ctx.fillStyle = `rgb(${v}, ${v}, ${v})`;
    ctx.fillRect(px, py, 1, 1);
  }

  for (let s = 0; s < 30; s++) {
    const sx = seededNoise(s, 9, 14) * size;
    const sy = seededNoise(s, 10, 15) * size;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
    ctx.beginPath();
    ctx.ellipse(sx, sy, 2 + seededNoise(s, 11, 16) * 4, 1, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function buildCanvasTexture(draw: (ctx: CanvasRenderingContext2D, size: number) => void) {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  draw(ctx, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export function getStageDeckTexture(type: StageTexture): THREE.CanvasTexture {
  const cached = textureCache.get(type);
  if (cached) return cached;

  let texture: THREE.CanvasTexture;
  switch (type) {
    case 'dark_wood':
      texture = buildCanvasTexture(drawDarkWood);
      break;
    case 'light_wood':
      texture = buildCanvasTexture(drawLightWood);
      break;
    case 'matte_black':
      texture = buildCanvasTexture(drawMatteBlackPvc);
      break;
  }
  textureCache.set(type, texture);
  return texture;
}

export function applyStageDeckTextureRepeat(
  texture: THREE.CanvasTexture,
  lengthM: number,
  widthM: number,
) {
  texture.repeat.set(Math.max(1, lengthM / 2), Math.max(1, widthM / 2));
  texture.needsUpdate = true;
}
