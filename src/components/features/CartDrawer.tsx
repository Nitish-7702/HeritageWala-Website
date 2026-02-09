'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeFromCart, cartTotal } = useCart()

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-charcoal border-l border-white/10 shadow-2xl flex flex-col"
            style={{ backgroundColor: '#1A1A1A' }} // Fallback for bg-charcoal
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-serif font-bold text-white">Your Cart</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                    <ShoppingBag size={32} className="text-gray-500" />
                  </div>
                  <p className="text-gray-400">Your cart is empty.</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-2 bg-saffron text-white rounded-full font-medium hover:bg-opacity-90 transition-colors"
                    style={{ backgroundColor: '#FF9933' }}
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.menuItemId} className="flex gap-4">
                    {/* Image placeholder */}
                    <div className="w-20 h-20 rounded-lg bg-white/10 shrink-0 overflow-hidden relative">
                       {/* In real app, use next/image here */}
                       <div className="w-full h-full bg-gray-700" />
                       {item.image && (
                           // eslint-disable-next-line @next/next/no-img-element
                           <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                       )}
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-white">{item.name}</h3>
                        <p className="font-medium text-saffron" style={{ color: '#FF9933' }}>£{item.price * item.quantity}</p>
                      </div>
                      <p className="text-xs text-gray-500">£{item.price} each</p>
                      
                      <div className="flex items-center gap-3 pt-2">
                        <div className="flex items-center gap-3 bg-white/5 rounded-full px-3 py-1">
                          <button
                            onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.menuItemId)}
                          className="text-gray-500 hover:text-red-400 transition-colors ml-auto"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-white/5">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400">Total</span>
                  <span className="text-2xl font-serif font-bold text-white">£{cartTotal}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="block w-full py-3 bg-saffron text-white text-center font-bold rounded-lg hover:bg-opacity-90 transition-all active:scale-[0.98]"
                  style={{ backgroundColor: '#FF9933' }}
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
