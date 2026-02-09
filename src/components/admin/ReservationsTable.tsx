'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, Calendar } from 'lucide-react'

type Reservation = {
  id: string
  name: string
  email: string
  phone: string
  date: Date
  time: string
  guests: number
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REJECTED'
  notes: string | null
}

export default function ReservationsTable({ reservations }: { reservations: Reservation[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleStatusUpdate = async (id: string, status: 'CONFIRMED' | 'CANCELLED' | 'REJECTED') => {
    setLoading(id)
    try {
      await fetch(`/api/admin/reservations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      router.refresh()
    } catch (error) {
      console.error('Failed to update status', error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-stone-950 text-stone-400">
          <tr>
            <th className="p-4 font-medium">Guest</th>
            <th className="p-4 font-medium">Date & Time</th>
            <th className="p-4 font-medium">Guests</th>
            <th className="p-4 font-medium">Status</th>
            <th className="p-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-800">
          {reservations.map((res) => (
            <tr key={res.id} className="hover:bg-stone-800/50 transition-colors">
              <td className="p-4">
                <div className="font-bold text-stone-200">{res.name}</div>
                <div className="text-sm text-stone-500">{res.email}</div>
                <div className="text-sm text-stone-500">{res.phone}</div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2 text-stone-200">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  {new Date(res.date).toLocaleDateString()}
                </div>
                <div className="text-sm text-stone-500 pl-6">{res.time}</div>
              </td>
              <td className="p-4 text-stone-300">{res.guests} people</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded text-xs font-bold 
                  ${res.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-500' : 
                    (res.status === 'CANCELLED' || res.status === 'REJECTED') ? 'bg-red-500/20 text-red-500' : 
                    'bg-yellow-500/20 text-yellow-500'}`}>
                  {res.status}
                </span>
              </td>
              <td className="p-4 text-right">
                {res.status === 'PENDING' && (
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleStatusUpdate(res.id, 'CONFIRMED')}
                      disabled={loading === res.id}
                      className="p-2 text-stone-400 hover:text-green-500 hover:bg-green-500/10 rounded-lg transition-colors"
                      title="Confirm"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(res.id, 'REJECTED')}
                      disabled={loading === res.id}
                      className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Reject"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
          {reservations.length === 0 && (
            <tr>
              <td colSpan={5} className="p-8 text-center text-stone-500">
                No reservations found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
