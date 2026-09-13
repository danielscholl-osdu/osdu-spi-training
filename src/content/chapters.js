export const chapters = {
  start: {
    kind: 'page',
    page: 'home',
    group: 'start',
    title: 'Start here',
    subtitle: 'What this site is for',
    headline: 'Understand the Azure stack<span>behind your OSDU APIs.</span>',
    intro:
      'You know the OSDU APIs and data partitions. CIMPL provides the open-source community implementation. This course uses it as a reference while following the Azure provider code, the Azure resources it calls, and the forks and test environment used to maintain it.',
    premise: 'For engineers who know OSDU and are new to SPI.',
    listen: [
      {
        episode: 'brief',
        time: 0,
        end: 112,
        label: 'Azure SPI in two minutes',
      },
    ],
    sources: [
      'cimplArchitecture',
      'communityPartitionProvider',
      'architecture',
      'engineering',
      'designs',
      'decisions',
    ],
  },
  'running-stack': {
    kind: 'map',
    group: 'learn',
    book: 'The stack',
    title: 'What is a stack?',
    subtitle: 'Place familiar OSDU concepts',
    headline: 'AKS is one part<span>of the stack.</span>',
    intro:
      'Your OSDU APIs run inside Kubernetes. CIMPL runs its supporting middleware in Kubernetes too; the Azure implementation reaches Azure data services outside AKS, while Elasticsearch, Redis, and Airflow’s database remain inside the cluster. The stack is both sides together in one resource group, built for development and test. Use opendes, the example data partition, in the dev1 environment.',
    premise: 'You know OSDU. Start with the environment around it.',
    figure: 'Follow the boundaries',
    selected: 'environment',
    diagram: 'overview',
    listen: [
      { episode: 'stack', time: 764, label: 'Four owners, four boundaries' },
      {
        episode: 'orientation',
        time: 770.9,
        end: 912.8,
        label: 'Real Azure, on demand, and what the stack is not',
      },
    ],
    guides: ['familiar', 'inside-the-cluster', 'profiles'],
    mistakes: {
      developer: 'stack-is-only-aks',
      request: 'certificate-means-encrypted',
    },
    scope:
      'Development and test only. OSDU services share a managed identity and middleware credentials. This stack provides no backup, disaster recovery, or per-service Azure access isolation.',
    sources: ['cimplArchitecture', 'architecture', 'identity', 'images'],
    question: 'What is actually running when someone says “the stack”?',
    builds: 'Starts from what you already know: OSDU APIs and data partitions.',
    where:
      'Wide: the resource group, the Azure resources in it, the cluster, and its namespaces. No service is opened yet.',
    example: {
      title: 'Follow a partition lookup',
      code: 'GET /api/partition/v1/partitions/opendes',
      step: 'request',
      scopes: ['aks', 'service-boundary'],
      crossing: 'Authenticated OSDU request',
      hops: [
        {
          detail: 'client',
          label: 'Client',
          copy: 'Bearer + data-partition-id',
        },
        {
          detail: 'gateway',
          label: 'Istio gateway',
          copy: 'Routes to the service',
        },
        {
          detail: 'service',
          label: 'Partition service',
          copy: 'Its sidecar identifies the caller',
        },
        { detail: 'provider', label: 'Its Azure provider', copy: 'Same image' },
        {
          detail: 'shared-data',
          label: 'Stored configuration',
          copy: 'Tables in common Storage',
        },
      ],
      providerPath:
        'The provider checks its cache, then Azure Table Storage in common Storage, returning stored configuration. This lookup does not visit the partition’s Cosmos, blob Storage, or Service Bus.',
      note: 'The answer describes where opendes lives. Other services use it to find their Cosmos, Storage, and Service Bus.',
    },
    goal: 'You can distinguish the AKS cluster from the Azure resources around it and explain which resources opendes owns or shares in dev1.',
    outcomes: [
      {
        headline: 'The stack is AKS plus Azure data services.',
        text: 'A stack is a resource group: AKS plus the Azure data services around it, not the cluster alone.',
        why: 'spi up --env dev1 creates AKS and its Azure resources together.',
        focus: ['flux', 'gateway', 'cosmos', 'shared-data'],
        scopes: ['environment', 'aks', 'resources'],
        evidence: 'environment',
        crossing: 'CLI provisions Azure and prepares AKS',
      },
      {
        headline:
          'Partitions own data resources; the environment shares platform resources.',
        text: 'My partition’s records, blobs, and events each have their own Azure resource; entitlements, identities, and Key Vault are shared by the environment.',
        why: 'An OSDU data partition supplies the configuration and data context that services use. In this stack, opendes owns a Cosmos DB SQL account, Storage account, and Service Bus namespace; common Storage, the entitlements Gremlin database, Key Vault, and the service identity are shared.',
        focus: [
          'cosmos',
          'partition-storage',
          'events',
          'shared-data',
          'identity',
          'vault',
        ],
        scopes: ['resources'],
        evidence: 'shared-data',
        crossing: 'Per partition, or shared',
      },
      {
        headline: 'The Azure provider lives inside each OSDU service.',
        text: 'The OSDU services run in the osdu namespace, and each one carries its Azure provider inside its own image.',
        why: 'There is no separate Azure adapter to find. The provider is in the pod.',
        focus: ['gateway', 'service', 'provider'],
        scopes: ['aks', 'service-boundary'],
        evidence: 'service',
        crossing: 'Authenticated OSDU request',
      },
    ],
  },
  'bring-up': {
    kind: 'map',
    group: 'learn',
    book: 'The stack',
    title: 'How it comes to life',
    subtitle: 'Create, use, and remove',
    headline:
      'spi up creates the environment.<span>Flux continues the rollout.</span>',
    intro:
      'Build on lesson 01’s wide map: follow dev1 from your workstation into the resource group, AKS cluster, and namespaces, then remove it. Each moment shows who acts and what changes.',
    figure: 'Follow the environment',
    selected: 'workstation',
    diagram: 'creation',
    listen: [
      {
        episode: 'stack',
        time: 915,
        label: 'The CLI leaves; Flux keeps working',
      },
      { episode: 'stack', time: 2661, label: 'Making an empty OSDU useful' },
      {
        episode: 'orientation',
        time: 1014.5,
        label: 'Declared state, observed state',
      },
    ],
    guides: {
      provision: ['owners'],
      bootstrap: ['owners'],
      reconcile: ['timeline', 'inside-the-cluster'],
      inspect: ['milestones'],
      remove: ['credentials'],
    },
    mistakes: {
      start: 'profiles-save-money',
      provision: 'profiles-save-money',
      bootstrap: 'delete-secret-rotates',
      reconcile: 'suspended-means-frozen',
      inspect: 'finished-means-ready',
      remove: 'teardown-green-means-deleted',
    },
    scope:
      'Illustrated core profile · dev1 / opendes. Running spi up creates billable resources; spi down deletes compute and data. The ≈45–50 min provisioning observations were from centralus; the CLI defaults to westus3. Times vary, and overlapping phases must not be added.',
    sources: ['install', 'lifecycle', 'flux', 'identity'],
    question: 'How does one command become all of that, and when is it usable?',
    builds:
      'Uses the boundaries from 01: the stack, AKS, and the resources outside it.',
    where:
      'The same wide picture through time: Azure resources, then the cluster, then the namespaces Flux assembles inside it.',
    example: {
      title: 'Before the lookup can answer',
      code: 'spi up --env dev1',
      scopes: ['environment', 'aks', 'resources'],
      crossing: 'Provision dev1, then look up opendes',
      hops: [
        {
          detail: 'aks',
          label: 'AKS',
          step: 'provision',
          copy: 'Created first, in spi-stack-dev1',
        },
        {
          detail: 'shared-data',
          label: 'Common Storage',
          step: 'provision',
          copy: 'Holds the partition table',
        },
        {
          detail: 'bootstrap',
          label: 'Bootstrap inputs',
          step: 'bootstrap',
          copy: 'Namespaces, configuration, identity',
        },
        {
          detail: 'service',
          label: 'Partition service',
          step: 'reconcile',
          copy: 'Flux rolls it out',
        },
        {
          detail: 'caller',
          label: 'An API caller',
          step: 'inspect',
          copy: 'Then the lookup works',
        },
      ],
      note: 'Each hop is a different lifecycle moment. Once the Partition service is running, the opendes lookup checks its cache, falls back to Azure Table Storage in common Storage, and returns stored configuration. It does not visit the partition’s Cosmos DB, blob Storage, or Service Bus.',
    },
    goal: 'You can explain how spi up divides work among the CLI, Flux, and controllers; distinguish CLI exit from API readiness; and say what spi down retains.',
    outcomes: [
      {
        headline:
          'CLI creates; Flux assembles; controllers keep workloads healthy.',
        text: 'The CLI and Bicep create Azure and seed the cluster; Flux assembles the workloads; controllers keep them healthy. Flux and Kubernetes controllers continue after the CLI returns.',
        why: 'spi up drives Bicep and bootstrap while Flux begins reconciling before the CLI exits; Flux and Kubernetes controllers continue after the terminal returns.',
        step: 'provision',
        steps: ['start', 'provision', 'bootstrap', 'reconcile'],
        evidenceStep: 'reconcile',
        focus: ['workstation', 'aks', 'bootstrap', 'flux'],
        scopes: ['environment', 'aks', 'resources'],
        evidence: 'flux',
        crossing: 'CLI provisions Azure and prepares AKS',
      },
      {
        headline: 'CLI success is not API readiness.',
        text: 'A successful spi up does not establish API readiness. I follow workload health and initialization with spi status --watch, then verify the API path I need with an authenticated request.',
        why: 'The requested Git artifact revision is verified before that exit, and Flux overlaps the final CLI stages. Ready Kustomizations and HelmReleases report workload health, Complete initialization Jobs report initialization, and a successful authenticated request proves only the exercised API path. spi status --watch observes the first two; it does not make that request.',
        step: 'inspect',
        steps: ['inspect'],
        evidenceStep: 'inspect',
        focus: ['readiness', 'initialization', 'caller'],
        scopes: ['environment', 'aks'],
        evidence: 'readiness',
        crossing: 'Observe readiness, then exercise an API',
      },
      {
        headline: 'Teardown removes data but preserves identities and names.',
        text: 'spi down removes compute and data but keeps identities and the resource group, so a rebuild reuses the same names.',
        why: 'Ordinary spi down deletes the cluster and application data while retaining managed-identity client IDs and the resource group’s naming tags. A rebuild can reuse those names and IDs, not the deleted application data.',
        step: 'remove',
        steps: ['remove'],
        evidenceStep: 'remove',
        focus: ['retained'],
        scopes: ['environment', 'resources'],
        evidence: 'retained',
        crossing: 'Delete compute and data; retain identity',
      },
    ],
  },
  'spi-boundary': {
    kind: 'map',
    group: 'learn',
    book: 'One service',
    title: 'The SPI boundary',
    subtitle: 'Find where the Azure code sits',
    headline: 'The provider lives<span>inside the service.</span>',
    intro:
      'Builds on the partition lookup from 01 and works at one service inside the osdu namespace: partition in dev1. Inside it, a Service Provider Interface (SPI) connects shared behavior to an implementation. The community partition-core-plus implementation and the fork-owned Azure implementation connect that interface to different dependencies. Follow the opendes lookup across the Azure seam.',
    figure: 'One service, two source owners',
    selected: 'azureimpl',
    diagram: 'spi',
    listen: [
      {
        episode: 'orientation',
        time: 175.9,
        label: 'The provider model and the seam',
      },
      {
        episode: 'branches',
        time: 331,
        label: 'The seam is where the friction lives',
      },
    ],
    guides: ['one-request', 'identity'],
    mistakes: ['token-accepted-means-authorized'],
    scope:
      'Upstream plans to remove its Azure implementations (community ADR 61; osdu-spi ADR-038). As of September 2026 the upstream directory is still there, and the fork keeps its own copy outside the generated shared-code branch so that removal deletes nothing on the fork side whenever it lands. The cache fallback is real: commit fc2dfbf in osdu-spi-partition, 30 July 2026, with regression tests. It reached the fork from upstream on 25 August, before the filter existed; from 04 on, the example follows a fix like it made in the fork today.',
    sources: [
      'architecture',
      'ownership',
      'concepts',
      'engineering',
      'identity',
      'secrets',
      'partitionProvider',
      'partitionRedis',
      'partitionTableStore',
      'partitionCacheFix',
      'communityPartitionInterface',
      'communityPartitionProvider',
      'communityPartitionCache',
      'communityPartitionRepository',
      'communityPartitionPom',
      'cimplArchitecture',
      'cimplPartitionSecrets',
    ],
    question: 'Where does shared code hand the lookup to the Azure provider?',
    builds:
      'Zooms into the partition service from 01 and follows the same lookup through its provider.',
    where:
      'One service inside the osdu namespace. Everything from the first two views is still around it; only the scale changed.',
    example: {
      title: 'Follow the same lookup through the provider',
      code: 'GET /api/partition/v1/partitions/opendes',
      scopes: ['spi-image', 'spi-provider', 'spi-cache', 'spi-tables'],
      crossing:
        'One service image, Redis inside AKS, then Table Storage outside AKS',
      hops: [
        {
          detail: 'client',
          label: 'OSDU API',
          copy: 'The contract you know',
        },
        {
          detail: 'core',
          label: 'Common code',
          copy: 'Caller check, then the interface',
        },
        {
          detail: 'contract',
          label: 'The interface',
          copy: 'getPartition(id), no network hop',
        },
        {
          detail: 'azureimpl',
          label: 'Azure implementation',
          copy: 'Checks the cache, then chooses the fallback',
        },
        {
          detail: 'redis',
          label: 'Redis cache',
          copy: 'Inside AKS, middleware credentials',
        },
        {
          detail: 'azureclients',
          label: 'Table Storage',
          copy: 'Outside AKS, Workload Identity; returns opendes',
        },
      ],
      defaultVariant: 'normal',
      variants: {
        normal: {
          label: 'Normal',
          crossing: 'Healthy cache miss reaches common Table Storage',
          note: 'Normal shows a healthy cache miss, so hop six is required. Common Table Storage is reachable and contains opendes; a cache hit would stop before it.',
          overrides: {
            redis: {
              copy: 'Healthy cache miss, inside AKS',
              mapStatus: 'Healthy cache miss',
              state: 'normal',
            },
            azureclients: {
              copy: 'Stored configuration for opendes, outside AKS',
              mapStatus: 'Table Storage returns opendes',
              state: 'normal',
            },
          },
        },
        'cache-down': {
          label: 'Cache down',
          crossing: 'Cache exception is handled as a miss',
          note: 'Cache down assumes common Table Storage is reachable and contains opendes. It does not promise to swallow Table Storage failures or missing-partition errors.',
          overrides: {
            redis: {
              copy: 'Cache read throws inside AKS; treated as a miss',
              mapStatus: 'Cache read throws; treated as a miss',
              state: 'handled-failure',
            },
            azureclients: {
              copy: 'Table Storage answers anyway, with Workload Identity',
              mapStatus: 'Table Storage answers anyway',
              state: 'fallback',
            },
          },
        },
      },
      providerPath:
        'The provider checks Redis inside AKS with middleware credentials, then reads Azure Table Storage in common Storage outside AKS with Workload Identity, returning stored configuration. This lookup does not visit the partition’s Cosmos, blob Storage, or Service Bus.',
    },
    comparison: {
      title: 'Compare the partition lookup',
      operation: 'GET /api/partition/v1/partitions/opendes',
      intro:
        'Both implementations answer the shared Partition API through IPartitionService.getPartition, but two separately built service images connect that call to different dependencies.',
      community: {
        label: 'Community implementation',
        image: 'Community Partition service image',
        revision: 'Partition 5aa406b9 · CIMPL Stack fe56aa1b',
        hosting: 'Kubernetes in the CIMPL cluster',
        process: {
          label: 'Inside the community service process',
          steps: [
            {
              label: 'Shared Partition API',
              detail: 'Receives the illustrative opendes lookup',
            },
            {
              label: 'IPartitionService.getPartition',
              detail: 'Calls the selected implementation in process',
            },
            {
              label: 'partition-core-plus',
              detail: 'Runs the community implementation',
            },
            {
              label: 'Configured VmCache',
              detail: 'Returns early on a cache hit',
            },
            {
              label: 'OsmPartitionPropertyRepository + PostgreSQL driver',
              detail: 'Reads stored properties after a cache miss',
            },
          ],
        },
        dependencies: [
          {
            when: 'On a cache miss',
            label: 'PostgreSQL',
            detail: 'Separate dependency inside the CIMPL Kubernetes cluster',
          },
        ],
        sources: [
          'communityPartitionInterface',
          'communityPartitionProvider',
          'communityPartitionCache',
          'communityPartitionRepository',
          'communityPartitionPom',
          'cimplArchitecture',
          'cimplPartitionSecrets',
        ],
      },
      azure: {
        label: 'Azure implementation',
        image: 'Azure Partition service image',
        revision: 'osdu-spi-partition 3a5690d · SPI Stack dc2c956',
        hosting: 'Partition service pod in AKS for dev1',
        process: {
          label: 'Inside the Azure service process',
          steps: [
            {
              label: 'Shared Partition API',
              detail: 'Receives the opendes lookup in dev1',
            },
            {
              label: 'IPartitionService.getPartition',
              detail: 'Calls the selected implementation in process',
            },
            {
              label: 'provider/partition-azure',
              detail: 'Runs the fork-owned Azure implementation',
            },
          ],
        },
        dependencies: [
          {
            when: 'First lookup',
            label: 'Redis',
            detail: 'Separate middleware dependency inside AKS',
          },
          {
            when: 'On a miss or handled cache-read exception',
            label: 'Common Table Storage',
            detail: 'Azure PaaS dependency outside AKS',
          },
        ],
        sources: [
          'communityPartitionInterface',
          'partitionProvider',
          'partitionRedis',
          'partitionTableStore',
          'partitionPom',
          'architecture',
        ],
      },
      limitations: [
        'The arrows show lookup and control flow; a cache server does not forward the request to storage, and a cache hit returns early.',
        'The Azure fallback succeeds only when common Table Storage is reachable and opendes exists. This comparison does not assign the same cache-exception behavior to the community implementation.',
        'This lookup returns stored configuration. It does not visit the partition’s Cosmos DB, Blob Storage, or Service Bus.',
        'The community lane uses opendes only to compare the operation; it does not claim a default CIMPL deployment contains that partition, and dev1 names only the Azure environment.',
        'Returned properties can differ. Hosting and registry origin do not identify the implementation, and source snapshots do not prove a deployed image digest or acceptance-test result.',
      ],
    },
    goal: 'Trace the lookup from shared code into the Azure provider, and explain what happens when the cache fails.',
    outcomes: [
      {
        headline: 'Common code calls Azure through a provider interface.',
        text: 'Common service code calls a provider interface. The Azure implementation behind it checks Redis inside AKS with middleware credentials, then reads common Table Storage outside AKS with Workload Identity on a miss. The table read still happens when the cache throws.',
        why: 'partition-core calls IPartitionService.getPartition. partition-core-plus checks its configured VmCache, then reads PostgreSQL on a miss. provider/partition-azure checks Redis inside AKS with middleware credentials, then uses Workload Identity for the common Table Storage read after a miss or handled cache exception.',
        focus: ['core', 'contract', 'azureimpl', 'redis', 'azureclients'],
        scopes: ['spi-shared', 'spi-provider', 'spi-cache', 'spi-tables'],
        evidence: 'azureimpl',
        crossing: 'Shared call to Azure implementation',
      },
      {
        headline: 'The interface and implementation ship in one image.',
        text: 'The interface and its implementation ship in one image. There is no network hop between them.',
        why: 'IPartitionService and provider/partition-azure execute in the same service process. Crossing that Java interface is not a network hop.',
        focus: ['contract', 'azureimpl', 'image'],
        scopes: ['spi-image'],
        evidence: 'image',
        crossing: 'One process, no network hop',
      },
      {
        headline: 'The fork keeps Azure source outside the generated tree.',
        text: 'The fork maintains the Azure provider separately from generated shared code.',
        why: 'Shared code is regenerated from the community repository, while provider/partition-azure stays fork-owned, so removal of upstream’s Azure copy does not delete the fork’s provider.',
        focus: ['upstream', 'azureimpl', 'engineering'],
        scopes: ['spi-provider', 'spi-sources'],
        evidence: 'upstream',
        crossing: 'Generated source beside fork-owned source',
      },
    ],
  },
  'fork-shape': {
    kind: 'map',
    group: 'learn',
    book: 'The fork',
    title: 'The shape of the fork',
    subtitle: 'Who owns which paths',
    headline:
      'Upstream plans to remove the Azure code.<span>The fork is where it lives.</span>',
    intro:
      'A service fork is a short list of paths the fork owns, beside a tree regenerated from upstream every day. Read the repository by owner: each row is a path, each column is a branch, and the cells say where the path exists.',
    premise:
      'The cache fallback from 03 has to live somewhere upstream cannot delete. From here the journey is illustrative: the real fix arrived from upstream before the filter; follow a fix like it made in the fork today.',
    figure: 'One repository, read by owner',
    selected: 'provider-azure',
    diagram: 'fork',
    listen: [
      {
        episode: 'orientation',
        time: 496.1,
        label: 'Ownership runs through the tree',
      },
      {
        episode: 'branches',
        time: 1281,
        label: 'From sculpting to 3D printing',
      },
      {
        episode: 'orientation',
        time: 612,
        label: 'Generate; do not merge',
      },
    ],
    guides: ['contribution-chain'],
    mistakes: ['fork-is-a-snapshot', 'descriptor-comes-from-template'],
    scope:
      'osdu-spi-partition is the reference fork and, as of September 2026, the only one; the system is designed for eight, each following the same filter with its own service name. Customer mirror forks form a second tier and copy the service repository, not upstream. The descriptor row is fork-owned by rule; the partition fork has not written its file yet.',
    sources: ['ownership', 'branches', 'forkTiers', 'workflowSystem'],
    question:
      'Who owns that provider code, and how does it survive upstream deleting it?',
    builds:
      'Uses the fork-owned paths from 03 and the image the stack pulls in 01.',
    where:
      'Outside the stack entirely: the service repository on GitHub, the community upstream it is generated from, and the template that gives it its workflows.',
    example: {
      title: 'The cache fallback fix, at rest',
      code: 'provider/partition-azure/…/PartitionServiceImpl.java',
      hops: [
        {
          detail: 'provider-azure',
          label: 'A fix',
          copy: 'In the fork-owned directory, with its tests (illustrative from here)',
        },
        {
          detail: 'engineering-files',
          label: 'Checked',
          copy: 'By the workflows the template delivered',
        },
        {
          detail: 'main-branch',
          label: 'On main',
          copy: 'CodeQL · Validation Summary · approved (illustrative)',
        },
        {
          detail: 'upstream',
          label: 'Meanwhile, upstream moves',
          copy: 'A change to partition-core',
        },
        {
          detail: 'fork-upstream',
          label: 'Regenerated',
          copy: 'Tonight at 00:00 UTC',
        },
      ],
      note: 'Two changes are now waiting to meet: the fix on main, upstream’s on fork_upstream. The next view is the day they do.',
    },
    outcomes: [
      'The fork owns provider/partition-azure, its Azure tests, its descriptor, and the engineering files the template delivers. Everything else is upstream’s, regenerated daily.',
      'The fork has three branches with three jobs: fork_upstream is generated input, fork_integration is the workspace, main is the protected result. Upstream is outside all three.',
      'fork_upstream is generated with the Azure paths absent by construction, so an upstream deletion has nothing to delete on the fork side.',
    ],
  },
  'fork-day': {
    kind: 'map',
    group: 'learn',
    book: 'The fork',
    title: 'A day in the fork',
    subtitle: 'Generate, integrate, propose, prove, release',
    headline: 'From an upstream update<span>to a candidate image.</span>',
    intro:
      'The three branches from 04, followed through one change. Upstream is regenerated at midnight, the cascade carries it into the workspace, a person approves, every eligible commit gets a digest and a turn in dev1, and a release is an optional tag on an image that already exists.',
    premise: 'Nothing here is a merge you run by hand.',
    figure: 'The branches, in time',
    selected: 'sync-pr',
    diagram: 'forkDay',
    guides: { sync: ['clocks'], review: ['labels'] },
    listen: [
      { episode: 'branches', time: 1746, label: 'Labels as a state machine' },
      { episode: 'branches', time: 1846, label: 'The cascade: main first' },
      { episode: 'branches', time: 1985, label: 'The meta commit' },
      {
        episode: 'orientation',
        time: 567.8,
        label: 'Why daily, not monthly',
      },
    ],
    mistakes: {
      sync: 'merge-fork-upstream',
      cascade: 'azure-profile-alone',
      review: 'human-required-is-a-note',
      prove: 'acceptance-needs-a-release',
      release: 'release-rebuilds-image',
    },
    scope:
      'Times are the scheduled triggers in the template workflows, not measurements. Template sync, the monitor, and Settings Apply run on their own clocks and are drawn below the map, not as steps. The mirror tier runs the same day with fork_upstream copied rather than generated.',
    sources: ['synchronization', 'cascade', 'release', 'cascadeMonitor'],
    question:
      'What happens to the fix, and to upstream’s change, between midnight and a digest?',
    builds: 'Uses the three branches and the ownership rows from 04.',
    where:
      'The same repository as 04, followed through five moments. dev1 appears at the fourth, when a candidate digest borrows it.',
    example: {
      title: 'The fix meets the upstream change',
      code: 'provider/partition-azure + partition-core',
      hops: [
        {
          step: 'sync',
          detail: 'sync-pr',
          label: 'Sync PR',
          copy: 'Upstream’s change, generated',
        },
        {
          step: 'cascade',
          detail: 'cascade-run',
          label: 'Cascade',
          copy: 'Both compile together',
        },
        {
          step: 'review',
          detail: 'integration-pr',
          label: 'Integration PR',
          copy: 'A person approves',
        },
        {
          step: 'prove',
          detail: 'candidate',
          label: 'Candidate digest',
          copy: 'Pushed by Validation',
        },
        {
          step: 'prove',
          detail: 'dev1-slot',
          label: 'A turn in dev1',
          copy: 'What 06 follows',
        },
      ],
      note: 'The cache fix and its unit tests are real. From here the example follows an illustrative acceptance run using the newer template; the reference partition fork has not adopted that lane or written its descriptor yet. The release moment is optional and comes after all of this.',
    },
    outcomes: [
      'A sync is a generated tree plus one PR and one tracking issue; upstream is never merged in as text, and the generated commit lands through a reviewed sync PR. The cascade merges main first, then fork_upstream, into the workspace.',
      'The labels on the tracking issue are the state: cascade-active, cascade-blocked, cascade-failed, validated. A blocked cascade is run again after the fix on fork_integration; removing human-required is how a failed one retries.',
      'The integration PR and the version PR are different PRs. Validation runs on PRs and on pushes to main and fork_integration, pushes a digest for every eligible commit, and dev1 is borrowed for it before any release exists.',
    ],
  },
  handshake: {
    kind: 'map',
    group: 'learn',
    book: 'The seam',
    title: 'The handshake',
    subtitle: 'Borrow, prove, restore',
    headline: 'Write the lock.<span>Flux rolls out the image.</span>',
    intro:
      'The fork has a candidate digest and the stack has a running environment. One credentialed workflow run reads the configuration the environment reports, records its run ID and the candidate digest in osdu-image-lock, checks that the pod is running that digest, runs the suites the descriptor declares, and gives the slot back. Watch the lock and the pod change as you step through. The run is illustrative: it uses the lane the newer template ships, which the reference partition fork has not adopted yet.',
    premise:
      'The stack reports its configuration. The service descriptor lists the test suites and their inputs. The lock is the only thing both write.',
    figure: 'One run, one borrowed slot',
    selected: 'delivery',
    diagram: 'seam',
    listen: [
      {
        episode: 'orientation',
        time: 912.8,
        label: 'Borrow, prove, restore',
      },
      {
        episode: 'branches',
        time: 3124,
        label: 'Facts, descriptor, machinery',
      },
      { episode: 'stack', time: 3040, label: 'Ephemeral pins' },
    ],
    guides: ['borrow-prove-restore'],
    mistakes: ['validation-summary-means-deployed', 'restore-always-restores'],
    scope:
      'A shared environment can be borrowed by several onboarded forks, one service slot each, serialised per service. The workflow does not yet load test inputs from Key Vault, check every descriptor requirement before borrowing, or verify the pod again before each suite. The lane shown is the one the template ships since 10 September; osdu-spi-partition has neither adopted it nor written its descriptor yet, so this run is illustrative until it does.',
    sources: ['forkDeploy', 'proof', 'descriptorContract', 'statusContract'],
    question:
      'How does that digest reach a running stack, what proves it, and what gives the slot back?',
    builds: 'Uses the candidate digest from 05 and the environment from 01.',
    where:
      'Both maps at once: a GitHub Actions run on the fork side, and dev1’s image lock, pod, and deploy identity on the stack side.',
    example: {
      title: 'Candidate B borrows the partition slot in dev1',
      code: 'ghcr.io/azure/osdu-spi-partition@sha256:…',
      hops: [
        { detail: 'image', label: 'Candidate B', copy: 'Pushed by Validation' },
        { detail: 'gate', label: 'Gate', copy: 'May this run borrow?' },
        {
          detail: 'delivery',
          label: 'Pin',
          copy: 'Lock: A → B, owned by this run',
        },
        { detail: 'verify', label: 'Verify', copy: 'Pod imageID is B' },
        { detail: 'proof', label: 'Prove', copy: 'Declared suites, reports' },
        {
          detail: 'restore',
          label: 'Restore',
          copy: 'Lock: B → A, if still the owner',
        },
      ],
      note: 'Every hop leaves something you can inspect: a gate notice, a lock annotation, a pod imageID, a Surefire report, a reset exit code. The fallback itself was proved by unit tests in the build; the suites here prove the API on the pinned pod.',
    },
    outcomes: [
      'Writing the lock starts the deploy: Flux reconciles osdu-image-lock and the pod restarts on the pinned digest, and the run checks the pod before trusting any test result. Between runs the lock holds the canonical image.',
      'The run only restores what it still owns, so a green restore is a claim about this run, not about the environment.',
      'The stack publishes facts and the fork declares needs in its descriptor. Five repository settings, plus trust onboarding on the stack side, are all that connect them.',
    ],
  },
  'not-true': {
    kind: 'page',
    page: 'myths',
    group: 'learn',
    book: 'Across the path',
    title: 'Things that are not true',
    subtitle: 'Assumptions the docs contradict',
    headline: 'Common assumptions<span>that cause trouble.</span>',
    intro:
      'Each of these is a reasonable thing to believe about a Kubernetes-and-Azure system. The project’s own documentation says otherwise, and names how to check.',
    premise:
      'Each entry names the document that contradicts it and a command to check.',
    scope:
      'Every entry links the design guide or decision record that contradicts it. If you find one that has become true, the fix belongs in the owning repository.',
    sources: ['lifecycle', 'flux', 'gateway', 'secrets', 'smoke', 'entra'],
    question: 'Which reasonable assumptions will cost me an afternoon?',
    builds:
      'Each contradiction points back to the view where the concept was built.',
    where:
      'Every level, from the resource group to the source repositories. Each check names the view where its concept was built, and each would have cost time somewhere between spi up and a working partition lookup.',
    outcomes: [
      'When something looks wrong, I know which owner to ask and which command shows its view of the world.',
      'Provisioning, convergence, readiness, and proof are different signals, and I check the one I actually need.',
    ],
  },
  listen: {
    kind: 'page',
    page: 'listen',
    group: 'supplement',
    title: 'Listen',
    subtitle: 'Four recordings',
    headline:
      'Listen to the introduction<span>or a technical discussion.</span>',
    intro:
      'Generated recordings. The orientation spends twenty-two minutes on why Azure SPI exists; the brief covers the same ground in two. The stack episode and the fork episode go deep on their halves. Play one while you explore: each marker opens the matching view, and the maps carry short cues back into the recordings.',
    premise: 'Keeps playing while you move around the site.',
    scope:
      'The narration is generated from the guides, not from the repositories. Where it rounds a number, mishears a command, or overstates a guarantee, the marker notes say what the source documentation actually claims.',
    sources: ['architecture', 'lifecycle', 'identity', 'flux'],
  },
  'field-guides': {
    kind: 'page',
    page: 'guides',
    group: 'supplement',
    title: 'Field guides',
    subtitle: 'Posters and infographics',
    headline: 'Architecture and<span>troubleshooting reference.</span>',
    intro:
      'Infographics built for this site from the source documentation, then the reference posters supplied with the training material. Each names its sources and links to the interactive view that lets you look closer. The index below groups them by what you are trying to do.',
    premise: 'Print one, pin it up, or open it beside the map.',
    scope:
      'Supplied posters are preserved as given, misspellings included. Their captions record where the wording differs from the source documentation, so a poster never becomes the authority; the built guides are the corrected teaching surface.',
    sources: ['architecture', 'lifecycle', 'forkTiers', 'decisions'],
  },
};

export const chapterGroups = [
  { id: 'learn', label: 'Learn', numbered: true },
  { id: 'supplement', label: 'Supplements', numbered: false },
];
