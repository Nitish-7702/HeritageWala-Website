'use client'
import React from 'react'
import Link from 'next/link'
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-charcoal border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-serif font-bold">
              <span className="text-white">Heritage</span>
              <span className="text-saffron">Wala</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Experience the authentic flavors of Hyderabad in a premium, modern setting. 
              Tradition meets innovation on your plate.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-gray-400 hover:text-saffron transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-saffron transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-saffron transition-colors">
                <Twitter size={20} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-serif font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-saffron transition-colors">Home</Link></li>
              <li><Link href="/menu" className="hover:text-saffron transition-colors">Menu</Link></li>
              <li><Link href="/reservations" className="hover:text-saffron transition-colors">Reservations</Link></li>
              <li><Link href="/about" className="hover:text-saffron transition-colors">Our Story</Link></li>
              <li><Link href="/contact" className="hover:text-saffron transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-serif font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-saffron mt-1 shrink-0" />
                <span>Heritage Wala, City Centre,<br />Coventry, UK CV1 1AA</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-saffron shrink-0" />
                <span>+44 24 7600 0000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-saffron shrink-0" />
                <span>hello@sheritagewala.com</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-white font-serif font-semibold mb-6">Opening Hours</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex justify-between">
                <span>Mon - Thu</span>
                <span>11:00 AM - 10:00 PM</span>
              </li>
              <li className="flex justify-between text-white">
                <span>Fri - Sat</span>
                <span>11:00 AM - 11:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span>11:00 AM - 10:30 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Heritage Wala. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
