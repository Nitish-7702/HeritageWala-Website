import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card-premium p-8 rounded-2xl max-w-md w-full text-center border border-white/10">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
          <CheckCircle className="text-green-500" size={32} />
        </div>
        <h2 className="text-2xl font-serif font-bold text-white mb-2">
          Payment Successful
        </h2>
        <p className="text-stone-400 mb-6">
          Thank you for your order. You will receive a confirmation email shortly.
        </p>
        <Link
          href="/"
          className="w-full inline-flex justify-center py-3 bg-saffron-500 text-black rounded-lg font-bold hover:bg-saffron-600 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
