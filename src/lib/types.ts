export type Category =
  | "smoking"
  | "alcohol"
  | "vaping"
  | "sugar"
  | "caffeine"
  | "gaming"
  | "custom";

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  category: Category;
  /** ISO datetime when the user started quitting this habit. */
  quitDate: string;
  /** Singular name of one indulgence, e.g. "сигарета". */
  unitName: string;
  /** How many units per day the user consumed before quitting. */
  unitsPerDay: number;
  /** Cost of a single unit in the chosen currency. */
  costPerUnit: number;
  currency: string;
  /** ISO datetimes of relapses, ascending. Each one resets the streak. */
  slips: string[];
  createdAt: string;
}

export interface HabitInput {
  name: string;
  emoji: string;
  category: Category;
  quitDate: string;
  unitName: string;
  unitsPerDay: number;
  costPerUnit: number;
  currency: string;
}
