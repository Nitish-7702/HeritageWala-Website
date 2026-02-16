'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Calendar, Clock, Users } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Invalid email'),
  guests: z.coerce.number().min(1).max(20),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function ReservationsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (res.ok) {
        setSuccess(true)
      } else {
        alert('Failed to book table. Slot might be full.')
      }
    } catch (e) {
      alert('Error booking table')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen pt-32 px-4 text-center flex items-center justify-center">
        <div className="max-w-md mx-auto glass-card-premium p-10 rounded-2xl border border-white/10">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
             <Calendar className="text-green-500" size={32} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-white mb-4">Reservation Requested!</h2>
          <p className="text-stone-300 mb-8 leading-relaxed">
            We have received your booking request. You will receive a confirmation email shortly.
          </p>
          <button
             onClick={() => window.location.href = '/'}
             className="px-8 py-3 bg-saffron-600 hover:bg-saffron-500 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-saffron-500/40"
          >
             Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-serif font-bold text-white mb-4 drop-shadow-lg">Book a Table</h1>
          <p className="text-stone-300 text-lg font-light">Reserve your spot for a royal dining experience.</p>
        </div>

        <div className="p-8 md:p-12 rounded-2xl border border-white/20 shadow-2xl backdrop-blur-sm bg-black/10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-stone-200 mb-2 font-bold uppercase tracking-wide">Date</label>
                <div className="relative group">
                    <input type="date" {...register('date')} className="w-full bg-white/5 border border-white/30 rounded-lg p-3 text-white focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 pl-10 transition-all outline-none hover:bg-white/10" />
                    <Calendar className="absolute left-3 top-3.5 text-stone-300 group-hover:text-saffron-500 transition-colors" size={18} />
                </div>
                {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm text-stone-200 mb-2 font-bold uppercase tracking-wide">Time</label>
                 <div className="relative group">
                    <select {...register('time')} className="w-full bg-white/5 border border-white/30 rounded-lg p-3 text-white focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 pl-10 appearance-none transition-all outline-none hover:bg-white/10">
                        <option value="" className="bg-charcoal-900 text-stone-400">Select Time</option>
                        <option value="12:00" className="bg-charcoal-900">12:00 PM</option>
                        <option value="13:00" className="bg-charcoal-900">01:00 PM</option>
                        <option value="14:00" className="bg-charcoal-900">02:00 PM</option>
                        <option value="19:00" className="bg-charcoal-900">07:00 PM</option>
                        <option value="20:00" className="bg-charcoal-900">08:00 PM</option>
                        <option value="21:00" className="bg-charcoal-900">09:00 PM</option>
                    </select>
                    <Clock className="absolute left-3 top-3.5 text-stone-300" size={18} />
                 </div>
                {errors.time && <p className="text-red-400 text-xs mt-1">{errors.time.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm text-stone-200 mb-1">Guests</label>
                    <div className="relative">
                        <input type="number" {...register('guests')} className="w-full bg-white/5 border border-white/30 rounded-lg p-3 text-white focus:border-saffron-500 pl-10" min="1" />
                        <Users className="absolute left-3 top-3.5 text-stone-300" size={18} />
                    </div>
                    {errors.guests && <p className="text-red-400 text-xs mt-1">{errors.guests.message}</p>}
                 </div>
                 <div>
                    <label className="block text-sm text-stone-200 mb-1">Phone</label>
                    <input {...register('phone')} className="w-full bg-white/5 border border-white/30 rounded-lg p-3 text-white focus:border-saffron-500" placeholder="+44..." />
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                 </div>
            </div>

            <div>
                <label className="block text-sm text-stone-200 mb-1">Name</label>
                <input {...register('name')} className="w-full bg-white/5 border border-white/30 rounded-lg p-3 text-white focus:border-saffron-500" placeholder="Your Name" />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
                <label className="block text-sm text-stone-200 mb-1">Email</label>
                <input {...register('email')} className="w-full bg-white/5 border border-white/30 rounded-lg p-3 text-white focus:border-saffron-500" placeholder="email@example.com" />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
                <label className="block text-sm text-stone-200 mb-1">Special Requests</label>
                <textarea {...register('notes')} className="w-full bg-white/5 border border-white/30 rounded-lg p-3 text-white focus:border-saffron-500 h-24" placeholder="Birthday, Anniversary, etc." />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-saffron-500 text-white font-bold rounded-lg hover:bg-opacity-90 transition-all"
            >
                {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
