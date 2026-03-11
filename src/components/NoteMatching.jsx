import React, { useState, useEffect } from 'react';
import { Target, Shuffle, RefreshCcw } from 'lucide-react';
import './NoteMatching.css';

// Note mappings (excluding sharp/flat for basic learning, can be expanded later)
const NOTE_MAP = [
    { eng: 'C', solfege: '도' },
    { eng: 'C#', solfege: '도#' },
    { eng: 'D', solfege: '레' },
    { eng: 'D#', solfege: '레#' },
    { eng: 'E', solfege: '미' },
    { eng: 'F', solfege: '파' },
    { eng: 'F#', solfege: '파#' },
    { eng: 'G', solfege: '솔' },
    { eng: 'G#', solfege: '솔#' },
    { eng: 'A', solfege: '라' },
    { eng: 'A#', solfege: '라#' },
    { eng: 'B', solfege: '시' }
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

const NoteMatching = () => {
    const [isQuizMode, setIsQuizMode] = useState(false);
    const [quizType, setQuizType] = useState('engToSolfege'); // 'engToSolfege' or 'solfegeToEng'
    const [targetNote, setTargetNote] = useState(null);
    const [score, setScore] = useState({ correct: 0, total: 0, wrong: 0 });
    const [feedback, setFeedback] = useState(null);

    const [bestScore, setBestScore] = useState(() => {
        const saved = localStorage.getItem(`noteMatchingBestScore_${quizType}`);
        return saved ? parseInt(saved, 10) : 0;
    });

    // Reload best score when quiz type changes
    useEffect(() => {
        const saved = localStorage.getItem(`noteMatchingBestScore_${quizType}`);
        setBestScore(saved ? parseInt(saved, 10) : 0);
    }, [quizType]);

    const startQuiz = () => {
        setIsQuizMode(true);
        setScore({ correct: 0, total: 0, wrong: 0 });
        setFeedback(null);
        pickRandomTarget();
    };

    const stopQuiz = () => {
        setIsQuizMode(false);
        setTargetNote(null);
        setFeedback(null);
    };

    const pickRandomTarget = () => {
        const randomNote = NOTE_MAP[Math.floor(Math.random() * NOTE_MAP.length)];
        setTargetNote(randomNote);
    };

    const toggleQuizType = () => {
        setQuizType(prev => prev === 'engToSolfege' ? 'solfegeToEng' : 'engToSolfege');
        if (isQuizMode) {
            stopQuiz();
        }
    };

    const handleAnswerClick = (answerOption) => {
        if (!isQuizMode || !targetNote || score.wrong >= 3) return;

        // Determine correct answer based on quiz type
        const correctAnswer = quizType === 'engToSolfege' ? targetNote.solfege : targetNote.eng;
        const providedAnswer = quizType === 'engToSolfege' ? answerOption.solfege : answerOption.eng;

        if (providedAnswer === correctAnswer) {
            setFeedback('정답입니다! 🎉');

            const newCorrect = score.correct + 1;
            setScore(prev => ({ ...prev, correct: newCorrect }));

            if (newCorrect > bestScore) {
                setBestScore(newCorrect);
                localStorage.setItem(`noteMatchingBestScore_${quizType}`, newCorrect.toString());
            }

            setTimeout(() => {
                setFeedback(null);
                pickRandomTarget();
            }, 800);
        } else {
            const newWrongCount = score.wrong + 1;
            setScore(prev => ({ ...prev, total: prev.total + 1, wrong: newWrongCount }));

            if (newWrongCount >= 3) {
                setFeedback(`3번 틀렸습니다. 퀴즈가 종료됩니다! (최종 점수: ${score.correct}점)`);
                setTimeout(() => {
                    stopQuiz();
                }, 2000);
            } else {
                setFeedback(`틀렸습니다. 다시 시도해보세요! (${newWrongCount}/3)`);
            }
        }
    };

    // Determine what to show in the big target box and the buttons
    const displayTarget = targetNote ? (quizType === 'engToSolfege' ? targetNote.eng : targetNote.solfege) : '?';

    return (
        <div className="container animate-fade-in" style={{ paddingTop: '8rem', paddingBottom: '4rem', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem', width: '100%', maxWidth: '800px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>음계 매칭 퀴즈</h1>
                <p style={{ color: 'var(--text-secondary)', margin: '0 auto' }}>
                    알파벳 코드(C, D, E)와 계이름(도, 레, 미)을 서로 변환하며 외우는 능력을 훈련합니다.
                </p>
            </div>

            <div className="glass-panel responsive-quiz-panel" style={{ gap: '2rem' }}>

                {/* Header Controls */}
                <div className="quiz-header">

                    <div className="quiz-header-left">
                        <button
                            onClick={toggleQuizType}
                            className="btn btn-glass"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.6rem 1rem' }}
                            disabled={isQuizMode}
                        >
                            <Shuffle size={16} />
                            {quizType === 'engToSolfege' ? '모드: 영어 → 도레미' : '모드: 도레미 → 영어'}
                        </button>
                    </div>

                    <div className="quiz-header-controls">
                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>🏆 {quizType === 'engToSolfege' ? '영어→도레미' : '도레미→영어'} 최고 기록</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>{bestScore}점</div>
                        </div>

                        {!isQuizMode ? (
                            <button onClick={startQuiz} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                                <Target size={18} /> 시작하기
                            </button>
                        ) : (
                            <button onClick={stopQuiz} className="btn btn-danger" style={{ padding: '0.75rem 1.5rem' }}>
                                <RefreshCcw size={18} /> 강제 종료
                            </button>
                        )}
                    </div>
                </div>

                {/* Quiz Area */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: isQuizMode ? '2rem 0' : '0', minHeight: isQuizMode ? '350px' : '0', transition: 'all 0.3s ease', overflow: 'hidden' }}>

                    {/* Target Display */}
                    <div style={{ marginBottom: isQuizMode ? '3rem' : '0', position: 'relative', transition: 'all 0.3s ease' }}>
                        <div style={{
                            width: isQuizMode ? '150px' : '0',
                            height: isQuizMode ? '150px' : '0',
                            opacity: isQuizMode ? 1 : 0,
                            borderRadius: '20px',
                            background: isQuizMode ? 'var(--primary)' : 'var(--glass-bg)',
                            border: `2px solid ${isQuizMode ? 'var(--primary-glow)' : 'var(--glass-border)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '5rem',
                            fontWeight: 800,
                            overflow: 'hidden',
                            color: isQuizMode ? 'white' : 'transparent',
                            boxShadow: isQuizMode ? '0 0 30px rgba(16, 185, 129, 0.4)' : 'none',
                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }}>
                            {displayTarget}
                        </div>

                        {isQuizMode && (
                            <div style={{ position: 'absolute', top: '-15px', right: '-15px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '5px 10px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', boxShadow: 'var(--shadow-md)' }}>
                                점수: {score.correct}
                            </div>
                        )}
                        {isQuizMode && score.wrong > 0 && (
                            <div style={{ position: 'absolute', top: '-15px', left: '-15px', background: 'var(--danger)', color: 'white', borderRadius: '12px', padding: '5px 10px', fontSize: '0.9rem', fontWeight: 600, boxShadow: 'var(--shadow-md)' }}>
                                오답: {score.wrong}/3
                            </div>
                        )}
                    </div>

                    {/* Feedback Message */}
                    <div style={{ height: isQuizMode ? '2rem' : '0', marginBottom: isQuizMode ? '2rem' : '0', overflow: 'hidden', transition: 'all 0.3s ease', fontSize: '1.25rem', fontWeight: 700, width: '100%', textAlign: 'center' }}>
                        {feedback ? (
                            <span className={`animate-fade-in ${feedback.includes('정답') ? 'text-gradient' : 'text-danger'}`}>
                                {feedback}
                            </span>
                        ) : (
                            <span style={{ color: 'var(--text-muted)', opacity: isQuizMode ? 1 : 0 }}>
                                아래 보기에서 알맞은 음을 선택하세요
                            </span>
                        )}
                    </div>

                    {/* Answer Buttons (Piano Keyboard) */}
                    <div className="piano-keyboard animate-fade-in" style={{ marginTop: '0', pointerEvents: isQuizMode ? 'auto' : 'none', opacity: isQuizMode ? 1 : 0.5 }}>
                        {WHITE_KEYS.map((keyInfo, idx) => {
                            const whiteDisplay = quizType === 'engToSolfege' ? keyInfo.solfege : keyInfo.eng;
                            const whiteFullValue = NOTE_MAP.find(n => n.eng === keyInfo.eng);

                            let sharpDisplay = null;
                            let sharpFullValue = null;
                            if (keyInfo.sharpEng) {
                                sharpDisplay = quizType === 'engToSolfege' ? keyInfo.sharpSolfege : keyInfo.sharpEng;
                                sharpFullValue = NOTE_MAP.find(n => n.eng === keyInfo.sharpEng);
                            }

                            return (
                                <div key={idx} className="piano-key-container">
                                    <button
                                        onClick={() => handleAnswerClick(whiteFullValue)}
                                        disabled={!isQuizMode}
                                        className={`piano-key white-key ${isQuizMode ? 'active' : 'disabled'}`}
                                    >
                                        <span className="key-label white-label">{whiteDisplay}</span>
                                    </button>

                                    {keyInfo.sharpEng && (
                                        <button
                                            onClick={() => handleAnswerClick(sharpFullValue)}
                                            disabled={!isQuizMode}
                                            className={`piano-key black-key ${isQuizMode ? 'active' : 'disabled'}`}
                                        >
                                            <span className="key-label black-label">{sharpDisplay}</span>
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                </div>

            </div>
        </div>
    );
};

export default NoteMatching;
