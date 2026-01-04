import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { getAllUsers } from '@/app/actions/admin'
import { formatCurrency, formatDate } from '@/app/lib/utils'

export default async function UsersPage() {
  const { users } = await getAllUsers()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Users</h1>
        <p className="text-gray-600">Manage user accounts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Wallet Balance</th>
                  <th className="text-left py-3 px-4">Referred By</th>
                  <th className="text-left py-3 px-4">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4 font-semibold">
                      {formatCurrency(user.wallet_balance)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {user.referred_by ? 'Yes' : 'No'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {formatDate(user.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No users yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
