// Functional tests — getWebviewContent CSP output
// Covers: AC6 (Content-Security-Policy: nonce-based, no unsafe-inline, no unsafe-eval)
// Environment: Vitest, Node environment
// Run: vitest run tests/functional/extension.csp.test.ts
//
// The `vscode` module is mocked below — getWebviewContent() is a pure string-builder
// that takes injected stubs, so no real VS Code instance is needed.

import { describe, it, expect, vi, beforeAll } from 'vitest';

// ---------------------------------------------------------------------------
// Mock `vscode` module so extension.ts can be imported outside VS Code.
// Only the APIs used by getWebviewContent() need stubs.
// ---------------------------------------------------------------------------
vi.mock('vscode', () => ({
  window: {
    createWebviewPanel: vi.fn(),
  },
  ViewColumn: { One: 1 },
  Uri: {
    joinPath: vi.fn((_base: unknown, ...parts: string[]) => parts.join('/')),
    file: vi.fn((p: string) => ({ fsPath: p })),
  },
  commands: {
    registerCommand: vi.fn(),
  },
  ExtensionContext: {},
}));

import { getWebviewContent } from '../../draft/src/extension';

// ---------------------------------------------------------------------------
// Stubs passed into getWebviewContent(webview, extensionUri, nonce)
// ---------------------------------------------------------------------------
const TEST_NONCE = 'test-nonce-abc123XYZ';

const stubWebview = {
  cspSource: 'vscode-resource:',
  asWebviewUri: (uri: unknown) => `vscode-resource://out/webview/${String(uri)}`,
};

const stubExtensionUri = { fsPath: '/test/extension' };

// ---------------------------------------------------------------------------
// Happy-path tests — CSP structure
// ---------------------------------------------------------------------------

describe('getWebviewContent — Content-Security-Policy (AC6)', () => {
  let html: string;

  beforeAll(() => {
    html = getWebviewContent(
      stubWebview as Parameters<typeof getWebviewContent>[0],
      stubExtensionUri as Parameters<typeof getWebviewContent>[1],
      TEST_NONCE,
    );
  });

  it('returns a non-empty string', () => {
    expect(typeof html).toBe('string');
    expect(html.length).toBeGreaterThan(0);
  });

  it('HTML contains a Content-Security-Policy meta tag', () => {
    expect(html).toMatch(/Content-Security-Policy/i);
  });

  it('CSP script-src directive contains "nonce-"', () => {
    expect(html).toContain('nonce-');
  });

  it('CSP script-src directive contains the full nonce value prefixed with "nonce-"', () => {
    expect(html).toContain(`nonce-${TEST_NONCE}`);
  });

  it('<script> tag for webview.js has a nonce attribute', () => {
    // The script tag must carry the same nonce that appears in the CSP
    const scriptNonceRegex = /nonce=["']([^"']+)["']/;
    const match = scriptNonceRegex.exec(html);
    expect(match).not.toBeNull();
    expect(match![1]).toBe(TEST_NONCE);
  });

  it('nonce in script tag matches nonce in CSP (no mismatch)', () => {
    // Extract nonce from CSP
    const cspNonceMatch = /nonce-([\w\-+/=]+)/.exec(html);
    // Extract nonce from script tag attribute
    const scriptNonceMatch = /nonce=["']([\w\-+/=]+)["']/.exec(html);
    expect(cspNonceMatch).not.toBeNull();
    expect(scriptNonceMatch).not.toBeNull();
    expect(cspNonceMatch![1]).toBe(scriptNonceMatch![1]);
  });

  it('HTML does NOT contain "unsafe-inline"', () => {
    expect(html).not.toContain('unsafe-inline');
  });

  it('HTML does NOT contain "unsafe-eval"', () => {
    expect(html).not.toContain('unsafe-eval');
  });

  it('HTML contains a <script> tag that references webview.js', () => {
    expect(html).toMatch(/<script[^>]*webview\.js[^>]*>/i);
  });

  it('HTML contains a <link> tag for style.css', () => {
    expect(html).toMatch(/<link[^>]*style\.css[^>]*>/i);
  });

  it('CSP default-src is "none"', () => {
    // default-src 'none' is required — no permissive default fallback
    expect(html).toContain("default-src 'none'");
  });

  it('CSP style-src uses webview.cspSource (not unsafe-inline)', () => {
    // style-src must reference the webview CSP source token, not unsafe-inline
    expect(html).toContain('style-src');
    expect(html).toContain(stubWebview.cspSource);
    expect(html).not.toContain('unsafe-inline');
  });
});

// ---------------------------------------------------------------------------
// Error-path companion test (E2E Rule #4 applied at function level)
// ---------------------------------------------------------------------------

describe('getWebviewContent — different nonces produce distinct outputs (AC6)', () => {
  it('two different nonces produce two different HTML strings', () => {
    const html1 = getWebviewContent(
      stubWebview as Parameters<typeof getWebviewContent>[0],
      stubExtensionUri as Parameters<typeof getWebviewContent>[1],
      'nonce-one',
    );
    const html2 = getWebviewContent(
      stubWebview as Parameters<typeof getWebviewContent>[0],
      stubExtensionUri as Parameters<typeof getWebviewContent>[1],
      'nonce-two',
    );
    expect(html1).not.toBe(html2);
    expect(html1).toContain('nonce-one');
    expect(html2).toContain('nonce-two');
  });

  it('nonce appears in BOTH the CSP meta tag AND the script nonce attribute', () => {
    const nonce = 'uniqueNonce42';
    const html = getWebviewContent(
      stubWebview as Parameters<typeof getWebviewContent>[0],
      stubExtensionUri as Parameters<typeof getWebviewContent>[1],
      nonce,
    );
    // Must appear twice minimum: once in CSP value, once in <script nonce="...">
    const occurrences = (html.match(new RegExp(nonce, 'g')) ?? []).length;
    expect(occurrences).toBeGreaterThanOrEqual(2);
  });
});
