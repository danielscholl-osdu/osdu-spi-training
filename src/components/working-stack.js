// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { node } from './node.js';

export const arrow = (text) => `<div class="work-arrow">${text}</div>`;

export function zone(scope, title, body, kind = '') {
  return `<section class="work-zone${kind ? ` ${kind}` : ''}" data-scope="${scope}"><h3>${title}</h3>${body}</section>`;
}

export const forkLegend =
  '<div class="ownership-legend"><span><i class="fork-swatch"></i>Fork-owned source</span></div>';

// S204's page: where a canonical image comes from, what records it, and its clock.
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
      ${node('img-retention', 'Retention', 'Can delete an old sha-* once main has built past it', 'artifact')}`,
      'work-outside',
    )}
    ${zone(
      'img-workstation',
      'Your workstation',
      `${node('img-resolve', 'spi up', 'Resolves each canonical once, when there is no lock')}
      ${node('img-info', 'spi info', 'Reads the lock · Built marks an old canonical')}
      ${node('img-refresh', 'spi service refresh', 'Moves a canonical to main’s current build')}
      <p>Only the shared environment refreshes on a schedule.</p>`,
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

// S202's page: who the stack thinks a person is, and who decides.
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
      `${node('ask-entitlements', 'Entitlements', '401 until you are a member')}
      ${node('ask-groups', 'Your groups', 'users plus the role’s groups')}
      ${node('ask-roles', 'Four role presets', 'viewer · editor · admin · ops', 'artifact')}
      ${arrow('↓ editor and above: ingestion can run as you')}
      ${node('ask-workflow', 'Workflow', 'Runs ingestion as you only with impersonation')}`,
    )}
  </div>`;
}

// S203's page: schemas at bring-up, records only through a load, and a run as you.
export function readyNotLoadedDiagram() {
  return `<div class="work-map">
    ${zone(
      'load-workstation',
      'Your workstation',
      `${node('load-status', 'spi status', 'Ready and Deployable · exit 0 only when Deployable')}
      ${node('load-cli', 'spi load', 'Refuses until Deployable · then creates the Job')}
      ${node('load-loads', 'spi load --status', 'absent · running · complete · stale · failed')}
      ${node('load-dags', 'spi test dags --as me', 'Runs Echo and an ingest with your token · reads the record back')}`,
      'work-outside',
    )}
    ${zone(
      'load-flux',
      'AKS · osdu-flux namespace · Flux layers',
      `${node('load-gating', 'Gating layers', 'Ready when every one has converged · includes spi-osdu-schema-load')}
      ${node('load-nongating', 'Non-gating layers', 'spi-osdu-legal · spi-osdu-members · spi-osdu-dag-registration', 'artifact')}
      <p>Deployable does not wait for the DAGs to register.</p>`,
    )}
    ${zone(
      'load-osdu',
      'AKS · OSDU services and Airflow',
      `<h4>osdu namespace</h4>
      ${node('load-registry', 'spi-load-registry', 'schemas · reference-data')}
      ${node('load-schema-job', 'schema-load Job', 'Flux · registers schemas · writes no records')}
      ${node('load-job', 'load-reference-data Job', 'data-definitions at a pinned commit · created by spi load')}
      ${arrow('↓ the load Job writes the records')}
      ${node('load-storage', 'OSDU Storage API', 'Accepts the records · the indexer may still be working')}
      ${node('load-workflow', 'Workflow API', 'Starts each run as the caller whose token started it')}
      <h4>platform namespace</h4>
      ${node('load-airflow', 'Airflow scheduler', 'Runs each task · the ingest task writes as the caller')}`,
    )}
  </div>`;
}

// S205's page: the suite a deployed commit shipped, and a checkout pinned in.
export function proveFromDeskDiagram() {
  return `<div class="work-map">
    ${zone(
      'desk-github',
      'GitHub and GHCR · Azure/osdu-spi-partition',
      `${node('desk-commit', 'The deployed commit', 'Builds the service image and its acceptance image', 'fork-code')}
      ${node('desk-acceptance', 'partition-acceptance image', 'Same commit as the service · pulled by digest')}`,
      'work-outside',
    )}
    ${zone(
      'desk-workstation',
      'Your workstation',
      `${node('desk-guards', 'Deployable first', 'spi test refuses until the environment is Deployable')}
      ${node('desk-run', 'spi test partition', 'Pulls the paired image by digest · runs its suite')}
      ${node('desk-verdict', 'The verdict', 'pass or fail · names the image it ran')}
      ${node('desk-checkout', 'Your checkout', 'spi service pin --source builds it', 'fork-code')}
      ${node('desk-source-test', 'spi test --source', 'Your checkout’s suite · matched or unmatched')}
      ${node('desk-reset', 'spi service reset', 'Puts the canonical image back')}`,
      'work-outside',
    )}
    ${zone(
      'desk-environment',
      'Your environment · Azure and AKS',
      `${node('desk-registry', 'Environment registry', '&lt;registry&gt;/local/&lt;service&gt; · built with az acr run')}
      ${node('desk-lock', 'osdu-image-lock', 'sha tag · service digest · acceptance digest')}
      ${arrow('↓ Flux renders the locked digest')}
      ${node('desk-pods', 'partition pods', 'Run the lock: canonical, or your pin')}`,
    )}
  </div>${forkLegend}`;
}

// S201's page: the commands on your desk, the group they build, and the wait.
export function yourEnvironmentDiagram() {
  return `<div class="work-map">
    ${zone(
      'env-workstation',
      'Your workstation',
      `${node('env-check', 'spi check', 'The tools spi drives · what your sign-in may create')}
      ${node('env-up', 'spi up --env &lt;name&gt;', 'Builds your environment · returns while Flux works')}
      ${node('env-status', 'spi status --watch', 'Refreshes every 30 seconds · reads the summary')}
      ${node('env-deployable', 'Deployable', 'The verdict to wait for', 'artifact')}
      ${node('env-info', 'spi info', 'Base URL and endpoints')}
      ${node('env-down', 'spi down --env &lt;name&gt;', 'Gives the environment back')}`,
      'work-outside',
    )}
    ${zone(
      'env-azure',
      'Your subscription · one resource group',
      `${node('env-group', 'spi-stack-&lt;name&gt;', 'One resource group per environment')}
      ${node('env-cluster', 'AKS and the data services', 'Side by side in the group · deleted by spi down')}
      ${node('env-identities', 'Managed identities', 'Kept by spi down · reused by the next spi up', 'artifact')}`,
    )}
    ${zone(
      'env-running',
      'Inside the cluster · after spi up returns',
      `${node('env-flux', 'Flux', 'Keeps reconciling after the command returns')}
      ${arrow('↓ Not deployable until the rollout is done')}
      ${node('env-gateway', 'The gateway', 'Where the OSDU APIs answer · Kibana and Airflow beside it')}`,
    )}
  </div>`;
}
