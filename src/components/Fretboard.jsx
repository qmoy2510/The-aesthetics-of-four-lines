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

const Fretboard = ({
    highlightedNote,
    isQuizMode = false,
    onNoteClick, // Keep onNoteClick as it's used in the original logic
    stringCount = 4,
    showNotes = true,
    rootNote = null // Add rootNote prop to allow distinct styling
}) => {
    const fretboardData = generateFretboardContext(stringCount);

    // Fret markers (dots) on bass: usually at frets 3, 5, 7, 9, 12
    const fretMarkers = [3, 5, 7, 9, 12];

    // Helper function for note interaction (replaces direct onClick logic)
    const handleNoteInteraction = (note, sIdx, fIdx) => {
        if (fIdx === 0 && isQuizMode) return; // Disable interaction on nut in quiz mode
        onNoteClick && onNoteClick(note, sIdx, fIdx);
    };

    // Helper function to render fret markers
    const renderFretMarker = (sIdx, fIdx) => {
        // Only render markers on the highest string (sIdx === 0) for simplicity, or adjust as needed
        if (sIdx === 0) {
            if (fretMarkers.includes(fIdx) && fIdx !== 12) {
                return <div className="fret-marker-dot"></div>;
            }
            if (fIdx === 12) {
                return <div className="fret-marker-dot double"></div>;
            }
        }
        return null;
    };

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

                            // Check if this is a root note (for scale learning)
                            const isRoot = !isQuizMode && rootNote === fretInfo.note && isHighlighted;

                            // Determine which class to apply for highlighting
                            let highlightClass = '';
                            if (isWrongHighlight) {
                                highlightClass = 'highlighted-wrong';
                            } else if (isHighlighted) {
                                highlightClass = 'highlighted';
                            }

                            // Add a special class for the root note if applicable
                            const rootClass = isRoot ? 'is-root' : '';

                            return (
                                <div
                                    key={`fret-${sIdx}-${fIdx}`}
                                    className={`fret-cell ${fIdx === 0 ? 'open-string-cell' : ''}`}
                                    style={fIdx === 0 && isQuizMode ? { opacity: 0.3, pointerEvents: 'none', cursor: 'not-allowed' } : {}}
                                    onClick={() => handleNoteInteraction(fretInfo.note, sIdx, fIdx)}
                                >
                                    {/* Fret wire */}
                                    {fIdx > 0 && <div className="fret-wire"></div>}

                                    {/* Fret markers (dots) */}
                                    {renderFretMarker(sIdx, fIdx)}

                                    {/* Note display */}
                                    <div className={`note-badge ${highlightClass} ${rootClass} ${isQuizMode ? 'quiz-mode' : ''}`}>
                                        <span className="note-text" style={{ opacity: (isHighlighted || !isQuizMode) && showNotes ? 1 : 0 }}>
                                            {fretInfo.note}
                                        </span>
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
