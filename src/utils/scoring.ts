import { ChecklistItem } from '../data/ticket4';
import { Progress } from './storage';

export const ratingButtons = [
  { label: 'Не знаю', value: 0 },
  { label: 'Плохо', value: 1 },
  { label: 'Нормально', value: 2 },
  { label: 'Хорошо', value: 3 },
  { label: 'Идеально', value: 4 },
];

export function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function checklistScore(items: ChecklistItem[], checkedIds: string[]): number {
  const checked = new Set(checkedIds);
  return items.reduce((sum, item) => sum + (checked.has(item.id) ? item.points : 0), 0);
}

export function readiness(progress: Progress): number {
  const examPart = progress.examScores.length ? average(progress.examScores.slice(-5)) : 0;
  const cardAverages = Object.values(progress.cardScores).map(average).filter(Boolean);
  const cardPart = cardAverages.length ? average(cardAverages) * 25 : 0;
  const attemptsPart = progress.attempts.length
    ? average(progress.attempts.slice(-20).map((attempt) => (attempt.score / attempt.maxScore) * 100))
    : 0;
  const weighted = examPart ? examPart * 0.55 + cardPart * 0.2 + attemptsPart * 0.25 : cardPart * 0.45 + attemptsPart * 0.55;
  return Math.round(Math.max(0, Math.min(100, weighted)));
}

export function examStatus(score: number): string {
  if (score >= 90) return 'автоматизм';
  if (score >= 80) return 'нормальная готовность';
  if (score >= 70) return 'проходной уровень';
  if (score >= 50) return 'слабовато';
  return 'плохо, билет не готов';
}

export function isAutomatic(progress: Progress): boolean {
  return progress.examScores.slice(-3).length === 3 && progress.examScores.slice(-3).every((score) => score >= 90);
}
