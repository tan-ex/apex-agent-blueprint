# Quickstart

> [Current Version](../VERSION.md) | Get running in 10 minutes

## Prerequisites

| Requirement            | How to Get                                                  |
| ---------------------- | ----------------------------------------------------------- |
| GitHub account         | [Sign up](https://github.com/signup)                        |
| GitHub Copilot license | [Get Copilot](https://github.com/features/copilot)          |
| VS Code                | [Download](https://code.visualstudio.com/)                  |
| Docker Desktop         | [Download](https://www.docker.com/products/docker-desktop/) |
| Azure subscription     | Optional for learning                                       |

---

## Step 1: Create your repository from this template

Click **Use this template → Create a new repository** on the
[accelerator repo](https://github.com/jonathan-vella/azure-agentic-infraops-accelerator) page,
then clone your new repository:

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
code YOUR-REPO-NAME
```

---

## Step 2: Rewrite template references

Run the initializer script to replace references to the template repository with
your own repository slug:

```bash
npm run init:template
```

Preview changes without writing files:

```bash
npm run init:template:dry-run
```

---

## Step 3: Open in Dev Container

1. Press `F1` (or `Ctrl+Shift+P`)
2. Type: `Dev Containers: Reopen in Container`
3. Wait 3-5 minutes for setup

The Dev Container installs all tools automatically:

- Azure CLI + Bicep CLI
- PowerShell 7
- Python 3 + diagrams library
- 25+ VS Code extensions

---

## Step 4: Verify Setup

```bash
az --version && bicep --version && pwsh --version
```

---

## Step 5: Enable Subagent Orchestration

> **⚠️ REQUIRED**: The Conductor pattern requires this setting.

Add this to your **VS Code User Settings** (`Ctrl+,` → Settings JSON):

```json
{
  "chat.customAgentInSubagent.enabled": true
}
```

**Why User Settings?** Workspace settings exist in `.vscode/settings.json`, but user settings
take precedence for experimental features like subagent invocation.

**Verify it's enabled:**

1. Open Command Palette (`Ctrl+Shift+P`)
2. Type: `Preferences: Open User Settings (JSON)`
3. Confirm the setting is present

---

## Step 6: Start the Conductor

### Option A: InfraOps Conductor (Recommended)

The Conductor (🎼 Maestro) orchestrates the complete 7-step workflow:

1. Press `Ctrl+Shift+I` to open Copilot Chat
2. Select **InfraOps Conductor** from the agent dropdown
3. Describe your project:

```text
Create a simple web app in Azure with:
- App Service for web frontend
- Azure SQL Database for data
- Key Vault for secrets
- Region: swedencentral
- Environment: dev
- Project name: my-webapp
```

The Conductor guides you through all 7 steps with approval gates.

### Option B: Direct Agent Invocation

Invoke agents directly for specific tasks:

1. Press `Ctrl+Shift+A` to open the agent picker
2. Select the specific agent (e.g., `requirements`)
3. Enter your prompt

---

## Step 7: Follow the Workflow

The agents work in sequence with handoffs:

| Step | Agent          | Persona       | What Happens             |
| ---- | -------------- | ------------- | ------------------------ |
| 1    | `requirements` | 📜 Scribe     | Captures requirements    |
| 2    | `architect`    | 🏛️ Oracle     | WAF assessment           |
| 3    | `design`       | 🎨 Artisan    | Diagrams/ADRs (optional) |
| 4    | `bicep-plan`   | 📐 Strategist | Implementation plan      |
| 5    | `bicep-code`   | ⚒️ Forge      | Bicep templates          |
| 6    | `deploy`       | 🚀 Envoy      | Azure deployment         |
| 7    | —              | 📚 —          | Documentation (skills)   |

**Approval Gates**: The Conductor pauses at key points:

- ⛔ **Gate 1**: After planning (Step 4) — approve implementation plan
- ⛔ **Gate 2**: After validation (Step 5) — approve preflight results
- ⛔ **Gate 3**: After deployment (Step 6) — verify resources

---

## What You've Created

After completing the workflow:

```text
agent-output/my-webapp/
├── 01-requirements.md          # Captured requirements
├── 02-architecture-assessment.md  # WAF analysis
├── 04-implementation-plan.md   # Phased plan
├── 04-dependency-diagram.py     # Step 4 dependency diagram source
├── 04-dependency-diagram.png    # Step 4 dependency diagram image
├── 04-runtime-diagram.py        # Step 4 runtime diagram source
├── 04-runtime-diagram.png       # Step 4 runtime diagram image
├── 04-governance-constraints.md   # Policy discovery
├── 05-implementation-reference.md # Module inventory
├── 06-deployment-summary.md    # Deployed resources
└── 07-*.md                     # Documentation suite

infra/bicep/my-webapp/
├── main.bicep                  # Entry point
├── main.parameters.json        # Parameters
└── modules/
    ├── app-service.bicep
    ├── sql-database.bicep
    └── key-vault.bicep
```

---

## Next Steps

| Goal                           | Resource                                 |
| ------------------------------ | ---------------------------------------- |
| Understand the full workflow   | [workflow.md](workflow.md)               |
| Try a complete workflow        | [Prompt Guide](prompt-guide/)            |
| Generate architecture diagrams | Use `azure-diagrams` skill               |
| Create documentation           | Use `azure-artifacts` skill              |
| Troubleshoot issues            | [troubleshooting.md](troubleshooting.md) |

---

## Quick Reference

### Conductor (Orchestrated Workflow)

```text
Ctrl+Shift+I → InfraOps Conductor → Describe project → Follow gates
```

### Direct Agent Invocation

```text
Ctrl+Shift+A → Select agent → Type prompt → Approve
```

### Skill Invocation

Skills activate automatically based on your prompt:

- "Create an architecture diagram" → `azure-diagrams`
- "Generate an ADR" → `azure-adr`
- "Create workload documentation" → `azure-artifacts`

Or invoke explicitly:

```text
Use the azure-diagrams skill to create a diagram for my-webapp
```

---

## Agent Personas

| Agent              | Persona       | Role                    |
| ------------------ | ------------- | ----------------------- |
| InfraOps Conductor | 🎼 Maestro    | Master orchestrator     |
| requirements       | 📜 Scribe     | Requirements capture    |
| architect          | 🏛️ Oracle     | WAF assessment          |
| design             | 🎨 Artisan    | Diagrams and ADRs       |
| bicep-plan         | 📐 Strategist | Implementation planning |
| bicep-code         | ⚒️ Forge      | Bicep generation        |
| deploy             | 🚀 Envoy      | Azure deployment        |
| diagnose           | 🔍 Sentinel   | Troubleshooting         |
