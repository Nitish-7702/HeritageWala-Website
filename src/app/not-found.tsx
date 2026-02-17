import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card-premium max-w-md w-full p-8 rounded-2xl border border-white/10 text-center">
        <h1 className="text-4xl font-serif font-bold text-white mb-3">
          Page not found
        </h1>
        <p className="text-stone-400 mb-6">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-saffron-500 text-black font-bold rounded-lg hover:bg-saffron-600 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}

