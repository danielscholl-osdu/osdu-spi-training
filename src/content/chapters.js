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
  'engineering-system': {
    kind: 'map',
    group: 'learn',
    title: 'How changes arrive',
    subtitle: 'Follow a change to its owner',
    headline: 'Provider code belongs<span>in its service fork.</span>',
    intro:
      'Shared automation comes from osdu-spi. Runtime infrastructure and configuration come from osdu-spi-stack. A service fork builds an image that a running stack can test.',
    figure: 'Source → image → environment',
    selected: 'repo',
    diagram: 'engineering',
    guides: ['contribution-chain', 'borrow-prove-restore'],
    mistakes: ['smoke-proves-api'],
    scope:
      'One service fork per service; customer mirror forks form a further tier. Eligible onboarded runs can deploy-test. A skipped deploy gate is not live acceptance evidence.',
    sources: ['forkDeploy', 'proof', 'branches', 'forkTiers'],
    question:
      'Where does a change to that Azure code go, and how does it reach a running stack?',
    builds:
      'Uses the fork-owned paths from 03 and the shared environment from 01.',
    where:
      'Outside the running stack: the service fork, the shared engineering system, and the stack repository that runs the environment.',
    example: {
      title: 'A fix to that provider',
      code: 'provider/partition-azure/',
      hops: [
        { detail: 'repo', label: 'Service fork', copy: 'osdu-spi-partition' },
        { detail: 'image', label: 'GHCR digest', copy: 'Built and published' },
        {
          detail: 'delivery',
          label: 'osdu-image-lock',
          copy: 'Pinned into dev1',
        },
        {
          detail: 'running',
          label: 'Running pod',
          copy: 'Flux reconciles the lock',
        },
        {
          detail: 'proof',
          label: 'Acceptance result',
          copy: 'Prove, then restore',
        },
      ],
      note: 'Every hop leaves something you can inspect.',
    },
    outcomes: [
      'Three repositories, three jobs: a service fork owns provider code, osdu-spi supplies the workflows, osdu-spi-stack runs the environment.',
      'A candidate travels fork → GHCR digest → osdu-image-lock → running pod, and every hop leaves something I can inspect.',
      'A deploy lane borrows a shared environment, proves the digest, and restores the pin only while it still owns it.',
    ],
  },
  'not-true': {
    kind: 'page',
    page: 'myths',
    group: 'learn',
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
