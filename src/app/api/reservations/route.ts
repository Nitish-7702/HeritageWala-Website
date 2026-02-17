import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { sendReservationConfirmation } from '@/lib/email'
import { logger } from '@/lib/logger'
import { checkRateLimit } from '@/lib/ratelimit'
import { validateCsrf } from '@/lib/csrf'
import { sanitizeInput } from '@/lib/sanitize'

const reservationSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(10),
  email: z.string().email(),
  guests: z.number().min(1),
  date: z.string(),
  time: z.string(),
  notes: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const rateLimited = await checkRateLimit(req, 'reservations', {
    limit: 3,
    window: 60_000,
  })
  if (rateLimited) return rateLimited

  const csrfInvalid = validateCsrf(req)
  if (csrfInvalid) return csrfInvalid

  try {
    const body = await req.json()
    const validated = reservationSchema.parse(body)
    const sanitized = sanitizeInput(validated)

    const settings =
      (await prisma.settings.findFirst()) ?? {
        maxGuestsPerSlot: 40,
        maxGuestsPerReservation: 10,
      }

    if (sanitized.guests > settings.maxGuestsPerReservation) {
      return NextResponse.json(
        { error: 'Too many guests for a single reservation' },
        { status: 400 }
      )
    }

    const aggregate = await prisma.reservation.aggregate({
      _sum: { guests: true },
      where: {
        date: new Date(sanitized.date),
        time: sanitized.time,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    })

    const currentGuests = aggregate._sum.guests ?? 0

    if (currentGuests + sanitized.guests > settings.maxGuestsPerSlot) {
      return NextResponse.json(
        { error: 'Slot full' },
        { status: 400 }
      )
    }

    const reservation = await prisma.reservation.create({
      data: {
        ...sanitized,
        date: new Date(sanitized.date),
        status: 'PENDING',
      },
    })

    sendReservationConfirmation(reservation).catch((error) => {
      logger.error('Reservation confirmation email failed', {
        error,
        reservationId: reservation.id,
      })
    })

    return NextResponse.json({ success: true, id: reservation.id })
  } catch (error) {
    logger.error('Failed to book reservation', { error })
    return NextResponse.json(
      { error: 'Failed to book' },
      { status: 500 }
    )
  }
}
