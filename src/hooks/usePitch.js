import { useState, useEffect, useRef } from 'react';
import { AMDF } from 'pitchfinder';
import { NOTES } from '../constants';
const A4_FREQ = 440;
const A4_IDX = 69;

export const freqToNote = (freq) => {
    // Bass guitar frequency range is typically E1 (~41Hz) to roughly G4 (~392Hz). We allow up to 1000Hz just in case.
    if (!freq || freq < 20 || freq > 1000) return null;
    
    const noteNum = Math.round(12 * Math.log2(freq / A4_FREQ) + A4_IDX);
    const octave = Math.floor(noteNum / 12) - 1;
    const noteName = NOTES[noteNum % 12];
    
    return {
        note: noteName,
        octave,
        freq: Math.round(freq * 10) / 10,
        midi: noteNum
    };
};

export const usePitch = () => {
    const [pitchInfo, setPitchInfo] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState(null);
    const [volume, setVolume] = useState(0);

    const contextRef = useRef(null);
    const streamRef = useRef(null);
    const analyserRef = useRef(null);
    const animationFrameRef = useRef(null);
    const detectPitchRef = useRef(null);

    const startListening = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: false,
                    autoGainControl: false,
                    noiseSuppression: false
                }
            });
            streamRef.current = stream;

            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const context = new AudioContext();
            contextRef.current = context;

            const analyser = context.createAnalyser();
            // Higher fftSize (16384) offers much better low-frequency resolution, crucial for bass
            analyser.fftSize = 16384; 
            analyserRef.current = analyser;

            // Use a low-pass filter to remove higher harmonics that confuse pitch detection algorithms
            const lowpassFilter = context.createBiquadFilter();
            lowpassFilter.type = 'lowpass';
            // Set cutoff frequency to roughly the highest note on a standard 4-string bass (G4 is ~392Hz)
            lowpassFilter.frequency.value = 400; 
            lowpassFilter.Q.value = 1;

            // AMDF algorithm is known to be very robust for bass frequencies and allows specifying a custom frequency range
            detectPitchRef.current = AMDF({ 
                sampleRate: context.sampleRate,
                minFrequency: 30, // Below E1 (41Hz)
                maxFrequency: 450
            });

            const source = context.createMediaStreamSource(stream);
            // Connect to filter first, then to analyser
            source.connect(lowpassFilter);
            lowpassFilter.connect(analyser);

            setIsListening(true);
            setError(null);
            
            const buffer = new Float32Array(analyser.fftSize);
            
            const updatePitch = () => {
                if (!analyserRef.current) return;
                
                analyserRef.current.getFloatTimeDomainData(buffer);
                
                // Calculate basic volume (RMS) to filter out background noise
                let sumSquares = 0.0;
                for (let i = 0; i < buffer.length; i++) {
                    sumSquares += buffer[i] * buffer[i];
                }
                const rms = Math.sqrt(sumSquares / buffer.length);
                const vol = Math.max(0, Math.min(100, (rms * 100 * 5))); 
                setVolume(vol);

                // Only run pitch detection if there is sufficient volume (e.g., > 0.01)
                if (rms > 0.01) {
                    const mappedPitch = detectPitchRef.current(buffer);
                    if (mappedPitch) {
                        const noteInfo = freqToNote(mappedPitch);
                        setPitchInfo(noteInfo);
                    } else {
                        setPitchInfo(null);
                    }
                } else {
                    setPitchInfo(null);
                }

                animationFrameRef.current = requestAnimationFrame(updatePitch);
            };

            updatePitch();

        } catch (err) {
            console.error('Error starting mic:', err);
            setError('마이크 권한을 허용해주세요.');
            setIsListening(false);
        }
    };

    const stopListening = () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (contextRef.current) {
            contextRef.current.close().catch(console.error);
            contextRef.current = null;
        }
        setIsListening(false);
        setPitchInfo(null);
        setVolume(0);
    };

    useEffect(() => {
        return () => {
            stopListening();
        };
    }, []);

    return { pitchInfo, isListening, volume, error, startListening, stopListening };
};
