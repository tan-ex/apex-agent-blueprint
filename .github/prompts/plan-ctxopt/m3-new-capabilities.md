# M3: New Capabilities — Phases 10-12

> **Branch**: `ctx-opt/milestone-3` | **Effort**: ~10-15 hrs | **PR**: ~15 files
> **Prerequisite**: M1 and M2 merged, KPIs measured at both gates
> **Measurement**: Full KPI comparison vs Phase 0 baseline

---

## Phase 10: Challenger Model & Complexity Fast Path

**Effort**: 4-5 hrs | **Addresses**: Review quality, workflow efficiency | **Risk**: High

### 10.1 — Challenger Model Change

| Current Model | Target Model      | Required Before Shipping                           |
| ------------- | ----------------- | -------------------------------------------------- |
| GPT-5.3-Codex | Claude Sonnet 4.6 | Controlled A/B comparison on one existing artifact |

- Apply tiered approach: Sonnet for 3-pass rotating-lens reviews
  (Steps 2, 4, 5); evaluate for single-pass reviews (Steps 1, 6)
- Document model selection rationale in the agent's frontmatter

### 10.2 — Complexity-Based Fast Path

| Component           | Action                                                                                                          |
| ------------------- | --------------------------------------------------------------------------------------------------------------- |
| Requirements output | Add `complexity: simple \| standard \| complex` field                                                           |
| Threshold criteria  | `simple` ≤3 resources, no custom policies, single env; `standard` 4-20; `complex` 20+ or PCI-DSS                |
| Implementation      | **Separate experimental conductor** (`01-conductor-fastpath.agent.md`) initially — NOT inline in main Conductor |
| Simple path         | 1-pass comprehensive review, skip governance discovery, combine Plan+Code                                       |
| Promotion           | After validation, merge approach into main Conductor                                                            |

### Validation

Full e2e test on both simple and complex projects.

### Adversarial Review Gate

After Phase 10: Run 2x reviews on experimental conductor and model
comparison results. Verify fast path doesn't break normal path and
model quality is demonstrated.

---

## Phase 11: Doc-Gardening & Garbage Collection Automation

**Effort**: 3-4 hrs | **Risk**: Low

| #   | Action                                                                                                           |
| --- | ---------------------------------------------------------------------------------------------------------------- |
| 1   | Add `lint:docs-freshness` to weekly GitHub Actions cron → opens issue when staleness detected                    |
| 2   | Create quarterly context audit cadence: checklist/script that re-runs the context optimizer skill every 3 months |
| 3   | Extend `check-docs-freshness.mjs` to cover skills and `references/` files                                        |
| 4   | Fix any remaining phantom references found by `validate-orphaned-content.mjs`                                    |

---

## Phase 12: Final Measurement & Ship

**Effort**: 2 hrs | **Risk**: None

| #   | Action                                                                             |
| --- | ---------------------------------------------------------------------------------- |
| 1   | Re-run full e2e conductor test                                                     |
| 2   | Compare all KPI measurements: Phase 0 baseline → M1 → M2 → M3                      |
| 3   | Generate final diff report                                                         |
| 4   | Create M3 PR from `ctx-opt/milestone-3` → `main` with measurement comparison table |
| 5   | Update `QUALITY_SCORE.md` to reflect improvements                                  |
