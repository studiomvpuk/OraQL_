'use client';

import { useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Trophy } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { api } from '@/lib/api';

function CallbackHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setTokens } = useAuthStore();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const accessToken = searchParams?.get('accessToken');
    const refreshToken = searchParams?.get('refreshToken');
    const userParam = searchParams?.get('user');

    if (!accessToken || !refreshToken) {
      router.replace('/auth?error=missing_tokens');
      return;
    }

    try {
      // Store tokens
      setTokens({ accessToken, refreshToken });
      api.setToken(accessToken);

      if (typeof window !== 'undefined') {
        localStorage.setItem('oracle_refresh', refreshToken);
      }

      // Parse and set user in store
      if (userParam) {
        const user = JSON.parse(decodeURIComponent(userParam));
        useAuthStore.setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      }

      // Redirect to dashboard
      router.replace('/dashboard');
    } catch {
      router.replace('/auth?error=callback_failed');
    }
  }, [searchParams, router, setTokens]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-warm-white">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-oracle-md bg-dark-ink">
          <Trophy className="h-8 w-8 animate-pulse text-oracle-gold" />
        </div>
        <h2 className="font-display text-display-sm tracking-tight">
          Signing you in...
        </h2>
        <p className="mt-2 text-body-sm text-txt-secondary">
          Completing Google authentication
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-warm-white">
          <p className="text-body text-txt-secondary">Loading...</p>
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
