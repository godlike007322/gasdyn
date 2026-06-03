import { useState } from 'react';
import { taskSteps, ticketBlocks } from '../data/ticket4';
import { checklistScore } from '../utils/scoring';
import { Progress, recordAttempt } from '../utils/storage';
import Checklist from './Checklist';

type Props = { progress: Progress; onProgress: (progress: Progress) => void };
const task = ticketBlocks.find((block) => block.id === 'task-density')!;

export default function TaskMode({ progress, onProgress }: Props) {
  const [solution, setSolution] = useState('');
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [checked, setChecked] = useState<string[]>([]);
  const score = checklistScore(task.checklist, checked);

  function save() {
    onProgress(recordAttempt(progress, { mode: 'task', blockId: task.id, score, maxScore: task.maxScore }));
  }

  return (
    <section className="panel split-panel">
      <div>
        <p className="eyebrow">Задача</p>
        <h2>ρ(x,t)=t². Найти v(x,t).</h2>
        <textarea value={solution} onChange={(event) => setSolution(event.target.value)} placeholder="Запиши решение: уравнение неразрывности, подстановка, интегрирование по x..." />
        <div className="toolbar">
          <button onClick={() => setVisibleSteps((value) => Math.min(taskSteps.length, value + 1))}>Показать следующий шаг</button>
          <button className="ghost" onClick={() => setVisibleSteps(taskSteps.length)}>Показать пошаговое решение</button>
        </div>
        <ol className="steps">
          {taskSteps.slice(0, visibleSteps).map((step) => <li key={step}>{step}</li>)}
        </ol>
      </div>
      <div>
        <Checklist items={task.checklist} checkedIds={checked} onChange={setChecked} />
        <button onClick={save}>Сохранить решение {score}/{task.maxScore}</button>
      </div>
    </section>
  );
}
