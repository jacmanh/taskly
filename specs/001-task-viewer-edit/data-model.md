# Data Model: Editable Task Viewer Inputs

## Entities

### Task
| Field | Type | Source of Truth | Notes |
|-------|------|-----------------|-------|
| id | UUID | `apps/api` Prisma `Task` | Immutable identifier used across UI + API |
| title | string (1-140 chars) | Prisma `Task.title` | Required; trimmed; inline edit validates non-empty |
| description | string (0-5000 chars) | Prisma `Task.description` | Supports markdown; optional but stored as empty string not null |
| status | enum (`OPEN`, `IN_PROGRESS`, `BLOCKED`, `DONE`) | Prisma `Task.status` | Inline select reuses shared enum; transitions limited by backend rules |
| dueDate | ISO 8601 date string | Prisma `Task.dueDate` | Nullable; must be today or future |
| updatedAt | datetime | Prisma `Task.updatedAt` | Used for optimistic concurrency token |
| permissions | object `{ canEdit: boolean, canView: boolean }` | Derived from membership | Drives whether inline edit is enabled |

### TaskActivityEntry
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Existing activity log row |
| taskId | UUID | Foreign key to `Task` |
| actorId | UUID | User performing edit |
| field | string enum (`title`, `description`, `status`, `dueDate`) | Specifies what changed |
| previousValue | string | Mask sensitive info; null for first set |
| newValue | string | Masked as needed (e.g., description truncated) |
| createdAt | datetime | Displayed in feed |
| metadata | JSON | Includes clientId, inline edit flag |

### InlineEditEvent (telemetry payload)
| Field | Type | Notes |
|-------|------|-------|
| eventName | string (`task_inline_edit_started`, `task_inline_edit_saved`, `task_inline_edit_cancelled`, `task_inline_edit_failed`) | Distinguishes interactions |
| taskId | UUID | For aggregation |
| field | string | Which field was edited |
| outcome | enum (`success`, `validation_error`, `permission_error`, `conflict`) | Enables alerting |
| durationMs | number | Time between enter edit and resolve |
| userId | UUID | Actor (hashed if required) |

## Relationships

- `TaskActivityEntry.taskId` → `Task.id` (many-to-one). Inline edits append entries referencing the task.
- `InlineEditEvent.taskId` aligns with `Task.id` but is telemetry-only (no DB persistence) routed through telemetry package; correlated via event metadata.
- Permissions derive from existing membership tables; no schema changes, but inline edit gate uses `Task.permissions.canEdit`.

## Validation Rules

1. **Title**: Non-empty after trimming; max 140 chars. Client mirrors backend validator from `packages/types/task`. Error shown inline.
2. **Description**: Optional, but limit 5000 chars; sanitize markdown preview server-side.
3. **Status**: Must be one of shared enum values; transitions to `DONE` require dueDate <= today? (no new constraint) — just trust backend rules, show API error if returned.
4. **Due Date**: Null or future date; timezone uses UTC from API. Client prevents past dates but lets backend decide final truth.
5. **Concurrency**: Mutation payload includes `updatedAt` or `version` to detect stale data; backend returns 409 + latest snapshot if mismatch.
6. **Permissions**: Only `canEdit` true allows entering edit mode; fallback tooltip for read-only users.

## State Transitions

- `Task` fields move between `read` -> `editing` -> `saving` -> `read` states in UI. Cancel transitions from `editing` back to `read` without mutation.
- API responses can trigger `conflict` state, prompting reload/resolution overlay.
- Activity entries accumulate with each successful save, enabling chronological audit trail.

## Derived Views

- Task viewer caches `Task` via React Query; inline edit writes update cache and re-fetch on success or conflict.
- Activity feed subscribes to new entries so inline edits appear immediately after server confirmation.

## Migration Impact

- No schema changes required; rely on existing Prisma models and enums. Only contract additions are telemetry event shapes (`packages/types/src/telemetry.ts`) and possibly new metadata fields on activity entries (optional JSON column already exists).
