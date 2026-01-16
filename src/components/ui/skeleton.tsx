interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded bg-zinc-200 dark:bg-zinc-800 ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function SkeletonText({ className = '' }: SkeletonProps) {
  return <Skeleton className={`h-4 ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <Skeleton className="mb-4 h-6 w-32" />
      <div className="space-y-3">
        <SkeletonText className="w-full" />
        <SkeletonText className="w-5/6" />
        <SkeletonText className="w-4/6" />
      </div>
    </div>
  );
}

export function SkeletonCurrentWeather() {
  return (
    <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-8 shadow-sm dark:from-blue-600 dark:to-blue-800">
      <div className="text-center">
        <Skeleton className="mx-auto mb-4 h-8 w-48 bg-white/20" />
        <Skeleton className="mx-auto mb-4 h-24 w-24 rounded-full bg-white/20" />
        <Skeleton className="mx-auto mb-2 h-16 w-32 bg-white/20" />
        <Skeleton className="mx-auto mb-6 h-6 w-40 bg-white/20" />
        <div className="mx-auto grid max-w-md grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <Skeleton className="mb-2 h-5 w-5 rounded bg-white/20" />
              <Skeleton className="mb-1 h-4 w-16 bg-white/20" />
              <Skeleton className="h-5 w-12 bg-white/20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonHourlyForecast() {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <Skeleton className="h-6 w-40" />
      </div>
      <div className="px-6 py-4">
        <div className="flex gap-4 overflow-x-auto">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex min-w-[60px] flex-col items-center">
              <Skeleton className="mb-2 h-4 w-12" />
              <Skeleton className="mb-2 h-10 w-10 rounded" />
              <Skeleton className="h-5 w-10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
