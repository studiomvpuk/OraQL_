'use client';

import { ReactNode } from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import { Sidebar } from '@/components/Sidebar';
import { BuilderBar } from '@/components/BuilderBar';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-[#f9f7f3]">
        <Sidebar />
        <main className="flex-1 ml-64">
          {children}
        </main>
        <BuilderBar />
      </div>
    </AuthGuard>
  );
}
