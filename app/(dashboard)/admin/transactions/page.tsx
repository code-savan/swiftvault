import { Card, CardContent } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { getAllTransactions } from '@/app/actions/admin'
import { formatCurrency, formatDate } from '@/app/lib/utils'

const statusVariant: Record<string, 'success' | 'destructive' | 'warning'> = {
  completed: 'success',
  failed: 'destructive',
  pending: 'warning',
}

const typeBadgeStyles: Record<string, string> = {
  topup: 'bg-[var(--color-accent-light)] text-[var(--color-accent)]',
  commission: 'bg-blue-50 text-blue-600',
  purchase: 'bg-amber-50 text-amber-600',
}

export default async function TransactionsPage() {
  const { transactions } = await getAllTransactions()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">All Transactions</h1>
        <p className="text-sm text-[var(--color-text-muted)]">View all platform transactions</p>
      </div>

      <Card className="border border-[var(--color-border)]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                  <th className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-4 py-3">User</th>
                  <th className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-4 py-3">Type</th>
                  <th className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-4 py-3">Amount</th>
                  <th className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-4 py-3">Description</th>
                  <th className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-4 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {transactions.map((txn: any) => (
                  <tr key={txn.id} className="hover:bg-[var(--color-bg)] transition-colors">
                    <td className="px-4 py-3 text-sm text-[var(--color-text-primary)]">{txn.users?.email || 'Unknown'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 text-xs font-medium ${typeBadgeStyles[txn.type] || 'bg-gray-100 text-gray-600'}`}>
                        {txn.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-[var(--color-text-primary)]">
                      {formatCurrency(Math.abs(txn.amount))}
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">{txn.description}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[txn.status] || 'warning'} className="text-xs">
                        {txn.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                      {formatDate(txn.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {transactions.length === 0 && (
              <div className="text-center py-8 text-[var(--color-text-muted)]">
                No transactions yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
