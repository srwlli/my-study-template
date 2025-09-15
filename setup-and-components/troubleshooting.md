# Troubleshooting Guide - My Study App

This guide covers all the errors we encountered during development and their solutions.

## Routing Errors

### ❌ Error: "You cannot have two parallel pages that resolve to the same path"

**Symptoms:**
```
Build Error
You cannot have two parallel pages that resolve to the same path. Please check /(auth) and /(dashboard).
```

**Root Cause:**
Route groups `(auth)` and `(dashboard)` both containing root-level `page.tsx` files create parallel routes that conflict.

**Solution:**
```powershell
# Remove route groups, use standard directories
mv src/app/(auth)/page.tsx src/app/auth/page.tsx
mv src/app/(auth)/layout.tsx src/app/auth/layout.tsx
mv src/app/(dashboard)/page.tsx src/app/dashboard/page.tsx
mv src/app/(dashboard)/layout.tsx src/app/dashboard/layout.tsx
rmdir src/app/(auth)
rmdir src/app/(dashboard)
```

**Prevention:**
- Use standard directories (`auth/`, `dashboard/`) instead of route groups for main sections
- Route groups are better for organizing sub-routes within a section

---

### ❌ Error: Navigation returns 404

**Symptoms:**
- Direct URL navigation to `/dashboard/settings` returns 404
- Sidebar navigation links don't work
- Console shows `GET /dashboard/settings 404`

**Root Cause:**
1. Incorrect nested directory structure (`/dashboard/dashboard/` instead of `/dashboard/`)
2. Missing page files in expected locations
3. Import errors preventing page compilation

**Solution:**
```powershell
# Check actual file structure
find src/app -name "*.tsx" -type f

# Ensure correct structure:
# src/app/dashboard/page.tsx (not src/app/dashboard/dashboard/page.tsx)
# src/app/dashboard/settings/page.tsx
```

**Prevention:**
- Always verify directory structure matches URL expectations
- Test navigation immediately after creating routes

---

## Component Import Errors

### ❌ Error: "Module not found: Can't resolve '@/components/ui/sidebar'"

**Symptoms:**
```
Module not found: Can't resolve '@/components/ui/sidebar'
./src/components/layout/app-sidebar.tsx (3:1)
```

**Root Cause:**
Sidebar component moved from `ui/` to `layout/` folder but imports not updated.

**Solution:**
```typescript
// Update all imports from:
import { Sidebar } from '@/components/ui/sidebar'

// To:
import { Sidebar } from '@/components/layout/sidebar'
```

**Files to Update:**
- `src/app/dashboard/layout.tsx`
- `src/components/layout/app-sidebar.tsx`
- `src/components/layout/header.tsx`

**Prevention:**
- Move components before building other dependent components
- Use global search-replace when changing import paths

---

### ❌ Error: "Module not found: Can't resolve '@/components/ui/switch'"

**Symptoms:**
```
Module not found: Can't resolve '@/components/ui/switch'
./src/app/dashboard/settings/page.tsx (5:1)
```

**Root Cause:**
Switch component not installed via shadcn/ui but imported in settings page.

**Solution:**
```typescript
// Replace Switch components with native HTML inputs:
<input type="checkbox" id="dark-mode" className="h-4 w-4" />

// Or install Switch component:
npx shadcn@latest add switch
```

**Prevention:**
- Only import components that have been installed
- Check `src/components/ui/` directory before importing

---

## Authentication Errors

### ❌ Error: Multiple AuthProvider contexts

**Symptoms:**
- Authentication state inconsistencies
- "AuthProvider already exists" warnings
- Context not found errors

**Root Cause:**
AuthProvider wrapper in multiple locations (root layout + auth layout).

**Solution:**
```typescript
// Remove AuthProvider from auth layout:
// src/app/auth/layout.tsx - Remove AuthProvider wrapper

// Keep only in root layout:
// src/app/layout.tsx - Single AuthProvider wrapper
```

**Prevention:**
- Only wrap AuthProvider in root layout
- Check for duplicate providers when adding new layouts

---

### ❌ Error: Sign-in screen flash / redirect loops

**Symptoms:**
- Brief flash of login screen before redirect
- Infinite redirect loops between `/auth` and `/dashboard`
- Race conditions during authentication

**Root Cause:**
Middleware conflicts with client-side navigation.

**Solution:**
```typescript
// Disable middleware, use client-side auth protection:
// src/middleware.ts
export function middleware(request: NextRequest) {
  return NextResponse.next() // Disabled
}

// Add protection in dashboard layout:
// src/app/dashboard/layout.tsx
useEffect(() => {
  if (!loading && !user) {
    router.push('/auth')
  }
}, [user, loading, router])
```

**Prevention:**
- Use either middleware OR client-side protection, not both
- Test authentication flow thoroughly

---

## Theme and Styling Errors

### ❌ Error: Hydration mismatch with theme

**Symptoms:**
```
Warning: Text content did not match. Server: "system" Client: "dark"
```

**Root Cause:**
Theme provider not properly configured for SSR.

**Solution:**
```typescript
// Add suppressHydrationWarning to html tag:
// src/app/layout.tsx
<html lang="en" suppressHydrationWarning>

// Add mounted check to theme components:
// src/components/ui/theme-toggle.tsx
const [mounted, setMounted] = React.useState(false)

React.useEffect(() => {
  setMounted(true)
}, [])

if (!mounted) {
  return null
}
```

**Prevention:**
- Always add suppressHydrationWarning for theme providers
- Use mounted checks in theme-dependent components

---

### ❌ Error: Perfect alignment issues

**Symptoms:**
- Header and breadcrumb not aligned
- Inconsistent spacing and heights
- Visual gaps in layout

**Root Cause:**
Different height values for header and breadcrumb components.

**Solution:**
```typescript
// Ensure consistent heights:
// Header: h-12 (48px)
<header className="h-12 items-center border-b">

// Breadcrumb: h-12 (48px)
<nav className="h-12 items-center border-b">
```

**Prevention:**
- Use consistent height classes across related components
- Test alignment in different screen sizes

---

## Build and Development Errors

### ❌ Error: Cross-origin request warning

**Symptoms:**
```
⚠ Cross origin request detected from 192.168.1.200 to /_next/* resource
```

**Root Cause:**
Next.js development server accessed from different IP without configuration.

**Solution:**
```typescript
// Add to next.config.ts:
const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.200'],
}
```

**Prevention:**
- Configure allowedDevOrigins for all development IPs
- Add this during initial setup, not after development

---

### ❌ Error: Build fails with TypeScript errors

**Symptoms:**
- TypeScript compilation errors during build
- Missing type definitions
- Import path errors

**Root Cause:**
Inconsistent import paths or missing type definitions.

**Solution:**
```powershell
# Check all TypeScript errors:
pnpm build

# Fix import paths:
# Use consistent @/* alias for all imports
# Ensure all components are properly typed
```

**Prevention:**
- Run `pnpm build` frequently during development
- Use TypeScript strict mode from the start
- Consistent import patterns

---

## Quick Diagnostic Commands

```powershell
# Check file structure
find src/app -name "*.tsx" -type f

# Check for import errors
grep -r "@/components/ui/sidebar" src/

# Check for missing components
ls src/components/ui/

# Test build
pnpm build

# Check for auth provider conflicts
grep -r "AuthProvider" src/

# Check route structure
tree src/app
```

## Emergency Reset Commands

If everything breaks, reset to working state:

```powershell
# Reset to clean state
git reset --hard HEAD
pnpm install

# Or start fresh with correct structure
rm -rf src/app/auth src/app/dashboard
mkdir -p src/app/auth src/app/dashboard/settings

# Move sidebar to correct location
mv src/components/ui/sidebar.tsx src/components/layout/sidebar.tsx
```

## Testing Checklist

After fixing any error, verify:

- [ ] `pnpm dev` starts without warnings
- [ ] All routes load without 404s
- [ ] Authentication flow works
- [ ] Theme switching works
- [ ] No console errors
- [ ] Build completes successfully

## Prevention Best Practices

1. **Plan Structure First**: Design directory structure before coding
2. **Test Early, Test Often**: Test each component as you build
3. **Consistent Patterns**: Use same import patterns throughout
4. **Single Source of Truth**: One AuthProvider, one theme provider
5. **Standard Routing**: Avoid complex route group patterns for main sections
6. **Component Organization**: Move components to correct folders early
7. **Version Control**: Commit working states frequently

This troubleshooting guide covers all major issues encountered during development and provides clear solutions to avoid repeating the same mistakes.