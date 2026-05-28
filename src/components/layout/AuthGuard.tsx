'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading, loadUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) loadUser();
  }, [isAuthenticated, loadUser]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading && !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-warm-white">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="flex h-14 w-14 items-center justify-center rounded-oracle-md bg-dark-ink">
            <Trophy className="h-7 w-7 text-oracle-gold" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-oracle-gold" />
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-oracle-gold" style={{ animationDelay: '150ms' }} />
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-oracle-gold" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
