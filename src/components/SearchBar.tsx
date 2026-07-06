interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full sm:max-w-sm">
      <svg
        className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search countries"
        aria-label="Search countries"
        className="w-full border-0 border-b border-stone-300 bg-transparent py-2.5 pl-7 pr-2 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-900 dark:border-stone-700 dark:text-stone-100 dark:focus:border-stone-200"
      />
    </div>
  );
}
