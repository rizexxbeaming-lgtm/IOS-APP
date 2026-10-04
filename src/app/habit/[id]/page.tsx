"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import {
  CheckIcon,
  ChevronLeftIcon,
  FlameIcon,
  TrashIcon,
} from "@/components/Icons";
import { StreakRing } from "@/components/StreakRing";
import {
  bestStreakDays,
  cleanDays,
  cleanMs,
  milestoneProgress,
  milestoneTimeline,
  moneySaved,
  nextMilestone,
  unitsAvoided,
} from "@/lib/habits";
import {
  daysWord,
  formatDateTime,
  formatDuration,
  formatMoney,
  formatNumber,
  plural,
} from "@/lib/format";
import { presetFor } from "@/lib/presets";
import {
  removeHabit,
  restartStreak,
  undoLastSlip,
  useHabit,
} from "@/lib/store";
import { useMounted, useNow } from "@/lib/useNow";

export default function HabitDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const habit = useHabit(params.id);
  const now = useNow(1000);
  const mounted = useMounted();

  const [slipOpen, setSlipOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!mounted) {
    return (
      <main className="safe-top min-h-screen px-4">
        <div className="h-14" />
        <div className="mx-auto mt-6 size-56 animate-pulse rounded-full bg-card" />
      </main>
    );
  }

  if (!habit) {
    return (
      <main className="safe-top flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-5xl">🤷</p>
        <h1 className="text-xl font-semibold">Привычка не найдена</h1>
        <Link
          href="/"
          className="rounded-full bg-accent px-5 py-3 font-semibold text-white"
        >
          На главную
        </Link>
      </main>
    );
  }

  const preset = presetFor(habit.category);
  const days = cleanDays(habit, now);
  const best = bestStreakDays(habit, now);
  const money = moneySaved(habit, now);
  const units = unitsAvoided(habit, now);
  const progress = milestoneProgress(habit, now);
  const next = nextMilestone(habit, now);
  const timeline = milestoneTimeline(habit, now);
  const duration = formatDuration(cleanMs(habit, now));

  return (
    <main className="safe-top min-h-screen px-4 pb-16">
      <header className="flex items-center justify-between py-2">
        <button
          onClick={() => router.push("/")}
          className="-ml-2 flex items-center gap-0.5 text-[17px] font-medium"
          style={{ color: preset.color }}
        >
          <ChevronLeftIcon className="size-6" />
          Назад
        </button>
        <button
          onClick={() => setDeleteOpen(true)}
          aria-label="Удалить привычку"
          className="grid size-9 place-items-center rounded-full bg-card text-muted"
        >
          <TrashIcon className="size-5" />
        </button>
      </header>

      <div className="flex flex-col items-center pt-2 text-center">
        <div className="flex items-center gap-2 text-[17px] font-medium text-muted">
          <span className="text-xl">{habit.emoji}</span>
          {habit.name}
        </div>

        <div className="mt-5">
          <StreakRing progress={progress} color={preset.color}>
            <div>
              <p
                className="text-6xl font-bold tabular-nums leading-none"
                style={{ color: preset.color }}
              >
                {days}
              </p>
              <p className="mt-1 text-[15px] font-medium text-muted">
                {daysWord(days)} держусь
              </p>
              <p className="mt-0.5 text-xs text-muted">{duration}</p>
            </div>
          </StreakRing>
        </div>

        {next ? (
          <p className="mt-4 max-w-xs text-[15px] text-muted">
            До вехи <span className="font-semibold text-ink">{next.title}</span>:{" "}
            {next.desc}
          </p>
        ) : (
          <p className="mt-4 max-w-xs text-[15px] font-medium text-accent">
            Все вехи достигнуты. Ты большой молодец!
          </p>
        )}
      </div>

      <section className="mt-6 grid grid-cols-2 gap-3">
        <Stat
          label="Лучший стрик"
          value={`${best} ${daysWord(best)}`}
          icon={<FlameIcon className="size-4" style={{ color: preset.color }} />}
        />
        <Stat
          label="Сэкономлено"
          value={formatMoney(money, habit.currency)}
        />
        <Stat
          label={`Не ${habit.category === "gaming" ? "потрачено" : "употреблено"}`}
          value={`${formatNumber(units)} ${pluralUnit(habit.unitName, units)}`}
        />
        <Stat label="Срывов" value={String(habit.slips.length)} />
      </section>

      <section className="mt-7">
        <h2 className="mb-3 px-1 text-[13px] font-semibold uppercase tracking-wide text-muted">
          Вехи здоровья
        </h2>
        <div className="overflow-hidden rounded-2xl bg-card">
          {timeline.map((m, i) => (
            <div
              key={m.title}
              className="flex items-start gap-3 px-4 py-3"
              style={{
                borderTop:
                  i === 0 ? undefined : "1px solid var(--separator)",
              }}
            >
              <div
                className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full"
                style={{
                  backgroundColor: m.achieved ? preset.color : "var(--separator)",
                  color: "#fff",
                }}
              >
                {m.achieved ? <CheckIcon className="size-4" /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p
                    className={`text-[15px] font-semibold ${m.achieved ? "text-ink" : "text-muted"}`}
                  >
                    {m.title}
                  </p>
                  {!m.achieved && (
                    <span className="shrink-0 text-xs text-muted">
                      через {formatDuration(m.reachedAt - now)}
                    </span>
                  )}
                </div>
                <p className="text-[13px] leading-snug text-muted">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {habit.slips.length > 0 && (
        <section className="mt-7">
          <h2 className="mb-3 px-1 text-[13px] font-semibold uppercase tracking-wide text-muted">
            История срывов
          </h2>
          <div className="overflow-hidden rounded-2xl bg-card">
            {[...habit.slips].reverse().map((slip, i) => (
              <div
                key={slip}
                className="flex items-center justify-between px-4 py-3 text-[15px]"
                style={{
                  borderTop: i === 0 ? undefined : "1px solid var(--separator)",
                }}
              >
                <span className="text-ink">{formatDateTime(slip)}</span>
                {i === 0 && (
                  <button
                    onClick={() => undoLastSlip(habit.id)}
                    className="text-[15px] font-medium"
                    style={{ color: preset.color }}
                  >
                    Отменить
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-8 space-y-3">
        <button
          onClick={() => setSlipOpen(true)}
          className="w-full rounded-2xl bg-card py-4 text-[17px] font-semibold text-danger transition active:scale-[0.98]"
        >
          Отметить срыв
        </button>
        <p className="px-2 text-center text-[13px] leading-snug text-muted">
          Срыв — не конец. Отметь его честно, стрик начнётся заново, а история
          прогресса сохранится.
        </p>
      </div>

      <ConfirmDialog
        open={slipOpen}
        title="Отметить срыв?"
        message="Текущий стрик обнулится и начнётся заново с этого момента."
        confirmLabel="Был срыв"
        destructive
        onConfirm={() => {
          restartStreak(habit.id);
          setSlipOpen(false);
        }}
        onCancel={() => setSlipOpen(false)}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Удалить привычку?"
        message="Весь прогресс по этой привычке будет удалён безвозвратно."
        confirmLabel="Удалить"
        destructive
        onConfirm={() => {
          removeHabit(habit.id);
          router.push("/");
        }}
        onCancel={() => setDeleteOpen(false)}
      />
    </main>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-card p-4">
      <div className="flex items-center gap-1.5 text-[13px] text-muted">
        {icon}
        {label}
      </div>
      <p className="mt-1 text-xl font-semibold tabular-nums text-ink">{value}</p>
    </div>
  );
}

function pluralUnit(unitName: string, n: number): string {
  // Best-effort Russian plural for the common preset units.
  const map: Record<string, [string, string, string]> = {
    сигарета: ["сигарета", "сигареты", "сигарет"],
    порция: ["порция", "порции", "порций"],
    картридж: ["картридж", "картриджа", "картриджей"],
    чашка: ["чашка", "чашки", "чашек"],
    час: ["час", "часа", "часов"],
    раз: ["раз", "раза", "раз"],
  };
  const forms = map[unitName];
  return forms ? plural(Math.round(n), forms) : unitName;
}
