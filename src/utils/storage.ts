import { Mode } from '../data/ticket4';

export type Attempt = {
  mode: Mode;
  blockId: string;
  score: number;
  maxScore: number;
  date: string;
};

export type Progress = {
  attempts: Attempt[];
  weakItems: string[];
  cardScores: Record<string, number[]>;
  examScores: number[];
  lastPracticedAt: string;
};

const STORAGE_KEY = 'ticket4-progress-v1';

export const defaultProgress: Progress = {
  attempts: [],
  weakItems: [],
  cardScores: {},
  examScores: [],
  lastPracticedAt: '',
};

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;
    return { ...defaultProgress, ...JSON.parse(raw) };
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: Progress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function recordAttempt(progress: Progress, attempt: Omit<Attempt, 'date'>): Progress {
  return {
    ...progress,
    attempts: [...progress.attempts, { ...attempt, date: new Date().toISOString() }],
    weakItems: attempt.score / attempt.maxScore <= 0.5 ? Array.from(new Set([...progress.weakItems, attempt.blockId])) : progress.weakItems,
    lastPracticedAt: new Date().toISOString(),
  };
}

export function recordCardScore(progress: Progress, cardId: string, blockId: string, score: number): Progress {
  const scores = [...(progress.cardScores[cardId] ?? []), score];
  const weakItems = score <= 1 ? Array.from(new Set([...progress.weakItems, cardId, blockId])) : progress.weakItems;
  return {
    ...progress,
    cardScores: { ...progress.cardScores, [cardId]: scores },
    weakItems,
    attempts: [...progress.attempts, { mode: 'flashcard', blockId, score, maxScore: 4, date: new Date().toISOString() }],
    lastPracticedAt: new Date().toISOString(),
  };
}

export function addWeakItem(progress: Progress, id: string): Progress {
  return {
    ...progress,
    weakItems: Array.from(new Set([...progress.weakItems, id])),
    lastPracticedAt: new Date().toISOString(),
  };
}

export function recordExamScore(progress: Progress, score: number): Progress {
  return {
    ...progress,
    examScores: [...progress.examScores, score],
    attempts: [...progress.attempts, { mode: 'exam', blockId: 'ticket4', score, maxScore: 100, date: new Date().toISOString() }],
    lastPracticedAt: new Date().toISOString(),
  };
}

export function clearProgress(): Progress {
  saveProgress(defaultProgress);
  return defaultProgress;
}
