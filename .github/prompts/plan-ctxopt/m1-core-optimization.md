# M1: Core Optimization — Phases 0-6

> **Branch**: `ctx-opt/milestone-1` | **Effort**: ~15-20 hrs | **PR**: ~25 files
> **Measurement**: Before/after KPIs (latency, bursts, error rate)

---

## Phase 0: Baseline & KPI Definition

**Effort**: 2 hrs | **Risk**: None | **Addresses**: Foundation for all measurement

1. Define 3 measurable KPIs with targets in the PR description:
   - **Avg latency per agent turn**: target <8,000ms (baseline: 11,792ms Opus / 11,379ms Sonnet)
   - **P95 latency**: target <15,000ms (baseline: 28,561ms)
   - **Burst sequences**: target <60 (baseline: 123)
2. Fix phantom `infraops.toolsets.jsonc` reference in `AGENTS.md` and
   `copilot-instructions.md` — file doesn't exist; either create it or
   remove references
3. Create branch `ctx-opt/milestone-1`, tag start point
4. Run `npm run validate:all` — record baseline
5. Run e2e conductor test on a fixed simple project with a saved prompt — record latency metrics from chat logs

---

## Phase 1: P0 Skill Splits (Highest Impact First)

**Effort**: 3-4 hrs | **Addresses**: C1, C2 (~93,000 tokens/workflow) | **Risk**: Medium

Both adversarial reviews agreed — this is the single largest win by 3×. Do it first.

### 1.1 — Split `azure-defaults/SKILL.md` (702 lines → ≤120 lines)

| Step | Action                                                                                                                                     |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 1    | Create `references/` subdirectory under `.github/skills/azure-defaults/`                                                                   |
| 2    | Create `references/service-matrices.md` — move detailed service capability tables                                                          |
| 3    | Create `references/pricing-guidance.md` — move pricing tiers, calculator links, estimation methodology                                     |
| 4    | Create `references/security-baseline-full.md` — move full security checklist (keep 5-line summary in SKILL.md)                             |
| 5    | Create `references/naming-full-examples.md` — move extended naming examples (keep CAF abbreviation table in SKILL.md)                      |
| 6    | Trim `SKILL.md` to ~100-line quick-reference: regions, tags, naming table, AVM-first rule, 5-line security summary, unique suffix patterns |
| 7    | Add `## Reference Index` section at bottom with progressive-loading directives using imperative language                                   |
| 8    | **Canary pattern**: Each reference file starts with `<!-- ref:{filename}-v1 -->` marker                                                    |
| 9    | **Keep 1 compact canonical example** (5-10 lines) per major pattern inline                                                                 |

**Target**: SKILL.md ≤ 120 lines; references/ contains 4+ files

### 1.2 — Split `azure-artifacts/SKILL.md` (614 lines → ≤100 lines)

| Step | Action                                                                                                                                 |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Create `references/` subdirectory under `.github/skills/azure-artifacts/`                                                              |
| 2    | Create per-step template files: `references/01-requirements-template.md`, `references/02-architecture-template.md`, etc. (steps 01-07) |
| 3    | Trim `SKILL.md` to ~80-line quick-reference: artifact list, key rules (H2 compliance, styling, generation protocol)                    |
| 4    | Add loading directives: "When generating Step N artifact, read `references/0N-*-template.md` for full H2 structure"                    |
| 5    | Same canary + reference index pattern                                                                                                  |

**Target**: SKILL.md ≤ 100 lines; 7+ reference files (one per step)

### 1.3 — Merge Skill Description Optimization

While touching each skill, update the `description` frontmatter to be
trigger-optimized with USE FOR / DO NOT USE FOR patterns per mgechev
criteria.

### Validation

```bash
npm run lint:skills-format
npm run lint:h2-sync
npm run lint:artifact-templates
npm run validate:all
```

**Canary prompt test**: Invoke the Architect agent (03) with a canned
prompt → verify output structure and security content are correct with
the split skills.

### Adversarial Review Gate

After Phase 1: Run 2x reviews (Sonnet 4.6 + GPT 5.3) on split skill
structure, reference index, and canary patterns. Verify splits don't
lose critical content and progressive loading directives are clear.

---

## Phase 2: Instruction Optimization + Quick Dedup

**Effort**: 2-3 hrs | **Addresses**: M1, M6, M8, H2-H6 | **Risk**: Low

### Part A — Glob Narrows (zero-risk edits)

| #   | File                                          | Change                                                                       |
| --- | --------------------------------------------- | ---------------------------------------------------------------------------- |
| 1   | `code-commenting.instructions.md`             | `applyTo` from `"**"` to `"**/*.{js,mjs,cjs,ts,tsx,jsx,py,ps1,sh,bicep,tf}"` |
| 2   | `governance-discovery.instructions.md`        | Remove `**/*.bicep, **/*.tf` from `applyTo`                                  |
| 3   | `bicep-policy-compliance.instructions.md`     | Remove `**/*.agent.md` from `applyTo`                                        |
| 4   | `terraform-policy-compliance.instructions.md` | Remove `**/*.agent.md` from `applyTo`                                        |

### Part B — Cross-Agent Dedup

| #   | Action                                                                                        | Source Agents          |
| --- | --------------------------------------------------------------------------------------------- | ---------------------- |
| 5   | Extract policy effect decision tree → `governance-discovery.instructions.md`                  | 05b, 05t, 06b, 06t     |
| 6   | Extract adversarial review boilerplate → new section in `challenger-review-subagent.agent.md` | 03, 05b, 05t, 06b, 06t |
| 7   | Consolidate session state protocol → reference `session-resume/SKILL.md`                      | 10 agents              |
| 8   | Remove redundant security baseline (already in `azure-defaults`)                              | 6+ agents              |
| 9   | Extract Azure CLI auth validation → `azure-defaults/references/auth-validation.md`            | 07b, 07t               |

### Part C — Sharing Decision Framework

Add to `AGENTS.md`:

| Content Type            | Mechanism                                | When to Use                                    |
| ----------------------- | ---------------------------------------- | ---------------------------------------------- |
| Enforcement rules       | Instructions (auto-loaded by glob)       | Rules that must apply to all files of a type   |
| Shared domain knowledge | Skill `references/`                      | Deep content loaded on-demand by agents        |
| Executable scripts      | Skill `scripts/` (NOT `references/`)     | Deterministic operations, build/deploy scripts |
| Cross-agent boilerplate | Subagent or instruction with narrow glob | Repeated patterns across multiple agent bodies |

### Validation

```bash
npm run lint:instruction-frontmatter
npm run lint:agent-frontmatter
npm run validate:instruction-refs
npm run validate:all
```

---

## Phase 3: Instruction Splits

**Effort**: 2-3 hrs | **Addresses**: H7, H8, M3, M4, M5 | **Risk**: Low

| #   | Instruction File                                | Current   | Target      | Action                                                                        |
| --- | ----------------------------------------------- | --------- | ----------- | ----------------------------------------------------------------------------- |
| 1   | `cost-estimate.instructions.md`                 | 414 lines | ≤80 + refs  | Move detailed pricing tables to reference files                               |
| 2   | `terraform-code-best-practices.instructions.md` | 393 lines | ≤100 + refs | Move patterns to `terraform-patterns/references/`                             |
| 3   | `code-review.instructions.md`                   | 313 lines | ≤80 + refs  | Move checklist templates to reference file                                    |
| 4   | `markdown.instructions.md`                      | 256 lines | ≤80 + refs  | Move detailed formatting rules to reference file                              |
| 5   | `azure-artifacts.instructions.md`               | 284 lines | ≤80         | Dedup vs now-split `azure-artifacts/SKILL.md` — retain enforcement rules only |

### Validation

```bash
npm run lint:instruction-frontmatter
npm run lint:h2-sync
npm run lint:artifact-templates
npm run validate:all
```

---

## Phase 4: Error Rate & Burst Reduction

**Effort**: 2-3 hrs | **Addresses**: C5, H9 | **Risk**: Medium

Moved after skill splits because reduced context should independently
lower burst sequences and some errors. Now we can isolate remaining
errors.

| #   | Action                                                                                 |
| --- | -------------------------------------------------------------------------------------- |
| 1   | Audit the 30 failed requests from session data for patterns                            |
|     | — which agents, which operations, which error types                                    |
| 2   | Add retry guidance to affected agents: "wait 3s before retry; max 2 identical retries" |
| 3   | Add remediation-rich error messages to top-5 failing validators                        |

### Validation

```bash
npm run validate:all
```

---

## Phase 5: Agent Body Optimization

**Effort**: 3-4 hrs | **Addresses**: C3, M7, L2, L4, L5 | **Risk**: Medium

### 5.1 — Trim Agent Bodies

| Agent                   | Current   | Target | Key Actions                                                                                                                                                                |
| ----------------------- | --------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `06t-terraform-codegen` | 432 lines | <300   | Extract bootstrap/deploy scripts to `terraform-patterns/scripts/` (NOT `references/`); remove inline HCL duplicating skills; defer `microsoft-code-reference` to on-demand |
| `05t-terraform-planner` | 379 lines | <300   | Remove HCL blocks; move HCP GUARDRAIL to `terraform-patterns/SKILL.md`                                                                                                     |
| `06b-bicep-codegen`     | 331 lines | <300   | Defer `microsoft-code-reference`; remove patterns duplicating skills                                                                                                       |
| `05b-bicep-planner`     | 302 lines | <280   | Remove duplicated policy table (done in Phase 2)                                                                                                                           |
| `01-conductor`          | 461 lines | <430   | Extract handoff template → `azure-artifacts/templates/00-handoff.template.md`                                                                                              |
| `07b + 07t`             | ~390 each | ~350   | Consolidate Known Issues into shared `iac-common` reference                                                                                                                |

**Keep 1 compact canonical code example** per pattern (5-10 lines) inline — per GitHub Blog: "code examples over prose"

### 5.2 — Add Three-Tier Boundaries to All 14 Top-Level Agents

Per GitHub Blog best practice (from analysis of 2,500+ repos):

```markdown
## Boundaries

- **Always**: {autonomous actions for this agent}
- **Ask first**: {human-approval actions}
- **Never**: {hard constraints — files not to touch, actions not to take}
```

### 5.3 — Surface Commands Early

In all trimmed agent bodies, ensure key commands section appears
immediately after the core workflow section — not buried deep.

### Validation

```bash
npm run lint:agent-frontmatter
npm run validate:all
```

**Canary test**: Invoke the Terraform CodeGen (06t) with a canned prompt → verify output quality after body trim.

### Adversarial Review Gate

After Phase 5: Run 2x reviews on trimmed agents, boundary definitions,
command placement. Verify agent behavior preserved and three-tier
boundaries are meaningful.

---

## Phase 6: M1 Measurement Gate

**Effort**: 2 hrs | **Risk**: None

Both adversarial reviews insisted on an intermediate measurement after
pure context optimization, before any behavioral/architectural changes.

| #   | Action                                                                                                                  |
| --- | ----------------------------------------------------------------------------------------------------------------------- |
| 1   | Re-run the same e2e conductor test from Phase 0 on the same project with the same prompt                                |
| 2   | Parse new chat logs — measure the 3 KPIs against Phase 0 baseline                                                       |
| 3   | Generate diff report: `npm run diff:baseline -- --baseline ctx-opt-20260302-130935`                                     |
| 4   | Document results in the M1 PR description                                                                               |
| 5   | **Decision gate**: If KPIs improved but not to target, M2 proceeds. If KPIs worsened, investigate regression before M2. |
| 6   | Create M1 PR from `ctx-opt/milestone-1` → `main`                                                                        |
