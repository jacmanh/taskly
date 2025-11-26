# Task Inline Edit Rollout + Rollback Playbook

Feature flag: `taskInlineEdit`

## Purpose
Enable inline editing for task title, description, status, and due date inside the viewer while keeping a documented escape hatch.

## Default State
- **Development/Test**: Enabled automatically for faster feedback.
- **Preview/Production**: Disabled. Enable explicitly once launch criteria pass.

## Rollout Plan
1. **Preflight**
   - Merge all feature work with the flag defaulting to `false`.
   - Run `pnpm lint`, `pnpm test`, and targeted Playwright specs tagged `@inline-edit-*` with `PLAYWRIGHT_INLINE_EDIT=on`.
   - Verify telemetry events listed below show up in the dev console.
2. **Internal Dogfood**
   - Flip `taskInlineEdit` to `true` for the Taskly internal workspace only (config service or env override `NEXT_PUBLIC_FEATURE_TASK_INLINE_EDIT=true`).
   - Execute smoke checklist (see below) and log findings in Sprint channel.
   - Keep alert thresholds SC-001–SC-003 armed: failure rate <5%, offline retries resolved <2m median, conflict retries <3 per hour.
3. **Tenant Gradual Rollout**
   - Expand flag to 10% of tenants per day. Monitor dashboards for regressions or elevated 409 conflict/validation errors.
   - Coordinate with Support to tag any inline-edit tickets with `#inline-edit` for SC-004 tracking.
4. **GA**
   - After 3 days of healthy telemetry, enable for all tenants. Continue to monitor dashboards + alerting for one week.

## Telemetry + Dashboards
Fire the following events through `packages/telemetry` from the task viewer:
- `task_inline_edit_started` (field, taskId, durationMs=0)
- `task_inline_edit_saved` (field, taskId, durationMs, outcome=`success`)
- `task_inline_edit_cancelled` (field, taskId, outcome=`cancelled`)
- `task_inline_edit_failed` (field, taskId, outcome in {`validation_error`,`conflict`,`offline`})

Dashboards / alerts (SC-001 – SC-003):
- **Save Latency**: p95 duration < 1s, warn at 800ms, alert at 1.2s for 10+ samples.
- **Failure Rate**: Error events > 5% per 15-minute window triggers paging of feature owner.
- **Conflict Resolution**: More than 3 `conflict` outcomes per hour requires manual investigation.

## Rollback / Kill Switch
1. Set `taskInlineEdit=false` at the config service or export `NEXT_PUBLIC_FEATURE_TASK_INLINE_EDIT=off` across all runtimes.
2. Purge CDN cache for `/app/(tasks)` routes to ensure stale bundles do not attempt inline editing.
3. Re-run smoke checklist to confirm viewer falls back to read-only mode.
4. Post-mortem issue in sprint tracker referencing this playbook.

## Smoke Checklist (pre/post rollout)
- [ ] Toggle each field (title/description/status/due date) from read → edit → save successfully.
- [ ] Cancel out of edit mode and confirm values revert.
- [ ] Induce validation errors (empty title, past due date) and ensure inline messaging appears.
- [ ] Simulate offline mode (disable network tab) to confirm retry affordance/telemetry `offline`.
- [ ] Trigger conflict by editing same task from two tabs; ensure conflict banner + telemetry event fire.
- [ ] Verify audit feed entry for each successful inline edit.
- [ ] Confirm dashboards reflect `task_inline_edit_*` events with current timestamps.

## References
- Spec + tasks: `specs/001-task-viewer-edit/`
- Feature flag config: `apps/front/config/featureFlags.ts`
- Quickstart validation notes will be appended to `specs/001-task-viewer-edit/quickstart.md`.
