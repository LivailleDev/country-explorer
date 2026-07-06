import type { ReactNode } from 'react';

interface StateMessageProps {
  title: string;
  children?: ReactNode;
}

/** Centered message used for loading, empty and error states. */
export default function StateMessage({ title, children }: StateMessageProps) {
  return (
    <div className="py-28 text-center">
      <p className="font-serif text-xl text-stone-700 dark:text-stone-200">{title}</p>
      {children && (
        <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">{children}</p>
      )}
    </div>
  );
}
