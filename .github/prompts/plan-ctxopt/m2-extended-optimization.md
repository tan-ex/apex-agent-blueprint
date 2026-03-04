# M2: Extended Optimization — Phases 7-9

> **Branch**: `ctx-opt/milestone-2` | **Effort**: ~10-15 hrs | **PR**: ~20 files
> **Prerequisite**: M1 merged and KPIs measured
> **Measurement**: Incremental KPIs vs M1 baseline

---

## Phase 7: CI Enforcement (Created Alongside Changes)

**Effort**: 4-5 hrs | **Addresses**: Principle 7 + 10 gaps | **Risk**: Low

Both adversarial reviews said "build validators with their changes."
By Phase 7, all structural changes from M1 are merged — we now know
the exact rules to enforce.

| #   | Validator                       | Rule                                        | Remediation                      |
| --- | ------------------------------- | ------------------------------------------- | -------------------------------- |
| 1   | `validate-skill-size.mjs`       | SKILL.md >200 lines needs `references/`     | Move content to `references/`    |
| 2   | `validate-agent-body-size.mjs`  | Agent body >350 lines                       | Extract to skill refs or scripts |
| 3   | `validate-glob-audit.mjs`       | Warn `applyTo: "**"` if >50 lines           | Narrow glob to extensions        |
| 4   | `validate-skill-references.mjs` | All `references/` paths resolve; no orphans | Add directive or remove file     |
| 5   | `validate-orphaned-content.mjs` | Detect unreferenced skills/instructions     | Add reference or delete          |

Additional:

| #   | Action                                                           |
| --- | ---------------------------------------------------------------- |
| 6   | Add all 5 validators to `validate:all` in `package.json`         |
| 7   | Add `lint:docs-freshness` to `validate:all` (currently excluded) |

### Validation

```bash
npm run validate:all  # all new + existing validators pass
```

---

## Phase 8: Remaining Skill Splits (Prioritized by Size × Frequency)

**Effort**: 3-4 hrs | **Addresses**: M9, M10, remaining skills | **Risk**: Low

### Prioritization

| Priority   | Skill                      | Lines | Load Frequency     | Action                                                |
| ---------- | -------------------------- | ----- | ------------------ | ----------------------------------------------------- |
| **High**   | `session-resume`           | 345   | Every agent (10+)  | Split → ≤80 lines + `references/recovery-protocol.md` |
| **High**   | `terraform-patterns`       | 510   | 2 agents but large | Split → ≤100 lines + `references/` per pattern        |
| **High**   | `azure-bicep-patterns`     | 305   | 2 agents           | Split → ≤100 lines + `references/` per pattern        |
| **Medium** | `azure-troubleshooting`    | 271   | 1 agent            | Split KQL templates to `references/`                  |
| **Medium** | `azure-diagrams`           | 551   | 3 agents           | Already has references/; trim SKILL.md to ≤150        |
| **Low**    | `github-operations`        | 306   | On-demand          | Defer                                                 |
| **Low**    | `azure-adr`                | 263   | 1 agent            | Defer                                                 |
| **Low**    | `make-skill-template`      | 262   | Utility            | Defer                                                 |
| **Low**    | `microsoft-skill-creator`  | 231   | Utility            | Defer                                                 |
| **Skip**   | `golden-principles`        | 122   | Compact enough     | No split needed                                       |
| **Skip**   | `git-commit`               | 129   | Compact enough     | No split needed                                       |
| **Skip**   | `microsoft-code-reference` | 82    | Compact enough     | No split needed                                       |
| **Skip**   | `microsoft-docs`           | 59    | Compact enough     | No split needed                                       |

While splitting each skill, also update its `description` frontmatter for trigger optimization per Phase 1 pattern.

### Validation

```bash
npm run lint:skills-format
npm run validate:all
```

---

## Phase 9: Subagent Overhaul + iac-common Skill

**Effort**: 3-4 hrs | **Addresses**: H1, L3, subagent maintenance risk | **Risk**: Medium

### 9.1 — Restructure Challenger Review Subagent

| Current       | Target     | Actions                                                                                                       |
| ------------- | ---------- | ------------------------------------------------------------------------------------------------------------- |
| 315-line body | <100 lines | Split 70-line checklist into per-artifact `references/` files; use progressive-loaded quick-refs from Phase 1 |

### 9.2 — Golden Principles Integration

| Agent                        | Change                                                   |
| ---------------------------- | -------------------------------------------------------- |
| `01-conductor`               | Make `golden-principles/SKILL.md` a mandatory first-read |
| `challenger-review-subagent` | Make `golden-principles/SKILL.md` a mandatory first-read |

### 9.3 — Create `iac-common` Skill

**Hard cap: 150 lines** (enforced by Phase 7 validator). Content:

| Content                                            | Source                             |
| -------------------------------------------------- | ---------------------------------- |
| Azure CLI auth validation                          | Extracted from 07b, 07t in Phase 2 |
| Deploy patterns shared between Bicep and Terraform | Consolidated from 07b, 07t         |
| Known Issues table                                 | Consolidated from 07b, 07t         |
| Governance-to-code property mapping reference      | New cross-cutting content          |

### 9.4 — Address Review Subagents with Baked-In Knowledge

| Subagent                    | Current   | Target | Action                                                                                        |
| --------------------------- | --------- | ------ | --------------------------------------------------------------------------------------------- |
| `bicep-review-subagent`     | 226 lines | ≤150   | Extract AVM standards, naming, security → reference `azure-defaults` quick-ref + `iac-common` |
| `terraform-review-subagent` | 237 lines | ≤150   | Same pattern                                                                                  |

### Validation + Measurement

```bash
npm run validate:all
```

- Canary prompt test of challenger on a sample artifact
- M2 Measurement: Re-run KPIs, compare against M1 results
- Create M2 PR from `ctx-opt/milestone-2` → `main`

### Adversarial Review Gate

After Phase 9: Run 2x reviews on iac-common skill, challenger
restructure, golden-principles integration. Verify shared content is
complete and no maintenance gaps created.
