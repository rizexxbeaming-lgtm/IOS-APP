import type { Category } from "./types";

export interface Milestone {
  /** Hours clean required to reach this milestone. */
  hours: number;
  title: string;
  desc: string;
}

export interface CategoryPreset {
  category: Category;
  label: string;
  emoji: string;
  /** Accent colour used for rings and gradients. */
  color: string;
  unitName: string;
  unitsPerDay: number;
  costPerUnit: number;
  milestones: Milestone[];
}

const H = 1;
const WEEK = 24 * 7;
const MONTH = 24 * 30;
const YEAR = 24 * 365;

const SMOKING_MILESTONES: Milestone[] = [
  { hours: 20 / 60, title: "20 минут", desc: "Пульс и давление приходят в норму." },
  { hours: 8 * H, title: "8 часов", desc: "Уровень угарного газа в крови падает вдвое." },
  { hours: 24 * H, title: "1 день", desc: "Начинает снижаться риск инфаркта." },
  { hours: 48 * H, title: "2 дня", desc: "Возвращаются вкус и обоняние." },
  { hours: 72 * H, title: "3 дня", desc: "Бронхи расслабляются, дышать легче." },
  { hours: 2 * WEEK, title: "2 недели", desc: "Улучшается кровообращение." },
  { hours: MONTH, title: "1 месяц", desc: "Меньше кашля и одышки." },
  { hours: 3 * MONTH, title: "3 месяца", desc: "Функция лёгких выросла до 30%." },
  { hours: YEAR, title: "1 год", desc: "Риск болезней сердца снизился вдвое." },
];

const ALCOHOL_MILESTONES: Milestone[] = [
  { hours: 24 * H, title: "1 день", desc: "Сахар в крови стабилизируется." },
  { hours: 48 * H, title: "2 дня", desc: "Уходят симптомы отмены, крепче сон." },
  { hours: 72 * H, title: "3 дня", desc: "Больше энергии, яснее голова." },
  { hours: WEEK, title: "1 неделя", desc: "Восстанавливается сон и водный баланс." },
  { hours: 2 * WEEK, title: "2 недели", desc: "Снижается давление, уходит отёчность." },
  { hours: MONTH, title: "1 месяц", desc: "Восстанавливается печень, чище кожа." },
  { hours: 3 * MONTH, title: "3 месяца", desc: "Лучше концентрация и настроение." },
  { hours: YEAR, title: "1 год", desc: "Заметно снижаются риски для здоровья." },
];

const GENERIC_MILESTONES: Milestone[] = [
  { hours: 24 * H, title: "1 день", desc: "Первый день позади — самое трудное начало сделано." },
  { hours: 72 * H, title: "3 дня", desc: "Тяга начинает ослабевать." },
  { hours: WEEK, title: "1 неделя", desc: "Формируется новая рутина." },
  { hours: 2 * WEEK, title: "2 недели", desc: "Становится заметно легче держаться." },
  { hours: MONTH, title: "1 месяц", desc: "Привычка теряет власть над тобой." },
  { hours: 3 * MONTH, title: "3 месяца", desc: "Новое поведение закрепилось." },
  { hours: 6 * MONTH, title: "6 месяцев", desc: "Ты заметно изменил образ жизни." },
  { hours: YEAR, title: "1 год", desc: "Целый год — это уже часть тебя." },
];

export const PRESETS: CategoryPreset[] = [
  {
    category: "smoking",
    label: "Курение",
    emoji: "🚬",
    color: "#ff9f0a",
    unitName: "сигарета",
    unitsPerDay: 15,
    costPerUnit: 15,
    milestones: SMOKING_MILESTONES,
  },
  {
    category: "alcohol",
    label: "Алкоголь",
    emoji: "🍺",
    color: "#5e5ce6",
    unitName: "порция",
    unitsPerDay: 3,
    costPerUnit: 180,
    milestones: ALCOHOL_MILESTONES,
  },
  {
    category: "vaping",
    label: "Вейп",
    emoji: "💨",
    color: "#64d2ff",
    unitName: "картридж",
    unitsPerDay: 1,
    costPerUnit: 300,
    milestones: SMOKING_MILESTONES,
  },
  {
    category: "sugar",
    label: "Сладкое",
    emoji: "🍬",
    color: "#ff375f",
    unitName: "порция",
    unitsPerDay: 2,
    costPerUnit: 120,
    milestones: GENERIC_MILESTONES,
  },
  {
    category: "caffeine",
    label: "Кофеин",
    emoji: "☕",
    color: "#ac8e68",
    unitName: "чашка",
    unitsPerDay: 3,
    costPerUnit: 150,
    milestones: GENERIC_MILESTONES,
  },
  {
    category: "gaming",
    label: "Игры",
    emoji: "🎮",
    color: "#30d158",
    unitName: "час",
    unitsPerDay: 3,
    costPerUnit: 0,
    milestones: GENERIC_MILESTONES,
  },
  {
    category: "custom",
    label: "Своя",
    emoji: "✨",
    color: "#0a84ff",
    unitName: "раз",
    unitsPerDay: 1,
    costPerUnit: 0,
    milestones: GENERIC_MILESTONES,
  },
];

export const PRESET_BY_CATEGORY: Record<Category, CategoryPreset> = PRESETS.reduce(
  (acc, p) => {
    acc[p.category] = p;
    return acc;
  },
  {} as Record<Category, CategoryPreset>,
);

export function presetFor(category: Category): CategoryPreset {
  return PRESET_BY_CATEGORY[category] ?? PRESET_BY_CATEGORY.custom;
}
