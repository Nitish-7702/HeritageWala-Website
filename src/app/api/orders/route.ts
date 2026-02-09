import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { sendOrderConfirmation } from '@/lib/email'

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

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validated = orderSchema.parse(body)

    const total = validated.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    const order = await prisma.order.create({
      data: {
        customerName: validated.customerName,
        customerPhone: validated.customerPhone,
        customerEmail: validated.customerEmail || null,
        total,
        status: 'PENDING',
        items: {
          create: validated.items.map(item => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price,
            name: item.name
          }))
        }
      }
    })

    // Send confirmation email (fire and forget)
    sendOrderConfirmation(order, validated.items).catch(console.error)

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error) {
    console.error('Order error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
