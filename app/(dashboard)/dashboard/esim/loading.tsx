function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-[var(--color-border)] rounded-md ${className ?? ''}`} />
}

export default function ESIMLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-56 rounded-lg ml-auto" />
      </div>
      <div className="space-y-8">
        {['Africa', 'Europe', 'Asia'].map((group) => (
          <div key={group}>
            <Skeleton className="h-5 w-28 mb-3" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="border border-[var(--color-border)] rounded-xl p-4">
                  <Skeleton className="h-5 w-5 mb-2" />
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
