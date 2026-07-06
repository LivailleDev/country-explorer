import { useEffect, useState } from 'react';
import type { CountrySummary } from '../types';

const TICK_MS = 1800;
const PAIRS_PER_TICK = 3;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Keeps the same set of countries on screen but periodically swaps a few random
 * pairs, so the grid stays alive without ever hiding a country. Re-seeds when the
 * pool changes (search / filter / load) and pauses if the user prefers reduced motion.
 */
export function useAutoShuffle(pool: CountrySummary[]): CountrySummary[] {
  const [order, setOrder] = useState<CountrySummary[]>(pool);

  useEffect(() => {
    setOrder(pool);
  }, [pool]);

  useEffect(() => {
    if (pool.length < 2 || prefersReducedMotion()) return;
    const id = setInterval(() => {
      setOrder((prev) => {
        if (prev.length < 2) return prev;
        const next = prev.slice();
        for (let p = 0; p < PAIRS_PER_TICK; p++) {
          const i = Math.floor(Math.random() * next.length);
          const j = Math.floor(Math.random() * next.length);
          if (i !== j) {
            const tmp = next[i];
            next[i] = next[j];
            next[j] = tmp;
          }
        }
        return next;
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, [pool]);

  return order;
}
