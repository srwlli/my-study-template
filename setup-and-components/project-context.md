# Project Context & AI Agent Onboarding

## Overview

**Project Name:** My Study App
**Type:** Next.js React Application with Supabase Authentication
**Purpose:** Modern study/learning management platform
**Current Status:** Core authentication and navigation system complete, mobile-optimized

## What This Project Is

This is a sophisticated React application built with Next.js 15.5.3 that serves as a template for educational/study management platforms. The project demonstrates modern web development patterns with a focus on:

- **Clean Architecture**: Well-organized component structure with proper separation of concerns
- **Authentication Flow**: Complete Supabase-based auth system with protected routes
- **Modern UI/UX**: shadcn/ui components with dark/light theme support
- **Mobile-First Design**: Responsive layout with mobile-specific optimizations
- **TypeScript**: Strict type safety throughout the application

## Current State & What Works

### ✅ Completed Features

1. **Authentication System**
   - Supabase authentication integration
   - Login/signup forms with validation (react-hook-form + zod)
   - Protected route system
   - Sign out functionality
   - Mobile hydration issues resolved

2. **Navigation & Layout**
   - Responsive sidebar navigation with keyboard shortcuts
   - Header with breadcrumb navigation (auto-generating)
   - Perfect alignment between header (48px) and breadcrumb components
   - Mobile-responsive sidebar that auto-closes

3. **Settings & Theming**
   - Comprehensive settings page at `/dashboard/settings`
   - Dark/light/system theme switching with next-themes
   - Theme persistence across sessions

4. **Project Structure**
   ```
   src/
   ├── app/                    # Next.js app router
   │   ├── auth/              # Authentication pages (/auth/login, /auth/signup)
   │   └── dashboard/         # Protected dashboard area
   ├── components/
   │   ├── auth/              # Authentication components
   │   ├── layout/            # Layout components (sidebar, header)
   │   └── ui/                # shadcn/ui components
   ├── lib/                   # Utilities (auth-context, supabase)
   ├── hooks/                 # Custom hooks (use-mobile)
   └── types/                 # TypeScript definitions
   ```

### 🔧 Technical Architecture

- **Framework**: Next.js 15.5.3 with App Router (not route groups - caused conflicts)
- **Authentication**: Supabase with @supabase/ssr for server-side auth
- **UI Library**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom theming
- **Forms**: react-hook-form with zod validation
- **State Management**: React Context for auth, useState for local state
- **TypeScript**: Strict mode enabled throughout

## Recent Problem-Solving History

### Major Issues Resolved

1. **Route Group Conflicts** (September 14)
   - **Problem**: Attempted to use route groups `(auth)` and `(dashboard)` but Next.js threw "parallel pages" errors
   - **Solution**: Converted to standard directory structure (`auth/` and `dashboard/`)
   - **Learning**: Route groups are complex and caused more problems than benefits for this project

2. **Settings Page 404 Errors** (September 14)
   - **Problem**: Navigation to `/dashboard/settings` returned 404, incorrect nested structure
   - **Solution**: Fixed directory structure and removed missing Switch component dependencies
   - **Files**: Created proper `src/app/dashboard/settings/page.tsx`

3. **Component Organization** (September 14)
   - **Problem**: Sidebar components in wrong folder, import path conflicts
   - **Solution**: Moved sidebar from `ui/` to `layout/` folder, updated all imports
   - **Pattern**: Components organized by purpose (layout/ vs ui/)

4. **Mobile Hydration Error** (September 15)
   - **Problem**: Hydration mismatches on mobile due to browser autofill behavior
   - **Solution**: Implemented mounted state pattern with proper autocomplete attributes
   - **Files**: `src/components/auth/login-form.tsx`
   - **Technical**: Added `suppressHydrationWarning` and loading skeleton

5. **Vercel Deployment Build Failures** (September 15) - MOST RECENT
   - **Problem**: Build failing on Vercel due to missing Supabase environment variables
   - **Root Cause**: Supabase client throwing errors at module load time when env vars missing
   - **Solution**: Implemented graceful fallback handling for missing configuration
   - **Files**: `src/lib/supabase.ts`, `src/lib/auth-context.tsx`
   - **Technical**: Added placeholder values for build-time and `isSupabaseConfigured()` check

### Development Patterns Established

1. **SSR-Safe Components**: Use mounted state pattern for client-only features
2. **Form Handling**: react-hook-form with zod validation for type safety
3. **Mobile-First**: Always test mobile responsiveness and hydration
4. **Import Paths**: Use `@/` alias, organize imports by purpose
5. **Error Handling**: Comprehensive error boundaries and loading states
6. **Environment Configuration**: Graceful fallbacks for missing environment variables
7. **Build Safety**: Ensure build succeeds even without external service configuration

## Current User Experience

### Working User Flows

1. **Authentication Flow**:
   - Visit `/auth/login` → Login form → Redirect to `/dashboard`
   - Protected routes automatically redirect unauthenticated users
   - Sign out from settings page works correctly

2. **Navigation Flow**:
   - Sidebar navigation with dashboard, settings links
   - Breadcrumb navigation shows current page context
   - Mobile sidebar auto-closes after navigation
   - Keyboard shortcuts for power users

3. **Settings Management**:
   - Theme switching (dark/light/system) persists across sessions
   - User can sign out from settings page
   - All settings are functional and saved

## What An AI Agent Should Know

### 🎯 Project Goals
- Create a clean, modern study app template
- Demonstrate best practices for Next.js + Supabase apps
- Maintain perfect mobile responsiveness
- Keep codebase clean and well-documented

### ⚠️ Known Constraints
- **No route groups** - Use standard directory structure only
- **Client-side auth** - Avoided middleware due to conflicts, use auth context
- **Mobile-first** - Always consider mobile hydration and responsive design
- **shadcn/ui patterns** - Follow established component patterns

### 🛠️ Development Commands
```bash
npm run dev      # Development server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint checking
```

### 📁 Key Files To Know
- `src/lib/auth-context.tsx` - Authentication state management with graceful fallbacks
- `src/lib/supabase.ts` - Supabase client with build-safe configuration
- `src/components/layout/sidebar.tsx` - Main navigation component
- `src/components/layout/header.tsx` - Header with breadcrumbs
- `src/app/dashboard/settings/page.tsx` - Settings page
- `src/hooks/use-mobile.ts` - Mobile detection hook
- `CLAUDE.md` - Project instructions and technology stack

### 🚨 Common Pitfalls To Avoid
1. Don't use route groups - they cause parallel page conflicts
2. Always implement mounted state for client-only features
3. Test mobile hydration when adding new forms/interactive components
4. Follow existing import patterns and component organization
5. Don't add components to ui/ folder unless they're truly reusable UI primitives
6. Never throw errors at module load time for missing environment variables
7. Always provide graceful fallbacks for external service configurations

## Next Steps & Future Development

The foundation is solid. Future development should focus on:
- Adding actual study features (courses, lessons, progress tracking)
- Enhanced user profiles and settings
- Study analytics and progress visualization
- Collaborative features
- Performance optimizations

## Quick Start For New AI Agents

1. **Read** `CLAUDE.md` for full project context
2. **Review** `docs/setup-instructions.md` for installation steps
3. **Check** `docs/changelog.md` for recent changes
4. **Examine** the current codebase structure in `src/`
5. **Test** the working authentication and navigation flows
6. **Understand** the mobile-first, TypeScript-strict approach

This project represents a clean, production-ready foundation for a modern React application with authentication, theming, and responsive design.