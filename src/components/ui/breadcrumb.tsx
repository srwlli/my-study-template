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

// Route mapping for My Study App
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

  // Always start with dashboard/home
  breadcrumbs.push({
    label: 'Dashboard',
    href: '/dashboard',
    isActive: pathname === '/dashboard' || pathname === '/',
  });

  // Build breadcrumb path
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

  // Don't show breadcrumbs on dashboard/home
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