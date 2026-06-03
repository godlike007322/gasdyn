import type { AppMode } from '../App';

const modes: { id: AppMode; title: string; description: string }[] = [
  { id: 'formula', title: 'Формулы', description: 'Быстрый прогон главных формул.' },
  { id: 'flashcard', title: 'Карточки', description: 'Вопрос/ответ с самооценкой.' },
  { id: 'oral', title: 'Устный ответ', description: 'Таймер и чек-лист по блокам.' },
  { id: 'task', title: 'Задача', description: 'Решение ρ=t² по шагам.' },
  { id: 'exam', title: 'Полный экзамен', description: 'Прогон билета на 100 баллов.' },
  { id: 'weak', title: 'Слабые места', description: 'Повторение проваленных пунктов.' },
  { id: 'stats', title: 'Статистика', description: 'Прогресс подготовки.' },
];

type Props = {
  activeMode: AppMode;
  onSelect: (mode: AppMode) => void;
};

export default function ModeSelector({ activeMode, onSelect }: Props) {
  return (
    <nav className="mode-grid" aria-label="Режимы тренировки">
      {modes.map((mode) => (
        <button className={`mode-card ${activeMode === mode.id ? 'mode-card--active' : ''}`} key={mode.id} onClick={() => onSelect(mode.id)}>
          <span>{mode.title}</span>
          <small>{mode.description}</small>
        </button>
      ))}
    </nav>
  );
}
