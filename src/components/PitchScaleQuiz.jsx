import React, { useState, useEffect } from 'react';
import Fretboard from './Fretboard';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const SCALES = {
    'Major': [2, 2, 1, 2, 2, 2, 1],
    'Minor': [2, 1, 2, 2, 1, 2, 2],
    'Major Pentatonic': [2, 2, 3, 2, 3],
    'Minor Pentatonic': [3, 2, 2, 3, 2],
    'Blues': [3, 2, 1, 1, 3, 2]
};

const getScaleNotes = (root, scaleType) => {
    const rootIdx = NOTES.indexOf(root);
    const intervals = SCALES[scaleType];
    const notes = [root];
    let currentIdx = rootIdx;
    for (let i = 0; i < intervals.length - 1; i++) {
        currentIdx = (currentIdx + intervals[i]) % NOTES.length;
        notes.push(NOTES[currentIdx]);
    }
    notes.push(root); 
    return notes;
};

const PitchScaleQuiz = ({ pitchInfo }) => {
    const [targetRoot, setTargetRoot] = useState('');
    const [targetScale, setTargetScale] = useState('');
    const [sequence, setSequence] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [feedback, setFeedback] = useState(null);

    const generateScale = () => {
        const root = NOTES[Math.floor(Math.random() * NOTES.length)];
        const scaleKeys = Object.keys(SCALES);
        const scaleType = scaleKeys[Math.floor(Math.random() * scaleKeys.length)];
        
        setTargetRoot(root);
        setTargetScale(scaleType);
        setSequence(getScaleNotes(root, scaleType));
        setCurrentIndex(0);
        setFeedback(null);
    };

    useEffect(() => {
        generateScale();
    }, []);

    useEffect(() => {
        if (pitchInfo && sequence.length > 0 && currentIndex < sequence.length) {
            const currentTargetNote = sequence[currentIndex];
            if (pitchInfo.note === currentTargetNote) {
                const nextIndex = currentIndex + 1;
                setCurrentIndex(nextIndex);
                if (nextIndex >= sequence.length) {
                    setFeedback('스케일 클리어! 🎉');
                    setTimeout(() => {
                        generateScale();
                    }, 2000);
                }
            }
        }
    }, [pitchInfo, sequence, currentIndex]);

    return (
        <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>랜덤 스케일 연주</h2>
                <button onClick={generateScale} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>새 스케일</button>
            </div>
            
            {targetRoot && (
                <div style={{ textAlign: 'center' }}>
                    <span className="text-gradient" style={{ fontSize: '2rem', fontWeight: 800 }}>{targetRoot} {targetScale}</span>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>차례대로 스케일 음을 연주하세요</div>
                </div>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', justifyContent: 'center', minHeight: '60px' }}>
                {sequence.map((note, idx) => {
                    let statusColor = 'rgba(255,255,255,0.05)';
                    let textColor = 'var(--text-secondary)';
                    let borderStyle = '2px solid transparent';
                    
                    if (idx < currentIndex) {
                        statusColor = 'var(--primary)';
                        textColor = 'white';
                    } else if (idx === currentIndex) {
                        statusColor = 'rgba(16, 185, 129, 0.1)';
                        textColor = 'var(--primary)';
                        borderStyle = '2px solid var(--primary)';
                        if (feedback) { 
                             statusColor = 'var(--primary)';
                             textColor = 'white';
                        }
                    }
                    
                    return (
                        <div key={idx} style={{
                            padding: '0.8rem 1.2rem',
                            background: statusColor,
                            color: textColor,
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 700,
                            fontSize: '1.2rem',
                            border: borderStyle,
                            transition: 'all 0.3s'
                        }}>
                            {note}
                        </div>
                    );
                })}
            </div>
            
            {feedback && (
                <div className="text-primary animate-fade-in" style={{ fontSize: '1.5rem', fontWeight: 700, textAlign: 'center' }}>
                    {feedback}
                </div>
            )}
            
            <div style={{ marginTop: '0.5rem' }}>
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
export default PitchScaleQuiz;
