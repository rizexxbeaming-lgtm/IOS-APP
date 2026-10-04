"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/** Returns the current timestamp, re-rendering every `intervalMs`. */
export function useNow(intervalMs = 60000): number {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}

const emptySubscribe = () => () => {};

/**
 * True only after client-side hydration. Implemented with
 * useSyncExternalStore so it is hydration-safe and avoids calling
 * setState inside an effect.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
