'use client'

import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store'
import { usePathname } from 'next/navigation'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { login, logout, isAuthenticated } = useStore()
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      // Skip auth check on login/register pages
      if (pathname === '/login' || pathname === '/registro') {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch('/api/auth/me')
        
        if (response.ok) {
          const data = await response.json()
          login(data.user)
        } else {
          logout()
        }
      } catch (error) {
        console.error('[v0] Auth check error:', error)
        logout()
      } finally {
        setIsLoading(false)
      }
    }

    if (!isAuthenticated) {
      checkAuth()
    } else {
      setIsLoading(false)
    }
  }, [pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <>{children}</>
}
