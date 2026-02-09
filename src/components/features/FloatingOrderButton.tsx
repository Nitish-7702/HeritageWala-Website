'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useState, useEffect } from 'react'

export default function FloatingOrderButton() {
  const { cartCount } = useCart()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling down a bit
      if (window.scrollY > 100) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 md:hidden w-full px-4 pointer-events-none"
        >
          <Link href="/menu" className="pointer-events-auto block">
            <div className="bg-saffron text-white px-6 py-4 rounded-full shadow-lg shadow-saffron/20 flex items-center justify-between backdrop-blur-md bg-opacity-90" style={{ backgroundColor: '#FF9933' }}>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <ShoppingBag size={20} />
                </div>
                <span className="font-bold">Order Food Online</span>
              </div>
              {cartCount > 0 && (
                <div className="bg-white text-saffron font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ color: '#FF9933' }}>
                  {cartCount}
                </div>
              )}
            </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
