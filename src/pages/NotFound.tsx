import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-6xl font-extrabold text-slate-900 dark:text-white">404</h1>
      <p className="mt-4 text-slate-500 dark:text-slate-400">
        This page doesn’t exist.
      </p>
      <Link
        to="/"
        className="mt-8 inline-block rounded-lg bg-sky-600 px-6 py-2 font-semibold text-white transition hover:bg-sky-500"
      >
        Back to all countries
      </Link>
    </div>
  );
}
