function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-[var(--color-border)] rounded-md ${className ?? ''}`} />
}

export default function SupportLoading() {
  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border border-[var(--color-border)] rounded-xl p-6 text-center">
            <Skeleton className="h-14 w-14 rounded-lg mx-auto mb-4" />
            <Skeleton className="h-4 w-28 mx-auto mb-2" />
            <Skeleton className="h-3 w-40 mx-auto mb-4" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>
      <div>
        <Skeleton className="h-5 w-24 mb-4" />
        <div className="border border-[var(--color-border)] rounded-xl divide-y divide-[var(--color-border)]">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-4 flex-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
