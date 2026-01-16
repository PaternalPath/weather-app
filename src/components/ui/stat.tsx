import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatProps {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  className?: string;
  iconClassName?: string;
}

export function Stat({ icon: Icon, label, value, className = '', iconClassName = '' }: StatProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`flex-shrink-0 ${iconClassName}`}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm text-zinc-600 dark:text-zinc-400">{label}</div>
        <div className="truncate font-semibold text-zinc-900 dark:text-zinc-100">{value}</div>
      </div>
    </div>
  );
}

interface StatGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function StatGrid({ children, columns = 2, className = '' }: StatGridProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
  };

  return <div className={`grid ${gridCols[columns]} gap-4 ${className}`}>{children}</div>;
}
