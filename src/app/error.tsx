'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { logger } from '@/lib/logger'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    logger.error('Global application error', { error })
  }, [error])

  return (
    <html>
      <body className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
        <div className="glass-card-premium max-w-md w-full p-8 rounded-2xl border border-red-500/20 text-center">
          <h2 className="text-2xl font-serif font-bold text-white mb-3">
            Something went wrong
          </h2>
          <p className="text-stone-400 mb-6">
            An unexpected error occurred. Our team has been notified.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => reset()}
              className="w-full py-3 bg-saffron-500 text-black rounded-lg font-bold hover:bg-saffron-600 transition-colors"
            >
              Try again
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full py-3 bg-stone-800 text-white rounded-lg font-bold hover:bg-stone-700 transition-colors"
            >
              Go home
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}

