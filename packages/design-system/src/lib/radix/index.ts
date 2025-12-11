/**
 * Shadcn/UI Primitives
 *
 * This folder contains the base primitives from shadcn/ui.
 * These are internal components and should NOT be imported directly in applications.
 *
 * Instead, use the composites in packages/design-system/src/components/ like:
 * - Drawer
 * - (future composites built on these primitives)
 *
 * Only import from here if you're building new components within the design-system.
 */

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from './Sheet';

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from './AlertDialog';
