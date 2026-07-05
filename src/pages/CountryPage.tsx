import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { CountryDetail } from '../types';
import { getCountryByCode, getCountryNames } from '../api/countries';
import { formatPopulation } from '../lib/filter';
import StateMessage from '../components/StateMessage';

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-sm">
      <span className="font-semibold">{label}:</span> {value || 'N/A'}
    </p>
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
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link
        to="/"
        className="mb-10 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-2 text-sm font-semibold shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 dark:bg-slate-800 dark:ring-slate-700 dark:hover:bg-slate-700"
      >
        ← Back
      </Link>

      {status === 'loading' && <StateMessage title="Loading…" />}

      {status === 'error' && (
        <StateMessage title="Country not found">
          We couldn’t find a country for “{code}”.
        </StateMessage>
      )}

      {status === 'ready' && country && (
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
          <img
            src={country.flag}
            alt={country.flagAlt}
            className="w-full rounded-lg object-cover shadow-md ring-1 ring-slate-200 dark:ring-slate-700"
          />
          <div>
            <h1 className="mb-6 text-3xl font-extrabold text-slate-900 dark:text-white">
              {country.name}
            </h1>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="space-y-2">
                <Fact label="Native Name" value={country.nativeName} />
                <Fact
                  label="Population"
                  value={country.population ? formatPopulation(country.population) : 'N/A'}
                />
                <Fact label="Region" value={country.region} />
                <Fact label="Sub Region" value={country.subregion} />
                <Fact label="Capital" value={country.capital} />
              </div>
              <div className="space-y-2">
                <Fact label="Top Level Domain" value={country.tld} />
                <Fact label="Currencies" value={country.currencies.join(', ')} />
                <Fact label="Languages" value={country.languages.join(', ')} />
              </div>
            </div>

            {country.borders.length > 0 && (
              <div className="mt-8">
                <h2 className="mb-3 font-semibold">Border Countries:</h2>
                <div className="flex flex-wrap gap-2">
                  {(borders.length > 0
                    ? borders
                    : country.borders.map((c) => ({ code: c, name: c }))
                  ).map((border) => (
                    <Link
                      key={border.code}
                      to={`/country/${border.code}`}
                      className="rounded bg-white px-4 py-1 text-sm shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 dark:bg-slate-800 dark:ring-slate-700 dark:hover:bg-slate-700"
                    >
                      {border.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
