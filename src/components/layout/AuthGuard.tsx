'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { Trophy } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <Trophy className="w-12 h-12 text-oracle-gold animate-bounce" />
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-oracle-gold rounded-full animate-pulse" />
          <span className="w-2 h-2 bg-oracle-gold rounded-full animate-pulse delay-100" />
          <span className="w-2 h-2 bg-oracle-gold rounded-full animate-pulse delay-200" />
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
