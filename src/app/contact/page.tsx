'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'
import { useState } from 'react'

export default function ContactPage() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setStatus('success')
    setFormState({ name: '', email: '', message: '' })
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 drop-shadow-lg">Get in Touch</h1>
          <p className="text-xl text-stone-300 max-w-2xl mx-auto font-light">
            Have a question or want to book a private event? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="glass-card-premium p-8 rounded-2xl border border-white/10 space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-saffron-500/10 rounded-lg text-saffron-500">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 font-serif">Visit Us</h3>
                  <p className="text-stone-400">Heritage Wala, City Centre,<br />Coventry, UK CV1 1AA</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-saffron-500/10 rounded-lg text-saffron-500">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 font-serif">Call Us</h3>
                  <p className="text-stone-400">+44 24 7600 0000</p>
                  <p className="text-stone-400">+44 7700 900000</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-saffron-500/10 rounded-lg text-saffron-500">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 font-serif">Email Us</h3>
                  <p className="text-stone-400">hello@sheritagewala.com</p>
                  <p className="text-stone-400">events@sheritagewala.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-saffron-500/10 rounded-lg text-saffron-500">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 font-serif">Opening Hours</h3>
                  <p className="text-stone-400">Mon - Sun: 11:00 AM - 11:00 PM</p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="aspect-video glass-card-premium rounded-2xl border border-white/10 flex items-center justify-center text-stone-500 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-charcoal-900 to-black opacity-60" />
               <div className="relative z-10 flex flex-col items-center">
                  <MapPin className="w-12 h-12 opacity-50 mb-2" />
                  <span className="font-light tracking-widest uppercase text-sm">Map Integration</span>
               </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="glass-card-premium p-8 rounded-2xl border border-white/10 space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-stone-400 mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formState.name}
                  onChange={e => setFormState({ ...formState, name: e.target.value })}
                  className="w-full px-4 py-3 bg-stone-950 border border-stone-800 rounded-xl focus:outline-none focus:border-amber-500 text-stone-200"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-stone-400 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formState.email}
                  onChange={e => setFormState({ ...formState, email: e.target.value })}
                  className="w-full px-4 py-3 bg-stone-950 border border-stone-800 rounded-xl focus:outline-none focus:border-amber-500 text-stone-200"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-stone-400 mb-2">Message</label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formState.message}
                  onChange={e => setFormState({ ...formState, message: e.target.value })}
                  className="w-full px-4 py-3 bg-stone-950 border border-stone-800 rounded-xl focus:outline-none focus:border-amber-500 text-stone-200"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={status === 'submitting' || status === 'success'}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-stone-800 disabled:text-stone-500 text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {status === 'submitting' ? (
                  'Sending...'
                ) : status === 'success' ? (
                  'Message Sent!'
                ) : (
                  <>
                    Send Message <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
