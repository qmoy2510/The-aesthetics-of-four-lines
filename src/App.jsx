import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import FretboardFeature from './components/FretboardFeature';
import ScaleStudy from './components/ScaleStudy';
import NoteMatching from './components/NoteMatching';
import SheetMusicQuiz from './components/SheetMusicQuiz';
import ComingSoon from './components/ComingSoon';
import './index.css';

function App() {
  return (
    <HashRouter>
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Theory Routes */}
            <Route path="/fretboard" element={<FretboardFeature />} />
            <Route path="/scale-study" element={<ScaleStudy />} />
            <Route path="/note-matching" element={<NoteMatching />} />
            <Route path="/sheet-music" element={<SheetMusicQuiz />} />
            <Route path="/practice-pitch" element={<ComingSoon title="음정 감지 연습" description="마이크를 통해 실제 베이스 기타 소리를 인식하여, 화면에 표시된 음정과 일치하는지 실시간으로 판별해주는 연습 모드입니다. 곧 업데이트 됩니다!" />} />
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
