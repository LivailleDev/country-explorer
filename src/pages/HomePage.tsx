import { useEffect, useState } from 'react';
import type { CountrySummary } from '../types';
import { getAllCountries } from '../api/countries';
import WorldMap from '../components/WorldMap';
import StateMessage from '../components/StateMessage';

export default function HomePage() {
  const [countries, setCountries] = useState<CountrySummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getAllCountries().then((data) => {
      if (!active) return;
      setCountries(data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6">
      <section className="py-12">
        <p className="eyebrow">Welcome to Atlas</p>
        <h1 className="mt-3 max-w-2xl font-serif text-4xl font-medium leading-tight tracking-tight text-stone-900 sm:text-5xl dark:text-stone-50">
          Come explore the world, one flag at a time.
        </h1>
        <p className="mt-4 max-w-xl text-stone-500 dark:text-stone-400">
          Every one of the 250 countries below is painted with its own flag, right onto its
          real shape. Drag the map to travel, scroll to zoom in, and click any country to
          uncover its capital, languages and neighbours.
        </p>
        <p className="eyebrow mt-6">
          React · TypeScript · React Router · D3 (geo + zoom) · Vitest · CI/CD
        </p>
      </section>

      <div className="pb-16">
        {loading ? <StateMessage title="Loading map…" /> : <WorldMap countries={countries} />}
      </div>
    </div>
  );
}
