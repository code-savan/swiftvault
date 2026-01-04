import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { getAdminStats } from '@/app/actions/admin'
import { formatCurrency } from '@/app/lib/utils'
import { DollarSign, Users, TrendingUp, Calendar } from 'lucide-react'

export default async function AdminOverviewPage() {
  const stats = await getAdminStats()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your platform performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Revenue
            </CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Users
            </CardTitle>
            <Users className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Today's Sales
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.todayRevenue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              This Week
            </CardTitle>
            <Calendar className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.weekRevenue)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/influencers"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold mb-1">Manage Influencers</h3>
              <p className="text-sm text-gray-600">View and manage referral codes</p>
            </a>
            <a
              href="/admin/users"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold mb-1">Manage Users</h3>
              <p className="text-sm text-gray-600">Search and manage user accounts</p>
            </a>
            <a
              href="/admin/referrals"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold mb-1">Create Referral Code</h3>
              <p className="text-sm text-gray-600">Generate new influencer codes</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
