import type { CountrySummary } from '../types';

export interface CountryFilters {
  query: string;
  region: string; // '' means every region
}

/**
 * Filter countries by name (case-insensitive, partial) and region.
 * Pure and framework-free, so it's trivial to unit test.
 */
export function filterCountries(
  countries: CountrySummary[],
  { query, region }: CountryFilters,
): CountrySummary[] {
  const q = query.trim().toLowerCase();
  return countries.filter((country) => {
    const matchesRegion = !region || country.region === region;
    const matchesQuery = !q || country.name.toLowerCase().includes(q);
    return matchesRegion && matchesQuery;
  });
}

/** Format a population with thousands separators, e.g. 212559409 → "212,559,409". */
export function formatPopulation(population: number): string {
  return population.toLocaleString('en-US');
}
