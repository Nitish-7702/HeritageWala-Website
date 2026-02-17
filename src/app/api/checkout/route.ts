import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { stripe } from '@/lib/stripe'
import { env } from '@/lib/env'
import { checkRateLimit } from '@/lib/ratelimit'
import { validateCsrf } from '@/lib/csrf'
import { sanitizeInput } from '@/lib/sanitize'
import { logger } from '@/lib/logger'

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
  if (!stripe || !env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    return NextResponse.json(
      { error: 'Payments are not configured' },
      { status: 503 }
    )
  }

  const rateLimited = await checkRateLimit(req, 'checkout', {
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

    const lineItems = sanitized.items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: 'gbp',
        unit_amount: Math.round(item.price * 100),
        product_data: {
          name: item.name,
        },
      },
    }))

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: `${env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/checkout/cancel`,
      metadata: {
        order: JSON.stringify(sanitized),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    logger.error('Stripe checkout creation failed', { error })
    return NextResponse.json(
      { error: 'Failed to start checkout' },
      { status: 500 }
    )
  }
}

