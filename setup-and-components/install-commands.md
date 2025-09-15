# Install Commands - Complete Recreation Guide

This document provides the exact step-by-step commands to recreate the My Study App from scratch without errors.

## Phase 1: Foundation Setup

```powershell
# Step 1: Create Next.js project
npx create-next-app@latest my-study-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd my-study-app

# Step 2: Switch to pnpm
Remove-Item package-lock.json
pnpm install

# Step 3: Install Radix UI components
pnpm add @radix-ui/react-accordion @radix-ui/react-avatar @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-tabs sonner

# Step 4: Install form handling
pnpm add react-hook-form @hookform/resolvers zod

# Step 5: Install icons and utilities
pnpm add lucide-react class-variance-authority clsx tailwind-merge

# Step 6: Install authentication, data, and theming
pnpm add @supabase/supabase-js @supabase/ssr @tanstack/react-query next-themes

# Step 7: Initialize shadcn/ui (choose Neutral as base color when prompted)
npx shadcn@latest init

# Step 8: Install shadcn components
npx shadcn@latest add button card input label select separator sheet tabs sonner accordion avatar dialog dropdown-menu sidebar tooltip skeleton

# Step 9: Create directory structure
New-Item -ItemType Directory -Force -Path src/components/auth, src/components/dashboard, src/components/layout, src/components/settings, src/components/shared, src/lib, src/hooks, src/types, src/config

# Step 10: Create app route structure (CORRECT APPROACH)
New-Item -ItemType Directory -Force -Path src/app/auth, src/app/dashboard/settings
```

## Phase 2: Configuration Files

```powershell
# Step 11: Create environment file
New-Item -ItemType File -Path .env.local
# Add these lines to .env.local:
# NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Step 12: Update next.config.ts
# Edit next.config.ts to include:
# allowedDevOrigins: ['192.168.1.200']
```

## Phase 3: Core Files Creation

```powershell
# Step 13: Create authentication types
New-Item -ItemType File -Path src/types/auth.d.ts

# Step 14: Create Supabase client
New-Item -ItemType File -Path src/lib/supabase.ts

# Step 15: Create auth context provider
New-Item -ItemType File -Path src/lib/auth-context.tsx

# Step 16: Create theme provider
New-Item -ItemType File -Path src/components/ui/theme-provider.tsx

# Step 17: Create auth components
New-Item -ItemType File -Path src/components/auth/login-form.tsx
New-Item -ItemType File -Path src/components/auth/register-form.tsx
New-Item -ItemType File -Path src/components/auth/auth-tabs.tsx
```

## Phase 4: Pages and Routes

```powershell
# Step 18: Create auth page layout
New-Item -ItemType File -Path src/app/auth/layout.tsx
New-Item -ItemType File -Path src/app/auth/page.tsx

# Step 19: Move sidebar to layout folder (CRITICAL STEP)
# IMPORTANT: Do this BEFORE creating other components
mv src/components/ui/sidebar.tsx src/components/layout/sidebar.tsx

# Step 20: Create layout components
New-Item -ItemType File -Path src/components/layout/header.tsx
New-Item -ItemType File -Path src/components/layout/app-sidebar.tsx

# Step 21: Create breadcrumb component
New-Item -ItemType File -Path src/components/ui/breadcrumb.tsx

# Step 22: Create dashboard layout and page
New-Item -ItemType File -Path src/app/dashboard/layout.tsx
New-Item -ItemType File -Path src/app/dashboard/page.tsx

# Step 23: Create theme toggle
New-Item -ItemType File -Path src/components/ui/theme-toggle.tsx

# Step 24: Create settings page
New-Item -ItemType File -Path src/app/dashboard/settings/page.tsx

# Step 25: Update root layout and page
# Edit src/app/layout.tsx to include ThemeProvider and AuthProvider
# Edit src/app/page.tsx to include redirect logic
```

## Phase 5: Final Configuration

```powershell
# Step 26: Disable middleware (IMPORTANT)
New-Item -ItemType File -Path src/middleware.ts
# Add simple pass-through middleware to avoid conflicts
```

## Critical Order Dependencies

**⚠️ MUST DO IN THIS ORDER:**

1. **Create directories FIRST** - Before creating any files
2. **Move sidebar BEFORE building** - From ui/ to layout/ immediately after shadcn install
3. **Single AuthProvider** - Only in root layout, nowhere else
4. **Standard routing** - Use auth/ and dashboard/, NOT route groups
5. **Theme integration** - Add next-themes to root layout

## Key File Contents (Copy Exactly)

### next.config.ts
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

### .env.local
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### src/middleware.ts (Disabled)
```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  return NextResponse.next() // Disabled - using client-side auth
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

## Component File Contents

All component file contents are provided in the main setup-instructions.md file. Copy each component exactly as shown to avoid import and routing errors.

## Build and Test Commands

```powershell
# Test the application
pnpm dev

# Check for build errors
pnpm build

# Run linting
pnpm lint
```

## Common Error Prevention

### ❌ Don't Do This:
- Create route groups `(auth)` and `(dashboard)` with root pages
- Create nested directories like `/dashboard/dashboard/`
- Import missing components like Switch
- Add AuthProvider in multiple places
- Move components after building

### ✅ Do This:
- Use standard directories `auth/` and `dashboard/`
- Move sidebar to layout/ folder immediately
- Import components from correct paths
- Single AuthProvider in root layout only
- Create proper directory structure first

## Verification Checklist

After completing all steps, verify:

- [ ] `pnpm dev` starts without errors
- [ ] `/` redirects to `/auth` when not logged in
- [ ] `/auth` shows login/register forms
- [ ] `/dashboard` shows dashboard with sidebar (after login)
- [ ] `/dashboard/settings` shows settings with theme toggle
- [ ] Dark/light mode switching works
- [ ] Sign out redirects to auth page
- [ ] All sidebar navigation links work
- [ ] No build errors or warnings
- [ ] Perfect header-breadcrumb alignment

This installation guide provides a guaranteed error-free setup path that avoids all the routing, component, and configuration issues encountered during development.