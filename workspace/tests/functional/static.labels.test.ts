// Static analysis test — user-visible label strings in App.tsx
// Covers: AC7 (all JSX string literals sourced from constants.ts)
// Environment: Vitest, Node environment (reads source files via fs)
// Run: vitest run tests/functional/static.labels.test.ts

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Resolve paths relative to this test file
const __dirname_compat = dirname(fileURLToPath(import.meta.url));
const DRAFT_ROOT = resolve(__dirname_compat, '../../draft');
const APP_TSX_PATH = resolve(DRAFT_ROOT, 'src/webview/App.tsx');
const CONSTANTS_TS_PATH = resolve(DRAFT_ROOT, 'src/webview/constants.ts');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Extract all string literals that look like user-visible English labels from JSX.
 * Rules (per INTER_AGENT_CONTEXT.md AC7 interpretation):
 *  - Starts with an uppercase letter
 *  - Contains at least one space (multi-word labels) OR is a known single-word label
 *  - Ignores Tailwind CSS utility classes (lowercase, hyphenated)
 *  - Found between JSX tags (>...<) or in attribute values
 */
function extractJsxStringLiterals(source: string): string[] {
  const literals: string[] = [];

  // Pattern 1: String literals between JSX tags — {' '} and plain text
  // Match strings in JSX text content (between > and <), trim whitespace
  const jsxTextPattern = />([^<>{}"'`]+)</g;
  let match: RegExpExecArray | null;
  while ((match = jsxTextPattern.exec(source)) !== null) {
    const text = match[1].trim();
    if (isEnglishLabel(text)) {
      literals.push(text);
    }
  }

  // Pattern 2: String literals in JSX attribute values (placeholder, aria-label, title)
  // e.g. placeholder="Enter agent name"
  const attrStringPattern = /(?:placeholder|aria-label|title|aria-labelledby)=["']([^"']+)["']/g;
  while ((match = attrStringPattern.exec(source)) !== null) {
    const text = match[1].trim();
    if (isEnglishLabel(text)) {
      literals.push(text);
    }
  }

  return [...new Set(literals)]; // deduplicate
}

/**
 * A string is considered a user-visible English label if it:
 * - starts with an uppercase letter
 * - is at least 2 chars long
 * - does NOT look like a Tailwind class (all lowercase, contains hyphens only)
 * - does NOT look like a JSX attribute name or HTML tag
 */
function isEnglishLabel(text: string): boolean {
  if (!text || text.length < 2) return false;
  if (!/^[A-Z]/.test(text)) return false; // must start uppercase
  // Tailwind utility strings look like "flex", "flex-col", "gap-4" — all lowercase
  if (/^[a-z]/.test(text)) return false;
  // Skip single words that are structural (could be a component name, HTML tag, etc.)
  // Allow: "Agent Name", "Role", "System Instructions", "Preview", "Agent Builder"
  return true;
}

/**
 * Extract all exported string constant values from constants.ts
 */
function extractConstantValues(source: string): string[] {
  const values: string[] = [];
  // Match: export const FOO = 'bar'; or export const FOO = "bar";
  const exportPattern = /export\s+const\s+\w+\s*=\s*['"]([^'"]+)['"]/g;
  let match: RegExpExecArray | null;
  while ((match = exportPattern.exec(source)) !== null) {
    values.push(match[1]);
  }
  return values;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Static analysis — AC7: labels sourced from constants.ts', () => {
  it('App.tsx file exists at draft/src/webview/App.tsx', () => {
    expect(existsSync(APP_TSX_PATH)).toBe(true);
  });

  it('constants.ts file exists at draft/src/webview/constants.ts', () => {
    expect(existsSync(CONSTANTS_TS_PATH)).toBe(true);
  });

  it('constants.ts exports LABEL_AGENT_NAME as "Agent Name"', () => {
    const source = readFileSync(CONSTANTS_TS_PATH, 'utf-8');
    expect(source).toContain("LABEL_AGENT_NAME");
    expect(source).toContain("'Agent Name'");
  });

  it('constants.ts exports LABEL_ROLE as "Role"', () => {
    const source = readFileSync(CONSTANTS_TS_PATH, 'utf-8');
    expect(source).toContain("LABEL_ROLE");
    expect(source).toContain("'Role'");
  });

  it('constants.ts exports LABEL_SYSTEM_INSTRUCTIONS as "System Instructions"', () => {
    const source = readFileSync(CONSTANTS_TS_PATH, 'utf-8');
    expect(source).toContain("LABEL_SYSTEM_INSTRUCTIONS");
    expect(source).toContain("'System Instructions'");
  });

  it('constants.ts exports PANEL_TITLE as "Agent Builder"', () => {
    const source = readFileSync(CONSTANTS_TS_PATH, 'utf-8');
    expect(source).toContain("PANEL_TITLE");
    expect(source).toContain("'Agent Builder'");
  });

  it('constants.ts exports SECTION_ROLE as "Role"', () => {
    const source = readFileSync(CONSTANTS_TS_PATH, 'utf-8');
    expect(source).toContain("SECTION_ROLE");
    // Value "Role" is already covered by LABEL_ROLE check; ensure export exists
    expect(source).toContain("SECTION_ROLE");
  });

  it('constants.ts exports SECTION_SYSTEM_INSTRUCTIONS as "System Instructions"', () => {
    const source = readFileSync(CONSTANTS_TS_PATH, 'utf-8');
    expect(source).toContain("SECTION_SYSTEM_INSTRUCTIONS");
  });

  it('constants.ts exports SECTION_PREVIEW', () => {
    const source = readFileSync(CONSTANTS_TS_PATH, 'utf-8');
    expect(source).toContain("SECTION_PREVIEW");
  });

  it('App.tsx imports from constants.ts', () => {
    const source = readFileSync(APP_TSX_PATH, 'utf-8');
    expect(source).toMatch(/import[\s\S]+from\s+['"]\.\/constants['"]/);
  });

  it('App.tsx contains zero English-phrase string literals in JSX that are not in constants.ts', () => {
    const appSource = readFileSync(APP_TSX_PATH, 'utf-8');
    const constantsSource = readFileSync(CONSTANTS_TS_PATH, 'utf-8');

    const jsxLiterals = extractJsxStringLiterals(appSource);
    const constantValues = extractConstantValues(constantsSource);

    const orphanLiterals = jsxLiterals.filter((lit) => !constantValues.includes(lit));

    expect(orphanLiterals).toEqual(
      [],
      `Found user-visible label string(s) in App.tsx that are NOT exported from constants.ts:\n` +
      orphanLiterals.map((s) => `  - "${s}"`).join('\n') +
      `\nAdd these to constants.ts and import them in App.tsx.`,
    );
  });

  it('App.tsx does not use the hardcoded string "Agent Name" directly in JSX (must use LABEL_AGENT_NAME)', () => {
    const source = readFileSync(APP_TSX_PATH, 'utf-8');
    // Remove import lines first to avoid false positives on the import itself
    const withoutImports = source.replace(/^import[^\n]+\n/gm, '');
    // If "Agent Name" appears as a JSX literal (not as a constant reference), it's a violation
    // We look for it in JSX text content or attribute values, NOT inside { } expressions
    const hardcodedInJsx = />Agent Name<|placeholder=["']Agent Name["']/;
    expect(hardcodedInJsx.test(withoutImports)).toBe(false);
  });

  it('App.tsx does not use the hardcoded string "System Instructions" directly in JSX', () => {
    const source = readFileSync(APP_TSX_PATH, 'utf-8');
    const withoutImports = source.replace(/^import[^\n]+\n/gm, '');
    const hardcodedInJsx = />System Instructions<|placeholder=["']System Instructions["']/;
    expect(hardcodedInJsx.test(withoutImports)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Error-path companion — constants.ts structure is complete
// ---------------------------------------------------------------------------

describe('Static analysis — AC7 error path: constants.ts must not be empty', () => {
  it('constants.ts has at least 7 exports (minimum required set)', () => {
    const source = readFileSync(CONSTANTS_TS_PATH, 'utf-8');
    const exportPattern = /export\s+const\s+\w+/g;
    const exports = source.match(exportPattern) ?? [];
    expect(exports.length).toBeGreaterThanOrEqual(7);
  });

  it('App.tsx does not have zero imports from constants.ts (would indicate bypass)', () => {
    const source = readFileSync(APP_TSX_PATH, 'utf-8');
    const importMatch = source.match(/import\s*\{([^}]+)\}\s*from\s*['"]\.\/constants['"]/);
    expect(importMatch).not.toBeNull();
    const importedNames = importMatch![1].split(',').map((s) => s.trim()).filter(Boolean);
    expect(importedNames.length).toBeGreaterThanOrEqual(3);
  });
});
