import React, { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import './index.css';

const FretboardFeature = lazy(() => import('./components/FretboardFeature'));
const ScaleStudy      = lazy(() => import('./components/ScaleStudy'));
const NoteMatching    = lazy(() => import('./components/NoteMatching'));
const SheetMusicQuiz  = lazy(() => import('./components/SheetMusicQuiz'));
const PracticePitch   = lazy(() => import('./components/PracticePitch'));

const PageLoader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'var(--text-muted)', fontSize: '1rem' }}>
    로딩 중...
  </div>
);

function App() {
  return (
    <HashRouter>
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/fretboard"     element={<FretboardFeature />} />
              <Route path="/scale-study"   element={<ScaleStudy />} />
              <Route path="/note-matching" element={<NoteMatching />} />
              <Route path="/sheet-music"   element={<SheetMusicQuiz />} />
              <Route path="/practice-pitch" element={<PracticePitch />} />
            </Routes>
          </Suspense>
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
