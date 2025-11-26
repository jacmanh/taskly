# Quickstart: Editable Task Viewer Inputs

## Prerequisites
- `pnpm install`
- Feature branch `001-task-viewer-edit` checked out
- Access to Task API + database (PostgreSQL) using existing dev env vars
- Feature flag `taskInlineEdit` available in config service

## Implementation Steps
1. **Shared Libraries**
   - Add `InlineEditableField` + supporting hooks in `packages/design-system/src/inline-edit/`, exposing props for labels, validation adapters, and render overrides so other domains (projects, subtasks, notes) can reuse it without task-specific coupling.
   - Extend `packages/types/src/task.ts` with helper types (`InlineEditPayload`, `InlineEditEvent`) while keeping the generic component props domain-agnostic.
   - Export telemetry constants from `packages/telemetry` for analytics events.
2. **Frontend (apps/front)**
   - Wire inline component inside task viewer page; guard entry by `permissions.canEdit`.
   - Implement `useInlineTaskEdit` hook using React Query mutation with optimistic updates + conflict handling.
   - Surface Save/Cancel controls, validation messaging, and unsaved-change dialogs.
3. **Backend (apps/api)**
   - Ensure `tasks.controller` PATCH endpoint already supports partial updates; add concurrency check when `updatedAt` present and emit audit log entry flagged as `inline`.
   - Publish telemetry/log events for success/failure paths.
4. **Documentation & Instrumentation**
   - Fire `task_inline_edit_*` client events; extend dashboard queries + alert threshold.
   - Add Storybook/MDX docs showing how to configure the generic inline component for multiple field types.

## Testing Checklist
- Jest: `pnpm test packages/design-system apps/front --filter inline-edit`
- Contract: `pnpm test apps/api --filter update-task-inline-edit.spec.ts`
- Playwright: `pnpm e2e --project front --grep @inline-edit`
- Verify analytics events in dev telemetry console and audit feed entry for each edit.

## Rollout
- Enable feature flag for internal org, run smoke checklist (edit each field + permission test).
- Monitor dashboard failure rate (<5%) for 1 hour before rolling out to all tenants.
- Keep flag kill switch documented for rollback.
