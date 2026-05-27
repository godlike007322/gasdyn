import { SelfGrade } from './types';

export type ProgressMap = Record<string, SelfGrade[]>;
const KEY = 'gasdyn-progress-v1';

export const loadProgress = (): ProgressMap => {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
};

export const saveGrade = (id: string, grade: SelfGrade) => {
  const state = loadProgress();
  state[id] = [...(state[id] || []), grade].slice(-30);
  localStorage.setItem(KEY, JSON.stringify(state));
};
