import type { ReactNode } from 'react';

interface StateMessageProps {
  title: string;
  children?: ReactNode;
}

/** Centered message used for loading, empty and error states. */
export default function StateMessage({ title, children }: StateMessageProps) {
  return (
    <div className="py-24 text-center">
      <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">{title}</p>
      {children && <p className="mt-2 text-slate-500 dark:text-slate-400">{children}</p>}
    </div>
  );
}
