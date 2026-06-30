function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-[var(--color-border)] rounded-md ${className ?? ''}`} />
}

export default function TransactionsLoading() {
  return (
    <div className="space-y-6">
      <div className="relative">
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
      <div className="border border-[var(--color-border)] rounded-xl overflow-hidden">
        <div className="bg-[var(--color-bg)] border-b border-[var(--color-border)] px-6 py-3 flex gap-8">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12 ml-auto" />
          <Skeleton className="h-3 w-16 ml-auto" />
          <Skeleton className="h-3 w-14 ml-auto" />
          <Skeleton className="h-3 w-12 ml-auto" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-[var(--color-border)] last:border-0">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-12 ml-auto" />
            <Skeleton className="h-4 w-20 ml-auto" />
            <Skeleton className="h-5 w-20 ml-auto rounded-full" />
            <Skeleton className="h-3 w-24 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}
