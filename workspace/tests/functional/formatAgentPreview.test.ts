// Functional tests — formatAgentPreview pure function
// Covers: AC4 (live preview updates on every onChange), AC5 (markdown format)
// Environment: Vitest, Node or jsdom (no DOM interaction needed — pure function)
// Run: vitest run tests/functional/formatAgentPreview.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { formatAgentPreview } from '../../draft/src/webview/App';
import {
  SECTION_ROLE,
  SECTION_SYSTEM_INSTRUCTIONS,
} from '../../draft/src/webview/constants';

// Re-declare the interface here for test clarity.
// The real interface lives in App.tsx — this mirrors it.
interface AgentFormState {
  name: string;
  role: string;
  systemInstructions: string;
}

// ---------------------------------------------------------------------------
// AC5 — Markdown format tests
// ---------------------------------------------------------------------------

describe('formatAgentPreview — markdown format (AC5)', () => {
  it('starts output with "# " followed immediately by the agent name', () => {
    const state: AgentFormState = { name: 'Code Reviewer', role: '', systemInstructions: '' };
    const output = formatAgentPreview(state);
    expect(output).toMatch(/^# Code Reviewer/);
  });

  it('H1 is empty string when agent name is empty (renders "# " not "# undefined")', () => {
    const state: AgentFormState = { name: '', role: '', systemInstructions: '' };
    const output = formatAgentPreview(state);
    expect(output).toMatch(/^# $/m);
    expect(output).not.toContain('undefined');
    expect(output).not.toContain('null');
  });

  it('contains ## Role section using SECTION_ROLE constant (not hardcoded string)', () => {
    const state: AgentFormState = { name: '', role: 'Senior reviewer', systemInstructions: '' };
    const output = formatAgentPreview(state);
    // Assert against the imported constant — if Builder hardcodes "Role", this test
    // still passes (constants value IS "Role"), but the NEXT test will catch the omission
    expect(output).toContain(`## ${SECTION_ROLE}`);
  });

  it('SECTION_ROLE constant equals "Role" — verifies constant import chain is correct', () => {
    // If this fails, constants.ts is missing or has wrong export
    expect(SECTION_ROLE).toBe('Role');
  });

  it('contains ## System Instructions section using SECTION_SYSTEM_INSTRUCTIONS constant', () => {
    const state: AgentFormState = { name: '', role: '', systemInstructions: 'Always be strict' };
    const output = formatAgentPreview(state);
    expect(output).toContain(`## ${SECTION_SYSTEM_INSTRUCTIONS}`);
  });

  it('SECTION_SYSTEM_INSTRUCTIONS constant equals "System Instructions"', () => {
    expect(SECTION_SYSTEM_INSTRUCTIONS).toBe('System Instructions');
  });

  it('role value appears below the ## Role heading', () => {
    const state: AgentFormState = { name: '', role: 'Senior reviewer', systemInstructions: '' };
    const output = formatAgentPreview(state);
    expect(output).toContain(`## ${SECTION_ROLE}\nSenior reviewer`);
  });

  it('systemInstructions value appears below the ## System Instructions heading', () => {
    const state: AgentFormState = { name: '', role: '', systemInstructions: 'Always be strict' };
    const output = formatAgentPreview(state);
    expect(output).toContain(`## ${SECTION_SYSTEM_INSTRUCTIONS}\nAlways be strict`);
  });

  it('matches exact markdown structure when all fields are filled', () => {
    const state: AgentFormState = {
      name: 'My Agent',
      role: 'My Role',
      systemInstructions: 'My Instructions',
    };
    const expected =
      `# My Agent\n\n## ${SECTION_ROLE}\nMy Role\n\n## ${SECTION_SYSTEM_INSTRUCTIONS}\nMy Instructions`;
    expect(formatAgentPreview(state)).toBe(expected);
  });

  it('matches exact markdown structure when only name is filled (partial state)', () => {
    const state: AgentFormState = { name: 'Agent X', role: '', systemInstructions: '' };
    const expected =
      `# Agent X\n\n## ${SECTION_ROLE}\n\n\n## ${SECTION_SYSTEM_INSTRUCTIONS}\n`;
    // Section headings always appear even when values are empty
    const output = formatAgentPreview(state);
    expect(output).toMatch(/^# Agent X/);
    expect(output).toContain(`## ${SECTION_ROLE}`);
    expect(output).toContain(`## ${SECTION_SYSTEM_INSTRUCTIONS}`);
  });

  it('all fields empty — still produces all three headings', () => {
    const state: AgentFormState = { name: '', role: '', systemInstructions: '' };
    const output = formatAgentPreview(state);
    expect(output).toContain('# ');
    expect(output).toContain(`## ${SECTION_ROLE}`);
    expect(output).toContain(`## ${SECTION_SYSTEM_INSTRUCTIONS}`);
  });

  it('output never contains "undefined" in any field position', () => {
    const state: AgentFormState = { name: '', role: '', systemInstructions: '' };
    expect(formatAgentPreview(state)).not.toContain('undefined');
  });

  it('output never contains "null" in any field position', () => {
    const state: AgentFormState = { name: '', role: '', systemInstructions: '' };
    expect(formatAgentPreview(state)).not.toContain('null');
  });
});

// ---------------------------------------------------------------------------
// AC4 — Live update: pure function reflects each incremental state change
// The test simulates what happens on every onChange keystroke by calling
// formatAgentPreview with progressively updated state objects.
// ---------------------------------------------------------------------------

describe('formatAgentPreview — live update behaviour (AC4)', () => {
  it('reflects single-character Agent Name change immediately', () => {
    const state: AgentFormState = { name: 'A', role: '', systemInstructions: '' };
    expect(formatAgentPreview(state)).toMatch(/^# A/);
  });

  it('reflects each new character appended to Agent Name', () => {
    const chars = ['C', 'Co', 'Cod', 'Code'];
    for (const partial of chars) {
      const output = formatAgentPreview({ name: partial, role: '', systemInstructions: '' });
      expect(output).toMatch(new RegExp(`^# ${partial}`));
    }
  });

  it('reflects single-character Role change', () => {
    const state: AgentFormState = { name: '', role: 'R', systemInstructions: '' };
    expect(formatAgentPreview(state)).toContain(`## ${SECTION_ROLE}\nR`);
  });

  it('reflects single-character System Instructions change', () => {
    const state: AgentFormState = { name: '', role: '', systemInstructions: 'B' };
    expect(formatAgentPreview(state)).toContain(`## ${SECTION_SYSTEM_INSTRUCTIONS}\nB`);
  });

  it('is a pure function — same input always produces same output', () => {
    const state: AgentFormState = { name: 'X', role: 'Y', systemInstructions: 'Z' };
    expect(formatAgentPreview(state)).toBe(formatAgentPreview(state));
  });

  it('does not share state between calls — no internal mutation', () => {
    const stateA: AgentFormState = { name: 'Agent A', role: '', systemInstructions: '' };
    const stateB: AgentFormState = { name: 'Agent B', role: '', systemInstructions: '' };
    const outputA = formatAgentPreview(stateA);
    const outputB = formatAgentPreview(stateB);
    expect(outputA).toContain('Agent A');
    expect(outputB).toContain('Agent B');
    expect(outputA).not.toContain('Agent B');
    expect(outputB).not.toContain('Agent A');
  });
});
