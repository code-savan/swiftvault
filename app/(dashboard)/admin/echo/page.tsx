import { Card, CardContent } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { getAllEchoNumbers } from '@/app/actions/admin'
import { formatCurrency, formatDate } from '@/app/lib/utils'

export default async function EchoNumbersPage() {
  const { numbers } = await getAllEchoNumbers()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">Echo Numbers</h1>
        <p className="text-sm text-[var(--color-text-muted)]">All active persistent numbers</p>
      </div>

      <Card className="border border-[var(--color-border)]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                  <th className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-4 py-3">Phone Number</th>
                  <th className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-4 py-3">User</th>
                  <th className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-4 py-3">Country</th>
                  <th className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-4 py-3">Monthly Cost</th>
                  <th className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-4 py-3">Expiry</th>
                  <th className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-4 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-4 py-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {numbers.map((number: any) => {
                  const isExpired = new Date(number.expiry_date) < new Date()
                  const isExpiring = !isExpired && new Date(number.expiry_date) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

                  return (
                    <tr key={number.id} className="hover:bg-[var(--color-bg)] transition-colors">
                      <td className="px-4 py-3 font-mono font-semibold text-[var(--color-text-primary)]">
                        {number.phone_number}
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--color-text-primary)]">{number.users?.email || 'Unknown'}</td>
                      <td className="px-4 py-3 text-sm text-[var(--color-text-primary)]">{number.country}</td>
                      <td className="px-4 py-3 text-sm text-[var(--color-text-primary)]">
                        {formatCurrency(number.monthly_cost)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={isExpiring ? 'text-amber-600 font-medium' : 'text-[var(--color-text-secondary)]'}>
                          {formatDate(number.expiry_date)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            isExpired
                              ? 'destructive'
                              : number.active
                              ? 'success'
                              : 'secondary'
                          }
                          className="text-xs"
                        >
                          {isExpired ? 'Expired' : number.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                        {formatDate(number.created_at)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {numbers.length === 0 && (
              <div className="text-center py-8 text-[var(--color-text-muted)]">
                No Echo numbers yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
