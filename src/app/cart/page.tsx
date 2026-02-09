'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, cartTotal } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-16 flex flex-col items-center justify-center relative">
        <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
            <ShoppingBag size={48} className="text-stone-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4 font-serif">Your Cart is Empty</h1>
            <p className="text-stone-400 mb-8 text-center max-w-md">
            Looks like you haven't added anything to your cart yet. 
            Explore our menu to find your favorite dishes.
            </p>
            <Link
            href="/menu"
            className="bg-saffron-500 hover:bg-saffron-600 text-black font-bold px-8 py-3 rounded-full transition-all shadow-lg hover:shadow-saffron-500/20"
            >
            Browse Menu
            </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-saffron-500 mb-8 font-serif drop-shadow-lg">Your Cart</h1>
          
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div 
                  key={item.menuItemId} 
                  className="glass-card-premium rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start border border-white/10 hover:border-saffron-500/30 transition-all"
                >
                  <div className="w-24 h-24 rounded-xl bg-white/5 shrink-0 overflow-hidden relative border border-white/10">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-600">
                        <ShoppingBag size={24} />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-bold text-white mb-1 font-serif">{item.name}</h3>
                    <p className="text-stone-400 mb-4">£{item.price} per item</p>
                    
                    <div className="flex items-center justify-center sm:justify-start gap-4">
                      <div className="flex items-center gap-4 bg-white/5 rounded-full px-4 py-2 border border-white/10">
                        <button
                          onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                          className="text-stone-400 hover:text-white transition-colors"
                        >
                          <Minus size={18} />
                        </button>
                        <span className="font-medium text-lg w-6 text-center text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                          className="text-stone-400 hover:text-white transition-colors"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.menuItemId)}
                        className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-500/10 rounded-full"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xl font-bold text-saffron-500">£{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="glass-card-premium rounded-2xl p-6 sticky top-24 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-6 font-serif">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-stone-400">
                    <span>Subtotal</span>
                    <span>£{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>Taxes (5%)</span>
                    <span>£{Math.round(cartTotal * 0.05)}</span>
                  </div>
                  <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-white">Total</span>
                    <span className="text-2xl font-bold text-saffron-500">£{cartTotal + Math.round(cartTotal * 0.05)}</span>
                  </div>
                </div>
                
                <Link
                  href="/checkout"
                  className="w-full bg-saffron-500 hover:bg-saffron-600 text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-saffron-500/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Proceed to Checkout <ArrowRight size={20} />
                </Link>
                
                <p className="text-xs text-stone-500 text-center mt-4">
                  Secure checkout powered by Heritage Wala
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
