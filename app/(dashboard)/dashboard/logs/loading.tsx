function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-[var(--color-border)] rounded-md ${className ?? ''}`} />
}

function StatCardSkeleton() {
  return (
    <div className="border border-[var(--color-border)] rounded-xl p-5 flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-7 w-16" />
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  )
}

export default function LogsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-48 rounded-lg ml-auto" />
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-20 rounded-xl" />
        <Skeleton className="h-9 w-24 rounded-xl" />
        <Skeleton className="h-9 w-28 rounded-xl" />
        <Skeleton className="h-9 w-22 rounded-xl" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border border-[var(--color-border)] rounded-xl p-5">
            <Skeleton className="h-4 w-16 rounded-full mb-3" />
            <Skeleton className="h-4 w-28 mb-3" />
            <Skeleton className="h-3 w-24 mb-4" />
            <div className="flex items-center justify-between mt-4">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-8 w-16 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
