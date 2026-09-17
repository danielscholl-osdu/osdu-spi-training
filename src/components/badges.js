// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// Small decorative drawings for the lesson footer, in the field-notes style of
// the generated artwork (navy linework, muted owner-color fills, no words).
// They carry no claim; each is aria-hidden where it is placed.
const navy = '#102c47';
const blue = '#0b6a9c';
const green = '#1f7a5c';
const orange = '#a34d21';
const line = `fill="none" stroke="${navy}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;

const drawings = {
  // A path through three nodes, one per owner: the running example crosses them.
  path: `<path ${line} stroke-dasharray="3 4" d="M12 44 C 20 20, 30 20, 32 32 S 44 44, 52 20"/>
    <circle cx="12" cy="44" r="6" fill="${blue}" stroke="${navy}" stroke-width="2"/>
    <circle cx="32" cy="32" r="6" fill="${green}" stroke="${navy}" stroke-width="2"/>
    <circle cx="52" cy="20" r="6" fill="${orange}" stroke="${navy}" stroke-width="2"/>`,
  // Headphones whose cups are small gears, with a short sound wave between.
  headphones: `<path ${line} d="M14 34 A 18 18 0 0 1 50 34"/>
    <circle cx="14" cy="40" r="8" fill="${blue}" stroke="${navy}" stroke-width="2"/>
    <circle cx="14" cy="40" r="11" ${line} stroke-dasharray="2.5 3"/>
    <circle cx="50" cy="40" r="8" fill="${orange}" stroke="${navy}" stroke-width="2"/>
    <circle cx="50" cy="40" r="11" ${line} stroke-dasharray="2.5 3"/>
    <path ${line} d="M28 40 v-6 M32 40 v-12 M36 40 v-6"/>`,
  // A folded drawing sheet with a diagram on it and a magnifier over one corner.
  sheet: `<path ${line} fill="#fff" d="M12 12 h32 l8 8 v32 H12 Z"/>
    <path ${line} d="M44 12 v8 h8"/>
    <rect x="18" y="26" width="10" height="7" fill="${blue}" stroke="${navy}" stroke-width="2"/>
    <rect x="34" y="38" width="10" height="7" fill="${green}" stroke="${navy}" stroke-width="2"/>
    <path ${line} d="M28 30 h8 v8"/>
    <circle cx="44" cy="46" r="8" fill="#fff" stroke="${navy}" stroke-width="2"/>
    <path ${line} d="M50 52 l7 7"/>`,
  // An open notebook with ruled pages and a bookmark.
  notebook: `<path ${line} fill="#fff" d="M10 16 Q 22 12 32 18 Q 42 12 54 16 V 48 Q 42 44 32 50 Q 22 44 10 48 Z"/>
    <path ${line} d="M32 18 V 50"/>
    <path ${line} d="M16 24 h10 M16 31 h10 M16 38 h10 M38 24 h10 M38 31 h10 M38 38 h10"/>
    <path fill="${orange}" stroke="${navy}" stroke-width="2" d="M46 15 v12 l-3 -3 l-3 3 v-12 Z"/>`,
  // A workstation with a small gear beside it: tools installed, nothing signed in.
  workstation: `<rect x="10" y="14" width="34" height="24" rx="2" fill="#fff" stroke="${navy}" stroke-width="2"/>
    <path ${line} d="M18 44 h18 M27 38 v6"/>
    <path ${line} d="M16 22 h10 M16 28 h16"/>
    <circle cx="50" cy="44" r="7" fill="${green}" stroke="${navy}" stroke-width="2"/>
    <circle cx="50" cy="44" r="10" ${line} stroke-dasharray="2.5 3"/>`,
  // A workstation talking to a cloud: an environment provisioned from here.
  'workstation-cloud': `<rect x="8" y="24" width="28" height="20" rx="2" fill="#fff" stroke="${navy}" stroke-width="2"/>
    <path ${line} d="M15 50 h14 M22 44 v6"/>
    <path ${line} d="M13 31 h8 M13 37 h14"/>
    <path fill="${blue}" stroke="${navy}" stroke-width="2" d="M40 22 a6 6 0 0 1 11 -3 a5 5 0 0 1 6 6 a4 4 0 0 1 -1 8 H41 a4 4 0 0 1 -1 -11 Z"/>
    <path ${line} stroke-dasharray="3 3" d="M36 34 h8"/>`,
  // A code window with a magnifier: read the provider where it runs.
  'code-magnifier': `<rect x="10" y="12" width="40" height="32" rx="2" fill="#fff" stroke="${navy}" stroke-width="2"/>
    <path ${line} d="M10 20 h40"/>
    <path ${line} d="M16 27 h6 M26 27 h14 M16 33 h12 M32 33 h8 M16 39 h8"/>
    <circle cx="42" cy="42" r="8" fill="#fff" stroke="${navy}" stroke-width="2"/>
    <path fill="${green}" d="M38 40 h8 v4 h-8 Z"/>
    <path ${line} d="M48 48 l7 7"/>`,
};

export const badgeNames = Object.keys(drawings);

// Small inline glyphs for the Try it band, in the same linework as the badges.
// Each names a place the activity can touch, a kind of prerequisite, or what
// one step does; the text beside a glyph carries the claim, so each glyph is
// aria-hidden where it is placed.
const glyphLine = `fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"`;
const glyphs = {
  // Places
  workstation: `<rect x="3" y="5" width="18" height="12" rx="1.5" ${glyphLine}/><path ${glyphLine} d="M8 20 h8"/>`,
  github: `<circle cx="7" cy="6" r="2" ${glyphLine}/><circle cx="17" cy="6" r="2" ${glyphLine}/><circle cx="12" cy="18" r="2" ${glyphLine}/><path ${glyphLine} d="M7 8 v2 a3 3 0 0 0 3 3 h4 a3 3 0 0 0 3 -3 V8 M12 13 v3"/>`,
  azure: `<path ${glyphLine} d="M7 18 a4 4 0 0 1 -0.5 -8 a5.5 5.5 0 0 1 10.5 -1.5 a3.5 3.5 0 0 1 0.5 7 Z"/>`,
  // Prerequisite kinds
  tool: `<rect x="3" y="4" width="18" height="16" rx="1.5" ${glyphLine}/><path ${glyphLine} d="M7 9 l3 3 l-3 3 M12 15 h5"/>`,
  lesson: `<path ${glyphLine} d="M4 5 h6 a2 2 0 0 1 2 2 v12 a2 2 0 0 0 -2 -2 H4 Z M20 5 h-6 a2 2 0 0 0 -2 2 v12 a2 2 0 0 1 2 -2 h6 Z"/>`,
  access: `<circle cx="8" cy="12" r="4" ${glyphLine}/><path ${glyphLine} d="M12 12 h9 M18 12 v3 M15 12 v2"/>`,
  browser: `<rect x="3" y="4" width="18" height="16" rx="1.5" ${glyphLine}/><path ${glyphLine} d="M3 9 h18 M6.5 6.5 h0.01 M9.5 6.5 h0.01"/>`,
  // What a step does
  reads: `<path ${glyphLine} d="M2.5 12 C 5 7.5, 8.5 5.5, 12 5.5 S 19 7.5, 21.5 12 C 19 16.5, 15.5 18.5, 12 18.5 S 5 16.5, 2.5 12 Z"/><circle cx="12" cy="12" r="3" ${glyphLine}/>`,
  local: `<rect x="3" y="5" width="18" height="12" rx="1.5" ${glyphLine}/><path ${glyphLine} d="M8 20 h8 M12 8 v6 M9.5 11.5 l2.5 2.5 l2.5 -2.5"/>`,
  creates: `<circle cx="12" cy="12" r="8.5" ${glyphLine}/><path ${glyphLine} d="M12 8 v8 M8 12 h8"/>`,
  removes: `<path ${glyphLine} d="M5 7 h14 M9 7 V5 h6 v2 M7 7 l1 13 h8 l1 -13 M10 11 v6 M14 11 v6"/>`,
};

export const glyphNames = Object.keys(glyphs);

export function glyph(name, className = 'glyph') {
  const drawing = glyphs[name];
  if (!drawing) throw new Error(`Unknown glyph: ${name}`);
  return `<svg class="${className}" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">${drawing}</svg>`;
}

export function badge(name, className = 'badge') {
  const drawing = drawings[name];
  if (!drawing) throw new Error(`Unknown badge: ${name}`);
  return `<svg class="${className}" viewBox="0 0 64 64" width="56" height="56" aria-hidden="true" focusable="false">${drawing}</svg>`;
}
