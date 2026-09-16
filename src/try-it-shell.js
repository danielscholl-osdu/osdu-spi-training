// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export const tryItShells = {
  powershell: 'Windows · PowerShell',
  posix: 'macOS / Linux / WSL · Bash or zsh',
};

// OS hints choose a starting point, not the terminal the reader must use.
// Unknown and mobile platforms keep the existing POSIX examples as a fallback.
export function detectTryItShell(browser = {}) {
  const platform = browser.userAgentData?.platform;
  if (platform) return platform === 'Windows' ? 'powershell' : 'posix';
  return /Windows NT/i.test(browser.userAgent ?? '') ? 'powershell' : 'posix';
}

// Update only the band content: keep its disclosure, focus, and route intact.
export function applyTryItShell(band, shell) {
  if (!Object.hasOwn(tryItShells, shell)) return;
  band.querySelectorAll('[data-try-it-shell]').forEach((input) => {
    input.checked = input.value === shell;
  });
  band.querySelectorAll('[data-try-it-content]').forEach((element) => {
    element.hidden = element.dataset.tryItContent !== shell;
  });
}
