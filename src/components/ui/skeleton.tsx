interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded ${className}`}
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
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
      <Skeleton className="h-6 w-32 mb-4" />
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
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-800 rounded-lg shadow-sm p-8">
      <div className="text-center">
        <Skeleton className="h-8 w-48 mx-auto mb-4 bg-white/20" />
        <Skeleton className="h-24 w-24 mx-auto mb-4 rounded-full bg-white/20" />
        <Skeleton className="h-16 w-32 mx-auto mb-2 bg-white/20" />
        <Skeleton className="h-6 w-40 mx-auto mb-6 bg-white/20" />
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <Skeleton className="h-5 w-5 mb-2 rounded bg-white/20" />
              <Skeleton className="h-4 w-16 mb-1 bg-white/20" />
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
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800">
      <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <Skeleton className="h-6 w-40" />
      </div>
      <div className="px-6 py-4">
        <div className="flex gap-4 overflow-x-auto">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col items-center min-w-[60px]">
              <Skeleton className="h-4 w-12 mb-2" />
              <Skeleton className="h-10 w-10 mb-2 rounded" />
              <Skeleton className="h-5 w-10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
