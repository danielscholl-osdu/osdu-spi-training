# Try it shell selection

The expanded Try it band offers Windows PowerShell and macOS / Linux / WSL (Bash or zsh). Browser OS hints choose the initial shell. A manual choice carries across lessons in memory for the current page visit; reloading detects again. There are no cookies, browser-storage entries, server requests for detection, or URL changes.

The selector uses native radio inputs in a named fieldset. Changing it hides and reveals only authored command alternatives, keeping the disclosure and focused control in place. Shared commands and browser actions remain shared. Browser-only activities do not render the selector. Unknown and mobile platforms use the existing POSIX examples; the reader can always choose either shell.

## Source review — 16 September 2026

- The installer variants follow `Azure/osdu-spi-stack/docs/install.md` at `c15d9bc2cb8db9156bf2d87180c0262b97e9e16b`. PowerShell spells out `Invoke-RestMethod` instead of its `irm` alias. Both examples use the anonymous package index now documented there.
- The installer resolves the latest release, which can differ from the lesson's recorded CLI release, 0.16.0. Its result text points to the pinned-release instructions when reproducing that walkthrough.
- The API request retains the existing lesson's endpoint and `spi token` behavior at `dc2c95638ded6459538085cfdb2ada46b692c27b`. PowerShell explicitly calls `curl.exe`, avoiding Windows PowerShell's `curl` alias, and uses a single line instead of POSIX line continuations.
- Prerequisites name `curl.exe` for Windows. The selector reminds readers to replace angle-bracket placeholders before running commands, including the environment name.

## Development checks

On Windows, `npm test` parses every displayed PowerShell command after substituting fixture values for placeholders. It also exercises the exact authored installer and request text with mocked release metadata and commands. This checks wheel selection, argument boundaries, command substitution, and quoting without installing SPI, signing in, contacting an API, or creating resources.

These checks passed on 16 September 2026 with Windows PowerShell 5.1.26100.9444 and PowerShell 7.6.6. The mock SPI release is deliberately a fixture; this is not a CLI walkthrough record. No template or fork is created. The content tests cover detection, escaped alternatives, initial selection, manual switching, shared commands, cleanup variants, and absence of controls on browser-only activities.

## Publication evidence still needed

The prior `tested` records in chapter content remain the evidence for the existing routes; they do not establish a Windows walkthrough. Before publishing the new Windows route, walk installation and the Azure activity on Windows and record the actual CLI release, stack revision, template applicability, PowerShell version, OS, and date. The existing Azure activity already says it has not been walked end to end (fn-dt3). This feature does not close that gap or authorize a test deployment.

No browser was available through the browser testing connection in this session. Visual verification at desktop and phone widths, native keyboard navigation, focus/scroll preservation while switching, and retaining the manual choice across lesson navigation remain to be checked in a connected browser. The feature PR stays a draft pending that review and the Windows walkthrough.

The `bd` executable and local Dolt database were unavailable in this checkout. Beads tracking could not be updated; follow-up validation is recorded here and in the draft PR rather than claiming an issue was filed.
