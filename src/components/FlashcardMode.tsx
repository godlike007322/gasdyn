import { useMemo, useState } from 'react';
import { flashcards } from '../data/ticket4';
import { average, ratingButtons } from '../utils/scoring';
import { addWeakItem, Progress, recordCardScore } from '../utils/storage';

type Props = { progress: Progress; onProgress: (progress: Progress) => void; weakOnly?: boolean };

export default function FlashcardMode({ progress, onProgress, weakOnly = false }: Props) {
  const cards = useMemo(() => {
    const sorted = [...flashcards].sort((a, b) => average(progress.cardScores[a.id] ?? [0]) - average(progress.cardScores[b.id] ?? [0]));
    const selected = weakOnly ? sorted.filter((card) => progress.weakItems.includes(card.id) || average(progress.cardScores[card.id] ?? []) < 2.5) : sorted;
    return selected.length ? selected : sorted;
  }, [progress.cardScores, progress.weakItems, weakOnly]);
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(false);
  const card = cards[index % cards.length];

  function moveNext() {
    setShown(false);
    setIndex((current) => current + 1);
  }

  function score(value: number) {
    onProgress(recordCardScore(progress, card.id, card.blockId, value));
    moveNext();
  }

  return (
    <section className="panel trainer-card">
      <p className="eyebrow">Карточки · {index + 1}/{cards.length}</p>
      <h2>{card.question}</h2>
      {shown ? <div className="answer">{card.answer}</div> : <button onClick={() => setShown(true)}>Показать ответ</button>}
      <div className="toolbar">
        <button className="ghost" onClick={moveNext}>Повторить позже</button>
        <button className="ghost" onClick={() => onProgress(addWeakItem(progress, card.id))}>Добавить в слабые</button>
      </div>
      {shown && <div className="rating-row">{ratingButtons.map((button) => <button key={button.value} onClick={() => score(button.value)}>{button.label}</button>)}</div>}
    </section>
  );
}
