import React, { useState } from 'react';
import { Target, RefreshCw } from 'lucide-react';
import './Fretboard.css';

// Notes array (chromatic scale)
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Tuning base for 4, 5, and 6-string basses (from highest pitch to lowest pitch string)
export const TUNING_PRESETS = {
    4: [
        { note: 'G', stringName: '1st (G)' },
        { note: 'D', stringName: '2nd (D)' },
        { note: 'A', stringName: '3rd (A)' },
        { note: 'E', stringName: '4th (E)' }
    ],
    5: [
        { note: 'G', stringName: '1st (G)' },
        { note: 'D', stringName: '2nd (D)' },
        { note: 'A', stringName: '3rd (A)' },
        { note: 'E', stringName: '4th (E)' },
        { note: 'B', stringName: '5th (B)' }
    ],
    6: [
        { note: 'C', stringName: '1st (C)' },
        { note: 'G', stringName: '2nd (G)' },
        { note: 'D', stringName: '3rd (D)' },
        { note: 'A', stringName: '4th (A)' },
        { note: 'E', stringName: '5th (E)' },
        { note: 'B', stringName: '6th (B)' }
    ]
};

const NUMBER_OF_FRETS = 12;

// Utility to calculate the note at a certain fret
export const getNoteAtFret = (openNote, fretIndex) => {
    const openNoteIndex = NOTES.indexOf(openNote);
    return NOTES[(openNoteIndex + fretIndex) % NOTES.length];
};

// Generate full fretboard data
const generateFretboardContext = (stringCount) => {
    const tuning = TUNING_PRESETS[stringCount] || TUNING_PRESETS[4];
    return tuning.map((stringInfo) => {
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

const Fretboard = ({ highlightedNote, isQuizMode, onNoteClick, stringCount = 4 }) => {
    const fretboardData = generateFretboardContext(stringCount);

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
                        {fretMarkers.includes(i + 1) && (i + 1) !== 12 && <div className="fret-marker-dot"></div>}
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
                            let isHighlighted = false;
                            let isWrongHighlight = false;

                            if (highlightedNote) {
                                if (Array.isArray(highlightedNote)) {
                                    // Multiple notes highlight (for scale learning)
                                    isHighlighted = highlightedNote.includes(fretInfo.note);
                                } else if (typeof highlightedNote === 'object') {
                                    // Object highlight (for specific string/fret quiz targeting)
                                    if (highlightedNote.sIdx === sIdx && highlightedNote.fIdx === fIdx) {
                                        isHighlighted = true;
                                        isWrongHighlight = highlightedNote.isWrong || false;
                                    }
                                } else {
                                    // Single note string highlight
                                    isHighlighted = fretInfo.note === highlightedNote;
                                }
                            }

                            const isNut = fIdx === 0; // The Open string / Nut area

                            // Determine which class to apply for highlighting
                            let highlightClass = '';
                            if (isHighlighted) {
                                highlightClass = isWrongHighlight ? 'highlighted-wrong' : 'highlighted';
                            }

                            return (
                                <div
                                    key={`fret-${sIdx}-${fIdx}`}
                                    className={`fret-cell ${isNut ? 'open-string-cell' : 'standard-fret'} ${isQuizMode && isNut ? 'disabled-nut' : ''}`}
                                    onClick={() => {
                                        if (isQuizMode && isNut) return;
                                        onNoteClick && onNoteClick(fretInfo.note, sIdx, fIdx);
                                    }}
                                    style={isQuizMode && isNut ? { opacity: 0.3, cursor: 'not-allowed' } : {}}
                                >
                                    {/* Fret wire visual */}
                                    {!isNut && <div className="fret-wire"></div>}

                                    {/* The Note Button */}
                                    <div className={`note-badge ${highlightClass} ${isQuizMode ? 'quiz-mode' : ''}`}>
                                        {fretInfo.note}
                                    </div>
                                </div>
                            );
                        })
                        }
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Fretboard;
