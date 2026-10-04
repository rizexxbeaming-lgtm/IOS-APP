import { presetFor, type Milestone } from "./presets";
import type { Habit } from "./types";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Timestamp (ms) when the current clean streak began. */
export function streakStart(habit: Habit): number {
  const quit = new Date(habit.quitDate).getTime();
  if (habit.slips.length === 0) return quit;
  const lastSlip = new Date(habit.slips[habit.slips.length - 1]).getTime();
  return Math.max(quit, lastSlip);
}

/** Milliseconds of the current uninterrupted clean streak. */
export function cleanMs(habit: Habit, now: number): number {
  return Math.max(0, now - streakStart(habit));
}

export function cleanDays(habit: Habit, now: number): number {
  return Math.floor(cleanMs(habit, now) / DAY_MS);
}

/** Fractional days, used for live money / units counters. */
export function cleanDaysFloat(habit: Habit, now: number): number {
  return cleanMs(habit, now) / DAY_MS;
}

/** Longest clean streak in whole days across the habit's whole history. */
export function bestStreakDays(habit: Habit, now: number): number {
  const quit = new Date(habit.quitDate).getTime();
  const boundaries = [
    quit,
    ...habit.slips.map((s) => new Date(s).getTime()),
    now,
  ].sort((a, b) => a - b);

  let best = 0;
  for (let i = 1; i < boundaries.length; i++) {
    const gap = boundaries[i] - boundaries[i - 1];
    if (gap > best) best = gap;
  }
  return Math.floor(best / DAY_MS);
}

export function moneySaved(habit: Habit, now: number): number {
  return cleanDaysFloat(habit, now) * habit.unitsPerDay * habit.costPerUnit;
}

export function unitsAvoided(habit: Habit, now: number): number {
  return cleanDaysFloat(habit, now) * habit.unitsPerDay;
}

export function nextMilestone(habit: Habit, now: number): Milestone | null {
  const ms = cleanMs(habit, now);
  const { milestones } = presetFor(habit.category);
  for (const m of milestones) {
    if (m.hours * 60 * 60 * 1000 > ms) return m;
  }
  return null;
}

export function lastAchievedMilestone(habit: Habit, now: number): Milestone | null {
  const ms = cleanMs(habit, now);
  const { milestones } = presetFor(habit.category);
  let achieved: Milestone | null = null;
  for (const m of milestones) {
    if (m.hours * 60 * 60 * 1000 <= ms) achieved = m;
    else break;
  }
  return achieved;
}

/** Progress 0..1 toward the next milestone (1 if all are achieved). */
export function milestoneProgress(habit: Habit, now: number): number {
  const next = nextMilestone(habit, now);
  if (!next) return 1;
  const prev = lastAchievedMilestone(habit, now);
  const start = prev ? prev.hours * 60 * 60 * 1000 : 0;
  const end = next.hours * 60 * 60 * 1000;
  const ms = cleanMs(habit, now);
  const span = end - start;
  if (span <= 0) return 1;
  return Math.min(1, Math.max(0, (ms - start) / span));
}

export interface MilestoneStatus extends Milestone {
  achieved: boolean;
  /** Timestamp (ms) at which this milestone is / was reached. */
  reachedAt: number;
}

export function milestoneTimeline(habit: Habit, now: number): MilestoneStatus[] {
  const start = streakStart(habit);
  const ms = cleanMs(habit, now);
  return presetFor(habit.category).milestones.map((m) => {
    const threshold = m.hours * 60 * 60 * 1000;
    return {
      ...m,
      achieved: threshold <= ms,
      reachedAt: start + threshold,
    };
  });
}
