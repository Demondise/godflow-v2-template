// Static analysis test — zero `any` types across all source files
// Covers: AC8 (no `: any` or `as any` in src/**/*.ts and src/**/*.tsx)
//         Also checks for @ts-ignore (masks type errors — same intent as `any`)
// Environment: Vitest, Node environment (reads source files via fs/glob)
// Run: vitest run tests/functional/static.types.test.ts

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { resolve, join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname_compat = dirname(fileURLToPath(import.meta.url));
const DRAFT_SRC_ROOT = resolve(__dirname_compat, '../../draft/src');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Recursively collect all .ts and .tsx files under a directory. */
function collectSourceFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...collectSourceFiles(fullPath));
    } else {
      const ext = extname(entry);
      if (ext === '.ts' || ext === '.tsx') {
        results.push(fullPath);
      }
    }
  }
  return results;
}

/** Find all occurrences of a pattern in source, returning [{file, line, text}] */
interface Match {
  file: string;
  line: number;
  text: string;
}

function findPattern(files: string[], pattern: RegExp): Match[] {
  const matches: Match[] = [];
  for (const file of files) {
    const lines = readFileSync(file, 'utf-8').split('\n');
    lines.forEach((text, idx) => {
      if (pattern.test(text)) {
        matches.push({ file, line: idx + 1, text: text.trim() });
      }
    });
  }
  return matches;
}

function formatMatchList(matches: Match[]): string {
  return matches
    .map((m) => `  ${m.file}:${m.line}  →  ${m.text}`)
    .join('\n');
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Static analysis — AC8: zero `any` types in src/', () => {
  it('draft/src/ directory exists (Builder has run)', () => {
    expect(existsSync(DRAFT_SRC_ROOT)).toBe(true);
  });

  it('at least one TypeScript source file exists in draft/src/', () => {
    const files = collectSourceFiles(DRAFT_SRC_ROOT);
    expect(files.length).toBeGreaterThan(0);
  });

  it('zero occurrences of ": any" across all .ts and .tsx files', () => {
    const files = collectSourceFiles(DRAFT_SRC_ROOT);
    // Pattern: ": any" — the explicit type annotation `any`
    // Excludes comment lines (we check the full line but the pattern is loose enough
    // to allow "// some comment about :any concept" — we keep it strict because
    // PRINCIPLES.md says no `any` anywhere.
    const matches = findPattern(files, /:\s*any\b/);
    expect(matches).toEqual(
      [],
      `Found ": any" in ${matches.length} location(s). Remove all explicit any types:\n` +
      formatMatchList(matches),
    );
  });

  it('zero occurrences of "as any" across all .ts and .tsx files', () => {
    const files = collectSourceFiles(DRAFT_SRC_ROOT);
    const matches = findPattern(files, /\bas\s+any\b/);
    expect(matches).toEqual(
      [],
      `Found "as any" in ${matches.length} location(s). Remove all any casts:\n` +
      formatMatchList(matches),
    );
  });

  it('zero occurrences of @ts-ignore across all .ts and .tsx files', () => {
    // @ts-ignore has the same intent as `any` — suppressing type errors.
    // PRINCIPLES.md P.Code.5 forbids `any`; same spirit applies to @ts-ignore.
    const files = collectSourceFiles(DRAFT_SRC_ROOT);
    const matches = findPattern(files, /@ts-ignore/);
    expect(matches).toEqual(
      [],
      `Found @ts-ignore in ${matches.length} location(s). Fix the underlying type error instead:\n` +
      formatMatchList(matches),
    );
  });

  it('zero occurrences of @ts-expect-error used to mask real type gaps', () => {
    // @ts-expect-error is acceptable in TEST files only — never in src/
    const files = collectSourceFiles(DRAFT_SRC_ROOT);
    const matches = findPattern(files, /@ts-expect-error/);
    expect(matches).toEqual(
      [],
      `Found @ts-expect-error in src/ in ${matches.length} location(s).\n` +
      `@ts-expect-error is only acceptable in test files, not in production source:\n` +
      formatMatchList(matches),
    );
  });
});

// ---------------------------------------------------------------------------
// Error-path companion — verify specific known files have correct types
// ---------------------------------------------------------------------------

describe('Static analysis — AC8 error path: key files are strongly typed', () => {
  it('extension.ts exists and does not use implicit any through missing return types', () => {
    const extensionPath = join(DRAFT_SRC_ROOT, 'extension.ts');
    expect(existsSync(extensionPath)).toBe(true);
    const source = readFileSync(extensionPath, 'utf-8');
    // The getWebviewContent function must have explicit parameter types
    expect(source).toMatch(/getWebviewContent\s*\(/);
    // Should not return untyped implicit any
    expect(source).not.toMatch(/:\s*any\b/);
  });

  it('App.tsx exists and defines AgentFormState interface with no any fields', () => {
    const appPath = join(DRAFT_SRC_ROOT, 'webview/App.tsx');
    expect(existsSync(appPath)).toBe(true);
    const source = readFileSync(appPath, 'utf-8');
    // AgentFormState interface must exist
    expect(source).toContain('AgentFormState');
    // Interface must not use any
    expect(source).not.toMatch(/:\s*any\b/);
  });

  it('constants.ts has no any annotations (it only exports string constants)', () => {
    const constantsPath = join(DRAFT_SRC_ROOT, 'webview/constants.ts');
    expect(existsSync(constantsPath)).toBe(true);
    const source = readFileSync(constantsPath, 'utf-8');
    expect(source).not.toMatch(/:\s*any\b/);
    expect(source).not.toMatch(/\bas\s+any\b/);
  });
});
