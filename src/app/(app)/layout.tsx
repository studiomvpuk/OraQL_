'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, Trophy } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { BuilderBar } from '@/components/builder/BuilderBar';
import { AuthGuard } from '@/components/layout/AuthGuard';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-warm-white">
        <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

        {/* Mobile header (hidden on lg+) */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-warm-sand bg-warm-white/90 px-4 backdrop-blur-md lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="-ml-2 flex h-10 w-10 items-center justify-center rounded-md text-txt-secondary hover:bg-warm-cream hover:text-txt-primary"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-oracle-sm bg-dark-ink">
              <Trophy className="h-4 w-4 text-oracle-gold" />
            </div>
            <span className="font-display text-body font-semibold tracking-tight">
              OraQL_
            </span>
          </Link>
          {/* Spacer to keep brand centered */}
          <div className="h-10 w-10" />
        </header>

        <main className="pb-32 lg:ml-64 lg:pb-24">{children}</main>

        <BuilderBar />
      </div>
    </AuthGuard>
  );
}
