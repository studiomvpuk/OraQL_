'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { Trophy, LayoutDashboard, Star, Layers, LogOut } from 'lucide-react'
import Link from 'next/link'

export function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'OraQL_ Picks', href: '/picks', icon: Star },
    { label: 'Bet Builder', href: '/builder', icon: Layers },
  ]

  const handleLogout = () => {
    logout()
    router.push('/auth')
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-dark-ink border-r border-dark-graphite flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-dark-graphite">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-oracle-gold rounded-lg flex items-center justify-center">
            <Trophy className="w-6 h-6 text-dark-ink" />
          </div>
          <span className="text-xl font-bold text-oracle-gold">OraQL_</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-oracle-gold/15 text-oracle-gold'
                  : 'text-txt-inverse-2 hover:bg-dark-graphite'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-dark-graphite space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-oracle-gold/20 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-oracle-gold to-oracle-gold/50 rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-txt-primary truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-txt-inverse-2 truncate">{user?.role || 'Member'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-txt-inverse-2 hover:bg-dark-graphite transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}
