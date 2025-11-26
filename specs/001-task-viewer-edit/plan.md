# Implementation Plan: Editable Task Viewer Inputs

**Branch**: `[001-task-viewer-edit]` | **Date**: 2025-11-26 | **Spec**: [`specs/001-task-viewer-edit/spec.md`](./spec.md)
**Input**: Feature specification from `/specs/001-task-viewer-edit/spec.md`

## Summary

Deliver inline editing for key task fields (title, description, status, due date) directly inside the existing task viewer in `apps/front`, with permission-aware affordances, autosave safeguards, validation parity with the API, theme-aware/responsive UX, and audit/telemetry hooks to keep edits observable without page reloads. The inline edit primitives must be generic design-system libraries that can power future modules beyond tasks while emitting metrics that prove the success criteria.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript (Node 18 runtime for Next.js frontend, NestJS backend)  
**Primary Dependencies**: Next.js App Router, React 18, `packages/design-system` components, React Query data hooks, NestJS task update endpoint, shared validators in `packages/types`  
**Storage**: PostgreSQL accessed through Prisma schema in `apps/api/prisma/schema.prisma`  
**Testing**: Jest + React Testing Library for component/unit, Playwright for story-level UX, Pact/contract tests for task update API  
**Target Platform**: Web (modern evergreen browsers, responsive desktop/tablet)  
**Project Type**: Nx monorepo with `apps/front` (Next.js) and `apps/api` (NestJS) consuming shared packages  
**Performance Goals**: Inline field edits round-trip in <1s p95, validation feedback within 200ms locally, zero extra page reloads  
**Constraints**: Must preserve accessibility for keyboard users with basic ARIA labels (no bespoke screen-reader flows), respect existing permission model, avoid regressions to task viewer layout, behind feature flag for rollback  
**Scale/Scope**: Applies to all active Taskly tenants (~20k daily active tasks) with concurrent editors; touches 4 core fields today with pattern reusable for others

## Phase 0: Research Summary

- **Inline edit UX**: Adopt a reusable `InlineEditableField` inside `packages/design-system` to manage read/edit states, validation messaging, focus traps, and Save/Cancel affordances consistently across supported fields.
- **Data updates + conflicts**: Use React Query `useMutation` optimistic writes carrying `updatedAt` tokens; backend returns 409 with latest snapshot to trigger conflict banner + retry, keeping perceived latency <1s.
- **Telemetry + auditing**: Fire `task_inline_edit_*` analytics via shared telemetry lib, and flag backend audit log entries as inline edits with metadata for dashboards + alerting.

Research artifacts stored in [`specs/001-task-viewer-edit/research.md`](./research.md).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Assessment (PASS/FAIL) | Evidence / Remediation |
|-----------|-----------------------|------------------------|
| I. Shared Contract Authority | PASS | Reuse existing `UpdateTaskInput` in `packages/types` / `apps/api/prisma/schema.prisma`; no new schema fields, only client consumption. Any future field additions follow shared types PR reviewed by platform owner. |
| II. Feature Libraries First | PASS | Inline edit UX built as reusable components/hooks inside `packages/design-system` + `packages/types` validators; `apps/front` wires them with minimal glue. No business logic stays in app layer. |
| III. Contract-Driven Testing | PASS | Add Playwright scenarios for inline edit stories plus Jest tests around new hook; add Pact/contract test covering optimistic update + audit logging before implementation. |
| IV. Observable Task Lifecycles | PASS | Spec requires analytics events (`task_inline_edit_*`) and dashboard alerting; plan includes instrumentation backlog and rollout guard with feature flag + smoke checklist. |
| V. Progressive UX Delivery | PASS | Stories sliced P1-P3 with accessibility acceptance criteria (keyboard focus, tooltips, read-only view). Feature flag + per-story release ensures incremental delivery. |

**Validation Notes**:
- Contract updates MUST reference the exact files (`packages/types`, `apps/api/prisma/schema.prisma`, OpenAPI docs) and specify rollback.
- Plans lacking pre-implementation tests or telemetry tasks are rejected until Principle III/IV rows read PASS.
- Accessibility coverage (dark mode, keyboard, responsive) is non-negotiable for any UI work per Principle V.

**Post-Phase-1 Recheck**: Research + design artifacts confirm shared contracts, telemetry, and library-first approach remain intact—no new risks identified; all principles stay PASS.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
apps/
├── front/
│   ├── app/(tasks)/[taskId]/page.tsx        # Task viewer shell consuming shared libs
│   ├── components/task-viewer/InlineField.tsx
│   ├── components/task-viewer/hooks/useInlineEdit.ts
│   └── tests/
│       ├── unit/task-viewer-inline-edit.test.tsx
│       └── e2e/inline-edit.spec.ts
└── api/
    ├── src/modules/tasks/tasks.controller.ts
    ├── src/modules/tasks/tasks.service.ts
    ├── prisma/schema.prisma
    └── tests/contract/update-task-inline-edit.spec.ts

packages/
├── design-system/src/inline-edit/InlineEditableField.tsx
├── types/src/task.ts
└── telemetry/src/events.ts
```

**Structure Decision**: Web application (Next.js frontend + NestJS API) using shared Nx libraries; core logic goes into `packages/design-system` + `packages/types`, with apps limited to orchestration/tests.

## Phase 1: Design & Contract Outputs

- [`data-model.md`](./data-model.md) captures Task, TaskActivityEntry, and telemetry payload definitions plus validation + concurrency rules.
- [`contracts/task-inline-edit.openapi.yaml`](./contracts/task-inline-edit.openapi.yaml) formalizes the PATCH endpoint request/response, validation errors, and conflict handling for inline edits.
- [`quickstart.md`](./quickstart.md) guides engineers through shared lib updates, frontend wiring, backend enforcement, instrumentation, testing, and rollout sequencing.
- Telemetry dashboards and support-ticket tagging approach documented alongside `docs/features/task-inline-edit.md` to prove SC-001–SC-004.

Agent context updated via `.specify/scripts/bash/update-agent-context.sh codex` to reflect Next.js/NestJS/Prisma stack for this feature.

## Complexity Tracking

No constitutional violations identified; section intentionally left empty.
