---
description: "Code review guidelines with priority tiers, security checks, and structured comment formats"
applyTo: "**/*.{js,mjs,cjs,ts,tsx,jsx,py,ps1,sh,bicep,tf}"
---

# Code Review Instructions

Complements language-specific instructions:

See `{lang}.instructions.md` for Bicep, PowerShell, Shell, JavaScript, Python, Markdown.
Language-specific rules take precedence on any conflicting point.

## Review Language

When performing a code review, respond in **English**.

## Review Priorities

Prioritize in this order:

**🔴 CRITICAL** (Block merge): Security vulns, logic errors, breaking changes, data loss

**🟡 IMPORTANT** (Discuss): SOLID violations, missing tests, perf bottlenecks, architecture drift

**🟢 SUGGESTION** (Non-blocking): Readability, optimization, best practices, documentation

## General Review Principles

1. Be specific — reference exact lines with concrete examples
2. Explain WHY + potential impact
3. Suggest solutions, not just problems
4. Be constructive and pragmatic
5. Group related comments; recognize good practices

## Security Review

When performing a code review, check for security issues:

- **Sensitive Data**: No passwords, API keys, tokens, or PII in code or logs
- **Input Validation**: All user inputs are validated and sanitized
- **SQL Injection**: Use parameterized queries, never string concatenation
- **Authentication**: Proper authentication checks before accessing resources
- **Authorization**: Verify user has permission to perform action
- **Cryptography**: Use established libraries, never roll your own crypto
- **Dependency Security**: Check for known vulnerabilities in dependencies

## Comment Format Template

```markdown
**[PRIORITY] Category: Brief title**

Description. **Why this matters**: impact explanation.
**Suggested fix**: code example if applicable.
**Reference**: [link to relevant documentation]
```

## Project Context

- **IaC**: Azure Bicep (AVM-first), Terraform
- **Scripts**: PowerShell 7+, Node.js (`.mjs`), bash, Python 3.10+
- **Build**: `npm run lint:md`, `npm run validate:all`
- **Style**: Conventional Commits, 120-char lines, TLS 1.2+, managed identity

## Reference

Detailed checklists and examples:
`.github/instructions/references/code-review-checklists.md`
