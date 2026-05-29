import { useState } from 'react';
import { Scene3D } from './components/scene/Scene3D';
import { Sidebar } from './components/ui/Sidebar';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { SelectedPanel } from './components/ui/SelectedPanel';
import './App.css';

function App() {
  useKeyboardShortcuts();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={`app ${sidebarOpen ? '' : 'app--sidebar-collapsed'}`}>
      <div className="sidebar-shell" aria-hidden={!sidebarOpen}>
        <Sidebar />
        <button
          type="button"
          className="sidebar-edge-btn sidebar-edge-btn--collapse"
          onClick={() => setSidebarOpen(false)}
          title="收起侧栏，全屏预览"
          aria-label="收起侧栏，全屏预览"
        >
          <span aria-hidden>‹</span>
        </button>
      </div>
      {!sidebarOpen && (
        <button
          type="button"
          className="sidebar-edge-btn sidebar-edge-btn--expand"
          onClick={() => setSidebarOpen(true)}
          title="展开侧栏"
          aria-label="展开侧栏"
        >
          <span aria-hidden>›</span>
        </button>
      )}
      <main className="viewport">
        <Scene3D />
        <div className="viewport-badge">3D Preview</div>
        <SelectedPanel />
      </main>
    </div>
  );
}

export default App;
