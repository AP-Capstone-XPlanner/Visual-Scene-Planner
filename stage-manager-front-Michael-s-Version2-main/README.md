# Stage Pilot

A browser-based 3D stage layout tool for stage managers and designers. Define your stage platform, place props, and preview the setup before you're on the venue floor.

## Features

- **Adjustable stage** — Set length, width, and height (meters) with live 3D preview
- **Prop library** — Big screens, monitors, tables, chairs, and stairs
- **Planet Coaster–style placement** — Pick a prop, move over the stage, click to place
- **Edit props** — Select, rotate (±45°), or delete placed items
- **Grid snap** — Optional 0.25 m snap for aligned layouts
- **Orbit camera** — Drag to orbit, scroll to zoom, right-drag to pan

## Getting started

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Tech stack

- [React](https://react.dev/) + [Vite](https://vite.dev/)
- [Three.js](https://threejs.org/) via [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) and [Drei](https://github.com/pmndrs/drei)
- [Zustand](https://github.com/pmndrs/zustand) for editor state

## Roadmap ideas

- Save/load layouts (JSON export)
- Drag-to-move selected props
- More prop types and custom models (GLTF)
- Audience area and lighting preview
- Measurements and collision hints
