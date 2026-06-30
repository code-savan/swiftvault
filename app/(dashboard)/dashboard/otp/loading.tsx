function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-[var(--color-border)] rounded-md ${className ?? ''}`} />
}

function StatCardSkeleton() {
  return (
    <div className="border border-[var(--color-border)] rounded-xl p-5 flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-7 w-16" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  )
}

export default function OTPLoading() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
      <div>
        <Skeleton className="h-5 w-36 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border border-[var(--color-border)] rounded-xl p-4">
              <Skeleton className="h-5 w-5 mb-2" />
              <Skeleton className="h-4 w-28 mb-1" />
              <Skeleton className="h-3 w-16 mb-2" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-6 w-16 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
