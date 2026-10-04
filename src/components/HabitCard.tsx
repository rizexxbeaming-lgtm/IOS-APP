"use client";

import Link from "next/link";
import {
  cleanDays,
  milestoneProgress,
  moneySaved,
  nextMilestone,
} from "@/lib/habits";
import { daysWord, formatMoney } from "@/lib/format";
import { presetFor } from "@/lib/presets";
import type { Habit } from "@/lib/types";
import { ChevronRightIcon, FlameIcon } from "./Icons";

export function HabitCard({ habit, now }: { habit: Habit; now: number }) {
  const preset = presetFor(habit.category);
  const days = cleanDays(habit, now);
  const money = moneySaved(habit, now);
  const progress = milestoneProgress(habit, now);
  const next = nextMilestone(habit, now);

  return (
    <Link
      href={`/habit/${habit.id}`}
      className="block rounded-3xl bg-card p-4 shadow-sm transition active:scale-[0.98]"
    >
      <div className="flex items-center gap-4">
        <div
          className="grid size-14 shrink-0 place-items-center rounded-2xl text-2xl"
          style={{ backgroundColor: `${preset.color}22` }}
        >
          <span>{habit.emoji}</span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[17px] font-semibold text-ink">
            {habit.name}
          </p>
          <div className="mt-0.5 flex items-center gap-1.5 text-[15px] font-medium text-muted">
            <FlameIcon
              className="size-4"
              style={{ color: preset.color }}
            />
            <span>
              {days} {daysWord(days)} без срывов
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-right">
          <div>
            <p
              className="text-[17px] font-semibold tabular-nums"
              style={{ color: preset.color }}
            >
              {formatMoney(money, habit.currency)}
            </p>
            <p className="text-xs text-muted">сэкономлено</p>
          </div>
          <ChevronRightIcon className="size-5 text-muted" />
        </div>
      </div>

      <div className="mt-3">
        <div className="h-1.5 overflow-hidden rounded-full bg-separator">
          <div
            className="h-full rounded-full transition-[width] duration-500"
            style={{
              width: `${Math.round(progress * 100)}%`,
              backgroundColor: preset.color,
            }}
          />
        </div>
        <p className="mt-1.5 text-xs text-muted">
          {next
            ? `Следующая веха: ${next.title} — ${next.desc}`
            : "Все вехи достигнуты. Ты справился!"}
        </p>
      </div>
    </Link>
  );
}
