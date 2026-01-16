import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  className = '',
}: ErrorStateProps) {
  return (
    <div
      className={`rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-950/30 ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400"
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <h3 className="mb-1 font-semibold text-red-900 dark:text-red-100">{title}</h3>
          <p className="mb-4 text-sm text-red-800 dark:text-red-200">{message}</p>
          {onRetry && (
            <Button
              onClick={onRetry}
              size="sm"
              variant="secondary"
              className="inline-flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon, action, className = '' }: EmptyStateProps) {
  return (
    <div className={`px-4 py-12 text-center ${className}`}>
      {icon && (
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center text-zinc-400 dark:text-zinc-600">
          {icon}
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
      <p className="mx-auto mb-6 max-w-md text-zinc-600 dark:text-zinc-400">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
