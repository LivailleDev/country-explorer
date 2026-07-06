/** A trimmed-down country used in the grid / list views. */
export interface CountrySummary {
  code: string; // cca3, e.g. "BRA"
  name: string; // common name
  flag: string; // flag image URL
  flagAlt: string;
  population: number;
  region: string;
  capital: string;
  ccn3?: string | null; // ISO 3166-1 numeric, used to match the map geometry
}

/** Full detail shown on the country page. Extends the summary. */
export interface CountryDetail extends CountrySummary {
  nativeName: string;
  subregion: string;
  tld: string;
  currencies: string[];
  languages: string[];
  borders: string[]; // cca3 codes of neighbouring countries
}

/** The eight regions exposed by the REST Countries API (plus "All"). */
export const REGIONS = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'] as const;
export type Region = (typeof REGIONS)[number];
