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
  const updateFormationEndTime = useStageStore((s) => s.updateFormationEndTime);
  const setTimelineEndTime = useStageStore((s) => s.setTimelineEndTime);
  const setMusicDuration = useStageStore((s) => s.setMusicDuration);
  const triggerDancerPlay = useStageStore((s) => s.triggerDancerPlay);
  const pausePlayback = useStageStore((s) => s.pausePlayback);
  const resumePlayback = useStageStore((s) => s.resumePlayback);
  const setTravelTimeBetweenFormations = useStageStore((s) => s.setTravelTimeBetweenFormations);
  const applyFormation = useStageStore((s) => s.applyFormation);
  const setSelectedFormationId = useStageStore((s) => s.setSelectedFormationId);
  const stationaryMarkers = useStageStore((s) => s.stationaryMarkers);
  const addStationary = useStageStore((s) => s.addStationary);
  const updateStationaryTime = useStageStore((s) => s.updateStationaryTime);
  const updateStationaryDuration = useStageStore((s) => s.updateStationaryDuration);
  const updateStationaryName = useStageStore((s) => s.updateStationaryName);
  const removeStationary = useStageStore((s) => s.removeStationary);
  const playbackTime = useStageStore((s) => s.playbackTime);
  const props = useStageStore((s) => s.props);

  const fileInputRef = useRef(null);
  const [editingId, setEditingId] = useState(null);

  const dancerIds = props.filter((p) => p.type === 'dancer').map((p) => p.id);
  const sortedFormations = [...formations].sort((a, b) => a.time - b.time);

  // Combined timeline events (formations + stationary) for drawing lines
  const timelineEvents = [
    ...sortedFormations.map((f) => ({ ...f, kind: 'formation' })),
    ...stationaryMarkers.map((m) => ({ ...m, kind: 'stationary' })),
  ].sort((a, b) => a.time - b.time);

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
    const allEvents = [
      ...formations.map((f) => ({ time: f.time, end: f.endTime || f.time + 5 })),
      ...stationaryMarkers.map((m) => ({ time: m.time, end: m.time + m.duration })),
    ];
    const lastEnd = allEvents.length > 0 ? Math.max(...allEvents.map((e) => e.end)) : 0;
    const startT = lastEnd;
    saveFormation(startT, startT + 5);
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
    setSelectedFormationId(formationId);
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
              {/* Connecting lines between consecutive events */}
              {timelineEvents.map((evt, i) => {
                if (i === timelineEvents.length - 1) return null;
                const next = timelineEvents[i + 1];
                const leftPct = Math.min(100, (evt.time / timelineEndTime) * 100);
                const rightPct = Math.min(100, (next.time / timelineEndTime) * 100);
                const isBetweenHold = evt.kind === 'stationary' && next.kind === 'stationary';
                return (
                  <div key={`line-${evt.id}`}
                    className={`choreography-timeline-line ${isBetweenHold ? 'choreography-timeline-line--hold' : ''}`}
                    style={{ left: `${leftPct}%`, width: `${Math.max(0.5, rightPct - leftPct)}%` }}
                    onClick={() => {
                      if (evt.kind === 'formation') handleJumpToFormation(evt.id);
                    }}
                    title={evt.kind === 'formation' ? `${evt.name} → ${next.name}` : `${evt.name} (hold)`}
                  />
                );
              })}
              {/* Formation segments (orange bands) */}
              {sortedFormations.map((f) => {
                const leftPct = Math.min(100, (f.time / timelineEndTime) * 100);
                const endT = f.endTime || f.time + 5;
                const widthPct = Math.max(0.5, Math.min(100 - leftPct, ((endT - f.time) / timelineEndTime) * 100));
                return (
                  <div key={`form-seg-${f.id}`}
                    className="choreography-timeline-form-segment"
                    style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                    title={`${f.name}: ${formatTime(f.time)} – ${formatTime(endT)}`}
                    onClick={() => handleJumpToFormation(f.id)}
                  />
                );
              })}
              {/* Hold segments (colored bands for hold duration) */}
              {stationaryMarkers.map((m) => {
                const leftPct = Math.min(100, (m.time / timelineEndTime) * 100);
                const endTime = m.time + m.duration;
                const widthPct = Math.min(100 - leftPct, (m.duration / timelineEndTime) * 100);
                return (
                  <div key={`hold-${m.id}`}
                    className="choreography-timeline-hold-segment"
                    style={{ left: `${leftPct}%`, width: `${Math.max(0.5, widthPct)}%` }}
                    title={`${m.name}: ${formatTime(m.time)} – ${formatTime(endTime)}`}
                  />
                );
              })}
              {/* Formation dots (start + end) */}
              {sortedFormations.flatMap((f) => {
                const startPct = Math.min(100, (f.time / timelineEndTime) * 100);
                const endT = f.endTime || f.time + 5;
                const endPct = Math.min(100, (endT / timelineEndTime) * 100);
                return [
                  <div key={`fdot-${f.id}`} className="choreography-timeline-marker"
                    style={{ left: `${startPct}%` }}
                    title={`${f.name} start — ${formatTime(f.time)}`}
                    onClick={() => handleJumpToFormation(f.id)}>
                    <div className="choreography-timeline-marker-dot" />
                  </div>,
                  <div key={`fedot-${f.id}`} className="choreography-timeline-marker"
                    style={{ left: `${endPct}%` }}
                    title={`${f.name} end — ${formatTime(endT)}`}
                    onClick={() => handleJumpToFormation(f.id)}>
                    <div className="choreography-timeline-marker-dot choreography-timeline-marker-dot--end" />
                  </div>,
                ];
              })}
              {/* Stationary dots */}
              {stationaryMarkers.map((m) => {
                const pct = Math.min(100, (m.time / timelineEndTime) * 100);
                const prevFormation = sortedFormations.filter((f) => f.time <= m.time).pop();
                return (
                  <div key={m.id} className="choreography-timeline-marker"
                    style={{ left: `${pct}%` }}
                    title={`${m.name} — ${formatTime(m.time)}`}
                    onClick={() => {
                      if (prevFormation) handleJumpToFormation(prevFormation.id);
                      else if (sortedFormations.length > 0) handleJumpToFormation(sortedFormations[0].id);
                    }}>
                    <div className="choreography-timeline-marker-dot choreography-timeline-marker-dot--stationary" />
                  </div>
                );
              })}
              <span className="choreography-timeline-end">{formatTime(timelineEndTime)}</span>
              {/* Playback head */}
              {playbackTime > 0 && (
                <div className="choreography-timeline-playhead"
                  style={{ left: `${Math.min(100, (playbackTime / timelineEndTime) * 100)}%` }}>
                  <div className="choreography-timeline-playhead-line" />
                  <span className="choreography-timeline-playhead-label">{formatTime(playbackTime)}</span>
                </div>
              )}
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
            onClick={() => {
              const allEnds = [
                ...formations.map((f) => f.endTime || f.time + 5),
                ...stationaryMarkers.map((m) => m.time + m.duration),
              ];
              const startT = allEnds.length > 0 ? Math.max(0, ...allEnds) : 0;
              addStationary(startT, 5);
            }}
            title="Add Stationary Hold">⏳ Hold</button>
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
            {editingId === f.id ? (
              <input type="text" className="choreography-name-input" value={f.name}
                maxLength={30} autoFocus
                onChange={(e) => updateFormationName(f.id, e.target.value)}
                onBlur={() => setEditingId(null)}
                onKeyDown={(e) => { if (e.key === 'Enter') setEditingId(null); }} />
            ) : (
              <span className="choreography-formation-name"
                onDoubleClick={() => setEditingId(f.id)}>{f.name}</span>
            )}
            <input type="number" className="choreography-time-input choreography-time-input--xs"
              value={f.time} min={0} max={timelineEndTime} step={1}
              onChange={(e) => handleFormationTimeChange(f.id, Number(e.target.value))} />
            <span className="choreography-time-unit">s –</span>
            <input type="number" className="choreography-time-input choreography-time-input--xs"
              value={f.endTime || f.time + 5} min={f.time + 0.5} max={timelineEndTime} step={1}
              onChange={(e) => updateFormationEndTime(f.id, Number(e.target.value))} />
            <button type="button" className="btn btn-compact secondary choreography-btn--icon"
              onClick={() => handleJumpToFormation(f.id)} title="Jump">↺</button>
            <button type="button" className="btn btn-compact secondary choreography-btn--icon"
              onClick={() => removeFormation(f.id)} title="Remove">✕</button>
          </div>
        ))}
      </div>

      {/* Stationary holds list */}
      <div className="choreography-formations">
        {stationaryMarkers.map((m) => (
          <div key={m.id} className="choreography-formation-row" style={{ background: 'rgba(99, 102, 241, 0.08)' }}>
            {editingId === m.id ? (
              <input type="text" className="choreography-name-input" value={m.name}
                maxLength={30} autoFocus
                onChange={(e) => updateStationaryName(m.id, e.target.value)}
                onBlur={() => setEditingId(null)}
                onKeyDown={(e) => { if (e.key === 'Enter') setEditingId(null); }} />
            ) : (
              <span className="choreography-formation-name"
                onDoubleClick={() => setEditingId(m.id)}>{m.name}</span>
            )}
            <input type="number" className="choreography-time-input choreography-time-input--xs"
              value={m.time} min={0} max={timelineEndTime} step={1}
              onChange={(e) => updateStationaryTime(m.id, Number(e.target.value))} />
            <span className="choreography-time-unit">s</span>
            <span style={{ fontSize: '0.6rem', color: '#71717a' }}>for</span>
            <input type="number" className="choreography-time-input choreography-time-input--xs"
              value={m.duration} min={0.5} max={timelineEndTime} step={0.5}
              onChange={(e) => updateStationaryDuration(m.id, Number(e.target.value))} />
            <span className="choreography-time-unit">s</span>
            <button type="button" className="btn btn-compact secondary choreography-btn--icon"
              onClick={() => removeStationary(m.id)} title="Remove">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
