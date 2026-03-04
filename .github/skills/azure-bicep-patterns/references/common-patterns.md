<!-- ref:common-patterns-v1 -->

# Common Bicep Patterns

Diagnostic settings, conditional deployment, module composition, and managed identity binding.

---

## Diagnostic Settings

Every resource must send logs and metrics to a workspace:

```bicep
// Pass workspace NAME (not ID) to modules — resolve inside with existing keyword
param logAnalyticsWorkspaceName string

resource workspace 'Microsoft.OperationalInsights/workspaces@2023-09-01' existing = {
  name: logAnalyticsWorkspaceName
}

resource diagnosticSettings 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: 'diag-${parentResourceName}'
  scope: parentResource
  properties: {
    workspaceId: workspace.id
    logs: [
      {
        categoryGroup: 'allLogs'
        enabled: true
      }
    ]
    metrics: [
      {
        category: 'AllMetrics'
        enabled: true
      }
    ]
  }
}
```

- Use `categoryGroup: 'allLogs'` instead of listing individual categories
- Always include `AllMetrics`
- Pass workspace **name** not ID — use `existing` keyword to resolve

---

## Conditional Deployment

Use parameters to control optional resource deployment:

```bicep
@description('Deploy a Redis cache for session state')
param deployRedis bool = false

module redis 'modules/redis.bicep' = if (deployRedis) {
  name: 'redis-cache'
  params: {
    name: 'redis-${projectName}-${environment}-${uniqueSuffix}'
    location: location
    tags: tags
  }
}

// Conditional output — empty string when not deployed
output redisHostName string = deployRedis ? redis.outputs.hostName : ''
```

- Use `bool` parameters with sensible defaults
- Guard outputs with ternary expressions
- Group related optional resources (e.g., `deployMonitoring` enables workspace + alerts + dashboard)

---

## Module Composition

Standard module interface — every module follows this contract:

```bicep
// modules/storage.bicep
@description('Storage account name (max 24 chars)')
param name string

@description('Azure region')
param location string

@description('Resource tags')
param tags object

@description('Log Analytics workspace name for diagnostics')
param logAnalyticsWorkspaceName string

// ... resource definition ...

// MANDATORY outputs
@description('Resource ID of the storage account')
output resourceId string = storageAccount.id

@description('Name of the storage account')
output resourceName string = storageAccount.name

@description('Principal ID of the managed identity (empty if none)')
output principalId string = storageAccount.identity.?principalId ?? ''
```

Module conventions:

- Every module accepts `name`, `location`, `tags`, `logAnalyticsWorkspaceName`
- Every module outputs `resourceId`, `resourceName`, `principalId`
- Use `@description` on all parameters and outputs
- Use AVM modules when available — wrap with project-specific defaults if needed

---

## Managed Identity Binding

Standard pattern for granting service-to-service access:

```bicep
// Grant App Service access to Key Vault secrets
resource roleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(keyVault.id, appService.id, keyVaultSecretsUserRoleId)
  scope: keyVault
  properties: {
    roleDefinitionId: subscriptionResourceId(
      'Microsoft.Authorization/roleDefinitions',
      keyVaultSecretsUserRoleId
    )
    principalId: appService.identity.principalId
    principalType: 'ServicePrincipal'
  }
}
```

### Common Role Definition IDs

| Role                      | ID                                     |
| ------------------------- | -------------------------------------- |
| Key Vault Secrets User    | `4633458b-17de-408a-b874-0445c86b69e6` |
| Storage Blob Data Reader  | `2a2b9908-6ea1-4ae2-8e65-a410df84e7d1` |
| Storage Blob Data Contrib | `ba92f5b4-2d11-453d-a403-e96b0029c9fe` |
| Cosmos DB Account Reader  | `fbdf93bf-df7d-467e-a4d2-9458aa1360c8` |
| SQL DB Contributor        | `9b7fa17d-e63e-47b0-bb0a-15c516ac86ec` |

- Always use `guid()` for deterministic, idempotent assignment names
- Set `principalType: 'ServicePrincipal'` for managed identities
- Scope to the narrowest resource possible
