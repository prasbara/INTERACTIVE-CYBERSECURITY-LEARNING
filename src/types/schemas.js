export const SCHEMA_VERSION = 2;

export const INITIAL_STATE = {
  metadata: {
    schemaVersion: SCHEMA_VERSION,
    createdAt: null,
    updatedAt: null
  },
  student: {
    name: '',
    className: '',
    attendanceNumber: '',
    classCode: ''
  },
  onboardingCompleted: false,
  progress: {
    meeting1: false,
    meeting2: false,
    meeting3: false,
    meeting4: false
  },
  scores: {
    pretest: null,
    meeting1: null,
    meeting2: null,
    meeting3: null,
    meeting4: null,
    posttest: null
  },
  gamification: {
    xp: 0,
    badges: ['log-explorer'],
    streak: 1,
    lastActiveDate: null
  },
  activities: {},
  attempts: {},
  selectedEvidence: {},
  hypotheses: {},
  triageDecisions: {},
  unlockedEvidence: [],
  microChecks: {},
  bookmarks: [],
  ctf: {
    solved: false,
    hintsUsed: [],
    reflection: '',
    flagSubmittedAt: null,
    completedChallenges: [],
    hintsByChallenge: {},
    reflections: {},
    resultsByChallenge: {}
  },
  settings: {
    theme: 'system',
    presentationMode: false,
    randomizeOptions: false
  },
  analytics: {
    startedAt: null,
    totalActiveMs: 0,
    events: []
  }
};

export const initialAppState = INITIAL_STATE;
