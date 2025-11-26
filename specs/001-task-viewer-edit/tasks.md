# Tasks: Editable Task Viewer Inputs

**Input**: Design documents from `/specs/001-task-viewer-edit/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare feature flagging, doc scaffolding, and testing toggles before coding starts.

- [X] T001 Add `taskInlineEdit` feature flag defaults (off in prod) in `apps/front/config/featureFlags.ts`
- [X] T002 Create rollout/rollback playbook referencing telemetry + flag steps in `docs/features/task-inline-edit.md`
- [X] T003 [P] Add Playwright env toggle to enable `taskInlineEdit` in `apps/front/tests/playwright.config.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared libraries and contracts required by all user stories.

- [ ] T004 Create generic `InlineEditableField` scaffold with read/edit states plus label/ARIA slots in `packages/design-system/src/inline-edit/InlineEditableField.tsx`
- [ ] T005 [P] Implement shared hook `useInlineEditableField` handling focus + keyboard in `packages/design-system/src/inline-edit/useInlineEditableField.ts`
- [ ] T006 Extend shared payload + telemetry types (`InlineEditPayload`, `InlineEditEvent`) in `packages/types/src/task.ts`
- [ ] T007 [P] Add telemetry constants (`task_inline_edit_*`) and docstrings in `packages/telemetry/src/events.ts`

**Checkpoint**: Generic inline-edit primitives + shared types ready for consumption.

---

## Phase 3: User Story 1 - Inline edit core task details (Priority: P1) 🎯 MVP

**Goal**: Editors can modify title, description, status, and due date inline within the task viewer using the reusable components.

**Independent Test**: From a seeded task, toggle each field into edit mode, update, and verify inline save confirmation + updated activity entry without reload.

### Tests (write before implementation)

- [ ] T008 [P] [US1] Add Jest/RTL coverage for `InlineEditableField` read→edit transitions, focus order, and `aria-*` labels in `apps/front/tests/unit/task-viewer-inline-edit.test.tsx`
- [ ] T009 [P] [US1] Add Jest/RTL tests for inline validation/error states (blank title, past due date) in `apps/front/tests/unit/task-viewer-inline-edit.test.tsx`
- [ ] T010 [US1] Add Playwright scenario `@inline-edit-core` covering title/description/status/dueDate edits with optimistic save + conflict handling in `apps/front/tests/e2e/inline-edit.spec.ts`
- [ ] T011 [US1] Add Playwright scenario `@inline-edit-offline` verifying offline/API failure retry flow in `apps/front/tests/e2e/inline-edit.spec.ts`
- [ ] T012 [P] [US1] Add visual/Storybook regression tests validating light/dark themes and desktop/tablet breakpoints in `packages/design-system/src/inline-edit/InlineEditableField.stories.mdx`
- [ ] T013 [US1] Record Pact-style contract test for PATCH `/tasks/{id}` covering optimistic update + validation errors in `apps/api/tests/contract/update-task-inline-edit.spec.ts`

### Observability & Success Metrics

- [ ] T014 [US1] Fire `task_inline_edit_started/saved/cancelled/failed` events (including durationMs + outcome) via `packages/telemetry` inside `apps/front/components/task-viewer/InlineField.tsx`
- [ ] T015 [US1] Build dashboard queries + alert thresholds for SC-001–SC-003 in `docs/features/task-inline-edit.md` and telemetry tooling
- [ ] T016 [US1] Document feature flag kill switch, smoke checklist, and dashboard verification steps in `docs/features/task-inline-edit.md`

### Implementation

- [ ] T017 [US1] Implement `useInlineTaskEdit` (React Query mutation w/ optimistic cache + conflict handler) in `apps/front/components/task-viewer/hooks/useInlineEdit.ts`
- [ ] T018 [P] [US1] Replace static fields with `InlineEditableField` instances (supplying descriptive labels/ARIA props) for title/description/status/dueDate in `apps/front/app/(tasks)/[taskId]/page.tsx`
- [ ] T019 [US1] Implement inline validation + error messaging surfaces inside `packages/design-system/src/inline-edit/InlineEditableField.tsx`
- [ ] T020 [US1] Add optimistic mutation success handling + toast confirmations in `apps/front/components/task-viewer/InlineField.tsx`
- [ ] T021 [US1] Handle offline/API failure states (retain value, show error banner, allow retry + telemetry) in `apps/front/components/task-viewer/InlineField.tsx`
- [ ] T022 [US1] Update `apps/api/src/modules/tasks/tasks.controller.ts` to honor `updatedAt` token and return 409 with latest snapshot on conflict
- [ ] T023 [US1] Ensure `apps/api/src/modules/tasks/tasks.service.ts` emits audit entry metadata for inline edits

**Checkpoint**: All supported fields editable inline with validation, telemetry, success metrics, and backend contract compliance.

---

## Phase 4: User Story 2 - Manage edits safely (Priority: P2)

**Goal**: Users can cancel edits confidently and receive warnings before leaving with unsaved changes.

**Independent Test**: Start editing a field, cancel to ensure original value persists; attempt navigation with dirty state and confirm warning dialog blocks exit until confirmed.

### Tests (write before implementation)

- [ ] T024 [P] [US2] Extend unit tests for dirty-state reducer + Escape/Cancel behavior in `apps/front/tests/unit/task-viewer-inline-edit.test.tsx`
- [ ] T025 [US2] Add Playwright scenario `@inline-edit-unsaved` validating cancel + leave-warning flows in `apps/front/tests/e2e/inline-edit.spec.ts`

### Observability & Rollback

- [ ] T026 [US2] Emit telemetry outcome `validation_error`/`cancelled` metrics via `packages/telemetry/src/events.ts` and surface chart annotations in `docs/features/task-inline-edit.md`

### Implementation

- [ ] T027 [US2] Add unsaved-changes dialog shell in `apps/front/components/task-viewer/UnsavedChangesDialog.tsx`
- [ ] T028 [US2] Centralize dirty tracking + Escape/Cancel shortcuts within `packages/design-system/src/inline-edit/InlineEditableField.tsx`
- [ ] T029 [US2] Prevent route changes while dirty by integrating dialog + confirmation flow in `apps/front/app/(tasks)/[taskId]/page.tsx`

**Checkpoint**: Inline edits safeguard against accidental loss with reusable dirty-state handling and telemetry on cancellations.

---

## Phase 5: User Story 3 - Respect permissions and audit trail (Priority: P3)

**Goal**: Read-only users cannot enter edit mode, and each saved edit records a visible audit trail entry.

**Independent Test**: Verify read-only account sees tooltips instead of inputs; verify audit feed entry after edit includes actor, field, and timestamp.

### Tests (write before implementation)

- [ ] T030 [P] [US3] Add Jest/RTL test ensuring InlineEditableField respects `canEdit` prop in `apps/front/tests/unit/task-viewer-inline-edit.test.tsx`
- [ ] T031 [US3] Add Playwright scenario `@inline-edit-permissions` ensuring view-only accounts cannot edit in `apps/front/tests/e2e/inline-edit.spec.ts`
- [ ] T032 [US3] Add backend contract test verifying audit record payloads in `apps/api/tests/contract/update-task-inline-edit.spec.ts`

### Observability & Rollback

- [ ] T033 [US3] Ensure audit feed UI surfaces inline edit metadata by updating `apps/front/components/task-viewer/ActivityFeed.tsx`

### Implementation

- [ ] T034 [US3] Gate InlineEditableField render with `permissions.canEdit` and tooltip messaging in `apps/front/components/task-viewer/InlineField.tsx`
- [ ] T035 [US3] Enforce permission + audit logging logic in `apps/api/src/modules/tasks/tasks.service.ts`
- [ ] T036 [US3] Update `apps/api/prisma/schema.prisma` seed/fixtures if needed for audit samples and re-run migrations/tests

**Checkpoint**: Permissions + audit visibility aligned with business rules.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T037 [P] Publish Storybook/MDX usage docs (light/dark, responsive examples) in `packages/design-system/src/inline-edit/InlineEditableField.stories.mdx`
- [ ] T038 Document Quickstart validation + post-deploy checklist results in `specs/001-task-viewer-edit/quickstart.md`
- [ ] T039 Run end-to-end regression suite + lint/format to ensure stability (`pnpm lint && pnpm test && pnpm e2e`)
- [ ] T040 Coordinate with support ops to tag "inline edit" tickets and log pre/post counts for SC-004 in `docs/features/task-inline-edit.md`

---

## Dependencies & Execution Order

1. **Phase 1 → Phase 2**: Feature flag + docs must exist before shared libs so stakeholders understand rollout.
2. **Phase 2 → User Stories**: Generic inline-edit primitives, shared types, and telemetry constants are prerequisites for every story.
3. **User Story Priority**: Execute in order US1 (core editing) → US2 (safety) → US3 (permissions/audit). Later stories rely on earlier UI scaffolding but remain independently testable once prerequisites complete.
4. **Polish** begins after desired user stories are accepted.

## Parallel Execution Opportunities

- Library scaffolding tasks `T004`/`T005` can proceed in parallel once feature flags (Phase 1) land.
- Frontend + backend contract tests (`T008`–`T013`, `T030`–`T032`) can run concurrently while implementation tasks are in progress.
- Within each story, UI wiring (`T018`, `T027`, `T034`) and backend enforcement (`T022`, `T029`, `T035`) can be parallelized after shared contracts are ready, thanks to strict file separation.

## Implementation Strategy

- **MVP (Story US1)** delivers inline editing for core fields with validation, offline handling, telemetry, and success-metric dashboards; release behind feature flag to validate quickly.
- Subsequent stories enhance safety (US2) and governance (US3) without blocking MVP adoption; each story retains independent acceptance criteria and tests to honor Progressive UX Delivery.
- Follow quickstart instructions for testing order: library tests → contract tests → Playwright flows → telemetry verification, ensuring contract-driven validation before shipping.
