import { prisma } from '@/lib/prisma'
import { DollarSign, ShoppingBag, Calendar, Utensils } from 'lucide-react'

async function getStats() {
  const [
    orderCount,
    reservationCount,
    menuItemCount,
    revenueResult,
    recentOrders,
    recentReservations
  ] = await Promise.all([
    prisma.order.count(),
    prisma.reservation.count({ where: { status: 'PENDING' } }),
    prisma.menuItem.count(),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: 'COMPLETED' }
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, customerName: true, total: true, status: true }
    }),
    prisma.reservation.findMany({
      take: 5,
      where: { date: { gte: new Date() } },
      orderBy: { date: 'asc' },
      select: { id: true, name: true, date: true, time: true, guests: true }
    })
  ])

  return {
    orderCount,
    reservationCount,
    menuItemCount,
    revenue: revenueResult._sum.total || 0,
    recentOrders,
    recentReservations
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-stone-100">Dashboard</h1>
        <p className="text-stone-400 mt-2">Overview of your restaurant's performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Orders"
          value={stats.orderCount.toString()}
          icon={ShoppingBag}
        />
        <StatsCard
          title="Total Revenue"
          value={`£${stats.revenue.toLocaleString()}`}
          icon={DollarSign}
        />
        <StatsCard
          title="Pending Reservations"
          value={stats.reservationCount.toString()}
          icon={Calendar}
          alert={stats.reservationCount > 0}
        />
        <StatsCard
          title="Menu Items"
          value={stats.menuItemCount.toString()}
          icon={Utensils}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-stone-100 mb-4">Recent Orders</h2>
          {stats.recentOrders.length > 0 ? (
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex justify-between items-center p-3 bg-stone-950/50 rounded-lg">
                  <div>
                    <p className="text-stone-200 font-medium">{order.customerName}</p>
                    <p className="text-xs text-stone-500">#{order.id.slice(-6)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-amber-500 font-medium">£{order.total.toString()}</p>
                    <p className="text-xs text-stone-400">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-stone-400 text-center py-8">
              No recent orders
            </div>
          )}
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-stone-100 mb-4">Upcoming Reservations</h2>
          {stats.recentReservations.length > 0 ? (
            <div className="space-y-4">
              {stats.recentReservations.map((res) => (
                <div key={res.id} className="flex justify-between items-center p-3 bg-stone-950/50 rounded-lg">
                  <div>
                    <p className="text-stone-200 font-medium">{res.name}</p>
                    <p className="text-xs text-stone-500">{res.guests} Guests</p>
                  </div>
                  <div className="text-right">
                    <p className="text-stone-200 font-medium">{res.time}</p>
                    <p className="text-xs text-stone-400">{new Date(res.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-stone-400 text-center py-8">
              No upcoming reservations
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatsCard({ title, value, icon: Icon, trend, alert }: any) {
  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-stone-400 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-stone-100 mt-2">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${alert ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {trend && (
        <p className="text-green-500 text-xs font-medium mt-4">
          {trend}
        </p>
      )}
    </div>
  )
}
