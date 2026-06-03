import { ChecklistItem } from '../data/ticket4';
import { checklistScore } from '../utils/scoring';

type Props = {
  items: ChecklistItem[];
  checkedIds: string[];
  onChange: (checkedIds: string[]) => void;
};

export default function Checklist({ items, checkedIds, onChange }: Props) {
  const maxScore = items.reduce((sum, item) => sum + item.points, 0);
  const score = checklistScore(items, checkedIds);

  function toggle(id: string) {
    onChange(checkedIds.includes(id) ? checkedIds.filter((checkedId) => checkedId !== id) : [...checkedIds, id]);
  }

  return (
    <div className="checklist">
      <div className="checklist__header">
        <h3>Чек-лист ответа</h3>
        <strong>{score}/{maxScore}</strong>
      </div>
      {items.map((item) => (
        <label className="checklist__item" key={item.id}>
          <input type="checkbox" checked={checkedIds.includes(item.id)} onChange={() => toggle(item.id)} />
          <span>{item.text}</span>
          <b>{item.points}</b>
        </label>
      ))}
    </div>
  );
}
