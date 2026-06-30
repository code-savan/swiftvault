import { Card, CardContent } from '@/app/components/ui/card'
import { getAllUsers } from '@/app/actions/admin'
import { formatCurrency, formatDate } from '@/app/lib/utils'

export default async function UsersPage() {
  const { users } = await getAllUsers()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">All Users</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Manage user accounts</p>
      </div>

      <Card className="border border-[var(--color-border)]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                  <th className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-4 py-3">Email</th>
                  <th className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-4 py-3">Wallet Balance</th>
                  <th className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-4 py-3">Referred By</th>
                  <th className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-4 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {users.map((user: any) => (
                  <tr key={user.id} className="hover:bg-[var(--color-bg)] transition-colors">
                    <td className="px-4 py-3 text-sm text-[var(--color-text-primary)]">{user.email}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-[var(--color-text-primary)]">
                      {formatCurrency(user.wallet_balance)}
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                      {user.referred_by ? 'Yes' : 'No'}
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                      {formatDate(user.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="text-center py-8 text-[var(--color-text-muted)]">
                No users yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
