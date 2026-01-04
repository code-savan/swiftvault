import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { getAllEchoNumbers } from '@/app/actions/admin'
import { formatCurrency, formatDate } from '@/app/lib/utils'

export default async function EchoNumbersPage() {
  const { numbers } = await getAllEchoNumbers()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Echo Numbers</h1>
        <p className="text-gray-600">All active persistent numbers</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Echo Numbers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Phone Number</th>
                  <th className="text-left py-3 px-4">User</th>
                  <th className="text-left py-3 px-4">Country</th>
                  <th className="text-left py-3 px-4">Monthly Cost</th>
                  <th className="text-left py-3 px-4">Expiry</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Created</th>
                </tr>
              </thead>
              <tbody>
                {numbers.map((number: any) => {
                  const isExpired = new Date(number.expiry_date) < new Date()
                  const isExpiring = !isExpired && new Date(number.expiry_date) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

                  return (
                    <tr key={number.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono font-semibold">
                        {number.phone_number}
                      </td>
                      <td className="py-3 px-4 text-sm">{number.users?.email || 'Unknown'}</td>
                      <td className="py-3 px-4">{number.country}</td>
                      <td className="py-3 px-4">
                        {formatCurrency(number.monthly_cost)}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span className={isExpiring ? 'text-yellow-600 font-medium' : ''}>
                          {formatDate(number.expiry_date)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            isExpired
                              ? 'destructive'
                              : number.active
                              ? 'success'
                              : 'secondary'
                          }
                        >
                          {isExpired ? 'Expired' : number.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDate(number.created_at)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {numbers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No Echo numbers yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
