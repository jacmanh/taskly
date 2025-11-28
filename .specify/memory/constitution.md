<!--
Sync Impact Report
Version change: 1.0.0 -> 1.0.1
Modified principles:
- III. Contract-Driven Testing (Added: Test Selector Priority rule)
Added sections:
- Amendment History
Removed sections:
- None
Templates requiring updates:
- No template changes required (PATCH version - clarification only)
Follow-up TODOs:
- None
Previous Sync (0.0.0 -> 1.0.0):
- Established 5 core principles, Architecture Constraints, Development Workflow
- Updated all templates (.specify/templates/*.md)
-->

# Taskly Constitution

## Core Principles

### I. Shared Contract Authority
- All domain models, Prisma schemas, and API contracts originate in `packages/types` and `apps/api/prisma/schema.prisma`; no feature may redefine request/response shapes locally.
- Any contract change MUST declare migration notes, affected clients, and regression tests for both API (`apps/api`) and frontend (`apps/front`).
- Breaking changes require an opt-in flag or backwards-compatible field deprecation path approved in the plan/spec before merge.
**Rationale**: One canonical contract keeps Taskly's multi-surface experience (web, API, automations) stable and prevents drift between apps.

### II. Feature Libraries First
- Every capability ships first as an Nx library (`packages/*` or `libs/*`) with typed exports, Storybook or MDX docs, and usage examples before wiring inside apps.
- Applications (`apps/front`, `apps/api`) may only coordinate libraries; domain logic, validation, and formatting stay in the shared layer.
- Library public APIs MUST remain cohesive and semantically versioned; tree-shaking requires side-effect-free modules.
**Rationale**: Library-first delivery keeps the monorepo modular, reusable, and testable while enabling multiple entry points to share the same behavior.

### III. Contract-Driven Testing
- Each user story begins by defining failing contract/integration tests (Playwright, Pact, or Jest) that cover acceptance scenarios before implementation starts.
- Tests run per story and per library; no feature is "done" until CI proves API + UI contracts and fixtures succeed independently.
- Mock data MUST mirror the shared types package and be version pinned to surface incompatible changes immediately.
- **Test Selector Priority**: All frontend tests MUST use semantic queries in this order: (1) role + accessible name (`getByRole('button', { name: /save/i })`), (2) ARIA attributes (`getByLabelText`, `aria-label`), (3) form values (`getByDisplayValue`), (4) container queries only when necessary. Tests MUST NOT use `data-testid`, text content queries (`getByText`), CSS classes (`toHaveClass`), or HTML structure checks (`tagName`, `type`). Every interactive element requires proper `aria-label` or accessible name for test queries.
**Rationale**: Contract-first tests guarantee Taskly's distributed surfaces stay reliable and document the behavior better than prose. Accessibility-first test selectors ensure components are usable by assistive technologies and prevent implementation detail coupling.

### IV. Observable Task Lifecycles
- All API endpoints, background jobs, and cron flows emit structured logs with correlation IDs plus success/failure metrics via the shared logging utility.
- Critical domain events (task creation, assignment, completion, reminders) publish telemetry that dashboards can alert on within five minutes.
- Feature specs must describe how to monitor and roll back their changes; absence of observability tasks blocks merge.
**Rationale**: Deep insight into task states ensures we can trust automation, debug regressions quickly, and honor SLAs.

### V. Progressive UX Delivery
- Each feature slices into independently releasable stories (P1, P2, ...) where the frontend delivers accessible, design-system-compliant UX before enhancements.
- Data fetching hooks (`packages/types` + React Query) enforce type-safe, cached reads; UI states (loading, empty, error) are mandatory.
- Dark mode, keyboard navigation, and responsive breakpoints MUST be validated for every new UI surface.
**Rationale**: Incremental UX delivery keeps Taskly demoable at all times, guards accessibility, and reduces integration risk.

## Architecture Constraints

- Nx monorepo with Next.js (`apps/front`) and NestJS (`apps/api`) is mandatory; no additional runtimes without governance approval.
- PostgreSQL via Prisma is the single source of truth and migrations live beside the API app; design changes require concurrent ERD + schema updates.
- Shared UI lives in `packages/design-system`; frontend code must consume these primitives rather than ad-hoc components.
- Shared validation, DTOs, and events belong in `packages/types`; services import only from there to keep IDE inference reliable.
- CI orchestrates `pnpm` scripts; all tools must support workspace-aware execution to preserve deterministic builds.

## Development Workflow & Quality Gates

- `/speckit.specify` captures user stories prioritized by independent release value; `/speckit.plan` documents libraries touched, schema impacts, and Constitution checks before implementation.
- Every plan enumerates a Constitution Check table referencing the five principles and explicitly marking pass/fail with remediation steps.
- `/speckit.tasks` groups work by user story, forcing contract tests and instrumentation subtasks ahead of feature wiring per Principle III and IV.
- Reviews verify: library-first structure respected, tests were written and run, observability requirements delivered, and UX criteria validated against the design system.
- Releases follow: Plan -> Research -> Spec -> Tasks -> Implementation -> Telemetry validation -> Demo, with rollback ready before deployment.

## Governance

- This constitution supersedes other guidelines; reviewers block merges that violate any principle without a documented exception signed off by tech lead + product.
- Amendments require RFC-style PRs referencing affected sections, migration notes, and version bump type; all dependent templates must be updated in the same change set.
- Semantic versioning applies: MAJOR for breaking/removal of principles, MINOR for new principles/sections, PATCH for clarifications. Version metadata lives in this file and referenced plans.
- A weekly governance review audits at least one merged feature for compliance; findings feed into the shared `docs/sprint-artifacts` space.
- Runtime guidance (README, docs/*) must reference this constitution when onboarding contributors; deviations require recorded waivers that expire after the release.

**Version**: 1.0.1 | **Ratified**: 2025-11-26 | **Last Amended**: 2025-11-26

## Amendment History

### v1.0.1 (2025-11-26) - PATCH
**Added**: Test Selector Priority rule to Principle III (Contract-Driven Testing)
- Mandates accessibility-first test selectors (role, aria) over implementation details
- Prohibits `data-testid`, `getByText`, CSS class checks, and HTML structure queries
- Requires proper `aria-label` on interactive elements for semantic test queries
**Impact**: Improves test maintainability and enforces WCAG compliance in all UI components
