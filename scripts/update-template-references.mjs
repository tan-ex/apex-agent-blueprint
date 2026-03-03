#!/usr/bin/env node
/**
 * Rewrites template repository references after creating a new repo from this template.
 *
 * Replaces all occurrences of the template owner/repo slug and URL forms with the
 * current repository slug (auto-detected from git origin) or user-provided values.
 *
 * @example
 * node scripts/update-template-references.mjs
 * node scripts/update-template-references.mjs --owner my-org --repo my-new-repo
 * node scripts/update-template-references.mjs --slug my-org/my-new-repo --dry-run
 */

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = process.cwd();
const TEMPLATE_SLUG = "jonathan-vella/azure-agentic-infraops-accelerator";

const EXCLUDED_DIRS = new Set([
  ".git",
  "node_modules",
  ".venv",
  "venv",
  "dist",
  "build",
  ".pytest_cache",
  ".mypy_cache",
  "__pycache__",
  ".terraform",
  ".next",
]);

const EXCLUDED_FILES = new Set(["scripts/update-template-references.mjs"]);

const BINARY_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".ico",
  ".webp",
  ".pdf",
  ".zip",
  ".gz",
  ".tar",
  ".tgz",
  ".7z",
  ".woff",
  ".woff2",
  ".ttf",
  ".eot",
  ".mp4",
  ".mp3",
  ".mov",
  ".avi",
  ".dll",
  ".so",
  ".dylib",
  ".exe",
  ".pyc",
]);

function parseArgs(argv) {
  const options = {
    owner: "",
    repo: "",
    slug: "",
    dryRun: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === "--owner") {
      options.owner = (argv[index + 1] || "").trim();
      index += 1;
      continue;
    }

    if (argument === "--repo") {
      options.repo = (argv[index + 1] || "").trim();
      index += 1;
      continue;
    }

    if (argument === "--slug") {
      options.slug = (argv[index + 1] || "").trim();
      index += 1;
      continue;
    }

    if (argument === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (argument === "--help" || argument === "-h") {
      printUsage();
      process.exit(0);
    }

    console.error(`❌ Unknown argument: ${argument}`);
    printUsage();
    process.exit(1);
  }

  return options;
}

function printUsage() {
  console.log("Usage:");
  console.log(
    "  node scripts/update-template-references.mjs [--owner <owner> --repo <repo>]",
  );
  console.log(
    "  node scripts/update-template-references.mjs --slug <owner/repo>",
  );
  console.log("  node scripts/update-template-references.mjs --dry-run");
}

function parseSlug(rawSlug) {
  const cleaned = rawSlug
    .replace(/^https?:\/\/github\.com\//i, "")
    .replace(/^git@github\.com:/i, "")
    .replace(/\.git$/i, "")
    .replace(/^\/+|\/+$/g, "")
    .trim();

  const parts = cleaned.split("/").filter(Boolean);
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return null;
  }

  return {
    owner: parts[0],
    repo: parts[1],
    slug: `${parts[0]}/${parts[1]}`,
  };
}

function detectOriginSlug() {
  try {
    const remoteUrl = execSync("git config --get remote.origin.url", {
      cwd: ROOT,
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    }).trim();

    return parseSlug(remoteUrl);
  } catch {
    return null;
  }
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildReplacements(sourceSlug, targetSlug) {
  const sourceUrl = `https://github.com/${sourceSlug}`;
  const targetUrl = `https://github.com/${targetSlug}`;

  return [
    {
      pattern: new RegExp(escapeRegex(`${sourceUrl}/`), "g"),
      replaceWith: `${targetUrl}/`,
    },
    {
      pattern: new RegExp(escapeRegex(`${sourceUrl}.git`), "g"),
      replaceWith: `${targetUrl}.git`,
    },
    {
      pattern: new RegExp(escapeRegex(sourceUrl), "g"),
      replaceWith: targetUrl,
    },
    {
      pattern: new RegExp(escapeRegex(`git@github.com:${sourceSlug}.git`), "g"),
      replaceWith: `git@github.com:${targetSlug}.git`,
    },
    {
      pattern: new RegExp(escapeRegex(sourceSlug), "g"),
      replaceWith: targetSlug,
    },
  ];
}

function shouldSkipFile(relativePath) {
  if (EXCLUDED_FILES.has(relativePath)) {
    return true;
  }

  const extension = path.extname(relativePath).toLowerCase();
  return BINARY_EXTENSIONS.has(extension);
}

function isLikelyText(content) {
  return !content.includes("\u0000");
}

function collectFiles(dirPath, rootPath = dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(dirPath, entry.name);
    const relativePath = path
      .relative(rootPath, absolutePath)
      .replaceAll("\\", "/");

    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) {
        continue;
      }

      files.push(...collectFiles(absolutePath, rootPath));
      continue;
    }

    if (entry.isFile() && !shouldSkipFile(relativePath)) {
      files.push({ absolutePath, relativePath });
    }
  }

  return files;
}

function replaceInContent(content, replacements) {
  let nextContent = content;

  for (const replacement of replacements) {
    nextContent = nextContent.replace(
      replacement.pattern,
      replacement.replaceWith,
    );
  }

  return nextContent;
}

function main() {
  const options = parseArgs(process.argv.slice(2));

  let target = null;
  if (options.slug) {
    target = parseSlug(options.slug);
  } else if (options.owner && options.repo) {
    target = parseSlug(`${options.owner}/${options.repo}`);
  } else {
    target = detectOriginSlug();
  }

  if (!target) {
    console.error("❌ Could not determine target repository slug.");
    console.error(
      "   Use --slug <owner/repo> or --owner <owner> --repo <repo>.",
    );
    process.exit(1);
  }

  if (target.slug === TEMPLATE_SLUG) {
    console.log(
      "ℹ️ Target repository is still the template slug. No replacements needed.",
    );
    process.exit(0);
  }

  console.log(`🔄 Rewriting template references to ${target.slug}`);
  if (options.dryRun) {
    console.log("🧪 Running in dry-run mode (no files will be written)");
  }

  const replacements = buildReplacements(TEMPLATE_SLUG, target.slug);
  const files = collectFiles(ROOT);

  let changedFiles = 0;

  for (const file of files) {
    let originalContent = "";
    try {
      originalContent = fs.readFileSync(file.absolutePath, "utf8");
    } catch {
      continue;
    }

    if (!isLikelyText(originalContent)) {
      continue;
    }

    const updatedContent = replaceInContent(originalContent, replacements);
    if (updatedContent === originalContent) {
      continue;
    }

    changedFiles += 1;
    console.log(`  • ${file.relativePath}`);

    if (!options.dryRun) {
      fs.writeFileSync(file.absolutePath, updatedContent, "utf8");
    }
  }

  if (changedFiles === 0) {
    console.log("✅ No template references found.");
    process.exit(0);
  }

  console.log(`✅ Updated ${changedFiles} file(s).`);
  if (options.dryRun) {
    console.log(
      "ℹ️ Dry-run complete. Re-run without --dry-run to apply changes.",
    );
  }

  process.exit(0);
}

main();
