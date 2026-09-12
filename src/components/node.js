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
  return `<button class="node ${kind}" type="button" data-detail="${id}" aria-pressed="false" aria-controls="inspector">${label ? `<span class="node-label">${label}</span>` : ''}<b>${title}</b>${subtitle ? `<small>${subtitle}</small>` : ''}<span class="node-open" aria-hidden="true">↗</span></button>`;
}
