'use client'

import { Bell, User } from 'lucide-react'

export default function TopBar() {
  return (
    <header className="h-16 bg-stone-900 border-b border-stone-800 flex items-center justify-between px-6">
      <div className="text-stone-400 text-sm">
        {new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full" />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-stone-800">
          <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-stone-950 font-bold">
            A
          </div>
          <div className="text-sm">
            <div className="text-stone-200 font-medium">Admin User</div>
            <div className="text-stone-500 text-xs">Super Admin</div>
          </div>
        </div>
      </div>
    </header>
  )
}
