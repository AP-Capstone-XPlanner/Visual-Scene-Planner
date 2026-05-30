import { PROP_CATALOG, PROP_SCALE_LIMITS, PROP_TAG_MAX_LENGTH } from '../../constants/props.js';
import { getPropCatalogSpec } from '../../constants/propCatalogSpecs.js';
import { useStageStore } from '../../store/stageStore.js';
import {
  heightAboveStage,
  PROP_MAX_HEIGHT_ABOVE_STAGE,
  rotationDisplayDegrees,
} from '../../utils/propPosition.js';
import { DimensionControl } from './DimensionControl.jsx';
import { PositionNumberInput } from './PositionNumberInput.jsx';

export function SelectedPanel() {
  const stage = useStageStore((s) => s.stage);
  const props = useStageStore((s) => s.props);
  const selectedPropId = useStageStore((s) => s.selectedPropId);
  const positioningMode = useStageStore((s) => s.positioningMode);
  const selectProp = useStageStore((s) => s.selectProp);
  const togglePositioningMode = useStageStore((s) => s.togglePositioningMode);
  const rotateSelected = useStageStore((s) => s.rotateSelected);
  const setSelectedPropPosition = useStageStore((s) => s.setSelectedPropPosition);
  const deleteSelectedProp = useStageStore((s) => s.deleteSelectedProp);
  const setSelectedPropScale = useStageStore((s) => s.setSelectedPropScale);
  const togglePropVisibility = useStageStore((s) => s.togglePropVisibility);
  const setSelectedPropTag = useStageStore((s) => s.setSelectedPropTag);
  const copySelectedProp = useStageStore((s) => s.copySelectedProp);
  const toggleLamp = useStageStore((s) => s.toggleLamp);
  const toggleCurtain = useStageStore((s) => s.toggleCurtain);

  const selectedProp = props.find((p) => p.id === selectedPropId);
  const open = Boolean(selectedProp);
  const baseDims = selectedProp ? getPropCatalogSpec(selectedProp.type) : null;
  const displayDims = baseDims && selectedProp
    ? {
        width: (baseDims.width * selectedProp.scale).toFixed(2),
        height: (baseDims.height * selectedProp.scale).toFixed(2),
        depth: (baseDims.depth * selectedProp.scale).toFixed(2),
      }
    : null;
  const typeLabel =
    selectedProp && PROP_CATALOG.find((p) => p.type === selectedProp.type)?.label;

  return (
    <div className={`selected-panel-shell ${open ? 'selected-panel-shell--open' : ''}`} aria-hidden={!open}>
      <div className="selected-panel">
        {selectedProp && (
          <>
            <div className="selected-panel-header">
              <div className="selected-panel-header-main">
                <div className="selected-panel-title-row">
                  <h2 className="selected-panel-title">Selected</h2>
                  <label className="selected-panel-tag">
                    <span className="selected-panel-tag-label">Tag</span>
                    <input type="text" placeholder="Label" value={selectedProp.tag}
                      maxLength={PROP_TAG_MAX_LENGTH}
                      onChange={(e) => setSelectedPropTag(e.target.value)} />
                  </label>
                </div>
                <div className="selected-panel-meta">
                  {typeLabel && <p className="selected-panel-subtitle">{typeLabel}</p>}
                  {displayDims && (
                    <span className="selected-panel-dims-badge">
                      {displayDims.width}×{displayDims.height}×{displayDims.depth} m
                    </span>
                  )}
                </div>
              </div>
              <div className="selected-panel-actions">
                <button type="button" className={`btn btn-compact ${positioningMode ? 'active' : 'secondary'}`}
                  onClick={() => togglePositioningMode()}>Positioning</button>
                <button type="button" className="btn btn-compact secondary"
                  onClick={() => copySelectedProp()} title="⌘C">Copy</button>
                <button type="button" className="btn btn-compact secondary"
                  onClick={() => selectProp(null)}>取消选中</button>
              </div>
            </div>
            <div className="selected-panel-body">
              <section className="selected-panel-section">
                <span className="selected-panel-section-title">Position</span>
                <div className="selected-panel-position-row">
                  <PositionNumberInput label="X" value={selectedProp.position[0]}
                    onCommit={(x) => setSelectedPropPosition(x, selectedProp.position[2], undefined, { finePosition: true })} />
                  <PositionNumberInput label="Z" value={selectedProp.position[2]}
                    onCommit={(z) => setSelectedPropPosition(selectedProp.position[0], z, undefined, { finePosition: true })} />
                  <PositionNumberInput label="Y" value={heightAboveStage(selectedProp.position[1], stage.height)}
                    min={0} max={PROP_MAX_HEIGHT_ABOVE_STAGE}
                    onCommit={(yUp) => setSelectedPropPosition(selectedProp.position[0], selectedProp.position[2], stage.height + yUp, { finePosition: true })} />
                  <div className="position-rot">
                    <span>Rot</span>
                    <strong>{rotationDisplayDegrees(selectedProp.rotation).toFixed(0)}°</strong>
                  </div>
                  <div className="position-rotate-btns">
                    <button type="button" className="btn btn-compact secondary"
                      onClick={() => rotateSelected(-Math.PI / 4)}>−45°</button>
                    <button type="button" className="btn btn-compact secondary"
                      onClick={() => rotateSelected(Math.PI / 4)}>+45°</button>
                  </div>
                </div>
              </section>
              <div className="selected-panel-size-row">
                <DimensionControl slim label="Size" value={selectedProp.scale}
                  min={PROP_SCALE_LIMITS.min} max={PROP_SCALE_LIMITS.max}
                  step={PROP_SCALE_LIMITS.step} unit="×"
                  onChange={(v) => setSelectedPropScale(v)} />
              </div>
              <div className="selected-panel-footer-row">
                <button type="button" className="btn btn-compact secondary"
                  onClick={() => togglePropVisibility()}>
                  {selectedProp.visible ? 'Hide' : 'Show'}
                </button>
                <button type="button" className="btn btn-compact danger"
                  onClick={() => deleteSelectedProp()}>Del</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
