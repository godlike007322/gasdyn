import { useEffect, useState } from 'react';
import { ticketBlocks } from '../data/ticket4';
import { checklistScore } from '../utils/scoring';
import { Progress, recordAttempt } from '../utils/storage';
import Checklist from './Checklist';

type Props = { progress: Progress; onProgress: (progress: Progress) => void };

export default function OralMode({ progress, onProgress }: Props) {
  const [blockId, setBlockId] = useState(ticketBlocks[1].id);
  const block = ticketBlocks.find((item) => item.id === blockId)!;
  const [seconds, setSeconds] = useState(block.durationMinutes * 60);
  const [running, setRunning] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);
  const score = checklistScore(block.checklist, checked);

  useEffect(() => {
    setSeconds(block.durationMinutes * 60);
    setChecked([]);
    setRunning(false);
  }, [blockId, block.durationMinutes]);

  useEffect(() => {
    if (!running || seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((current) => current - 1), 1000);
    return () => window.clearInterval(timer);
  }, [running, seconds]);

  function save() {
    onProgress(recordAttempt(progress, { mode: 'oral', blockId: block.id, score, maxScore: block.maxScore }));
  }

  return (
    <section className="panel split-panel">
      <div>
        <p className="eyebrow">Устный ответ</p>
        <select value={blockId} onChange={(event) => setBlockId(event.target.value)}>
          {ticketBlocks.map((item) => <option value={item.id} key={item.id}>{item.number}: {item.title}</option>)}
        </select>
        <h2>Ответь {block.number.toLowerCase()} как на экзамене</h2>
        <div className="timer">{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</div>
        <div className="toolbar">
          <button onClick={() => setRunning(true)}>Старт</button>
          <button className="ghost" onClick={() => setRunning(false)}>Пауза</button>
          <button className="ghost" onClick={() => setSeconds(0)}>Закончить</button>
        </div>
        <details className="theory-box">
          <summary>Краткая теория для проверки после ответа</summary>
          {block.theory.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </details>
      </div>
      <div>
        <Checklist items={block.checklist} checkedIds={checked} onChange={setChecked} />
        <button onClick={save}>Сохранить результат {score}/{block.maxScore}</button>
      </div>
    </section>
  );
}
