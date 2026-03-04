---
name: azure-diagrams
description: "Generates Azure architecture diagrams and WAF/cost charts as Python + PNG artifacts. USE FOR: architecture diagrams, WAF radar charts, cost pie charts, dependency visuals. DO NOT USE FOR: Bicep/Terraform code, ADR writing, troubleshooting, cost calculations."
compatibility: Requires graphviz system package and Python diagrams library; works with Claude Code, GitHub Copilot, VS Code, and any Agent Skills compatible tool.
license: MIT
metadata:
  author: cmb211087
  version: "4.0"
  repository: https://github.com/mingrammer/diagrams
---

# Azure Architecture Diagrams Skill

Generate professional Azure architecture diagrams, WAF bar charts, and cost charts
using Python `diagrams` + `matplotlib`.
Output: `.py` source + `.png` in `agent-output/{project}/`.

## Prerequisites

```bash
pip install diagrams matplotlib pillow && apt-get install -y graphviz
```

## Execution Method

Save `.py` source in `agent-output/{project}/`, then run to produce `.png`. Never use heredoc execution.

```bash
python3 agent-output/{project}/03-des-diagram.py
```

## Architecture Diagram Contract

### Required outputs

| Step | Files                                                         |
| ---- | ------------------------------------------------------------- |
| 3    | `03-des-diagram.py/.png`                                      |
| 4    | `04-dependency-diagram.py/.png`, `04-runtime-diagram.py/.png` |
| 7    | `07-ab-diagram.py/.png` (when requested)                      |

### Naming conventions

- Cluster vars: `clu_<scope>_<slug>` — scope ∈ `sub|rg|net|tier|zone|ext`
- Node vars: `n_<domain>_<service>_<role>` — domain ∈ `edge|web|app|data|id|sec|ops|int`
- Edge vars: `e_<source>_to_<target>_<flow>` — flow ∈ `auth|request|response|read|write|event|replicate|secret|telemetry|admin`

### Layout defaults

- `direction="LR"` unless explicitly justified
- Deterministic spacing via `graph_attr` (`nodesep`, `ranksep`, `splines`)
- Short labels (2–4 words), max 3 edge styles

### Quality gate (/10)

Readable at 100% zoom · No label overlap · Minimal line crossing ·
Clear tier grouping · Correct Azure icons · Security boundary visible ·
Data flow direction clear · Identity/auth flow visible ·
Telemetry path visible · Naming conventions followed.
If < 9/10, regenerate with simplification.

## Professional Output Standards

Critical settings for clean output — use `labelloc="t"` to keep labels inside clusters:

```python
node_attr = {"fontname": "Arial Bold", "fontsize": "11", "labelloc": "t"}
graph_attr = {"bgcolor": "white", "pad": "0.8", "nodesep": "0.9", "ranksep": "0.9",
              "splines": "spline", "fontname": "Arial Bold", "fontsize": "16", "dpi": "150"}
cluster_style = {"margin": "30", "fontname": "Arial Bold", "fontsize": "14"}
```

Requirements: `labelloc='t'` · `Arial Bold` fonts ·
full resource names from IaC · `dpi="150"+` · `margin="30"+` ·
CIDR blocks in VNet/Subnet labels.

See `references/quick-reference.md` for full template, connection syntax, cluster hierarchy, and diagram attributes.

## Azure Service Categories

13 categories: Compute, Networking, Database, Storage, Integration, Security,
Identity, AI/ML, Analytics, IoT, DevOps, Web, Monitor — all under `diagrams.azure.*`.

See `references/azure-components.md` for the complete list of **700+ components**.

## Common Architecture Patterns

Ready-to-use patterns: 3-Tier Web App, Microservices (AKS),
Serverless/Event-Driven, Data Platform, Hub-Spoke Networking, and more.

See `references/common-patterns.md` for all patterns with code.
See `references/iac-to-diagram.md` to generate diagrams from Bicep/Terraform/ARM.

## Workflow Integration

| Step | Files                                                                | Description                               |
| ---- | -------------------------------------------------------------------- | ----------------------------------------- |
| 2    | `02-waf-scores.py/.png`                                              | WAF pillar score bar chart                |
| 3    | `03-des-diagram.py/.png`                                             | Proposed architecture                     |
| 3    | `03-des-cost-distribution.py/.png`, `03-des-cost-projection.py/.png` | Cost donut + projection                   |
| 7    | `07-ab-diagram.py/.png`                                              | Deployed architecture                     |
| 7    | `07-ab-cost-*.py/.png`                                               | Cost distribution, projection, comparison |
| 7    | `07-ab-compliance-gaps.py/.png`                                      | Compliance gaps by severity               |

Suffix rules: `-des` for design (Step 3), `-ab` for as-built (Step 7).

## Data Visualization Charts

WAF and cost charts use `matplotlib` (never Mermaid). See `references/waf-cost-charts.md` for full implementations.

**Design tokens:** Background `#F8F9FA` · Azure blue `#0078D4` ·
Min line `#DC3545` · Target line `#28A745` · Trend `#FF8C00` · Grid `#E0E0E0` · DPI 150.

**WAF pillar colours:** Security `#C00000` · Reliability `#107C10` ·
Performance `#FF8C00` · Cost `#FFB900` · Operational Excellence `#8764B8`.

## Generation Workflow

1. **Gather Context** — Read Bicep/Terraform templates or architecture assessment
2. **Identify Resources & Hierarchy** — List Azure resources, map Subscription → RG → VNet → Subnet
3. **Generate Python Code** — Create diagram with proper clusters and edges
4. **Execute & Verify** — Run Python to generate PNG, confirm file exists

## Guardrails

**DO:** Create files in `agent-output/{project}/` with step-prefixed names ·
Use valid `diagrams.azure.*` imports · Include docstring with prerequisites ·
Use `Cluster()` for Azure hierarchy · Include CIDR blocks ·
Always execute script and verify PNG · Apply design tokens to every chart ·
Generate `02-waf-scores.png` when WAF scores are assigned.

**DON'T:** Use invalid node types · Create diagrams mismatched to architecture ·
Skip PNG generation · Overwrite diagrams without consent ·
Output to legacy `docs/diagrams/` · Use placeholder names ·
Use Mermaid for WAF/cost charts.

## Scope Exclusions

Does NOT: generate Bicep/Terraform code · create workload docs ·
deploy resources · create ADRs · perform WAF assessments ·
build dashboards · render Mermaid diagrams.

## Scripts

| Script                               | Purpose                              |
| ------------------------------------ | ------------------------------------ |
| `scripts/generate_diagram.py`        | Interactive pattern generator        |
| `scripts/multi_diagram_generator.py` | Multi-type diagram generator         |
| `scripts/ascii_to_diagram.py`        | Convert ASCII diagrams from markdown |
| `scripts/verify_installation.py`     | Check prerequisites                  |

## Reference Index

| File                                         | Content                                                                           |
| -------------------------------------------- | --------------------------------------------------------------------------------- |
| `references/azure-components.md`             | Complete list of 700+ Azure diagram components                                    |
| `references/business-process-flows.md`       | Workflow and swimlane diagram patterns                                            |
| `references/common-patterns.md`              | Ready-to-use architecture patterns (3-tier, microservices, serverless, hub-spoke) |
| `references/entity-relationship-diagrams.md` | Database ERD patterns                                                             |
| `references/iac-to-diagram.md`               | Generate diagrams from Bicep/Terraform/ARM templates                              |
| `references/integration-services.md`         | Integration service diagram patterns                                              |
| `references/migration-patterns.md`           | Migration architecture patterns                                                   |
| `references/preventing-overlaps.md`          | Layout troubleshooting and overlap prevention                                     |
| `references/quick-reference.md`              | Copy-paste snippets: connections, attributes, clusters, templates                 |
| `references/sequence-auth-flows.md`          | Authentication flow sequence patterns                                             |
| `references/timeline-gantt-diagrams.md`      | Project timeline and Gantt diagrams                                               |
| `references/ui-wireframe-diagrams.md`        | UI mockup and wireframe patterns                                                  |
| `references/waf-cost-charts.md`              | WAF pillar bar, cost donut & projection chart implementations                     |
