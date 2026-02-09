'use client'

import { motion } from 'framer-motion'
import { MapPin, Clock, Phone } from 'lucide-react'
import Image from 'next/image'

const locations = [
  {
    id: 1,
    name: 'Heritage Wala - Coventry',
    address: 'Broadgate, Coventry, UK CV1 1NG',
    phone: '+44 24 7600 0000',
    hours: '11:00 AM - 11:00 PM',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'Heritage Wala - Birmingham',
    address: 'Bullring, Birmingham, UK B5 4BU',
    phone: '+44 121 600 0000',
    hours: '12:00 PM - 12:00 AM',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Heritage Wala - London',
    address: 'Soho, London, UK W1D 3QU',
    phone: '+44 20 7000 0000',
    hours: '11:30 AM - 11:30 PM',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800&auto=format&fit=crop'
  }
]

export default function LocationsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-saffron-500 mb-6 drop-shadow-lg font-serif">Our Locations</h1>
          <p className="text-xl text-stone-200 max-w-2xl mx-auto font-light">
            Experience royal dining at our signature outlets across India.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {locations.map((location, index) => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card-premium rounded-2xl overflow-hidden hover:border-saffron-500/50 transition-all group hover:-translate-y-2"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image 
                  src={location.image}
                  alt={location.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
              </div>
              
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-white font-serif">{location.name}</h3>
                
                <div className="space-y-3 text-stone-300">
                  <div className="flex items-start gap-3 group/item">
                    <MapPin className="w-5 h-5 text-saffron-500 shrink-0 group-hover/item:text-saffron-400 transition-colors" />
                    <span className="text-sm group-hover/item:text-white transition-colors">{location.address}</span>
                  </div>
                  <div className="flex items-center gap-3 group/item">
                    <Phone className="w-5 h-5 text-saffron-500 shrink-0 group-hover/item:text-saffron-400 transition-colors" />
                    <span className="text-sm group-hover/item:text-white transition-colors">{location.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 group/item">
                    <Clock className="w-5 h-5 text-saffron-500 shrink-0 group-hover/item:text-saffron-400 transition-colors" />
                    <span className="text-sm group-hover/item:text-white transition-colors">{location.hours}</span>
                  </div>
                </div>

                <button className="w-full mt-4 py-3 border border-white/10 rounded-xl hover:bg-saffron-500 hover:text-black hover:border-saffron-500 transition-all text-sm font-bold tracking-wide uppercase text-saffron-500">
                  Get Directions
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
