'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Star,
  Layers,
  LogOut,
  Trophy,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/picks', label: 'OraQL_ Picks', icon: Star },
  { href: '/builder', label: 'Bet Builder', icon: Layers },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={onMobileClose}
        className={cn(
          'fixed inset-0 z-40 bg-dark-ink/60 backdrop-blur-sm transition-opacity lg:hidden',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-hidden="true"
      />

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-dark-graphite bg-dark-ink transition-transform duration-200 ease-out',
          'lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo / mobile close */}
        <div className="flex h-16 items-center justify-between gap-3 border-b border-dark-graphite px-6">
          <Link href="/dashboard" onClick={onMobileClose} className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-oracle-sm bg-oracle-gold/20">
              <Trophy className="h-5 w-5 text-oracle-gold" />
            </div>
            <span className="font-display text-display-sm tracking-tight text-txt-inverse">
              OraQL_
            </span>
          </Link>
          <button
            onClick={onMobileClose}
            className="rounded-md p-1.5 text-txt-inverse-2 transition-colors hover:bg-dark-graphite hover:text-txt-inverse lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                className={cn(
                  'flex items-center gap-3 rounded-oracle-sm px-3 py-2.5 text-body font-medium transition-all duration-normal',
                  isActive
                    ? 'bg-oracle-gold/15 text-oracle-gold'
                    : 'text-txt-inverse-2 hover:bg-dark-graphite hover:text-txt-inverse',
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-dark-graphite p-3">
          <div className="flex items-center gap-3 rounded-oracle-sm px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-oracle-gold/20 font-display text-caption font-semibold text-oracle-gold">
              {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-body-sm font-medium text-txt-inverse">
                {user?.firstName || user?.email || 'User'}
              </p>
              <p className="truncate text-caption text-txt-inverse-2">
                {user?.role || 'Free'}
              </p>
            </div>
            <button
              onClick={() => logout()}
              className="rounded-md p-1.5 text-txt-inverse-2 transition-colors hover:bg-dark-graphite hover:text-danger"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
