// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

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
    origin:
      'Built for this site from the osdu-spi deploy lane record (ADR-041) and the osdu-spi-stack fork deployment guide · status reviewed September 2026',
    image: 'posters/borrow-prove-restore.jpg',
    width: 2000,
    height: 1333,
    summary:
      'One credentialed job borrows a service slot in the shared stack, proves the pushed image with every declared suite, and writes the canonical image back. The descriptor, the environment facts, and the resolver meet only at run time.',
    takeaways: [
      'Environment answers are read per run from spi info and spi status --json; the fork holds only the five onboarding values and its descriptor .spi/service.yaml.',
      'The pin is a compare-and-set write on the image lock by digest, and verify waits until a running pod carries the pinned digest.',
      'Pass needs borrow, prove, and restore all green; a suite passes only with at least one non-skipped test and no failures, so zero tests collected is never a pass.',
      'Restore runs even after a failure and changes the pin only while this run still owns it; another run’s pin is left in place.',
    ],
    notes: [
      'The poster follows the running example’s partition service. It does not cover onboarding a fork with spi onboard, the acceptance image build, or the personal-stack path a developer runs by hand with spi token.',
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
      'Built for this site from the osdu-spi-stack environment lifecycle and fork deployment guides · status reviewed September 2026',
    image: 'posters/backing-environment.jpg',
    width: 2000,
    height: 1333,
    summary:
      'One standing stack, pinned to a reviewed release tag, backs every fork’s deploy and test lane. Upgrade and refresh are the built lifecycle; reset, teardown, the pin backstop, and source promotion are drawn in a separate band as unbuilt.',
    takeaways: [
      'The stack definition moves only by a merged stackVersion bump PR, never a rolling branch; merging the bump is what triggers env-upgrade.',
      'Three version axes: the stack release tag, the canonical images recorded in the image lock, and the ephemeral pins a fork run puts under test.',
      'deployable means ready with maintenance unset, a deploy record present, and the members seed complete; a failed upgrade or refresh leaves maintenance set, so forks wait with a reason.',
      'spi down keeps the resource group, its tags, and the managed identities, so every fork’s five values survive a rebuild; only spi down --purge deletes the group.',
    ],
    notes: [
      'The poster does not cover onboarding a fork with spi onboard, the nightly smoke pipeline that proves the provision path, or what a fork’s deploy-test job does once the environment is deployable.',
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
    title: 'Namespaces and rollout order',
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
    title: 'A storage read: identity and authorization checks',
    origin:
      'Built for this site from the identity and gateway guides and ADRs 005, 016, 023, 026',
    image: 'posters/one-request.jpg',
    width: 2000,
    height: 1333,
    summary:
      'A storage record read, followed from the caller’s bearer token to the stored record in Cosmos DB. Three separate checks: who the caller is, what OSDU lets them do, and what Azure lets the pod reach.',
    inline:
      'A different example: this poster follows a storage record read to Cosmos DB. The partition lookup in the running example stops at the tables in common Storage.',
    takeaways: [
      'Caller authentication (the sidecar), OSDU authorization (entitlements), and Azure access (Workload Identity) are three checks; a pass at one proves nothing about the next.',
      'A 401 or 403 alone does not name the boundary. An empty x-app-id points at the sidecar; identity present with 403 points at entitlements.',
      'Cosmos data-plane roles are Cosmos-native, invisible to az role assignment, and propagate in 5 to 15 minutes; clients cache at startup.',
      'Azure data services use Entra authentication: local auth is off on Cosmos and Service Bus, shared key is off on Storage, and the retained key fields say DISABLED.',
    ],
    notes: [
      'This poster follows a storage record read to Cosmos DB. The partition lookup in the running example stops at the common Storage tables and never visits Cosmos.',
      'The stack documentation does not describe the data-partition-id header; it is the OSDU contract, unchanged, so the poster shows only the bearer on the client hop.',
      'The asynchronous indexing path is not part of this read: the community indexer-queue still builds a Service Bus connection string, so records-changed indexing needs a Workload-Identity-capable image.',
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
      'Azure access uses identity, not keys; the middleware still has passwords. One seed Secret feeds every password copy, and the two teardowns stop at different floors.',
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
    appearsIn: { label: 'Anatomy of a stack', href: '#running-stack' },
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
      'Observed component times overlap, so they do not add up to a total. The CLI exits while Flux is still working. Observed durations are from earlier centralus runs; the placement of unmeasured steps is illustrative.',
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
    appearsIn: { label: 'Anatomy of a stack', href: '#running-stack' },
    sources: ['architecture', 'profiles'],
  },
  {
    id: 'labels',
    title: 'The labels are the state machine',
    summary:
      'The labels on a sync tracking issue say where the sync is and what unblocks it. Removing human-required is the retry signal, and the monitor reads the labels every six hours.',
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
