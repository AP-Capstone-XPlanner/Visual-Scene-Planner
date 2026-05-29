import { PROP_CATALOG } from '../../constants/props';
import { useStageStore } from '../../store/stageStore';

export function PropList() {
  const props = useStageStore((s) => s.props);
  const selectedPropId = useStageStore((s) => s.selectedPropId);
  const selectProp = useStageStore((s) => s.selectProp);
  const togglePropVisibility = useStageStore((s) => s.togglePropVisibility);
  const removeProp = useStageStore((s) => s.removeProp);
  const clearAllProps = useStageStore((s) => s.clearAllProps);

  if (props.length === 0) return null;

  return (
    <section className="panel">
      <div className="panel-title-row">
        <h2>On stage</h2>
      </div>
      <p className="panel-hint">Click to select. Eye hides; trash deletes.</p>
      <ul className="prop-list">
        {props.map((prop) => {
          const label = PROP_CATALOG.find((p) => p.type === prop.type)?.label ?? prop.type;
          const isSelected = prop.id === selectedPropId;
          return (
            <li key={prop.id} className={`prop-list-item ${isSelected ? 'selected' : ''}`}>
              <span
                className="prop-list-swatch"
                style={{ background: prop.color }}
                aria-hidden
              />
              <button
                type="button"
                className="prop-list-select"
                onClick={() => selectProp(prop.id)}
              >
                <span className="prop-list-name">
                  {prop.tag.trim() || label}
                </span>
                <span className="prop-list-meta">
                  {prop.tag.trim() ? label : ''}
                  {prop.tag.trim() ? ' · ' : ''}
                  {prop.visible ? 'Visible' : 'Hidden'} · {(prop.scale * 100).toFixed(0)}%
                </span>
              </button>
              <button
                type="button"
                className="prop-list-visibility"
                title={prop.visible ? 'Hide prop' : 'Show prop'}
                aria-label={prop.visible ? 'Hide prop' : 'Show prop'}
                onClick={(e) => {
                  e.stopPropagation();
                  togglePropVisibility(prop.id);
                }}
              >
                {prop.visible ? '👁' : '👁‍🗨'}
              </button>
              <button
                type="button"
                className="prop-list-delete"
                title="Delete prop"
                aria-label="Delete prop"
                onClick={(e) => {
                  e.stopPropagation();
                  removeProp(prop.id);
                }}
              >
                ✕
              </button>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        className="btn secondary prop-list-clear"
        onClick={clearAllProps}
      >
        Clear all props
      </button>
    </section>
  );
}
