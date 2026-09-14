// Three generated audio discussions. Marker times come from the transcripts
// in docs/reference; `note` records where the narration differs from the
// source documentation. Nothing here navigates on its own.
import { transcript as stackTranscript } from './transcripts/stack.js';
import { transcript as orientationTranscript } from './transcripts/orientation.js';
import { transcript as briefTranscript } from './transcripts/brief.js';
import { transcript as branchesTranscript } from './transcripts/branches.js';

const stackMarkers = [
  {
    time: 0,
    title: 'Why OSDU exists',
    copy: 'A merger stalls on data trapped in incompatible vendor systems. OSDU is the industry’s common platform: agreed APIs for records, schemas, search, legal tags, entitlements, and partitions.',
    route: '#start',
    routeLabel: 'Start here',
  },
  {
    time: 368,
    title: 'Shared core, swappable providers',
    copy: 'Each service keeps its business logic in a core module and abstracts cloud access behind a provider implementation. This is the Service Provider Interface.',
    route: '#spi-boundary',
    routeLabel: 'The SPI boundary',
  },
  {
    time: 477,
    title: 'Fifty resources, one command',
    copy: 'Provisioning by hand means roughly fifty Azure resources in the right order. spi up compresses the exercise into one invocation.',
    route: '#bring-up/start',
    routeLabel: 'Follow spi up',
    note: 'The 45–50 minute figure is an observation from prior centralus smoke runs, not a guarantee, and API readiness can follow the CLI exit.',
  },
  {
    time: 657,
    title: 'A development and test environment by design',
    copy: 'All OSDU services share one managed identity, there is no backup or disaster recovery, and middleware is sized for testing. The scope is deliberate.',
    route: '#running-stack/developer?detail=identity',
    routeLabel: 'The shared managed identity',
    note: 'The narration’s “forty of fifty minutes waiting on role assignments” is an illustration. The documentation records Cosmos data-plane propagation of five to fifteen minutes.',
  },
  {
    time: 764,
    title: 'Four owners, four boundaries',
    copy: 'The CLI and Bicep own Azure. Flux owns the workloads. Controllers keep workloads healthy; operators choose when to update, diagnose, or remove the environment.',
    route: '#running-stack',
    routeLabel: 'The owners on the map',
  },
  {
    time: 915,
    title: 'The CLI exits; Flux keeps working',
    copy: 'The CLI can exit successfully while Flux is still deploying workloads and running initialization Jobs. A successful exit is not a readiness check.',
    route: '#bring-up/reconcile',
    routeLabel: 'Assemble OSDU',
  },
  {
    time: 1015,
    title: 'Why the provider uses Azure PaaS',
    copy: 'The Azure provider uses Cosmos DB, Service Bus, Storage, and Key Vault. Elasticsearch, Redis, and PostgreSQL run inside AKS. Testing the provider against substitutes would bypass the code under test.',
    route: '#running-stack/developer?detail=cosmos',
    routeLabel: 'Per-partition Azure resources',
  },
  {
    time: 1191,
    title: 'The three that stayed in the cluster',
    copy: 'Elasticsearch, because Azure AI Search does not speak its API. Redis and PostgreSQL, because the managed alternatives are poor value for a scratch pad.',
    route: '#running-stack/developer?detail=middleware',
    routeLabel: 'Platform middleware',
  },
  {
    time: 1372,
    title: 'Letting Azure run the cluster',
    copy: 'AKS Automatic brings a Kubernetes version floor of 1.36 and non-bypassable Safeguards: non-root, dropped capabilities, resource limits, probes.',
    route: '#running-stack/developer?detail=aks',
    routeLabel: 'The AKS boundary',
  },
  {
    time: 1563,
    title: 'One local Helm chart',
    copy: 'Every OSDU service deploys through osdu-spi-service, a chart that bakes Safeguards compliance in at authoring time instead of patching upstream charts.',
    route: '#running-stack/developer?detail=service',
    routeLabel: 'The OSDU service workloads',
  },
  {
    time: 1647,
    title: 'Ordering is the design; the deliberate pause',
    copy: 'Flux applies a strict dependency graph, then the CLI suspends the Git source so a colleague’s merge cannot change the environment under you.',
    route: '#running-stack/developer?detail=flux',
    routeLabel: 'Flux on the map',
  },
  {
    time: 1831,
    title: 'When reconciliation gets stuck',
    copy: 'Retry exhaustion marks a HelmRelease Stalled, and an immutable Job template can end in RollbackFailed. Both are documented traps.',
    route: '#not-true',
    routeLabel: 'Things that are not true',
  },
  {
    time: 2035,
    title: 'Identity is two different jobs: outbound',
    copy: 'A pod exchanges a projected ServiceAccount token for an Azure access token. No usable Azure data-plane key or connection string is stored in the cluster.',
    route: '#field-guides?guide=identity',
    routeLabel: 'Identity field guide',
    note: 'Workload Identity replaces stored keys for Azure data services, not every credential. Redis remains in the platform namespace and authenticates with a middleware password stored in Kubernetes Secrets and mirrored into Key Vault; the partition provider’s common Table Storage read uses Azure identity.',
  },
  {
    time: 2222,
    title: 'The shared-identity trade-off',
    copy: 'Every OSDU pod is the same Azure principal. Operationally simple for a test target; not an architecture for production.',
    route: '#running-stack/developer?detail=shared-data',
    routeLabel: 'Shared resources and identity',
  },
  {
    time: 2346,
    title: 'The async path that does not work',
    copy: 'The community indexer-queue image looks for a Service Bus connection string and finds DISABLED. Records-changed indexing needs a Workload-Identity-capable image.',
    route: '#running-stack/request?detail=events',
    routeLabel: 'Service Bus on the request path',
  },
  {
    time: 2475,
    title: 'Inbound: rewriting identity at the door',
    copy: 'The Azure provider reads caller identity from a header, so the Istio sidecar validates the JWT and projects x-app-id and x-user-id from the token itself.',
    route: '#running-stack/request?detail=gateway',
    routeLabel: 'The gateway and sidecar',
  },
  {
    time: 2661,
    title: 'Making an empty OSDU useful',
    copy: 'A partition record, entitlement groups, and legal tags must exist before a single record can be stored. Bootstrap runs as Flux-managed Jobs, then loads about 1,386 schemas.',
    route: '#bring-up/reconcile?detail=initialization',
    routeLabel: 'Initialization Jobs',
  },
  {
    time: 2863,
    title: 'The image lock',
    copy: 'One generated ConfigMap, osdu-image-lock, records every service image by digest. Flux substitutes it at apply time, so a deploy is a lock edit.',
    route: '#handshake?detail=delivery',
    routeLabel: 'The image-lock handoff',
  },
  {
    time: 2937,
    title: 'One environment, eight forks by design',
    copy: 'The standing shared environment is the test target for the service forks: designed for eight, with partition the first. Its design is mostly about not letting them break each other.',
    route: '#handshake?detail=running',
    routeLabel: 'The shared running environment',
  },
  {
    time: 3040,
    title: 'Pinned versions and ephemeral pins',
    copy: 'The environment tracks a reviewed release tag, never a rolling branch. A fork deploy is a pin that records its owning workflow run; the workflow restores the canonical image if it still owns the pin.',
    route: '#handshake?detail=proof',
    routeLabel: 'Borrow, prove, restore',
  },
  {
    time: 3320,
    title: 'Trusting a repository without trusting its pull requests',
    copy: 'Onboarding creates a federated credential bound to the fork’s protected environment. Trust is an OIDC relationship, not a stored secret.',
    route: '#handshake?detail=trust',
    routeLabel: 'One fork per service',
  },
  {
    time: 3406,
    title: 'What the design is really about',
    copy: 'A deliberate pause for forensic debuggability, identity rewritten at the edge, and infrastructure treated as a version-controlled log so eight teams can share one playground.',
    route: '#not-true',
    routeLabel: 'Things that are not true',
  },
];

const orientationMarkers = [
  {
    time: 0,
    title: 'Shared plumbing: the problem with one repository',
    copy: 'An open-source project pictured as a community garden, then as a building where every tenant shares the plumbing. The image the rest of the conversation argues against.',
    route: '#start',
    routeLabel: 'Start here',
  },
  {
    time: 92.7,
    title: 'A document called Azure SPI, an introduction',
    copy: 'OSDU is built to run on any cloud. The mission is the Azure half of it: what Microsoft took over, and what it had to build to carry that.',
    route: '#start',
    routeLabel: 'Start here',
  },
  {
    time: 175.9,
    title: 'The provider model and the seam',
    copy: 'partition-core beside partition-azure, partition-aws, and partition-gc: one set of rules, several sets of plumbing, and a service provider interface between them.',
    route: '#spi-boundary',
    routeLabel: 'The SPI boundary',
  },
  {
    time: 238.5,
    title: 'Three costs of one shared repository',
    copy: 'A shared dependency waits for the slowest provider’s SDK. Every community change pays for provider lanes it does not use. Two kinds of owner share one permission model.',
    route: '#fork-shape?detail=upstream',
    routeLabel: 'The upstream tree',
  },
  {
    time: 313.1,
    title: 'ADR 61: Venus, CIMPL, Mercury',
    copy: 'The codebase splits into the Venus community line, proved on CIMPL, and the Mercury provider line, which moves to maintenance. Cloud-provider code leaves the community repositories.',
    route: '#start',
    routeLabel: 'Start here',
    note: 'The narration frames the move of cloud-provider code out of the community repositories as an eviction. The community record frames it as a decision the Forum took, with cloud-provider code moving to the providers’ own subprojects, and Microsoft contributed cimpl-stack, the tool CIMPL runs on.',
  },
  {
    time: 384.3,
    title: 'What Microsoft is left holding',
    copy: 'What Microsoft holds is what it maintains, and Azure Data Manager for Energy depends on that code.',
    route: '#fork-shape?detail=provider-azure',
    routeLabel: 'The fork-owned provider',
    note: 'Upstream plans to remove its Azure implementation (community ADR 61; osdu-spi ADR-038). As of September 2026 the directory is still there; the fork is built so that removal deletes nothing on its side whenever it lands.',
    note: '“Proprietary” is the narration’s word. The service forks and both Microsoft projects are public repositories under the Apache 2.0 license. What changed is ownership and responsibility, not visibility.',
  },
  {
    time: 424.3,
    title: 'The fork keeps a relationship with upstream',
    copy: 'A fork that stops tracking upstream is a dead archive. A fork that takes upstream by hand pays a compounding cost. A snapshot fails; a relationship is needed.',
    route: '#fork-day/sync',
    routeLabel: 'The daily sync',
  },
  {
    time: 453.1,
    title: 'Three things called SPI',
    copy: 'The interface is the seam in the code. The engineering system, osdu-spi, syncs and builds. The stack, osdu-spi-stack, is where the code is proved.',
    route: '#start',
    routeLabel: 'The three meanings',
  },
  {
    time: 496.1,
    title: 'Forks by service; ownership runs through the tree',
    copy: 'One directory structure, two owners at the same commit: upstream-owned core and build configuration beside fork-owned provider and tests that synchronization never touches.',
    route: '#fork-shape',
    routeLabel: 'The shape of the fork',
  },
  {
    time: 567.8,
    title: 'Why daily, not monthly',
    copy: 'A monthly sync buries the one interface change that broke the provider under hundreds of others. Daily arrival keeps each break small and findable.',
    route: '#fork-day/sync',
    routeLabel: 'A day in the fork',
  },
  {
    time: 612,
    title: 'Generate; do not merge',
    copy: 'A merge would faithfully carry upstream’s deletion of its Azure directory into the fork. A generated branch that never contained the provider has nothing to delete.',
    route: '#fork-shape?detail=fork-upstream',
    routeLabel: 'The generated branch',
    note: 'The generated branch holds shared code and references to the Azure modules, not the Azure source; the provider joins it on the integration branch. Upstream’s removal of its Azure directories is the planned consequence of ADR 61, and the fork is built for it whether or not that deletion has landed.',
  },
  {
    time: 727.9,
    title: 'The testing knowledge left with the code',
    copy: 'The community pipelines knew how to run the Azure tests. CIMPL runs on RabbitMQ and MinIO, which cannot prove a provider written against Cosmos DB, Service Bus, and Entra ID.',
    route: '#handshake?detail=descriptor',
    routeLabel: 'What a suite needs',
  },
  {
    time: 770.9,
    title: 'From an empty subscription to a running OSDU',
    copy: 'One command turns a subscription into a running platform, most of the time spent on Azure building the cluster.',
    route: '#bring-up/start',
    routeLabel: 'Follow spi up',
    note: '“About fifty minutes” is an observation from earlier smoke runs, dominated by AKS provisioning, not a guarantee. API readiness can follow the CLI exit.',
  },
  {
    time: 797.9,
    title: 'Why not emulators',
    copy: 'Testing the Azure provider against substitutes bypasses the very code the environment exists to prove. The stack is Azure-only by design, not by preference.',
    route: '#running-stack/developer?detail=cosmos',
    routeLabel: 'Real Azure resources',
  },
  {
    time: 859.6,
    title: 'What the stack is not',
    copy: 'Disposable, no backup or disaster recovery, one shared Azure identity across the OSDU services. Not production, and not Azure Data Manager for Energy.',
    route: '#running-stack/developer?detail=identity',
    routeLabel: 'The shared identity',
  },
  {
    time: 912.8,
    title: 'The handshake: borrow, prove, restore',
    copy: 'A fork borrows a service’s slot in a shared stack, runs its candidate against live Azure, and puts the environment back.',
    route: '#handshake',
    routeLabel: 'The handshake',
    note: 'Restoration is conditional: the run writes the canonical image back only while it still owns the pin, and a lost runner can leave a pin for a person to clear. “Regardless of pass, fail, or timeout” describes the intent, not a guarantee.',
  },
  {
    time: 965.7,
    title: 'No environment values in the repository',
    copy: 'The environment publishes facts about itself, the fork declares what its tests need, and the two are joined at the moment of the run. A copied value is stale by construction.',
    route: '#handshake?detail=facts',
    routeLabel: 'What the environment publishes',
  },
  {
    time: 1014.5,
    title: 'Declared state, observed state',
    copy: 'A command finishing and an environment being ready are different events with different clocks. A successful exit is never a readiness check.',
    route: '#bring-up/reconcile',
    routeLabel: 'Assemble OSDU',
    note: '“Five minutes” and “another ten” are illustrations. The documentation records component observations separately and treats CLI exit and API readiness as different events.',
  },
  {
    time: 1074.9,
    title: 'Evidence has a scope',
    copy: 'A skipped lane is also green. A passing summary may have answered a narrower question than the one asked. Ask which question a check answered.',
    route: '#handshake?detail=gate',
    routeLabel: 'The gate',
  },
  {
    time: 1114.4,
    title: 'Halt on the unknown',
    copy: 'A default that is wrong looks exactly like a default that is right. A fallback that cannot be distinguished from success is a blindfold.',
    route: '#fork-shape?detail=filter',
    routeLabel: 'The filter that halts',
  },
  {
    time: 1177.6,
    title: 'A day in the fork, and who is on the hook',
    copy: 'Integration conflicts arrive daily, a change is proved by borrowing a slot in a shared stack, and Microsoft, not the community, owns whether the Azure implementation survives.',
    route: '#fork-day',
    routeLabel: 'A day in the fork',
  },
  {
    time: 1245.6,
    title: 'Closing: branches as a defence of ownership',
    copy: 'The closing thought: the fork’s branches exist to defend an ownership line, not to collaborate, and the engineers are the people who move between the two systems.',
    route: '#not-true',
    routeLabel: 'Things that are not true',
  },
];

const briefMarkers = [
  {
    time: 0,
    title: 'The great codebase split',
    copy: 'The community keeps the shared core; Microsoft owns the Azure-specific code and the work of keeping it current.',
    route: '#start',
    routeLabel: 'Start here',
    note: 'The narration expands SPI as “software provider interfaces”. It is the service provider interface: the code boundary between shared logic and a provider.',
  },
  {
    time: 46.8,
    title: 'A daily sync, and branches that exclude the Azure code',
    copy: 'The forks pull shared code every day into generated branches that never contain the Azure provider, so nobody rescues deleted files by hand.',
    route: '#fork-shape?detail=fork-upstream',
    routeLabel: 'The generated branch',
  },
  {
    time: 74.5,
    title: 'The proving ground',
    copy: 'A successful build does not mean the code works on Azure. A disposable real environment runs borrow, prove, restore, because substitutes bypass the code under test.',
    route: '#handshake',
    routeLabel: 'The handshake',
    note: 'Restore is conditional on the run still owning its pin; a lost runner can leave work for a person.',
  },
];

const branchesMarkers = [
  {
    time: 0,
    title: 'A fallback that looked like success',
    copy: 'A tool that crashed on every run for months, hidden by a fallback that looked exactly like success. The episode’s frame: a system that refuses to wear that blindfold.',
    route: '#not-true',
    routeLabel: 'Things that are not true',
  },
  {
    time: 145,
    title: 'The energy data problem',
    copy: 'Petabytes across incompatible vendor systems that disagree on what a well is, and the community platform built to end that.',
    route: '#start',
    routeLabel: 'Start here',
  },
  {
    time: 331,
    title: 'The provider model and the seam',
    copy: 'partition-core holds the shared rules; provider/partition-azure holds the Azure plumbing. The seam between them is the interface, and it is where the friction lives.',
    route: '#spi-boundary',
    routeLabel: 'The SPI boundary',
  },
  {
    time: 376,
    title: 'Upstream plans to remove the Azure code',
    copy: 'A fork that stops taking upstream changes drifts from the community implementation; a hand-merged fork compounds in cost. The fork must own the provider directory permanently while taking shared code daily.',
    route: '#fork-shape?detail=upstream',
    routeLabel: 'Upstream on the map',
  },
  {
    time: 571,
    title: 'Ownership runs through the middle of the tree',
    copy: 'In one commit, partition-core is upstream’s and must be overwritten daily; the directory beside it is the fork’s and must never be. Standard branching cannot defend that line.',
    route: '#fork-shape',
    routeLabel: 'The repository by owner',
  },
  {
    time: 617,
    title: 'One template for eight services',
    copy: 'The workflows, actions, and rulesets live in osdu-spi. The forks, designed for eight with partition the first, are generated from it; each owns its Azure provider code, tests, and configuration. The rule: split what fails differently.',
    route: '#fork-shape?detail=engineering',
    routeLabel: 'The template on the map',
  },
  {
    time: 807,
    title: 'The bootstrap problem: local-actions',
    copy: 'A fork cannot receive its machinery before it has the machinery to receive it. The bare minimum lives in .github/local-actions from the first commit; the rest arrives by sync.',
    route: '#fork-shape?detail=engineering-files',
    routeLabel: 'Engineering files',
  },
  {
    time: 902,
    title: 'Three branches, and why not two',
    copy: 'With two branches, an upstream break lands in the team’s workspace and blocks everyone. fork_integration is an isolation chamber for that failure.',
    route: '#fork-shape?detail=fork-integration',
    routeLabel: 'The three branches',
  },
  {
    time: 1041,
    title: 'Generate the branch, do not merge into it',
    copy: 'The naive plan: delete the other providers, then merge upstream every day. Git’s modify/delete conflict makes that fail, and fail again every day.',
    route: '#fork-day/sync?detail=sync-pr',
    routeLabel: 'The sync moment',
  },
  {
    time: 1281,
    title: 'fork_upstream as a function of the upstream tip',
    copy: 'fork_upstream is a pure function of the upstream tip and the filter. read-tree into a scratch index, filter, commit-tree with two parents: merge-shaped provenance, no merge algorithm.',
    route: '#fork-shape?detail=fork-upstream',
    routeLabel: 'The generated branch',
  },
  {
    time: 1419,
    title: 'Halt on the unknown',
    copy: 'Generation trades a loud failure for a quiet one, so the filter classifies everything and exits 2 on anything new. Guessing would silently take ownership of the wrong path.',
    route: '#fork-shape?detail=filter',
    routeLabel: 'The filter',
  },
  {
    time: 1559,
    title: 'How GitHub records sync progress',
    copy: 'No file, no database, no hidden branch. The state lives in GitHub: a hidden comment in the tracking issue, a repository variable, and the labels.',
    route: '#fork-day/sync?detail=sync-pr',
    routeLabel: 'The sync PR and issue',
  },
  {
    time: 1746,
    title: 'Labels as a state machine',
    copy: 'cascade-active means in flight. human-required means halted. Removing that label is the retry signal; no slash command, no manual run.',
    route: '#fork-day/review?detail=labels',
    routeLabel: 'The labels on the map',
    note: 'The narration says removing the label fires a webhook. Cascade Monitor notices the removal on its six-hour schedule and dispatches the cascade; a person can also dispatch it by hand.',
  },
  {
    time: 1846,
    title: 'The cascade: main first',
    copy: 'Merge main into the workspace, then fork_upstream on top, so upstream is evaluated against today’s truth. Into the workspace is cheap; into main needs checks and review.',
    route: '#fork-day/cascade?detail=cascade-run',
    routeLabel: 'The cascade moment',
  },
  {
    time: 1985,
    title: 'Versioning without rewriting history',
    copy: 'Squashing would sever the link to upstream. One empty meta commit classifies the whole range: breaking over feat over fix, and anything unclassifiable is a fix.',
    route: '#fork-day/sync?detail=meta-commit',
    routeLabel: 'The meta commit',
  },
  {
    time: 2171,
    title: 'Never a bare -P',
    copy: 'Passing any Maven profile deactivates the ones active by default, so -P azure silently drops core. The template always writes -P core,azure.',
    route: '#fork-day/cascade?detail=cascade-run',
    routeLabel: 'The cascade build',
  },
  {
    time: 2315,
    title: 'Why the template supplies the Dockerfile',
    copy: 'The upstream Azure Dockerfile named a Java 8 base and a JAR that no longer existed. The template now delivers one canonical Dockerfile to every fork.',
    route: '#fork-shape?detail=engineering-files',
    routeLabel: 'Engineering files',
  },
  {
    time: 2413,
    title: 'Credentials: app tokens and the guard clause',
    copy: 'No personal tokens; short-lived GitHub App tokens. Credential-bearing jobs repeat the same if-guard verbatim, because the guard clause, not review, is what enforces the boundary.',
    route: '#fork-day/prove?detail=candidate',
    routeLabel: 'The build and prove moment',
  },
  {
    time: 2553,
    title: 'The pull_request_target lesson',
    copy: 'Running the trusted workflow file against untrusted checked-out code invited that code into a privileged runner. CodeQL flagged it. The fix was structural: the job that publishes excludes pull_request_target, cross-repository PRs, and Dependabot.',
    route: '#handshake?detail=gate',
    routeLabel: 'Deploy Gate',
    note: 'The cascade now runs on workflow_dispatch, started by the monitor or by hand. The narration describes the lesson, not the current trigger.',
  },
  {
    time: 2788,
    title: 'No coverage gate',
    copy: 'Most of the repository is generated from upstream. A coverage threshold would measure the community’s testing habits and break the sync; coverage is reported, not gated.',
    route: '#fork-day/cascade?detail=cascade-run',
    routeLabel: 'The cascade build',
  },
  {
    time: 2932,
    title: 'The tests are in the repository; the knowledge is not',
    copy: 'Upstream kept the endpoints and tokens in its own pipelines; stripping them orphaned the suites. Copied environment values go stale as soon as the environment changes.',
    route: '#handshake?detail=descriptor',
    routeLabel: 'The descriptor',
  },
  {
    time: 3124,
    title: 'Three contracts: facts, descriptor, machinery',
    copy: 'The stack publishes facts fresh every run. The fork declares needs symbolically. The template’s resolver binds them and hard-fails on anything it does not recognise.',
    route: '#handshake?detail=facts',
    routeLabel: 'Environment facts',
  },
  {
    time: 3268,
    title: 'Borrow, prove, restore',
    copy: 'Not kubectl set image, because Flux would revert it. A compare-and-set on the image lock, a wait for the pod to report the digest, the suites, then a restore that writes the canonical image back if this run still owns the pin.',
    route: '#handshake?detail=delivery',
    routeLabel: 'The image lock',
    note: 'The recording calls the restore unconditional. It always runs, but it writes the canonical image back only while this run still owns the pin; a newer run’s pin is left alone.',
  },
  {
    time: 3465,
    title: 'The customer tier and mirror mode',
    copy: 'Customers use true GitHub forks so pull requests can flow back. SYNC_MODE=mirror turns the filter off and copies the service repository’s main with the same plumbing and the same history shape.',
    route: '#fork-shape?detail=mirror',
    routeLabel: 'A customer mirror fork',
  },
  {
    time: 3664,
    title: 'The decision register and the derived learnings',
    copy: 'One is the textbook: what was decided, why, what was rejected. The other is a first-person journal of what the team actually experienced.',
    route: '#not-true',
    routeLabel: 'Things that are not true',
  },
  {
    time: 3759,
    title: 'The fallback that hid a failure for months',
    copy: 'A summariser that never once succeeded, hidden by a fallback that looked like success. “A fallback that cannot be distinguished from success is not resilience. It is a blindfold.”',
    route: '#not-true',
    routeLabel: 'Things that are not true',
  },
  {
    time: 3948,
    title: 'Split what fails differently',
    copy: 'Template workflows from delivered workflows, bootstrap logic by when it must exist, three branches so upstream breakage never blocks feature work.',
    route: '#fork-shape?detail=engineering',
    routeLabel: 'The template on the map',
  },
];

function withEnds(markers, duration) {
  return markers.map((marker, index) => ({
    ...marker,
    end: markers[index + 1]?.time ?? duration,
  }));
}

// Ordered as the site frames them: the short orientation first, because it
// sets the frame the views assume; then the stack alone; then the fork in
// depth.
export const episodes = [
  {
    id: 'orientation',
    title: 'Why Azure OSDU needs service forks',
    short: 'The orientation',
    book: 'The frame · twenty-two minutes',
    file: 'audio/microsofts-architectural-divorce-from-osdu.m4a',
    duration: 1323,
    notebook: null,
    origin:
      'Generated with NotebookLM from the introduction source, Azure SPI: An Introduction, under the title “Microsoft’s architectural divorce from OSDU”. The narration opens with a ninety-second analogy and uses a divorce metaphor the site does not; the marker notes carry the corrections',
    summary:
      'Why the Azure implementation is now Microsoft’s to own, what the service forks and the stack are for, and the six ideas that keep coming back. The argument behind the frame the six views assume.',
    markers: withEnds(orientationMarkers, 1323),
    transcript: orientationTranscript,
  },
  {
    id: 'brief',
    title: 'Rebuilding OSDU for real Azure infrastructure',
    short: 'The brief',
    book: 'The frame · two minutes',
    file: 'audio/rebuilding-osdu-for-real-azure-infrastructure.m4a',
    duration: 112,
    notebook: null,
    origin:
      'Generated with NotebookLM as an audio brief from the introduction source, Azure SPI: An Introduction',
    summary:
      'Why the Azure provider code moved to Microsoft, the daily sync, and the proving ground, in under two minutes. The shortest way to hear the frame.',
    markers: withEnds(briefMarkers, 112),
    transcript: briefTranscript,
  },
  {
    id: 'stack',
    title: 'Engineering the OSDU SPI Stack on Azure',
    short: 'The stack',
    book: 'Lessons 01 to 03',
    deepDive: true,
    owner: 'cli',
    art: 'listen/stack.webp',
    file: 'audio/engineering-the-osdu-spi-stack-on-azure.m4a',
    duration: 3516,
    notebook:
      'https://notebook.google.com/notebook/b54aaf01-b8c2-4d39-98e9-112ed9dc92b7/artifact/5c1f61ff-cf85-4a1b-813d-d80ae3d96a21',
    origin: 'Generated with NotebookLM from the SPI Stack guide',
    summary:
      'Provisioning, Flux, identity, and the shared environment that tests service changes, through to a full bring-up. The one to start with if the stack is your job.',
    markers: withEnds(stackMarkers, 3516),
    transcript: stackTranscript,
  },
  {
    id: 'branches',
    title: 'How the fork receives upstream changes',
    short: 'The fork, in depth',
    book: 'Lessons 04 to 06',
    deepDive: true,
    owner: 'fork',
    art: 'listen/fork.webp',
    file: 'audio/why-azure-3d-prints-git-branches.m4a',
    duration: 4140,
    notebook: null,
    origin:
      'Generated with NotebookLM from the osdu-spi guide, under the title “Why Azure 3D-prints Git branches”',
    summary:
      'How upstream changes enter a fork, how the fork keeps ownership of its provider, and how builds and tests prepare a change for review.',
    markers: withEnds(branchesMarkers, 4140),
    transcript: branchesTranscript,
  },
];

// The one-minute video overview shown on the start page. It is not an episode:
// it has no markers, plays in its own element, and pauses the audio dock.
export const frameVideo = {
  title: 'How Microsoft engineers Azure OSDU',
  card: 'How the machinery is engineered',
  file: 'video/how-microsoft-engineers-azure-osdu.mp4',
  poster: 'video/how-microsoft-engineers-azure-osdu.jpg',
  captions: 'video/how-microsoft-engineers-azure-osdu.vtt',
  duration: 71,
  width: 720,
  height: 1280,
  origin:
    'Generated with NotebookLM as a video overview from the introduction source, Azure SPI: An Introduction',
  summary:
    'Provider ownership moving to Microsoft, the service forks, the candidate image, and a temporary test deployment in a live stack, drawn in one minute.',
  notes: [
    'The narration calls the Azure logic proprietary. The service forks are public repositories under the Apache 2.0 license; what changed is ownership, not visibility.',
    'The narration says the community stripped out all cloud-specific code. Upstream plans that removal (community ADR 61); as of September 2026 the Azure directory is still there.',
    'Restore is conditional: the run puts the environment back only while it still owns its pin, and a lost runner can leave work for a person.',
  ],
};

// The two long recordings are the ones the Audio deep dives page offers. The
// orientation and the brief stay here for cues and their published routes.
export const deepDives = episodes.filter((episode) => episode.deepDive);
export const defaultEpisode = deepDives[0];
export const audio = defaultEpisode;
export const episodeById = (id) =>
  episodes.find((episode) => episode.id === id) || defaultEpisode;
