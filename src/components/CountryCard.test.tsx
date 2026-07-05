import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CountryCard from './CountryCard';
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

function renderCard(country: CountrySummary) {
  return render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <CountryCard country={country} />
    </MemoryRouter>,
  );
}

describe('CountryCard', () => {
  it('renders the country name, region, capital and formatted population', () => {
    renderCard(brazil);

    expect(screen.getByRole('heading', { name: 'Brazil' })).toBeInTheDocument();
    expect(screen.getByText('212,559,409')).toBeInTheDocument();
    expect(screen.getByText('Americas')).toBeInTheDocument();
    expect(screen.getByText('Brasília')).toBeInTheDocument();
  });

  it('renders the flag with its alt text', () => {
    renderCard(brazil);
    const flag = screen.getByRole('img', { name: 'Flag of Brazil' });
    expect(flag).toHaveAttribute('src', 'https://flagcdn.com/br.svg');
  });

  it('links to the country detail route by code', () => {
    renderCard(brazil);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/country/BRA');
  });
});
