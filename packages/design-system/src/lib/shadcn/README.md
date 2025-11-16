# shadcn/UI Primitives

This folder contains the base primitives from [shadcn/ui](https://ui.shadcn.com). These are internal components built on Radix UI and should **NOT** be imported directly in applications.

## 📋 Purpose

These primitives serve as the foundation for higher-level components in the design system. They provide:

- Base UI behavior (dialogs, popovers, etc.)
- Radix UI integration
- Tailwind styling foundation

## 🚫 Do NOT import from here directly

❌ **Wrong:**
```tsx
import { Sheet, SheetContent } from '@taskly/design-system/lib/shadcn/sheet';
```

✅ **Right:**
```tsx
import { Drawer } from '@taskly/design-system';
```

## ✅ Only import from here when building new components within design-system

If you're creating a new composite component (e.g., `Modal`, `Sidebar`, etc.), you can use these primitives:

```tsx
// In packages/design-system/src/components/modal.tsx
import { 
  Sheet, 
  SheetContent, 
  SheetHeader 
} from '../lib/shadcn/sheet';

export function Modal(props) {
  return (
    <Sheet {...props}>
      <SheetContent>
        {/* Your custom Modal logic */}
      </SheetContent>
    </Sheet>
  );
}
```

## 📦 Contents

- `sheet.tsx` - Dialog/Drawer primitive from Radix UI
- `index.ts` - Exports documentation

## 🔄 Adding new primitives

To add a new shadcn component:

1. Create a new file (e.g., `dialog.tsx`)
2. Add the component code
3. Export it from `index.ts` with a comment warning
4. Create a composite in `../components/` if needed
5. Export the composite from `src/index.ts`

## 📚 References

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Radix UI Documentation](https://www.radix-ui.com)
