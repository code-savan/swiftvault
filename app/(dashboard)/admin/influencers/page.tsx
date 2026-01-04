import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { getInfluencers } from '@/app/actions/admin'
import { formatCurrency, formatDate } from '@/app/lib/utils'

export default async function InfluencersPage() {
  const { influencers } = await getInfluencers()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Influencers & Referrals</h1>
        <p className="text-gray-600">Manage referral codes and commissions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Referral Codes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Code</th>
                  <th className="text-left py-3 px-4">Influencer</th>
                  <th className="text-left py-3 px-4">Discount</th>
                  <th className="text-left py-3 px-4">Commission</th>
                  <th className="text-left py-3 px-4">Sales</th>
                  <th className="text-left py-3 px-4">Total Commission</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Created</th>
                </tr>
              </thead>
              <tbody>
                {influencers.map((inf: any) => (
                  <tr key={inf.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono font-semibold">{inf.code}</td>
                    <td className="py-3 px-4">{inf.influencerEmail}</td>
                    <td className="py-3 px-4">{inf.discount_percent}%</td>
                    <td className="py-3 px-4">{inf.commission_percent}%</td>
                    <td className="py-3 px-4">{inf.salesCount}</td>
                    <td className="py-3 px-4 font-semibold">
                      {formatCurrency(inf.totalCommission)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={inf.active ? 'success' : 'secondary'}>
                        {inf.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {formatDate(inf.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {influencers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No referral codes yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
