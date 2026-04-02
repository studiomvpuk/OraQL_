'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { BuilderBar } from '@/components/builder/BuilderBar';
import { AuthGuard } from '@/components/layout/AuthGuard';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-warm-white">
        <Sidebar />
        <main className="flex-1 ml-64 pb-24">{children}</main>
        <BuilderBar />
      </div>
    </AuthGuard>
  );
}
