import type { CountryDetail, CountrySummary } from '../types';
import { SAMPLE_COUNTRIES } from '../data/sampleCountries';

// The full catalog (250 countries) is served as a static JSON asset and fetched
// at runtime. REST Countries' free API was deprecated and its v5 now requires an
// API key — which can't be embedded safely in a client-only SPA — so the data is
// bundled and loaded over HTTP here. The api layer is isolated, so swapping in a
// keyed backend later would only touch this file.
// Base-aware so it resolves correctly under the GitHub Pages sub-path in
// production ('/country-explorer/data/...') and at the root in dev.
const DATA_URL = `${import.meta.env.BASE_URL}data/countries.json`;

async function fetchDataset(): Promise<CountryDetail[]> {
  const res = await fetch(DATA_URL);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return (await res.json()) as CountryDetail[];
}

/** Project a full country down to the summary fields used in the grid. */
export function toSummary(country: CountryDetail): CountrySummary {
  return {
    code: country.code,
    name: country.name,
    flag: country.flag,
    flagAlt: country.flagAlt,
    population: country.population,
    region: country.region,
    capital: country.capital,
  };
}

const byName = (a: CountrySummary, b: CountrySummary): number =>
  a.name.localeCompare(b.name);

/** All countries (summary view), sorted by name. Falls back to the sample on failure. */
export async function getAllCountries(): Promise<CountrySummary[]> {
  try {
    const data = await fetchDataset();
    return data.map(toSummary).sort(byName);
  } catch {
    return SAMPLE_COUNTRIES.map(toSummary).sort(byName);
  }
}

/** One country in full detail, by cca3 code. Falls back to the sample when possible. */
export async function getCountryByCode(code: string): Promise<CountryDetail> {
  const wanted = code.toLowerCase();
  try {
    const data = await fetchDataset();
    const found = data.find((c) => c.code.toLowerCase() === wanted);
    if (found) return found;
    throw new Error('Country not found');
  } catch (error) {
    const sample = SAMPLE_COUNTRIES.find((c) => c.code.toLowerCase() === wanted);
    if (sample) return sample;
    throw error instanceof Error ? error : new Error('Country not found');
  }
}

/** Resolve a list of cca3 codes to {code, name} pairs, for border links. */
export async function getCountryNames(
  codes: string[],
): Promise<Array<{ code: string; name: string }>> {
  if (codes.length === 0) return [];
  const lookup = (list: CountryDetail[]) =>
    codes.map((code) => ({
      code,
      name: list.find((c) => c.code === code)?.name ?? code,
    }));
  try {
    return lookup(await fetchDataset());
  } catch {
    return lookup(SAMPLE_COUNTRIES);
  }
}
