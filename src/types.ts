export type SelfGrade = 'know' | 'partial' | 'dont_know';

export interface FormulaItem {
  id: string;
  title: string;
  latex: string;
  meaning?: string;
}

export interface TheoryTopic {
  id: string;
  title: string;
  shortExplanation: string;
  examAnswerFull: string;
  formulas: FormulaItem[];
  physicalMeaning: string;
}

export interface PracticeTask {
  id: string;
  title: string;
  condition: string;
  hints: { eqHint: string; firstStepHint: string; formulaHint: string };
  fullSolution: string;
  templateForSimilar: string;
}
