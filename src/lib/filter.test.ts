import { describe, it, expect } from 'vitest';
import { filterCountries, formatPopulation } from './filter';
import type { CountrySummary } from '../types';

const make = (
  code: string,
  name: string,
  region: string,
  population = 1000,
): CountrySummary => ({
  code,
  name,
  region,
  population,
  flag: '',
  flagAlt: '',
  capital: '',
});

const countries: CountrySummary[] = [
  make('BRA', 'Brazil', 'Americas'),
  make('PRT', 'Portugal', 'Europe'),
  make('ESP', 'Spain', 'Europe'),
  make('JPN', 'Japan', 'Asia'),
];

describe('filterCountries', () => {
  it('returns everything when there are no filters', () => {
    expect(filterCountries(countries, { query: '', region: '' })).toHaveLength(4);
  });

  it('filters by name, case-insensitively and partially', () => {
    const result = filterCountries(countries, { query: 'portu', region: '' });
    expect(result.map((c) => c.name)).toEqual(['Portugal']);
  });

  it('filters by region', () => {
    const result = filterCountries(countries, { query: '', region: 'Europe' });
    expect(result.map((c) => c.name)).toEqual(['Portugal', 'Spain']);
  });

  it('combines query and region', () => {
    const result = filterCountries(countries, { query: 'spa', region: 'Europe' });
    expect(result.map((c) => c.name)).toEqual(['Spain']);
  });

  it('ignores surrounding whitespace in the query', () => {
    const result = filterCountries(countries, { query: '  japan  ', region: '' });
    expect(result.map((c) => c.name)).toEqual(['Japan']);
  });

  it('returns an empty array when nothing matches', () => {
    expect(filterCountries(countries, { query: 'zzz', region: '' })).toEqual([]);
  });
});

describe('formatPopulation', () => {
  it('adds thousands separators', () => {
    expect(formatPopulation(212559409)).toBe('212,559,409');
  });

  it('leaves small numbers untouched', () => {
    expect(formatPopulation(999)).toBe('999');
  });
});
