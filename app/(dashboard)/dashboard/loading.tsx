function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-[var(--color-border)] rounded-md ${className ?? ''}`}
    />
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-[var(--color-border)] rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-3 w-20 rounded" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-7 w-28 mb-2 rounded" />
      <Skeleton className="h-3 w-24 rounded" />
    </div>
  )
}

function SkeletonServiceCard() {
  return (
    <div className="bg-white border border-[var(--color-border)] rounded-xl p-5">
      <Skeleton className="h-10 w-10 rounded-xl mb-3" />
      <Skeleton className="h-4 w-24 mb-2 rounded" />
      <Skeleton className="h-3 w-20 rounded" />
      <Skeleton className="h-3 w-16 mt-3 rounded" />
    </div>
  )
}

function SkeletonActivityRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-3.5">
      <Skeleton className="h-9 w-9 rounded-lg flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-1.5">
        <Skeleton className="h-3.5 w-40 rounded" />
        <Skeleton className="h-3 w-24 rounded" />
      </div>
      <div className="text-right flex-shrink-0 space-y-1.5">
        <Skeleton className="h-3.5 w-20 ml-auto rounded" />
        <Skeleton className="h-4 w-14 ml-auto rounded-full" />
      </div>
    </div>
  )
}

export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Main Section — Services + Virtual Card */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Services */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-3 w-16 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonServiceCard key={i} />
            ))}
          </div>
        </div>

        {/* Virtual Card */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-4 w-28 rounded" />
          </div>
          <div className="rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-green-600/40 via-emerald-600/40 to-teal-700/40 p-6 pb-8 relative">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-4 w-20 rounded" />
                </div>
                <div className="flex gap-1">
                  <Skeleton className="h-4 w-6 rounded-sm" />
                  <Skeleton className="h-4 w-6 rounded-sm" />
                </div>
              </div>
              <Skeleton className="h-3 w-24 mb-2 rounded" />
              <Skeleton className="h-8 w-36 mb-6 rounded" />
              <Skeleton className="h-4 w-48 mb-4 rounded" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-16 rounded" />
                <Skeleton className="h-3 w-10 rounded" />
              </div>
            </div>
            <div className="bg-white border border-[var(--color-border)] border-t-0 rounded-b-2xl p-4">
              <div className="flex gap-3">
                <Skeleton className="h-10 flex-1 rounded-lg" />
                <Skeleton className="h-10 flex-1 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-3 w-16 rounded" />
        </div>
        <div className="bg-white border border-[var(--color-border)] rounded-xl divide-y divide-[var(--color-border)]">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonActivityRow key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
