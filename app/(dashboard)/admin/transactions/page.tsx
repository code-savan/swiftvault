import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { getAllTransactions } from '@/app/actions/admin'
import { formatCurrency, formatDate } from '@/app/lib/utils'

export default async function TransactionsPage() {
  const { transactions } = await getAllTransactions()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Transactions</h1>
        <p className="text-gray-600">View all platform transactions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">User</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Description</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn: any) => (
                  <tr key={txn.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{txn.users?.email || 'Unknown'}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          txn.type === 'topup'
                            ? 'success'
                            : txn.type === 'commission'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {txn.type}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      {formatCurrency(Math.abs(txn.amount))}
                    </td>
                    <td className="py-3 px-4 text-sm">{txn.description}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          txn.status === 'completed'
                            ? 'success'
                            : txn.status === 'failed'
                            ? 'destructive'
                            : 'warning'
                        }
                      >
                        {txn.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {formatDate(txn.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {transactions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No transactions yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
