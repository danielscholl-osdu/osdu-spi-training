import { escapeHtml } from './node.js';
import { zoomLevels, spiMeanings } from '../content/concepts.js';
import { chapters } from '../content/chapters.js';
import { componentDetails } from '../content/component-details.js';
import { sources } from '../content/sources.js';

// Owner colors are shared with the legend in pages.css; orange stays reserved
// for fork-owned source.
const owners = [
  {
    key: 'cli',
    name: 'CLI + Bicep',
    owns: 'Azure',
    detail:
      'Resource group, AKS, networking, identities, Cosmos DB, Service Bus, Storage, Key Vault, and the inputs seeded into the cluster.',
    runs: 'Only when a human or a CI job runs it.',
    boundary: 'Flux does not reconcile Azure infrastructure.',
    tool: 'spi up --env <name>',
  },
  {
    key: 'flux',
    name: 'Flux',
    owns: 'Kubernetes workloads',
    detail:
      'Reads manifests from Git and applies them in dependency order: operators, middleware, OSDU services, initialization Jobs.',
    runs: 'Continuously, without anyone asking.',
    boundary:
      'Keeps applying the cached Git revision when fetching is suspended.',
    tool: 'kubectl get kustomizations -n osdu-flux',
  },
  {
    key: 'k8s',
    name: 'Controllers and operators',
    owns: 'The things they manage',
    detail:
      'Scheduling pods, keeping Elasticsearch and PostgreSQL clusters healthy, issuing certificates, distributing trust bundles.',
    runs: 'Regardless of what Flux or the CLI are doing.',
    boundary: 'Continue independently of Git polling.',
    tool: 'kubectl get pods -n foundation',
  },
  {
    key: 'you',
    name: 'You, the operator',
    owns: 'The decisions',
    detail:
      'When to pull new changes, when to refresh images, when to delete the environment, and how to diagnose it.',
    runs: 'When something needs a judgment call.',
    boundary: 'A successful CLI exit is not an API-readiness check.',
    tool: 'spi reconcile --refresh-images',
  },
];

function ownersGuide() {
  return `<div class="guide-owners">${owners
    .map(
      (owner) => `<article class="owner-card owner-${owner.key}">
        <span class="owner-name">${owner.name}</span>
        <b>owns ${owner.owns}</b>
        <p>${owner.detail}</p>
        <small>${owner.runs}</small>
        <span class="owner-boundary">${owner.boundary}</span>
        <code>${escapeHtml(owner.tool)}</code>
      </article>`,
    )
    .join('')}</div>
    <p class="guide-thesis">Provisioning and convergence are separate concerns with separate timelines.</p>`;
}

const milestones = [
  {
    owner: 'cli',
    signal: 'The CLI exited successfully',
    proves: 'The orchestration completed without a fatal error.',
    check: 'echo $?',
  },
  {
    owner: 'flux',
    signal: 'The Git source has an artifact',
    proves: 'Flux has the requested revision to reconcile.',
    check:
      'kubectl get gitrepository osdu-spi-stack-system -n osdu-flux -o yaml\n# status.artifact.revision',
  },
  {
    owner: 'flux',
    signal: 'Kustomizations and HelmReleases are Ready',
    proves: 'Declared resources passed their configured health checks.',
    check: 'kubectl get kustomizations,helmreleases -A',
  },
  {
    owner: 'flux',
    signal: 'Initialization Jobs are Complete',
    proves: 'Partition and entitlements bootstrap and schema loading finished.',
    check: 'kubectl get jobs -n osdu',
  },
  {
    owner: 'you',
    signal: 'An authenticated API request succeeds',
    proves: 'The particular request path you exercised is usable.',
    check: 'TOKEN=$(spi token); curl -H "Authorization: Bearer $TOKEN" …',
  },
];

function milestonesGuide() {
  return `<ul role="list" class="guide-milestones">${milestones
    .map(
      (m) => `<li class="owner-${m.owner}">
        <div><b>${m.signal}</b><p>${m.proves}</p><code>${escapeHtml(m.check)}</code></div>
      </li>`,
    )
    .join('')}</ul>
    <p class="guide-thesis">spi status --watch observes configured health and initialization without making an authenticated request. A successful request proves only the exercised API path. A pod in Running phase is not necessarily Ready, and a completed Job should be Complete rather than Running.</p>`;
}

const profileLayers = [
  {
    label: 'OSDU services + initialization + schema load',
    on: [false, false, true],
  },
  {
    label: 'Operators + middleware (foundation, platform)',
    on: [false, true, true],
  },
  { label: 'Flux extension + CLI bootstrap inputs', on: [true, true, true] },
  {
    label: 'AKS Automatic + Azure PaaS estate',
    on: [true, true, true],
    azure: true,
  },
];
const profiles = [
  { name: 'bare', who: 'Infrastructure and identity work' },
  { name: 'minimal', who: 'Platform-layer work' },
  { name: 'core', who: 'Evaluating OSDU' },
];

function profilesGuide() {
  return `<div class="guide-profiles">
    <div class="profile-columns">${profiles
      .map(
        (profile, column) => `<section class="profile-column">
          <h4><code>${profile.name}</code><small>${profile.who}</small></h4>
          ${profileLayers
            .map(
              (layer) =>
                `<div class="profile-layer ${layer.on[column] ? 'is-on' : 'is-off'} ${layer.azure ? 'is-azure' : ''}"><span>${layer.label}</span></div>`,
            )
            .join('')}
        </section>`,
      )
      .join('')}</div>
    <p class="guide-thesis">Profiles select Flux workload scope, not a smaller Azure estate. The bottom layer is provisioned by every profile.</p>
  </div>`;
}

function identityGuide() {
  return `<div class="guide-identity">
    <section class="identity-path outbound">
      <h4>Outbound · a pod calls Azure</h4>
      <ol>
        <li><b>ServiceAccount</b><span>workload-identity-sa in osdu, annotated with the UAMI client ID</span></li>
        <li><b>Projected token</b><span>a file mounted by the AKS webhook, not a stored secret</span></li>
        <li><b>Entra ID exchange</b><span>federated credential must match issuer, subject, and audience</span></li>
        <li><b>Azure access token</b><span>Cosmos DB, Storage, Service Bus authorize the identity</span></li>
      </ol>
      <p>Local key and SAS auth is disabled by construction. Retained key fields say <code>DISABLED</code>.</p>
    </section>
    <div class="identity-divider"><span>A successful token exchange does not prove an OSDU request will be accepted.</span></div>
    <section class="identity-path inbound">
      <h4>Inbound · a client calls OSDU</h4>
      <ol>
        <li><b>Bearer + data-partition-id</b><span>the same headers you already send to OSDU</span></li>
        <li><b>Gateway</b><span>spi-gateway bound to the managed Istio ingress</span></li>
        <li><b>Sidecar</b><span>RequestAuthentication validates; an EnvoyFilter projects x-app-id and x-user-id</span></li>
        <li><b>The service decides</b><span>entitlements answer for most services; partition admits app-only callers</span></li>
      </ol>
      <p>Caller authentication and OSDU authorization remain separate checks.</p>
    </section>
  </div>`;
}

// Bars are placed on a 0–60 minute axis for the observed window, then a broken
// axis for the 150-minute schema-load deadline. Positions are illustrative
// orderings, not measurements.
function timelineGuide() {
  const width = 1040;
  const axisStart = 290;
  const axisEnd = 880;
  const minute = (axisEnd - axisStart) / 60;
  const x = (m) => axisStart + m * minute;
  const bars = [
    {
      owner: 'cli',
      label: 'Preflight, resource group',
      from: 0,
      to: 2,
      kind: 'observed',
    },
    {
      owner: 'cli',
      label: 'AKS template ≈30 min',
      from: 2,
      to: 32,
      kind: 'observed',
    },
    {
      owner: 'cli',
      label: 'PaaS template, identities',
      from: 32,
      to: 34,
      kind: 'ordered',
    },
    {
      owner: 'cli',
      label: 'Bootstrap cluster inputs',
      from: 34,
      to: 35,
      kind: 'ordered',
    },
    {
      owner: 'flux',
      label: 'Flux extension ≈10–15 min',
      from: 35,
      to: 46,
      kind: 'observed',
    },
    {
      owner: 'cli',
      label: 'Verify revision, suspend source, exit',
      from: 46,
      to: 47,
      kind: 'ordered',
    },
    {
      owner: 'flux',
      label: 'Operators → middleware → OSDU → Jobs',
      from: 44,
      to: 60,
      kind: 'continues',
    },
  ];
  const rowHeight = 34;
  const top = 44;
  const rows = bars
    .map(
      (bar, i) => `<g class="timeline-row owner-${bar.owner}">
        <text x="${axisStart - 12}" y="${top + i * rowHeight + 21}" text-anchor="end">${escapeHtml(bar.label)}</text>
        <rect x="${x(bar.from)}" y="${top + i * rowHeight + 6}" width="${x(bar.to) - x(bar.from)}" height="22" rx="4" class="bar-${bar.kind}"></rect>
        ${bar.kind === 'continues' ? `<text x="${x(60) + 8}" y="${top + i * rowHeight + 21}" class="bar-note">continues past the CLI exit</text>` : ''}
      </g>`,
    )
    .join('');
  const ticks = [0, 10, 20, 30, 40, 50, 60]
    .map(
      (m) =>
        `<line x1="${x(m)}" y1="${top - 8}" x2="${x(m)}" y2="${top + bars.length * rowHeight}" class="tick"></line><text x="${x(m)}" y="${top - 14}" text-anchor="middle" class="tick-label">${m} min</text>`,
    )
    .join('');
  const exitY = top + bars.length * rowHeight;
  return `<figure class="guide-timeline">
    <svg viewBox="0 0 ${width} ${exitY + 96}" role="img" aria-label="Timeline of one spi up invocation showing CLI phases, the Flux extension starting before the CLI exits, and reconciliation continuing afterwards">
      ${ticks}
      ${rows}
      <line x1="${x(47)}" y1="${top - 8}" x2="${x(47)}" y2="${exitY + 4}" class="exit-line"></line>
      <text x="${x(47)}" y="${exitY + 22}" text-anchor="middle" class="exit-label">CLI exit ≈45–50 min (observed, centralus)</text>
      <g class="deadline">
        <rect x="${axisStart}" y="${exitY + 40}" width="${width - axisStart - 20}" height="22" rx="4" class="bar-deadline"></rect>
        <text x="${axisStart + 12}" y="${exitY + 55}" class="deadline-label">Schema-load Job deadline 150 min · Kustomization timeout 155 min · ceilings, not durations</text>
      </g>
    </svg>
    <figcaption>
      <span><i class="swatch bar-observed"></i>Observed component time</span>
      <span><i class="swatch bar-ordered"></i>Ordered step, duration not measured</span>
      <span><i class="swatch bar-continues"></i>Continues after the CLI</span>
      <span><i class="swatch bar-deadline"></i>Deadline</span>
    </figcaption>
  </figure>
  <p class="guide-thesis">Overlapping phases must not be added. The CLI’s default region is westus3; the observations came from centralus.</p>`;
}

const familiar = [
  {
    known: 'A data partition',
    example: 'opendes',
    lives:
      'Its own Cosmos DB SQL account, Storage account, and Service Bus namespace',
    owner: 'cli',
    where: 'Azure · per partition',
    href: '#running-stack/developer?detail=cosmos',
    detail: 'cosmos',
  },
  {
    known: 'Entitlements groups',
    example: 'users.datalake.viewers',
    lives: 'A Cosmos DB Gremlin graph shared by the whole environment',
    owner: 'cli',
    where: 'Azure · shared',
    href: '#running-stack/developer?detail=shared-data',
    detail: 'shared-data',
  },
  {
    known: 'Search',
    example: 'POST /api/search/v2/query',
    lives: 'Elasticsearch running inside the cluster, managed by an operator',
    owner: 'k8s',
    where: 'AKS · platform namespace',
    href: '#running-stack/developer?detail=middleware',
    detail: 'middleware',
  },
  {
    known: 'Schemas',
    example: 'osdu:wks:master-data--Well:1.0.0',
    lives: 'Loaded by a Job into the primary partition’s system database',
    owner: 'flux',
    where: 'AKS · osdu namespace',
    href: '#running-stack/developer?detail=initialization',
    detail: 'initialization',
  },
  {
    known: 'The services',
    example: 'partition · storage · indexer',
    lives:
      'Deployments in the osdu namespace, one image each, shared code plus Azure provider',
    owner: 'flux',
    where: 'AKS · osdu namespace',
    href: '#running-stack/developer?detail=service',
    detail: 'service',
  },
  {
    known: 'Your API call',
    example: 'Bearer + data-partition-id',
    lives:
      'Istio gateway, then a sidecar that identifies the caller, then the service',
    owner: 'you',
    where: 'AKS · aks-istio-ingress',
    href: '#running-stack/request?detail=gateway&claim=2',
    detail: 'gateway',
  },
  {
    known: 'Credentials',
    example: 'connection strings',
    lives:
      'Workload Identity for Azure; middleware passwords in Secrets mirrored to Key Vault',
    owner: 'cli',
    where: 'Azure · shared',
    href: '#running-stack/developer?detail=vault',
    detail: 'vault',
  },
];

// Each row opens its explanation in place. Only the explicit link at the end
// moves the page to the map, and its label says so.
function familiarGuide() {
  return `<div class="guide-familiar">
    <div class="familiar-head"><span>You know</span><span>In the stack it is</span><span>Explain</span></div>
    ${familiar
      .map((row) => {
        const detail = componentDetails[row.detail];
        const source = sources[detail.source];
        return `<details class="familiar-row owner-${row.owner}" name="familiar">
        <summary>
          <div class="familiar-known"><b>${row.known}</b><code>${escapeHtml(row.example)}</code></div>
          <div class="familiar-lives"><small>${row.where}</small><p>${row.lives}</p></div>
          <span class="familiar-open" aria-hidden="true">▾</span>
        </summary>
        <div class="familiar-detail">
          <span class="detail-label">${detail.label}</span>
          <h4>${detail.title}</h4>
          <p>${detail.body}</p>
          ${detail.artifact ? `<div class="familiar-artifact"><span>${detail.artifact.label}</span><pre><code>${escapeHtml(detail.artifact.code)}</code></pre></div>` : ''}
          <p class="familiar-links"><a href="${row.href}" data-map-jump>Show it on the map ↑</a><a href="${source.href}" target="_blank" rel="noopener noreferrer">${source.label} ↗</a></p>
        </div>
      </details>`;
      })
      .join('')}
  </div>
  <p class="guide-thesis">Nothing about the OSDU contract changed. What changed is where each familiar thing lives and who keeps it running.</p>`;
}

const chapterNumber = (key) =>
  String(
    Object.keys(chapters)
      .filter((id) => chapters[id].group === 'learn')
      .indexOf(key) + 1,
  ).padStart(2, '0');

function levelTags(level) {
  return `<span class="zoom-tags"><small>${level.chapters.length > 1 ? 'Lessons' : 'Lesson'}</small>${level.chapters
    .map(
      (key) =>
        `<a href="#${key}" title="Open ${chapterNumber(key)} · ${chapters[key].title}">${chapterNumber(key)}</a>`,
    )
    .join('')}</span>`;
}

// Nested boxes for the Field guides page. Levels 1–5 nest; level 6 stands beside
// them because source is where a service comes from, not somewhere inside it.
// The resource group holds the data services and the cluster side by side; the
// cluster nests namespaces and one service. The source sits outside, feeding in.
export function zoomLadder() {
  const [group, resources, cluster, workloads, service, source] = zoomLevels;
  const box = (level, index, inner = '') =>
    `<div class="zoom-box owner-${level.owner} zoom-depth-${index}" id="zoom-${level.id}">
      <div class="zoom-bar"><span class="zoom-index">${index + 1}</span><a href="${level.href}"><b>${level.name}</b><small>${level.detail}</small></a>${levelTags(level)}</div>${inner}</div>`;
  const inside = box(cluster, 2, box(workloads, 3, box(service, 4)));
  const siblings = `<div class="zoom-siblings">${box(resources, 1)}${inside}</div>`;
  return `<div class="zoom-ladder">
    <div class="zoom-nest">${box(group, 0, siblings)}</div>
    <div class="zoom-aside">
      <div class="zoom-arrow" aria-hidden="true"><span>built from, not inside</span>←</div>
      ${box(source, 5).replace('zoom-depth-5', 'zoom-depth-5 zoom-source')}
    </div>
  </div>`;
}

// The course's shape: the lookup goes down the stack, the fix goes out to
// the fork and back in through the lock. Each box links the view that draws it.
export function roundTripFigure() {
  const stop = (href, number, title, sub) =>
    `<a class="loop-stop" href="${href}"><span class="loop-number">${number}</span><b>${title}</b><small>${sub}</small></a>`;
  return `<div class="round-trip">
    <div class="loop-side loop-stack">
      <div class="loop-head"><b>The stack</b><small>a place · lessons 01 to 03</small></div>
      ${stop('#running-stack/request', '01', 'A partition lookup', 'arrives at your environment’s gateway')}
      <span class="loop-arrow" aria-hidden="true">↓</span>
      ${stop('#bring-up', '02', 'The stack that answers it', 'built by one spi up')}
      <span class="loop-arrow" aria-hidden="true">↓</span>
      ${stop('#spi-boundary', '03', 'Inside the partition service', 'common code, the interface, the Azure provider')}
    </div>
    <div class="loop-cross loop-out"><span>a fix to that provider</span><span aria-hidden="true">→</span></div>
    <div class="loop-side loop-fork">
      <div class="loop-head"><b>The fork</b><small>a repository on a schedule · lessons 04 and 05</small></div>
      ${stop('#fork-shape', '04', 'Where the provider lives', 'paths the fork owns, branches it regenerates')}
      <span class="loop-arrow" aria-hidden="true">↓</span>
      ${stop('#fork-day', '05', 'One day in the fork', 'generate, integrate, propose, prove')}
      <span class="loop-arrow" aria-hidden="true">↓</span>
      <div class="loop-stop loop-digest"><b>A candidate digest</b><small>ghcr.io/…:sha-*</small></div>
    </div>
    <div class="loop-cross loop-back"><span aria-hidden="true">←</span><span>pinned into the stack, proved, restored</span></div>
    <a class="loop-seam" href="#handshake"><span class="loop-number">06</span><b>The handshake</b><small>the image lock, the only object both sides write</small></a>
  </div>`;
}

export function spiNamesFigure() {
  return `<div class="spi-names">${spiMeanings
    .map(
      (meaning) => `<article class="spi-name owner-${meaning.owner}">
      <span class="spi-name-kicker">${meaning.kicker}</span>
      <h3>${meaning.name}</h3>
      <p>${meaning.copy}</p>${meaning.lives ? `<code>${escapeHtml(meaning.lives)}</code>` : ''}
      <a class="spi-name-repo" href="${meaning.repo.href}" target="_blank" rel="noopener noreferrer">${escapeHtml(meaning.repo.label)} ↗</a>
    </article>`,
    )
    .join('')}</div>`;
}

// The labels on a sync tracking issue, drawn as the state machine they are.
const labelStates = [
  [
    'upstream-sync + human-required',
    'Sync Upstream opened the PR and the issue',
    'wait',
  ],
  [
    'cascade-active',
    'The cascade is running, or the monitor dispatched it',
    'active',
  ],
  ['validated', 'The integration PR is open; a person approves', 'done'],
];
const labelExits = [
  [
    'cascade-blocked',
    'A conflict, or validation failed on the workspace',
    'Resolve on fork_integration, push, then remove human-required if it is set',
  ],
  [
    'cascade-failed + human-required',
    'The run itself failed',
    'Fix the cause; removing human-required is the retry signal',
  ],
];
function labelsGuide() {
  return `<div class="labels-machine">
    <ol class="labels-happy">${labelStates
      .map(
        ([label, meaning, kind], i) =>
          `<li class="label-state is-${kind}"><code>${label}</code><span>${meaning}</span>${i < labelStates.length - 1 ? '<i aria-hidden="true">→</i>' : ''}</li>`,
      )
      .join('')}</ol>
    <div class="labels-exits">${labelExits
      .map(
        ([label, meaning, action]) =>
          `<div class="label-exit"><code>${label}</code><span>${meaning}</span><small>${action}</small></div>`,
      )
      .join('')}</div>
    <p class="labels-note">Cascade Monitor reads these every six hours: it dispatches a merged sync, retries an issue whose human-required label a person removed, and escalates anything blocked longer than 48 hours. The labels are the audit trail; nothing else remembers.</p>
  </div>`;
}

// The fork's recurring work, on its own clocks. None of these cause each other.
const clocks = [
  [
    'Sync Upstream',
    '00:00 UTC daily',
    'Regenerates fork_upstream; one PR and one tracking issue',
    '#fork-day/sync',
  ],
  [
    'Sync Template',
    '08:00 UTC daily',
    'Workflow and Dockerfile changes arrive as one PR',
    '#fork-day?detail=template-pr',
  ],
  [
    'Cascade Monitor',
    'every 6 hours',
    'Dispatches missed cascades, retries cleared failures, escalates',
    '#fork-day?detail=monitor',
  ],
  [
    'Settings Apply',
    'Mondays 04:00 UTC',
    'Rulesets, onboarding variables, GHCR visibility',
    '#fork-day?detail=settings-apply',
  ],
  [
    'GHCR Retention',
    'Mondays 05:00 UTC',
    'sha-* tags older than 30 days pruned; version tags kept',
    '#fork-day/release?detail=release-tag',
  ],
  [
    'Validation',
    'on push and PR',
    'Builds, pushes a digest, and may borrow the stack',
    '#fork-day/prove',
  ],
];
function clocksGuide() {
  return `<ol class="clock-strip">${clocks
    .map(
      ([name, when, copy, href]) =>
        `<li><a href="${href}"><b>${name}</b><span class="clock-when">${when}</span><small>${copy}</small></a></li>`,
    )
    .join('')}</ol>
  <p class="labels-note">A cascade follows a sync PR merge, and a release follows a version PR merge. Everything else here runs on its own schedule and does not wait for the day view’s moments.</p>`;
}

function partitionLookupLane(lane, key) {
  const processSteps = lane.process.steps
    .map(
      (step, index) => `<li class="partition-flow-step">
        ${index ? '<span class="partition-flow-arrow" aria-hidden="true">↓</span>' : ''}
        <b>${escapeHtml(step.label)}</b>
        <span>${escapeHtml(step.detail)}</span>
      </li>`,
    )
    .join('');
  const dependencies = lane.dependencies
    .map(
      (dependency) => `<li class="partition-dependency">
        <span class="partition-flow-arrow" aria-hidden="true">↓</span>
        <small>${escapeHtml(dependency.when)}</small>
        <b>${escapeHtml(dependency.label)}</b>
        <span>${escapeHtml(dependency.detail)}</span>
      </li>`,
    )
    .join('');

  return `<article class="partition-lookup-lane partition-lookup-${key}">
    <header>
      <span class="guide-kicker">${escapeHtml(lane.label)}</span>
      <h3>${escapeHtml(lane.image)}</h3>
      <p>${escapeHtml(lane.revision)}</p>
      <small>${escapeHtml(lane.hosting)}</small>
    </header>
    <div class="partition-process">
      <span class="partition-boundary-label">${escapeHtml(lane.process.label)}</span>
      <ol>${processSteps}</ol>
    </div>
    <ol class="partition-dependencies">${dependencies}</ol>
  </article>`;
}

export function partitionLookupFigure(comparison) {
  if (!comparison) return '';
  return `<figure class="partition-lookup-figure">
    <figcaption>
      <code>${escapeHtml(comparison.operation)}</code>
      <p>${escapeHtml(comparison.intro)}</p>
    </figcaption>
    <div class="partition-lookup-lanes">
      ${partitionLookupLane(comparison.community, 'community')}
      ${partitionLookupLane(comparison.azure, 'azure')}
    </div>
  </figure>`;
}

export const infographics = {
  familiar: familiarGuide,
  owners: ownersGuide,
  milestones: milestonesGuide,
  profiles: profilesGuide,
  identity: identityGuide,
  timeline: timelineGuide,
  labels: labelsGuide,
  clocks: clocksGuide,
};

export function ownerLegend() {
  return `<div class="owner-legend" aria-label="Owner colors">${owners
    .map(
      (owner) => `<span class="owner-${owner.key}"><i></i>${owner.name}</span>`,
    )
    .join('')}<span class="owner-fork"><i></i>Fork-owned source</span></div>`;
}
