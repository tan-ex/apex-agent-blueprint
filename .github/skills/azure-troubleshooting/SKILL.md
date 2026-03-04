---
name: azure-troubleshooting
description: "Azure resource diagnostics: KQL templates, metric thresholds, health checks, remediation. USE FOR: resource errors, unhealthy alerts, KQL queries, diagnostic workflows, remediation. DO NOT USE FOR: new infrastructure design, Bicep/Terraform code, architecture diagrams."
compatibility: Requires Azure CLI with resource-graph extension
---

# Azure Troubleshooting Skill

Structured diagnostic patterns for Azure resource health assessment and
remediation. Load reference files for detailed queries, checks, and playbooks.

---

## Quick Reference

| Capability              | Description                                                  |
| ----------------------- | ------------------------------------------------------------ |
| Resource Discovery      | Azure Resource Graph queries to find and inventory resources |
| Health Checks           | Per-resource-type diagnostic commands and metric thresholds  |
| KQL Templates           | Log Analytics queries for common failure scenarios           |
| Severity Classification | Standardised impact/urgency mapping for findings             |
| Remediation Playbooks   | Step-by-step resolution for common issues                    |

---

## Reference Index

Load these files for detailed procedures:

| Reference                             | Contents                                                                                               |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `references/kql-templates.md`         | Resource Graph discovery, App Service / VM / generic error KQL, activity log queries                   |
| `references/health-checks.md`         | Diagnostic settings check, per-resource health tables (App Service, VM, Storage, SQL, Static Web Apps) |
| `references/remediation-playbooks.md` | Six-phase diagnostic workflow, report template, CPU / throttling / DTU playbooks                       |

---

## Severity Classification

| Severity | Criteria                                                            | Response Time   |
| -------- | ------------------------------------------------------------------- | --------------- |
| Critical | Service down, data loss risk, security breach                       | Immediate       |
| High     | Degraded performance, failing redundancy, auth issues               | Within 4 hours  |
| Medium   | Suboptimal configuration, missing best practices, capacity warnings | Within 24 hours |
| Low      | Cosmetic issues, documentation gaps, minor optimisations            | Next sprint     |

---

## Diagnostic Workflow (Summary)

1. **Discovery** — `az resource show` to get resource details
2. **Health Assessment** — Run resource-type checks (`references/health-checks.md`)
3. **Log Analysis** — KQL error search (`references/kql-templates.md`)
4. **Activity Log Review** — Failed operations query (`references/kql-templates.md`)
5. **Classification** — Rate findings using severity table above
6. **Report Generation** — Use report template (`references/remediation-playbooks.md`)

---

## Supported Resource Types

App Service, Virtual Machines, Storage Accounts, SQL Database, Static Web Apps.
See `references/health-checks.md` for thresholds and commands per type.

---

## Learn More

| Topic                   | How to Find                                                                |
| ----------------------- | -------------------------------------------------------------------------- |
| Service-specific limits | `microsoft_docs_search(query="{service} limits quotas")`                   |
| KQL reference           | `microsoft_docs_search(query="KQL quick reference Azure Monitor")`         |
| Metric definitions      | `microsoft_docs_search(query="{service} supported metrics Azure Monitor")` |
| Troubleshooting guides  | `microsoft_docs_search(query="{service} troubleshoot common issues")`      |
