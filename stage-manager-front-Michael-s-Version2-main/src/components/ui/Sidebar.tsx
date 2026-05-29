import { useState } from 'react';
import { PROP_CATALOG, STAGE_LIMITS } from '../../constants/props';
import { useStageStore } from '../../store/stageStore';
import type { ChairVariant, PropType } from '../../types';
import { ChairVariantPicker } from './ChairVariantPicker';
import { DimensionControl } from './DimensionControl';
import { PropList } from './PropList';
import { GroundColorPicker } from './GroundColorPicker';
import { SkyColorPicker } from './SkyColorPicker';
import { StageTexturePicker } from './StageTexturePicker';

export function Sidebar() {
  const [chairPickerOpen, setChairPickerOpen] = useState(false);
  const stage = useStageStore((s) => s.stage);
  const skyColor = useStageStore((s) => s.skyColor);
  const groundColor = useStageStore((s) => s.groundColor);
  const stageTexture = useStageStore((s) => s.stageTexture);
  const setStageDimension = useStageStore((s) => s.setStageDimension);
  const setSkyColor = useStageStore((s) => s.setSkyColor);
  const setGroundColor = useStageStore((s) => s.setGroundColor);
  const setStageTexture = useStageStore((s) => s.setStageTexture);
  const showStageBaseline = useStageStore((s) => s.showStageBaseline);
  const showStageAreaGrid = useStageStore((s) => s.showStageAreaGrid);
  const setShowStageBaseline = useStageStore((s) => s.setShowStageBaseline);
  const setShowStageAreaGrid = useStageStore((s) => s.setShowStageAreaGrid);
  const props = useStageStore((s) => s.props);
  const placementType = useStageStore((s) => s.placementType);
  const mode = useStageStore((s) => s.mode);
  const snapToGrid = useStageStore((s) => s.snapToGrid);
  const startPlacement = useStageStore((s) => s.startPlacement);
  const cancelPlacement = useStageStore((s) => s.cancelPlacement);
  const toggleSnap = useStageStore((s) => s.toggleSnap);

  const hiddenCount = props.filter((p) => !p.visible).length;

  const handlePropCardClick = (type: PropType) => {
    if (placementType === type && mode === 'place') {
      cancelPlacement();
      setChairPickerOpen(false);
      return;
    }
    if (type === 'chair') {
      setChairPickerOpen(true);
      cancelPlacement();
      return;
    }
    setChairPickerOpen(false);
    startPlacement(type);
  };

  const startChairPlacement = (variant: ChairVariant) => {
    setChairPickerOpen(false);
    startPlacement('chair', { chairVariant: variant });
  };

  return (
    <aside className="sidebar">
      <header className="sidebar-header">
        <h1>XPlanner</h1>
        <p>Stage Management System</p>
      </header>

      <section className="panel">
        <h2>Stage</h2>
        <StageTexturePicker value={stageTexture} onChange={setStageTexture} />
        <p className="panel-hint">
          Platform size (meters). Length and width up to 40 m.
        </p>
        <DimensionControl
          label="Length"
          value={stage.length}
          min={STAGE_LIMITS.length.min}
          max={STAGE_LIMITS.length.max}
          step={1}
          inputStep={0.1}
          unit="m"
          onChange={(v) => setStageDimension('length', v)}
        />
        <DimensionControl
          label="Width"
          value={stage.width}
          min={STAGE_LIMITS.width.min}
          max={STAGE_LIMITS.width.max}
          step={1}
          inputStep={0.1}
          unit="m"
          onChange={(v) => setStageDimension('width', v)}
        />
        <DimensionControl
          label="Height"
          value={stage.height}
          min={STAGE_LIMITS.height.min}
          max={STAGE_LIMITS.height.max}
          step={0.1}
          inputStep={0.1}
          unit="m"
          onChange={(v) => setStageDimension('height', v)}
        />
        <label className="toggle stage-toggle">
          <input
            type="checkbox"
            checked={showStageBaseline}
            onChange={(e) => setShowStageBaseline(e.target.checked)}
          />
          Show center baseline (cross)
        </label>
        <label className="toggle stage-toggle">
          <input
            type="checkbox"
            checked={showStageAreaGrid}
            onChange={(e) => setShowStageAreaGrid(e.target.checked)}
          />
          Show area grid (1 m cells)
        </label>
      </section>

      <PropList />

      <section className="panel">
        <div className="panel-title-row">
          <h2>Props</h2>
          <label className="toggle">
            <input type="checkbox" checked={snapToGrid} onChange={toggleSnap} />
            Snap
          </label>
        </div>
        <p className="panel-hint">
          {mode === 'place'
            ? 'Click the stage to place. Esc to cancel.'
            : 'Pick a prop, click the stage to place. Select a prop to edit below.'}
        </p>
        <div className="prop-grid">
          {PROP_CATALOG.map((item) => (
            <button
              key={item.type}
              type="button"
              className={`prop-card ${
                placementType === item.type || (item.type === 'chair' && chairPickerOpen)
                  ? 'active'
                  : ''
              }`}
              onClick={() => handlePropCardClick(item.type)}
            >
              <span className="prop-icon">{item.icon}</span>
              <span className="prop-label">{item.label}</span>
            </button>
          ))}
        </div>
        {chairPickerOpen && (
          <div className="chair-place-panel">
            <p className="panel-hint">Choose a chair style, then click the stage.</p>
            <ChairVariantPicker
              value="with_back"
              onChange={(variant) => startChairPlacement(variant)}
            />
          </div>
        )}
        {mode === 'place' && (
          <button type="button" className="btn secondary" onClick={cancelPlacement}>
            Cancel placement
          </button>
        )}
      </section>

      <section className="panel">
        <h2>Environment</h2>
        <SkyColorPicker color={skyColor} onChange={setSkyColor} />
        <GroundColorPicker color={groundColor} onChange={setGroundColor} />
      </section>

      <section className="panel panel-footer">
        <p className="stats">
          {props.length} props on stage
          {hiddenCount > 0 ? ` (${hiddenCount} hidden)` : ''}
        </p>
      </section>

      <footer className="help">
        <p>
          <strong>Navigate:</strong> drag to orbit, scroll to zoom, right-drag to
          pan. WASD move, Q/E yaw, R/F pitch, Z zoom in, X zoom out. Use the edge
          tab to collapse the sidebar for fullscreen 3D.
        </p>
        <p>
          <strong>Props:</strong> pick from On stage to select. Positioning shows
          move gizmo and blue rotate ring. Esc or 取消选中 to deselect only.
          Arrows move, PgUp/PgDn height, Backspace delete, H hide, [ ] resize.
        </p>
      </footer>
    </aside>
  );
}
