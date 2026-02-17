import { Resend } from 'resend'
import { env } from './env'
import { logger } from './logger'

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null

export async function sendEmail(to: string, subject: string, body: string) {
  if (!resend) {
    logger.warn('Email not sent, RESEND_API_KEY is not configured', { to, subject })
    return false
  }

  const maxAttempts = 3
  let attempt = 0

  while (attempt < maxAttempts) {
    attempt += 1
    try {
      const result = await resend.emails.send({
        from: 'Heritage Wala <no-reply@heritagewala.com>',
        to,
        subject,
        text: body,
      })

      if (result.error) {
        throw result.error
      }

      logger.info('Email sent', { to, subject, attempt })
      return true
    } catch (error) {
      logger.error('Failed to send email', { to, subject, attempt, error })
      if (attempt >= maxAttempts) {
        return false
      }
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt))
    }
  }

  return false
}

export async function sendOrderConfirmation(order: any, items: any[]) {
  if (!order.customerEmail) return

  const subject = `Order Confirmation #${order.id.slice(-6)} - Heritage Wala`
  const body = `Dear ${order.customerName},

Thank you for your order! We have received it and it is now ${order.status}.

Order Details:
ID: ${order.id}
Total: £${order.total}

Items:
${items.map((item: any) => `- ${item.quantity}x ${item.name} (£${item.price})`).join('\n')}

You can track your order status on our website.

Best regards,
Heritage Wala Team`

  return sendEmail(order.customerEmail, subject, body)
}

export async function sendReservationConfirmation(reservation: any) {
  if (!reservation.email) return

  const subject = `Reservation Received - Heritage Wala`
  const body = `Dear ${reservation.name},

We have received your reservation request.

Date: ${new Date(reservation.date).toDateString()}
Time: ${reservation.time}
Guests: ${reservation.guests}

Current Status: ${reservation.status}

We will review your request and confirm shortly.

Best regards,
Heritage Wala Team`

  return sendEmail(reservation.email, subject, body)
}
