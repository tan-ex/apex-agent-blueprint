#!/usr/bin/env bash
# init-from-template.sh
# Replaces all accelerator template repository references with this repository's URL.
# Run once after creating a new repository from the accelerator template.
#
# @example
#   bash scripts/init-from-template.sh
#   bash scripts/init-from-template.sh --dry-run
set -euo pipefail

readonly TEMPLATE_OWNER="jonathan-vella"
readonly TEMPLATE_REPO="azure-agentic-infraops-accelerator"
readonly TEMPLATE_SLUG="${TEMPLATE_OWNER}/${TEMPLATE_REPO}"
readonly TEMPLATE_URL="https://github.com/${TEMPLATE_SLUG}"

DRY_RUN=false

usage() {
  cat <<USAGE
Usage: $(basename "$0") [--dry-run]

Replaces all references to the accelerator template repository
  ${TEMPLATE_URL}
with this repository's URL, auto-detected from the git remote.

Run this once after creating a new repository from the accelerator template.

Options:
  --dry-run   Preview which files would be changed without modifying them
  -h, --help  Show this help message

USAGE
}

# Parse a GitHub remote URL (HTTPS or SSH) into owner/repo slug.
# Outputs the slug on stdout; outputs empty string if unparsable.
parse_remote_slug() {
  local remote_url="$1"
  # HTTPS: https://github.com/owner/repo[.git]
  if [[ "$remote_url" =~ ^https://github\.com/([^/]+)/([^/.]+)(\.git)?$ ]]; then
    echo "${BASH_REMATCH[1]}/${BASH_REMATCH[2]}"
    return
  fi
  # SSH: git@github.com:owner/repo[.git]
  if [[ "$remote_url" =~ ^git@github\.com:([^/]+)/([^/.]+)(\.git)?$ ]]; then
    echo "${BASH_REMATCH[1]}/${BASH_REMATCH[2]}"
    return
  fi
  echo ""
}

# List text files that reference the template slug (skips binary files).
find_affected_files() {
  grep -rlI "${TEMPLATE_SLUG}" \
    --exclude-dir=.git \
    --exclude-dir=node_modules \
    --exclude-dir=site \
    --exclude-dir=.venv \
    --exclude='*.png' \
    --exclude='*.jpg' \
    --exclude='*.jpeg' \
    --exclude='*.gif' \
    --exclude='*.ico' \
    --exclude='*.svg' \
    --exclude='*.woff' \
    --exclude='*.woff2' \
    --exclude='*.zip' \
    . 2>/dev/null || true
}

main() {
  while [[ $# -gt 0 ]]; do
    case $1 in
      --dry-run) DRY_RUN=true; shift ;;
      -h|--help) usage; exit 0 ;;
      *) echo "❌ Unknown option: $1"; usage; exit 1 ;;
    esac
  done

  echo "🔍 Detecting repository remote URL..."
  local remote_url
  remote_url=$(git remote get-url origin 2>/dev/null || echo "")

  if [[ -z "$remote_url" ]]; then
    echo "❌ Could not detect git remote 'origin'. Are you inside a git repository?"
    exit 1
  fi

  local new_slug
  new_slug=$(parse_remote_slug "$remote_url")

  if [[ -z "$new_slug" ]]; then
    echo "❌ Cannot parse a GitHub slug from remote URL: ${remote_url}"
    echo "   Expected format: https://github.com/owner/repo"
    echo "                or: git@github.com:owner/repo"
    exit 1
  fi

  local new_url="https://github.com/${new_slug}"

  if [[ "$new_slug" == "$TEMPLATE_SLUG" ]]; then
    echo "ℹ️  Remote matches the template repository — nothing to replace."
    exit 0
  fi

  echo "📋 Template: ${TEMPLATE_URL}"
  echo "🎯 Target:   ${new_url}"
  echo ""

  local files
  mapfile -t files < <(find_affected_files)

  if [[ ${#files[@]} -eq 0 ]]; then
    echo "✅ No files contain template references. Repository already initialized."
    exit 0
  fi

  echo "${#files[@]} file(s) with template references:"
  for file in "${files[@]}"; do
    echo "  📄 ${file#./}"
  done
  echo ""

  if [[ "$DRY_RUN" == "true" ]]; then
    echo "⚠️  Dry-run mode — no files modified."
    exit 0
  fi

  local count=0
  for file in "${files[@]}"; do
    sed -i "s|${TEMPLATE_SLUG}|${new_slug}|g" "$file"
    echo "  ✅ Updated: ${file#./}"
    count=$((count + 1))
  done

  echo ""
  echo "✅ Done — updated ${count} file(s)."
  echo "   ${TEMPLATE_URL}"
  echo "   → ${new_url}"
  echo ""
  echo "💡 Next steps:"
  echo "   1. Review changes:  git diff"
  echo "   2. Commit:          git add -A && git commit -m 'chore: initialize from template'"
}

main "$@"
