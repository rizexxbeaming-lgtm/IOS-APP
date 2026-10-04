"use client";

import { useEffect, useState } from "react";
import { addHabit } from "@/lib/store";
import { PRESETS, presetFor } from "@/lib/presets";
import { toLocalInputValue } from "@/lib/format";
import type { Category } from "@/lib/types";

const CURRENCIES = ["₽", "$", "€", "₴", "₸"];

export function AddHabitSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const smoking = presetFor("smoking");
  const [category, setCategory] = useState<Category>("smoking");
  const [name, setName] = useState(smoking.label);
  const [emoji, setEmoji] = useState(smoking.emoji);
  const [unitName, setUnitName] = useState(smoking.unitName);
  const [unitsPerDay, setUnitsPerDay] = useState(String(smoking.unitsPerDay));
  const [costPerUnit, setCostPerUnit] = useState(String(smoking.costPerUnit));
  const [currency, setCurrency] = useState("₽");
  const [quitDate, setQuitDate] = useState(() =>
    toLocalInputValue(new Date()),
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  function applyPreset(cat: Category) {
    const preset = presetFor(cat);
    setCategory(cat);
    setEmoji(preset.emoji);
    setUnitName(preset.unitName);
    setUnitsPerDay(String(preset.unitsPerDay));
    setCostPerUnit(String(preset.costPerUnit));
    setName(cat === "custom" ? "" : preset.label);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    addHabit({
      name: trimmed,
      emoji: emoji.trim() || presetFor(category).emoji,
      category,
      quitDate: new Date(quitDate).toISOString(),
      unitName: unitName.trim() || "раз",
      unitsPerDay: Math.max(0, Number(unitsPerDay) || 0),
      costPerUnit: Math.max(0, Number(costPerUnit) || 0),
      currency,
    });
    onClose();
  }

  if (!open) return null;

  const accent = presetFor(category).color;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        aria-label="Закрыть"
        onClick={onClose}
        className="absolute inset-0 animate-fade-in bg-black/40"
      />
      <div className="relative animate-sheet-in rounded-t-[28px] bg-app shadow-2xl">
        <div className="mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-separator" />
        <form
          onSubmit={handleSubmit}
          className="safe-bottom max-h-[86vh] overflow-y-auto px-5 pb-5 pt-3"
        >
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-[17px] text-muted"
            >
              Отмена
            </button>
            <h2 className="text-[17px] font-semibold">Новая привычка</h2>
            <button
              type="submit"
              className="text-[17px] font-semibold"
              style={{ color: accent }}
            >
              Готово
            </button>
          </div>

          <label className="mb-2 block text-sm font-medium text-muted">
            Что бросаем
          </label>
          <div className="mb-5 flex flex-wrap gap-2">
            {PRESETS.map((p) => {
              const active = p.category === category;
              return (
                <button
                  key={p.category}
                  type="button"
                  onClick={() => applyPreset(p.category)}
                  className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[15px] font-medium transition"
                  style={{
                    backgroundColor: active ? p.color : "var(--card)",
                    color: active ? "#fff" : "var(--ink)",
                  }}
                >
                  <span>{p.emoji}</span>
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>

          <div className="space-y-px overflow-hidden rounded-2xl bg-card">
            <Field label="Название">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например, вечерние сигареты"
                className="w-full bg-transparent text-right text-[17px] outline-none placeholder:text-muted"
              />
            </Field>
            <Field label="Эмодзи">
              <input
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                maxLength={2}
                className="w-16 bg-transparent text-right text-[17px] outline-none"
              />
            </Field>
            <Field label="Единица">
              <input
                value={unitName}
                onChange={(e) => setUnitName(e.target.value)}
                placeholder="сигарета"
                className="w-40 bg-transparent text-right text-[17px] outline-none placeholder:text-muted"
              />
            </Field>
            <Field label="Штук в день">
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                value={unitsPerDay}
                onChange={(e) => setUnitsPerDay(e.target.value)}
                className="w-24 bg-transparent text-right text-[17px] outline-none"
              />
            </Field>
            <Field label="Цена за штуку">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="any"
                  value={costPerUnit}
                  onChange={(e) => setCostPerUnit(e.target.value)}
                  className="w-24 bg-transparent text-right text-[17px] outline-none"
                />
                <span className="text-muted">{currency}</span>
              </div>
            </Field>
          </div>

          <label className="mb-2 mt-5 block text-sm font-medium text-muted">
            Валюта
          </label>
          <div className="mb-5 flex gap-2">
            {CURRENCIES.map((c) => {
              const active = c === currency;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCurrency(c)}
                  className="size-11 rounded-xl text-[17px] font-semibold transition"
                  style={{
                    backgroundColor: active ? accent : "var(--card)",
                    color: active ? "#fff" : "var(--ink)",
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>

          <div className="overflow-hidden rounded-2xl bg-card">
            <Field label="Не повторяю с">
              <input
                type="datetime-local"
                value={quitDate}
                onChange={(e) => setQuitDate(e.target.value)}
                className="bg-transparent text-right text-[17px] outline-none"
              />
            </Field>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-2xl py-4 text-[17px] font-semibold text-white transition active:scale-[0.98]"
            style={{ backgroundColor: accent }}
          >
            Начать отсчёт
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 bg-card px-4 py-3">
      <span className="shrink-0 text-[17px] text-ink">{label}</span>
      {children}
    </div>
  );
}
