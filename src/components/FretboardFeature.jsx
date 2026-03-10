import React, { useState } from 'react';
import Fretboard from './Fretboard';
import { Target, Eye, EyeOff, RefreshCcw } from 'lucide-react';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const FretboardFeature = () => {
    const [highlightedNote, setHighlightedNote] = useState(null);
    const [isQuizMode, setIsQuizMode] = useState(false);
    const [targetNote, setTargetNote] = useState(null);
    const [score, setScore] = useState({ correct: 0, total: 0, wrong: 0 });
    const [bestScore, setBestScore] = useState(() => {
        const saved = localStorage.getItem('fretboardBestScore');
        return saved ? parseInt(saved, 10) : 0;
    });
    const [feedback, setFeedback] = useState(null);

    const [stringCount, setStringCount] = useState(4); // New state for string type

    const startQuiz = () => {
        setIsQuizMode(true);
        setHighlightedNote(null);
        setScore({ correct: 0, total: 0, wrong: 0 });
        setFeedback(null);
        pickRandomNote();
    };

    const pickRandomNote = () => {
        const randomNote = NOTES[Math.floor(Math.random() * NOTES.length)];
        setTargetNote(randomNote);
    };

    const stopQuiz = () => {
        setIsQuizMode(false);
        setTargetNote(null);
        setFeedback(null);
    };

    const handleNoteClick = (note, stringIndex, fretIndex) => {
        if (!isQuizMode) {
            // In learning mode, simply highlight the clicked note across the board
            setHighlightedNote(prev => (prev === note ? null : note));
            return;
        }

        // In quiz mode, evaluate the click
        if (note === targetNote) {
            setFeedback('정답입니다! 🎉');

            const newCorrect = score.correct + 1;
            setScore(prev => ({ ...prev, correct: newCorrect }));

            // Save best score specifically for the current string count
            const bestScoreKey = `fretboardBestScore_${stringCount}`;
            const currentBest = parseInt(localStorage.getItem(bestScoreKey) || '0', 10);

            if (newCorrect > currentBest) {
                setBestScore(newCorrect); // Optimistic UI update
                localStorage.setItem(bestScoreKey, newCorrect.toString());
            }

            setHighlightedNote(note);

            setTimeout(() => {
                setHighlightedNote(null);
                setFeedback(null);
                pickRandomNote();
            }, 1000);
        } else {
            const newWrongCount = score.wrong + 1;
            setScore(prev => ({ ...prev, total: prev.total + 1, wrong: newWrongCount }));
            setHighlightedNote(note); // Highlight the wrong note briefly

            if (newWrongCount >= 3) {
                setFeedback(`3번 틀렸습니다. 퀴즈가 종료됩니다! (최종 점수: ${score.correct}점)`);
                setTimeout(() => {
                    stopQuiz();
                }, 2000);
            } else {
                setFeedback(`틀렸습니다. ${targetNote}를 찾아보세요. (${newWrongCount}/3)`);
                setTimeout(() => {
                    setHighlightedNote(null);
                }, 500);
            }
        }
    };

    // Update best score display when string count changes
    React.useEffect(() => {
        const saved = localStorage.getItem(`fretboardBestScore_${stringCount}`);
        setBestScore(saved ? parseInt(saved, 10) : 0);
    }, [stringCount]);

    return (
        <div className="container animate-fade-in" style={{ paddingTop: '8rem', paddingBottom: '4rem', minHeight: '100vh' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>지판 학습</h1>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                    베이스 기타의 핵심인 지판을 학습합니다. 음계를 클릭하여 전체 지판에서 위치를 확인하거나, 퀴즈 모드로 실력을 테스트해 보세요.
                </p>
            </div>

            {/* Controls */}
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '100%', overflowX: 'hidden' }}>

                {/* String Count Toggle */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem', width: '100%' }}>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        background: 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: 'var(--radius-full)',
                        padding: '0.25rem',
                        gap: '0.25rem'
                    }}>
                        {[4, 5, 6].map(num => (
                            <button
                                key={num}
                                onClick={() => {
                                    if (!isQuizMode) setStringCount(num);
                                }}
                                disabled={isQuizMode}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: 'var(--radius-full)',
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    background: stringCount === num ? 'var(--primary)' : 'transparent',
                                    color: stringCount === num ? 'white' : 'var(--text-secondary)',
                                    transition: 'all 0.2s',
                                    opacity: isQuizMode && stringCount !== num ? 0.3 : 1,
                                    cursor: isQuizMode ? 'not-allowed' : 'pointer',
                                    flexShrink: 0
                                }}
                            >
                                {num}현 베이스
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Learning Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '1.1rem', marginRight: '0.5rem' }}>음계 찾기:</h3>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', maxWidth: '400px' }}>
                            {NOTES.map(n => (
                                <button
                                    key={n}
                                    onClick={() => {
                                        if (isQuizMode) stopQuiz();
                                        setHighlightedNote(n === highlightedNote ? null : n);
                                    }}
                                    className={`note-btn ${highlightedNote === n && !isQuizMode ? 'active' : ''}`}
                                    style={{
                                        width: '36px', height: '36px', borderRadius: 'var(--radius-sm)',
                                        background: highlightedNote === n && !isQuizMode ? 'var(--primary)' : 'var(--glass-bg)',
                                        border: `1px solid ${highlightedNote === n && !isQuizMode ? 'var(--accent)' : 'var(--glass-border)'}`,
                                        color: highlightedNote === n && !isQuizMode ? 'white' : 'var(--text-primary)',
                                        fontWeight: 600, transition: 'all 0.2s', cursor: 'pointer'
                                    }}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                        {/* Reserve space for the "Clear" button to prevent layout shift */}
                        <div style={{ width: '90px', display: 'flex', alignItems: 'center' }}>
                            {highlightedNote && !isQuizMode && (
                                <button
                                    onClick={() => setHighlightedNote(null)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginLeft: '0.5rem' }}
                                >
                                    <EyeOff size={16} /> 지우기
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Quiz Controls */}
                    <div style={{ borderLeft: '1px solid var(--glass-border)', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '250px' }}>
                        {!isQuizMode ? (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                                    <span style={{ fontSize: '0.9rem' }}>🏆 최고 기록 ({stringCount}현)</span>
                                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{bestScore}점</span>
                                </div>
                                <button onClick={startQuiz} className="btn btn-primary" style={{ width: '100%' }}>
                                    <Target size={18} /> 퀴즈 모드 시작
                                </button>
                            </>
                        ) : (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                                        타겟: <span className="text-gradient" style={{ fontSize: '1.5rem' }}>{targetNote}</span>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '2px' }}>
                                            최고 기록: {bestScore}
                                        </div>
                                        <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                                            점수: {score.correct} <span style={{ color: 'var(--danger)', marginLeft: '10px' }}>오답: {score.wrong}/3</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={stopQuiz} className="btn btn-glass" style={{ width: '100%', padding: '0.5rem' }}>
                                    <RefreshCcw size={16} /> 퀴즈 종료
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {feedback && (
                    <div className={`animate-fade-in ${feedback.includes('정답') ? 'text-gradient' : 'text-danger'}`} style={{ textAlign: 'center', marginBottom: '1.5rem', fontWeight: 700, fontSize: '1.25rem', height: '2rem' }}>
                        {feedback}
                    </div>
                )}

                {/* The Fretboard Component */}
                <Fretboard
                    highlightedNote={highlightedNote}
                    isQuizMode={isQuizMode}
                    onNoteClick={handleNoteClick}
                    stringCount={stringCount}
                />

            </div>
        </div>
    );
};

export default FretboardFeature;
