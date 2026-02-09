'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: "Rahul Kapoor",
    role: "Food Blogger",
    image: "https://i.pravatar.cc/150?u=rahul",
    content: "The best Hyderabadi Biryani I've had outside Hyderabad. The flavors are authentic and the meat is tender. Absolutely recommended!",
    rating: 5
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Regular Customer",
    image: "https://i.pravatar.cc/150?u=priya",
    content: "Heritage Wala never disappoints. The ambiance is royal and the service is impeccable. Their Haleem is a must-try during the season.",
    rating: 5
  },
  {
    id: 3,
    name: "Amit Verma",
    role: "Foodie",
    image: "https://i.pravatar.cc/150?u=amit",
    content: "I ordered catering for my sister's wedding and everyone loved the food. The presentation and taste were top-notch.",
    rating: 4
  }
]

export default function TestimonialSlider() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length)
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  return (
    <div className="relative max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">Guest Love</h2>
        <div className="h-1 w-20 bg-saffron-500 mx-auto rounded-full"></div>
      </div>

      <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
        <Quote className="absolute top-8 left-8 text-saffron-500/20 w-16 h-16 rotate-180" />
        
        <div className="relative h-[350px] md:h-[250px] flex items-center justify-center overflow-hidden">
          <AnimatePresence mode='wait'>
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center w-full"
            >
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < testimonials[current].rating ? 'text-saffron-500 fill-saffron-500' : 'text-stone-600'}`}
                  />
                ))}
              </div>
              
              <p className="text-xl md:text-2xl text-stone-200 font-serif italic mb-8 relative z-10 leading-relaxed">
                "{testimonials[current].content}"
              </p>

              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-saffron-500">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={testimonials[current].image} alt={testimonials[current].name} className="w-full h-full object-cover" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-white font-serif tracking-wide">{testimonials[current].name}</h4>
                  <p className="text-sm text-stone-400">{testimonials[current].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-charcoal-900/80 text-white hover:bg-saffron-500 hover:text-black transition-all border border-white/10 hover:border-saffron-500"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-charcoal-900/80 text-white hover:bg-saffron-500 hover:text-black transition-all border border-white/10 hover:border-saffron-500"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}
