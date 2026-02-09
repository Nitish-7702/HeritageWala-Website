'use client'

import { motion } from 'framer-motion'
import { ChefHat, Award, Leaf, Heart } from 'lucide-react'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-saffron-500 mb-6 drop-shadow-lg font-serif">Our Heritage</h1>
          <p className="text-xl text-stone-200 max-w-3xl mx-auto font-light leading-relaxed">
            Heritage Wala brings the authentic flavors of royal Indian kitchens to your plate. 
            A journey through time, taste, and tradition.
          </p>
        </motion.div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="aspect-video relative rounded-2xl overflow-hidden group shadow-2xl border border-white/10">
              <Image 
                src="https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?q=80&w=800&auto=format&fit=crop" 
                alt="Chef Cooking" 
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
              <div className="absolute bottom-6 left-6 z-20">
                <div className="flex items-center gap-3 text-saffron-400">
                  <ChefHat className="w-8 h-8" />
                  <span className="text-lg font-bold tracking-wider">MASTER CHEFS</span>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="glass-card-premium p-8 rounded-2xl border border-white/10">
                <h2 className="text-3xl font-bold text-white mb-4 font-serif">The Beginning</h2>
                <p className="text-stone-300 leading-relaxed mb-4">
                Founded in 2024, Heritage Wala started with a simple vision: to preserve the lost recipes of Indian culinary heritage. 
                Our chefs traveled across the subcontinent, learning from home cooks and royal kitchens alike, to curate a menu that tells a story.
                </p>
                <p className="text-stone-300 leading-relaxed">
                We believe that food is not just sustenance, but an emotion. Every spice is hand-picked, every gravy slow-cooked to perfection, 
                ensuring that you experience the true essence of Indian hospitality.
                </p>
            </div>
          </motion.div>
        </div>

        {/* Values Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            { icon: Award, title: 'Premium Quality', desc: 'We use only the finest ingredients, sourced locally and globally.' },
            { icon: Leaf, title: 'Fresh & Organic', desc: 'Farm-fresh vegetables and authentic spices for the best taste.' },
            { icon: Heart, title: 'Made with Love', desc: 'Every dish is crafted with passion and attention to detail.' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card-premium p-8 rounded-2xl border border-white/10 text-center hover:border-saffron-500/50 transition-all group hover:-translate-y-2"
            >
              <div className="w-16 h-16 mx-auto bg-saffron-500/10 rounded-full flex items-center justify-center text-saffron-500 mb-6 group-hover:bg-saffron-500/20 transition-colors">
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-serif">{item.title}</h3>
              <p className="text-stone-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
