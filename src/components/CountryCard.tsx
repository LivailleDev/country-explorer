import { Link } from 'react-router-dom';
import type { CountrySummary } from '../types';
import { formatPopulation } from '../lib/filter';

export default function CountryCard({ country }: { country: CountrySummary }) {
  return (
    <Link
      to={`/country/${country.code}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:bg-slate-800 dark:ring-slate-700"
    >
      <div className="aspect-[3/2] overflow-hidden bg-slate-100 dark:bg-slate-700">
        <img
          src={country.flag}
          alt={country.flagAlt}
          loading="lazy"
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h2 className="mb-1 text-lg font-extrabold text-slate-900 dark:text-white">
          {country.name}
        </h2>
        <p className="text-sm">
          <span className="font-semibold">Population:</span>{' '}
          {country.population ? formatPopulation(country.population) : 'N/A'}
        </p>
        <p className="text-sm">
          <span className="font-semibold">Region:</span> {country.region}
        </p>
        <p className="text-sm">
          <span className="font-semibold">Capital:</span> {country.capital}
        </p>
      </div>
    </Link>
  );
}
