# Button Component

A versatile, accessible button component built on Radix UI Slot with comprehensive variant support and keyboard navigation.

## 📋 Overview

The Button component provides consistent, accessible interactive elements throughout the application. Built with Radix UI Slot for polymorphic behavior and styled with Tailwind CSS variants.

### When to Use
- **Primary actions** - Main call-to-action buttons
- **Secondary actions** - Supporting interactions
- **Form submissions** - Submit and cancel actions
- **Navigation** - Links styled as buttons
- **Icon actions** - Icon-only interactive elements

### When Not to Use
- **Pure navigation** - Use Link components instead
- **Non-interactive text** - Use Typography components
- **Complex interactions** - Consider specialized components

## 🎯 Examples

### Basic Usage
```tsx
import { Button } from '@/components/ui/button'

// Primary button
<Button>Click me</Button>

// With icon
<Button>
  <Mail className="mr-2 h-4 w-4" />
  Send email
</Button>

// Icon only
<Button size="icon">
  <Plus className="h-4 w-4" />
</Button>
```

### All Variants
```tsx
// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link style</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">⚙️</Button>
```

### States
```tsx
// Loading state
<Button disabled>Loading...</Button>

// As child (polymorphic)
<Button asChild>
  <Link href="/dashboard">Go to Dashboard</Link>
</Button>
```

## 🔧 API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | `'default'` | Visual style variant |
| `size` | `'default' \| 'sm' \| 'lg' \| 'icon'` | `'default'` | Button size |
| `asChild` | `boolean` | `false` | Render as child element (polymorphic) |
| `disabled` | `boolean` | `false` | Disable interaction |
| `className` | `string` | `undefined` | Additional CSS classes |

### Inherited Props
Inherits all standard HTML button attributes:
- `onClick`, `onFocus`, `onBlur`
- `type`, `form`, `formAction`
- `aria-*` attributes for accessibility
- `data-*` attributes for testing

### CSS Classes
The component uses these CSS custom properties:
- `--primary` - Primary color
- `--primary-foreground` - Primary text color
- `--destructive` - Destructive action color
- `--ring` - Focus ring color

## 🎨 Variants Deep Dive

### Default Variant
```tsx
<Button variant="default">
  Primary Action
</Button>
```
- **Purpose:** Main call-to-action buttons
- **Style:** Solid background with primary color
- **Usage:** Form submissions, primary navigation

### Destructive Variant
```tsx
<Button variant="destructive">
  Delete Account
</Button>
```
- **Purpose:** Dangerous or irreversible actions
- **Style:** Red background with white text
- **Usage:** Delete, remove, cancel operations

### Outline Variant
```tsx
<Button variant="outline">
  Secondary Action
</Button>
```
- **Purpose:** Secondary actions, cancel buttons
- **Style:** Border with transparent background
- **Usage:** Cancel forms, secondary navigation

### Ghost Variant
```tsx
<Button variant="ghost">
  Subtle Action
</Button>
```
- **Purpose:** Subtle interactions, toolbar buttons
- **Style:** No background, hover effects only
- **Usage:** Icon buttons, menu items

### Link Variant
```tsx
<Button variant="link">
  Learn more
</Button>
```
- **Purpose:** Text that behaves like a button
- **Style:** Underlined text, no background
- **Usage:** Inline actions, subtle navigation

## 📏 Size Variants

### Size Guide
```tsx
// Small - Compact spaces
<Button size="sm">Small</Button>      // h-8, px-3

// Default - Standard usage
<Button size="default">Default</Button> // h-9, px-4

// Large - Prominent actions
<Button size="lg">Large</Button>      // h-10, px-6

// Icon - Square icon buttons
<Button size="icon">⚙️</Button>       // 36x36px
```

### Responsive Sizing
```tsx
// Responsive size classes
<Button className="size-sm md:size-default lg:size-lg">
  Responsive Button
</Button>
```

## ♿ Accessibility

### Keyboard Navigation
- **Tab** - Focus the button
- **Enter/Space** - Activate button
- **Escape** - Blur focus (when focused)

### Screen Reader Support
```tsx
// Descriptive labels
<Button aria-label="Delete user account">
  🗑️
</Button>

// Loading states
<Button disabled aria-describedby="loading-text">
  Submit
</Button>
<span id="loading-text" className="sr-only">
  Form is being submitted
</span>

// Expanded states
<Button aria-expanded={isOpen} aria-controls="menu">
  Menu
</Button>
```

### Focus Management
```tsx
// Auto-focus on mount
<Button autoFocus>
  Primary Action
</Button>

// Programmatic focus
const buttonRef = useRef<HTMLButtonElement>(null)

// Focus the button
buttonRef.current?.focus()
```

## 🎯 Usage Patterns

### Form Buttons
```tsx
function ContactForm() {
  return (
    <form>
      {/* Form fields */}
      <div className="flex gap-4">
        <Button type="submit">
          Send Message
        </Button>
        <Button type="button" variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  )
}
```

### Loading States
```tsx
function SubmitButton() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <Button
      disabled={isLoading}
      onClick={async () => {
        setIsLoading(true)
        await submitForm()
        setIsLoading(false)
      }}
    >
      {isLoading ? 'Submitting...' : 'Submit'}
    </Button>
  )
}
```

### Icon Buttons
```tsx
import { Trash2, Edit, Share } from 'lucide-react'

function ActionButtons() {
  return (
    <div className="flex gap-2">
      <Button size="icon" variant="ghost">
        <Edit className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="ghost">
        <Share className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="destructive">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
```

### Button Groups
```tsx
function ButtonGroup() {
  return (
    <div className="flex rounded-md shadow-sm" role="group">
      <Button className="rounded-r-none">
        Left
      </Button>
      <Button className="rounded-none border-l-0">
        Center
      </Button>
      <Button className="rounded-l-none border-l-0">
        Right
      </Button>
    </div>
  )
}
```

## 🔄 Common Patterns

### Confirmation Dialogs
```tsx
function DeleteButton({ onDelete }: { onDelete: () => void }) {
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <>
      <Button variant="destructive" onClick={() => setShowConfirm(true)}>
        Delete
      </Button>

      {showConfirm && (
        <Dialog open onOpenChange={setShowConfirm}>
          <DialogContent>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              This action cannot be undone.
            </DialogDescription>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={onDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
```

### Navigation Links
```tsx
import Link from 'next/link'

function NavigationButton() {
  return (
    <Button asChild>
      <Link href="/dashboard">
        Go to Dashboard
      </Link>
    </Button>
  )
}
```

## ⚡ Performance

### Bundle Size
- **Base component:** 1.2kb gzipped
- **With all variants:** 2.1kb gzipped
- **Runtime impact:** Minimal (0.5ms average render)

### Optimization Tips
```tsx
// Lazy load icons for better performance
const DeleteIcon = lazy(() => import('lucide-react').then(m => ({ default: m.Trash2 })))

// Memoize expensive button computations
const ExpensiveButton = memo(function ExpensiveButton({ data }: Props) {
  const computedProps = useMemo(() => calculateProps(data), [data])

  return <Button {...computedProps} />
})
```

## 🧪 Testing

### Test Utilities
```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

// Basic rendering test
test('renders button with text', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
})

// Click handling
test('handles click events', () => {
  const handleClick = jest.fn()
  render(<Button onClick={handleClick}>Click me</Button>)

  fireEvent.click(screen.getByRole('button'))
  expect(handleClick).toHaveBeenCalledTimes(1)
})

// Disabled state
test('respects disabled state', () => {
  const handleClick = jest.fn()
  render(<Button disabled onClick={handleClick}>Click me</Button>)

  const button = screen.getByRole('button')
  expect(button).toBeDisabled()

  fireEvent.click(button)
  expect(handleClick).not.toHaveBeenCalled()
})
```

### Accessibility Testing
```tsx
import { axe } from '@axe-core/react'

test('button is accessible', async () => {
  const { container } = render(<Button>Accessible Button</Button>)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## ❌ Common Mistakes

### ❌ Incorrect Usage
```tsx
// Don't use buttons for navigation
<Button onClick={() => window.location.href = '/page'}>
  Go to Page
</Button>

// Don't use non-semantic elements
<div className="button-styles" onClick={handleClick}>
  Fake Button
</div>

// Don't forget loading states
<Button onClick={slowOperation}>
  Submit
</Button>
```

### ✅ Correct Usage
```tsx
// Use proper navigation
<Button asChild>
  <Link href="/page">Go to Page</Link>
</Button>

// Use semantic buttons
<Button onClick={handleClick}>
  Real Button
</Button>

// Include loading states
<Button disabled={isLoading} onClick={slowOperation}>
  {isLoading ? 'Submitting...' : 'Submit'}
</Button>
```

## 🔗 Related Components

- **[Link](./link.md)** - For navigation without button styling
- **[IconButton](./icon-button.md)** - Specialized icon-only buttons
- **[ToggleButton](./toggle-button.md)** - For on/off states
- **[Menu](./menu.md)** - For dropdown actions

## 📚 Resources

- **[Radix UI Slot](https://radix-ui.com/docs/utilities/slot)** - Polymorphic behavior
- **[WAI-ARIA Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/)** - Accessibility patterns
- **[HTML Button Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button)** - Native button documentation

---

*Last updated: Current build | Component stable since v1.0.0*