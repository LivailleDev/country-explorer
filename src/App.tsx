import { Link, Route, Routes } from 'react-router-dom';
import ThemeToggle from './components/ThemeToggle';
import HomePage from './pages/HomePage';
import CountryPage from './pages/CountryPage';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <div className="min-h-screen font-sans">
      <header className="sticky top-0 z-10 bg-white/90 shadow-sm backdrop-blur dark:bg-slate-800/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link
            to="/"
            className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            🌍 Atlas
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
    </div>
  );
}
