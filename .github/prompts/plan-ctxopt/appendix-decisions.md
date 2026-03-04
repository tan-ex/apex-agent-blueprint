# Appendix: Decisions, Sources & Risk Mitigation

> Reference-only. Load when reviewing a specific decision or assessing risk.

---

## Key Decisions Log

| Decision | Rationale | Source |
|----------|-----------|--------|
| Milestones over mega-PR | 3 independently-shippable milestones per adversarial review consensus — M1 delivers 80%+ of value | Review Round 2 (both reviewers) |
| Skill splits first | Highest-impact work (~93K tokens) precedes lower-certainty work (error audit, model changes) | Review Round 2 (Sonnet) |
| Validators alongside changes | CI enforcement follows structural changes rather than preceding them — avoids premature validator syndrome | Review Round 2 (GPT) |
| Intermediate measurement gates | 3 measurement points instead of 1 — enables data-driven decisions about later phases | Review Round 2 (Sonnet) |
| Experimental conductor for fast path | Don't modify the main Conductor (single point of failure) until the fast-path is validated separately | Review Round 2 (GPT) |
| `scripts/` for executable content | Adversarial review caught original plan misplaced shell scripts in `references/` | Review Round 1 (Sonnet, F7) |
| Keep compact code examples inline | Don't strip all code during splits — keep 1 canonical 5-10 line example per pattern | GitHub Blog guidance |
| Challenger model: Sonnet 4.6 | Deferred to M3 with A/B comparison as prerequisite before shipping | Review Round 2 (GPT) |
| iac-common hard cap | New skill capped at 150 lines to prevent growth into the next `azure-defaults` | Review Round 2 (Sonnet) |
| golden-principles integration | Currently orphaned (1/14 agents); make mandatory for Conductor + Challenger | Review Round 1 (Sonnet, F3) |

---

## Source Material Cross-Reference

| Source | Key Lessons Applied | Already Followed | Gaps Closed |
|--------|-------------------|-----------------|-------------|
| **Harness Engineering** | AGENTS.md as TOC; progressive disclosure; golden principles as invariants; mechanical enforcement; GC; doc-gardening; remediation-rich linters | Repo-as-system-of-record; structured `docs/`; validation scripts; CI; quality score | No enforcement regression, golden-principles orphaned, no GC cadence, no remediation in errors, no orphan detection |
| **mgechev/skills-best-practices** | SKILL.md <500 lines; `references/` for deep content; trigger-optimized descriptions; procedural step-by-step; `scripts/` for deterministic ops | `references/` in 4 skills, `scripts/` in 2 skills, `templates/` in 2 skills, description frontmatter | 13/17 skills lack `references/`; descriptions not trigger-optimized; executable content misplaced |
| **GitHub Blog (2,500+ repos)** | Commands early; code examples over prose; three-tier boundaries; six core areas; iteration-driven | Build commands in AGENTS.md; code examples in skills; stack specificity | Three-tier boundaries on 13/14 agents; commands buried deep |
| **Internal optimization report** | 29 findings (5C, 9H, 10M, 5L); ~150K token savings potential | Comprehensive audit completed; baseline snapshot exists | Implementation of all findings; measurement protocol; regression prevention |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Skill split degrades output quality | Canary prompt tests after Phases 1, 5, 9; keep compact code examples inline; rollback criterion: revert if canary test produces validation errors or latency increase >20% |
| Progressive loading directives ignored by model | Canary pattern with version markers; imperative language ("You MUST read..."); keep critical 5-line summaries inline as fallback; safety-critical content NEVER relies solely on progressive loading |
| CI validator failures block development | Validators enforce post-M1 state, not aspirational state; threshold configurable; warnings mode available as escape hatch |
| Fast path breaks normal path | Implemented as separate experimental conductor initially; never modifies main conductor until validated |
| `iac-common` skill grows unbounded | Hard 150-line cap enforced by `validate-skill-size.mjs`; overflow must go to `references/` |
| Skill frequency data is estimated not measured | Prioritization uses structural analysis (which agents read which skills) as proxy; actual measurement in M1 phase validates assumptions |
| Merge conflicts with concurrent work | Milestones are independently shippable; each is a focused PR; rebase frequently within milestones |
| Agent regression after dedup | `npm run validate:all` after each phase; canary prompt tests at 3 points; agents that lose inline content get explicit pointers to shared source |
