'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Utensils, Users, Calendar, Sparkles } from 'lucide-react'

export default function CateringPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 relative">
      <div className="relative z-10">
        {/* Hero */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-saffron-500 mb-6 drop-shadow-lg font-serif">Royal Catering</h1>
            <p className="text-xl text-stone-200 max-w-3xl mx-auto mb-8 font-light">
              Bring the grandeur of Heritage Wala to your special events. 
              From intimate gatherings to grand weddings, we serve memories.
            </p>
            <Link 
              href="/contact"
              className="inline-block bg-saffron-500 hover:bg-saffron-600 text-black font-bold px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-saffron-500/30 hover:scale-105 active:scale-95"
            >
              Enquire Now
            </Link>
          </motion.div>
        </div>

        {/* Services Grid */}
        <div className="py-20 border-y border-white/5 backdrop-blur-sm bg-black/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Users, title: 'Weddings', desc: 'Grand buffets and live counters for your big day.' },
                { icon: Utensils, title: 'Corporate Events', desc: 'Professional catering for meetings and galas.' },
                { icon: Calendar, title: 'Private Parties', desc: 'Customized menus for birthdays and anniversaries.' },
                { icon: Sparkles, title: 'Live Stations', desc: 'Interactive chaat, tandoor, and dessert counters.' },
              ].map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card-premium text-center p-6 rounded-2xl border border-white/10 hover:border-saffron-500/50 transition-all group hover:-translate-y-2"
                >
                  <div className="w-16 h-16 mx-auto bg-white/5 rounded-2xl flex items-center justify-center text-saffron-500 mb-6 rotate-3 group-hover:rotate-6 group-hover:bg-saffron-500/20 transition-all">
                    <service.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 font-serif">{service.title}</h3>
                  <p className="text-stone-400 group-hover:text-stone-200 transition-colors">{service.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl font-bold text-center text-white mb-16 font-serif">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-saffron-500/30 to-transparent -z-10"></div>
            
            {[
              { step: '01', title: 'Consultation', desc: 'Discuss your requirements, guest count, and preferences with our experts.' },
              { step: '02', title: 'Tasting', desc: 'Sample our signature dishes and finalize your customized menu.' },
              { step: '03', title: 'Execution', desc: 'Relax while our team handles everything from setup to service.' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="glass-card-premium p-8 text-center rounded-2xl border border-white/10 hover:border-saffron-500/30 transition-all"
              >
                <div className="w-24 h-24 mx-auto bg-black/40 border-4 border-saffron-500/20 rounded-full flex items-center justify-center text-2xl font-bold text-saffron-500 mb-6 shadow-lg shadow-saffron-500/10 backdrop-blur-md">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-serif">{item.title}</h3>
                <p className="text-stone-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
