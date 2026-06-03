import { useEffect, useMemo, useState } from 'react';
import ExamMode from './components/ExamMode';
import FlashcardMode from './components/FlashcardMode';
import FormulaMode from './components/FormulaMode';
import ModeSelector from './components/ModeSelector';
import OralMode from './components/OralMode';
import ProgressPanel from './components/ProgressPanel';
import TaskMode from './components/TaskMode';
import { flashcards, formulaCards, ticketBlocks } from './data/ticket4';
import { average, readiness } from './utils/scoring';
import { clearProgress, loadProgress, Progress, saveProgress } from './utils/storage';

export type AppMode = 'home' | 'formula' | 'flashcard' | 'oral' | 'task' | 'exam' | 'weak' | 'stats';

export default function App() {
  const [mode, setMode] = useState<AppMode>('home');
  const [progress, setProgress] = useState<Progress>(() => loadProgress());

  useEffect(() => saveProgress(progress), [progress]);

  const weakItems = useMemo(() => {
    const allCards = [...formulaCards, ...flashcards];
    return allCards
      .map((card) => ({ card, average: average(progress.cardScores[card.id] ?? []), explicit: progress.weakItems.includes(card.id) || progress.weakItems.includes(card.blockId) }))
      .filter((item) => item.explicit || (progress.cardScores[item.card.id]?.length && item.average < 2.5))
      .sort((a, b) => a.average - b.average);
  }, [progress.cardScores, progress.weakItems]);

  function renderMode() {
    if (mode === 'formula') return <FormulaMode progress={progress} onProgress={setProgress} />;
    if (mode === 'flashcard') return <FlashcardMode progress={progress} onProgress={setProgress} />;
    if (mode === 'oral') return <OralMode progress={progress} onProgress={setProgress} />;
    if (mode === 'task') return <TaskMode progress={progress} onProgress={setProgress} />;
    if (mode === 'exam') return <ExamMode progress={progress} onProgress={setProgress} />;
    if (mode === 'weak') {
      return (
        <section className="panel">
          <p className="eyebrow">Слабые места</p>
          <h2>Повторяются карточки и блоки со средним баллом ниже 2.5</h2>
          {weakItems.length === 0 ? <p>Пока слабых мест нет. Начни с карточек или полного экзамена.</p> : (
            <div className="weak-list">
              {weakItems.map(({ card, average: avg }) => <div key={card.id}><span>{card.question}</span><b>средний: {avg ? avg.toFixed(1) : 'нет'}</b></div>)}
            </div>
          )}
          <div className="split-actions">
            <FlashcardMode progress={progress} onProgress={setProgress} weakOnly />
            <FormulaMode progress={progress} onProgress={setProgress} weakOnly />
          </div>
        </section>
      );
    }
    if (mode === 'stats') return <ProgressPanel progress={progress} onReset={() => setProgress(clearProgress())} />;
    return (
      <section className="panel intro-panel">
        <p className="eyebrow">Билет №4 именно с этими пунктами</p>
        <h2>Тренируй формулы, карточки, устный ответ, задачу и полный экзаменационный прогон.</h2>
        <div className="ticket-list">
          {ticketBlocks.map((block) => (
            <article key={block.id}>
              <h3>{block.number}: {block.title}</h3>
              <p>{block.theory[0]}</p>
              <div>{block.keywords.slice(0, 5).map((keyword) => <span className="tag" key={keyword}>{keyword}</span>)}</div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Локальное веб-приложение · offline</p>
          <h1>Билет №4 — тренажёр</h1>
          <p>Готовность: <strong>{readiness(progress)}/100</strong></p>
        </div>
        <button className="ghost" onClick={() => setMode('home')}>Главный экран</button>
      </header>
      <ModeSelector activeMode={mode} onSelect={setMode} />
      {renderMode()}
    </main>
  );
}
