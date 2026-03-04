<!-- ref:state-file-schema-v1 -->

# State File Schema: `00-session-state.json`

## Full Template

```json
{
  "schema_version": "1.0",
  "project": "{project-name}",
  "iac_tool": "Bicep | Terraform",
  "region": "swedencentral",
  "branch": "main",
  "updated": "2026-03-02T10:00:00Z",
  "current_step": 1,
  "decisions": {
    "region": "swedencentral",
    "compliance": "None",
    "budget": "~$50/mo",
    "architecture_pattern": "",
    "deployment_strategy": ""
  },
  "open_findings": [],
  "steps": {
    "1": {
      "name": "Requirements",
      "agent": "02-Requirements",
      "status": "pending",
      "sub_step": null,
      "started": null,
      "completed": null,
      "artifacts": [],
      "context_files_used": []
    },
    "2": {
      "name": "Architecture",
      "agent": "03-Architect",
      "status": "pending",
      "sub_step": null,
      "started": null,
      "completed": null,
      "artifacts": [],
      "context_files_used": []
    },
    "3": {
      "name": "Design",
      "agent": "04-Design",
      "status": "pending",
      "sub_step": null,
      "started": null,
      "completed": null,
      "artifacts": [],
      "context_files_used": []
    },
    "4": {
      "name": "IaC Plan",
      "agent": "05b-Bicep Planner | 05t-Terraform Planner",
      "status": "pending",
      "sub_step": null,
      "started": null,
      "completed": null,
      "artifacts": [],
      "context_files_used": []
    },
    "5": {
      "name": "IaC Code",
      "agent": "06b-Bicep CodeGen | 06t-Terraform CodeGen",
      "status": "pending",
      "sub_step": null,
      "started": null,
      "completed": null,
      "artifacts": [],
      "context_files_used": []
    },
    "6": {
      "name": "Deploy",
      "agent": "07b-Bicep Deploy | 07t-Terraform Deploy",
      "status": "pending",
      "sub_step": null,
      "started": null,
      "completed": null,
      "artifacts": [],
      "context_files_used": []
    },
    "7": {
      "name": "As-Built",
      "agent": "08-As-Built",
      "status": "pending",
      "sub_step": null,
      "started": null,
      "completed": null,
      "artifacts": [],
      "context_files_used": []
    }
  }
}
```

## Field Definitions

| Field               | Type           | Description                                                   |
| ------------------- | -------------- | ------------------------------------------------------------- |
| `schema_version`    | string         | Always `"1.0"` — increment on breaking changes                |
| `project`           | string         | Project folder name (kebab-case)                              |
| `iac_tool`          | string         | `"Bicep"` or `"Terraform"` — set after Step 1                 |
| `region`            | string         | Primary Azure region                                          |
| `branch`            | string         | Active Git branch                                             |
| `updated`           | ISO string     | Last modification timestamp                                   |
| `current_step`      | integer        | Step number currently in progress (1-7)                       |
| `decisions`         | object         | Key project decisions (accumulated across steps)              |
| `open_findings`     | array          | Unresolved `must_fix` challenger findings (titles only)       |
| `steps.N.status`    | string         | `pending` / `in_progress` / `complete` / `skipped`            |
| `steps.N.sub_step`  | string or null | Current sub-step checkpoint identifier (e.g. `"phase_2_waf"`) |
| `steps.N.artifacts` | array          | File paths produced by this step                              |
