<!-- ref:avm-modules-v1 -->

# AVM Module Registry

## Common AVM Modules (Bicep)

| Resource           | Module Path                                        | Min Ver  |
| ------------------ | -------------------------------------------------- | -------- |
| Key Vault          | `br/public:avm/res/key-vault/vault`                | `0.11.0` |
| Virtual Network    | `br/public:avm/res/network/virtual-network`        | `0.5.0`  |
| Storage Account    | `br/public:avm/res/storage/storage-account`        | `0.14.0` |
| App Service Plan   | `br/public:avm/res/web/serverfarm`                 | `0.4.0`  |
| App Service        | `br/public:avm/res/web/site`                       | `0.12.0` |
| SQL Server         | `br/public:avm/res/sql/server`                     | `0.10.0` |
| Log Analytics      | `br/public:avm/res/operational-insights/workspace` | `0.9.0`  |
| App Insights       | `br/public:avm/res/insights/component`             | `0.4.0`  |
| NSG                | `br/public:avm/res/network/network-security-group` | `0.5.0`  |
| Static Web App     | `br/public:avm/res/web/static-site`                | `0.4.0`  |
| Container App      | `br/public:avm/res/app/container-app`              | `0.11.0` |
| Container Env      | `br/public:avm/res/app/managed-environment`        | `0.8.0`  |
| Cosmos DB          | `br/public:avm/res/document-db/database-account`   | `0.10.0` |
| Front Door         | `br/public:avm/res/cdn/profile`                    | `0.7.0`  |
| Service Bus        | `br/public:avm/res/service-bus/namespace`          | `0.10.0` |
| Container Registry | `br/public:avm/res/container-registry/registry`    | `0.6.0`  |

### Finding Latest AVM Version

```text
mcp_bicep_list_avm_metadata → filter by resource type → use latest
Or check: https://aka.ms/avm/index
```

### AVM Usage Pattern

```bicep
module keyVault 'br/public:avm/res/key-vault/vault:0.11.0' = {
  name: '${kvName}-deploy'
  params: {
    name: kvName
    location: location
    tags: tags
    enableRbacAuthorization: true
    enablePurgeProtection: true
  }
}
```

## Common AVM-TF Modules (Bicep ↔ Terraform Cross-Reference)

| Resource               | Terraform AVM                                                |
| ---------------------- | ------------------------------------------------------------ |
| Key Vault              | `Azure/avm-res-keyvault-vault/azurerm`                       |
| Storage Account        | `Azure/avm-res-storage-storageaccount/azurerm`               |
| Virtual Network        | `Azure/avm-res-network-virtualnetwork/azurerm`               |
| App Service Plan       | `Azure/avm-res-web-serverfarm/azurerm`                       |
| Web App                | `Azure/avm-res-web-site/azurerm`                             |
| Container Registry     | `Azure/avm-res-containerregistry-registry/azurerm`           |
| AKS                    | `Azure/avm-res-containerservice-managedcluster/azurerm`      |
| SQL Database           | `Azure/avm-res-sql-server/azurerm`                           |
| Cosmos DB              | `Azure/avm-res-documentdb-databaseaccount/azurerm`           |
| Service Bus            | `Azure/avm-res-servicebus-namespace/azurerm`                 |
| Event Hub              | `Azure/avm-res-eventhub-namespace/azurerm`                   |
| Log Analytics          | `Azure/avm-res-operationalinsights-workspace/azurerm`        |
| App Insights           | `Azure/avm-res-insights-component/azurerm`                   |
| Private DNS Zone       | `Azure/avm-res-network-privatednszones/azurerm`              |
| User-Assigned Identity | `Azure/avm-res-managedidentity-userassignedidentity/azurerm` |
| API Management         | `Azure/avm-res-apimanagement-service/azurerm`                |
