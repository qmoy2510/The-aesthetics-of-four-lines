import React, { useState, useEffect } from 'react';
import Fretboard, { TUNING_PRESETS, getNoteAtFret } from './Fretboard';
import { Target, Eye, EyeOff, RefreshCcw, Play } from 'lucide-react';
import './ScaleStudy.css';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Define intervals for different scales (in semitones)
const SCALES = {
    'Major': [2, 2, 1, 2, 2, 2, 1], // W-W-H-W-W-W-H
    'Minor (Natural)': [2, 1, 2, 2, 1, 2, 2], // W-H-W-W-H-W-W
    'Major Pentatonic': [2, 2, 3, 2, 3],
    'Minor Pentatonic': [3, 2, 2, 3, 2],
    'Blues': [3, 2, 1, 1, 3, 2]
};

// Calculate all notes in a scale starting from a root note
const getScaleNotes = (root, scaleType) => {
    const rootIdx = NOTES.indexOf(root);
    const intervals = SCALES[scaleType];
    const notes = [root];

    let currentIdx = rootIdx;
    for (let i = 0; i < intervals.length - 1; i++) { // Skip the last interval as it returns to the root
        currentIdx = (currentIdx + intervals[i]) % NOTES.length;
        notes.push(NOTES[currentIdx]);
    }
    return notes;
};

// Find all possible positions of the scale on the fretboard within a reasonable range (1 octave)
// For simplicity in quiz mode, we'll try to find an ascending path starting from the lowest possible root note
const generateQuizPath = (root, scaleNotes, stringCount) => {
    const path = [];
    const tuning = TUNING_PRESETS[stringCount];

    // Find the lowest possible starting root note
    let startSIdx = -1;
    let startFIdx = -1;

    // Search from lowest string (highest index) to highest string
    for (let s = stringCount - 1; s >= 0; s--) {
        const openNote = tuning[s].note;
        for (let f = 1; f <= 12; f++) { // Search from fret 1 to 12
            if (getNoteAtFret(openNote, f) === root) {
                startSIdx = s;
                startFIdx = f;
                break;
            }
        }
        if (startSIdx !== -1) break;
    }

    if (startSIdx === -1) return []; // Should rarely happen, maybe for very high notes on 4-string

    path.push({ sIdx: startSIdx, fIdx: startFIdx, note: root });

    // Try to find the next note in the scale slightly higher on the fretboard (same string or next string up)
    let currentSIdx = startSIdx;
    let currentFIdx = startFIdx;

    for (let i = 1; i < scaleNotes.length; i++) {
        const targetNote = scaleNotes[i];
        let foundNext = false;

        // Strategy: Look on the current string, then the next string up (lower sIdx)
        for (let s = currentSIdx; s >= Math.max(0, currentSIdx - 1); s--) {
            const openNote = tuning[s].note;
            // Limit search range to reachable frets (-2 to +5 frets from current position)
            const minSearchFret = Math.max(1, currentFIdx - 2);
            for (let f = minSearchFret; f <= 12; f++) {
                // Ensure we go higher in pitch (either higher fret on same string, or lower string index)
                if (s === currentSIdx && f <= currentFIdx) continue;

                if (getNoteAtFret(openNote, f) === targetNote) {
                    currentSIdx = s;
                    currentFIdx = f;
                    path.push({ sIdx: currentSIdx, fIdx: currentFIdx, note: targetNote });
                    foundNext = true;
                    break;
                }
            }
            if (foundNext) break;
        }

        // Fallback: If not found in immediate vicinity, search everywhere from fret 1
        if (!foundNext) {
            for (let s = currentSIdx; s >= 0; s--) {
                const openNote = tuning[s].note;
                for (let f = 1; f <= 12; f++) {
                    // Still enforce pitch ascending
                    if (s === currentSIdx && f <= currentFIdx) continue;

                    if (getNoteAtFret(openNote, f) === targetNote) {
                        currentSIdx = s;
                        currentFIdx = f;
                        path.push({ sIdx: currentSIdx, fIdx: currentFIdx, note: targetNote });
                        foundNext = true;
                        break;
                    }
                }
                if (foundNext) break;
            }
        }
    }

    // Append octave root
    let finalRootFound = false;
    for (let s = currentSIdx; s >= 0; s--) {
        const openNote = tuning[s].note;
        for (let f = 1; f <= 12; f++) {
            if (s === currentSIdx && f <= currentFIdx) continue;
            if (getNoteAtFret(openNote, f) === root) {
                path.push({ sIdx: s, fIdx: f, note: root });
                finalRootFound = true;
                break;
            }
        }
        if (finalRootFound) break;
    }

    return path;
};

const ScaleStudy = () => {
    const [selectedRoot, setSelectedRoot] = useState('C');
    const [selectedScale, setSelectedScale] = useState('Major');
    const [stringCount, setStringCount] = useState(4);

    const [scaleNotes, setScaleNotes] = useState([]);

    // Quiz State
    const [isQuizMode, setIsQuizMode] = useState(false);
    const [quizPath, setQuizPath] = useState([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [mistakes, setMistakes] = useState(0);
    const [highlightedNote, setHighlightedNote] = useState(null); // Used to show currently clicked/wrong notes

    useEffect(() => {
        const notes = getScaleNotes(selectedRoot, selectedScale);
        setScaleNotes(notes);
    }, [selectedRoot, selectedScale]);

    const handleStartQuiz = () => {
        const notes = getScaleNotes(selectedRoot, selectedScale);
        const path = generateQuizPath(selectedRoot, notes, stringCount);

        if (path.length > 0) {
            setQuizPath(path);
            setCurrentStepIndex(0);
            setMistakes(0);
            setFeedback(null);
            setHighlightedNote(null);
            setIsQuizMode(true);
        } else {
            setFeedback("해당 스케일의 경로를 계산할 수 없습니다. 다른 음을 선택해보세요.");
            setTimeout(() => setFeedback(null), 2000);
        }
    };

    const stopQuiz = () => {
        setIsQuizMode(false);
        setQuizPath([]);
        setCurrentStepIndex(0);
        setFeedback(null);
        setHighlightedNote(null);
    };

    const handleNoteClick = (note, sIdx, fIdx) => {
        if (fIdx === 0) return; // Prevent open string selection fully for consistency

        if (!isQuizMode) {
            // Interactive Learning: If user clicks a note not in the scale, ignore.
            // If it is, maybe highlight just that one? For scale study, it's better to show all notes natively.
            // We'll let them click to highlight specifically where that note is globally.
            setHighlightedNote(prev => (prev === note ? null : note));
            return;
        }

        const target = quizPath[currentStepIndex];

        if (sIdx === target.sIdx && fIdx === target.fIdx) {
            // Correct note
            setFeedback('정답입니다!');
            setHighlightedNote({ sIdx, fIdx, isWrong: false });

            setTimeout(() => {
                setHighlightedNote(null);
                setFeedback(null);

                if (currentStepIndex + 1 < quizPath.length) {
                    setCurrentStepIndex(prev => prev + 1);
                } else {
                    setFeedback('🎉 스케일 마스터! 축하합니다!');
                    setTimeout(() => {
                        stopQuiz();
                    }, 2000);
                }
            }, 500);
        } else {
            // Wrong note
            setMistakes(prev => prev + 1);
            setHighlightedNote({ sIdx, fIdx, isWrong: true });

            if (mistakes + 1 >= 3) {
                setFeedback(`3번 틀렸습니다. 스케일을 다시 확인해보세요!`);
                setTimeout(() => {
                    stopQuiz();
                }, 2000);
            } else {
                setFeedback(`틀렸습니다! 지정된 순서의 올바른 칸을 누르세요. (${mistakes + 1}/3)`);
                setTimeout(() => {
                    setHighlightedNote(null);
                }, 500);
            }
        }
    };

    // When not in quiz mode, we need to pass a property to Fretboard or handle highlighting differently
    // to show *all* notes in the scale.
    // We'll override the Fretboard component's highlighting behavior for scale learning.

    // Calculate progress percentage
    const progress = isQuizMode && quizPath.length > 0 ? (currentStepIndex / quizPath.length) * 100 : 0;

    return (
        <div className="container animate-fade-in" style={{ paddingTop: '6rem', paddingBottom: '2rem', minHeight: '100vh' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>스케일 학습</h1>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                    다양한 스케일의 지판 위 형태를 눈으로 익히고, 순서대로 눌러보며 완벽하게 암기해 보세요.
                </p>
            </div>

            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '100%', overflowX: 'hidden' }}>

                {!isQuizMode && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* String Count Toggle */}
                        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <div style={{
                                display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
                                background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                                borderRadius: 'var(--radius-full)', padding: '0.25rem', gap: '0.25rem'
                            }}>
                                {[4, 5, 6].map(num => (
                                    <button
                                        key={num}
                                        onClick={() => setStringCount(num)}
                                        style={{
                                            padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)',
                                            fontWeight: 600, fontSize: '0.85rem',
                                            background: stringCount === num ? 'var(--primary)' : 'transparent',
                                            color: stringCount === num ? 'white' : 'var(--text-secondary)',
                                            transition: 'all 0.2s', cursor: 'pointer', flexShrink: 0
                                        }}
                                    >
                                        {num}현
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Scale Settings */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>루트(Root):</span>
                                <select
                                    value={selectedRoot}
                                    onChange={(e) => setSelectedRoot(e.target.value)}
                                    style={{
                                        background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid var(--glass-border)',
                                        borderRadius: 'var(--radius-sm)', padding: '0.5rem', outline: 'none',
                                        fontSize: '1rem', fontWeight: 600, cursor: 'pointer'
                                    }}
                                >
                                    {NOTES.map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>스케일(Scale):</span>
                                <select
                                    value={selectedScale}
                                    onChange={(e) => setSelectedScale(e.target.value)}
                                    style={{
                                        background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid var(--glass-border)',
                                        borderRadius: 'var(--radius-sm)', padding: '0.5rem', outline: 'none',
                                        fontSize: '1rem', fontWeight: 600, cursor: 'pointer'
                                    }}
                                >
                                    {Object.keys(SCALES).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            <button onClick={handleStartQuiz} className="btn btn-primary" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Play size={16} /> 퀴즈 시작
                            </button>
                        </div>

                        <div style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 700, marginTop: '0.5rem' }}>
                            <span className="text-gradient">{selectedRoot} {selectedScale}</span> 구성음:
                            <span style={{ color: 'var(--text-secondary)', marginLeft: '10px' }}>{scaleNotes.join(' - ')}</span>
                        </div>
                    </div>
                )}

                {isQuizMode && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                                <span className="text-gradient">{selectedRoot} {selectedScale}</span> 퀴즈
                            </div>
                            <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                                단계: <strong style={{ color: 'var(--text-primary)' }}>{currentStepIndex + 1} / {quizPath.length}</strong>
                                <span style={{ color: 'var(--danger)', marginLeft: '0.75rem' }}>오답: <strong>{mistakes}/3</strong></span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{
                                height: '100%',
                                width: `${progress}%`,
                                background: 'var(--primary)',
                                transition: 'width 0.3s ease-out',
                                boxShadow: '0 0 10px var(--primary)'
                            }}></div>
                        </div>

                        <div style={{
                            background: 'rgba(0,0,0,0.2)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                            textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.5rem'
                        }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                다음 음을 누르세요
                            </div>
                            <div className="text-gradient" style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.2 }}>
                                {quizPath[currentStepIndex]?.note}
                            </div>
                        </div>

                        <button onClick={stopQuiz} className="btn btn-glass" style={{ width: '100%', padding: '0.7rem' }}>
                            <RefreshCcw size={16} /> 퀴즈 종료 (학습 모드로 돌아가기)
                        </button>
                    </div>
                )}
            </div>

            {/* Fixed height feedback container to prevent layout shift */}
            <div style={{ height: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {feedback ? (
                    <div className={`animate-fade-in ${feedback.includes('정답') || feedback.includes('축하') ? 'text-gradient' : 'text-danger'}`} style={{ fontWeight: 700, fontSize: '1.25rem', textAlign: 'center' }}>
                        {feedback}
                    </div>
                ) : null}
            </div>

            {/* Wrapper for Fretboard to handle custom highlighting logic in Scale Study */}
            <div className={`scale-board-wrapper ${isQuizMode ? 'quiz-active' : 'learning-active'}`}>
                <Fretboard
                    // In learn mode highlight, we don't pass a single Highlighted note, instead we use CSS to highlight many
                    highlightedNote={highlightedNote}
                    isQuizMode={isQuizMode}
                    onNoteClick={handleNoteClick}
                    stringCount={stringCount}
                />
            </div>

            {/* Inject custom CSS to highlight all scale notes when in learning mode */}
            {!isQuizMode && scaleNotes.length > 0 && (
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .learning-active .fret-cell:not(.open-string-cell) .note-badge {
                        ${scaleNotes.map(n => `
                            /* Nasty but effective trick to show notes conditionally based on content */
                        `).join('')}
                        /* Show all notes in scale */
                    }
                    /* Let's do this cleaner using a data attribute or global class match */
                    ${scaleNotes.map(note => `
                        .learning-active .fret-cell:not(.open-string-cell) .note-badge:contains-not-supported {
                            /* CSS :contains is not standard, we will match by mapping the note text */
                        }
                    `).join('')}
                `}} />
            )}

            {/* Alternative to CSS injection: We need a reliable way to show multiple notes on Fretboard */}
        </div>
    );
};

export default ScaleStudy;
