import React, { useState, useEffect } from 'react';
import Fretboard from './Fretboard';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const PitchNoteQuiz = ({ pitchInfo }) => {
    const [targetNote, setTargetNote] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [score, setScore] = useState(0);

    const pickRandomNote = () => {
        const note = NOTES[Math.floor(Math.random() * NOTES.length)];
        setTargetNote(note);
    };

    useEffect(() => {
        if (!targetNote) {
            pickRandomNote();
        }
    }, [targetNote]);

    useEffect(() => {
        if (pitchInfo && targetNote) {
            if (pitchInfo.note === targetNote) {
                setFeedback('정답! 🎉');
                setScore(s => s + 1);
                const nextTimer = setTimeout(() => {
                    setFeedback(null);
                    pickRandomNote();
                }, 1500);
                
                setTargetNote(null);
                
                return () => clearTimeout(nextTimer);
            }
        }
    }, [pitchInfo, targetNote]);

    return (
        <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>랜덤 음 찾기</h2>
                <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>연속 정답: <span className="text-primary">{score}</span></div>
            </div>
            
            <div style={{ 
                height: '150px', 
                background: 'rgba(0,0,0,0.2)', 
                borderRadius: 'var(--radius-lg)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.05)'
            }}>
                {targetNote ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>베이스로 다음 음을 연주하세요</span>
                        <span className="text-gradient" style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1 }}>{targetNote}</span>
                    </div>
                ) : (
                    <div className="text-primary animate-fade-in" style={{ fontSize: '2rem', fontWeight: 700 }}>{feedback}</div>
                )}
            </div>
            
            <div style={{ marginTop: '0.5rem' }}>
                <div style={{ marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>지판에서 치고 있는 음의 위치가 실시간으로 표시됩니다.</div>
                <div style={{ margin: '0 -1.5rem' }}>
                    <Fretboard 
                        highlightedNote={pitchInfo ? pitchInfo.note : null}
                        isQuizMode={false}
                        stringCount={4}
                    />
                </div>
            </div>
        </div>
    );
};
export default PitchNoteQuiz;
