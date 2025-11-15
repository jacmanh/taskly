# Reference Template - React & Next.js Best Practices

This document serves as a reference for generating React and Next.js code following best practices.

## Structure of a React/Next.js Component

### Client Component with TypeScript Types

```typescript
'use client';

import { useCallback, useState } from 'react';

// Types for props
interface ComponentProps {
  title: string;
  onAction?: (value: string) => void;
  children?: React.ReactNode;
}

// Types for state
interface ComponentState {
  isOpen: boolean;
  selectedValue: string | null;
}

export function ComponentName({
  title,
  onAction,
  children,
}: ComponentProps) {
  // Typed state
  const [state, setState] = useState<ComponentState>({
    isOpen: false,
    selectedValue: null,
  });

  // Typed handlers with useCallback
  const handleOpen = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: true }));
  }, []);

  const handleClose = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleSelect = useCallback(
    (value: string) => {
      setState((prev) => ({ ...prev, selectedValue: value }));
      if (onAction) {
        onAction(value);
      }
    },
    [onAction]
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {children && <div className="mt-4">{children}</div>}
      <div className="mt-4 space-y-2">
        <button
          onClick={handleOpen}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          Open
        </button>
        {state.isOpen && state.selectedValue && (
          <p className="text-sm text-gray-600">Selected: {state.selectedValue}</p>
        )}
      </div>
    </div>
  );
}
```

### Form Component with React Hook Form & Zod

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button } from '@taskly/design-system';
import { formSchema, type FormData } from '@features/schemas/form.schema';

interface FormComponentProps {
  onSubmit?: (data: FormData) => Promise<void>;
}

export function FormComponent({ onSubmit }: FormComponentProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onFormSubmit = async (data: FormData) => {
    if (onSubmit) {
      await onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <Input
        type="email"
        label="Email"
        placeholder="your@email.com"
        error={errors.email?.message}
        disabled={isSubmitting}
        {...register('email')}
      />
      <Button
        type="submit"
        disabled={isSubmitting || !isValid}
        loading={isSubmitting}
      >
        Submit
      </Button>
    </form>
  );
}
```

## Key Points to Follow

### TypeScript & Code Quality
1. **TypeScript Types** - Always type props, state, function parameters, and return types
2. **Error Handling** - Use try/catch with typed error messages
3. **Validation** - Validate data before use (params, body, form input, etc.)
4. **Naming Conventions** - Components in PascalCase, functions/variables in camelCase

### React Patterns
5. **'use client'** - Use only for components that require interactivity
6. **useCallback** - Use for functions passed as props or in dependencies to prevent unnecessary re-renders
7. **Conditional Rendering** - Handle loading/error states before rendering main content
8. **Import Order** - Use `import type` for types only, separate from regular imports

### Forms & Validation
9. **React Hook Form + Zod** - Use for robust form handling and validation
10. **Design System Components** - Use `Input`, `Button` from `@taskly/design-system` for consistent UI
11. **Form State** - Utilize `formState` (errors, isSubmitting, isValid) for better UX

### Project Structure
12. **Direct Imports** - **NEVER export components from an index.js/index.ts file (except for design-system package). Always import components directly from their file path.**

    ✅ **Correct:**
    ```typescript
    import { ComponentName } from './components/component-name';
    import { Input } from '@taskly/design-system';
    ```

    ❌ **Incorrect:**
    ```typescript
    import { ComponentName } from './components';
    import { Input } from '@taskly/design-system/components';
    ```
