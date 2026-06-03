import { useEffect, useMemo, useState } from 'react';
import { ticketBlocks } from '../data/ticket4';
import { checklistScore, examStatus, isAutomatic } from '../utils/scoring';
import { Progress, recordExamScore } from '../utils/storage';
import Checklist from './Checklist';

type Props = { progress: Progress; onProgress: (progress: Progress) => void };

type ExamResult = Record<string, string[]>;

export default function ExamMode({ progress, onProgress }: Props) {
  const [step, setStep] = useState(0);
  const [seconds, setSeconds] = useState(ticketBlocks[0].durationMinutes * 60);
  const [running, setRunning] = useState(false);
  const [checkedByBlock, setCheckedByBlock] = useState<ExamResult>({});
  const [savedTotal, setSavedTotal] = useState<number | null>(null);
  const block = ticketBlocks[step];

  useEffect(() => {
    if (!block) return;
    setSeconds(block.durationMinutes * 60);
    setRunning(false);
  }, [step, block]);

  useEffect(() => {
    if (!running || seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((current) => current - 1), 1000);
    return () => window.clearInterval(timer);
  }, [running, seconds]);

  const results = useMemo(() => ticketBlocks.map((item) => {
    const score = checklistScore(item.checklist, checkedByBlock[item.id] ?? []);
    return { block: item, score };
  }), [checkedByBlock]);
  const total = results.reduce((sum, result) => sum + result.score, 0);

  function finish() {
    const nextProgress = recordExamScore(progress, total);
    onProgress(nextProgress);
    setSavedTotal(total);
  }

  if (!block || savedTotal !== null) {
    const virtualProgress = savedTotal === null ? progress : { ...progress, examScores: [...progress.examScores, savedTotal] };
    const weakest = results.slice().sort((a, b) => a.score / a.block.maxScore - b.score / b.block.maxScore)[0];
    return (
      <section className="panel">
        <p className="eyebrow">Итог полного экзамена</p>
        <h2>Итого: {total}/100</h2>
        <p className="status">Статус: {examStatus(total)}{weakest ? `, повторить: ${weakest.block.title}.` : '.'}</p>
        {isAutomatic(virtualProgress) && <p className="success">Билет №4 отработан до автоматизма.</p>}
        <div className="result-list">
          {results.map(({ block: item, score }) => <div key={item.id}><span>{item.number}: {item.title}</span><b>{score}/{item.maxScore}</b></div>)}
        </div>
        <button onClick={() => { setStep(0); setCheckedByBlock({}); setSavedTotal(null); }}>Начать новый прогон</button>
      </section>
    );
  }

  return (
    <section className="panel split-panel">
      <div>
        <p className="eyebrow">Полный экзамен · блок {step + 1}/4</p>
        <h2>{block.number}: {block.title}</h2>
        <div className="timer">{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</div>
        <div className="toolbar">
          <button onClick={() => setRunning(true)}>Старт</button>
          <button className="ghost" onClick={() => setRunning(false)}>Пауза</button>
          <button className="ghost" onClick={() => setSeconds(0)}>Закончить блок</button>
        </div>
        <div className="exam-outline">
          {ticketBlocks.map((item, index) => <span className={index === step ? 'active-pill' : ''} key={item.id}>{item.number} — {item.durationMinutes} мин</span>)}
        </div>
        <details className="theory-box"><summary>Эталонные тезисы после ответа</summary>{block.theory.map((text) => <p key={text}>{text}</p>)}</details>
      </div>
      <div>
        <Checklist items={block.checklist} checkedIds={checkedByBlock[block.id] ?? []} onChange={(ids) => setCheckedByBlock((current) => ({ ...current, [block.id]: ids }))} />
        <div className="toolbar">
          {step < ticketBlocks.length - 1 ? <button onClick={() => setStep((current) => current + 1)}>Следующий блок</button> : <button onClick={finish}>Завершить экзамен</button>}
        </div>
      </div>
    </section>
  );
}
