import { REGIONS } from '../types';

interface RegionFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RegionFilter({ value, onChange }: RegionFilterProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label="Filter by region"
      className="rounded-lg bg-white px-4 py-3 text-slate-800 shadow-sm ring-1 ring-slate-200 outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700"
    >
      <option value="">All regions</option>
      {REGIONS.map((region) => (
        <option key={region} value={region}>
          {region}
        </option>
      ))}
    </select>
  );
}
