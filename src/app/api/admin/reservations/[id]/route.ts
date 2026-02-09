import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { sendReservationConfirmation } from '@/lib/email'

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

    // Send status update email
    sendReservationConfirmation(reservation).catch(console.error)

    return NextResponse.json(reservation)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update reservation' },
      { status: 500 }
    )
  }
}
