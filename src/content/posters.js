// Supplied posters are reference artifacts and stay as given; `notes` records
// where their wording differs from the source documentation.
export const suppliedPosters = [
  {
    id: 'contribution-chain',
    title: 'The Contribution Chain',
    origin:
      'Fork tiers for the partition service, supplied with the training material',
    image: 'posters/contribution-chain.jpg',
    width: 2000,
    height: 1467,
    summary:
      'Code flows down from the OSDU community by sync and climbs back up by pull request. Three tiers of one service, and where a given change belongs.',
    takeaways: [
      'Every change has one home tier: make it once there, and syncs carry it everywhere below.',
      'Microsoft works in the filter tier: sync regenerates fork_upstream, cascade merges into fork_integration, a reviewed release PR lands on main.',
      'A customer mirror copies Azure main byte for byte; SYNC_MODE=mirror means the filter never runs.',
      'Change only the fork-owned lanes. Everything else is regenerated every sync, so a local edit becomes a permanent conflict.',
    ],
    notes: [
      'This poster matches the fork-tiers documentation; use it as the map for “where does my change go?”.',
    ],
    explore: [
      { label: 'The SPI boundary', href: '#spi-boundary' },
      {
        label: 'How changes arrive',
        href: '#fork-shape?detail=upstream',
      },
      { label: 'The service fork', href: '#handshake?detail=trust' },
    ],
    sources: ['forkTiers', 'branches', 'ownership'],
  },
  {
    id: 'borrow-prove-restore',
    title: 'Borrow, Prove, Restore',
    origin: 'Deploy and test design, from the osdu-spi documentation',
    image: 'posters/borrow-prove-restore.jpg',
    width: 2000,
    height: 1333,
    summary:
      'CI borrows one service slot in a live stack, proves the pushed image, and puts the canonical image back. Three contracts, one credentialed job, five steps.',
    takeaways: [
      'Answers are discovered per run from spi info and spi status --json; five values live in the fork, everything else is read from the environment.',
      'Gate, borrow, verify, prove, restore: pass needs all of borrow, prove, and restore green, and zero tests collected is never a pass.',
      'The ephemeral pin is owned by the workflow run; reset --if-run restores only while that run still owns it.',
      'The descriptor .spi/service.yaml belongs to the service fork and is reviewed with the code.',
    ],
    notes: [
      'Key Vault binding materialization and pre-borrow checks of descriptor loads, groups, and dependencies are not yet wired into the lane; the resolver accepts those fields without proving the environment meets them.',
      'The three seeding tiers describe the intended declaration layer; a lost runner can still strand a pin, so restoration is an operation to inspect, not a guarantee.',
    ],
    explore: [
      {
        label: 'Borrow, prove, restore on the map',
        href: '#handshake?detail=proof',
      },
      {
        label: 'The image-lock handoff',
        href: '#handshake?detail=delivery',
      },
      { label: 'The service fork', href: '#handshake?detail=trust' },
    ],
    sources: ['forkDeploy', 'proof', 'ephemeralPins'],
  },
  {
    id: 'backing-environment',
    title: 'The Backing Environment',
    origin:
      'Shared environment lifecycle, from the osdu-spi-stack design guides',
    image: 'posters/backing-environment.jpg',
    width: 2000,
    height: 1666,
    summary:
      'One shared environment, pinned to a release tag, backs every fork’s deploy and test gates. Its contract, its three version axes, its fail-closed gates, and its operating rhythm.',
    takeaways: [
      'The stack definition moves only by a reviewed bump PR; never a rolling branch, because one bad merge would stop every fork’s merge gate at once.',
      'Three version axes: the stack release tag, the canonical images, and the ephemeral pins a PR puts under test.',
      'deployable means converged, no maintenance in progress, and a deploy record present; a failed upgrade keeps deploys blocked until probes pass.',
      'The reset boundary: spi down clears cluster and PaaS state and keeps identities and resource-group tags; only --purge deletes the group.',
    ],
    notes: [
      'env-upgrade, env-refresh, and the test-identity ensure step are built. env-reset, env-teardown, the pin backstop, and onboarding-intent reconciliation remain unbuilt, so the Saturday reset cadence describes the target, not a running job.',
      'Explicit canonical source promotion (ADR-033) is unbuilt; today the lock projects only the trusted-repository roster, and every canonical image comes from the community registry.',
    ],
    explore: [
      {
        label: 'The shared stack on the map',
        href: '#handshake?detail=running',
      },
      { label: 'What spi down keeps', href: '#bring-up/remove' },
      { label: 'Ephemeral pins', href: '#handshake?detail=delivery' },
    ],
    sources: ['envLifecycle', 'pinnedEnv', 'resetBoundary', 'deployIdentity'],
  },
  {
    id: 'inside-the-cluster',
    title: 'Namespaces and the order things come up',
    origin:
      'Built for this site from the Flux reconciliation guide and ADRs 006, 007, 014, 019, 025',
    image: 'posters/inside-the-cluster.jpg',
    width: 2000,
    height: 1333,
    summary:
      'The AKS cluster as its namespaces and who writes there, the ladder of layered Kustomizations that brings workloads up in order, and the two switches people confuse.',
    takeaways: [
      'Flux objects live in osdu-flux; workloads live in foundation, platform, and osdu. Read the namespace that owns the failure, not the one that reports it.',
      'Layers gate on Ready, and Ready means workload health, not manifest applied. Follow dependsOn upstream to the first unhealthy Kustomization.',
      'Git fetching is suspended after deploy; reconciliation never stops. Live inputs such as osdu-image-lock still change the cluster.',
      'A RetriesExceeded stall is not cleared by re-applying the same manifest; spi reconcile forces one attempt.',
    ],
    notes: [
      'HelmRelease objects and Helm history stay in osdu-flux even for platform and osdu workloads, so flux get helmreleases -n osdu-flux is the query, not a per-namespace one.',
      'The schema-load Job deadline of 150 minutes and its layer timeout of 155 minutes are ceilings, not expected durations.',
    ],
    explore: [
      { label: 'AKS on the map', href: '#running-stack/developer?detail=aks' },
      { label: 'Flux', href: '#running-stack/developer?detail=flux' },
      { label: 'Assemble OSDU', href: '#bring-up/reconcile' },
    ],
    sources: [
      'flux',
      'namespaces',
      'ordering',
      'suspend',
      'fluxNamespace',
      'inventory',
    ],
  },
  {
    id: 'one-request',
    title: 'One request, end to end',
    origin:
      'Built for this site from the identity and gateway guides and ADRs 005, 016, 023, 026',
    image: 'posters/one-request.jpg',
    width: 2000,
    height: 1333,
    summary:
      'A bearer token traced to a Cosmos DB row in seven hops, crossing two identity seams. Three separate checks, and where each one fails.',
    inline:
      'A different example: this poster follows a storage record read to Cosmos DB. The partition lookup in the running example stops at the tables in common Storage.',
    takeaways: [
      'Caller authentication (the sidecar), OSDU authorization (entitlements), and Azure access (Workload Identity) are three checks; a pass at one proves nothing about the next.',
      'A 401 or 403 alone does not name the boundary. An empty x-app-id points at the sidecar; identity present with 403 points at entitlements.',
      'Cosmos data-plane roles are Cosmos-native, invisible to az role assignment, and propagate in 5 to 15 minutes; clients cache at startup.',
      'Entra is the only data plane: local auth is off on Cosmos and Service Bus, shared key is off on Storage, and the retained key fields say DISABLED.',
    ],
    notes: [
      'This poster follows a storage record read to Cosmos DB. The partition lookup in the running example stops at the common Storage tables and never visits Cosmos.',
      'The stack documentation does not describe the data-partition-id header; it is the OSDU contract, unchanged, so the poster shows only the bearer on the client hop.',
      'The community indexer-queue still builds a Service Bus connection string, so records-changed indexing needs a Workload-Identity-capable image.',
    ],
    explore: [
      {
        label: 'The request path on the map',
        href: '#running-stack/request?detail=gateway',
      },
      { label: 'Inside one service', href: '#spi-boundary' },
      {
        label: 'Cosmos DB on the map',
        href: '#running-stack/developer?detail=cosmos',
      },
    ],
    sources: ['identity', 'gateway', 'jwt', 'entra', 'workloadIdentity'],
  },
  {
    id: 'credentials',
    title: 'Where every credential lives, and what spi down forgets',
    origin:
      'Built for this site from the secret and environment lifecycle guides and ADRs 010, 023, 029, 034',
    image: 'posters/credentials.jpg',
    width: 2000,
    height: 1333,
    summary:
      'Three credential lanes, one persistent seed, and two teardowns with different floors. Azure access has no keys; the middleware still has passwords.',
    takeaways: [
      'One seed Secret in osdu-flux feeds every middleware password copy and the Key Vault mirror; only the seed is reused across deployments.',
      'Deleting a chart Secret rotates nothing: reconciliation does not regenerate it, and the next spi up copies the same seed value back. Deleting the seed is worse.',
      'Ordinary spi down deletes the cluster, PaaS data, and every cluster Secret and ConfigMap; it keeps managed identities, the resource group, and its tags.',
      'spi down --purge inventories external grants first and stops, group intact, on anything it cannot confirm.',
    ],
    notes: [
      'Only the Redis and Elasticsearch values are mirrored into Key Vault; PostgreSQL and Airflow credentials live in cluster Secrets only.',
      'Key Vault is soft-deleted on spi down and recovered by the next spi up, which then rewrites the mirror from a fresh seed.',
    ],
    explore: [
      {
        label: 'Key Vault on the map',
        href: '#running-stack/developer?detail=vault',
      },
      { label: 'Remove the stack', href: '#bring-up/remove' },
      {
        label: 'Managed identities',
        href: '#running-stack/developer?detail=identity',
      },
    ],
    sources: [
      'secrets',
      'envLifecycle',
      'keyVault',
      'entra',
      'resetBoundary',
      'deployIdentity',
    ],
  },
];

// Infographics rendered by src/components/infographics.js.
export const nativeGuides = [
  {
    id: 'familiar',
    title: 'Where the familiar things live',
    summary:
      'Seven OSDU concepts you already use, and the place in the stack each one turns into. Start here before learning anything new.',
    appearsIn: { label: 'What is a stack?', href: '#running-stack' },
    sources: ['architecture', 'identity'],
  },
  {
    id: 'owners',
    title: 'Four owners, four boundaries',
    summary:
      'Knowing which owner you are looking at tells you which tool can change what you see.',
    appearsIn: { label: 'How it comes to life', href: '#bring-up/provision' },
    sources: ['architecture', 'lifecycle'],
  },
  {
    id: 'timeline',
    title: 'One spi up, on the clock',
    summary:
      'Observed component times overlap, so they do not add up to a total. The CLI exits while Flux is still working.',
    appearsIn: { label: 'How it comes to life', href: '#bring-up/reconcile' },
    sources: ['lifecycle', 'schemaLoad'],
  },
  {
    id: 'milestones',
    title: 'Readiness signals and what they prove',
    summary:
      'These rows are separate signals, not deployment steps. The CLI verifies the requested Git artifact revision before exit while Flux overlaps the final CLI work.',
    appearsIn: { label: 'Use the stack', href: '#bring-up/inspect' },
    sources: ['lifecycle'],
  },
  {
    id: 'profiles',
    title: 'Three profiles, one Azure estate',
    summary:
      'Profiles select Kubernetes workloads. Every profile provisions the same cluster and PaaS services.',
    appearsIn: { label: 'What is a stack?', href: '#running-stack' },
    sources: ['architecture', 'profiles'],
  },
  {
    id: 'labels',
    title: 'The labels are the state machine',
    summary:
      'A sync tracking issue moves through four labels; two exits need a person. Removing human-required is the retry signal, and the monitor reads it every six hours.',
    appearsIn: { label: 'A day in the fork', href: '#fork-day/review' },
    sources: ['cascadeMonitor', 'humanRequired'],
  },
  {
    id: 'clocks',
    title: 'The fork’s recurring work, on its own clocks',
    summary:
      'Six scheduled or event-driven workflows keep a service fork current. Only two of them are caused by the moments in the day view.',
    appearsIn: { label: 'A day in the fork', href: '#fork-day/sync' },
    sources: ['workflowSystem', 'synchronization', 'cascadeMonitor'],
  },
  {
    id: 'identity',
    title: 'Identity is two different problems',
    summary:
      'A pod obtaining an Azure token and a service’s sidecar identifying an OSDU caller are separate paths. One succeeding proves nothing about the other.',
    appearsIn: { label: 'The SPI boundary', href: '#spi-boundary' },
    sources: ['identity', 'entra'],
  },
];
