import { FormulaItem, PracticeTask, TheoryTopic } from '../types';

export const formulas: FormulaItem[] = [
  { id: 'f1', title: 'Материальная производная', latex: ' \\frac{Df}{Dt}=\\frac{\\partial f}{\\partial t} + (\\mathbf{v}\\cdot\\nabla)f' },
  { id: 'f2', title: 'Неразрывность', latex: '\\frac{\\partial \\rho}{\\partial t}+\\mathrm{div}(\\rho \\mathbf{v})=0' },
  { id: 'f3', title: 'Несжимаемая жидкость', latex: '\\mathrm{div}\\,\\mathbf{v}=0' },
  { id: 'f4', title: 'Якобиан', latex: 'J=\\det\\left(\\frac{\\partial x_i}{\\partial a_j}\\right),\\quad dV=JdV_0' },
  { id: 'f5', title: 'Навье–Стокс', latex: '\\frac{\\partial \\mathbf{v}}{\\partial t}+(\\mathbf{v}\\cdot\\nabla)\\mathbf{v}= -\\frac{1}{\\rho}\\nabla p+\\nu \\Delta \\mathbf{v}+\\mathbf{f}' }
];

export const theoryTopics: TheoryTopic[] = [
  {
    id: 'th1', title: 'Приближение сплошной среды',
    shortExplanation: 'Среду считаем непрерывной, чтобы в точке определять ρ, p, T, v.',
    examAnswerFull: 'Критерий применимости: Kn=λ/L, при Kn<<1 модель сплошной среды корректна.',
    formulas: [formulas[1]],
    physicalMeaning: 'Микромир усредняется до макрополей.',
    typicalMistakes: ['Путают масштаб усреднения l и характерный размер L.', 'Игнорируют Kn.']
  },
  {
    id: 'th2', title: 'Эйлеров и лагранжев подходы',
    shortExplanation: 'Эйлер: наблюдаем поле в точке. Лагранж: следим за частицей.',
    examAnswerFull: 'Лагранж: x=x(a,t). Эйлер: v=v(x,t), ρ=ρ(x,t), p=p(x,t). Подходы эквивалентны.',
    formulas: [formulas[0], formulas[3]],
    physicalMeaning: 'Два эквивалентных языка описания одного движения.',
    typicalMistakes: ['Смешивают независимые переменные x и a.']
  },
  {
    id: 'th3', title: 'Неразрывность и несжимаемость',
    shortExplanation: 'Закон сохранения массы в дифференциальной форме.',
    examAnswerFull: '∂ρ/∂t + div(ρv)=0, или Dρ/Dt + ρ div v=0. Для несжимаемой жидкости div v=0.',
    formulas: [formulas[1], formulas[2]],
    physicalMeaning: 'Масса не исчезает и не возникает.',
    typicalMistakes: ['Для несжимаемого течения ошибочно считают ρ переменной по времени.']
  },
  {
    id: 'th4', title: 'Навье–Стокс и Пуассон для давления',
    shortExplanation: 'Баланс импульса с учетом вязкости, давления и массовых сил.',
    examAnswerFull: 'Для несжимаемой жидкости: ∂v/∂t+(v·∇)v=-(1/ρ)∇p+νΔv+f, div v=0; отсюда выводят уравнение Пуассона для p.',
    formulas: [formulas[4]],
    physicalMeaning: 'Давление и вязкость формируют структуру потока.',
    typicalMistakes: ['Забывают условие div v=0 при выводе уравнения Пуассона.']
  }
];

export const practiceTasks: PracticeTask[] = [
  {
    id: 'pr1', title: 'Течение Куэтта',
    condition: 'Слой толщиной d, верхняя стенка движется со скоростью v0, нижняя неподвижна.',
    hints: {
      eqHint: 'Используйте стационарное уравнение Навье–Стокса без градиента давления.',
      firstStepHint: 'Получите μ d²v_x/dz² = 0 и интегрируйте дважды.',
      formulaHint: 'v_x(0)=0, v_x(d)=v_0.'
    },
    fullSolution: 'v_x=C1 z + C2, C2=0, C1=v0/d, значит v_x(z)=v0 z/d.',
    templateForSimilar: '1) Упростить НС по симметрии; 2) дважды интегрировать; 3) подставить граничные условия.'
  },
  {
    id: 'pr2', title: 'Течение Пуазейля',
    condition: 'Плоский канал -d≤z≤d, перепад давления p1→p2 по длине L.',
    hints: {
      eqHint: 'Взять x-компонент НС: -∂p/∂x + μ d²v_x/dz² = 0.',
      firstStepHint: 'Подставить ∂p/∂x=(p2-p1)/L.',
      formulaHint: 'Использовать v_x(±d)=0.'
    },
    fullSolution: 'Параболический профиль: v_x(z)=((p1-p2)/(2μL))(d²-z²).',
    templateForSimilar: 'При линейном градиенте давления профиль в щели/трубе обычно квадратичный.'
  }
];
