# Phase 0 Research: Editable Task Viewer Inputs

## Task Log

1. Research inline editable field UX for task viewers in Next.js/React context.
2. Research optimistic updates + conflict handling using React Query with NestJS task API.
3. Research telemetry and audit logging alignment for inline edits (frontend events + backend activity feed).

## Findings

### Decision: Inline edit pattern via reusable controlled component + portal-confirmation affordances
- **Rationale**: Building a single `InlineEditableField` component that wraps focus management, read/display mode, keyboard shortcuts, and validation messaging keeps UX consistent across title/description/status/due date. Using design-system primitives (typography, text areas, select, date picker) satisfies Principle II and ensures accessibility is centralized. Click/Enter toggles edit mode, Escape cancels, and Save/blur confirm with explicit buttons to avoid hidden gestures.
- **Alternatives considered**:
  - Re-implement per field inside `apps/front` task viewer: rejected because it would spread logic, hinder reuse when more fields gain inline editing, and violate the library-first principle.
  - Use browser `contenteditable`: rejected due to inconsistent accessibility semantics, limited validation hooks, and difficulty integrating with form libraries.

### Decision: Optimistic updates with React Query mutation + server reconciliation for conflicts
- **Rationale**: Use `useMutation` with `onMutate` to patch cache immediately, revert on error, and revalidate after server response. Include `updatedAt` version token so backend can detect stale writes and respond with 409 to trigger UI conflict warning (per edge case). Keeps UI responsive (<1s), surfaces conflicts gracefully, and leverages existing task query keys.
- **Alternatives considered**:
  - Pure server round-trip without optimistic state: rejected due to slower perceived performance and spec requirement to avoid reloads.
  - WebSocket collaborative editing: scope creep for this release; optimistic approach already meets needs while allowing future enhancements.

### Decision: Dual telemetry—frontend analytics events + backend activity feed wiring
- **Rationale**: Fire structured analytics (`task_inline_edit_started/saved/cancelled`) via existing telemetry package with task + field metadata, while backend task service appends audit entries tied to actors. Dashboard widget monitors failure rate (>5%) and alerts via Slack. This satisfies Principle IV and spec success criteria.
- **Alternatives considered**:
  - Rely solely on existing activity feed: rejected because it lacks quantitative error-rate monitoring and real-time alerting.
  - Add new bespoke logging service: unnecessary; extending shared telemetry utilities keeps stack simple.

## Conclusions

- Unknowns resolved: No outstanding clarifications remain; dependencies documented above.
- Proceed to Phase 1 with reusable component plan, optimistic mutation contract, and telemetry tasks baked into backlog.
