function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-[var(--color-border)] rounded-md ${className ?? ''}`} />
}

export default function WalletLoading() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 rounded-xl bg-gradient-to-br from-[var(--color-accent)]/60 to-green-700/60 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 bg-white/20" />
              <div>
                <Skeleton className="h-3 w-24 bg-white/20 mb-1" />
                <Skeleton className="h-7 w-28 bg-white/20" />
              </div>
            </div>
            <Skeleton className="h-6 w-14 bg-white/20 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-16 bg-white/10 rounded" />
            <Skeleton className="h-16 bg-white/10 rounded" />
          </div>
        </div>
        <div className="border border-[var(--color-border)] rounded-xl p-5">
          <Skeleton className="h-3 w-20 mb-3" />
          <Skeleton className="h-7 w-32 mb-4" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
      <div className="border border-[var(--color-border)] rounded-xl">
        <div className="px-5 py-3 border-b border-[var(--color-border)]">
          <Skeleton className="h-4 w-32" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b border-[var(--color-border)] last:border-0">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="text-right space-y-1.5">
              <Skeleton className="h-3.5 w-20 ml-auto" />
              <Skeleton className="h-4 w-14 ml-auto rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
