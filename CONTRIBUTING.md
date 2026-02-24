# Contributing

Thank you for your interest in contributing! This repository was created from the
[azure-agentic-infraops](https://github.com/jonathan-vella/azure-agentic-infraops) template.
It is **not** a direct fork of the upstream — it is your project, powered by the framework.

This file covers contribution guidelines for this repository. The canonical workflow details
(branch protection, PR flow, automation, versioning) are in:

- [Development Workflow Guide](docs/workflow.md)

---

## Where to Contribute

### Agent/skill/instruction improvements

The agents, skills, and instructions come from upstream. Improvements to these belong in the
[upstream repo](https://github.com/jonathan-vella/azure-agentic-infraops) — they sync here
automatically via the weekly sync PR. Do not make changes to `.github/agents/`,
`.github/skills/`, or `.github/instructions/` in this repository for features intended to
benefit all users of the framework.

### Project-specific changes

Infrastructure templates, project CI workflows, project docs, and other consumer-owned files
belong here:

| Path | Type of change |
|---|---|
| `infra/bicep/` | Azure Bicep templates for this project |
| `agent-output/` | Agent-generated artifacts |
| `docs/` | Project-specific documentation |
| `.github/workflows/` | CI/CD workflows for this project |
| `CHANGELOG.md` | Release history |
| `package.json` | Package identity and scripts |

---

## Contribution Guidelines

### Before You Start

1. **Check existing issues** — someone might already be working on it
2. **Open an issue** — discuss your idea before investing time

### Branching and PRs

This repo uses a protected `main` branch. Contributions land via pull requests with required
checks and review.

- Workflow details: [Development Workflow Guide](docs/workflow.md)

### Code Standards

**Bicep:**

```bicep
// Use consistent naming conventions
// Include parameter descriptions
// Add output values
// Follow Azure naming best practices
```

### Documentation Standards

- Use clear, concise language
- Include code examples
- Document prerequisites
- Use Mermaid for diagrams

### Markdown Linting

This repository uses [markdownlint](https://github.com/DavidAnson/markdownlint) for consistent
formatting.

```bash
# Check for issues
npm run lint:md

# Check links (docs/ only)
npm run lint:links

# Auto-fix issues
npm run lint:md:fix
```

---

## Contribution Process

### 1. Clone and Branch

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
cd YOUR-REPO-NAME
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

- Follow the guidelines above
- Test any Bicep changes with `bicep build` and `bicep lint`
- Validate markdown and links with `npm run lint:md` and `npm run lint:links`

### 3. Commit and Push

```bash
git add .
git commit -m "feat: describe your change"
git push origin feature/your-feature-name
```

Commit message format is enforced by hooks and CI — see below.

### 4. Create Pull Request

1. Go to your repository on GitHub
2. Click **New Pull Request**
3. Fill out the PR template
4. Link related issues

---

## Commit Message Format (Required)

This repository uses [Conventional Commits](https://www.conventionalcommits.org/).

### Format

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Description | Version Bump |
|---|---|---|
| `feat` | New feature | Minor (1.x.0) |
| `fix` | Bug fix | Patch (1.0.x) |
| `docs` | Documentation only | None |
| `style` | Code style | None |
| `refactor` | Refactoring | None |
| `perf` | Performance | None |
| `test` | Tests | None |
| `build` | Build system | None |
| `ci` | CI/CD | None |
| `chore` | Maintenance | None |
| `revert` | Revert | None |

Breaking changes: add `!` after the type or include `BREAKING CHANGE:` in the footer.

### Examples

```bash
git commit -m "feat(bicep): add Key Vault private endpoint module"
git commit -m "fix: correct resource group naming in deploy script"
git commit -m "docs: update quickstart with new template instructions"
git commit -m "chore: update dev container configuration"
```

---

## Pull Request Checklist

Before submitting:

- [ ] Code follows repository standards
- [ ] Documentation updated if needed
- [ ] Markdown files pass linting (`npm run lint:md`)
- [ ] Docs links pass checks (`npm run lint:links`)
- [ ] No hardcoded secrets or subscription IDs
- [ ] Links work correctly

---

## Community Standards

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- No harassment or discrimination

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
