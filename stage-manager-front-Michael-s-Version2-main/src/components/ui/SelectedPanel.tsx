import {
  PROP_CATALOG,
  PROP_SCALE_LIMITS,
  PROP_TAG_MAX_LENGTH,
} from '../../constants/props';
import {
  usesCustomDimensions,
  resolvePropDimensions,
} from '../../constants/propDimensions';
import { useStageStore } from '../../store/stageStore';
import {
  heightAboveStage,
  PROP_MAX_HEIGHT_ABOVE_STAGE,
  rotationDisplayDegrees,
} from '../../utils/propPosition';
import { ChairVariantPicker } from './ChairVariantPicker';
import { DimensionControl } from './DimensionControl';
import { PropColorPicker } from './PropColorPicker';
import { PropDimensionsEditor } from './PropDimensionsEditor';
import { PositionNumberInput } from './PositionNumberInput';

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
  const setSelectedPropDimension = useStageStore((s) => s.setSelectedPropDimension);
  const togglePropVisibility = useStageStore((s) => s.togglePropVisibility);
  const setSelectedPropTag = useStageStore((s) => s.setSelectedPropTag);
  const setSelectedPropColor = useStageStore((s) => s.setSelectedPropColor);
  const updateProp = useStageStore((s) => s.updateProp);

  const selectedProp = props.find((p) => p.id === selectedPropId);
  const open = Boolean(selectedProp);
  const selectedUsesDims =
    selectedProp && usesCustomDimensions(selectedProp.type);

  return (
    <div
      className={`selected-panel-shell ${open ? 'selected-panel-shell--open' : ''}`}
      aria-hidden={!open}
    >
      <div className="selected-panel">
        {selectedProp && (
          <>
            <div className="selected-panel-header">
              <div className="selected-panel-header-main">
                <div className="selected-panel-title-row">
                  <h2 className="selected-panel-title">Selected</h2>
                  <label className="selected-panel-tag">
                    <span className="selected-panel-tag-label">Tag</span>
                    <input
                      type="text"
                      placeholder="Usage note"
                      value={selectedProp.tag}
                      maxLength={PROP_TAG_MAX_LENGTH}
                      onChange={(e) => setSelectedPropTag(e.target.value)}
                    />
                  </label>
                </div>
                <p className="selected-panel-subtitle">
                  {PROP_CATALOG.find((p) => p.type === selectedProp.type)?.label}
                </p>
              </div>
              <div className="selected-panel-actions">
                <button
                  type="button"
                  className={`btn btn-compact ${positioningMode ? 'active' : 'secondary'}`}
                  onClick={() => togglePositioningMode()}
                >
                  Positioning
                </button>
                <button
                  type="button"
                  className="btn btn-compact secondary"
                  onClick={() => selectProp(null)}
                >
                  取消选中
                </button>
              </div>
            </div>
            <div className="selected-panel-body">
              {positioningMode && (
                <p className="panel-hint positioning-hint">
                  Gizmo + 蓝色圆环 — Esc 退出 Positioning，再次 Esc 取消选中
                </p>
              )}
              {selectedProp.type === 'chair' && (
                <ChairVariantPicker
                  value={selectedProp.chairVariant ?? 'with_back'}
                  onChange={(variant) =>
                    updateProp(selectedProp.id, { chairVariant: variant })
                  }
                />
              )}
              <PropColorPicker
                compact
                color={selectedProp.color}
                propType={selectedProp.type}
                onChange={setSelectedPropColor}
              />
              <div className="selected-panel-section-divider" aria-hidden />
              <section className="selected-panel-section">
                <span className="selected-panel-section-title">Position</span>
                <div className="selected-panel-position-row">
                  <PositionNumberInput
                    label="X"
                    value={selectedProp.position[0]}
                    onCommit={(x) =>
                      setSelectedPropPosition(
                        x,
                        selectedProp.position[2],
                        undefined,
                        { finePosition: true },
                      )
                    }
                  />
                  <PositionNumberInput
                    label="Z"
                    value={selectedProp.position[2]}
                    onCommit={(z) =>
                      setSelectedPropPosition(
                        selectedProp.position[0],
                        z,
                        undefined,
                        { finePosition: true },
                      )
                    }
                  />
                  <PositionNumberInput
                    label="Y"
                    value={heightAboveStage(
                      selectedProp.position[1],
                      stage.height,
                    )}
                    min={0}
                    max={PROP_MAX_HEIGHT_ABOVE_STAGE}
                    onCommit={(yUp) =>
                      setSelectedPropPosition(
                        selectedProp.position[0],
                        selectedProp.position[2],
                        stage.height + yUp,
                        { finePosition: true },
                      )
                    }
                  />
                  <div className="position-rot">
                    <span>Rot</span>
                    <strong>
                      {rotationDisplayDegrees(selectedProp.rotation).toFixed(0)}°
                    </strong>
                  </div>
                  <div className="position-rotate-btns">
                    <button
                      type="button"
                      className="btn btn-compact"
                      onClick={() => rotateSelected(-Math.PI / 4)}
                    >
                      −45°
                    </button>
                    <button
                      type="button"
                      className="btn btn-compact"
                      onClick={() => rotateSelected(Math.PI / 4)}
                    >
                      +45°
                    </button>
                  </div>
                </div>
              </section>
              <div className="selected-panel-size-row">
                {selectedUsesDims ? (
                  <PropDimensionsEditor
                    slim={selectedProp.type === 'box'}
                    compact={selectedProp.type === 'big_screen'}
                    prop={{
                      ...selectedProp,
                      dimensions: resolvePropDimensions(selectedProp)!,
                    }}
                    onChange={setSelectedPropDimension}
                  />
                ) : (
                  <DimensionControl
                    slim
                    label="Size"
                    value={selectedProp.scale}
                    min={PROP_SCALE_LIMITS.min}
                    max={PROP_SCALE_LIMITS.max}
                    step={PROP_SCALE_LIMITS.step}
                    unit="×"
                    onChange={(v) => setSelectedPropScale(v)}
                  />
                )}
              </div>
              <div className="selected-panel-footer-row">
                <button
                  type="button"
                  className="btn btn-compact secondary"
                  onClick={() => togglePropVisibility()}
                >
                  {selectedProp.visible ? 'Hide' : 'Show'}
                </button>
                <button
                  type="button"
                  className="btn btn-compact danger"
                  onClick={() => deleteSelectedProp()}
                >
                  Del
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
