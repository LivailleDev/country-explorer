import { REGIONS } from '../types';

interface RegionFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RegionFilter({ value, onChange }: RegionFilterProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Filter by region"
        className="cursor-pointer appearance-none border-0 border-b border-stone-300 bg-transparent py-2.5 pl-1 pr-8 text-stone-900 outline-none transition focus:border-stone-900 dark:border-stone-700 dark:text-stone-100 dark:focus:border-stone-200"
      >
        <option value="">All regions</option>
        {REGIONS.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-1 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
