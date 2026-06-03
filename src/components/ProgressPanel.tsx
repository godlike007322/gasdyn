import { ticketBlocks } from '../data/ticket4';
import { average, isAutomatic, readiness } from '../utils/scoring';
import { Progress } from '../utils/storage';

type Props = {
  progress: Progress;
  onReset: () => void;
};

export default function ProgressPanel({ progress, onReset }: Props) {
  const ready = readiness(progress);
  const totalExams = progress.examScores.length;
  const best = totalExams ? Math.max(...progress.examScores) : 0;
  const avg = totalExams ? Math.round(average(progress.examScores)) : 0;
  const last = totalExams ? progress.examScores[progress.examScores.length - 1] : 0;
  const weakBlock = ticketBlocks
    .map((block) => {
      const blockAttempts = progress.attempts.filter((attempt) => attempt.blockId === block.id);
      const avgPercent = blockAttempts.length ? average(blockAttempts.map((attempt) => (attempt.score / attempt.maxScore) * 100)) : 100;
      return { block, avgPercent };
    })
    .sort((a, b) => a.avgPercent - b.avgPercent)[0]?.block.title ?? 'нет данных';

  return (
    <section className="panel progress-panel">
      <div>
        <p className="eyebrow">Готовность</p>
        <h2>{ready}/100</h2>
        {isAutomatic(progress) && <p className="success">Билет №4 отработан до автоматизма.</p>}
      </div>
      <div className="stats-grid">
        <div><span>Всего прогонов</span><b>{totalExams}</b></div>
        <div><span>Лучший результат</span><b>{best}/100</b></div>
        <div><span>Средний результат</span><b>{avg}/100</b></div>
        <div><span>Последний результат</span><b>{last}/100</b></div>
        <div><span>Слабейший блок</span><b>{weakBlock}</b></div>
      </div>
      <button className="ghost danger" onClick={onReset}>Сбросить прогресс</button>
    </section>
  );
}
