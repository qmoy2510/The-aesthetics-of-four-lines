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
    'easy': { targets: 3, label: '쉬움 (3음표 타겟)' },
    'normal': { targets: 5, label: '보통 (5음표 타겟)' },
    'hard': { targets: 8, label: '어려움 (8음표 타겟)' }
};

const SheetMusicQuiz = () => {
    const [difficulty, setDifficulty] = useState('easy');
    const [isQuizMode, setIsQuizMode] = useState(false);

    // Quiz State
    const [quizSequence, setQuizSequence] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState({ correct: 0, wrong: 0 });
    const [feedback, setFeedback] = useState(null);
    const [isShaking, setIsShaking] = useState(false);

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
        if (!isQuizMode || currentIndex >= quizSequence.length || score.wrong >= 3) return;

        const currentTarget = quizSequence[currentIndex];

        if (selectedEng === currentTarget.eng) {
            setFeedback('정답!');

            if (currentIndex + 1 < quizSequence.length) {
                // Move to next note immediately
                setCurrentIndex(prev => prev + 1);
                setFeedback(null);
            } else {
                // Completed the whole sequence exactly
                const newCorrect = score.correct + 1; // Count full sequences as "correct"
                setScore(prev => ({ ...prev, correct: newCorrect }));
                setFeedback('세트 클리어! 🎉 다음 악보를 생성합니다.');

                if (newCorrect > bestScore) {
                    setBestScore(newCorrect);
                    localStorage.setItem(`sheetMusicBestScore_${difficulty}`, newCorrect.toString());
                }

                // Immediately generate next level after short delay
                setTimeout(() => {
                    setQuizSequence(generateSequence(DIFFICULTY_MAP[difficulty].targets));
                    setCurrentIndex(0);
                    setFeedback(null);
                }, 1500);
            }
        } else {
            const newWrong = score.wrong + 1;
            setScore(prev => ({ ...prev, wrong: newWrong }));

            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 400);

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

        // Dynamically calculate spacing based on the number of notes
        const noteCount = isQuizMode ? quizSequence.length : DIFFICULTY_MAP[difficulty].targets;
        const startX = 140; // Starts a bit after the bass clef
        const availableWidth = 420; // 600(SVG width) - 140(startX) - 40(right margin)
        // Spread notes evenly, but cap the maximum spacing so it doesn't look too disconnected
        const spacingX = noteCount > 1 ? Math.min(80, availableWidth / (noteCount - 1)) : 80;

        return (
            <div style={{ 
                width: '100%', 
                margin: isQuizMode ? '2rem 0' : '0', 
                display: 'flex', 
                justifyContent: 'center',
                maxHeight: isQuizMode ? '500px' : '0',
                opacity: isQuizMode ? 1 : 0,
                transition: 'max-height 0.4s ease, opacity 0.4s ease, margin 0.4s ease',
                overflow: 'hidden'
            }}>
                <svg
                    width="100%" height="auto" viewBox="0 0 600 200"
                    className={isShaking ? 'shake' : ''}
                    style={{ background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--glass-border)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}
                >

                    {/* Extra Ledger Lines (Rendered per note) */}
                    {isQuizMode && quizSequence.map((note, index) => {
                        const xPos = startX + (index * spacingX);
                        if (note.y <= 20) return <line key={`ledger-top-${index}`} x1={xPos - 20} y1="20" x2={xPos + 20} y2="20" stroke="#334155" strokeWidth="2" />;
                        if (note.y >= 140) return <line key={`ledger-bot-${index}`} x1={xPos - 20} y1="140" x2={xPos + 20} y2="140" stroke="#334155" strokeWidth="2" />;
                        return null;
                    })}

                    {/* 5 Staff Lines */}
                    {staffLines.map((y, index) => (
                        <line key={`staff-${index}`} x1="20" y1={y} x2="580" y2={y} stroke="#334155" strokeWidth="2" />
                    ))}

                    {/* Bass Clef Symbol - 크기 키우고 위치 내림 (122로 고정) */}
                    <text x="20" y="122" fontSize="110" fontFamily="serif" fill="#1e293b" fontWeight="bold">𝄢</text>

                    <line x1="20" y1="40" x2="20" y2="120" stroke="#334155" strokeWidth="4" />
                    <line x1="580" y1="40" x2="580" y2="120" stroke="#334155" strokeWidth="4" />

                    {/* Target Notes Render - All at once */}
                    {isQuizMode && quizSequence.map((targetNote, index) => {
                        const xPos = startX + (index * spacingX);

                        // Determine color based on progress
                        let noteColor = '#94a3b8'; // Future note (grayish)
                        if (index < currentIndex) {
                            noteColor = 'var(--primary)'; // Passed (correct) note
                        } else if (index === currentIndex) {
                            noteColor = '#1e293b'; // Current active note (dark)
                            if (feedback && feedback.includes('정답')) noteColor = 'var(--primary)';
                            if (feedback && feedback.includes('틀렸')) noteColor = 'var(--danger)';
                        }

                        return (
                            <g key={`note-${index}`}>
                                {/* Active indicator triangle */}
                                {index === currentIndex && (
                                    <polygon points={`${xPos - 6},12 ${xPos + 6},12 ${xPos},22`} fill="var(--primary)" className="animate-fade-in" />
                                )}

                                {/* Note Head */}
                                <ellipse cx={xPos} cy={targetNote.y} rx="12" ry="9" fill={noteColor} transform={`rotate(-15 ${xPos} ${targetNote.y})`} style={{ transition: 'fill 0.3s ease' }} />

                                {/* Note Stem Logic: 
                                    In bass clef, the middle line is D (y=80). Notes below the middle line (y > 80) have stems pointing UP on the RIGHT side.
                                    Notes on or above the middle line (y <= 80) have stems pointing DOWN on the LEFT side.
                                */}
                                {targetNote.y > 80 ? (
                                    // Stem pointing UP (Right side)
                                    <line x1={xPos + 11} y1={targetNote.y} x2={xPos + 11} y2={targetNote.y - 45} stroke={noteColor} strokeWidth="2" style={{ transition: 'stroke 0.3s ease' }} />
                                ) : (
                                    // Stem pointing DOWN (Left side)
                                    <line x1={xPos - 11} y1={targetNote.y} x2={xPos - 11} y2={targetNote.y + 45} stroke={noteColor} strokeWidth="2" style={{ transition: 'stroke 0.3s ease' }} />
                                )}

                                {/* Helper Text for Dev / Debug (Optional, disabled for real game) */}
                                {/* <text x={xPos - 5} y={targetNote.y + 25} fontSize="10">{targetNote.eng}</text> */}
                            </g>
                        );
                    })}
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

            <div className="glass-panel responsive-quiz-panel" style={{ gap: '1rem' }}>

                {/* Header / Controls */}
                <div className="quiz-header">
                    <div className="quiz-header-left">
                        <select
                            value={difficulty}
                            onChange={(e) => { setDifficulty(e.target.value); stopQuiz(); }}
                            disabled={isQuizMode}
                            style={{ padding: '0.6rem 1rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', color: 'white', fontWeight: 600, outline: 'none' }}
                        >
                            <option value="easy">쉬움 (3개 동시 등장)</option>
                            <option value="normal">보통 (5개 동시 등장)</option>
                            <option value="hard">어려움 (8개 동시 등장)</option>
                        </select>
                    </div>

                    <div className="quiz-header-controls">
                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>🏆 세트 연속 클리어 최고 기록</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>{bestScore} 연속</div>
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
                <div style={{ height: isQuizMode ? '2rem' : '0', overflow: 'hidden', textAlign: 'center', marginTop: isQuizMode ? '1rem' : '0', fontWeight: 700, fontSize: '1.25rem', transition: 'all 0.3s ease' }}>
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
