'use client'

import { useRouter } from 'next/navigation'

export default function CheckoutCancelPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card-premium p-8 rounded-2xl max-w-md w-full text-center border border-white/10">
        <h2 className="text-2xl font-serif font-bold text-white mb-3">Payment Cancelled</h2>
        <p className="text-stone-400 mb-6">
          Your payment was cancelled. You can review your cart and try again.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => router.push('/checkout')}
            className="w-full py-3 bg-saffron-500 text-black rounded-lg font-bold hover:bg-saffron-600 transition-colors"
          >
            Return to Checkout
          </button>
          <button
            onClick={() => router.push('/menu')}
            className="w-full py-3 bg-stone-800 text-white rounded-lg font-bold hover:bg-stone-700 transition-colors"
          >
            Browse Menu
          </button>
        </div>
      </div>
    </div>
  )
}

