import { create } from 'zustand';
import {
  DEFAULT_GROUND_COLOR,
  DEFAULT_SHOW_STAGE_BASELINE,
  DEFAULT_SKY_COLOR,
  DEFAULT_STAGE_TEXTURE,
  DEFAULT_STAGE_ENCLOSURE_COLOR,
  STAGE_ENCLOSURE_HEIGHT_LIMITS,
  STAGE_ENCLOSURE_OPACITY_LIMITS,
} from '../constants/stage.js';
import { propSupportsToggleInteraction } from '../constants/propCatalogSpecs.js';
import { getDefaultPropColor } from '../constants/propColors.js';
import { normalizeHexColor } from '../utils/color.js';
import { createNewProp, clampPropScale, propToPlacementDraft } from '../utils/propDefaults.js';
import { PROP_TAG_MAX_LENGTH } from '../constants/props.js';
import { clampStageDimension } from '../utils/stageDimensions.js';
import { shiftGroundedPropsForStageHeight } from '../utils/propBounds.js';
import {
  normalizePropPosition,
  normalizeRotation,
  POSITION_PANEL_SNAP,
} from '../utils/propPosition.js';
import { getStageHalfExtents } from '../utils/stageAxes.js';
import {
  clampStageEnclosureHeight,
  clampStageEnclosureOpacity,
} from '../utils/stageEnclosure.js';

const defaultStage = {
  length: 10,
  width: 20,
  height: 0.6,
};

export const useStageStore = create((set, get) => ({
  stage: defaultStage,
  skyColor: DEFAULT_SKY_COLOR,
  groundColor: DEFAULT_GROUND_COLOR,
  stageTexture: DEFAULT_STAGE_TEXTURE,
  curtainDuration: 3,
  dancerTravelDuration: 5,
  props: [],
  selectedPropId: null,
  positioningMode: false,
  placementType: null,
  placementDraft: null,
  clipboardDraft: null,
  mode: 'select',
  snapToGrid: true,
  showStageBaseline: DEFAULT_SHOW_STAGE_BASELINE,
  showStageAreaGrid: false,
  showStageZones: false,
  showStageEnclosure: false,
  stageEnclosureHeight: STAGE_ENCLOSURE_HEIGHT_LIMITS.default,
  stageEnclosureColor: DEFAULT_STAGE_ENCLOSURE_COLOR,
  stageEnclosureOpacity: STAGE_ENCLOSURE_OPACITY_LIMITS.default,

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

  setCurtainDuration: (duration) => set({ curtainDuration: duration }),

  setDancerTravelDuration: (duration) => set({ dancerTravelDuration: duration }),

  setShowStageBaseline: (show) => set({ showStageBaseline: show }),

  setShowStageAreaGrid: (show) => set({ showStageAreaGrid: show }),

  setShowStageZones: (show) => set({ showStageZones: show }),

  setShowStageEnclosure: (show) => set({ showStageEnclosure: show }),

  setStageEnclosureHeight: (height) =>
    set({ stageEnclosureHeight: clampStageEnclosureHeight(height) }),

  setStageEnclosureColor: (color) =>
    set({
      stageEnclosureColor: normalizeHexColor(
        color,
        DEFAULT_STAGE_ENCLOSURE_COLOR,
      ),
    }),

  setStageEnclosureOpacity: (opacity) =>
    set({ stageEnclosureOpacity: clampStageEnclosureOpacity(opacity) }),

  startPlacement: (type, draft) =>
    set({
      placementType: type,
      placementDraft: draft ?? null,
      mode: 'place',
      selectedPropId: null,
      positioningMode: false,
    }),

  cancelPlacement: () =>
    set({ placementType: null, placementDraft: null, mode: 'select' }),

  copySelectedProp: () => {
    const { selectedPropId, props } = get();
    if (!selectedPropId) return;
    const prop = props.find((p) => p.id === selectedPropId);
    if (!prop) return;
    const draft = propToPlacementDraft(prop);
    set({
      clipboardDraft: draft,
      placementType: prop.type,
      placementDraft: draft,
      mode: 'place',
      selectedPropId: null,
      positioningMode: false,
    });
  },

  pasteProp: () => {
    const { clipboardDraft } = get();
    if (!clipboardDraft) return;
    const draft = structuredClone(clipboardDraft);
    set({
      placementType: draft.type,
      placementDraft: draft,
      mode: 'place',
      selectedPropId: null,
      positioningMode: false,
    });
  },

  setMode: (mode) =>
    set((s) => ({
      mode,
      placementType: mode === 'select' ? null : s.placementType,
      placementDraft: mode === 'select' ? null : s.placementDraft,
    })),

  addProp: (prop) =>
    set((s) => {
      const id = crypto.randomUUID();
      return {
        props: [...s.props, { ...createNewProp(prop), id }],
        mode: 'select',
        placementType: null,
        placementDraft: null,
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
          placementDraft: null,
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
        placementDraft: null,
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
        placementDraft: null,
      });
      return true;
    }
    return false;
  },

  togglePropInteraction: (id) => {
    const prop = get().props.find((p) => p.id === id);
    if (!prop || !propSupportsToggleInteraction(prop.type)) return;
    const open = !(prop.interactionState?.open ?? false);
    get().updateProp(id, {
      interactionState: { ...prop.interactionState, open },
    });
  },

  toggleLamp: (id) => {
    const prop = get().props.find((p) => p.id === id);
    if (!prop) return;
    const lampOn = !(prop.interactionState?.lampOn ?? false);
    get().updateProp(id, {
      interactionState: { ...prop.interactionState, lampOn },
    });
  },

  toggleCurtain: (id) => {
    const prop = get().props.find((p) => p.id === id);
    if (!prop) return;
    const open = !(prop.interactionState?.open ?? false);
    get().updateProp(id, {
      interactionState: { ...prop.interactionState, open },
    });
  },

  toggleDiningChair: (id, chairIndex) => {
    const prop = get().props.find((p) => p.id === id);
    if (!prop || prop.type !== 'dining_set') return;
    const pulled = [...(prop.interactionState?.chairsPulled ?? Array(6).fill(false))];
    if (chairIndex < 0 || chairIndex >= pulled.length) return;
    pulled[chairIndex] = !pulled[chairIndex];
    get().updateProp(id, {
      interactionState: { ...prop.interactionState, chairsPulled: pulled },
    });
  },

  togglePropTableChair: (id, chairIndex) => {
    const prop = get().props.find((p) => p.id === id);
    if (!prop || prop.type !== 'prop_table') return;
    const spawned = [...(prop.interactionState?.chairsSpawned ?? [])];
    const idx = spawned.indexOf(chairIndex);
    if (idx >= 0) {
      spawned.splice(idx, 1);
    } else {
      spawned.push(chairIndex);
    }
    get().updateProp(id, {
      interactionState: { ...prop.interactionState, chairsSpawned: spawned },
    });
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
    const { selectedPropId, props, stage, snapToGrid, positioningMode, updateProp } =
      get();
    if (!selectedPropId) return;
    const prop = props.find((p) => p.id === selectedPropId);
    if (!prop) return;
    const { halfX, halfZ } = getStageHalfExtents(stage.length, stage.width);
    const position = normalizePropPosition(
      prop.position[0] + dx,
      prop.position[1],
      prop.position[2] + dz,
      halfX,
      halfZ,
      snapToGrid && !positioningMode,
      stage.height,
      prop,
    );
    updateProp(selectedPropId, { position });
  },

  moveSelectedPropVertical: (dy) => {
    const { selectedPropId, props, stage, snapToGrid, positioningMode, updateProp } =
      get();
    if (!selectedPropId) return;
    const prop = props.find((p) => p.id === selectedPropId);
    if (!prop) return;
    const position = normalizePropPosition(
      prop.position[0],
      prop.position[1] + dy,
      prop.position[2],
      stage.width / 2,
      stage.length / 2,
      snapToGrid && !positioningMode,
      stage.height,
      prop,
    );
    updateProp(selectedPropId, { position });
  },

  setSelectedPropPosition: (x, z, y, options) => {
    const { selectedPropId, props, stage, snapToGrid, positioningMode, updateProp } =
      get();
    if (!selectedPropId) return;
    const prop = props.find((p) => p.id === selectedPropId);
    if (!prop) return;
    const fine = options?.finePosition ?? false;
    const position = normalizePropPosition(
      x,
      y ?? prop.position[1],
      z,
      stage.width / 2,
      stage.length / 2,
      fine || (snapToGrid && !positioningMode),
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
    const { selectedPropId, props, stage, snapToGrid, positioningMode, updateProp } =
      get();
    if (!selectedPropId) return;
    const prop = props.find((p) => p.id === selectedPropId);
    if (!prop) return;
    const nextScale = clampPropScale(scale);
    const position = normalizePropPosition(
      prop.position[0],
      prop.position[1],
      prop.position[2],
      stage.width / 2,
      stage.length / 2,
      snapToGrid && !positioningMode,
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

  toggleSnap: () => set((s) => ({ snapToGrid: !s.snapToGrid })),

  clearAllProps: () =>
    set({ props: [], selectedPropId: null, positioningMode: false }),
}));
