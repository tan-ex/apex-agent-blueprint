---
name: session-resume
description: "Session state tracking and resume protocol for the 7-step agent workflow. USE FOR: resume session, persist progress, checkpoint recovery, session-state.json schema. DO NOT USE FOR: Azure infrastructure, code generation, architecture design, troubleshooting."
compatibility: All agents (01-Conductor through 08-As-Built)
---

# Session Resume Skill

Persist agent progress to `00-session-state.json` and resume from the last
checkpoint after any interruption — mid-step, cross-step, or direct invocation.

## When to Use

- Starting / resuming any agent step
- Completing a sub-step checkpoint or finishing a step
- Conductor gate transitions
- Recovering after a chat crash or thread switch

## Quick Reference

| Concept           | Key Detail                                                     |
| ----------------- | -------------------------------------------------------------- |
| State file        | `agent-output/{project}/00-session-state.json`                 |
| Human companion   | `agent-output/{project}/00-handoff.md`                         |
| Resume detection  | Read JSON → check `steps.{N}.status` → branch accordingly      |
| Status values     | `pending` / `in_progress` / `complete` / `skipped`             |
| Context budget    | Hard limit on files loaded at startup per step (1-3 files)     |
| Sub-step tracking | Numbered checkpoint written to `sub_step` after each phase     |
| Write rule        | Always overwrite full JSON atomically; always update `updated` |

## Resume Flow (compact)

```text
00-session-state.json exists?
  NO  → Fresh start (create from template)
  YES → steps.{N}.status?
        pending     → set "in_progress", proceed
        in_progress → read sub_step, skip to checkpoint
        complete    → inform user, offer re-run
        skipped     → proceed to next step
```

## State Write Moments

1. **Step start** — `status: "in_progress"`, set `started`
2. **Sub-step done** — update `sub_step`, append `artifacts`, update `updated`
3. **Step done** — `status: "complete"`, set `completed`, clear `sub_step`
4. **Decision made** — add to `decisions` object
5. **Challenger finding** — append/remove in `open_findings`

## Minimal State Snippet

```json
{
  "schema_version": "1.0",
  "project": "my-project",
  "current_step": 2,
  "updated": "2026-03-02T10:15:00Z",
  "steps": {
    "2": {
      "status": "in_progress",
      "sub_step": "phase_2_waf",
      "artifacts": ["agent-output/my-project/02-architecture-assessment.md"]
    }
  }
}
```

## Reference Index

| Reference         | File                              | Content                                                                                       |
| ----------------- | --------------------------------- | --------------------------------------------------------------------------------------------- |
| Recovery Protocol | `references/recovery-protocol.md` | Resume detection, direct invocation, state write protocol, Conductor integration, portability |
| State File Schema | `references/state-file-schema.md` | Full JSON template, all 7 step definitions, field definitions table                           |
| Context Budgets   | `references/context-budgets.md`   | Per-step file budget table, all sub-step checkpoint tables (Steps 1-7)                        |
