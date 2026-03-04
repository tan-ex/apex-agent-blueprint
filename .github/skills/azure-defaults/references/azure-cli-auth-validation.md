<!-- ref:azure-cli-auth-validation-v1 -->

# Azure CLI Token Validation

Standard procedure for validating Azure CLI authentication before
any deployment or Azure API operation.

## Why `az account show` Is Not Enough

Azure CLI stores account metadata (`~/.azure/azureProfile.json`)
separately from MSAL tokens. Container restarts, session timeouts,
or interrupted logins can leave metadata intact while tokens are
missing or expired. The VS Code Azure extension auth context is
also separate — being signed in via the extension does NOT mean
CLI commands will work.

## Two-Step Validation (MANDATORY)

```bash
# Step 1: Quick context check (informational only — NOT auth proof)
az account show --output table

# Step 2: MANDATORY — Validate real ARM token acquisition
az account get-access-token \
  --resource https://management.azure.com/ --output none
```

## Recovery If Step 2 Fails

Error: "User does not exist in MSAL token cache"

1. Run `az login --use-device-code`
   (works reliably in devcontainers/WSL/Codespaces)
2. Run `az account set --subscription {subscription-id}`
3. Re-run Step 2 to confirm token is valid
4. Only then proceed with deployment operations
