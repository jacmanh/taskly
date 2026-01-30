---
name: create-component
description: Scaffold React components with TypeScript types, hooks, and forms. Use when the user asks to create a component, scaffold a component, or add a new React component.
---

# Create React Component

## Workflow

1. **Gather requirements:**
   - Component name (PascalCase)
   - Component type: basic, stateful, or form
   - Location in `apps/front/` or `packages/design-system/`

2. **Check for existing patterns** (DRY):
   - Similar hooks in `features/*/hooks/` → reuse or extend
   - Similar forms → reference existing schema patterns
   - Query keys → use `createQueryKeys` factory if available

3. **Generate component file** following the template below

4. **For form components:** Also create a Zod schema file

## Templates

### Basic Component
```typescript
'use client';

interface {ComponentName}Props {
  // Define props here
}

export function {ComponentName}({ }: {ComponentName}Props) {
  return (
    <div>
      {/* Component content */}
    </div>
  );
}
```

### Stateful Component
```typescript
'use client';

import { useCallback, useState } from 'react';

interface {ComponentName}Props {
  onAction?: (value: string) => void;
}

interface {ComponentName}State {
  isOpen: boolean;
}

export function {ComponentName}({ onAction }: {ComponentName}Props) {
  const [state, setState] = useState<{ComponentName}State>({
    isOpen: false,
  });

  const handleOpen = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: true }));
  }, []);

  const handleClose = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <div>
      {/* Component content */}
    </div>
  );
}
```

### Form Component
```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button } from '@taskly/design-system';
import { {componentName}Schema, type {ComponentName}FormData } from '../schemas/{componentName}.schema';

interface {ComponentName}Props {
  onSubmit?: (data: {ComponentName}FormData) => Promise<void>;
}

export function {ComponentName}({ onSubmit }: {ComponentName}Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<{ComponentName}FormData>({
    resolver: zodResolver({componentName}Schema),
  });

  const onFormSubmit = async (data: {ComponentName}FormData) => {
    if (onSubmit) {
      await onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <Input
        label="Field"
        error={errors.field?.message}
        disabled={isSubmitting}
        {...register('field')}
      />
      <Button type="submit" disabled={isSubmitting || !isValid} loading={isSubmitting}>
        Submit
      </Button>
    </form>
  );
}
```

### Zod Schema (for form components)
```typescript
import { z } from 'zod';

export const {componentName}Schema = z.object({
  field: z.string().min(1, 'Field is required'),
});

export type {ComponentName}FormData = z.infer<typeof {componentName}Schema>;
```

## DRY Checklist

Before creating new code, check:
- [ ] Does a similar hook exist in `features/*/hooks/`? → Extend it
- [ ] Does a similar form exist? → Reference its schema pattern
- [ ] Are there 2+ similar patterns? → Consider extracting to shared utility

## Rules

- Use `'use client'` for interactive components
- Use `useCallback` for all handlers
- Import from `@taskly/design-system` for UI primitives
- **Never** export from index.ts - import components directly
- **Reuse** existing hooks and patterns when possible
