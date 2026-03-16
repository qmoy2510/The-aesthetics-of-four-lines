// Shared constants for bass-web
// Single source of truth to avoid duplication across components

export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const NOTE_MAP = [
    { eng: 'C',  solfege: '도'  },
    { eng: 'C#', solfege: '도#' },
    { eng: 'D',  solfege: '레'  },
    { eng: 'D#', solfege: '레#' },
    { eng: 'E',  solfege: '미'  },
    { eng: 'F',  solfege: '파'  },
    { eng: 'F#', solfege: '파#' },
    { eng: 'G',  solfege: '솔'  },
    { eng: 'G#', solfege: '솔#' },
    { eng: 'A',  solfege: '라'  },
    { eng: 'A#', solfege: '라#' },
    { eng: 'B',  solfege: '시'  },
];

export const WHITE_KEYS = [
    { eng: 'C', solfege: '도', sharpEng: 'C#', sharpSolfege: '도#' },
    { eng: 'D', solfege: '레', sharpEng: 'D#', sharpSolfege: '레#' },
    { eng: 'E', solfege: '미', sharpEng: null, sharpSolfege: null  },
    { eng: 'F', solfege: '파', sharpEng: 'F#', sharpSolfege: '파#' },
    { eng: 'G', solfege: '솔', sharpEng: 'G#', sharpSolfege: '솔#' },
    { eng: 'A', solfege: '라', sharpEng: 'A#', sharpSolfege: '라#' },
    { eng: 'B', solfege: '시', sharpEng: null, sharpSolfege: null  },
];
