#!/usr/bin/env node
/** P2 — Vision fixture verifier.
 *
 *  Validates every JSON in fixtures/vision/ against the AnalyzeResponse
 *  contract from src/types/index.ts (rules also documented in
 *  docs/INTEGRATION.md §"Rules both sides must follow"):
 *
 *    - tag.name is lowercase
 *    - tag.confidence ≥ 0.7
 *    - tag.category ∈ {clothing, accessory, footwear, other}
 *    - color.dominance values sum to ~1.0 (±0.02)
 *    - color.hex matches /^#[0-9A-F]{6}$/
 *    - dominantColor is a non-empty string
 *
 *  Run:  node scripts/verify-fixtures.mjs
 *  Exit: 0 if all pass, 1 if any fail.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURE_DIR = join(__dirname, "..", "fixtures", "vision");

const VALID_CATEGORIES = new Set(["clothing", "accessory", "footwear", "other"]);
const HEX_RE = /^#[0-9A-F]{6}$/;

function validate(fixture, file) {
  const errors = [];
  const r = fixture.response;
  if (!r) return [`missing 'response' field`];

  if (!Array.isArray(r.tags) || r.tags.length === 0) {
    errors.push(`tags must be a non-empty array`);
  } else {
    r.tags.forEach((t, i) => {
      if (typeof t.name !== "string" || t.name !== t.name.toLowerCase()) {
        errors.push(`tags[${i}].name must be lowercase string (got: ${JSON.stringify(t.name)})`);
      }
      if (typeof t.confidence !== "number" || t.confidence < 0.7 || t.confidence > 1) {
        errors.push(`tags[${i}].confidence must be in [0.7, 1] (got: ${t.confidence})`);
      }
      if (!VALID_CATEGORIES.has(t.category)) {
        errors.push(`tags[${i}].category must be one of ${[...VALID_CATEGORIES].join("|")} (got: ${t.category})`);
      }
    });
  }

  if (!Array.isArray(r.colors) || r.colors.length === 0) {
    errors.push(`colors must be a non-empty array`);
  } else {
    let sum = 0;
    r.colors.forEach((c, i) => {
      if (typeof c.name !== "string" || c.name !== c.name.toLowerCase()) {
        errors.push(`colors[${i}].name must be lowercase string (got: ${JSON.stringify(c.name)})`);
      }
      if (typeof c.hex !== "string" || !HEX_RE.test(c.hex)) {
        errors.push(`colors[${i}].hex must match /^#[0-9A-F]{6}$/ (got: ${c.hex})`);
      }
      if (typeof c.dominance !== "number" || c.dominance < 0 || c.dominance > 1) {
        errors.push(`colors[${i}].dominance must be in [0, 1] (got: ${c.dominance})`);
      }
      sum += c.dominance ?? 0;
    });
    if (Math.abs(sum - 1) > 0.02) {
      errors.push(`color dominance must sum to ~1.0 (got: ${sum.toFixed(3)})`);
    }
  }

  if (typeof r.dominantColor !== "string" || r.dominantColor.length === 0) {
    errors.push(`dominantColor must be a non-empty string`);
  }

  if (!Array.isArray(r.rawTags)) {
    errors.push(`rawTags must be an array`);
  }

  return errors;
}

function main() {
  let files;
  try {
    files = readdirSync(FIXTURE_DIR).filter((f) => f.endsWith(".json"));
  } catch {
    console.error(`✗ Fixture directory not found: ${FIXTURE_DIR}`);
    process.exit(1);
  }

  if (files.length === 0) {
    console.error(`✗ No fixtures found in ${FIXTURE_DIR}`);
    process.exit(1);
  }

  let failed = 0;
  for (const file of files) {
    const path = join(FIXTURE_DIR, file);
    let fixture;
    try {
      fixture = JSON.parse(readFileSync(path, "utf-8"));
    } catch (e) {
      console.error(`✗ ${file}  invalid JSON: ${e.message}`);
      failed++;
      continue;
    }
    const errors = validate(fixture, file);
    if (errors.length === 0) {
      console.log(`✓ ${file}  (${fixture.name})`);
    } else {
      console.error(`✗ ${file}  (${fixture.name})`);
      for (const e of errors) console.error(`    - ${e}`);
      failed++;
    }
  }

  console.log("");
  if (failed === 0) {
    console.log(`All ${files.length} fixture(s) passed.`);
    process.exit(0);
  } else {
    console.error(`${failed} of ${files.length} fixture(s) failed.`);
    process.exit(1);
  }
}

main();
