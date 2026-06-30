function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-[var(--color-border)] rounded-md ${className ?? ''}`} />
}

export default function SettingsLoading() {
  return (
    <div className="max-w-2xl space-y-1 border border-[var(--color-border)] rounded-xl">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-[var(--color-border)] last:border-0">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-40" />
          </div>
          <Skeleton className="h-4 w-4" />
        </div>
      ))}
    </div>
  )
}
