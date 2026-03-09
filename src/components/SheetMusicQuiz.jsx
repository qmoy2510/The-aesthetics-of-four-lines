import React, { useState, useEffect } from 'react';
import { Target, RefreshCcw } from 'lucide-react';
import './NoteMatching.css';

// 1. Bass Clef Notes Mapping (Y coordinates relative to the 200px height SVG)
const BASS_NOTES = [
    { eng: 'E', y: 140 }, // Under staff
    { eng: 'F', y: 130 },
    { eng: 'G', y: 120 }, // Bottom line
    { eng: 'A', y: 110 }, // First space
    { eng: 'B', y: 100 }, // Second line
    { eng: 'C', y: 90 },  // Second space
    { eng: 'D', y: 80 },  // Third line
    { eng: 'E', y: 70 },  // Third space
    { eng: 'F', y: 60 },  // Fourth line
    { eng: 'G', y: 50 },  // Fourth space
    { eng: 'A', y: 40 },  // Top line
    { eng: 'B', y: 30 },  // Above staff
    { eng: 'C', y: 20 },  // Above staff (Middle C)
];

const WHITE_KEYS = [
    { eng: 'C', solfege: '도', sharpEng: 'C#', sharpSolfege: '도#' },
    { eng: 'D', solfege: '레', sharpEng: 'D#', sharpSolfege: '레#' },
    { eng: 'E', solfege: '미', sharpEng: null, sharpSolfege: null },
    { eng: 'F', solfege: '파', sharpEng: 'F#', sharpSolfege: '파#' },
    { eng: 'G', solfege: '솔', sharpEng: 'G#', sharpSolfege: '솔#' },
    { eng: 'A', solfege: '라', sharpEng: 'A#', sharpSolfege: '라#' },
    { eng: 'B', solfege: '시', sharpEng: null, sharpSolfege: null }
];

const DIFFICULTY_MAP = {
    'easy': { targets: 3, label: '쉬움 (3문제)' },
    'normal': { targets: 5, label: '보통 (5문제)' },
    'hard': { targets: 10, label: '어려움 (10문제)' }
};

const SheetMusicQuiz = () => {
    const [difficulty, setDifficulty] = useState('easy');
    const [isQuizMode, setIsQuizMode] = useState(false);

    // Quiz State
    const [quizSequence, setQuizSequence] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState({ correct: 0, wrong: 0 });
    const [feedback, setFeedback] = useState(null);

    const [bestScore, setBestScore] = useState(() => {
        const saved = localStorage.getItem(`sheetMusicBestScore_${difficulty}`);
        return saved ? parseInt(saved, 10) : 0;
    });

    useEffect(() => {
        const saved = localStorage.getItem(`sheetMusicBestScore_${difficulty}`);
        setBestScore(saved ? parseInt(saved, 10) : 0);
    }, [difficulty]);

    const generateSequence = (length) => {
        const seq = [];
        for (let i = 0; i < length; i++) {
            const randomNote = BASS_NOTES[Math.floor(Math.random() * BASS_NOTES.length)];
            seq.push(randomNote);
        }
        return seq;
    };

    const startQuiz = () => {
        const targetCount = DIFFICULTY_MAP[difficulty].targets;
        setQuizSequence(generateSequence(targetCount));
        setCurrentIndex(0);
        setScore({ correct: 0, wrong: 0 });
        setFeedback(null);
        setIsQuizMode(true);
    };

    const stopQuiz = () => {
        setIsQuizMode(false);
        setQuizSequence([]);
        setCurrentIndex(0);
        setFeedback(null);
    };

    const handleAnswerClick = (selectedEng) => {
        if (!isQuizMode || currentIndex >= quizSequence.length) return;

        const currentTarget = quizSequence[currentIndex];

        if (selectedEng === currentTarget.eng) {
            setFeedback('정답!');
            const newCorrect = score.correct + 1;
            setScore(prev => ({ ...prev, correct: newCorrect }));

            if (currentIndex + 1 < quizSequence.length) {
                setTimeout(() => {
                    setCurrentIndex(prev => prev + 1);
                    setFeedback(null);
                }, 400);
            } else {
                setFeedback(`클리어! (${DIFFICULTY_MAP[difficulty].targets}개 달성 🎉)`);
                if (newCorrect > bestScore) {
                    setBestScore(newCorrect);
                    localStorage.setItem(`sheetMusicBestScore_${difficulty}`, newCorrect.toString());
                }
                setTimeout(() => stopQuiz(), 2500);
            }
        } else {
            const newWrong = score.wrong + 1;
            setScore(prev => ({ ...prev, wrong: newWrong }));
            if (newWrong >= 3) {
                setFeedback(`3번 틀렸습니다. 퀴즈 종료!`);
                setTimeout(() => stopQuiz(), 2000);
            } else {
                setFeedback(`틀렸습니다! (${newWrong}/3)`);
            }
        }
    };

    const renderStaff = () => {
        const staffLines = [40, 60, 80, 100, 120];
        const currentTarget = isQuizMode && quizSequence.length > 0 ? quizSequence[currentIndex] : null;

        return (
            <div style={{ width: '100%', overflowX: 'auto', margin: '2rem 0', display: 'flex', justifyContent: 'center' }}>
                <svg width="400" height="200" viewBox="0 0 400 200" style={{ background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--glass-border)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>

                    {/* Extra Ledger Lines */}
                    {currentTarget && currentTarget.y <= 20 && <line x1="180" y1="20" x2="220" y2="20" stroke="#334155" strokeWidth="2" />}
                    {currentTarget && currentTarget.y >= 140 && <line x1="180" y1="140" x2="220" y2="140" stroke="#334155" strokeWidth="2" />}

                    {/* 5 Staff Lines */}
                    {staffLines.map((y, index) => (
                        <line key={index} x1="20" y1={y} x2="380" y2={y} stroke="#334155" strokeWidth="2" />
                    ))}

                    {/* Bass Clef Symbol */}
                    <text x="30" y="95" fontSize="80" fontFamily="serif" fill="#1e293b" fontWeight="bold">𝄢</text>

                    <line x1="20" y1="40" x2="20" y2="120" stroke="#334155" strokeWidth="4" />
                    <line x1="380" y1="40" x2="380" y2="120" stroke="#334155" strokeWidth="4" />

                    {/* Target Note Render */}
                    {currentTarget && (
                        <g>
                            <ellipse cx="200" cy={currentTarget.y} rx="12" ry="9" fill={feedback && feedback.includes('정답') ? 'var(--primary)' : '#1e293b'} transform={`rotate(-15 200 ${currentTarget.y})`} />
                            <line x1="211" y1={currentTarget.y} x2="211" y2={currentTarget.y - 45} stroke={feedback && feedback.includes('정답') ? 'var(--primary)' : '#1e293b'} strokeWidth="2" />
                        </g>
                    )}
                </svg>
            </div>
        );
    };

    return (
        <div className="container animate-fade-in" style={{ paddingTop: '8rem', paddingBottom: '4rem', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem', width: '100%', maxWidth: '800px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>악보 퀴즈</h1>
                <p style={{ color: 'var(--text-secondary)', margin: '0 auto' }}>
                    낮은자리표(Bass Clef)를 보고 정확한 음계를 읽어내는 초견 능력을 기릅니다.
                </p>
            </div>

            <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                {/* Header / Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <select
                            value={difficulty}
                            onChange={(e) => { setDifficulty(e.target.value); stopQuiz(); }}
                            disabled={isQuizMode}
                            style={{ padding: '0.6rem 1rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', color: 'white', fontWeight: 600, outline: 'none' }}
                        >
                            <option value="easy">쉬움 (3문제 연속)</option>
                            <option value="normal">보통 (5문제 연속)</option>
                            <option value="hard">어려움 (10문제 연속)</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>🏆 최고 기록</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>{bestScore}점</div>
                        </div>

                        {!isQuizMode ? (
                            <button onClick={startQuiz} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                                <Target size={18} /> 시작하기
                            </button>
                        ) : (
                            <button onClick={stopQuiz} className="btn btn-danger" style={{ padding: '0.75rem 1.5rem' }}>
                                <RefreshCcw size={18} /> 종료
                            </button>
                        )}
                    </div>
                </div>

                {isQuizMode && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 1rem', marginTop: '1rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.2rem' }}>
                            진행: {currentIndex + 1} / {quizSequence.length}
                        </div>
                        <div style={{ fontWeight: 600, color: 'var(--danger)' }}>
                            오답: {score.wrong}/3
                        </div>
                    </div>
                )}

                {/* Feedback Area */}
                <div style={{ height: '2rem', textAlign: 'center', marginTop: '1rem', fontWeight: 700, fontSize: '1.25rem' }}>
                    {feedback ? (
                        <span className={`animate-fade-in ${feedback.includes('정답') || feedback.includes('클리어') ? 'text-gradient' : 'text-danger'}`}>
                            {feedback}
                        </span>
                    ) : (
                        <span style={{ color: 'var(--text-muted)', opacity: isQuizMode ? 1 : 0 }}>
                            해당 음표가 지시하는 건반을 누르세요.
                        </span>
                    )}
                </div>

                {renderStaff()}

                {/* Keyboard Input */}
                <div className="piano-keyboard animate-fade-in" style={{ marginTop: '0', pointerEvents: isQuizMode ? 'auto' : 'none', opacity: isQuizMode ? 1 : 0.5 }}>
                    {WHITE_KEYS.map((keyInfo, idx) => {
                        return (
                            <div key={idx} className="piano-key-container">
                                <button
                                    onClick={() => handleAnswerClick(keyInfo.eng)}
                                    className={`piano-key white-key ${isQuizMode ? 'active' : 'disabled'}`}
                                >
                                    <span className="key-label white-label">{keyInfo.eng}</span>
                                </button>

                                {keyInfo.sharpEng && (
                                    <button
                                        onClick={() => handleAnswerClick(keyInfo.sharpEng)}
                                        className={`piano-key black-key ${isQuizMode ? 'active' : 'disabled'}`}
                                    >
                                        <span className="key-label black-label">{keyInfo.sharpEng}</span>
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};

export default SheetMusicQuiz;
