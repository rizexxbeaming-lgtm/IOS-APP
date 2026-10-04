"use client";

import { useSyncExternalStore } from "react";
import type { Habit, HabitInput } from "./types";

const KEY = "habit-tracker:v1";
const EMPTY: Habit[] = [];

let state: Habit[] | null = null;
const listeners = new Set<() => void>();

function ensureLoaded(): Habit[] {
  if (state !== null) return state;
  if (typeof window === "undefined") {
    state = EMPTY;
    return state;
  }
  try {
    const raw = window.localStorage.getItem(KEY);
    state = raw ? (JSON.parse(raw) as Habit[]) : [];
  } catch {
    state = [];
  }
  return state;
}

function commit(next: Habit[]) {
  state = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage full or unavailable — keep in-memory state */
    }
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Habit[] {
  return ensureLoaded();
}

function getServerSnapshot(): Habit[] {
  return EMPTY;
}

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function useHabits(): Habit[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useHabit(id: string): Habit | undefined {
  const habits = useHabits();
  return habits.find((h) => h.id === id);
}

export function addHabit(input: HabitInput): Habit {
  const habits = ensureLoaded();
  const habit: Habit = {
    id: uid(),
    ...input,
    slips: [],
    createdAt: new Date().toISOString(),
  };
  commit([habit, ...habits]);
  return habit;
}

export function updateHabit(id: string, patch: Partial<HabitInput>) {
  const habits = ensureLoaded();
  commit(habits.map((h) => (h.id === id ? { ...h, ...patch } : h)));
}

export function removeHabit(id: string) {
  const habits = ensureLoaded();
  commit(habits.filter((h) => h.id !== id));
}

/** Record a relapse. Defaults to now. Resets the current streak. */
export function recordSlip(id: string, when: Date = new Date()) {
  const habits = ensureLoaded();
  commit(
    habits.map((h) => {
      if (h.id !== id) return h;
      const slips = [...h.slips, when.toISOString()].sort();
      return { ...h, slips };
    }),
  );
}

export function undoLastSlip(id: string) {
  const habits = ensureLoaded();
  commit(
    habits.map((h) => {
      if (h.id !== id || h.slips.length === 0) return h;
      return { ...h, slips: h.slips.slice(0, -1) };
    }),
  );
}

/** Start the streak over from now, keeping history of past slips. */
export function restartStreak(id: string) {
  const habits = ensureLoaded();
  const now = new Date().toISOString();
  commit(
    habits.map((h) => {
      if (h.id !== id) return h;
      return { ...h, slips: [...h.slips, now].sort() };
    }),
  );
}
