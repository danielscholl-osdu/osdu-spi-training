import { escapeHtml } from './node.js';
import { zoomLevels, spiMeanings } from '../content/concepts.js';
import { chapters } from '../content/chapters.js';

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
    tool: 'spi up --env dev1',
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
    <p class="guide-thesis">A successful CLI exit is not a readiness check. Provisioning and convergence are separate concerns with separate timelines.</p>`;
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
    proves: 'Flux has manifests to reconcile at the requested revision.',
    check: 'kubectl get gitrepository -n osdu-flux',
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
  return `<ol class="guide-milestones">${milestones
    .map(
      (m, i) => `<li class="owner-${m.owner}">
        <span class="milestone-number">${i + 1}</span>
        <div><b>${m.signal}</b><p>${m.proves}</p><code>${escapeHtml(m.check)}</code></div>
      </li>`,
    )
    .join('')}</ol>
    <p class="guide-thesis">Only the fifth means the environment works for you. A pod in Running phase is not necessarily ready, and a completed Job is not supposed to still be running.</p>`;
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
    <p class="guide-thesis">Profiles select Flux workload scope, not a smaller Azure bill. The bottom layer is provisioned by every profile.</p>
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
        <li><b>The service decides</b><span>entitlements still answer the authorization question</span></li>
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
      to: 40,
      kind: 'ordered',
    },
    {
      owner: 'cli',
      label: 'Bootstrap cluster inputs',
      from: 40,
      to: 43,
      kind: 'ordered',
    },
    {
      owner: 'flux',
      label: 'Flux extension ≈10–15 min',
      from: 43,
      to: 56,
      kind: 'observed',
    },
    {
      owner: 'cli',
      label: 'Verify revision, suspend source, exit',
      from: 52,
      to: 58,
      kind: 'ordered',
    },
    {
      owner: 'flux',
      label: 'Operators → middleware → OSDU → Jobs',
      from: 46,
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
  },
  {
    known: 'Entitlements groups',
    example: 'users.datalake.viewers',
    lives: 'A Cosmos DB Gremlin graph shared by the whole environment',
    owner: 'cli',
    where: 'Azure · shared',
    href: '#running-stack/developer?detail=shared-data',
  },
  {
    known: 'Search',
    example: 'POST /api/search/v2/query',
    lives: 'Elasticsearch running inside the cluster, managed by an operator',
    owner: 'k8s',
    where: 'AKS · platform namespace',
    href: '#running-stack/developer?detail=middleware',
  },
  {
    known: 'Schemas',
    example: 'osdu:wks:master-data--Well:1.0.0',
    lives: 'Loaded by a Job into the primary partition’s system database',
    owner: 'flux',
    where: 'AKS · osdu namespace',
    href: '#running-stack/developer?detail=initialization',
  },
  {
    known: 'The services',
    example: 'partition · storage · indexer',
    lives:
      'Deployments in the osdu namespace, one image each, shared code plus Azure provider',
    owner: 'flux',
    where: 'AKS · osdu namespace',
    href: '#running-stack/developer?detail=service',
  },
  {
    known: 'Your API call',
    example: 'Bearer + data-partition-id',
    lives:
      'Istio gateway, then a sidecar that identifies the caller, then the service',
    owner: 'you',
    where: 'AKS · aks-istio-ingress',
    href: '#running-stack/request?detail=gateway',
  },
  {
    known: 'Credentials',
    example: 'connection strings',
    lives:
      'Workload Identity for Azure; middleware passwords in Secrets mirrored to Key Vault',
    owner: 'cli',
    where: 'Azure · shared',
    href: '#running-stack/developer?detail=vault',
  },
];

function familiarGuide() {
  return `<div class="guide-familiar">
    <div class="familiar-head"><span>You know</span><span>In the stack it is</span><span>Look</span></div>
    ${familiar
      .map(
        (row) => `<div class="familiar-row owner-${row.owner}">
        <div class="familiar-known"><b>${row.known}</b><code>${escapeHtml(row.example)}</code></div>
        <div class="familiar-lives"><small>${row.where}</small><p>${row.lives}</p></div>
        <a href="${row.href}" aria-label="Look at ${row.known} on the map">On the map →</a>
      </div>`,
      )
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
  return `<span class="zoom-tags">${level.chapters
    .map(
      (key) =>
        `<a href="#${key}" title="${chapters[key].title}">${chapterNumber(key)}</a>`,
    )
    .join('')}</span>`;
}

// Nested boxes for the start page. Levels 1–5 nest; level 6 stands beside
// them because source is where a service comes from, not somewhere inside it.
export function zoomLadder() {
  const nested = zoomLevels.slice(0, 5);
  const source = zoomLevels[5];
  const open = nested
    .map(
      (
        level,
        i,
      ) => `<div class="zoom-box owner-${level.owner} zoom-depth-${i}" id="zoom-${level.id}">
        <div class="zoom-bar"><span class="zoom-index">${i + 1}</span><a href="${level.href}"><b>${level.name}</b><small>${level.detail}</small></a>${levelTags(level)}</div>`,
    )
    .join('');
  const close = '</div>'.repeat(nested.length);
  return `<div class="zoom-ladder">
    <div class="zoom-nest">${open}${close}</div>
    <div class="zoom-aside">
      <div class="zoom-arrow" aria-hidden="true"><span>built from</span>←</div>
      <div class="zoom-box owner-${source.owner} zoom-source" id="zoom-${source.id}">
        <div class="zoom-bar"><span class="zoom-index">6</span><a href="${source.href}"><b>${source.name}</b><small>${source.detail}</small></a>${levelTags(source)}</div>
      </div>
    </div>
  </div>`;
}

// A compact "you are here" for the top of every learn view.
export function zoomStrip(activeIds = [], current = null) {
  return `<nav class="zoom-strip" aria-label="Where this view sits">
    <span class="zoom-strip-label">You are here</span>
    <ol>${zoomLevels
      .map(
        (level, i) =>
          `<li class="owner-${level.owner} ${activeIds.includes(level.id) ? 'is-active' : ''}"><a href="${level.chapters.includes(current) ? level.href : `#${level.chapters[0]}`}"><span>${i + 1}</span>${level.name}</a></li>`,
      )
      .join('')}</ol>
  </nav>`;
}

export function spiNamesFigure() {
  return `<div class="spi-names">${spiMeanings
    .map(
      (meaning) => `<article class="spi-name owner-${meaning.owner}">
      <span class="spi-name-kicker">${meaning.kicker}</span>
      <h3>${meaning.name}</h3>
      <p>${meaning.copy}</p>
      <code>${escapeHtml(meaning.lives)}</code>
      <a href="${meaning.href}">${meaning.hrefLabel} →</a>
    </article>`,
    )
    .join('')}</div>`;
}

export const infographics = {
  familiar: familiarGuide,
  owners: ownersGuide,
  milestones: milestonesGuide,
  profiles: profilesGuide,
  identity: identityGuide,
  timeline: timelineGuide,
};

export function ownerLegend() {
  return `<div class="owner-legend" aria-label="Owner colors">${owners
    .map(
      (owner) => `<span class="owner-${owner.key}"><i></i>${owner.name}</span>`,
    )
    .join('')}<span class="owner-fork"><i></i>Fork-owned source</span></div>`;
}
