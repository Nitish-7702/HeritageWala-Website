import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { stripe } from '@/lib/stripe'
import { checkRateLimit } from '@/lib/ratelimit'
import { validateCsrf } from '@/lib/csrf'
import { logger } from '@/lib/logger'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmation } from '@/lib/email'

const sessionSchema = z.object({
  sessionId: z.string().min(1),
})

const orderSchema = z.object({
  customerName: z.string().min(1),
  customerPhone: z.string().min(10),
  customerEmail: z.string().email().optional().or(z.literal('')),
  items: z.array(
    z.object({
      menuItemId: z.string(),
      quantity: z.number().min(1),
      price: z.number(),
      name: z.string(),
    })
  ),
})

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: 'Payments are not configured' },
      { status: 503 }
    )
  }

  const rateLimited = await checkRateLimit(req, 'stripe-complete', {
    limit: 10,
    window: 60_000,
  })
  if (rateLimited) return rateLimited

  const csrfInvalid = validateCsrf(req)
  if (csrfInvalid) return csrfInvalid

  try {
    const body = await req.json()
    const { sessionId } = sessionSchema.parse(body)

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      )
    }

    const rawOrder = session.metadata?.order
    if (!rawOrder) {
      return NextResponse.json(
        { error: 'Order metadata missing' },
        { status: 400 }
      )
    }

    const parsedOrder = orderSchema.parse(JSON.parse(rawOrder))

    const total = parsedOrder.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

    const order = await prisma.order.create({
      data: {
        customerName: parsedOrder.customerName,
        customerPhone: parsedOrder.customerPhone,
        customerEmail: parsedOrder.customerEmail || null,
        total,
        status: 'COMPLETED',
        items: {
          create: parsedOrder.items.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
          })),
        },
      },
    })

    sendOrderConfirmation(order, parsedOrder.items).catch((error) => {
      logger.error('Order confirmation email failed (Stripe)', {
        error,
        orderId: order.id,
      })
    })

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error) {
    logger.error('Stripe completion failed', { error })
    return NextResponse.json(
      { error: 'Failed to complete order' },
      { status: 500 }
    )
  }
}

