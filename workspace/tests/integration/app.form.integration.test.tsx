// Integration tests — App.tsx form rendering and live preview wiring
// Covers: AC3 (three-field form with labels), AC4 (preview updates on onChange)
// Environment: Vitest + jsdom + @testing-library/react
// Run: vitest run tests/integration/app.form.integration.test.tsx
//
// NOTE: Vitest config must set `environment: "jsdom"` for this file,
// or use a per-file `@vitest-environment jsdom` comment below.

// @vitest-environment jsdom

import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';
import React from 'react';
import App from '../../draft/src/webview/App';
import {
  LABEL_AGENT_NAME,
  LABEL_ROLE,
  LABEL_SYSTEM_INSTRUCTIONS,
  SECTION_PREVIEW,
} from '../../draft/src/webview/constants';

afterEach(() => {
  cleanup();
});

// ---------------------------------------------------------------------------
// AC3 — Three form fields with correct labels
// ---------------------------------------------------------------------------

describe('App form — field presence and structure (AC3)', () => {
  it('renders exactly three interactive form controls', () => {
    const { container } = render(<App />);
    // input[type=text] counts + textarea counts
    const inputs = container.querySelectorAll('input[type="text"]');
    const textareas = container.querySelectorAll('textarea');
    expect(inputs.length + textareas.length).toBe(3);
  });

  it('renders an Agent Name text input associated with the correct label', () => {
    render(<App />);
    const input = screen.getByLabelText(LABEL_AGENT_NAME);
    expect(input).toBeTruthy();
    expect(input.tagName.toLowerCase()).toBe('input');
    expect((input as HTMLInputElement).type).toBe('text');
  });

  it('renders a Role text input associated with the correct label', () => {
    render(<App />);
    const input = screen.getByLabelText(LABEL_ROLE);
    expect(input).toBeTruthy();
    expect(input.tagName.toLowerCase()).toBe('input');
    expect((input as HTMLInputElement).type).toBe('text');
  });

  it('renders a System Instructions textarea associated with the correct label', () => {
    render(<App />);
    const textarea = screen.getByLabelText(LABEL_SYSTEM_INSTRUCTIONS);
    expect(textarea).toBeTruthy();
    expect(textarea.tagName.toLowerCase()).toBe('textarea');
  });

  it('Agent Name label text is visible in the DOM', () => {
    render(<App />);
    expect(screen.getByText(LABEL_AGENT_NAME)).toBeTruthy();
  });

  it('Role label text is visible in the DOM', () => {
    render(<App />);
    expect(screen.getByText(LABEL_ROLE)).toBeTruthy();
  });

  it('System Instructions label text is visible in the DOM', () => {
    render(<App />);
    expect(screen.getByText(LABEL_SYSTEM_INSTRUCTIONS)).toBeTruthy();
  });

  it('no extra text inputs or textareas are rendered beyond the three required', () => {
    const { container } = render(<App />);
    const allInputs = container.querySelectorAll('input');
    const allTextareas = container.querySelectorAll('textarea');
    // Only type="text" inputs count (ignore hidden/submit/etc)
    const textInputs = Array.from(allInputs).filter(
      (el) => (el as HTMLInputElement).type === 'text',
    );
    expect(textInputs.length).toBe(2);  // name + role
    expect(allTextareas.length).toBe(1); // systemInstructions
  });
});

// ---------------------------------------------------------------------------
// AC4 — Preview updates immediately on every onChange (no debounce)
// ---------------------------------------------------------------------------

describe('App form — live preview updates on every keystroke (AC4)', () => {
  it('initial render shows a preview area in the DOM', () => {
    const { container } = render(<App />);
    // Preview is rendered inside a <pre> element
    const pre = container.querySelector('pre');
    expect(pre).toBeTruthy();
  });

  it('typing in Agent Name immediately updates the preview text', () => {
    const { container } = render(<App />);
    const nameInput = screen.getByLabelText(LABEL_AGENT_NAME);
    fireEvent.change(nameInput, { target: { value: 'Reviewer Agent' } });
    const pre = container.querySelector('pre');
    expect(pre?.textContent).toContain('Reviewer Agent');
  });

  it('typing in Role immediately updates the preview text', () => {
    const { container } = render(<App />);
    const roleInput = screen.getByLabelText(LABEL_ROLE);
    fireEvent.change(roleInput, { target: { value: 'Code Reviewer' } });
    const pre = container.querySelector('pre');
    expect(pre?.textContent).toContain('Code Reviewer');
  });

  it('typing in System Instructions immediately updates the preview text', () => {
    const { container } = render(<App />);
    const instructionsInput = screen.getByLabelText(LABEL_SYSTEM_INSTRUCTIONS);
    fireEvent.change(instructionsInput, { target: { value: 'Always review tests' } });
    const pre = container.querySelector('pre');
    expect(pre?.textContent).toContain('Always review tests');
  });

  it('preview reflects all three fields updated in sequence', () => {
    const { container } = render(<App />);
    fireEvent.change(screen.getByLabelText(LABEL_AGENT_NAME), {
      target: { value: 'Agent Sigma' },
    });
    fireEvent.change(screen.getByLabelText(LABEL_ROLE), {
      target: { value: 'TypeScript Expert' },
    });
    fireEvent.change(screen.getByLabelText(LABEL_SYSTEM_INSTRUCTIONS), {
      target: { value: 'No any types' },
    });
    const pre = container.querySelector('pre');
    expect(pre?.textContent).toContain('Agent Sigma');
    expect(pre?.textContent).toContain('TypeScript Expert');
    expect(pre?.textContent).toContain('No any types');
  });

  it('preview updates on single-character entry (no minimum length gate)', () => {
    const { container } = render(<App />);
    const nameInput = screen.getByLabelText(LABEL_AGENT_NAME);
    fireEvent.change(nameInput, { target: { value: 'X' } });
    const pre = container.querySelector('pre');
    expect(pre?.textContent).toContain('X');
  });

  it('clearing a field removes its value from the preview', () => {
    const { container } = render(<App />);
    const nameInput = screen.getByLabelText(LABEL_AGENT_NAME);
    fireEvent.change(nameInput, { target: { value: 'Temporary' } });
    // Now clear it
    fireEvent.change(nameInput, { target: { value: '' } });
    const pre = container.querySelector('pre');
    expect(pre?.textContent).not.toContain('Temporary');
  });

  it('preview uses <pre> element, not dangerouslySetInnerHTML (no XSS risk)', () => {
    const { container } = render(<App />);
    // Verify the preview renders as a <pre>, NOT via innerHTML with raw HTML
    const pre = container.querySelector('pre');
    expect(pre).toBeTruthy();
    // Inject HTML into a field — it must appear escaped, not rendered as DOM
    fireEvent.change(screen.getByLabelText(LABEL_AGENT_NAME), {
      target: { value: '<script>alert(1)</script>' },
    });
    // The raw string must appear as text, not create a script element
    const injectedScript = container.querySelector('pre script');
    expect(injectedScript).toBeNull();
    expect(pre?.textContent).toContain('<script>');
  });
});

// ---------------------------------------------------------------------------
// Error-path companion (E2E Rule #4 at integration level)
// ---------------------------------------------------------------------------

describe('App form — error state: inputs accept empty values without crash (AC3/AC4)', () => {
  it('renders without error when all fields are empty strings', () => {
    expect(() => render(<App />)).not.toThrow();
  });

  it('clearing all fields one by one does not crash the component', () => {
    const { container } = render(<App />);
    expect(() => {
      fireEvent.change(screen.getByLabelText(LABEL_AGENT_NAME), { target: { value: '' } });
      fireEvent.change(screen.getByLabelText(LABEL_ROLE), { target: { value: '' } });
      fireEvent.change(screen.getByLabelText(LABEL_SYSTEM_INSTRUCTIONS), { target: { value: '' } });
    }).not.toThrow();
    const pre = container.querySelector('pre');
    expect(pre).toBeTruthy();
  });

  it('preview does not show "undefined" when all fields are empty', () => {
    const { container } = render(<App />);
    const pre = container.querySelector('pre');
    expect(pre?.textContent).not.toContain('undefined');
  });
});
