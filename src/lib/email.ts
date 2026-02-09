export async function sendEmail(to: string, subject: string, body: string) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  console.log('📧 [MOCK EMAIL SERVICE] --------------------------------')
  console.log(`To: ${to}`)
  console.log(`Subject: ${subject}`)
  console.log(`Body:\n${body}`)
  console.log('--------------------------------------------------------')
  return true
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
