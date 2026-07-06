import { memo } from 'react';
import { Link } from 'react-router-dom';
import type { CountrySummary } from '../types';

function CountryTileBase({ country }: { country: CountrySummary }) {
  return (
    <Link
      to={`/country/${country.code}`}
      aria-label={country.name}
      className="group block focus:outline-none"
    >
      {/* Keyed by code so React remounts and replays the flip when it swaps. */}
      <div
        key={country.code}
        className="animate-tile-in relative aspect-square overflow-hidden rounded-lg border border-stone-200 bg-stone-100 shadow-sm transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-emerald-600/60 dark:border-stone-800 dark:bg-stone-800"
      >
        <img
          src={country.flag}
          alt={country.flagAlt}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-black/80 via-black/25 to-transparent p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <span className="truncate font-serif text-xs font-medium text-white">
            {country.name}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default memo(CountryTileBase);
