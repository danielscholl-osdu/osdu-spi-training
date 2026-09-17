// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { detectTryItShell, applyTryItShell } from '../src/try-it-shell.js';
import { tryItBand } from '../src/components/pages.js';
import { chapters } from '../src/content/chapters.js';
import { singleVariantTryIt } from './fixtures/try-it.js';

test('OS hints select a default with a user-agent fallback', () => {
  assert.equal(
    detectTryItShell({ userAgentData: { platform: 'Windows' } }),
    'powershell',
  );
  for (const userAgent of [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0',
  ])
    assert.equal(detectTryItShell({ userAgent }), 'powershell');
  for (const platform of ['macOS', 'Linux', 'Android', 'iOS', 'Unknown'])
    assert.equal(detectTryItShell({ userAgentData: { platform } }), 'posix');
  for (const userAgent of [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    'Mozilla/5.0 (X11; Linux x86_64)',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)',
    'Mozilla/5.0 (Linux; Android 15)',
    '',
  ])
    assert.equal(detectTryItShell({ userAgent }), 'posix');
  assert.equal(detectTryItShell(), 'posix');
  assert.equal(
    detectTryItShell({
      userAgentData: { platform: 'Linux' },
      userAgent: 'Windows NT 10.0',
    }),
    'posix',
    'the structured hint takes precedence',
  );
});

test('command alternatives are escaped and only the selected shell is exposed', () => {
  const chapter = structuredClone(chapters['running-stack']);
  chapter.tryIt.variants[0].steps[0].command.powershell =
    'Write-Output "<name>&"';
  const windows = tryItBand(chapter, 'powershell');
  assert.match(windows, /<fieldset[^>]*aria-describedby="try-it-shell-hint"/);
  assert.match(windows, /<legend>Commands for<\/legend>/);
  assert.match(windows, /value="powershell" data-try-it-shell checked/);
  assert.match(windows, /value="posix" data-try-it-shell>/);
  assert.match(windows, /data-try-it-content="posix" hidden>/);
  assert.match(
    windows,
    /data-try-it-content="powershell"><code>Write-Output &quot;&lt;name&gt;&amp;&quot;/,
  );
  assert.doesNotMatch(windows, /<name>|<details open/);
  assert.match(windows, /<code>spi check<\/code>/);
  assert.match(windows, /<code>uv tool uninstall spi<\/code>/);

  const posix = tryItBand(chapter, 'posix');
  assert.match(posix, /value="posix" data-try-it-shell checked/);
  assert.match(posix, /data-try-it-content="powershell" hidden>/);
  assert.match(posix, /data-try-it-content="posix"><code>/);
  assert.equal(tryItBand(chapter, 'unknown'), posix);
  assert.doesNotMatch(
    tryItBand({ tryIt: singleVariantTryIt }, 'powershell'),
    /data-try-it-shell|Commands for/,
    'browser-only activities have no shell picker',
  );
});

test('manual overrides update commands without replacing the disclosure or controls', () => {
  const inputs = [
    { value: 'powershell', checked: true },
    { value: 'posix', checked: false },
  ];
  const content = [
    { dataset: { tryItContent: 'powershell' }, hidden: false },
    { dataset: { tryItContent: 'posix' }, hidden: true },
  ];
  const band = {
    querySelectorAll(selector) {
      if (selector === '[data-try-it-shell]') return inputs;
      if (selector === '[data-try-it-content]') return content;
      throw new Error(`Unexpected selector: ${selector}`);
    },
  };
  applyTryItShell(band, 'posix');
  assert.deepEqual(
    inputs.map((input) => input.checked),
    [false, true],
  );
  assert.deepEqual(
    content.map((element) => element.hidden),
    [true, false],
  );
  applyTryItShell(band, 'posix');
  assert.deepEqual(
    content.map((element) => element.hidden),
    [true, false],
  );
  applyTryItShell(band, 'invalid');
  assert.deepEqual(
    content.map((element) => element.hidden),
    [true, false],
  );
  applyTryItShell(band, 'powershell');
  assert.deepEqual(
    inputs.map((input) => input.checked),
    [true, false],
  );
  assert.deepEqual(
    content.map((element) => element.hidden),
    [false, true],
  );
});

test('both steps and cleanup support alternatives alongside shared commands', () => {
  const chapter = { tryIt: structuredClone(singleVariantTryIt) };
  const variant = chapter.tryIt.variants[0];
  variant.cleanup.steps = [
    {
      command: { powershell: 'Write-Output done', posix: 'printf done' },
      touch: { kind: 'reads', note: 'prints done' },
      expect: 'The terminal prints done.',
    },
  ];
  const markup = tryItBand(chapter, 'powershell');
  assert.match(markup, /Commands for/);
  assert.match(
    markup,
    /data-try-it-content="powershell"><code>Write-Output done/,
  );
  assert.match(markup, /data-try-it-content="posix" hidden><code>printf done/);
});

for (const executable of ['powershell.exe', 'pwsh.exe']) {
  test(
    `Windows examples parse and pass argument fixtures in ${executable}`,
    {
      skip:
        process.platform !== 'win32' &&
        'Requires Windows; no Azure resources are used',
    },
    (context) => {
      const commands = Object.values(chapters).flatMap((chapter) =>
        (chapter.tryIt?.variants ?? []).flatMap((variant) =>
          [...variant.steps, ...variant.cleanup.steps]
            .filter((step) => step.command)
            .map((step) =>
              typeof step.command === 'string'
                ? step.command
                : step.command.powershell,
            ),
        ),
      );
      const install =
        chapters['running-stack'].tryIt.variants[0].steps[0].command.powershell;
      const request = chapters['bring-up'].tryIt.variants[0].steps.find(
        (step) => step.command?.powershell?.startsWith('curl.exe'),
      ).command.powershell;
      const result = spawnSync(
        executable,
        [
          '-NoProfile',
          '-NonInteractive',
          '-File',
          fileURLToPath(
            new URL('./helpers/try-it-powershell.ps1', import.meta.url),
          ),
        ],
        {
          input: JSON.stringify({ commands, install, request }).replace(
            /<[^>]+>/g,
            'fixture',
          ),
          encoding: 'utf8',
          timeout: 30000,
        },
      );
      if (result.error?.code === 'ENOENT') {
        context.skip(`${executable} is not installed`);
        return;
      }
      assert.ifError(result.error);
      assert.equal(result.status, 0, result.stderr || result.stdout);
      assert.match(
        result.stdout,
        /installer and bearer-header fixtures passed/,
      );
      context.diagnostic(result.stdout.trim());
    },
  );
}
