// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { iconSvg, nodeIcons } from './icons.js';

export function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        character
      ],
  );
}

export function node(id, title, subtitle = '', kind = '', label = '') {
  const icon = nodeIcons[id]
    ? iconSvg(nodeIcons[id], { className: 'node-icon' })
    : '';
  return `<button class="node ${kind}${icon ? ' has-icon' : ''}" type="button" data-detail="${id}" aria-pressed="false" aria-controls="inspector">${icon}${label ? `<span class="node-label">${label}</span>` : ''}<b>${title}</b>${subtitle ? `<small>${subtitle}</small>` : ''}<span class="node-open" aria-hidden="true">Inspect ↗</span></button>`;
}
