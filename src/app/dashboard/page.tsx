'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SimpleCollapsibleContainer } from '@/components/shared/simple-collapsible-container'

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to your study app</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Card</CardTitle>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">shadcn/ui</div>
            <p className="text-xs text-muted-foreground">Composable card with header, content sections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Card</CardTitle>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Radix UI</div>
            <p className="text-xs text-muted-foreground">Flexible header with title and optional elements</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Card</CardTitle>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">TypeScript</div>
            <p className="text-xs text-muted-foreground">Main content area with proper spacing</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Card</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-sm dark:prose-invert">
              <p><strong>Technology:</strong> Radix UI + shadcn/ui</p>
              <p><strong>Purpose:</strong> Semantic heading component for card headers</p>
              <p><strong>Features:</strong></p>
              <ul>
                <li>Consistent typography scaling</li>
                <li>Automatic dark mode support</li>
                <li>Accessible heading structure</li>
                <li>Tailwind CSS styling</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <SimpleCollapsibleContainer
          title="SimpleCollapsibleContainer"
          defaultExpanded={false}
        >
          <div className="space-y-4">
            <div className="prose prose-sm dark:prose-invert">
              <h4>Component Behaviors:</h4>
              <ul>
                <li><strong>Expandable/Collapsible:</strong> Click header to toggle content visibility</li>
                <li><strong>Chevron Icons:</strong> Visual indicator showing expanded (down) or collapsed (right) state</li>
                <li><strong>Accessibility:</strong> Includes aria-expanded and aria-controls for screen readers</li>
                <li><strong>Optional Icon:</strong> Supports custom icon display in header</li>
                <li><strong>Default State:</strong> Can be set to expanded or collapsed by default</li>
                <li><strong>Smooth Transitions:</strong> Hover effects and smooth state changes</li>
                <li><strong>Flexible Content:</strong> Accepts any React children as content</li>
                <li><strong>Custom Styling:</strong> Supports additional CSS classes via className prop</li>
              </ul>
            </div>
          </div>
        </SimpleCollapsibleContainer>
      </div>
    </div>
  )
}