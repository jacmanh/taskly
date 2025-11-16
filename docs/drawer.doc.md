# Drawer Component

## Overview

The `Drawer` component is a customizable, right-side drawer built on top of the Radix UI Dialog primitive. It follows your design specifications with a responsive layout that adapts to mobile devices.

**Location**: `packages/design-system/src/components/drawer.tsx`

## Features

- **Width**: 420px on desktop, full-screen on mobile
- **Overlay**: Semi-transparent (20% opacity) with the page visible behind but non-interactive
- **Fixed Height**: 100vh with sticky header and footer
- **Header**: Contains title, optional description, and close button
- **Content**: Scrollable middle section
- **Footer**: Sticky bottom with primary and secondary actions

## Architecture

The Drawer is built as a **composite** component on top of the internal `Sheet` primitive located in `lib/shadcn/`.

- **Primitive**: `lib/shadcn/sheet.tsx` (internal, not exported)
- **Composite**: `components/drawer.tsx` (public API)

See `packages/design-system/ARCHITECTURE.md` for more details.

## Props

```typescript
interface DrawerProps {
  isOpen: boolean;                    // Controls drawer visibility
  onOpenChange: (open: boolean) => void; // Callback when drawer opens/closes
  title?: React.ReactNode;            // Optional when using Drawer.Header
  description?: React.ReactNode;      // Optional description below title
  children?: React.ReactNode;         // Main content of the drawer
  className?: string;                 // Custom classes for the drawer
  headerClassName?: string;           // Custom classes for header
  contentClassName?: string;          // Custom classes for content area
  footerClassName?: string;           // Custom classes for footer
  footer?: React.ReactNode;           // Optional footer fallback
}

/**
 * Header slot helper – renders inside the sticky header
 */
function Drawer.Header(props: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}): null;

/**
 * Footer slot helper – renders inside the sticky footer
 */
function Drawer.Footer(props: {
  children?: React.ReactNode;
  className?: string;
}): null;
```

## Usage Example

```tsx
'use client';

import { useState } from 'react';
import { Drawer } from '@taskly/design-system';

export function DrawerExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePrimaryAction = async () => {
    setIsLoading(true);
    try {
      // Your action here
      await new Promise(resolve => setTimeout(resolve, 2000));
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Open Drawer
      </button>

      <Drawer isOpen={isOpen} onOpenChange={setIsOpen}>
        <Drawer.Header
          title="Create New Project"
          description="Fill in the details below to create a new project"
        />

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Project Name</label>
            <input
              type="text"
              placeholder="Enter project name"
              className="w-full mt-1 px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              placeholder="Enter project description"
              className="w-full mt-1 px-3 py-2 border rounded-md"
              rows={4}
            />
          </div>
        </div>

        <Drawer.Footer>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="border rounded-md px-4 py-2 w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePrimaryAction}
            disabled={isLoading}
            className="bg-primary-600 text-white rounded-md px-4 py-2 w-full sm:w-auto"
          >
            {isLoading ? 'Saving…' : 'Create'}
          </button>
        </Drawer.Footer>
      </Drawer>
    </>
  );
}
```

## Styling

The drawer uses Tailwind CSS with the theme colors from your design system:

- **Primary colors** for the primary action button
- **Secondary colors** for backgrounds, borders, and text
- **Responsive breakpoints** for mobile adaptation

### Customization

You can override any styling by passing custom classes:

```tsx
<Drawer
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  title="My Drawer"
  contentClassName="bg-blue-50"
  footerClassName="bg-blue-100"
  // ... other props
>
  {/* content */}
</Drawer>
```

## Responsive Behavior

- **Desktop (sm and up)**: Fixed width of 420px, positioned on the right side
- **Mobile**: Full screen width, still positioned on the right but fills the viewport

The drawer uses Tailwind's responsive utilities and Radix UI's animation system for smooth transitions.

## Accessibility

- Built on Radix UI Dialog primitive with full ARIA support
- Keyboard support: Escape key closes the drawer
- Screen reader support with proper labels and descriptions
- Focus management during open/close states
