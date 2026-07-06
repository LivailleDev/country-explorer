import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  toSummary,
  getAllCountries,
  getCountryByCode,
  getCountryNames,
} from './countries';
import { SAMPLE_COUNTRIES } from '../data/sampleCountries';
import type { CountryDetail } from '../types';

const brazil: CountryDetail = {
  code: 'BRA',
  name: 'Brazil',
  flag: 'https://flagcdn.com/br.svg',
  flagAlt: 'Flag of Brazil',
  population: 212559409,
  region: 'Americas',
  subregion: 'South America',
  capital: 'Brasília',
  nativeName: 'Brasil',
  tld: '.br',
  currencies: ['Brazilian real'],
  languages: ['Portuguese'],
  borders: ['ARG'],
};

const spain: CountryDetail = {
  code: 'ESP',
  name: 'Spain',
  flag: 'https://flagcdn.com/es.svg',
  flagAlt: 'Flag of Spain',
  population: 47351567,
  region: 'Europe',
  subregion: 'Southern Europe',
  capital: 'Madrid',
  nativeName: 'España',
  tld: '.es',
  currencies: ['Euro'],
  languages: ['Spanish'],
  borders: ['PRT', 'FRA'],
};

const okResponse = (data: unknown) => ({ ok: true, json: async () => data });

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('toSummary', () => {
  it('keeps only the summary fields', () => {
    expect(toSummary(brazil)).toEqual({
      code: 'BRA',
      name: 'Brazil',
      flag: 'https://flagcdn.com/br.svg',
      flagAlt: 'Flag of Brazil',
      population: 212559409,
      region: 'Americas',
      capital: 'Brasília',
      ccn3: null,
    });
    expect(toSummary(brazil)).not.toHaveProperty('borders');
  });
});

describe('getAllCountries', () => {
  it('fetches the dataset, projects to summaries and sorts by name', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(okResponse([spain, brazil])));

    const result = await getAllCountries();
    expect(result.map((c) => c.name)).toEqual(['Brazil', 'Spain']); // sorted
    expect(result[0]).not.toHaveProperty('borders');
  });

  it('falls back to the sample catalog when the request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));

    const result = await getAllCountries();
    expect(result).toHaveLength(SAMPLE_COUNTRIES.length);
    expect(result.find((c) => c.code === 'BRA')?.name).toBe('Brazil');
  });
});

describe('getCountryByCode', () => {
  it('returns the matching country (case-insensitive)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(okResponse([brazil, spain])));

    const detail = await getCountryByCode('bra');
    expect(detail.name).toBe('Brazil');
    expect(detail.nativeName).toBe('Brasil');
  });

  it('throws when the code is not in the dataset', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(okResponse([brazil])));

    await expect(getCountryByCode('ZZZ')).rejects.toThrow('Country not found');
  });

  it('falls back to the sample when the request fails but the code is known', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));

    const detail = await getCountryByCode('PRT');
    expect(detail.name).toBe('Portugal');
  });
});

describe('getCountryNames', () => {
  it('resolves codes to names, keeping the code when unknown', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(okResponse([brazil, spain])));

    const names = await getCountryNames(['ESP', 'XYZ']);
    expect(names).toEqual([
      { code: 'ESP', name: 'Spain' },
      { code: 'XYZ', name: 'XYZ' },
    ]);
  });

  it('returns an empty array for no codes without fetching', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    expect(await getCountryNames([])).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
