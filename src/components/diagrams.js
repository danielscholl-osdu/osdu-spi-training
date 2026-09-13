import { node } from './node.js';
import { architectureOverview, creationWalkthrough } from './architecture.js';
import { forkMoments, meanwhile } from '../content/fork-moments.js';
import { routeHref } from '../router.js';

function spiBoundaryDiagram() {
  return `<div class="zoom-crumb" aria-label="Zoomed in from the map"><a href="#running-stack">The stack</a><span>›</span><a href="#running-stack/developer?detail=aks">AKS</a><span>›</span><a href="#running-stack/developer?detail=service">osdu namespace</a><span>›</span><b>one service · partition</b></div>
  <div class="spi-flow">
    <div class="spi-runtime">
    ${node('client', 'OSDU API', 'The contract your client already uses')}
    <div class="spi-step" aria-hidden="true">↓ the request reaches the service image</div>
    <section class="spi-image-boundary" data-scope="spi-image">
      ${node('image', 'One partition service image', 'partition-core + provider/partition-azure · one process', 'spi-image-node')}
      <div class="spi-lane spi-shared" data-scope="spi-shared">
        <div class="spi-lane-head"><h3>Shared OSDU code</h3><p>partition-core · upstream-owned</p></div>
        ${node('core', 'partition-core', 'Caller check, validation, then the provider interface', 'shared-code')}
        <div class="spi-step" aria-hidden="true">↓ calls the interface, never Azure directly</div>
        ${node('contract', 'IPartitionService.getPartition', 'The shared Service Provider Interface', 'spi-seam', 'The contract between the two')}
      </div>
      <div class="spi-crossing-label" data-trace-crossing>Inside one image · Java interface call · no network hop</div>
      <div class="spi-lane spi-fork" data-scope="spi-provider">
        <div class="spi-lane-head"><h3>Fork-owned Azure code</h3><p>Maintained in the service repository</p></div>
        <div class="spi-step" aria-hidden="true">↓ implements the interface</div>
        ${node('azureimpl', 'provider/partition-azure', 'The Azure implementation', 'fork-code')}
      </div>
    </section>
    <div class="spi-step" aria-hidden="true">↓ the cache call leaves the image but stays inside AKS</div>
    <div class="spi-lane" data-scope="spi-cache">
    <div class="spi-lane-head"><h3>Redis cache · inside AKS · middleware credentials</h3><small>Outside the service image</small></div>
    ${node('redis', 'Redis in the platform namespace', 'A cache hit returns without reading the table')}
    <div class="spi-trace-status" data-trace-status="redis" hidden></div>
    </div>
    <div class="spi-step" aria-hidden="true">↓ after a miss or handled read exception, the provider calls the table</div>
    <div class="spi-lane spi-azure-resources" data-scope="spi-tables">
    <div class="spi-lane-head"><h3>Common Table Storage · outside AKS · Workload Identity</h3><small>Outside the service image</small></div>
    ${node('azureclients', 'Partition table in common Storage', 'The durable configuration for opendes')}
    <div class="spi-trace-status" data-trace-status="azureclients" hidden></div>
    <div class="spi-step" aria-hidden="true">↓ the row for opendes</div>
    <a class="spi-terminal" href="#running-stack/developer?detail=shared-data"><small>Back on the map · shared by the environment</small><b>Stored configuration for opendes · common Storage tables</b><span>The answer names the partition’s Cosmos, Storage, and Service Bus. See them in 01 →</span></a>
    </div>
    </div>
    <section class="spi-source-boundary" data-scope="spi-sources">
      <header><h3>Source ownership outside the running image</h3><p>The generated upstream tree and the fork-owned provider stay separate.</p></header>
      <div class="spi-source-columns">
        ${node('upstream', 'Upstream source', 'partition-core and IPartitionService enter fork_upstream')}
        ${node('engineering', 'osdu-spi engineering system', 'Preserves provider/&lt;svc&gt;-azure outside the generated tree')}
      </div>
      <p><code>provider/partition-azure</code> remains fork-owned even when upstream removes its Azure provider.</p>
    </section>
  </div>
  <div class="ownership-legend"><span><i class="shared-swatch"></i>Shared OSDU source</span><span><i class="fork-swatch"></i>Fork-owned Azure source</span><span>Both backends sit outside the image; only Table Storage sits outside AKS.</span></div>`;
}

// View 04: the repository read by owner. Rows are paths, columns are branches.
// The first column is the community repository; the other three are the fork.
const treeColumns = [
  ['upstream', 'Upstream tip', 'community.opengroup.org', ''],
  ['fork-upstream', 'fork_upstream', 'generated input', ''],
  [
    'fork-integration',
    'fork_integration',
    'integration workspace',
    'fork-code',
  ],
  ['main-branch', 'main', 'protected result', 'fork-code'],
];
const treeRows = [
  {
    group: 'Shared, from upstream',
    rows: [
      [
        'core-tree',
        'partition-core/ · partition-acceptance-test/ · testing/partition-test-core/',
        'kept as published',
        ['●', '●', '●', '●'],
      ],
      [
        'pom',
        'pom.xml',
        'kept, azure profile injected',
        ['●', '● +', '● +', '● +'],
      ],
    ],
  },
  {
    group: 'Fork-owned Azure',
    kind: 'fork',
    rows: [
      [
        'provider-azure',
        'provider/partition-azure/',
        'the provider from 03, with the cache fallback',
        [['⚠ to be deleted', '— gone'], '—', '◆', '◆'],
      ],
      [
        'test-azure',
        'testing/partition-test-azure/',
        'its integration tests',
        [['●', '— gone'], '—', '◆', '◆'],
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
        ['●', '—', '—', '—'],
      ],
    ],
  },
  {
    group: 'From the template',
    kind: 'fork',
    rows: [
      [
        'engineering-files',
        '.github/ · build/Dockerfile',
        'delivered by osdu-spi as PRs',
        ['—', '—', '◆', '◆'],
      ],
    ],
  },
  {
    group: 'Written in this repository',
    kind: 'fork',
    rows: [
      [
        'descriptor-file',
        '.spi/service.yaml',
        'service-owned · excluded from template sync',
        ['—', '—', '◇', '◇'],
      ],
    ],
  },
];
const cellNames = {
  '●': 'present',
  '—': 'absent',
  '◆': 'fork-owned',
  '◇': 'fork-owned, not yet written',
  '● +': 'present, injected',
  '⚠ to be deleted': 'present, scheduled for removal',
};
const cellClass = (cell) =>
  cell === '◆'
    ? 'fork'
    : cell === '◇'
      ? 'fork-planned'
      : cell === '—'
        ? 'absent'
        : cell.startsWith('⚠')
          ? 'doomed'
          : 'kept';

const cellName = (cell) => cellNames[cell] || cell.replace(/^— /, 'absent, ');

// Every cell names its branch, since the phone layout has no column headings
// beside the cells. A what-if pair carries both readings as data attributes.
function treeCell(cell, column) {
  const [now, after] = Array.isArray(cell) ? cell : [cell, null];
  const pair = after
    ? ` data-now="${now}" data-after="${after}" data-now-label="${column[1]}: ${cellName(now)}" data-after-label="${column[1]}: ${cellName(after)}"`
    : '';
  return `<span class="tree-cell cell-${cellClass(now)} ${after ? 'has-after' : ''}" role="cell" data-branch="${column[1]}"${pair} aria-label="${column[1]}: ${cellName(now)}"><span>${now}</span></span>`;
}

// The two rows the what-if changes, repeated beside the switch so the
// comparison is visible where the reader flips it.
function whatIfStrip() {
  const affected = treeRows
    .flatMap((group) => group.rows)
    .filter(([, , , cells]) => cells.some(Array.isArray));
  return `<div class="what-if-strip" aria-label="Before and after, for the affected rows">${affected
    .map(
      ([, path, , cells]) =>
        `<div class="what-if-row"><code>${path}</code>${cells
          .map((cell, i) => {
            const [now, after] = Array.isArray(cell) ? cell : [cell, null];
            return `<span class="what-if-cell cell-${cellClass(now)}" data-branch="${treeColumns[i][1]}">${after ? `<s>${now}</s> <b class="cell-absent">${after}</b>` : `<b>${now}</b>`}</span>`;
          })
          .join('')}</div>`,
    )
    .join('')}</div>`;
}

function forkShapeDiagram() {
  return `<div class="zoom-crumb" aria-label="Zoomed out from the service"><a href="#spi-boundary">One service</a><span>›</span><b>where its code comes from</b><span>›</span><a href="#handshake">a stack that runs it</a></div>
  <div class="tree-map" role="table" aria-label="Paths in the partition fork, by branch">
    <div class="tree-bands" aria-hidden="true"><span></span><span class="band band-out">Community · read, never checked out</span><span class="band band-fork">The fork · three branches, three jobs</span></div>
    <div class="tree-head" role="row"><span class="tree-corner" role="columnheader">Path in osdu-spi-partition</span>${treeColumns.map(([id, title, sub, kind]) => `<div role="columnheader">${node(id, title, sub, kind)}</div>`).join('')}</div>
    ${treeRows
      .map(
        (group) =>
          `<div class="tree-group tree-${group.kind || 'shared'}"><span class="group-label">${group.group}</span>${group.rows
            .map(
              ([id, path, sub, cells]) =>
                `<div class="tree-row" role="row"><div role="rowheader">${node(id, path, sub, group.kind === 'fork' ? 'fork-code' : '')}</div>${cells
                  .map((cell, i) => treeCell(cell, treeColumns[i]))
                  .join('')}</div>`,
            )
            .join('')}</div>`,
      )
      .join('')}
    <div class="what-if">
      <label><input type="checkbox" class="what-if-switch" /> <b>What if upstream deletes its Azure directory tomorrow?</b><small>Optional. Toggles the upstream column only.</small></label>
      ${whatIfStrip()}
      <p class="what-if-result" aria-live="polite">Upstream’s copy is gone. fork_upstream never had it, so tonight’s generation is identical there, and the cascade merges nothing about it. fork_integration and main keep the fork’s provider, cache fallback included. The deletion has nothing to delete on the fork side.</p>
    </div>
    <div class="tree-legend"><span><i class="cell-kept">●</i> present, from upstream</span><span><i class="cell-fork">◆</i> fork-owned</span><span><i class="cell-fork-planned">◇</i> fork-owned, not yet written</span><span><i class="cell-absent">—</i> absent by construction</span><span><i class="cell-kept">+</i> profile injected by the filter</span></div>
  </div>
  <section class="tree-around" aria-label="Around the repository"><span class="group-label">Around the repository</span><div class="tree-around-nodes">${node('filter', 'The filter', 'upstream-filter.yml · keep, strip, fork, inject')}${node('engineering', 'osdu-spi, the template', 'Workflows and Dockerfile arrive as PRs')}${node('mirror', 'A customer mirror fork', 'Second tier · copies main verbatim')}${node('image', 'The image, by digest', 'ghcr.io/azure/osdu-spi-partition')}</div></section>`;
}

// View 05: the same branches, followed through one change.
// [lane key, node id, title, subtitle]
const lanes = [
  ['upstream', 'upstream', 'Upstream', 'community GitLab'],
  ['fork-upstream', 'fork-upstream', 'fork_upstream', 'generated input'],
  ['fork-integration', 'fork-integration', 'fork_integration', 'workspace'],
  ['main-branch', 'main-branch', 'main', 'protected result'],
  ['image', 'image', 'GHCR', 'sha-* and version tags'],
  ['stack', 'dev1-slot', 'dev1', 'a slot, borrowed'],
];
// What happens in each lane at each moment, drawn as one line in the lane.
// `hold` lines describe an idle lane that still matters to the example.
const momentFlows = {
  sync: {
    upstream:
      'tip read with git plumbing, never checked out · partition-core changed',
    'fork-upstream': 'filtered tree written as one commit with two parents',
    'main-branch': 'holds the cache fallback fix · untouched tonight',
  },
  cascade: {
    'fork-upstream': 'upstream’s partition-core change · merged second ↓',
    'fork-integration': '← main, then ← fork_upstream · mvn -P core,azure',
    'main-branch': 'the cache fallback fix · merged first ↑',
  },
  review: {
    'fork-integration': 'the combined tree, built and tested',
    'main-branch': 'waits for a person to approve the integration PR',
  },
  prove: {
    'main-branch': 'the merge commit · Validation runs again',
    image: 'sha-<commit> pushed → one digest, the candidate',
    stack: 'Deploy Gate → pin · verify · prove · restore',
  },
  release: {
    'main-branch': 'tagged by Release Please, if the version PR is merged',
    image: 'version tag added to the sha-* image already here',
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
        'workflow_dispatch · -P core,azure',
      ],
    ],
  },
  review: {
    'fork-integration': [
      ['labels', 'The labels', 'validated, or blocked / failed'],
      ['conflict', 'If it conflicts', 'cascade-blocked · fix here · run again'],
    ],
    'main-branch': [
      ['integration-pr', 'Integration PR', 'release/upstream-* → main'],
    ],
  },
  prove: {
    image: [
      [
        'candidate',
        'The candidate',
        'ghcr.io/azure/osdu-spi-partition@sha256:…',
      ],
    ],
  },
  release: {
    'main-branch': [
      ['version-pr', 'Version PR', 'release-please--branches--main'],
      ['release-tag', 'Release tag', 'v1.4.0 · v1.4.0-upstream-0.29.0'],
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
  return `<div class="creation-intro"><span>Follow one change</span>Five moments, in order. Lit lanes move; the rest hold still. Times are scheduled triggers, not measurements.</div>
    <nav class="creation-steps steps-5" aria-label="Moments in the day">${forkMoments.map((item, i) => `<a href="${routeHref('fork-day', item.id)}" data-route-key="${item.id}" aria-label="${i + 1}. ${item.name}" ${i === index ? 'aria-current="step"' : ''}><span>${String(i + 1).padStart(2, '0')}</span><b>${item.name}</b></a>`).join('')}</nav>
    <div class="branch-map" data-moment="${moment.id}">
      <div class="boundary-crossing"><span>${moment.action}</span><span aria-hidden="true">↓</span></div>
      ${lanes
        .map(
          ([key, id, title, sub]) =>
            `<div class="branch-lane ${moment.active.includes(key) ? 'is-active' : 'is-idle'} ${key === 'main-branch' || key === 'fork-integration' ? 'lane-fork' : ''} ${key === 'stack' ? 'lane-stack' : ''}">${node(id, title, sub, key === 'main-branch' || key === 'fork-integration' ? 'fork-code' : '')}<div class="lane-artifacts">${flows[key] ? `<span class="lane-flow">${flows[key]}</span>` : ''}${(artifacts[key] || []).map(([aid, atitle, asub]) => node(aid, atitle, asub, 'artifact')).join('')}${key === 'stack' && moment.id === 'prove' ? `<a class="lane-link" href="#handshake">Follow the borrowed slot in 06 →</a>` : ''}</div></div>`,
        )
        .join('')}
    </div>
    <div class="creation-story"><div><span class="group-label">${moment.owner}</span><h3>${moment.title}</h3><p>${moment.copy}</p></div><div class="timing"><b>${moment.time}</b><small>${moment.timeKind}</small></div></div>
    <div class="creation-controls">${index ? `<a href="${routeHref('fork-day', forkMoments[index - 1].id)}" data-route-key="previous">← Previous</a>` : '<span></span>'}<span>${index + 1} / ${forkMoments.length}</span><a href="${routeHref('fork-day', forkMoments[(index + 1) % forkMoments.length].id)}" data-route-key="next">${index === forkMoments.length - 1 ? 'Back to midnight ↺' : 'Continue →'}</a></div>
    <section class="meanwhile" aria-label="Scheduled work beside the day"><span class="group-label">Meanwhile, on their own clocks</span><div class="meanwhile-nodes">${meanwhile.map((item) => node(item.id, item.name, `${item.when} · ${item.copy}`)).join('')}</div></section>`;
}

// View 06: the seam. The fork's run on the left, dev1 on the right, the lock
// between. The state panel follows the selected step; main.js mirrors the
// selected component onto the diagram as data-selected.
const seamStates = [
  {
    for: 'image descriptor gate facts trust',
    lock: ['A', 'canonical · community image'],
    pod: ['A', 'running'],
    copy: 'Canonical image A is running. Nothing has been written yet; the gate and the facts are reads.',
  },
  {
    for: 'delivery',
    lock: ['B', 'pinned · owned by run 9901'],
    pod: ['A → B', 'Flux reconciles; the pod restarts'],
    copy: 'This run pins candidate B and records, in the lock annotation, that run 9901 owns the pin and that A is what to restore.',
  },
  {
    for: 'verify',
    lock: ['B', 'pinned · owned by run 9901'],
    pod: ['B', 'imageID matches · rollout complete'],
    copy: 'Verify polls until a running pod reports B as its imageID, or 15 minutes pass, or the lock no longer says B.',
  },
  {
    for: 'proof',
    lock: ['B', 'pinned · owned by run 9901'],
    pod: ['B', 'answering the declared suites'],
    copy: 'The suites run from the acceptance image against the pod. Reports are the evidence; a clean container exit alone is not.',
  },
  {
    for: 'restore running',
    lock: ['A', 'restored by run 9901'],
    pod: ['B → A', 'Flux reconciles again'],
    copy: 'Restore writes the recorded canonical A back, because the annotation still names 9901. The pod returns to A.',
  },
  {
    for: 'lock-taken',
    lock: ['B′', 'pinned · owned by run 9902'],
    pod: ['B′', 'the newer candidate'],
    copy: 'Another run pinned first. Run 9901’s reset finds it is not the owner, writes nothing, and exits 2. Run 9902 will restore A.',
  },
];

function seamDiagram() {
  return `<div class="zoom-crumb" aria-label="Where this sits"><a href="#fork-day/prove">A candidate digest</a><span>›</span><b>the handshake</b><span>›</span><a href="#running-stack">a running stack</a></div>
  <div class="seam-map">
    <section class="seam-inputs"><span class="group-label"><span class="lane-number">1</span>What the fork brings</span><div class="seam-pair">${node('image', 'Candidate B, by digest', 'ghcr.io/azure/osdu-spi-partition@sha256:…')}${node('descriptor', '.spi/service.yaml', 'Which suites, and what each needs', 'fork-code')}</div></section>
    <section class="seam-state-panel" aria-label="The lock and the pod, step by step"><span class="group-label">The lock and the pod, as the run goes</span>
      ${seamStates
        .map(
          (state) => `<div class="seam-state" data-for="${state.for}">
        <div class="state-obj state-lock"><small>osdu-image-lock · PARTITION_IMAGE_DIGEST</small><b>${state.lock[0]}</b><span>${state.lock[1]}</span></div>
        <div class="state-obj state-pod"><small>partition pod · imageID</small><b>${state.pod[0]}</b><span>${state.pod[1]}</span></div>
        <p>${state.copy}</p></div>`,
        )
        .join('')}
      <p class="state-note">A and B stand for two digests. Select a step in 2, or the lock in 3, to move the state. Illustrative run ids.</p>
    </section>
    <section class="seam-run"><span class="group-label"><span class="lane-number">2</span>The run, in order · validate.yml</span>
      ${node('gate', 'Deploy Gate', 'No credentials · may this run borrow?')}
      <div class="spi-step" aria-hidden="true">↓ then, as the deploy identity</div>
      ${node('facts', 'Read the facts', 'spi status --json · spi info --json')}
      <div class="spi-step" aria-hidden="true">↓ deployable: pin B into osdu-image-lock (3)</div>
      ${node('verify', 'Verify', 'Pod imageID = B · up to 15 min')}
      <div class="spi-step" aria-hidden="true">↓ running the candidate</div>
      ${node('proof', 'Prove', 'Each declared suite, from its image')}
      <div class="spi-step" aria-hidden="true">↓ always, even after failure</div>
      ${node('restore', 'Restore', 'spi service reset --if-run · A comes back')}
      ${node('lock-taken', 'What if another run owns the pin?', 'Optional · reset exits 2, writes nothing', 'artifact')}
    </section>
    <section class="seam-stack"><span class="group-label"><span class="lane-number">3</span>In dev1 · stack objects</span>
      ${node('trust', 'The deploy identity', 'Federated to this repository · two Roles')}
      ${node('delivery', 'osdu-image-lock', 'The one object the run writes: a pin it owns', 'spi-seam', 'The seam')}
      ${node('running', 'The partition pod', 'Flux reconciles the lock; the pod follows', 'shared-code')}
    </section>
  </div>
  <div class="ownership-legend"><span><i class="fork-swatch"></i>Fork-owned</span><span><i class="shared-swatch"></i>Built by the stack</span><span>Five repository settings plus trust onboarding connect them. Everything else is read per run.</span></div>`;
}

export const diagramRenderers = {
  overview: architectureOverview,
  creation: creationWalkthrough,
  spi: spiBoundaryDiagram,
  fork: forkShapeDiagram,
  forkDay: forkDayDiagram,
  seam: seamDiagram,
};
