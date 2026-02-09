import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { sendReservationConfirmation } from '@/lib/email'

const reservationSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(10),
  email: z.string().email(),
  guests: z.number().min(1),
  date: z.string(), // ISO string
  time: z.string(),
  notes: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validated = reservationSchema.parse(body)

    // Basic conflict check (mock logic: if > 5 reservations at same time)
    // In real app, check capacity.
    const count = await prisma.reservation.count({
        where: {
            date: new Date(validated.date),
            time: validated.time
        }
    })

    if (count > 5) {
        return NextResponse.json({ error: 'Slot full' }, { status: 400 })
    }

    const reservation = await prisma.reservation.create({
      data: {
        ...validated,
        date: new Date(validated.date),
        status: 'PENDING'
      }
    })

    // Send confirmation email (fire and forget)
    sendReservationConfirmation(reservation).catch(console.error)

    return NextResponse.json({ success: true, id: reservation.id })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to book' }, { status: 500 })
  }
}
