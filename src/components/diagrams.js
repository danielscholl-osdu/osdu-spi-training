import { node } from './node.js';
import { architectureOverview, creationWalkthrough } from './architecture.js';
import { forkMoments } from '../content/fork-moments.js';
import { routeHref } from '../router.js';

function spiBoundaryDiagram() {
  return `<div class="zoom-crumb" aria-label="Zoomed in from the map"><a href="#running-stack">The stack</a><span>›</span><a href="#running-stack/developer?detail=aks">AKS</a><span>›</span><a href="#running-stack/developer?detail=service">osdu namespace</a><span>›</span><b>one service · partition</b></div>
  <div class="spi-flow">
    <div class="spi-lane spi-shared">
      <div class="spi-lane-head"><h3>Shared OSDU code</h3><p>Received through upstream sync</p></div>
      ${node('client', 'OSDU API', 'The contract your client already uses')}
      <div class="spi-step" aria-hidden="true">↓ the request reaches the service</div>
      ${node('core', 'Common service logic', 'Validation, entitlements checks, business rules', 'shared-code')}
      <div class="spi-step" aria-hidden="true">↓ calls the interface, never Azure directly</div>
    </div>
    ${node('contract', 'The Service Provider Interface', 'Common code calls it; the Azure provider implements it. This is the seam.', 'spi-seam', 'The contract between the two')}
    <div class="spi-lane spi-fork">
      <div class="spi-lane-head"><h3>Fork-owned Azure code</h3><p>Maintained in the service repository</p></div>
      <div class="spi-step" aria-hidden="true">↓ implements the interface</div>
      ${node('azureimpl', 'Azure implementation', 'provider/partition-azure', 'fork-code')}
      <div class="spi-step" aria-hidden="true">↓ resolves the partition’s backends</div>
      ${node('azureclients', 'Azure clients', 'Cache, then Table Storage · identity-based, no stored keys')}
      <div class="spi-step" aria-hidden="true">↓ Workload Identity token</div>
      <a class="spi-terminal" href="#running-stack/developer?detail=shared-data"><small>Back on the map · shared by the environment</small><b>Stored configuration for opendes · common Storage tables</b><span>The answer names the partition’s Cosmos, Storage, and Service Bus. See them in 01 →</span></a>
    </div>
  </div>
  <div class="ownership-legend"><span><i class="shared-swatch"></i>Shared OSDU source</span><span><i class="fork-swatch"></i>Fork-owned Azure source</span><span>Both ship in one image; the seam is a Java interface, not a network hop.</span></div>
  <div class="source-boundary-note"><b>Why the ownership matters</b><p>Upstream plans to remove its Azure implementations. The fork keeps provider and Azure test source outside fork_upstream, so a later upstream deletion cannot remove the fork’s implementation. How that code travels is the next view.</p></div>`;
}

// View 04: the repository read by owner. Rows are paths, columns are branches.
const treeColumns = [
  ['upstream', 'Upstream tip', 'community.opengroup.org'],
  ['fork-upstream', 'fork_upstream', 'generated at 00:00 UTC'],
  ['main-branch', 'main', 'the fork, protected'],
];
const treeRows = [
  {
    group: 'Shared, from upstream',
    rows: [
      [
        'core-tree',
        'partition-core/ · acceptance-test/ · test-core/',
        'kept',
        ['●', '●', '●'],
      ],
      ['pom', 'pom.xml', 'kept, azure profile injected', ['●', '● +', '● +']],
    ],
  },
  {
    group: 'Fork-owned Azure',
    kind: 'fork',
    rows: [
      [
        'provider-azure',
        'provider/partition-azure/',
        'the provider from 03',
        ['⚠ will be deleted', '—', '◆'],
      ],
      [
        'test-azure',
        'testing/partition-test-azure/',
        'its integration tests',
        ['●', '—', '◆'],
      ],
    ],
  },
  {
    group: 'Never here',
    kind: 'stripped',
    rows: [
      [
        'stripped',
        'provider/*-aws · -gc · -ibm · core-plus · .gitlab-ci.yml',
        'stripped',
        ['●', '—', '—'],
      ],
    ],
  },
  {
    group: 'From the template',
    kind: 'fork',
    rows: [
      [
        'engineering-files',
        '.github/ · build/Dockerfile · .spi/service.yaml',
        'delivered by osdu-spi',
        ['—', '—', '◆'],
      ],
    ],
  },
];
const cellNames = {
  '●': 'present',
  '—': 'absent',
  '◆': 'fork-owned',
  '● +': 'present, injected',
  '⚠ will be deleted': 'present, scheduled for removal',
};

function forkShapeDiagram() {
  return `<div class="zoom-crumb" aria-label="Zoomed out from the service"><a href="#spi-boundary">One service</a><span>›</span><b>where its code comes from</b><span>›</span><a href="#handshake">a stack that runs it</a></div>
  <div class="tree-map" role="table" aria-label="Paths in the partition fork, by branch">
    <div class="tree-head" role="row"><span class="tree-corner" role="columnheader">Path in osdu-spi-partition</span>${treeColumns.map(([id, title, sub]) => `<div role="columnheader">${node(id, title, sub, id === 'main-branch' ? 'fork-code' : '')}</div>`).join('')}</div>
    ${treeRows
      .map(
        (group) =>
          `<div class="tree-group tree-${group.kind || 'shared'}"><span class="group-label">${group.group}</span>${group.rows
            .map(
              ([id, path, sub, cells]) =>
                `<div class="tree-row" role="row"><div role="rowheader">${node(id, path, sub, group.kind === 'fork' ? 'fork-code' : '')}</div>${cells
                  .map(
                    (cell) =>
                      `<span class="tree-cell cell-${cell === '◆' ? 'fork' : cell === '—' ? 'absent' : cell.startsWith('⚠') ? 'doomed' : 'kept'}" role="cell" aria-label="${cellNames[cell]}">${cell}</span>`,
                  )
                  .join('')}</div>`,
            )
            .join('')}</div>`,
      )
      .join('')}
    <div class="tree-legend"><span><i class="cell-kept">●</i> present, from upstream</span><span><i class="cell-fork">◆</i> fork-owned</span><span><i class="cell-absent">—</i> absent by construction</span><span><i class="cell-kept">+</i> profile injected by the filter</span></div>
  </div>
  <section class="tree-around" aria-label="Around the repository"><span class="group-label">Around the repository</span><div class="tree-around-nodes">${node('filter', 'The filter', 'upstream-filter.yml · keep, strip, fork, inject')}${node('engineering', 'osdu-spi, the template', 'Workflows arrive as PRs, 08:00 UTC')}${node('mirror', 'A customer mirror fork', 'Second tier · copies main verbatim')}${node('image', 'The image, by digest', 'ghcr.io/azure/osdu-spi-partition')}</div></section>`;
}

// View 05: the same branches, followed through one day.
const lanes = [
  ['upstream', 'Upstream', 'community GitLab'],
  ['fork-upstream', 'fork_upstream', 'generated'],
  ['fork-integration', 'fork_integration', 'workspace'],
  ['main-branch', 'main', 'protected'],
  ['image', 'GHCR', 'sha-* and version tags'],
  ['engineering', 'osdu-spi', 'the template'],
];
// What happens to each lane at each moment, drawn as one line in the lane.
const momentFlows = {
  sync: {
    upstream: 'read with git plumbing, never checked out',
    'fork-upstream': 'filtered tree written as one commit with two parents',
  },
  cascade: {
    'fork-upstream': 'merged second ↓',
    'fork-integration': 'reset to main, then receives fork_upstream',
    'main-branch': 'merged first ↑',
  },
  review: {
    'fork-integration': 'the combined tree, built and tested',
    'main-branch': 'waits for a person to merge the release PR',
  },
  release: {
    'main-branch': 'tagged by Release Please',
    image: 'version tag added to the sha-* image already here',
  },
  template: {
    engineering: 'compared with .github/.template-sync-commit',
    'main-branch': 'receives the template PR, then the Monday settings pass',
  },
};
const momentArtifacts = {
  sync: {
    'fork-upstream': [
      ['sync-pr', 'Sync PR + tracking issue', 'upstream-sync · human-required'],
      ['meta-commit', 'Meta commit', 'fix: · feat: · breaking'],
    ],
  },
  cascade: {
    'fork-integration': [
      [
        'cascade-run',
        'Cascade Integration',
        'main, then fork_upstream · -P core,azure',
      ],
    ],
  },
  review: {
    'fork-integration': [
      ['labels', 'The labels', 'cascade-active → validated, or blocked'],
    ],
    'main-branch': [
      ['release-pr', 'release/upstream-* PR', 'validated · a person merges'],
    ],
  },
  release: {
    'main-branch': [
      ['release-tag', 'Release tag', 'v1.4.0 · v1.4.0-upstream-0.29.0'],
    ],
  },
  template: {
    'main-branch': [
      ['template-pr', 'Template-sync PR', 'chore(template-sync): …'],
      ['settings-apply', 'Settings Apply', 'Mondays 04:00 UTC'],
    ],
  },
};

function forkDayDiagram(route) {
  const index = Math.max(
    0,
    forkMoments.findIndex((moment) => moment.id === route.step),
  );
  const moment = forkMoments[index];
  const artifacts = momentArtifacts[moment.id] || {};
  const flows = momentFlows[moment.id] || {};
  return `<div class="creation-intro"><span>Follow one day</span>Each moment is one workflow in the fork. The lanes that move are lit; the artifacts it leaves are drawn in the lane. Times are scheduled triggers, not measurements.</div>
    <nav class="creation-steps steps-5" aria-label="Moments in the day">${forkMoments.map((item, i) => `<a href="${routeHref('fork-day', item.id)}" data-route-key="${item.id}" ${i === index ? 'aria-current="step"' : ''}><span>${String(i + 1).padStart(2, '0')}</span><b>${item.name}</b></a>`).join('')}</nav>
    <div class="creation-story"><div><span class="group-label">${moment.owner}</span><h3>${moment.title}</h3><p>${moment.copy}</p></div><div class="timing"><b>${moment.time}</b><small>${moment.timeKind}</small></div></div>
    <div class="branch-map" data-moment="${moment.id}">
      <div class="boundary-crossing"><span>${moment.action}</span><span aria-hidden="true">↓</span></div>
      ${lanes
        .map(
          ([id, title, sub]) =>
            `<div class="branch-lane ${moment.active.includes(id) ? 'is-active' : 'is-idle'} ${id === 'main-branch' || id === 'fork-integration' ? 'lane-fork' : ''}">${node(id, title, sub, id === 'main-branch' ? 'fork-code' : '')}<div class="lane-artifacts">${flows[id] ? `<span class="lane-flow">${flows[id]}</span>` : ''}${(artifacts[id] || []).map(([aid, atitle, asub]) => node(aid, atitle, asub, 'artifact')).join('')}</div></div>`,
        )
        .join('')}
    </div>
    <div class="creation-controls">${index ? `<a href="${routeHref('fork-day', forkMoments[index - 1].id)}" data-route-key="previous">← Previous</a>` : '<span></span>'}<span>${index + 1} / ${forkMoments.length}</span><a href="${routeHref('fork-day', forkMoments[(index + 1) % forkMoments.length].id)}" data-route-key="next">${index === forkMoments.length - 1 ? 'Back to midnight ↺' : 'Continue →'}</a></div>`;
}

// View 06: the seam. The fork's run on the left, dev1 on the right, the lock between.
function seamDiagram() {
  return `<div class="zoom-crumb" aria-label="Where this sits"><a href="#fork-day/release">A tagged digest</a><span>›</span><b>the handshake</b><span>›</span><a href="#running-stack">a running stack</a></div>
  <div class="seam-map">
    <section class="seam-inputs"><span class="group-label"><span class="lane-number">A</span>What the fork brings</span><div class="seam-pair">${node('image', 'The digest', 'ghcr.io/azure/osdu-spi-partition@sha256:…')}${node('descriptor', '.spi/service.yaml', 'Which suites, and what each needs', 'fork-code')}</div></section>
    <section class="seam-run"><span class="group-label"><span class="lane-number">B</span>The run, in order · validate.yml</span>
      ${node('gate', 'Deploy Gate', 'No credentials · may this run borrow?')}
      <div class="spi-step" aria-hidden="true">↓ then, as the deploy identity</div>
      ${node('facts', 'Read the facts', 'spi status --json · spi info --json')}
      <div class="spi-step" aria-hidden="true">↓ deployable: pin the digest into the lock (C)</div>
      ${node('verify', 'Verify', 'Pod imageID = pinned digest · 15 min')}
      <div class="spi-step" aria-hidden="true">↓ running the candidate</div>
      ${node('proof', 'Prove', 'Each declared suite, from its image')}
      <div class="spi-step" aria-hidden="true">↓ always, even after failure</div>
      ${node('restore', 'Restore', 'spi service reset --if-run')}
    </section>
    <section class="seam-stack"><span class="group-label"><span class="lane-number">C</span>In dev1</span>
      ${node('trust', 'The deploy identity', 'Federated to this repository · two Roles')}
      ${node('delivery', 'osdu-image-lock', 'The pin: ephemeral, run-owned, compare-and-set', 'spi-seam', 'The seam')}
      ${node('running', 'The partition pod', 'Flux reconciles the lock; the pod restarts', 'shared-code')}
    </section>
  </div>
  <div class="ownership-legend"><span><i class="fork-swatch"></i>Fork-owned</span><span><i class="shared-swatch"></i>Built by the stack</span><span>Five repository settings connect them. Everything else is read per run.</span></div>`;
}

export const diagramRenderers = {
  overview: architectureOverview,
  creation: creationWalkthrough,
  spi: spiBoundaryDiagram,
  fork: forkShapeDiagram,
  forkDay: forkDayDiagram,
  seam: seamDiagram,
};
