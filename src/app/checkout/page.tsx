'use client'

import React, { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, CheckCircle } from 'lucide-react'
import { logger } from '@/lib/logger'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
})

type FormData = z.infer<typeof schema>

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null)
  const [csrfToken, setCsrfToken] = useState<string | null>(null)
  const hasStripe = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  useEffect(() => {
    async function fetchCsrf() {
      try {
        const res = await fetch('/api/csrf')
        if (res.ok) {
          const data = await res.json()
          setCsrfToken(data.token)
        }
      } catch {
      }
    }
    fetchCsrf()
  }, [])

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      if (hasStripe) {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': csrfToken || '',
          },
          body: JSON.stringify({
            customerName: data.name,
            customerPhone: data.phone,
            customerEmail: data.email,
            items: items.map((item) => ({
              menuItemId: item.menuItemId,
              quantity: item.quantity,
              price: item.price,
              name: item.name,
            })),
          }),
        })

        if (res.ok) {
          const result = await res.json()
          if (result.url) {
            window.location.href = result.url
            return
          }
        }

        alert('Failed to start payment')
      } else {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': csrfToken || '',
          },
          body: JSON.stringify({
            customerName: data.name,
            customerPhone: data.phone,
            customerEmail: data.email,
            items: items.map((item) => ({
              menuItemId: item.menuItemId,
              quantity: item.quantity,
              price: item.price,
              name: item.name,
            })),
          }),
        })

        if (res.ok) {
          const result = await res.json()
          setOrderSuccess(result.orderId)
          clearCart()
        } else {
          alert('Failed to place order')
        }
      }
    } catch (e) {
      logger.error('Error placing order', { error: e })
      alert('Error placing order')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <div className="glass-card-premium p-8 rounded-2xl max-w-md w-full text-center border border-white/10 relative z-10 shadow-2xl">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
            <CheckCircle className="text-green-500" size={32} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-white mb-2">Order Confirmed!</h2>
          <p className="text-stone-400 mb-6">
            Your order #{orderSuccess.slice(-6).toUpperCase()} has been placed successfully.
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 bg-saffron-500 text-black rounded-lg font-bold hover:bg-saffron-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 px-4 text-center relative">
        <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-4 font-serif">Your cart is empty</h2>
            <button
                onClick={() => router.push('/menu')}
                className="px-6 py-2 bg-saffron-500 text-black rounded-full font-medium hover:bg-saffron-600 transition-colors"
            >
                Browse Menu
            </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 relative">
      <div className="container mx-auto max-w-4xl relative z-10">
        <h1 className="text-3xl font-serif font-bold text-white mb-8 drop-shadow-lg">Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Form */}
          <div className="glass-card-premium p-6 rounded-2xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-6 font-serif">Contact Details</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm text-stone-400 mb-1 font-medium">Name</label>
                <input
                  {...register('name')}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 transition-all placeholder:text-stone-600"
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm text-stone-400 mb-1 font-medium">Phone</label>
                <input
                  {...register('phone')}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 transition-all placeholder:text-stone-600"
                  placeholder="+91 9876543210"
                />
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-sm text-stone-400 mb-1 font-medium">Email (Optional)</label>
                <input
                  {...register('email')}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 transition-all placeholder:text-stone-600"
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-saffron-500 text-black font-bold rounded-lg hover:bg-saffron-600 transition-all mt-4 flex items-center justify-center shadow-lg hover:shadow-saffron-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : `Pay £${cartTotal}`}
              </button>
            </form>
          </div>

          {/* Summary */}
          <div className="glass-card-premium p-6 rounded-2xl h-fit border border-white/10">
            <h2 className="text-xl font-bold text-white mb-6 font-serif">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.menuItemId} className="flex justify-between text-sm border-b border-white/5 pb-2 last:border-0">
                  <span className="text-stone-300">{item.quantity}x {item.name}</span>
                  <span className="text-white font-medium">£{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-4 flex justify-between items-center">
              <span className="text-lg font-bold text-white">Total</span>
              <span className="text-2xl font-bold text-saffron-500">£{cartTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
