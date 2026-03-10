import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import FretboardFeature from './components/FretboardFeature';
import NoteMatching from './components/NoteMatching';
import SheetMusicQuiz from './components/SheetMusicQuiz';
import './index.css';

function App() {
  return (
    <HashRouter>
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/fretboard" element={<FretboardFeature />} />
            <Route path="/note-matching" element={<NoteMatching />} />
            <Route path="/sheet-music" element={<SheetMusicQuiz />} />
          </Routes>
        </main>

        {/* Simple Footer */}
        <footer style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', borderTop: '1px solid var(--glass-border)', background: 'rgba(2, 44, 34, 0.6)' }}>
          <p>© {new Date().getFullYear()} 네 줄의 미학. All rights reserved.</p>
        </footer>
      </div>
    </HashRouter>
  );
}

export default App;
