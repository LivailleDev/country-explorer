import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-28 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-3 font-serif text-6xl font-medium tracking-tight text-stone-900 dark:text-stone-50">
        Page not found
      </h1>
      <p className="mt-4 text-stone-500 dark:text-stone-400">
        The page you’re looking for doesn’t exist.
      </p>
      <Link
        to="/"
        className="mt-10 inline-block border-b border-stone-900 pb-1 font-medium text-stone-900 transition hover:opacity-60 dark:border-stone-100 dark:text-stone-100"
      >
        Back to all countries
      </Link>
    </div>
  );
}
