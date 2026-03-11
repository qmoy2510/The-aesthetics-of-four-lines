import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { usePitch } from '../hooks/usePitch';
import PitchNoteQuiz from './PitchNoteQuiz';
import PitchScaleQuiz from './PitchScaleQuiz';

const PracticePitch = () => {
    const { pitchInfo, isListening, volume, startListening, stopListening, error } = usePitch();
    const [quizMode, setQuizMode] = useState('note'); 

    return (
        <div className="container animate-fade-in" style={{ paddingTop: '6rem', paddingBottom: '2rem', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>실전 연습 (마이크)</h1>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                    실제 베이스를 연주하여 화면의 퀴즈를 풀어보세요. 마이크 접근 권한이 필요합니다.
                </p>
            </div>

            {/* Mic Control */}
            <div style={{ marginBottom: '2rem', width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <button 
                    onClick={isListening ? stopListening : startListening}
                    className={`btn ${isListening ? 'btn-danger' : 'btn-primary'}`}
                    style={{ padding: '1rem 2rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: 'var(--radius-full)' }}
                >
                    {isListening ? (
                        <><MicOff size={24} /> 마이크 끄기</>
                    ) : (
                        <><Mic size={24} /> 마이크 켜기 (시작)</>
                    )}
                </button>
                {error && <div className="text-danger">{error}</div>}
                
                {/* Volume Level Indicator */}
                {isListening && (
                    <div style={{ width: '100%', maxWidth: '300px', background: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${volume}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.1s ease' }} />
                    </div>
                )}

                {/* Detected Note Info */}
                {isListening && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: '1rem 2rem', borderRadius: 'var(--radius-lg)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>현재 입력음</span>
                            <span className="text-gradient" style={{ fontSize: '2rem', fontWeight: 800 }}>
                                {pitchInfo ? `${pitchInfo.note}${pitchInfo.octave}` : '-'}
                            </span>
                        </div>
                        {pitchInfo && (
                            <div style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                                ({pitchInfo.freq.toFixed(1)} Hz)
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Mode Select */}
            {isListening && (
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button 
                        onClick={() => setQuizMode('note')}
                        className={`btn ${quizMode === 'note' ? 'btn-primary' : 'btn-glass'}`}
                    >
                        단일 음 찾기
                    </button>
                    <button 
                        onClick={() => setQuizMode('scale')}
                        className={`btn ${quizMode === 'scale' ? 'btn-primary' : 'btn-glass'}`}
                    >
                        스케일 연주하기
                    </button>
                </div>
            )}

            {/* Quiz Components */}
            {isListening && quizMode === 'note' && (
                <PitchNoteQuiz pitchInfo={pitchInfo} />
            )}
            
            {isListening && quizMode === 'scale' && (
                <PitchScaleQuiz pitchInfo={pitchInfo} />
            )}

        </div>
    );
};
export default PracticePitch;
