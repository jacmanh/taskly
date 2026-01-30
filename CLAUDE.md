# Taskly - Project Context for Claude

## Overview
Taskly is a task management application built as an Nx monorepo.

## Tech Stack
- **Frontend**: Next.js 14+ with App Router, React, TypeScript, Tailwind CSS
- **Backend**: NestJS 11, Prisma ORM, PostgreSQL
- **Monorepo**: Nx workspace with pnpm
- **Validation**: Zod (frontend), class-validator (backend)

## Project Structure
```
apps/
  front/          # Next.js frontend
  api/            # NestJS backend
packages/
  design-system/  # Shared UI components
  types/          # Shared TypeScript types
  data-access/    # API client and hooks
```

## Architecture Patterns

### Frontend (apps/front)
- Use `'use client'` only for interactive components
- Forms: React Hook Form + Zod validation
- Import UI components from `@taskly/design-system`
- **Never** use barrel exports (index.ts) - import directly from file paths

### Backend (apps/api)
- **3-Layer Architecture**: Controller → Service → Repository → Prisma
- Controllers: HTTP handling only (no business logic, no Prisma)
- Services: Business logic only (no HTTP, no Prisma)
- Repositories: Prisma queries only (no business logic)
- DTOs: Use class-validator decorators (NOT Zod)

### Prisma Conventions
- Model names: PascalCase, singular (e.g., `User`, `Workspace`)
- Table names: snake_case, plural via `@@map()` (e.g., `users`, `workspaces`)
- Always use `@@map()` on every model
- IDs: `@id @default(cuid())`

## Key Commands
```bash
pnpm dev          # Run both frontend and API
pnpm dev:front    # Run frontend only
pnpm dev:api      # Run API only
pnpm build        # Build all
pnpm lint         # Lint all
```

## Documentation
See `docs/` for detailed patterns:
- `component.doc.md` - React component patterns
- `controller.doc.md` - NestJS architecture
- `drawer.doc.md` - Design system usage
- `prisma.doc.md` - Database conventions

## Code Pattern References

For detailed code templates and DRY patterns, read these files:
- `.cursor/rules/react-patterns.mdc` - React/Next.js patterns, design system usage
- `.cursor/rules/nestjs-backend.mdc` - NestJS 3-layer architecture, utility patterns
- `.cursor/rules/prisma-conventions.mdc` - Prisma naming conventions

For scaffolding workflows:
- `.cursor/skills/create-component/SKILL.md` - React component scaffolding
- `.cursor/skills/create-nestjs-module/SKILL.md` - NestJS module scaffolding
