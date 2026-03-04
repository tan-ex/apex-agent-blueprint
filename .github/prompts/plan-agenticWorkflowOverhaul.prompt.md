# Context Optimization — Session Resume Prompt

## Mission

Load the current execution state from the session tracker below,
identify the next incomplete phase, load ONLY the context needed for
that phase, and continue execution.

## Session State Tracker

> **Branch**: `ctx-opt/milestone-1` (M1) → `ctx-opt/milestone-2` (M2) → `ctx-opt/milestone-3` (M3)

### Milestone 1: Core Optimization (Phases 0-6) — ~15-20 hrs

| Phase | Title                            | Status      | Blocker |
| ----: | -------------------------------- | ----------- | ------- |
|     0 | Baseline & KPI Definition        | complete    | —       |
|     1 | P0 Skill Splits                  | complete    | —       |
|     2 | Instruction Optimization + Dedup | complete    | —       |
|     3 | Instruction Splits               | complete    | —       |
|     4 | Error Rate & Burst Reduction     | complete    | —       |
|     5 | Agent Body Optimization          | complete    | —       |
|     6 | M1 Measurement Gate              | complete    | —       |

### Milestone 2: Extended Optimization (Phases 7-9) — ~10-15 hrs

| Phase | Title                          | Status      | Blocker |
| ----: | ------------------------------ | ----------- | ------- |
|     7 | CI Enforcement Validators      | not-started | —       |
|     8 | Remaining Skill Splits         | not-started | —       |
|     9 | Subagent Overhaul + iac-common | not-started | —       |

### Milestone 3: New Capabilities (Phases 10-12) — ~10-15 hrs

| Phase | Title                         | Status      | Blocker |
| ----: | ----------------------------- | ----------- | ------- |
|    10 | Challenger Model & Fast Path  | not-started | —       |
|    11 | Doc-Gardening & GC Automation | not-started | —       |
|    12 | Final Measurement & Ship      | not-started | —       |

### KPI Targets

| KPI              | Baseline                            | Target    |
| ---------------- | ----------------------------------- | --------- |
| Avg latency/turn | 11,792ms (Opus) / 11,379ms (Sonnet) | <8,000ms  |
| P95 latency      | 28,561ms                            | <15,000ms |
| Burst sequences  | 123                                 | <60       |

### Session Log

| Date       | Session | Phases Completed | Notes                                                                                                                                                                                     |
| ---------- | ------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2025-07-03 | 1       | 0, 1             | Removed phantom toolsets ref; split azure-defaults (702->141) and azure-artifacts (614->102); 16 ref files; 9 skill descs optimized; validator + parser fixes. Commits: fcb4327, b0de949. |
| 2026-03-03 | 2       | 2, 3, 4          | Glob narrows + dedup (d883b37); instruction splits 1660->389 lines (97e0dcb); validator remediation messages (85c4a8b).                                                                   |
| 2026-03-03 | 3       | 5 (partial)      | Phase 5 research complete: detailed extraction plan for 06t (501->~300) and 05t (443->~295). Implementation not started. Full state in agent-output/\_meta/ctx-opt-session-state.md.      |
| 2026-03-04 | 4       | 5                | Phase 5 implementation: 7 agents trimmed (6416->5574 total, 13%); 3 TF ref files created; DO/DON'T->tables; Boundaries added to all 14 agents. Commit: d0b142a.                         |
| 2026-03-04 | 5       | 6                | M1 gate: baseline snapshot from main, diff report generated. Agents -15%, Skills -20%, Instructions -32%. 43 ref files (on-demand). PR created.                                          |

---

## Workflow

### Step 1 — Identify current phase

Scan the **Session State Tracker** above. Find the first row with
`Status = not-started` or `Status = in-progress`. That is the active phase.

### Step 1.5 — Load session state (if any phase is `in-progress`)

If ANY phase in the tracker has `Status = in-progress`, read the detailed
session state file FIRST — it contains extraction plans, file sizes, and
implementation specifics that are NOT in the milestone detail files:

```text
agent-output/_meta/ctx-opt-session-state.md
```

This file has the exact resume checklist. Follow it before proceeding.

### Step 2 — Load phase-specific context

Based on the active milestone, read ONLY the detail file listed below.
Do NOT load other milestone files — they are out of scope.

| Active Milestone         | Detail File                                               | Max Additional Reads            |
| ------------------------ | --------------------------------------------------------- | ------------------------------- |
| M1 (Phases 0-6)          | `.github/prompts/plan-ctxopt/m1-core-optimization.md`     | 3 (target files being modified) |
| M2 (Phases 7-9)          | `.github/prompts/plan-ctxopt/m2-extended-optimization.md` | 3                               |
| M3 (Phases 10-12)        | `.github/prompts/plan-ctxopt/m3-new-capabilities.md`      | 3                               |
| Decisions/Risk questions | `.github/prompts/plan-ctxopt/appendix-decisions.md`       | 0                               |
| Findings traceability    | `.github/prompts/plan-ctxopt/appendix-findings.md`        | 0                               |

### Step 3 — Verify branch state

Check the current Git branch matches the expected branch for the milestone:

- M1: `ctx-opt/milestone-1`
- M2: `ctx-opt/milestone-2`
- M3: `ctx-opt/milestone-3`

If on the wrong branch, switch or create it before proceeding.

### Step 4 — Execute the active phase

Perform the work for the next unchecked phase in the detail file.
Follow the phase specifications exactly. After completing each phase:

1. Run `npm run validate:all` — every phase requires this
2. Update the Session State Tracker: mark phase `complete`
3. Run canary prompt tests where specified (after Phases 1, 5, 9)

### Step 5 — Milestone measurement gates

At the end of each milestone (Phase 6, Phase 9, Phase 12):

1. Re-run e2e conductor test with the same prompt as Phase 0
2. Measure the 3 KPIs against baseline
3. Record results in the Session Log table
4. **Decision gate**: If KPIs worsened, investigate before proceeding

### Step 6 — Update session state (MANDATORY before ending)

Before the session ends:

1. Update all completed phases to `complete` in the tracker
2. Set any partial phase to `in-progress` with a Blocker note
3. Append a row to the Session Log table
4. Note any blockers or decisions made

---

## Adversarial Review Gates

Run 2x adversarial reviews (Sonnet 4.6 + GPT 5.3 lenses) at these points:

| After Phase | What's Reviewed                                             |
| ----------- | ----------------------------------------------------------- |
| 1           | Split skill structure, reference index, canary patterns     |
| 5           | Trimmed agents, boundary definitions, command placement     |
| 9           | iac-common skill, challenger restructure, golden-principles |
| 10          | Experimental conductor, model comparison results            |

---

## Quick Reference

| Concept       | Value                                                       |
| ------------- | ----------------------------------------------------------- |
| Total phases  | 13 (0-12) across 3 milestones                               |
| Total effort  | ~35-50 hrs                                                  |
| Validation    | `npm run validate:all` after every phase                    |
| Canary tests  | After Phases 1, 5, 9                                        |
| Detail files  | `.github/prompts/plan-ctxopt/m1-*.md`, `m2-*.md`, `m3-*.md` |
| Appendices    | `appendix-findings.md`, `appendix-decisions.md`             |
| Source report | `agent-output/_meta/11-context-optimization-report.md`      |
| Original plan | `agent-output/_meta/11-implementation-plan.md`              |

---

## Quality Checklist

- [ ] Session tracker was read before any work began
- [ ] Only milestone-relevant detail file was loaded
- [ ] Correct branch is checked out
- [ ] `npm run validate:all` passes after each phase
- [ ] All completed phases are marked in the tracker
- [ ] Session log has a new entry for this session
- [ ] No work was done outside the current milestone's scope
