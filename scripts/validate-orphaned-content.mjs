#!/usr/bin/env node
/**
 * Orphaned Content Validator
 *
 * Detects skills and instruction files that are not referenced by any
 * agent, other skill, or instruction file. Orphaned content wastes
 * repository space and creates maintenance confusion.
 *
 * @example
 * node scripts/validate-orphaned-content.mjs
 */

import fs from "node:fs";
import path from "node:path";

const SKILLS_DIR = ".github/skills";
const AGENTS_DIR = ".github/agents";
const INSTRUCTIONS_DIR = ".github/instructions";

let errors = 0;
let warnings = 0;
let checked = 0;

console.log("\n🔍 Orphaned Content Validator\n");

// Gather reference corpus from agents, instructions, and top-level config.
// Skill SKILL.md files are loaded separately (keyed by skill name) so we
// can exclude a skill's own content when checking whether it is referenced.
function gatherReferenceContent() {
  const corpus = [];
  const perSkill = {};

  for (const dir of [AGENTS_DIR, path.join(AGENTS_DIR, "_subagents")]) {
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
      corpus.push(fs.readFileSync(path.join(dir, f), "utf-8"));
    }
  }

  if (fs.existsSync(INSTRUCTIONS_DIR)) {
    for (const f of fs
      .readdirSync(INSTRUCTIONS_DIR)
      .filter((f) => f.endsWith(".md"))) {
      corpus.push(fs.readFileSync(path.join(INSTRUCTIONS_DIR, f), "utf-8"));
    }
  }

  // Load each skill's SKILL.md keyed by name (for cross-skill minus self)
  for (const skill of fs.readdirSync(SKILLS_DIR, { withFileTypes: true })) {
    if (!skill.isDirectory()) continue;
    const skillPath = path.join(SKILLS_DIR, skill.name, "SKILL.md");
    if (fs.existsSync(skillPath)) {
      perSkill[skill.name] = fs.readFileSync(skillPath, "utf-8");
    }
  }

  // Top-level config files
  for (const f of [
    ".github/copilot-instructions.md",
    "AGENTS.md",
    ".github/prompts/plan-agenticWorkflowOverhaul.prompt.md",
  ]) {
    if (fs.existsSync(f)) corpus.push(fs.readFileSync(f, "utf-8"));
  }

  return { corpus: corpus.join("\n"), perSkill };
}

const { corpus, perSkill } = gatherReferenceContent();

// Check skills — exclude the skill's own SKILL.md to prevent self-referencing
console.log("📁 Skills:");
const skillDirs = fs
  .readdirSync(SKILLS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

for (const skill of skillDirs) {
  checked++;
  // Build search content: agents + instructions + config + OTHER skills (not self)
  const otherSkills = Object.entries(perSkill)
    .filter(([name]) => name !== skill)
    .map(([, content]) => content)
    .join("\n");
  const searchContent = corpus + "\n" + otherSkills;

  const isReferenced =
    searchContent.includes(`${skill}/SKILL.md`) ||
    searchContent.includes(`skills/${skill}`) ||
    searchContent.includes(`${skill}/references/`) ||
    searchContent.includes(`${skill}/`) ||
    searchContent.includes(`\`${skill}\``);

  if (!isReferenced) {
    console.log(`  ⚠️  ${skill}/ — not referenced by any agent or instruction`);
    warnings++;
  }
}

// Check instruction files for completeness (applyTo presence)
// Instructions auto-load by glob pattern — missing applyTo means the
// instruction will never be applied automatically.
console.log("\n📁 Instructions (applyTo completeness):");
if (fs.existsSync(INSTRUCTIONS_DIR)) {
  const instrFiles = fs
    .readdirSync(INSTRUCTIONS_DIR)
    .filter((f) => f.endsWith(".instructions.md"));

  for (const file of instrFiles) {
    checked++;

    const filePath = path.join(INSTRUCTIONS_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    const hasApplyTo = fmMatch && fmMatch[1].includes("applyTo");

    if (!hasApplyTo) {
      console.log(
        `  ⚠️  ${file} — no applyTo frontmatter (instruction never auto-loads)`,
      );
      warnings++;
    }
  }
}

console.log(`\n${"─".repeat(50)}`);
console.log(`Checked: ${checked} | Warnings: ${warnings} | Errors: ${errors}`);

if (errors > 0) {
  console.log(`\n❌ ${errors} orphaned content error(s)`);
  process.exit(1);
}
console.log(`\n✅ Orphaned content check passed`);
