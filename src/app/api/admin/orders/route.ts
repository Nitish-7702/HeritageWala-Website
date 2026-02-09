import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z, ZodError } from 'zod'
import { sendOrderConfirmation } from '@/lib/email'

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

const updateStatusSchema = z.object({
  orderId: z.string(),
  status: z.enum(['PENDING', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED']),
})

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { orderId, status } = updateStatusSchema.parse(body)

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { items: true },
    })

    // Send status update email
    sendOrderConfirmation(order, order.items).catch(console.error)

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error updating order:', error)
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}
