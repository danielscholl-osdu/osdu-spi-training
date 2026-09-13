export const chapters = {
  start: {
    kind: 'page',
    page: 'home',
    group: 'start',
    title: 'Start here',
    subtitle: 'What this site is for',
    headline: 'Understand the Azure stack<span>behind your OSDU APIs.</span>',
    intro:
      'Follow a partition lookup through the Azure stack, then follow a provider change through its service fork and back into the environment. Each view explains one part of that journey and links to the source documentation.',
    premise: 'For engineers who know OSDU and are new to SPI.',
    listen: [
      {
        episode: 'brief',
        time: 0,
        end: 112,
        label: 'Azure SPI in two minutes',
      },
    ],
    sources: ['architecture', 'engineering', 'designs', 'decisions'],
  },
  'running-stack': {
    kind: 'map',
    group: 'learn',
    book: 'The stack',
    title: 'What is a stack?',
    subtitle: 'Place familiar OSDU concepts',
    headline: 'AKS is one part<span>of the stack.</span>',
    intro:
      'Your OSDU APIs run inside Kubernetes. Their data partitions reach Azure resources outside the cluster. The stack is both sides together, in one resource group, built for development and test. Start by finding the things you already know.',
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
      developer: 'profiles-save-money',
      request: 'certificate-means-encrypted',
    },
    scope:
      'Development and test only. OSDU services share a managed identity and middleware credentials. This stack provides no backup, disaster recovery, or per-service Azure access isolation.',
    sources: ['architecture', 'identity', 'images'],
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
    goal: 'You can point at the map and say which half is the cluster, which half is not, and where opendes lives in both.',
    outcomes: [
      {
        headline: 'The stack is AKS plus Azure data services.',
        text: 'A stack is a resource group: AKS plus the Azure data services around it, not the cluster alone.',
        why: 'Both halves are created by one spi up and named by one --env.',
        focus: ['flux', 'gateway', 'cosmos', 'shared-data'],
        scopes: ['environment', 'aks', 'resources'],
        evidence: 'environment',
        crossing: 'CLI provisions Azure and prepares AKS',
      },
      {
        headline:
          'Partitions own data resources; the environment shares platform resources.',
        text: 'My partition’s records, blobs, and events each have their own Azure resource; entitlements, identities, and Key Vault are shared by the environment.',
        why: 'opendes owns three resources. Everything else in the stack is shared with the next partition.',
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
    headline: 'How spi up<span>builds the environment.</span>',
    intro:
      'Follow the same environment from an empty footprint to OSDU, then remove it. Each moment shows who acts and what changes.',
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
      note: 'Each hop is a different moment. Click one to move the lifecycle to it.',
    },
    outcomes: [
      'The CLI and Bicep create Azure and seed the cluster; Flux assembles the workloads; controllers keep them healthy. Different owners, different clocks.',
      'A successful spi up exit is the first of five milestones, not readiness. spi status --watch is how I follow the rest.',
      'spi down removes compute and data but keeps identities and the resource group, so a rebuild reuses the same names.',
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
      'Builds on the partition lookup from 01 and works at one service inside the osdu namespace: partition in dev1. Inside it, a Service Provider Interface (SPI) connects shared behavior to fork-owned Azure code. Follow the opendes lookup across that seam.',
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
      'ownership',
      'concepts',
      'engineering',
      'identity',
      'partitionProvider',
      'partitionCacheFix',
    ],
    question: 'Where inside a service does OSDU stop and Azure begin?',
    builds:
      'Zooms into the partition service from 01 and follows the same lookup through its provider.',
    where:
      'One service inside the osdu namespace. Everything from the first two views is still around it; only the scale changed.',
    example: {
      title: 'Follow the same lookup through the provider',
      code: 'GET /api/partition/v1/partitions/opendes',
      scopes: ['spi-image', 'spi-provider'],
      crossing: 'One service image, then Azure data access',
      hops: [
        { detail: 'client', label: 'OSDU API', copy: 'The contract you know' },
        {
          detail: 'core',
          label: 'Common code',
          copy: 'Caller check, then the interface',
        },
        {
          detail: 'contract',
          label: 'The interface',
          copy: 'getPartition(id)',
        },
        {
          detail: 'azureimpl',
          label: 'Azure implementation',
          copy: 'Checks the cache, then chooses the fallback',
        },
        {
          detail: 'azureclients',
          label: 'Table Storage',
          copy: 'Returns stored configuration for opendes',
        },
      ],
      defaultVariant: 'normal',
      variants: {
        normal: {
          label: 'Normal',
          crossing: 'Healthy cache miss reaches common Table Storage',
          note: 'Normal shows a healthy cache miss, so hop five is required. Common Table Storage is reachable and contains opendes; a cache hit would stop before it.',
          overrides: {
            azureimpl: {
              copy: 'Healthy cache miss',
              mapStatus: 'Healthy cache miss',
              state: 'normal',
            },
            azureclients: {
              copy: 'Stored configuration for opendes',
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
            azureimpl: {
              copy: 'Cache read throws; treated as a miss',
              mapStatus: 'Cache read throws; treated as a miss',
              state: 'handled-failure',
            },
            azureclients: {
              copy: 'Table Storage answers anyway',
              mapStatus: 'Table Storage answers anyway',
              state: 'fallback',
            },
          },
        },
      },
      providerPath:
        'The provider checks its cache, then Azure Table Storage in common Storage, returning stored configuration. This lookup does not visit the partition’s Cosmos, blob Storage, or Service Bus.',
    },
    goal:
      'With the drawer closed, you can point to where shared code ends and Azure provider code begins, explain why the interface is not a network hop, and say what survives a cache exception.',
    outcomes: [
      {
        headline: 'Common code calls Azure through a provider interface.',
        text: 'Common service code calls a provider interface; the Azure implementation behind it uses Workload Identity for Azure access, checking its cache before common Table Storage for this lookup. The Table Storage read still happens when the cache throws.',
        why: 'partition-core calls IPartitionService.getPartition. provider/partition-azure uses Workload Identity for Azure access, checking cache then common Table Storage on a miss. The Table Storage read still happens when the cache throws.',
        focus: ['core', 'contract', 'azureimpl', 'azureclients'],
        scopes: ['spi-shared', 'spi-provider'],
        evidence: 'azureimpl',
        crossing: 'Shared call to Azure implementation',
      },
      {
        headline: 'The interface and implementation ship in one image.',
        text: 'The provider interface and Azure implementation execute in the same service process and ship in one image, so crossing the Java interface is not a network hop.',
        why: 'IPartitionService and provider/partition-azure execute in the same service process. Crossing that Java interface is not a network hop.',
        focus: ['contract', 'azureimpl', 'image'],
        scopes: ['spi-image'],
        evidence: 'image',
        crossing: 'One process, no network hop',
      },
      {
        headline: 'The fork keeps Azure source outside the generated tree.',
        text: 'The fork owns provider/<svc>-azure outside generated fork_upstream, so upstream deleting its own Azure provider does not delete the fork’s copy.',
        why: 'The engineering system regenerates fork_upstream from upstream while provider/<svc>-azure stays fork-owned on fork_integration and main.',
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
