'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { SidebarProvider, SidebarInset } from '@/components/layout/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import Header from '@/components/layout/header'
import { Breadcrumb } from '@/components/ui/breadcrumb'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect via useEffect
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <Header />
          <Breadcrumb />
          <div className="flex-1 p-4">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}