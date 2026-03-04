<!-- ref:terraform-conventions-v1 -->

# Terraform Conventions

## AVM-TF Registry Lookup

Find the latest AVM-TF module version before generating code:

```text
mcp_terraform_get_latest_module_version
  → registry.terraform.io/modules/Azure/{module}/azurerm
Or browse: https://registry.terraform.io/modules/Azure
```

## Tag Syntax (HCL)

```hcl
locals {
  tags = merge(var.tags, {
    Environment = var.environment
    ManagedBy   = "Terraform"
    Project     = var.project
    Owner       = var.owner
  })
}
```

## Required Commands

```bash
terraform fmt -recursive
terraform validate
terraform plan -out=plan.tfplan
```

## State Backend

Use Azure Storage Account for all remote state.
**Never** use HCP Terraform Cloud:

```hcl
terraform {
  backend "azurerm" {
    resource_group_name  = "rg-tfstate-prod"
    storage_account_name = "sttfstate{suffix}"
    container_name       = "tfstate"
    key                  = "{project}.terraform.tfstate"
  }
}
```

## Unique Suffix

Generate once per root module, pass to all child modules:

```hcl
resource "random_string" "suffix" {
  length  = 4
  lower   = true
  numeric = true
  special = false
}
```
