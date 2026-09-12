export const chapters = {
  start: {
    kind: 'page',
    page: 'home',
    group: 'start',
    title: 'Start here',
    subtitle: 'What this site is for',
    headline: 'OSDU on Azure,<span>explained by boundary.</span>',
    intro:
      'You already know the OSDU APIs. SPI stands for Service Provider Interface, and this site uses the word for three related things: the Azure environment the services run in, the interface inside each service, and the engineering system that keeps the Azure code maintainable. By the end you can say where your request runs, what created the environment it runs in, and where a change to the Azure provider belongs.',
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
      'The partition and storage APIs stay familiar. Inside each service, a Service Provider Interface connects common behavior to its Azure implementation. The important change is who maintains that implementation.',
    figure: 'One service, two source owners',
    selected: 'azureimpl',
    diagram: 'spi',
    guides: ['one-request', 'identity'],
    mistakes: ['token-accepted-means-authorized'],
    scope:
      'ADR-038 anticipates upstream removing its Azure implementations. The fork seeds Azure source once and keeps it outside the generated shared-code branch.',
    sources: ['ownership', 'concepts', 'engineering'],
    question: 'Where inside a service does OSDU stop and Azure begin?',
    builds:
      'Zooms into the partition service from 01 and follows the same lookup through its provider.',
    where:
      'One service inside the osdu namespace. Everything from the first two views is still around it; only the scale changed.',
    example: {
      title: 'The same lookup, inside the partition service',
      code: 'GET /api/partition/v1/partitions/opendes',
      hops: [
        { detail: 'client', label: 'OSDU API', copy: 'The contract you know' },
        { detail: 'core', label: 'Common code', copy: 'Validates the request' },
        {
          detail: 'contract',
          label: 'The interface',
          copy: 'getPartition(id)',
        },
        {
          detail: 'azureimpl',
          label: 'Azure implementation',
          copy: 'Cache first',
        },
        {
          detail: 'azureclients',
          label: 'Table Storage',
          copy: 'On a cache miss',
        },
      ],
      note: 'The provider returns stored configuration for opendes. It does not call Cosmos, Storage, or Service Bus; other services use the answer to do that.',
    },
    outcomes: [
      'Common service code calls a provider interface; the Azure implementation behind it does the Azure work with Workload Identity. For the partition service that is a cache, then a Table Storage read.',
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
      'A service fork is not a copy of upstream with patches on top. It is a short list of paths the fork owns, beside a tree that is regenerated from upstream every day. Read the repository by owner: each row is a path, each column is a branch, and the cells say where the path exists.',
    premise:
      'The provider from view 03 has to live somewhere upstream cannot delete.',
    figure: 'One repository, read by owner',
    selected: 'provider-azure',
    diagram: 'fork',
    guides: ['contribution-chain'],
    mistakes: ['fork-is-a-snapshot'],
    scope:
      'osdu-spi-partition is the reference fork; the other service forks follow the same filter with their own service name. The fork keeps a relationship with upstream, not a snapshot. Customer mirror forks form a second tier and copy the service repository, not upstream.',
    sources: ['ownership', 'branches', 'forkTiers', 'workflowSystem'],
    question:
      'Who owns that provider code, and how does it survive upstream deleting it?',
    builds:
      'Uses the fork-owned paths from 03 and the image the stack pulls in 01.',
    where:
      'Outside the stack entirely: the service repository on GitHub, the community upstream it is generated from, and the template that gives it its workflows.',
    example: {
      title: 'A fix to that provider',
      code: 'provider/partition-azure/',
      hops: [
        {
          detail: 'provider-azure',
          label: 'The fix',
          copy: 'In the fork-owned directory',
        },
        {
          detail: 'engineering-files',
          label: 'Checked',
          copy: 'By the workflows the template delivered',
        },
        {
          detail: 'main-branch',
          label: 'Merged to main',
          copy: 'CodeQL · Validation Summary',
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
      note: 'Two changes are now waiting to meet: yours on main, upstream’s on fork_upstream. The next view is the day they do.',
    },
    outcomes: [
      'The fork owns provider/partition-azure, its Azure tests, and its engineering files. Everything else is upstream’s, regenerated daily.',
      'fork_upstream is generated with the Azure paths absent by construction, so an upstream deletion has nothing to delete on the fork side.',
      'A customer mirror fork copies the service repository verbatim; it is a second tier, not a second fork of upstream.',
    ],
  },
  'fork-day': {
    kind: 'map',
    group: 'learn',
    book: 'The fork',
    title: 'A day in the fork',
    subtitle: 'From midnight to a release',
    headline: 'Sync, integrate, wait,<span>release, receive.</span>',
    intro:
      'The branches from view 04, stepped through one day. Upstream is regenerated at midnight, the cascade carries it into the workspace, a person decides, the release tags an image that already exists, and the engineering system arrives the same way upstream does. Labels on the tracking issue are the state at every step.',
    premise: 'Nothing here is a merge you run by hand.',
    figure: 'The branches, in time',
    selected: 'sync-pr',
    diagram: 'forkDay',
    mistakes: {
      sync: 'merge-fork-upstream',
      cascade: 'azure-profile-alone',
      review: 'human-required-is-a-note',
      release: 'release-rebuilds-image',
      template: 'template-sync-overwrites',
    },
    scope:
      'Times are the scheduled triggers in the template workflows, not measurements. A cascade can also be started by hand with the tracking issue number. The mirror tier runs the same day with fork_upstream copied rather than generated.',
    sources: ['synchronization', 'cascade', 'release', 'cascadeMonitor'],
    question:
      'What happens to that fix, and to upstream’s change, between midnight and a release?',
    builds: 'Uses the three branches and the ownership rows from 04.',
    where:
      'The same repository as 04, followed through five moments. The stack does not appear until the last one leaves a tagged digest for 06.',
    example: {
      title: 'The fix meets the upstream change',
      code: 'provider/partition-azure/ + partition-core',
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
          detail: 'release-pr',
          label: 'Release PR',
          copy: 'validated, awaiting a person',
        },
        {
          step: 'release',
          detail: 'release-tag',
          label: 'Tagged',
          copy: 'v1.4.0-upstream-0.29.0',
        },
        {
          step: 'release',
          detail: 'image',
          label: 'One digest',
          copy: 'What 06 borrows a slot for',
        },
      ],
      note: 'The template moment runs the same day but is not part of this change; it is how the workflows that handled it got there.',
    },
    outcomes: [
      'A sync is a generated tree plus one PR and one tracking issue, never a merge into fork_upstream.',
      'The labels on the tracking issue are the state: cascade-active, cascade-blocked, cascade-failed, validated. Removing human-required is how I retry.',
      'The digest that leaves the fork is the one validation already pushed; the release only adds tags to it.',
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
      'The fork has a digest and the stack has a running environment. They meet in one credentialed job: the run reads what the environment publishes, writes the digest into the image lock as a pin it owns, checks the pod is running it, runs the suites the descriptor declares, and gives the slot back. Neither side pushes values into the other.',
    premise:
      'The stack publishes facts. The fork declares needs. The lock is the only thing both write.',
    figure: 'One run, one borrowed slot',
    selected: 'delivery',
    diagram: 'seam',
    guides: ['borrow-prove-restore'],
    mistakes: ['validation-summary-means-deployed'],
    scope:
      'A shared environment can be borrowed by several onboarded forks, one service slot each, serialised per service. Key Vault binding materialisation, descriptor requirement checks before the borrow, and a second verify before each suite are not wired. A skipped deploy lane is not acceptance evidence.',
    sources: ['forkDeploy', 'proof', 'descriptorContract', 'statusContract'],
    question:
      'How does that digest reach a running stack, what proves it, and what gives the slot back?',
    builds: 'Uses the digest from 05 and the environment from 01.',
    where:
      'Both maps at once: a GitHub Actions run on the fork side, and dev1’s image lock, pod, and deploy identity on the stack side.',
    example: {
      title: 'The digest borrows a slot in dev1',
      code: 'ghcr.io/azure/osdu-spi-partition@sha256:…',
      hops: [
        { detail: 'image', label: 'Digest', copy: 'Pushed by validation' },
        { detail: 'gate', label: 'Gate', copy: 'May this run borrow?' },
        {
          detail: 'delivery',
          label: 'Pin',
          copy: 'Written into osdu-image-lock',
        },
        { detail: 'verify', label: 'Verify', copy: 'Pod imageID matches' },
        { detail: 'proof', label: 'Prove', copy: 'Declared suites pass' },
        {
          detail: 'restore',
          label: 'Restore',
          copy: 'Only if still the owner',
        },
      ],
      note: 'Every hop leaves something you can inspect: a gate notice, a lock annotation, a pod imageID, a Surefire report, a reset exit code.',
    },
    outcomes: [
      'The lock write is the whole deploy: Flux reconciles osdu-image-lock and the pod restarts on the pinned digest.',
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
    subtitle: 'The one-hour deep dive',
    headline:
      'Engineering the OSDU SPI Stack<span>on Azure, in 59 minutes.</span>',
    intro:
      'A generated audio discussion of the SPI Stack guide. It moves from the provider problem through identity, GitOps, and the shared environment to a full bring-up. Play it while you explore; each chapter marker opens the matching view.',
    premise: 'Keeps playing while you move around the site.',
    scope:
      'The narration is generated from the guide, not from the repositories. Where it rounds a number or overstates a guarantee, the marker notes say what the source documentation actually claims.',
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
