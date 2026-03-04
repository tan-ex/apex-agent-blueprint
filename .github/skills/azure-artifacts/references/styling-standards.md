<!-- ref:styling-standards-v1 -->

# Documentation Styling Standards

## Callout Styles

```markdown
> [!NOTE]
> Informational — background context, tips, FYI

> [!TIP]
> Best practice recommendation or optimization

> [!IMPORTANT]
> Critical configuration that must not be overlooked

> [!WARNING]
> Security concern, reliability risk, potential issue

> [!CAUTION]
> Data loss risk, breaking change, irreversible action
```

## Status Emoji

| Purpose           | Emoji | Example                     |
| ----------------- | ----- | --------------------------- |
| Success/Complete  | ✅    | `✅ Health check passed`    |
| Warning/Attention | ⚠️    | `⚠️ Requires manual config` |
| Error/Critical    | ❌    | `❌ Validation failed`      |
| Info/Tip          | 💡    | `💡 Consider Premium tier`  |
| Security          | 🔐    | `🔐 Requires Key Vault`     |
| Cost              | 💰    | `💰 Estimated: $50/month`   |

## Category Icons

| Category   | Icon | Usage                         |
| ---------- | ---- | ----------------------------- |
| Compute    | 💻   | `### 💻 Compute Resources`    |
| Data       | 💾   | `### 💾 Data Services`        |
| Networking | 🌐   | `### 🌐 Networking Resources` |
| Messaging  | 📨   | `### 📨 Messaging Resources`  |
| Security   | 🔐   | `### 🔐 Security Resources`   |
| Monitoring | 📊   | `### 📊 Monitoring Resources` |
| Identity   | 👤   | `### 👤 Identity & Access`    |
| Storage    | 📦   | `### 📦 Storage Resources`    |

## WAF Pillar Icons

| Pillar      | Icon |
| ----------- | ---- |
| Security    | 🔒   |
| Reliability | 🔄   |
| Performance | ⚡   |
| Cost        | 💰   |
| Operations  | 🔧   |

## Badge Row

Every artifact opens with badges after the title:

```markdown
![Step](https://img.shields.io/badge/Step-{n}-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-{Draft|Complete}-{orange|brightgreen}?style=for-the-badge)
![Agent](https://img.shields.io/badge/Agent-{agent--name}-purple?style=for-the-badge)
```

## Collapsible Table of Contents

Include after badge row using `<details open>`:

```markdown
<details open>
<summary><strong>📑 {Contextual Label}</strong></summary>

- Section Name (#section-name)

</details>
```

## Cross-Navigation

Header (after attribution):

```markdown
| ⬅️ Previous | 📑 Index  | Next ➡️ |
| ----------- | --------- | ------- |
| {prev-file} | README.md | {next}  |
```

## References Section

```markdown
## References

> [!NOTE]
> 📚 Additional Microsoft Learn resources.

| Topic | Link |
| ----- | ---- |
| ...   | ...  |
```

## Common Reference Links

| Topic               | URL                                                              |
| ------------------- | ---------------------------------------------------------------- |
| WAF Overview        | `https://learn.microsoft.com/azure/well-architected/`            |
| Security Checklist  | `.../azure/well-architected/security/checklist`                  |
| Reliability         | `.../azure/well-architected/reliability/checklist`               |
| Cost Optimization   | `.../azure/well-architected/cost-optimization/checklist`         |
| Azure Backup        | `.../azure/backup/backup-best-practices`                         |
| Azure Monitor       | `.../azure/azure-monitor/overview`                               |
| Managed Identities  | `.../entra/identity/managed-identities-azure-resources/overview` |
| Key Vault Practices | `.../azure/key-vault/general/best-practices`                     |
| Pricing Calculator  | `https://azure.microsoft.com/pricing/calculator/`                |
