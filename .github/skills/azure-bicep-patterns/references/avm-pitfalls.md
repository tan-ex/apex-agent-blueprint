<!-- ref:avm-pitfalls-v1 -->

# AVM Pitfalls & What-If Interpretation

Known gotchas when using Azure Verified Modules and pre-deployment validation.

---

## What-If Interpretation

Before deploying, always run what-if to preview changes:

```bash
az deployment group what-if \
  --resource-group "$rgName" \
  --template-file main.bicep \
  --parameters main.bicepparam \
  --no-pretty-print
```

### Result Interpretation

| Change Type | Icon   | Action Required                              |
| ----------- | ------ | -------------------------------------------- |
| Create      | green  | New resource — verify name and configuration |
| Modify      | yellow | Property change — check for breaking changes |
| Delete      | red    | Resource removal — confirm intentional       |
| NoChange    | grey   | Idempotent — no action needed                |
| Deploy      | blue   | Child resource deployment                    |
| Ignore      | grey   | Read-only property change — safe to ignore   |

Red flags to catch: unexpected deletes, SKU downgrades, public access changes,
authentication mode changes, or identity removal.

---

## AVM Known Gotchas

- **Version pinning**: Always pin AVM module versions (`br/public:avm/res/...:{version}`).
  Unpinned references may break on upstream updates.
- **Wrapper modules**: When AVM defaults conflict with project policy, wrap the AVM module
  in a thin project module that overrides defaults rather than forking.
- **Output shapes**: AVM outputs vary between modules — always check the module README for
  available outputs before referencing in parent templates.
- **Tag merging**: Some AVM modules merge tags internally. Pass your `tags` object and verify
  the deployed tags include all required policy tags.
- **Diagnostic settings**: Not all AVM modules wire diagnostics automatically. Always verify
  and add a `diagnosticSettings` resource if the module doesn't support the parameter.

---

## Learn More

| Topic                | How to Find                                                               |
| -------------------- | ------------------------------------------------------------------------- |
| AVM module catalog   | `microsoft_docs_search(query="Azure Verified Modules registry Bicep")`    |
| Resource type schema | `microsoft_docs_search(query="{resource-type} Bicep template reference")` |
| Networking patterns  | `microsoft_docs_search(query="Azure hub-spoke network topology Bicep")`   |
| Security baseline    | `microsoft_docs_search(query="{service} security baseline")`              |
