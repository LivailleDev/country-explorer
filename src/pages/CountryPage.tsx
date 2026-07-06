import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { CountryDetail } from '../types';
import { getCountryByCode, getCountryNames } from '../api/countries';
import { formatPopulation } from '../lib/filter';
import StateMessage from '../components/StateMessage';

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-t border-stone-200 py-3 dark:border-stone-800">
      <dt className="eyebrow">{label}</dt>
      <dd className="text-stone-800 dark:text-stone-200">{value || 'N/A'}</dd>
    </div>
  );
}

export default function CountryPage() {
  const { code } = useParams<{ code: string }>();
  const [country, setCountry] = useState<CountryDetail | null>(null);
  const [borders, setBorders] = useState<Array<{ code: string; name: string }>>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    if (!code) return;
    let active = true;
    setStatus('loading');
    setBorders([]);
    getCountryByCode(code)
      .then(async (data) => {
        if (!active) return;
        setCountry(data);
        setStatus('ready');
        const names = await getCountryNames(data.borders);
        if (active) setBorders(names);
      })
      .catch(() => {
        if (active) setStatus('error');
      });
    return () => {
      active = false;
    };
  }, [code]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <Link
        to="/"
        className="eyebrow inline-flex items-center gap-2 transition hover:text-stone-900 dark:hover:text-stone-100"
      >
        <span aria-hidden="true">←</span> Back to all countries
      </Link>

      {status === 'loading' && <StateMessage title="Loading…" />}

      {status === 'error' && (
        <StateMessage title="Country not found">
          We couldn’t find a country for “{code}”.
        </StateMessage>
      )}

      {status === 'ready' && country && (
        <article className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
          <img
            src={country.flag}
            alt={country.flagAlt}
            className="w-full rounded-xl border border-stone-200 object-cover shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)] dark:border-stone-800"
          />
          <div>
            <h1 className="font-serif text-4xl font-medium tracking-tight text-stone-900 dark:text-stone-50">
              {country.name}
            </h1>
            <p className="mt-1 text-stone-500 dark:text-stone-400">{country.nativeName}</p>

            <dl className="mt-8 grid grid-cols-1 sm:grid-cols-2 sm:gap-x-10">
              <Fact
                label="Population"
                value={country.population ? formatPopulation(country.population) : 'N/A'}
              />
              <Fact label="Region" value={country.region} />
              <Fact label="Sub Region" value={country.subregion} />
              <Fact label="Capital" value={country.capital} />
              <Fact label="Top Level Domain" value={country.tld} />
              <Fact label="Currencies" value={country.currencies.join(', ')} />
              <Fact label="Languages" value={country.languages.join(', ')} />
            </dl>

            {country.borders.length > 0 && (
              <div className="mt-10">
                <p className="eyebrow mb-3">Border countries</p>
                <div className="flex flex-wrap gap-2">
                  {(borders.length > 0
                    ? borders
                    : country.borders.map((c) => ({ code: c, name: c }))
                  ).map((border) => (
                    <Link
                      key={border.code}
                      to={`/country/${border.code}`}
                      className="rounded-full border border-stone-300 px-4 py-1.5 text-sm text-stone-700 transition hover:border-stone-900 hover:text-stone-900 dark:border-stone-700 dark:text-stone-300 dark:hover:border-stone-200 dark:hover:text-stone-100"
                    >
                      {border.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      )}
    </div>
  );
}
