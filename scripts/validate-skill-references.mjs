#!/usr/bin/env node
/**
 * Skill References Validator
 *
 * Ensures all files in skill `references/` directories are referenced
 * somewhere (SKILL.md, agents, or instructions). Orphaned reference
 * files waste repository space and create maintenance confusion.
 *
 * @example
 * node scripts/validate-skill-references.mjs
 */

import fs from "node:fs";
import path from "node:path";

const SKILLS_DIR = ".github/skills";
const AGENTS_DIR = ".github/agents";
const INSTRUCTIONS_DIR = ".github/instructions";

let errors = 0;
let warnings = 0;
let checked = 0;

console.log("\n🔍 Skill References Validator\n");

// Gather all searchable content (agents, instructions, skills)
function gatherSearchableContent() {
  const content = [];

  // Agent files
  for (const dir of [AGENTS_DIR, path.join(AGENTS_DIR, "_subagents")]) {
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
      content.push(fs.readFileSync(path.join(dir, f), "utf-8"));
    }
  }

  // Instruction files
  if (fs.existsSync(INSTRUCTIONS_DIR)) {
    for (const f of fs
      .readdirSync(INSTRUCTIONS_DIR)
      .filter((f) => f.endsWith(".md"))) {
      content.push(fs.readFileSync(path.join(INSTRUCTIONS_DIR, f), "utf-8"));
    }
  }

  // Skill SKILL.md files
  for (const skill of fs.readdirSync(SKILLS_DIR, { withFileTypes: true })) {
    if (!skill.isDirectory()) continue;
    const skillPath = path.join(SKILLS_DIR, skill.name, "SKILL.md");
    if (fs.existsSync(skillPath)) {
      content.push(fs.readFileSync(skillPath, "utf-8"));
    }
  }

  return content.join("\n");
}

const allContent = gatherSearchableContent();

// Check each skill's references/ directory
const skillDirs = fs
  .readdirSync(SKILLS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

for (const skill of skillDirs) {
  const refsDir = path.join(SKILLS_DIR, skill, "references");
  if (!fs.existsSync(refsDir)) continue;

  const refFiles = fs.readdirSync(refsDir).filter((f) => f.endsWith(".md"));

  for (const refFile of refFiles) {
    checked++;
    const refRelPath = `${skill}/references/${refFile}`;
    const refName = refFile.replace(/\.md$/, "");

    // Check if referenced anywhere using explicit reference paths
    // to avoid false positives from short filenames matching unrelated text
    const isReferenced =
      allContent.includes(refRelPath) ||
      allContent.includes(`references/${refFile}`) ||
      allContent.includes(`${skill}/references/${refName}`);

    if (!isReferenced) {
      console.log(
        `::warning file=${path.join(refsDir, refFile)}::${refRelPath} is not referenced by any agent, skill, or instruction`,
      );
      console.log(
        `  Fix: Add a loading directive in ${skill}/SKILL.md or remove the orphaned file.`,
      );
      warnings++;
    }
  }
}

// Also check instruction references/
const instrRefsDir = path.join(INSTRUCTIONS_DIR, "references");
if (fs.existsSync(instrRefsDir)) {
  const instrRefFiles = fs
    .readdirSync(instrRefsDir)
    .filter((f) => f.endsWith(".md"));

  for (const refFile of instrRefFiles) {
    checked++;
    const refName = refFile.replace(/\.md$/, "");
    const isReferenced =
      allContent.includes(refFile) || allContent.includes(refName);

    if (!isReferenced) {
      console.log(
        `::warning file=${path.join(instrRefsDir, refFile)}::instructions/references/${refFile} is not referenced anywhere`,
      );
      console.log(
        `  Fix: Add a reference in the parent instruction file or remove the orphaned file.`,
      );
      warnings++;
    }
  }
}

console.log(`\n${"─".repeat(50)}`);
console.log(`Checked: ${checked} | Warnings: ${warnings} | Errors: ${errors}`);

if (errors > 0) {
  console.log(`\n❌ ${errors} reference resolution error(s)`);
  process.exit(1);
}
console.log(`\n✅ Skill references check passed`);
