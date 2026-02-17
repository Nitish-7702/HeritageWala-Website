import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { sendReservationConfirmation } from '@/lib/email'
import { logger } from '@/lib/logger'

const updateSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'REJECTED']),
})

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { status } = updateSchema.parse(body)

    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status },
    })

    sendReservationConfirmation(reservation).catch((error) => {
      logger.error('Reservation status email failed', { error, reservationId: reservation.id })
    })

    return NextResponse.json(reservation)
  } catch (error) {
    logger.error('Failed to update reservation', { error })
    return NextResponse.json(
      { error: 'Failed to update reservation' },
      { status: 500 }
    )
  }
}
