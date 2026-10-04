"use client";

import { useEffect } from "react";

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Подтвердить",
  cancelLabel = "Отмена",
  destructive = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-8">
      <button
        aria-label="Закрыть"
        onClick={onCancel}
        className="absolute inset-0 animate-fade-in bg-black/40"
      />
      <div className="relative w-full max-w-xs animate-fade-in overflow-hidden rounded-3xl bg-card-raised text-center shadow-2xl">
        <div className="px-5 py-5">
          <h3 className="text-[17px] font-semibold text-ink">{title}</h3>
          {message ? (
            <p className="mt-1.5 text-[13px] leading-snug text-muted">
              {message}
            </p>
          ) : null}
        </div>
        <div className="grid grid-cols-2 border-t border-separator">
          <button
            onClick={onCancel}
            className="border-r border-separator py-3.5 text-[17px] text-ink"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="py-3.5 text-[17px] font-semibold"
            style={{ color: destructive ? "var(--danger)" : "var(--accent)" }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
