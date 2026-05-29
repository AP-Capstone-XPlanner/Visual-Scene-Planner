import { create } from 'zustand';
import type {
  ChairVariant,
  EditorMode,
  PlacedProp,
  PlacementOptions,
  PropDimensions,
  PropType,
  StageDimensions,
  StageTexture,
} from '../types';
import {
  DEFAULT_GROUND_COLOR,
  DEFAULT_SHOW_STAGE_BASELINE,
  DEFAULT_SKY_COLOR,
  DEFAULT_STAGE_TEXTURE,
} from '../constants/stage';
import {
  clampBigScreenDimension,
  clampBoxDimension,
  getDefaultPropDimensions,
  resolvePropDimensions,
  usesCustomDimensions,
} from '../constants/propDimensions';
import { getDefaultPropColor } from '../constants/propColors';
import { normalizeHexColor } from '../utils/color';
import { createNewProp, clampPropScale } from '../utils/propDefaults';
import { PROP_TAG_MAX_LENGTH } from '../constants/props';
import { clampStageDimension } from '../utils/stageDimensions';
import { shiftGroundedPropsForStageHeight } from '../utils/propBounds';
import {
  normalizePropPosition,
  normalizeRotation,
  POSITION_PANEL_SNAP,
} from '../utils/propPosition';
import type { NewPlacedProp } from '../utils/propDefaults';

interface StageState {
  stage: StageDimensions;
  skyColor: string;
  groundColor: string;
  stageTexture: StageTexture;
  props: PlacedProp[];
  selectedPropId: string | null;
  positioningMode: boolean;
  placementType: PropType | null;
  placementChairVariant: ChairVariant | null;
  mode: EditorMode;
  snapToGrid: boolean;
  showStageBaseline: boolean;
  showStageAreaGrid: boolean;

  setStageDimension: (key: keyof StageDimensions, value: number) => void;
  setStage: (stage: Partial<StageDimensions>) => void;
  setSkyColor: (color: string) => void;
  setGroundColor: (color: string) => void;
  setStageTexture: (texture: StageTexture) => void;
  setShowStageBaseline: (show: boolean) => void;
  setShowStageAreaGrid: (show: boolean) => void;
  startPlacement: (type: PropType, options?: PlacementOptions) => void;
  cancelPlacement: () => void;
  setMode: (mode: EditorMode) => void;
  addProp: (prop: NewPlacedProp) => void;
  updateProp: (id: string, patch: Partial<PlacedProp>) => void;
  removeProp: (id: string) => void;
  selectProp: (id: string | null) => void;
  setPositioningMode: (enabled: boolean) => void;
  togglePositioningMode: () => void;
  /** Esc: placement → positioning → selection (cleared). Returns whether handled. */
  handleEscapeKey: (options?: { fromTextInput?: boolean }) => boolean;
  rotateSelected: (deltaRadians: number) => void;
  setSelectedPropRotation: (rotation: number) => void;
  moveSelectedProp: (dx: number, dz: number) => void;
  moveSelectedPropVertical: (dy: number) => void;
  setSelectedPropPosition: (
    x: number,
    z: number,
    y?: number,
    options?: { finePosition?: boolean },
  ) => void;
  deleteSelectedProp: () => void;
  setSelectedPropScale: (scale: number) => void;
  togglePropVisibility: (id?: string) => void;
  setSelectedPropTag: (tag: string) => void;
  setSelectedPropColor: (color: string) => void;
  setSelectedPropDimension: (
    key: keyof PropDimensions,
    value: number,
  ) => void;
  toggleSnap: () => void;
  clearAllProps: () => void;
}

const defaultStage: StageDimensions = {
  length: 12,
  width: 8,
  height: 0.6,
};

export const useStageStore = create<StageState>((set, get) => ({
  stage: defaultStage,
  skyColor: DEFAULT_SKY_COLOR,
  groundColor: DEFAULT_GROUND_COLOR,
  stageTexture: DEFAULT_STAGE_TEXTURE,
  props: [],
  selectedPropId: null,
  positioningMode: false,
  placementType: null,
  placementChairVariant: null,
  mode: 'select',
  snapToGrid: true,
  showStageBaseline: DEFAULT_SHOW_STAGE_BASELINE,
  showStageAreaGrid: false,

  setStageDimension: (key, value) =>
    set((s) => {
      const clamped = clampStageDimension(key, value);
      if (key !== 'height') {
        return { stage: { ...s.stage, [key]: clamped } };
      }
      const oldTop = s.stage.height;
      const newTop = clamped;
      const stage = { ...s.stage, height: newTop };
      return {
        stage,
        props: shiftGroundedPropsForStageHeight(s.props, oldTop, newTop),
      };
    }),

  setStage: (stage) => set((s) => ({ stage: { ...s.stage, ...stage } })),

  setSkyColor: (color) =>
    set({ skyColor: normalizeHexColor(color, DEFAULT_SKY_COLOR) }),

  setGroundColor: (color) =>
    set({ groundColor: normalizeHexColor(color, DEFAULT_GROUND_COLOR) }),

  setStageTexture: (texture) => set({ stageTexture: texture }),

  setShowStageBaseline: (show) => set({ showStageBaseline: show }),

  setShowStageAreaGrid: (show) => set({ showStageAreaGrid: show }),

  startPlacement: (type, options) =>
    set({
      placementType: type,
      placementChairVariant:
        options?.chairVariant ?? (type === 'chair' ? 'with_back' : null),
      mode: 'place',
      selectedPropId: null,
      positioningMode: false,
    }),

  cancelPlacement: () =>
    set({ placementType: null, placementChairVariant: null, mode: 'select' }),

  setMode: (mode) =>
    set((s) => ({
      mode,
      placementType: mode === 'select' ? null : s.placementType,
    })),

  addProp: (prop) =>
    set((s) => {
      const id = crypto.randomUUID();
      return {
        props: [...s.props, { ...createNewProp(prop), id }],
        mode: 'select',
        placementType: null,
        placementChairVariant: null,
        selectedPropId: id,
        positioningMode: false,
      };
    }),

  updateProp: (id, patch) =>
    set((s) => ({
      props: s.props.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    })),

  removeProp: (id) =>
    set((s) => ({
      props: s.props.filter((p) => p.id !== id),
      selectedPropId: s.selectedPropId === id ? null : s.selectedPropId,
      positioningMode:
        s.selectedPropId === id ? false : s.positioningMode,
    })),

  selectProp: (id) =>
    set((s) => {
      if (id === null) {
        return {
          selectedPropId: null,
          positioningMode: false,
          mode: 'select',
          placementType: null,
          placementChairVariant: null,
        };
      }
      if (s.selectedPropId === id) {
        return {};
      }
      if (
        s.positioningMode &&
        s.selectedPropId !== null &&
        id !== s.selectedPropId
      ) {
        return {};
      }
      return {
        selectedPropId: id,
        positioningMode: false,
        mode: 'select',
        placementType: null,
        placementChairVariant: null,
      };
    }),

  setPositioningMode: (enabled) => {
    const { selectedPropId } = get();
    if (!selectedPropId) {
      set({ positioningMode: false });
      return;
    }
    set({ positioningMode: enabled });
  },

  togglePositioningMode: () => {
    const { selectedPropId, positioningMode } = get();
    if (!selectedPropId) return;
    set({ positioningMode: !positioningMode });
  },

  handleEscapeKey: (options) => {
    const s = get();
    const fromTextInput = options?.fromTextInput ?? false;

    if (s.mode === 'place') {
      get().cancelPlacement();
      return true;
    }
    if (s.positioningMode) {
      set({ positioningMode: false });
      return true;
    }
    if (s.selectedPropId) {
      if (fromTextInput) return false;
      set({
        selectedPropId: null,
        positioningMode: false,
        mode: 'select',
        placementType: null,
        placementChairVariant: null,
      });
      return true;
    }
    return false;
  },

  rotateSelected: (deltaRadians) => {
    const { selectedPropId, props, updateProp } = get();
    if (!selectedPropId) return;
    const prop = props.find((p) => p.id === selectedPropId);
    if (!prop) return;
    updateProp(selectedPropId, {
      rotation: normalizeRotation(prop.rotation + deltaRadians),
    });
  },

  setSelectedPropRotation: (rotation) => {
    const { selectedPropId, updateProp } = get();
    if (!selectedPropId) return;
    updateProp(selectedPropId, { rotation: normalizeRotation(rotation) });
  },

  moveSelectedProp: (dx, dz) => {
    const { selectedPropId, props, stage, snapToGrid, updateProp } = get();
    if (!selectedPropId) return;
    const prop = props.find((p) => p.id === selectedPropId);
    if (!prop) return;
    const position = normalizePropPosition(
      prop.position[0] + dx,
      prop.position[1],
      prop.position[2] + dz,
      stage.length / 2,
      stage.width / 2,
      snapToGrid,
      stage.height,
      prop,
    );
    updateProp(selectedPropId, { position });
  },

  moveSelectedPropVertical: (dy) => {
    const { selectedPropId, props, stage, snapToGrid, updateProp } = get();
    if (!selectedPropId) return;
    const prop = props.find((p) => p.id === selectedPropId);
    if (!prop) return;
    const position = normalizePropPosition(
      prop.position[0],
      prop.position[1] + dy,
      prop.position[2],
      stage.length / 2,
      stage.width / 2,
      snapToGrid,
      stage.height,
      prop,
    );
    updateProp(selectedPropId, { position });
  },

  setSelectedPropPosition: (x, z, y, options) => {
    const { selectedPropId, props, stage, snapToGrid, updateProp } = get();
    if (!selectedPropId) return;
    const prop = props.find((p) => p.id === selectedPropId);
    if (!prop) return;
    const fine = options?.finePosition ?? false;
    const position = normalizePropPosition(
      x,
      y ?? prop.position[1],
      z,
      stage.length / 2,
      stage.width / 2,
      fine || snapToGrid,
      stage.height,
      prop,
      fine ? POSITION_PANEL_SNAP : undefined,
    );
    updateProp(selectedPropId, { position });
  },

  deleteSelectedProp: () => {
    const { selectedPropId, removeProp } = get();
    if (selectedPropId) removeProp(selectedPropId);
  },

  setSelectedPropScale: (scale) => {
    const { selectedPropId, props, stage, snapToGrid, updateProp } = get();
    if (!selectedPropId) return;
    const prop = props.find((p) => p.id === selectedPropId);
    if (!prop) return;
    const nextScale = clampPropScale(scale);
    const position = normalizePropPosition(
      prop.position[0],
      prop.position[1],
      prop.position[2],
      stage.length / 2,
      stage.width / 2,
      snapToGrid,
      stage.height,
      { ...prop, scale: nextScale },
    );
    updateProp(selectedPropId, { scale: nextScale, position });
  },

  togglePropVisibility: (id) => {
    const propId = id ?? get().selectedPropId;
    if (!propId) return;
    const prop = get().props.find((p) => p.id === propId);
    if (!prop) return;
    get().updateProp(propId, { visible: !prop.visible });
  },

  setSelectedPropTag: (tag) => {
    const { selectedPropId, updateProp } = get();
    if (!selectedPropId) return;
    updateProp(selectedPropId, {
      tag: tag.slice(0, PROP_TAG_MAX_LENGTH),
    });
  },

  setSelectedPropColor: (color) => {
    const { selectedPropId, props, updateProp } = get();
    if (!selectedPropId) return;
    const prop = props.find((p) => p.id === selectedPropId);
    if (!prop) return;
    updateProp(selectedPropId, {
      color: normalizeHexColor(color, getDefaultPropColor(prop.type)),
    });
  },

  setSelectedPropDimension: (key, value) => {
    const { selectedPropId, props, stage, snapToGrid, updateProp } = get();
    if (!selectedPropId) return;
    const prop = props.find((p) => p.id === selectedPropId);
    if (!prop || !usesCustomDimensions(prop.type)) return;

    const current =
      resolvePropDimensions(prop) ??
      getDefaultPropDimensions(prop.type, prop.chairVariant)!;

    let next: PropDimensions;
    if (prop.type === 'big_screen') {
      next = {
        ...current,
        [key]:
          key === 'depth'
            ? current.depth
            : clampBigScreenDimension(key as 'width' | 'height', value),
        depth: current.depth,
      };
    } else {
      next = {
        ...current,
        [key]: clampBoxDimension(key, value),
      };
    }

    const position = normalizePropPosition(
      prop.position[0],
      prop.position[1],
      prop.position[2],
      stage.length / 2,
      stage.width / 2,
      snapToGrid,
      stage.height,
      { ...prop, dimensions: next },
    );
    updateProp(selectedPropId, { dimensions: next, position });
  },

  toggleSnap: () => set((s) => ({ snapToGrid: !s.snapToGrid })),

  clearAllProps: () =>
    set({ props: [], selectedPropId: null, positioningMode: false }),
}));
