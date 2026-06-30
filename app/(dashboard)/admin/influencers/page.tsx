import { Card, CardContent } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { getInfluencers } from '@/app/actions/admin'
import { formatCurrency, formatDate } from '@/app/lib/utils'

export default async function InfluencersPage() {
  const { influencers } = await getInfluencers()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">Influencers & Referrals</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Manage referral codes and commissions</p>
      </div>

      <Card className="border border-[var(--color-border)]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                  <th className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-4 py-3">Code</th>
                  <th className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-4 py-3">Influencer</th>
                  <th className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-4 py-3">Discount</th>
                  <th className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-4 py-3">Commission</th>
                  <th className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-4 py-3">Sales</th>
                  <th className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-4 py-3">Total Commission</th>
                  <th className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-4 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-4 py-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {influencers.map((inf: any) => (
                  <tr key={inf.id} className="hover:bg-[var(--color-bg)] transition-colors">
                    <td className="px-4 py-3 font-mono font-semibold text-[var(--color-text-primary)]">{inf.code}</td>
                    <td className="px-4 py-3 text-sm text-[var(--color-text-primary)]">{inf.influencerEmail}</td>
                    <td className="px-4 py-3 text-sm text-[var(--color-text-primary)]">{inf.discount_percent}%</td>
                    <td className="px-4 py-3 text-sm text-[var(--color-text-primary)]">{inf.commission_percent}%</td>
                    <td className="px-4 py-3 text-sm text-[var(--color-text-primary)]">{inf.salesCount}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-[var(--color-text-primary)]">
                      {formatCurrency(inf.totalCommission)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={inf.active ? 'success' : 'secondary'} className="text-xs">
                        {inf.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                      {formatDate(inf.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {influencers.length === 0 && (
              <div className="text-center py-8 text-[var(--color-text-muted)]">
                No referral codes yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
