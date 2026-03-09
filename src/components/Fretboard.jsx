import React, { useState } from 'react';
import { Target, RefreshCw } from 'lucide-react';
import './Fretboard.css';

// Notes array (chromatic scale)
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Tuning for standard 4-string bass (G, D, A, E - from highest pitch to lowest pitch string)
// We represent strings from top to bottom on screen: 1st string (G) to 4th string (E)
const TUNING = [
    { note: 'G', stringName: '1st (G)' },
    { note: 'D', stringName: '2nd (D)' },
    { note: 'A', stringName: '3rd (A)' },
    { note: 'E', stringName: '4th (E)' }
];

const NUMBER_OF_FRETS = 12;

// Utility to calculate the note at a certain fret
const getNoteAtFret = (openNote, fretIndex) => {
    const openNoteIndex = NOTES.indexOf(openNote);
    return NOTES[(openNoteIndex + fretIndex) % NOTES.length];
};

// Generate full fretboard data
const generateFretboardContext = () => {
    return TUNING.map((stringInfo) => {
        const stringNotes = [];
        for (let i = 0; i <= NUMBER_OF_FRETS; i++) {
            stringNotes.push({
                fret: i,
                note: getNoteAtFret(stringInfo.note, i),
            });
        }
        return { ...stringInfo, frets: stringNotes };
    });
};

const Fretboard = ({ highlightedNote, isQuizMode, onNoteClick }) => {
    const fretboardData = generateFretboardContext();

    // Fret markers (dots) on bass: usually at frets 3, 5, 7, 9, 12
    const fretMarkers = [3, 5, 7, 9, 12];

    return (
        <div className="fretboard-container glass-panel">

            {/* Fret Numbers Header */}
            <div className="fretboard-row fret-numbers">
                <div className="fret-cell open-string-cell header">Open</div>
                {Array.from({ length: NUMBER_OF_FRETS }).map((_, i) => (
                    <div key={`header-${i + 1}`} className="fret-cell header">
                        {i + 1}
                        {fretMarkers.includes(i + 1) && <div className="fret-marker-dot"></div>}
                        {(i + 1) === 12 && <div className="fret-marker-dot double"></div>}
                    </div>
                ))}
            </div>

            {/* Strings and Frets */}
            <div className="fretboard-body">
                {fretboardData.map((stringData, sIdx) => (
                    <div key={`string-${sIdx}`} className="fretboard-row string-row">
                        {/* The visual string line */}
                        <div className={`string-line string-line-${sIdx + 1}`}></div>

                        {stringData.frets.map((fretInfo, fIdx) => {
                            const isHighlighted = highlightedNote && fretInfo.note === highlightedNote;
                            const isNut = fIdx === 0; // The Open string / Nut area

                            return (
                                <div
                                    key={`fret-${sIdx}-${fIdx}`}
                                    className={`fret-cell ${isNut ? 'open-string-cell' : 'standard-fret'}`}
                                    onClick={() => onNoteClick && onNoteClick(fretInfo.note, sIdx, fIdx)}
                                >
                                    {/* Fret wire visual */}
                                    {!isNut && <div className="fret-wire"></div>}

                                    {/* The Note Button */}
                                    <div className={`note-badge ${isHighlighted ? 'highlighted' : ''} ${isQuizMode ? 'quiz-mode' : ''}`}>
                                        {fretInfo.note}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Fretboard;
