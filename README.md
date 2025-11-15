# Taskly

A task management application built with NX monorepo.

## Structure

- `apps/front` - Next.js frontend application
- `apps/api` - Nest.js backend API
- `packages/design-system` - Shared design system components
- `packages/types` - Shared TypeScript types and models

## Getting Started

Install dependencies:
```bash
pnpm install
```

## Development

Run frontend:
```bash
pnpm dev:front
```

Run API:
```bash
pnpm dev:api
```

Run both:
```bash
pnpm dev
```

## Build

Build all:
```bash
pnpm build
```

Build frontend:
```bash
pnpm build:front
```

Build API:
```bash
pnpm build:api
```

## Production

Start frontend:
```bash
pnpm start:front
```

Start API:
```bash
pnpm start:api
```

