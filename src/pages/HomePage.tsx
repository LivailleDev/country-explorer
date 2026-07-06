import { useEffect, useMemo, useState } from 'react';
import type { CountrySummary } from '../types';
import { getAllCountries } from '../api/countries';
import { filterCountries } from '../lib/filter';
import { useDebounce } from '../hooks/useDebounce';
import { useAutoShuffle } from '../hooks/useAutoShuffle';
import SearchBar from '../components/SearchBar';
import RegionFilter from '../components/RegionFilter';
import CountryTile from '../components/CountryTile';
import StateMessage from '../components/StateMessage';

export default function HomePage() {
  const [countries, setCountries] = useState<CountrySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('');
  const debouncedQuery = useDebounce(query);

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

  const visible = useMemo(
    () => filterCountries(countries, { query: debouncedQuery, region }),
    [countries, debouncedQuery, region],
  );

  // Same countries stay on screen, but a few swap places every couple of seconds.
  const tiles = useAutoShuffle(visible);

  return (
    <div className="mx-auto max-w-6xl px-6">
      <section className="py-12">
        <p className="eyebrow">Every country, one place</p>
        <h1 className="mt-3 max-w-2xl font-serif text-4xl font-medium leading-tight tracking-tight text-stone-900 sm:text-5xl dark:text-stone-50">
          Explore the world, one country at a time.
        </h1>
        <p className="mt-4 max-w-xl text-stone-500 dark:text-stone-400">
          Search, filter by region, and open any country to see its details and neighbours.
        </p>
      </section>

      <div className="flex flex-col gap-6 border-y border-stone-200/80 py-6 sm:flex-row sm:items-center sm:justify-between dark:border-stone-800/80">
        <SearchBar value={query} onChange={setQuery} />
        <RegionFilter value={region} onChange={setRegion} />
      </div>

      {loading ? (
        <StateMessage title="Loading countries…" />
      ) : tiles.length === 0 ? (
        <StateMessage title="No countries found">
          Try a different search or region.
        </StateMessage>
      ) : (
        <>
          <p className="eyebrow py-6">
            {tiles.length} {tiles.length === 1 ? 'country' : 'countries'}
          </p>
          <ul className="grid grid-cols-3 gap-3 pb-4 sm:grid-cols-4 sm:gap-4 md:grid-cols-6 lg:grid-cols-8">
            {tiles.map((country, index) => (
              <li key={index}>
                <CountryTile country={country} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
