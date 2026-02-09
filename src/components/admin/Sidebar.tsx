'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, UtensilsCrossed, ClipboardList, CalendarDays, Settings, LogOut } from 'lucide-react'
import { clsx } from 'clsx'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Menu', href: '/admin/menu', icon: UtensilsCrossed },
  { name: 'Orders', href: '/admin/orders', icon: ClipboardList },
  { name: 'Reservations', href: '/admin/reservations', icon: CalendarDays },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-stone-900 border-r border-stone-800 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-amber-500">Heritage Wala</h1>
        <p className="text-xs text-stone-500 uppercase tracking-wider mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
                isActive
                  ? 'bg-amber-500/10 text-amber-500'
                  : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-stone-800">
        <button
          onClick={async () => {
             await fetch('/api/auth/logout', { method: 'POST' })
             window.location.href = '/admin/login'
          }}
          className="flex items-center gap-3 px-4 py-3 text-stone-400 hover:bg-stone-800 hover:text-red-400 rounded-xl w-full transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  )
}
