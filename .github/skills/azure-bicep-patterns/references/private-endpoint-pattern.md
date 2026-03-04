<!-- ref:private-endpoint-pattern-v1 -->

# Private Endpoint Wiring Pattern

Standard three-resource pattern for private connectivity.

## Private Endpoint + DNS Zone Group

```bicep
// Private endpoint for a PaaS service
resource privateEndpoint 'Microsoft.Network/privateEndpoints@2024-01-01' = {
  name: 'pe-${serviceName}-${uniqueSuffix}'
  location: location
  tags: tags
  properties: {
    subnet: {
      id: subnetId
    }
    privateLinkServiceConnections: [
      {
        name: 'plsc-${serviceName}'
        properties: {
          privateLinkServiceId: targetResourceId
          groupIds: [groupId]
        }
      }
    ]
  }
}

resource privateDnsZoneGroup 'Microsoft.Network/privateEndpoints/privateDnsZoneGroups@2024-01-01' = {
  parent: privateEndpoint
  name: 'default'
  properties: {
    privateDnsZoneConfigs: [
      {
        name: 'config'
        properties: {
          privateDnsZoneId: privateDnsZoneId
        }
      }
    ]
  }
}
```

## Group IDs by Service Type

| Service       | Group ID    | DNS Zone                             |
| ------------- | ----------- | ------------------------------------ |
| Storage Blob  | `blob`      | `privatelink.blob.core.windows.net`  |
| Storage Table | `table`     | `privatelink.table.core.windows.net` |
| Key Vault     | `vault`     | `privatelink.vaultcore.azure.net`    |
| SQL Server    | `sqlServer` | `privatelink.database.windows.net`   |
| Cosmos DB     | `Sql`       | `privatelink.documents.azure.com`    |
| App Service   | `sites`     | `privatelink.azurewebsites.net`      |
| Event Hub     | `namespace` | `privatelink.servicebus.windows.net` |
| Container Reg | `registry`  | `privatelink.azurecr.io`             |
