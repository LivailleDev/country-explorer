import { Link, Route, Routes } from 'react-router-dom';
import ThemeToggle from './components/ThemeToggle';
import HomePage from './pages/HomePage';
import CountryPage from './pages/CountryPage';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <div className="min-h-screen font-sans">
      <header className="border-b border-stone-200/80 dark:border-stone-800/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link to="/" className="group flex items-baseline gap-2">
            <span className="font-serif text-2xl font-medium tracking-tight text-stone-900 dark:text-stone-50">
              Atlas
            </span>
            <span className="eyebrow hidden sm:block">Country Explorer</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/country/:code" element={<CountryPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="mx-auto max-w-6xl px-6 py-10">
        <p className="eyebrow">
          Data · public-domain country dataset · flags via flagcdn
        </p>
      </footer>
    </div>
  );
}
