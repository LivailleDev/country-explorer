import { useEffect, useMemo, useState } from 'react';
import type { CountrySummary } from '../types';
import { getAllCountries } from '../api/countries';
import { filterCountries } from '../lib/filter';
import { useDebounce } from '../hooks/useDebounce';
import SearchBar from '../components/SearchBar';
import RegionFilter from '../components/RegionFilter';
import CountryCard from '../components/CountryCard';
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={query} onChange={setQuery} />
        <RegionFilter value={region} onChange={setRegion} />
      </div>

      {loading ? (
        <StateMessage title="Loading countries…" />
      ) : visible.length === 0 ? (
        <StateMessage title="No countries found">
          Try a different search or region.
        </StateMessage>
      ) : (
        <>
          <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
            Showing {visible.length} {visible.length === 1 ? 'country' : 'countries'}
          </p>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((country) => (
              <li key={country.code}>
                <CountryCard country={country} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
