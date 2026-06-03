import { Link, Route, Routes } from 'react-router-dom';
import { formulas, practiceTasks, theoryTopics } from './data/content';
import { MathBlock } from './components/MathBlock';
import { loadProgress, saveGrade } from './storage';
import { useMemo, useState } from 'react';
import { SelfGrade } from './types';

const gradeButtons: SelfGrade[] = ['know', 'partial', 'dont_know'];

function Layout({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState<boolean>(document.body.dataset.theme === 'dark');
  return <div className="app">
    <header><h1>ГОС-тренажёр по газовой динамике</h1>
      <nav>{['/learn','/quiz','/formulas','/practice','/exam','/weak','/plan'].map((p)=><Link key={p} to={p}>{p.slice(1)}</Link>)}</nav>
      <button onClick={()=>{const next=!dark;setDark(next);document.body.dataset.theme=next?'dark':'light';}}>Тема: {dark?'тёмная':'светлая'}</button>
    </header>
    <main>{children}</main>
  </div>;
}

function Learn() {
  const [id, setId] = useState(theoryTopics[0].id);
  const t = theoryTopics.find(x=>x.id===id)!;
  return <section><h2>Учить тему</h2><select value={id} onChange={e=>setId(e.target.value)}>{theoryTopics.map(t=><option key={t.id} value={t.id}>{t.title}</option>)}</select>
    <h3>Простое объяснение</h3><p>{t.shortExplanation}</p><h3>Экзаменационный ответ</h3><p>{t.examAnswerFull}</p><h3>Формулы по теме (красивый вид)</h3>{t.formulas.map(f=><MathBlock key={f.id} latex={f.latex}/>)}<h3>Физический смысл</h3><p>{t.physicalMeaning}</p></section>;
}

function Quiz() {const [i, setI]=useState(0); const q=theoryTopics[i]; const [show,setShow]=useState(false); return <section><h2>Опрос</h2><p>{q.title}</p><button onClick={()=>setShow(true)}>Показать эталон</button>{show&&<p>{q.examAnswerFull}</p>}
{gradeButtons.map(g=><button key={g} onClick={()=>{saveGrade(q.id,g);setShow(false);setI((i+1)%theoryTopics.length);}}>{g}</button>)}</section>;}

function FormulaTrainer(){const [i,setI]=useState(0);const [show,setShow]=useState(false);const f=formulas[i];return <section><h2>Формулы</h2><p>Восстановите формулу: <b>{f.title}</b></p><button onClick={()=>setShow(true)}>Показать</button>{show&&<MathBlock latex={f.latex}/>} {gradeButtons.map(g=><button key={g} onClick={()=>{saveGrade(f.id,g);setShow(false);setI((i+1)%formulas.length)}}>{g}</button>)}</section>}

function Practice(){const [i,setI]=useState(0);const t=practiceTasks[i];const [h,setH]=useState(0);return <section><h2>Практика</h2><h3>{t.title}</h3><p>{t.condition}</p><button onClick={()=>setH(Math.min(3,h+1))}>Следующая подсказка</button>{h>=1&&<p>1) {t.hints.eqHint}</p>}{h>=2&&<p>2) {t.hints.firstStepHint}</p>}{h>=3&&<p>3) {t.hints.formulaHint}</p>}<details><summary>Полное решение</summary><p>{t.fullSolution}</p><p><b>Шаблон:</b> {t.templateForSimilar}</p></details><button onClick={()=>{saveGrade(t.id,'partial');setH(0);setI((i+1)%practiceTasks.length)}}>К следующей задаче</button></section>}

function Exam(){const picks=useMemo(()=>({th:[...theoryTopics].sort(()=>Math.random()-0.5).slice(0,2),pr:[...practiceTasks].sort(()=>Math.random()-0.5)[0]}),[]);return <section><h2>Экзамен</h2><ol>{picks.th.map(t=><li key={t.id}>{t.title}</li>)}<li>{picks.pr.title}</li></ol><p><b>Критерии:</b> корректность формул, физический смысл, полнота вывода, единицы измерения.</p></section>}

function Weak(){const p=loadProgress();const weak=Object.entries(p).filter(([,arr])=>arr.slice(-5).some(g=>g!=='know')).map(([id])=>id);return <section><h2>Слабые темы</h2><ul>{weak.map(id=><li key={id}>{id}</li>)}</ul></section>}

function Plan(){const days=Array.from({length:14},(_,k)=>k+1);return <section><h2>План на 14 дней</h2><ul>{days.map(d=><li key={d}>День {d}: теория {theoryTopics[(d-1)%theoryTopics.length].title}, формула {formulas[(d-1)%formulas.length].title}, задача {practiceTasks[(d-1)%practiceTasks.length].title}</li>)}</ul></section>}

export default function App(){return <Layout><Routes><Route path="/" element={<Learn/>}/><Route path="/learn" element={<Learn/>}/><Route path="/quiz" element={<Quiz/>}/><Route path="/formulas" element={<FormulaTrainer/>}/><Route path="/practice" element={<Practice/>}/><Route path="/exam" element={<Exam/>}/><Route path="/weak" element={<Weak/>}/><Route path="/plan" element={<Plan/>}/></Routes></Layout>}
