'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Loader2 } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import clsx from 'clsx'

interface MenuItem {
  id: string
  name: string
  description: string
  price: string
  isVeg: boolean
  spiceLevel: number
  image?: string
}

interface Category {
  id: string
  name: string
  items: MenuItem[]
}

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>('')
  const { addToCart } = useCart()
  const itemsGridRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch('/api/menu')
        if (res.ok) {
          const data = await res.json()
          setCategories(data)
          if (data.length > 0) setActiveCategory(data[0].id)
        }
      } catch (error) {
        console.error('Failed to load menu', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMenu()
  }, [])

  const handleCategoryClick = (id: string) => {
    setActiveCategory(id)
    if (itemsGridRef.current) {
      const headerOffset = 180 
      const elementPosition = itemsGridRef.current.getBoundingClientRect().top + window.scrollY
      const offsetPosition = elementPosition - headerOffset
      
      // Always scroll to position
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      menuItemId: item.id,
      name: item.name,
      price: Number(item.price),
      quantity: 1,
      image: item.image,
      isVeg: item.isVeg
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-saffron-500" size={48} />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="pt-32 pb-10 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
             <Image 
                src="https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?q=80&w=2000&auto=format&fit=crop"
                alt="Menu Header"
                fill
                className="object-cover opacity-30"
                priority
             />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900/90 via-charcoal-900/50 to-transparent pointer-events-none z-0" />
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 relative z-10 drop-shadow-lg">Our Menu</h1>
        <p className="text-stone-300 max-w-2xl mx-auto relative z-10 text-lg font-light">
          Explore our wide range of authentic Hyderabadi delicacies.
        </p>
      </div>

      <div className="container mx-auto px-4 mt-8">
        {/* Category Tabs */}
        <div className="sticky top-16 z-40 flex overflow-x-auto gap-4 py-4 mb-8 scrollbar-hide justify-center bg-black/10 backdrop-blur-md border-b border-white/10 rounded-xl">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={clsx(
                'px-8 py-3 rounded-full whitespace-nowrap font-bold tracking-wide transition-all backdrop-blur-md border',
                activeCategory === cat.id
                  ? 'bg-saffron-500 text-white border-saffron-500 shadow-[0_0_15px_rgba(255,153,51,0.5)]'
                  : 'bg-white/5 text-stone-400 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/30'
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div ref={itemsGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {categories
              .find((c) => c.id === activeCategory)
              ?.items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass-card rounded-xl overflow-hidden flex flex-col"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                >
                  <div className="h-48 bg-gray-800 relative group">
                     {/* Image */}
                     {item.image ? (
                        <Image 
                          src={item.image} 
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                     ) : (
                        <div className="absolute inset-0 bg-gray-700" />
                     )}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

                     {item.isVeg ? (
                         <div className="absolute top-4 left-4 w-6 h-6 border-2 border-green-500 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-sm z-10" title="Veg">
                             <div className="w-2 h-2 bg-green-500 rounded-full" />
                         </div>
                     ) : (
                         <div className="absolute top-4 left-4 w-6 h-6 border-2 border-red-500 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-sm z-10" title="Non-Veg">
                             <div className="w-2 h-2 bg-red-500 rounded-full" />
                         </div>
                     )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-white">{item.name}</h3>
                      <span className="font-bold text-saffron" style={{ color: '#FF9933' }}>£{item.price}</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">{item.description}</p>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="w-full py-2 bg-white/10 hover:bg-saffron hover:text-white text-saffron font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                      style={{ color: '#FF9933' }}
                    >
                      <Plus size={18} /> Add to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
