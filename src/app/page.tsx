"use client";

import { useMemo, useState } from "react";
import { AddHabitSheet } from "@/components/AddHabitSheet";
import { HabitCard } from "@/components/HabitCard";
import { PlusIcon } from "@/components/Icons";
import { cleanDays, moneySaved } from "@/lib/habits";
import { daysWord, formatMoney } from "@/lib/format";
import { useHabits } from "@/lib/store";
import { useMounted, useNow } from "@/lib/useNow";

export default function HomePage() {
  const habits = useHabits();
  const now = useNow(1000);
  const mounted = useMounted();
  const [addOpen, setAddOpen] = useState(false);

  const totals = useMemo(() => {
    let totalDays = 0;
    const byCurrency = new Map<string, number>();
    for (const h of habits) {
      totalDays += cleanDays(h, now);
      byCurrency.set(
        h.currency,
        (byCurrency.get(h.currency) ?? 0) + moneySaved(h, now),
      );
    }
    const money = [...byCurrency.entries()]
      .filter(([, v]) => v > 0)
      .map(([currency, value]) => formatMoney(value, currency));
    return { totalDays, money };
  }, [habits, now]);

  return (
    <main className="safe-top flex min-h-screen flex-col px-4 pb-28">
      <header className="px-1 pb-4 pt-3">
        <p className="text-[15px] font-medium text-muted">
          {new Date(now).toLocaleDateString("ru-RU", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
        <h1 className="text-[34px] font-bold leading-tight tracking-tight">
          Чисто
        </h1>
      </header>

      {!mounted ? (
        <SkeletonList />
      ) : habits.length === 0 ? (
        <EmptyState onAdd={() => setAddOpen(true)} />
      ) : (
        <>
          <section className="mb-5 rounded-3xl bg-gradient-to-br from-accent to-emerald-600 p-5 text-white shadow-sm">
            <p className="text-sm font-medium text-white/80">Всего под контролем</p>
            <div className="mt-2 flex items-end justify-between">
              <div>
                <p className="text-4xl font-bold tabular-nums">
                  {totals.totalDays}
                </p>
                <p className="text-sm text-white/80">
                  {daysWord(totals.totalDays)} без срывов суммарно
                </p>
              </div>
              {totals.money.length > 0 && (
                <div className="text-right">
                  <p className="text-xl font-semibold tabular-nums">
                    {totals.money.join(" · ")}
                  </p>
                  <p className="text-sm text-white/80">сэкономлено</p>
                </div>
              )}
            </div>
          </section>

          <section className="space-y-3">
            {habits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} now={now} />
            ))}
          </section>
        </>
      )}

      <button
        onClick={() => setAddOpen(true)}
        className="safe-bottom fixed inset-x-0 bottom-0 z-30 mx-auto flex w-full max-w-md items-center justify-center"
      >
        <span className="mb-4 flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-[17px] font-semibold text-white shadow-lg transition active:scale-95">
          <PlusIcon className="size-5" />
          Новая привычка
        </span>
      </button>

      {addOpen && (
        <AddHabitSheet open onClose={() => setAddOpen(false)} />
      )}
    </main>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <div className="grid size-24 place-items-center rounded-[28px] bg-card text-5xl shadow-sm">
        🌱
      </div>
      <h2 className="mt-6 text-2xl font-bold">Начни с одной привычки</h2>
      <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-muted">
        Выбери, что хочешь бросить — курение, алкоголь или что-то своё. Будем
        считать дни без срывов, сэкономленные деньги и вехи здоровья.
      </p>
      <button
        onClick={onAdd}
        className="mt-6 flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-[17px] font-semibold text-white shadow-lg transition active:scale-95"
      >
        <PlusIcon className="size-5" />
        Добавить привычку
      </button>
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-3">
      <div className="h-28 animate-pulse rounded-3xl bg-card" />
      <div className="h-24 animate-pulse rounded-3xl bg-card" />
      <div className="h-24 animate-pulse rounded-3xl bg-card" />
    </div>
  );
}
