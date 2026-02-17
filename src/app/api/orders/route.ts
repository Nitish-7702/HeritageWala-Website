import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { sendOrderConfirmation } from '@/lib/email'
import { logger } from '@/lib/logger'
import { checkRateLimit } from '@/lib/ratelimit'
import { validateCsrf } from '@/lib/csrf'
import { sanitizeInput } from '@/lib/sanitize'

const orderSchema = z.object({
  customerName: z.string().min(1),
  customerPhone: z.string().min(10),
  customerEmail: z.string().email().optional().or(z.literal('')),
  items: z.array(z.object({
    menuItemId: z.string(),
    quantity: z.number().min(1),
    price: z.number(),
    name: z.string()
  }))
})

export async function POST(req: NextRequest) {
  const rateLimited = await checkRateLimit(req, 'orders', {
    limit: 5,
    window: 60_000,
  })
  if (rateLimited) return rateLimited

  const csrfInvalid = validateCsrf(req)
  if (csrfInvalid) return csrfInvalid

  try {
    const body = await req.json()
    const validated = orderSchema.parse(body)
    const sanitized = sanitizeInput(validated)

    const total = sanitized.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

    const order = await prisma.order.create({
      data: {
        customerName: sanitized.customerName,
        customerPhone: sanitized.customerPhone,
        customerEmail: sanitized.customerEmail || null,
        total,
        status: 'PENDING',
        items: {
          create: sanitized.items.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
          })),
        },
      },
    })

    sendOrderConfirmation(order, sanitized.items).catch((error) => {
      logger.error('Order confirmation email failed', {
        error,
        orderId: order.id,
      })
    })

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error) {
    logger.error('Order error', { error })
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
