export const chapters = {
  start: {
    kind: 'page',
    page: 'home',
    group: 'start',
    title: 'Start here',
    subtitle: 'What this site is for',
    headline: 'OSDU on Azure,<span>explained by boundary.</span>',
    intro:
      'You already know the OSDU APIs. Follow one request down to the Azure code it reaches, then follow a change to that code back into a running stack. By the end you can say where your request runs, what created the environment it runs in, and where a change to the Azure provider belongs.',
    premise: 'For engineers who know OSDU and are new to SPI.',
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
      { episode: 'interface', time: 1479, label: 'The Azure-only bet' },
    ],
    guides: ['familiar', 'inside-the-cluster', 'profiles'],
    mistakes: {
      developer: 'profiles-save-money',
      request: 'certificate-means-encrypted',
    },
    scope:
      'Development and test only. OSDU services share a managed identity and middleware credentials. This stack provides no backup, disaster recovery, or per-service Azure access isolation.',
    sources: ['architecture', 'identity', 'images'],
    question: 'What did spi up actually give me?',
    builds: 'Starts from what you already know: OSDU APIs and data partitions.',
    where:
      'Wide: the resource group, the Azure resources in it, the cluster, and its namespaces. No service is opened yet.',
    example: {
      title: 'Follow a partition lookup',
      code: 'GET /api/partition/v1/partitions/opendes',
      step: 'request',
      hops: [
        {
          detail: 'client',
          label: 'Client',
          copy: 'Bearer + data-partition-id',
        },
        {
          detail: 'gateway',
          label: 'Istio gateway',
          copy: 'Sidecar identifies the caller',
        },
        {
          detail: 'service',
          label: 'Partition service',
          copy: 'osdu namespace',
        },
        { detail: 'provider', label: 'Its Azure provider', copy: 'Same image' },
        {
          detail: 'shared-data',
          label: 'Stored configuration',
          copy: 'Tables in common Storage',
        },
      ],
      note: 'The answer describes where opendes lives. Other services use it to find their Cosmos, Storage, and Service Bus.',
    },
    outcomes: [
      'A stack is a resource group: AKS plus the Azure data services around it, not the cluster alone.',
      'My partition’s records, blobs, and events each have their own Azure resource; entitlements, identities, and Key Vault are shared by the environment.',
      'The OSDU services run in the osdu namespace, and each one carries its Azure provider inside its own image.',
    ],
  },
  'bring-up': {
    kind: 'map',
    group: 'learn',
    book: 'The stack',
    title: 'How it comes to life',
    subtitle: 'Create, use, and remove',
    headline: 'One creation command.<span>Several kinds of work.</span>',
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
      { episode: 'interface', time: 2392, label: 'Bootstrap as data' },
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
    subtitle: 'Find the code Azure owns',
    headline: 'Shared OSDU behavior.<span>Fork-owned Azure code.</span>',
    intro:
      'Inside each service, a Service Provider Interface connects common behavior to its Azure implementation. Follow the same lookup through the partition service, then watch what the provider does when its cache is down.',
    figure: 'One service, two source owners',
    selected: 'azureimpl',
    diagram: 'spi',
    listen: [
      { episode: 'interface', time: 239, label: 'The provider model' },
      {
        episode: 'branches',
        time: 331,
        label: 'The seam is where the friction lives',
      },
    ],
    guides: ['one-request', 'identity'],
    mistakes: ['token-accepted-means-authorized'],
    scope:
      'ADR-038 anticipates upstream removing its Azure implementations. The fork seeds Azure source once and keeps it outside the generated shared-code branch. The cache fallback is real: commit fc2dfbf in osdu-spi-partition, 30 July 2026, with regression tests.',
    sources: ['ownership', 'concepts', 'engineering'],
    question: 'Where inside a service does OSDU stop and Azure begin?',
    builds:
      'Zooms into the partition service from 01 and follows the same lookup through its provider.',
    where:
      'One service inside the osdu namespace. Everything from the first two views is still around it; only the scale changed.',
    example: {
      title: 'The same lookup, with the cache down',
      code: 'GET /api/partition/v1/partitions/opendes',
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
          copy: 'Asks the cache; it throws',
        },
        {
          detail: 'azureclients',
          label: 'Table Storage',
          copy: 'Answers anyway',
        },
      ],
      note: 'The provider treats a broken cache as a miss and reads the row from common Storage. That fallback is the fix the next three views follow out through the fork and back.',
    },
    outcomes: [
      'Common service code calls a provider interface; the Azure implementation behind it does the Azure work with Workload Identity. For the partition service that is a cache, then a Table Storage read, and the read still happens when the cache throws.',
      'The interface and its implementation ship in one image. There is no network hop between them.',
      'Upstream may delete its Azure implementations; the fork owns provider/<svc>-azure and keeps it outside the generated upstream tree.',
    ],
  },
  'fork-shape': {
    kind: 'map',
    group: 'learn',
    book: 'The fork',
    title: 'The shape of the fork',
    subtitle: 'Who owns which paths',
    headline:
      'Upstream will delete the Azure code.<span>The fork is where it lives.</span>',
    intro:
      'A service fork is a short list of paths the fork owns, beside a tree regenerated from upstream every day. Read the repository by owner: each row is a path, each column is a branch, and the cells say where the path exists.',
    premise:
      'The cache fallback from 03 has to live somewhere upstream cannot delete.',
    figure: 'One repository, read by owner',
    selected: 'provider-azure',
    diagram: 'fork',
    listen: [
      {
        episode: 'interface',
        time: 427,
        label: 'Upstream will delete the Azure provider',
      },
      {
        episode: 'branches',
        time: 1281,
        label: 'From sculpting to 3D printing',
      },
      { episode: 'interface', time: 1331, label: 'The one-time seed' },
    ],
    guides: ['contribution-chain'],
    mistakes: ['fork-is-a-snapshot', 'descriptor-comes-from-template'],
    scope:
      'osdu-spi-partition is the reference fork; the other service forks follow the same filter with their own service name. Customer mirror forks form a second tier and copy the service repository, not upstream. The descriptor row is fork-owned by rule; the partition fork has not written its file yet.',
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
          label: 'The fix',
          copy: 'In the fork-owned directory, with its tests',
        },
        {
          detail: 'engineering-files',
          label: 'Checked',
          copy: 'By the workflows the template delivered',
        },
        {
          detail: 'main-branch',
          label: 'On main',
          copy: 'CodeQL · Validation Summary · approved',
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
    headline: 'Two changes meet.<span>One digest leaves.</span>',
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
      note: 'The release moment is optional and comes after all of this. The digests and PR numbers are illustrative; the fix is real.',
    },
    outcomes: [
      'A sync is a generated tree plus one PR and one tracking issue, never a merge into fork_upstream. The cascade merges main first, then fork_upstream, into the workspace.',
      'The labels on the tracking issue are the state: cascade-active, cascade-blocked, cascade-failed, validated. Removing human-required is how I retry.',
      'The integration PR and the version PR are different PRs. Validation pushes a digest for every eligible commit and dev1 is borrowed for it before any release exists.',
    ],
  },
  handshake: {
    kind: 'map',
    group: 'learn',
    book: 'The seam',
    title: 'The handshake',
    subtitle: 'Borrow, prove, restore',
    headline: 'A lock write<span>is the whole deploy.</span>',
    intro:
      'The fork has a candidate digest and the stack has a running environment. One credentialed run reads what the environment publishes, pins the digest into the image lock as a pin it owns, checks the pod is running it, runs the suites the descriptor declares, and gives the slot back. Watch the lock and the pod change as you step through.',
    premise:
      'The stack publishes facts. The fork declares needs. The lock is the only thing both write.',
    figure: 'One run, one borrowed slot',
    selected: 'delivery',
    diagram: 'seam',
    listen: [
      { episode: 'interface', time: 2926, label: 'Borrow, prove, restore' },
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
      'A shared environment can be borrowed by several onboarded forks, one service slot each, serialised per service. Key Vault binding materialisation, descriptor requirement checks before the borrow, and a second verify before each suite are not wired. osdu-spi-partition has not written its descriptor yet, so its gate skips today; the lane shown is the one the template ships.',
    sources: ['forkDeploy', 'proof', 'descriptorContract', 'statusContract'],
    question:
      'How does that digest reach a running stack, what proves it, and what gives the slot back?',
    builds: 'Uses the candidate digest from 05 and the environment from 01.',
    where:
      'Both maps at once: a GitHub Actions run on the fork side, and dev1’s image lock, pod, and deploy identity on the stack side.',
    example: {
      title: 'Candidate B borrows the partition slot in dev1',
      code: 'ghcr.io/azure/partition@sha256:…',
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
      'The lock write is the whole deploy: Flux reconciles osdu-image-lock and the pod restarts on the pinned digest. Between runs the lock holds the canonical image.',
      'The run only restores what it still owns, so a green restore is a claim about this run, not about the environment.',
      'The stack publishes facts and the fork declares needs in its descriptor. Five repository settings are all that connect them.',
    ],
  },
  'not-true': {
    kind: 'page',
    page: 'myths',
    group: 'learn',
    book: 'Both',
    title: 'Things that are not true',
    subtitle: 'Assumptions the docs contradict',
    headline: 'Plausible assumptions.<span>Documented contradictions.</span>',
    intro:
      'Each of these is a reasonable thing to believe about a Kubernetes-and-Azure system. The project’s own documentation says otherwise, and names how to check. Read them before your first incident, not during it.',
    premise: 'The best evidence of a project’s honesty is what it admits.',
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
    subtitle: 'Three conversations',
    headline: 'Three conversations,<span>one system.</span>',
    intro:
      'Generated audio discussions of the two guides: one on the stack, one on the whole round trip, one on the fork in depth. Play one while you explore; each marker opens the matching view, and the maps carry short cues back into the recordings.',
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
    headline: 'One idea per picture,<span>with a place to explore it.</span>',
    intro:
      'Reference posters supplied with the training material, plus infographics built for this site. Each names the sources it draws on and links to the interactive view that lets you look closer.',
    premise: 'Print one, pin it up, or open it beside the map.',
    scope:
      'Supplied posters are preserved as given. Their captions record where the wording differs from the source documentation, so a poster never becomes the authority.',
    sources: ['architecture', 'lifecycle', 'forkTiers', 'decisions'],
  },
};

export const chapterGroups = [
  { id: 'learn', label: 'Learn', numbered: true },
  { id: 'supplement', label: 'Supplements', numbered: false },
];
