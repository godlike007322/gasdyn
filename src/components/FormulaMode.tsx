import { useMemo, useState } from 'react';
import { formulaCards } from '../data/ticket4';
import { ratingButtons } from '../utils/scoring';
import { Progress, recordCardScore } from '../utils/storage';

type Props = { progress: Progress; onProgress: (progress: Progress) => void; weakOnly?: boolean };

export default function FormulaMode({ progress, onProgress, weakOnly = false }: Props) {
  const cards = useMemo(() => {
    const selected = weakOnly ? formulaCards.filter((card) => progress.weakItems.includes(card.id) || progress.weakItems.includes(card.blockId)) : formulaCards;
    return selected.length ? selected : formulaCards;
  }, [progress.weakItems, weakOnly]);
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(false);
  const card = cards[index % cards.length];

  function score(value: number) {
    onProgress(recordCardScore(progress, card.id, card.blockId, value));
    setShown(false);
    setIndex((current) => current + 1);
  }

  return (
    <section className="panel trainer-card">
      <p className="eyebrow">Формулы · {index + 1}/{cards.length}</p>
      <h2>{card.question}</h2>
      {shown ? <div className="answer formula-answer">{card.answer}</div> : <button onClick={() => setShown(true)}>Показать ответ</button>}
      {shown && <div className="rating-row">{ratingButtons.map((button) => <button key={button.value} onClick={() => score(button.value)}>{button.label}</button>)}</div>}
    </section>
  );
}
