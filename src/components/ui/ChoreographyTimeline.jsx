import { useRef, useState } from 'react';
import { useStageStore } from '../../store/stageStore.js';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function ChoreographyTimeline() {
  const choreographyOpen = useStageStore((s) => s.choreographyOpen);
  const toggleChoreography = useStageStore((s) => s.toggleChoreography);
  const formations = useStageStore((s) => s.formations);
  const timelineEndTime = useStageStore((s) => s.timelineEndTime);
  const musicDuration = useStageStore((s) => s.musicDuration);
  const isPaused = useStageStore((s) => s.isPaused);
  const saveFormation = useStageStore((s) => s.saveFormation);
  const removeFormation = useStageStore((s) => s.removeFormation);
  const updateFormationTime = useStageStore((s) => s.updateFormationTime);
  const updateFormationName = useStageStore((s) => s.updateFormationName);
  const setTimelineEndTime = useStageStore((s) => s.setTimelineEndTime);
  const setMusicDuration = useStageStore((s) => s.setMusicDuration);
  const triggerDancerPlay = useStageStore((s) => s.triggerDancerPlay);
  const pausePlayback = useStageStore((s) => s.pausePlayback);
  const resumePlayback = useStageStore((s) => s.resumePlayback);
  const setTravelTimeBetweenFormations = useStageStore((s) => s.setTravelTimeBetweenFormations);
  const applyFormation = useStageStore((s) => s.applyFormation);
  const props = useStageStore((s) => s.props);

  const fileInputRef = useRef(null);
  const [editingFormationId, setEditingFormationId] = useState(null);

  const dancerIds = props.filter((p) => p.type === 'dancer').map((p) => p.id);
  const sortedFormations = [...formations].sort((a, b) => a.time - b.time);

  const handleImportMusic = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);
    audio.addEventListener('loadedmetadata', () => {
      setMusicDuration(audio.duration);
      URL.revokeObjectURL(audio.src);
    });
  };

  const handleSaveFormation = () => {
    // First formation starts at 00:00; subsequent at +10s from last
    const newTime = formations.length === 0 ? 0 : formations[formations.length - 1].time + 10;
    saveFormation(newTime);
    if (formations.length > 0) {
      setTravelTimeBetweenFormations(formations[formations.length - 1].time, newTime);
    }
  };

  const handleFormationTimeChange = (formationId, newTime) => {
    updateFormationTime(formationId, newTime);
    // Recalc travel times for both adjacent formations after store settles
    setTimeout(() => {
      const current = useStageStore.getState().formations;
      const sorted = [...current].sort((a, b) => a.time - b.time);
      const idx = sorted.findIndex((f) => f.id === formationId);
      if (idx < 0) return;
      // Previous → this
      if (idx > 0) {
        setTravelTimeBetweenFormations(sorted[idx - 1].time, sorted[idx].time);
      }
      // This → next
      if (idx < sorted.length - 1) {
        setTravelTimeBetweenFormations(sorted[idx].time, sorted[idx + 1].time);
      }
    }, 0);
  };

  const handlePlayTimeline = () => {
    if (dancerIds.length > 0) {
      triggerDancerPlay(dancerIds);
    }
  };

  const handlePlayPause = () => {
    if (isPaused) {
      resumePlayback();
    } else {
      pausePlayback();
    }
  };

  const handleJumpToFormation = (formationId) => {
    applyFormation(formationId);
  };

  if (!choreographyOpen) {
    return (
      <button
        type="button"
        className="choreography-toggle-btn"
        onClick={toggleChoreography}
        title="Choreography Timeline"
      >
        🎬 Choreography
      </button>
    );
  }

  return (
    <div className="choreography-timeline">
      {/* Top bar: compact horizontal layout */}
      <div className="choreography-timeline-top">
        <div className="choreography-timeline-left">
          <span className="choreography-timeline-title">🎬 Timeline</span>

          <label className="choreography-inline-label">
            End
            <input
              type="number"
              className="choreography-time-input choreography-time-input--sm"
              value={Math.floor(timelineEndTime / 60)}
              min={1} max={30}
              onChange={(e) => setTimelineEndTime(Math.max(1, parseInt(e.target.value) || 1) * 60)}
            />
            min
          </label>

          {/* Horizontal track */}
          <div className="choreography-timeline-bar">
            <div className="choreography-timeline-track">
              <span className="choreography-timeline-start">{formatTime(0)}</span>
              {sortedFormations.map((f) => {
                const pct = Math.min(100, (f.time / timelineEndTime) * 100);
                return (
                  <div key={f.id} className="choreography-timeline-marker"
                    style={{ left: `${pct}%` }}
                    title={`${f.name} — ${formatTime(f.time)}`}
                    onClick={() => handleJumpToFormation(f.id)}>
                    <div className="choreography-timeline-marker-dot" />
                  </div>
                );
              })}
              <span className="choreography-timeline-end">{formatTime(timelineEndTime)}</span>
            </div>
          </div>
        </div>

        <div className="choreography-timeline-right">
          <button type="button" className="btn btn-compact primary"
            disabled={dancerIds.length === 0} onClick={handlePlayTimeline} title="Play All">▶</button>
          <button type="button" className="btn btn-compact secondary"
            onClick={handlePlayPause} title={isPaused ? 'Resume' : 'Pause'}>
            {isPaused ? '▶' : '⏸'}
          </button>
          <button type="button" className="btn btn-compact secondary"
            onClick={handleSaveFormation} title="Save Current Formation">💾</button>
          <button type="button" className="btn btn-compact secondary"
            onClick={() => fileInputRef.current?.click()} title="Import Music">🎵</button>
          <input ref={fileInputRef} type="file" accept="audio/*" style={{ display: 'none' }}
            onChange={handleImportMusic} />
          {musicDuration && (
            <span className="choreography-music-duration">{formatTime(musicDuration)}</span>
          )}
          <button type="button" className="btn btn-compact secondary"
            onClick={toggleChoreography} title="End Choreography">End Choreography</button>
        </div>
      </div>

      {/* Formation list row */}
      <div className="choreography-formations">
        {formations.length === 0 && (
          <span className="choreography-empty">No formations yet — position dancers & click 💾</span>
        )}
        {sortedFormations.map((f) => (
          <div key={f.id} className="choreography-formation-row">
            {editingFormationId === f.id ? (
              <input type="text" className="choreography-name-input" value={f.name}
                maxLength={30} autoFocus
                onChange={(e) => updateFormationName(f.id, e.target.value)}
                onBlur={() => setEditingFormationId(null)}
                onKeyDown={(e) => { if (e.key === 'Enter') setEditingFormationId(null); }} />
            ) : (
              <span className="choreography-formation-name"
                onDoubleClick={() => setEditingFormationId(f.id)}>{f.name}</span>
            )}
            <input type="number" className="choreography-time-input choreography-time-input--xs"
              value={f.time} min={0} max={timelineEndTime} step={1}
              onChange={(e) => handleFormationTimeChange(f.id, Number(e.target.value))} />
            <span className="choreography-time-unit">s</span>
            <button type="button" className="btn btn-compact secondary choreography-btn--icon"
              onClick={() => handleJumpToFormation(f.id)} title="Jump">↺</button>
            <button type="button" className="btn btn-compact secondary choreography-btn--icon"
              onClick={() => removeFormation(f.id)} title="Remove">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
