import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CountryTile from './CountryTile';
import type { CountrySummary } from '../types';

const brazil: CountrySummary = {
  code: 'BRA',
  name: 'Brazil',
  flag: 'https://flagcdn.com/br.svg',
  flagAlt: 'Flag of Brazil',
  population: 212559409,
  region: 'Americas',
  capital: 'Brasília',
};

function renderTile(country: CountrySummary) {
  return render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <CountryTile country={country} />
    </MemoryRouter>,
  );
}

describe('CountryTile', () => {
  it('links to the country detail route by code', () => {
    renderTile(brazil);
    expect(screen.getByRole('link', { name: 'Brazil' })).toHaveAttribute(
      'href',
      '/country/BRA',
    );
  });

  it('renders the flag with its alt text and the country name', () => {
    renderTile(brazil);
    expect(screen.getByRole('img', { name: 'Flag of Brazil' })).toHaveAttribute(
      'src',
      'https://flagcdn.com/br.svg',
    );
    expect(screen.getByText('Brazil')).toBeInTheDocument();
  });
});
