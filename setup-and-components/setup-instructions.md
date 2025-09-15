# My Study App - Complete Setup Guide

## Project Overview
A modern Next.js application with authentication, sidebar navigation, dark mode theming, and dashboard functionality, built using shadcn/ui components and Tailwind CSS.

## Prerequisites
- Node.js 18+ installed
- Git repository initialized
- Supabase account for authentication
- PowerShell or Command Prompt access

---

## Phase 1: Foundation Setup ✅

### Step 1.1: Initialize Next.js Project

```powershell
# Navigate to parent directory where you want to create the project
cd C:\Users\willh\Desktop\template-guide

# Create new Next.js project
npx create-next-app@latest my-study-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Navigate to project
cd my-study-app
```

**Interactive Prompts During Setup:**
- Turbopack: Choose either Yes or No (both work fine)

**Result:** Next.js 15.5.3 project created with:
- TypeScript support
- Tailwind CSS 4.1.13
- ESLint configuration
- App Router structure
- Source directory (`src/`)
- Import alias (`@/*`)

### Step 1.2: Install Dependencies

#### Switch to pnpm
```powershell
# Remove package-lock.json and switch to pnpm
Remove-Item package-lock.json
pnpm install
```

#### Install UI Components
```powershell
# Install Radix UI components for shadcn/ui
pnpm add @radix-ui/react-accordion @radix-ui/react-avatar @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-tabs sonner

# Install form handling
pnpm add react-hook-form @hookform/resolvers zod

# Install icons and utilities
pnpm add lucide-react class-variance-authority clsx tailwind-merge

# Install authentication, data, and theming
pnpm add @supabase/supabase-js @supabase/ssr @tanstack/react-query next-themes
```

### Step 1.3: Configure shadcn/ui

```powershell
# Initialize shadcn/ui (choose Neutral as base color when prompted)
npx shadcn@latest init

# Install required shadcn components
npx shadcn@latest add button card input label select separator sheet tabs sonner accordion avatar dialog dropdown-menu sidebar tooltip skeleton
```

### Step 1.4: Set up Project Structure

```powershell
# Create component directories
New-Item -ItemType Directory -Force -Path src/components/auth, src/components/dashboard, src/components/layout, src/components/settings, src/components/shared, src/lib, src/hooks, src/types, src/config

# Create app route structure (CORRECT APPROACH)
New-Item -ItemType Directory -Force -Path src/app/auth, src/app/dashboard/settings
```

**Final Structure:**
```
src/
├── components/
│   ├── auth/            ✅ Authentication components
│   ├── dashboard/       ✅ Dashboard components
│   ├── layout/          ✅ Layout components (header, sidebar)
│   ├── settings/        ✅ Settings components
│   ├── shared/          ✅ Shared components
│   └── ui/              ✅ shadcn/ui components
├── lib/                 ✅ Utilities and configurations
├── hooks/               ✅ Custom hooks
├── types/               ✅ TypeScript types
├── config/              ✅ App configuration
└── app/                 ✅ Next.js App Router
    ├── auth/            ✅ /auth route
    ├── dashboard/       ✅ /dashboard route
    │   └── settings/    ✅ /dashboard/settings route
    ├── layout.tsx       ✅ Root layout
    └── page.tsx         ✅ Root redirect page
```

### Step 1.5: Configure Next.js

```powershell
# Edit next.config.ts and add these configurations:
```

**next.config.ts:**
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Fix cross-origin warning for development
  allowedDevOrigins: ['192.168.1.200'],
};

export default nextConfig;
```

---

## Phase 2: Authentication Setup ✅

### Step 2.1: Environment Configuration

Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Step 2.2: Core Authentication Files

**src/types/auth.d.ts:**
```typescript
export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
}

export interface AuthState {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}
```

**src/lib/supabase.ts:**
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create a client with fallback values for build-time
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
)

// Export a function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}
```

**src/lib/auth-context.tsx:**
```typescript
'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from './supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { User, AuthState } from '@/types/auth'

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Skip auth initialization if Supabase is not configured
    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? {
        id: session.user.id,
        email: session.user.email!,
        full_name: session.user.user_metadata?.full_name,
        avatar_url: session.user.user_metadata?.avatar_url,
      } : null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? {
        id: session.user.id,
        email: session.user.email!,
        full_name: session.user.user_metadata?.full_name,
        avatar_url: session.user.user_metadata?.avatar_url,
      } : null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured')
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured')
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    })
    if (error) throw error
  }

  const signOut = async () => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured')
    }
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const resetPassword = async (email: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured')
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
  }

  const value: AuthState = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

### Step 2.3: Theme Provider Setup

**src/components/ui/theme-provider.tsx:**
```typescript
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

### Step 2.4: Root Layout Setup

**src/app/layout.tsx:**
```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider } from '@/components/ui/theme-provider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Study App",
  description: "Modern study app with authentication and dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Step 2.5: Root Page Redirect

**src/app/page.tsx:**
```typescript
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard')
      } else {
        router.push('/auth')
      }
    }
  }, [user, loading, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
```

---

## Phase 3: Authentication Pages ✅

### Step 3.1: Auth Components

Create the following authentication components:

- `src/components/auth/login-form.tsx`
- `src/components/auth/register-form.tsx`
- `src/components/auth/auth-tabs.tsx`

### Step 3.2: Auth Layout

**src/app/auth/layout.tsx:**
```typescript
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="flex min-h-screen items-center justify-center p-4">
        {children}
      </div>
    </div>
  )
}
```

### Step 3.3: Auth Page

**src/app/auth/page.tsx:**
```typescript
import { AuthTabs } from '@/components/auth/auth-tabs'

export default function AuthPage() {
  return (
    <div className="w-full max-w-md">
      <AuthTabs />
    </div>
  )
}
```

---

## Phase 4: Dashboard & Navigation ✅

### Step 4.1: Move Sidebar to Layout

Move the sidebar component from `ui/` to `layout/`:
```powershell
mv src/components/ui/sidebar.tsx src/components/layout/sidebar.tsx
```

### Step 4.2: Header Component

**src/components/layout/header.tsx:**
```typescript
import { SidebarTrigger } from '@/components/layout/sidebar';

export default function Header() {
  return (
    <header className="bg-background sticky top-0 z-50 flex h-12 items-center gap-4 border-b px-4">
      <SidebarTrigger />
      <div className="font-semibold">
        <span className="text-blue-600">My Study</span>
        <span className="text-black dark:text-white"> App</span>
      </div>
    </header>
  );
}
```

### Step 4.3: Breadcrumb Component

**src/components/ui/breadcrumb.tsx:**
```typescript
'use client';

import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  className?: string;
}

const routeLabels: Record<string, string> = {
  '/': 'Dashboard',
  '/dashboard': 'Dashboard',
  '/dashboard/materials': 'Study Materials',
  '/dashboard/schedule': 'Schedule',
  '/dashboard/progress': 'Progress',
  '/dashboard/settings': 'Settings',
};

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  breadcrumbs.push({
    label: 'Dashboard',
    href: '/dashboard',
    isActive: pathname === '/dashboard' || pathname === '/',
  });

  let currentPath = '';
  paths.forEach((path, index) => {
    currentPath += `/${path}`;
    const isLast = index === paths.length - 1;

    if (currentPath !== '/dashboard') {
      breadcrumbs.push({
        label:
          routeLabels[currentPath] ||
          path.charAt(0).toUpperCase() + path.slice(1),
        href: currentPath,
        isActive: isLast,
      });
    }
  });

  return breadcrumbs;
}

export function Breadcrumb({ className }: BreadcrumbProps) {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  if (pathname === '/' || pathname === '/dashboard') {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        'text-muted-foreground flex items-center space-x-1 px-4 h-12 border-b bg-background',
        className
      )}
    >
      <ol className="flex items-center space-x-1">
        {breadcrumbs.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="text-muted-foreground/50 mx-1 h-4 w-4" />
            )}
            {index === 0 && (
              <Home className="text-muted-foreground/70 mr-2 h-4 w-4" />
            )}
            {item.isActive ? (
              <span className="text-foreground font-medium">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

### Step 4.4: App Sidebar Component

**src/components/layout/app-sidebar.tsx:**
```typescript
'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/layout/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/lib/auth-context'
import {
  Home,
  BookOpen,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  User,
  ChevronUp
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const navigationItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Study Materials',
    url: '/dashboard/materials',
    icon: BookOpen,
  },
  {
    title: 'Schedule',
    url: '/dashboard/schedule',
    icon: Calendar,
  },
  {
    title: 'Progress',
    url: '/dashboard/progress',
    icon: BarChart3,
  },
  {
    title: 'Settings',
    url: '/dashboard/settings',
    icon: Settings,
  },
]

export function AppSidebar() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/auth')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-12">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar_url} />
                    <AvatarFallback>
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-medium truncate">
                      {user?.full_name || 'User'}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
```

### Step 4.5: Dashboard Layout

**src/app/dashboard/layout.tsx:**
```typescript
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
    return null
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
```

### Step 4.6: Dashboard Page

**src/app/dashboard/page.tsx:**
```typescript
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to your study app</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Studies</CardTitle>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5h</div>
            <p className="text-xs text-muted-foreground">+4.2h from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">67% completion rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Completed Mathematics Study</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Started Physics Chapter 3</p>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Updated study schedule</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Start New Study Session
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Review Notes
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Schedule Study Time
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

---

## Phase 5: Settings & Theme System ✅

### Step 5.1: Theme Toggle Component

**src/components/ui/theme-toggle.tsx:**
```typescript
"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">Theme:</span>
      <div className="flex items-center space-x-1">
        <Button
          variant={theme === 'light' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTheme('light')}
          className="px-3"
        >
          <Sun className="h-4 w-4 mr-1" />
          Light
        </Button>
        <Button
          variant={theme === 'dark' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTheme('dark')}
          className="px-3"
        >
          <Moon className="h-4 w-4 mr-1" />
          Dark
        </Button>
        <Button
          variant={theme === 'system' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTheme('system')}
          className="px-3"
        >
          System
        </Button>
      </div>
    </div>
  )
}
```

### Step 5.2: Settings Page (Simplified)

**src/app/dashboard/settings/page.tsx:**
```typescript
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import {
  Palette,
  LogOut
} from 'lucide-react'

export default function SettingsPage() {
  const { signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/auth')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Theme & Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ThemeToggle />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <LogOut className="h-5 w-5" />
              Account Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Sign out of your account or manage your session.
            </p>
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

---

## Phase 6: Deployment & Environment Configuration ✅

### Step 6.1: Vercel Deployment Setup

The project includes graceful fallback handling for missing environment variables, allowing successful builds even without Supabase configuration.

#### Environment Variables for Production
For full functionality, add these environment variables to your Vercel project:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

#### Adding Environment Variables in Vercel
1. Go to your project dashboard on Vercel
2. Navigate to Settings > Environment Variables
3. Add the two Supabase environment variables
4. Redeploy the project

#### Build Safety Features
The project includes several build-safe configurations:

1. **Graceful Supabase Fallbacks**: Uses placeholder values during build time
2. **Configuration Checks**: `isSupabaseConfigured()` function prevents runtime errors
3. **Environment Detection**: Skips auth initialization when variables are missing
4. **Error Handling**: Proper error messages for missing configuration

#### Testing Deployment
```powershell
# Test build locally to ensure it passes
pnpm run build

# Deploy to Vercel (will build successfully even without env vars)
vercel --prod
```

**Note**: The app will build and deploy successfully without environment variables, but authentication features will be disabled until proper Supabase configuration is added.

---

## Final Project Commands

```powershell
# Development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

---

## Critical Success Factors

### ✅ What We Got Right:
1. **Standard Directory Structure**: Using `auth/` and `dashboard/` instead of route groups
2. **Single AuthProvider**: Only in root layout, no duplicates
3. **Proper Component Organization**: Sidebar in `layout/`, not `ui/`
4. **Theme Integration**: Complete dark/light mode with next-themes
5. **Client-Side Authentication**: Avoids middleware conflicts
6. **Perfect Alignment**: Header and breadcrumb heights match (48px)

### 🚨 Critical Mistakes to Avoid:
1. **Route Groups for Root Pages**: Don't use `(auth)/page.tsx` and `(dashboard)/page.tsx` - causes conflicts
2. **Nested Directory Errors**: Don't create `/dashboard/dashboard/` or `/auth/auth/`
3. **Missing Dependencies**: Always check if components exist before importing
4. **Multiple Providers**: Don't wrap AuthProvider in multiple places
5. **Import Path Changes**: Move components before building, not after

### 🎯 Testing Checklist:
- [ ] Root `/` redirects properly based on auth state
- [ ] `/auth` loads login/register forms
- [ ] `/dashboard` shows dashboard with sidebar
- [ ] `/dashboard/settings` loads with working theme toggle
- [ ] Dark/light mode switching works
- [ ] Sign out redirects to auth page
- [ ] Sidebar navigation works for all routes
- [ ] Perfect header-breadcrumb alignment

This guide provides a clean, error-free installation path that avoids all the routing and component issues we encountered during development.