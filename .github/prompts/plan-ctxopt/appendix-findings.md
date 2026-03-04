# Appendix: Findings Coverage Matrix

> Reference-only. Load when tracing a specific finding to its implementation phase.

---

## From Internal Context Optimization Report (29 findings)

| Finding | Phase | Status |
|---------|------:|--------|
| C1 (azure-defaults 702 lines) | 1 | Planned |
| C2 (azure-artifacts 614 lines) | 1 | Planned |
| C3 (06t largest agent 432 lines) | 5 | Planned |
| C4 (179s internal turn) | — | Not actionable (internal infrastructure) |
| C5 (30 request errors) | 4 | Planned |
| H1 (challenger loads 9K tokens/invocation) | 9 | Planned |
| H2 (policy effect tree duplicated) | 2 | Planned |
| H3 (adversarial review boilerplate) | 2 | Planned |
| H4 (session state protocol repeated) | 2 | Planned |
| H5 (security baseline duplicated) | 2 | Planned |
| H6 (CLI auth duplicated) | 2 | Planned |
| H7 (cost-estimate 414 lines) | 3 | Planned |
| H8 (terraform-best-practices 393 lines) | 3 | Planned |
| H9 (123 burst sequences) | 4 | Planned (monitor after context reduction) |
| M1 (code-commenting "**" glob) | 2 | Planned |
| M2 (context-optimization glob) | — | No change needed |
| M3 (code-review 313 lines) | 3 | Planned |
| M4 (markdown 256 lines) | 3 | Planned |
| M5 (azure-artifacts instruction dedup) | 3 | Planned |
| M6 (governance-discovery broad glob) | 2 | Planned |
| M7 (05t 379 lines) | 5 | Planned |
| M8 (policy compliance on agent.md) | 2 | Planned |
| M9 (session-resume 344 lines) | 8 | Planned |
| M10 (terraform-patterns 510 lines) | 8 | Planned |
| L1 (no-heredoc 23 lines) | — | No change needed |
| L2 (Conductor handoff template) | 5 | Planned |
| L3 (challenger inline checklist) | 9 | Planned |
| L4 (Known Issues duplication) | 5 | Planned |
| L5 (HCP GUARDRAIL duplication) | 5 | Planned |

---

## From Adversarial Review Round 1 (26 additional findings)

| Finding | Phase | Status |
|---------|------:|--------|
| No mechanical regression enforcement | 7 | Planned (5 new validators) |
| Progressive loading unverifiable | 1 | Planned (canary pattern) |
| golden-principles orphaned | 9 | Planned (Conductor + Challenger integration) |
| Phantom infraops.toolsets.jsonc | 0 | Planned (immediate fix) |
| Subagents with baked-in knowledge | 9 | Planned (review subagent cleanup) |
| Skill descriptions not trigger-optimized | 1, 8 | Planned (merged into split phases) |
| Executable scripts in references/ | 5 | Planned (corrected to scripts/) |
| No three-tier boundaries | 5 | Planned (all 14 agents) |
| Token savings unmeasured | 0, 6, 12 | Planned (3 measurement gates) |
| Single functional test at end | 1, 5, 9 | Planned (canary tests per phase) |
| No sharing decision framework | 2 | Planned (added to AGENTS.md) |
| No GC cadence | 11 | Planned (quarterly audit) |
| No logic validation methodology | — | Deferred (requires eval framework beyond scope) |
| Doc-gardening not automated | 11 | Planned (weekly cron) |
| Linters lack remediation | 4, 7 | Planned (remediation-rich messages) |
| No orphan detection | 7 | Planned (validate-orphaned-content.mjs) |
| Challenger on wrong model | 10 | Planned (Sonnet swap with A/B test) |
| No fast path | 10 | Planned (experimental conductor) |
| No governance-to-code mapping | 9 | Planned (iac-common reference) |
| Dual IaC permanent duplication | 9 | Planned (iac-common skill) |
| No behavioral regression testing | 1, 5, 9 | Planned (canary prompt tests) |
| No measurable KPIs | 0 | Planned (3 KPIs defined) |
| Error rate > token optimization | 4 | Planned (resequenced after context reduction) |
| Wave 7 undifferentiated | 8 | Planned (prioritized by size × frequency) |
| No feedback loop/CI guards | 7 | Planned (5 blocking validators) |
| Phase 2 scope explosion risk | 7 | Mitigated (validators deferred to M2) |

---

## Adversarial Reviews Conducted

4 adversarial reviews across 2 rounds (2 per round), simulating Sonnet 4.6 and GPT 5.3 perspectives.

### Review Round 1 — Research Critique

| Reviewer | Lens | Key Findings |
|----------|------|-------------|
| Sonnet 4.6 | Architectural Coherence & Gap Analysis | 13 findings: No mechanical regression enforcement (F1), progressive loading unverifiable (F2), golden-principles orphaned (F3), phantom infraops.toolsets.jsonc (F4), 6 subagents with baked-in knowledge (F5), skill descriptions not trigger-optimized (F6), executable scripts misplaced in references/ (F7), 13/14 agents lack three-tier boundaries (F8), token savings unmeasured (F9), single functional test at end (F10), no sharing decision framework (F11), no GC cadence (F12), no logic validation (F13) |
| GPT 5.3 | Operational Efficiency & Missing Capabilities | 13 findings: No behavioral regression testing per wave (1), no measurable KPIs (2), token count optimized before error rate (3), progressive loading unenforceable (4), Wave 7 undifferentiated (5), no feedback loop or CI guards (6), doc-gardening not automated (7), linters lack remediation (8), no orphan detection (9), challenger on wrong model (10), no fast path (11), no governance-to-code mapping (12), dual IaC permanent duplication (13) |

### Review Round 2 — Plan Critique

| Reviewer | Lens | Key Findings |
|----------|------|-------------|
| Sonnet 4.6 | Sequencing & Completeness | Phase 3 should be Phase 1 (highest impact first); Phase 7 model change contaminates Phase 12 measurement; Phase 11 (skill descriptions) is too late; Phase 2 CI validators hide 3-4 days work; no rollback strategy; missing intermediate measurement gate |
| GPT 5.3 | Practical Execution | 12 phases = 3 projects masquerading as 1; split into 3 milestones; Phase 8 (fast path) is too risky for main Conductor; premature validator syndrome in Phase 2; challenger model swap needs A/B test; MVI = Phases 1+3+4+6 deliver 80% of value |

### Consensus Applied to Final Plan

- Resequenced: P0 skill splits moved to Phase 1 (highest impact first)
- 3 milestones instead of 1 mega-PR
- 3 intermediate KPI measurement gates instead of 1
- Validators created alongside changes, not before
- Fast path as experimental conductor, not inline modification
- Executable content in `scripts/` not `references/`
