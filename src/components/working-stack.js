// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { node } from './node.js';

const arrow = (text) => `<div class="work-arrow">${text}</div>`;

function zone(scope, title, body, kind = '') {
  return `<section class="work-zone${kind ? ` ${kind}` : ''}" data-scope="${scope}"><h3>${title}</h3>${body}</section>`;
}

const forkLegend =
  '<div class="ownership-legend"><span><i class="fork-swatch"></i>Fork-owned source</span></div>';

// Lesson 08: where a canonical image comes from, what records it, and its clock.
export function whoseImageDiagram() {
  return `<div class="work-map">
    ${zone(
      'img-source',
      'Where the image comes from',
      `<h4>GitHub · Azure/osdu-spi-&lt;service&gt;</h4>
      ${node('img-fork', 'Fork main · partition', 'Azure/osdu-spi-partition · each merge builds an image', 'fork-code')}
      ${arrow('↓ sha-&lt;12&gt; tag and main-snapshot on one digest')}
      <h4>GHCR · ghcr.io/azure/osdu-spi-&lt;service&gt;</h4>
      ${node('img-ghcr', 'osdu-spi-partition package', 'main-snapshot names main’s last published build')}
      ${node('img-retention', 'Weekly retention', 'sha-* over 30 days, once main has built past it', 'artifact')}
      <p>The community registry is not a source: its images don’t carry the Azure provider.</p>`,
      'work-outside',
    )}
    ${zone(
      'img-workstation',
      'Your workstation',
      `${node('img-resolve', 'spi up', 'Resolves each canonical once, when there is no lock')}
      ${node('img-info', 'spi info', 'Reads the lock · Built warns after 21 days')}
      ${node('img-refresh', 'spi service refresh', 'Moves a canonical to main’s current build')}
      <p>Only the shared environment refreshes on a schedule, weekdays at 04:00 UTC.</p>`,
      'work-outside',
    )}
    ${zone(
      'img-environment',
      'Your environment · AKS',
      `<h4>osdu-flux namespace</h4>
      ${node('img-lock', 'osdu-image-lock', 'Repository · sha tag · digest · build date')}
      ${arrow('↓ Flux renders repository@digest')}
      <h4>osdu namespace</h4>
      ${node('img-pods', 'partition pods', 'Run the digest, not the tag')}`,
    )}
  </div>${forkLegend}`;
}

// Lesson 09: who the stack thinks a person is, and who decides.
export function whoIsAskingDiagram() {
  return `<div class="work-map">
    ${zone(
      'ask-workstation',
      'Your workstation · outside AKS',
      `${node('ask-me-token', 'spi token --me', 'Your own az token · v1, management audience')}
      ${node('ask-deploy-token', 'spi token', 'Mints the deploy identity · users.datalake.ops')}
      ${node('ask-users-add', 'spi users add --me', 'Stores the id the mesh writes · verifies with your token')}`,
      'work-outside',
    )}
    ${zone(
      'ask-sidecar',
      'AKS · osdu namespace · the mesh',
      `${node('ask-mesh', 'Identity filter', 'Accepts the v1 issuer · writes x-user-id from unique_name')}
      ${arrow('↓ x-user-id: &lt;you&gt;')}
      <p>Authentication only. The services decide what you may do.</p>`,
    )}
    ${zone(
      'ask-services',
      'AKS · osdu namespace · OSDU services',
      `${node('ask-entitlements', 'Entitlements', 'Seeded with three identities and no person · 401 until you are a member')}
      ${node('ask-groups', 'Your groups', 'users plus the role’s groups')}
      ${node('ask-roles', 'Four role presets', 'viewer · editor · admin · ops', 'artifact')}
      ${arrow('↓ impersonation lets the OSDU identity act for you')}
      ${node('ask-workflow', 'Workflow', 'Runs ingestion as you only with impersonation')}`,
    )}
  </div>`;
}

// Lesson 10: two verdicts, then a load that changes neither.
export function readyNotLoadedDiagram() {
  return `<div class="work-map">
    ${zone(
      'load-workstation',
      'Your workstation',
      `${node('load-status', 'spi status', 'Ready and Deployable · exit 0 only when Deployable')}
      ${node('load-maintenance', 'spi maintenance clear', 'Clears the flag in spi-deploy-record · your decision')}
      ${node('load-cli', 'spi load', 'Refuses until Deployable · then creates the Job')}
      ${node('load-loads', 'spi load --status', 'absent · running · complete · stale · failed')}`,
      'work-outside',
    )}
    ${zone(
      'load-flux',
      'AKS · osdu-flux namespace · Flux layers',
      `${node('load-gating', 'Gating layers', 'Ready when every one has converged · includes spi-osdu-schema-load')}
      ${node('load-nongating', 'Non-gating layers', 'spi-osdu-legal · spi-osdu-members · spi-osdu-dag-registration', 'artifact')}
      <p>The Kustomization count includes non-gating layers; read the ready boolean, not the count.</p>`,
    )}
    ${zone(
      'load-osdu',
      'AKS · osdu namespace',
      `${node('load-registry', 'spi-load-registry', 'schemas · reference-data')}
      ${node('load-schema-job', 'schema-load Job', 'Flux · registers schemas · writes no records')}
      ${node('load-job', 'load-reference-data Job', 'data-definitions at a pinned commit · created by spi load')}
      ${arrow('↓ batches of 500 · duplicates skipped')}
      ${node('load-storage', 'OSDU Storage API', 'Accepts the records · the indexer may still be working')}`,
    )}
  </div>`;
}

// Lesson 12: the fork at the deployed commit, the workstation, the environment.
export function proveFromDeskDiagram() {
  return `<div class="work-map">
    ${zone(
      'desk-github',
      'GitHub and GHCR · Azure/osdu-spi-partition',
      `${node('desk-commit', 'The deployed commit', '.spi/service.yaml · resolve.py · suite-verdict.py', 'fork-code')}
      ${node('desk-acceptance', 'partition-acceptance image', 'Same commit as the service · linux/amd64')}`,
      'work-outside',
    )}
    ${zone(
      'desk-workstation',
      'Your workstation',
      `${node('desk-guards', 'Guards', 'Deployable · not borrowed · target read before and after')}
      ${node('desk-run', 'spi test partition', 'docker run by digest · linux/amd64')}
      ${node('desk-verdict', 'Verdict and page', 'The commit’s suite-verdict.py · a page with --report')}
      ${node('desk-report', '--report and --review', 'Hollow: empty tests and tests graded 0')}
      ${node('desk-checkout', 'Your checkout', 'spi service pin --source · spi test --source', 'fork-code')}`,
      'work-outside',
    )}
    ${zone(
      'desk-environment',
      'Your environment · Azure and AKS',
      `${node('desk-lock', 'osdu-image-lock', 'sha tag · service digest · acceptance digest')}
      ${node('desk-registry', 'Environment registry', '&lt;registry&gt;/local/&lt;service&gt; · pinned as origin local')}
      ${arrow('↓ Flux renders the locked digest')}
      ${node('desk-pods', 'partition pods', 'Canonical or pinned, they run the lock')}`,
    )}
  </div>${forkLegend}`;
}
