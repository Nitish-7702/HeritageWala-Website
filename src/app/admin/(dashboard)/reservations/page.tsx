import { prisma } from '@/lib/prisma'
import ReservationsTable from '@/components/admin/ReservationsTable'

export default async function AdminReservationsPage() {
  const reservations = await prisma.reservation.findMany({
    orderBy: { date: 'asc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-stone-100">Reservations</h1>
      </div>
      <ReservationsTable reservations={reservations} />
    </div>
  )
}
