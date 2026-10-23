// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * @typedef {object} TryItAction
 * @property {string|{posix: string, powershell: string}} [command] Shared or shell-specific inert text; mutually exclusive with click.
 * @property {string} [click] One browser action; mutually exclusive with command.
 * @property {string} expect The observation that confirms the action's result.
 * @property {string[]} [sources] Keys from the shared source registry.
 *
 * @typedef {object} TryItVariant
 * @property {string} label
 * @property {string} result
 * @property {'browser only'|'workstation setup'|'public GitHub repository'|'Azure resources billed separately'} access
 * @property {string} [accessNote]
 * @property {{ text: string, sources: string[] }[]} prerequisites
 * @property {{ active: string, wait: string, cleanup: string }} time
 * @property {string} effects Resource changes shown before the steps.
 * @property {TryItAction[]} steps
 * @property {{ observation: string, next: string }} alternate
 * @property {{ steps: TryItAction[], remains: string }} cleanup
 * @property {string[]} sources
 * @property {{ cli: string, stack: string, template: string, shell: string, os: string, date: string }} tested
 *
 * @typedef {object} TryIt
 * @property {string} activity
 * @property {string} summary The one-line collapsed label.
 * @property {TryItVariant[]} variants
 * @property {{ text: string, sources: string[] }} [connection] Optional note for using an existing environment.
 */

export const chapters = {
  start: {
    kind: 'page',
    page: 'home',
    group: 'start',
    title: 'Start here',
    subtitle: 'What this site is for',
    headline: 'Understanding the Azure SPI machinery',
    subhead:
      'The stack, the provider inside each service, and the engineering that keeps them current.',
    intro:
      '<p>The Azure stack runs OSDU services alongside the resources they depend on. Inside each service, shared OSDU code calls an Azure provider through the Service Provider Interface (SPI).</p><p>Service forks maintain that Azure provider code while keeping the shared code current with upstream OSDU. The engineering workflows bring in those updates, build service images, and test changes against a running Azure stack.</p><p>The lessons use the open-source OSDU <a href="https://community.opengroup.org/osdu/platform/deployment-and-operations/cimpl-stack" target="_blank" rel="noopener noreferrer">Community Implementation (CIMPL)</a> as the reference when explaining what the Azure implementation does differently.</p>',
    hero: {
      image: 'start/machinery.webp',
      width: 656,
      height: 372,
      alt: 'Three meshing gears joined by a loop arrow: the Azure stack, the provider interface inside a service, and the fork workflows.',
    },
    index: [
      {
        label: 'Level 100 · Foundations',
        lessons: {
          'running-stack': 'What runs in the stack?',
          'spi-boundary': 'Where does the Azure code live in a service?',
          'the-line': 'How does a change reach a running service?',
          'two-kinds-of-work': 'Who does what, and which path is mine?',
        },
      },
      {
        label: 'The stack',
        lessons: {
          'bring-up': 'How is the stack created and made usable?',
        },
      },
      {
        label: 'Provider code and engineering',
        lessons: {
          'fork-shape': 'Who owns which paths in a service fork?',
          'fork-day': 'How does an upstream update become a candidate image?',
          handshake: 'How is a candidate image tested in a running stack?',
        },
      },
      {
        label: 'Across the path',
        lessons: {
          'not-true': 'Which common assumptions cause problems?',
        },
      },
      {
        label: 'Working the stack',
        lessons: {
          'whose-image': 'Whose image is running',
          'who-is-asking': 'Who is asking',
          'ready-not-loaded': 'Ready is not loaded',
          'core-dags': 'On behalf of you',
          'prove-from-desk': 'Prove it from your desk',
        },
      },
    ],
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
    deeper: [
      {
        source: 'architecture',
        kicker: 'Azure/osdu-spi-stack',
        title: 'Stack architecture',
        note: 'Azure resources, the spi CLI, and Flux.',
        owner: 'cli',
      },
      {
        source: 'designs',
        kicker: 'Azure/osdu-spi-stack',
        title: 'Design guides',
        note: 'How the stack is built and operated.',
        owner: 'cli',
      },
      {
        source: 'decisions',
        kicker: 'Azure/osdu-spi-stack',
        title: 'Decision register',
        note: 'Architecture decisions and their trade-offs.',
        owner: 'cli',
      },
      {
        source: 'engineering',
        kicker: 'Azure/osdu-spi',
        title: 'Engineering-system architecture',
        note: 'Service-fork branches, synchronization, and validation.',
        owner: 'you',
      },
      {
        source: 'cimplArchitecture',
        kicker: 'OSDU community',
        title: 'CIMPL Stack architecture',
        note: 'The community implementation used for comparison.',
        owner: 'fork',
      },
      {
        source: 'communityPartitionProvider',
        kicker: 'OSDU community',
        title: 'Community partition provider',
        note: 'The community implementation of the partition service.',
        owner: 'fork',
      },
    ],
  },
  'running-stack': {
    kind: 'map',
    group: 'learn',
    book: 'Foundations',
    title: 'Anatomy of a stack',
    subtitle: 'Place familiar OSDU concepts',
    subhead: 'AKS is one part of the stack.',
    intro:
      "<p>The stack is one development and test environment in an Azure resource group. OSDU services run in AKS; Azure data services sit alongside it.</p><p>Some resources belong to a partition such as opendes, while others are shared. CIMPL runs supporting middleware in Kubernetes. Azure SPI uses Azure data services alongside AKS, while Elasticsearch, Redis, and Airflow's database remain in the cluster.</p>",
    premise: 'You know OSDU. Start with the environment around it.',
    figure: 'The deployed stack',
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
    tryIt: {
      activity: 'prepare your workstation',
      summary: 'Try it: prepare your workstation · no Azure sign-in',
      outcome:
        'Prepare the command-line tools you’ll use in lesson 02, without signing in to Azure.',
      badge: 'workstation',
      variants: [
        {
          label: 'Install the CLI and check the tools',
          result:
            'Install the SPI CLI and check that its five prerequisite tools are available. You won’t need to sign in to Azure.',
          access: 'workstation setup',
          accessNote:
            'You need permission to install tools on your workstation, but no Azure subscription or GitHub account.',
          prerequisites: [
            {
              kind: 'tool',
              label: 'uv',
              text: 'Installs and runs the CLI.',
              sources: ['install'],
            },
            {
              kind: 'tool',
              label: 'curl and grep',
              shell: 'posix',
              text: 'Fetch the latest release and pick its wheel.',
              sources: ['installShells'],
            },
            {
              kind: 'tool',
              label: 'Invoke-RestMethod',
              shell: 'powershell',
              text: 'Built into PowerShell; fetches the latest release.',
              sources: ['installShells'],
            },
            {
              kind: 'tool',
              label: 'az, bicep, kubectl, kubelogin, flux',
              text: 'Install any that are missing after spi check reports them.',
              sources: ['install'],
            },
            {
              kind: 'lesson',
              chapter: 'bring-up',
              label: 'Continuing to lesson 02?',
              text: 'Install the latest release and keep it installed. Lesson 02 deploys with the CLI you install here.',
              sources: ['install'],
            },
          ],
          time: {
            active:
              'About 10 minutes when uv and the tools are already present; longer if you install them.',
            wait: 'No automated waiting.',
            cleanup:
              'No cleanup needed to continue to lesson 02. Optional uninstall takes under a minute.',
            minutes: { active: 10, wait: 0, cleanup: 1 },
          },
          footprint: [
            {
              place: 'workstation',
              state: 'changes',
              note: 'spi installed on PATH through uv, plus any tools you add.',
            },
            {
              place: 'github',
              state: 'reads',
              note: 'The installer downloads the latest release; nothing is written.',
            },
            {
              place: 'azure',
              state: 'untouched',
              note: 'No sign-in. spi check reads Azure permissions only when az is signed in, and changes nothing.',
            },
          ],
          effects:
            'Installs spi locally through uv and makes it available on PATH. Any prerequisite tools you install also stay on your workstation. Nothing is created or changed in Azure or GitHub; without an Azure sign-in, spi check reads only tool versions.',
          steps: [
            {
              command: {
                posix:
                  'uv tool install --default-index https://packagefeedproxy.microsoft.io/pypi/simple/ \\\n  "$(curl -fsSL https://api.github.com/repos/Azure/osdu-spi-stack/releases/latest \\\n  | grep -o \'https://github.com/Azure/osdu-spi-stack/releases/download/[^"]*-py3-none-any.whl\')"\nspi --version',
                powershell:
                  "$wheel = (Invoke-RestMethod https://api.github.com/repos/Azure/osdu-spi-stack/releases/latest).assets.Where({ $_.name -like '*-py3-none-any.whl' }).browser_download_url\nuv tool install --default-index https://packagefeedproxy.microsoft.io/pypi/simple/ $wheel\nspi --version",
              },
              touch: {
                kind: 'local',
                note: 'installs spi on this workstation',
              },
              expect:
                'Check the version printed by spi --version. The installer above takes the latest release; note the version it reports, because lesson 02 deploys with this same CLI.',
              sources: ['installShells'],
            },
            {
              command: 'spi check',
              touch: { kind: 'reads', note: 'reads tool versions' },
              expect:
                'Check that az, bicep, kubectl, kubelogin, and flux each show OK and a version, followed by “All 5 tools available.” Below them, the Azure permissions row reads SKIPPED because you have not signed in; lesson 02 runs the same check after az login. If a tool is missing, install it and rerun spi check. This confirms the tools are available, not that you have access to an Azure subscription.',
            },
            {
              command: 'spi up --help',
              touch: { kind: 'reads', note: 'prints help; deploys nothing' },
              expect:
                'Run this help command; it does not deploy anything. Find --env for the environment name, --profile for the workloads, and --location for the region. Lesson 02 uses these options to create an environment.',
            },
          ],
          alternate: {
            observation:
              'A row in the spi check table shows a status other than OK.',
            next: 'Install the missing tool with your package manager, then rerun spi check. Bicep can be provided through the Azure CLI; it does not need a separate bicep executable on PATH.',
          },
          cleanup: {
            steps: [
              {
                command: 'uv tool uninstall spi',
                touch: {
                  kind: 'removes',
                  note: 'removes spi from this workstation',
                },
                expect:
                  'Optional: run this only if you no longer want the CLI installed. It removes spi and its entry on PATH. Keep the CLI installed if you are continuing to lesson 02.',
              },
            ],
            remains:
              'Uninstalling spi leaves uv and any prerequisite tools you installed in place. Nothing was created in Azure or GitHub.',
          },
          sources: ['install'],
          tested: {
            cli: 'spi 0.16.0, already installed on the test machine; the install command is quoted from the install guide and was not re-run',
            stack: 'osdu-spi-stack dc2c956 (release 0.16.0)',
            template: 'Not applicable: no fork is used in this activity.',
            shell: 'zsh',
            os: 'macOS 26.6.2 on Apple silicon',
            date: '2026-09-13',
          },
        },
      ],
    },
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
      title: 'a partition lookup',
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
          copy: 'Its sidecar identifies the caller; its provider reads',
        },
        {
          detail: 'shared-data',
          label: 'Stored configuration',
          copy: 'Tables in common Storage',
        },
      ],
      providerPath:
        'The provider checks its cache, then Azure Table Storage in common Storage, returning stored configuration. This lookup does not visit the partition’s Cosmos, blob Storage, or Service Bus.',
      note: 'The map uses opendes as its example partition. The answer describes where opendes lives. Other services use it to find their Cosmos, Storage, and Service Bus.',
    },
    goal: 'You can distinguish the AKS cluster from the Azure resources around it and explain which resources opendes owns or shares in the environment.',
    outcomes: [
      {
        headline: 'The stack is AKS plus Azure data services.',
        text: 'A stack is a resource group: AKS plus the Azure data services around it, not the cluster alone.',
        why: 'spi up --env <name> creates AKS and its Azure resources together.',
        focus: [],
        scopes: ['environment', 'aks', 'resources'],
        evidence: 'environment',
        crossing: 'CLI provisions Azure and prepares AKS',
      },
      {
        headline: 'Partition resources and shared resources.',
        text: 'My partition’s records, blobs, and events each have their own Azure resource; entitlements, identities, and Key Vault are shared by the environment.',
        why: 'In this stack, opendes owns a Cosmos DB SQL account, Storage account, and Service Bus namespace; common Storage, the entitlements Gremlin database, Key Vault, and the service identity are shared.',
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
        headline: 'The OSDU services run in one namespace behind one gateway.',
        text: 'The OSDU services run in the osdu namespace, one image each, and every request reaches them through the Istio gateway.',
        why: 'Each service is a Deployment in the osdu namespace; the spi-gateway Gateway in platform routes the API paths to them.',
        focus: ['gateway', 'service'],
        scopes: ['aks', 'service-boundary'],
        evidence: 'service',
        crossing: 'Authenticated OSDU request',
      },
    ],
  },
  'spi-boundary': {
    kind: 'map',
    group: 'learn',
    book: 'Foundations',
    title: 'The SPI boundary',
    subtitle: 'Find where the Azure code sits',
    subhead: 'The provider lives inside the service.',
    intro:
      '<p>Builds on the partition lookup from 102 and works at one service inside the osdu namespace: partition in your environment.</p><p>Inside it, a Service Provider Interface (SPI) connects shared behavior to an implementation. The community partition-core-plus implementation and the fork-owned Azure implementation connect that interface to different dependencies. Follow the opendes lookup across the Azure seam.</p>',
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
    tryIt: {
      activity: 'trace the partition lookup',
      summary: 'Try it: trace the partition lookup · browser only',
      outcome:
        'Trace the partition lookup from the provider’s cache to its Table Storage fallback.',
      badge: 'code-magnifier',
      variants: [
        {
          label: 'Follow the lookup in the source',
          result:
            'Follow a partition lookup through the Azure provider’s cache and Table Storage fallback. Then see how the shared service code and Azure provider are packaged into one image.',
          access: 'browser only',
          accessNote:
            'Read the source on GitHub without creating an environment. Only the optional final command needs access to a running stack.',
          prerequisites: [
            {
              kind: 'browser',
              label: 'A browser',
              text: 'For the source steps.',
              sources: ['partitionProvider'],
            },
            {
              kind: 'lesson',
              chapter: 'bring-up',
              label: 'Optional: a stack from lesson 02',
              text: 'With kubectl connected through spi connect, for the image check only.',
              sources: ['lifecycle'],
            },
          ],
          time: {
            active: 'About 15 minutes.',
            wait: 'No automated waiting.',
            cleanup: 'Under a minute.',
            minutes: { active: 15, wait: 0, cleanup: 1 },
          },
          footprint: [
            {
              place: 'workstation',
              state: 'untouched',
              note: 'Nothing installed; the optional kubectl step uses a connection you already have.',
            },
            {
              place: 'github',
              state: 'reads',
              note: 'The reference fork’s source on its main branch, in the browser.',
            },
            {
              place: 'azure',
              state: 'reads',
              note: 'Optional: one field of one Deployment, through kubectl.',
            },
          ],
          effects:
            'Nothing is created or changed. The steps read the reference fork’s main branch; the optional kubectl step reads one field of one Deployment.',
          steps: [
            {
              click: 'Open PartitionServiceImpl and find getPartition.',
              touch: { kind: 'reads', note: 'reads the fork’s source' },
              expect:
                'The provider checks its cache first with safeGet. If the result is null, tableStore.getPartition reads stored configuration from Azure Table Storage in common Storage. The provider wraps the result in PartitionInfo and caches it with safePut; an empty result returns 404. This lookup does not visit the partition’s Cosmos DB, blob Storage, or Service Bus.',
              sources: ['partitionProvider'],
            },
            {
              click:
                'Scroll to the private safeGet method near the end of the same file.',
              touch: { kind: 'reads', note: 'reads the fork’s source' },
              expect:
                'A failed cache read does not stop the lookup. In safeGet, the catch block logs a warning and returns null, so getPartition falls back to Table Storage just as it would for a cache miss.',
              sources: ['partitionProvider', 'partitionCacheFix'],
            },
            {
              click:
                'Open the provider POM and find partition-core, then spring-boot-maven-plugin.',
              touch: { kind: 'reads', note: 'reads the fork’s source' },
              expect:
                'The Azure module depends on partition-core, the shared service code, at the same project version. The spring-boot-maven-plugin repackage goal bundles both into one executable JAR, with PartitionApplication as its entry point.',
              sources: ['partitionPom'],
            },
            {
              click: 'Open build/Dockerfile.',
              touch: { kind: 'reads', note: 'reads the fork’s source' },
              expect:
                'The image receives the already-built JAR through COPY ${JAR_FILE} /app.jar. Maven does not run here. The OpenJDK 17 base runs that JAR, which contains both the shared code and the Azure provider.',
              sources: ['partitionDockerfile'],
            },
            {
              command:
                "kubectl get deployment partition -n osdu -o jsonpath='{.spec.template.spec.containers[0].image}'",
              touch: {
                kind: 'reads',
                note: 'optional; reads one Deployment field',
              },
              expect:
                'Optional: read the image reference configured in the partition Deployment’s pod template. This shows the intended image, not whether every running pod has adopted it or whether it was built from the fork source you just read. Lesson 06 explains how a candidate image is pinned into an environment.',
              sources: ['partitionRelease', 'images'],
            },
          ],
          alternate: {
            observation:
              'You cannot find the named method, or the file no longer matches the description.',
            next: 'The main branch changes as upstream and template updates arrive. Search the file for getPartition and safeGet; if they moved, the file’s history on GitHub shows the change that moved them.',
          },
          cleanup: {
            steps: [
              {
                click: 'Close the tabs.',
                touch: { kind: 'reads', note: 'nothing to remove' },
                expect:
                  'Nothing to remove; the optional kubectl step read one field.',
              },
            ],
            remains: 'Nothing was created.',
          },
          sources: [
            'partitionProvider',
            'partitionPom',
            'partitionDockerfile',
            'partitionRelease',
            'images',
          ],
          tested: {
            cli: 'Not applicable for the browser steps; the optional kubectl step was written against a spi 0.16.0 stack layout and not run.',
            stack:
              'osdu-spi-stack dc2c956 (release 0.16.0) for the Deployment name and namespace',
            template:
              'Not applicable: reads the reference fork’s source at osdu-spi-partition 3a5690d; no fork is created.',
            shell: 'zsh, for the optional kubectl step',
            os: 'macOS 26.6.2 on Apple silicon',
            date: '2026-09-13',
          },
        },
      ],
    },
    mistakes: [],
    scope:
      'Upstream does not carry the Azure provider (community ADR 61; osdu-spi ADR-038); it is source in each service’s fork. The provider treats a cache read that throws as a miss, and that fallback is real: commit fc2dfbf in osdu-spi-partition, with regression tests. From 04 on, the example follows a fix like it made in the fork today.',
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
    question: 'Where does the Azure code live in a service?',
    builds:
      'Zooms into the partition service from 102 and follows the same lookup through its provider.',
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
          note: 'This trace shows a healthy cache miss, so hop six is required. Common Table Storage is reachable and contains opendes; a cache hit would stop before it.',
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
        origin: 'Community Partition repository · CIMPL Stack',
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
        origin: 'Azure/osdu-spi-partition · Azure/osdu-spi-stack',
        hosting: 'Partition service pod in AKS for your environment',
        process: {
          label: 'Inside the Azure service process',
          steps: [
            {
              label: 'Shared Partition API',
              detail: 'Receives the opendes lookup in your environment',
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
        'The community lane uses opendes only to compare the operation; it does not claim a default CIMPL deployment contains that partition, and only the Azure lane runs in your environment.',
        'Returned properties can differ. Hosting and registry origin do not identify the implementation, and source snapshots do not prove a deployed image digest or acceptance-test result.',
      ],
    },
    goal: 'Say where the Azure code lives in a service: behind a provider interface, in the same image as the shared code that calls it, and as source in the service’s fork.',
    outcomes: [
      {
        headline: 'Common code calls Azure through a provider interface.',
        text: 'Common service code calls a provider interface, and the Azure implementation behind it connects that interface to Azure services.',
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
        headline: 'The Azure code lives in the service’s fork.',
        text: 'The Azure implementation is source in the service’s fork, in its own provider folder beside the shared code.',
        why: 'The fork’s source tree holds partition-core/, the shared code, and provider/partition-azure/, the Azure implementation. The next page, 104, shows who owns which of those paths.',
        focus: ['upstream', 'azureimpl', 'engineering'],
        scopes: ['spi-provider', 'spi-sources'],
        evidence: 'upstream',
        crossing: 'Azure source in the service’s fork',
      },
    ],
  },
  'the-line': {
    kind: 'map',
    group: 'learn',
    book: 'Foundations',
    title: 'The line',
    subtitle: 'Follow a change to a running service',
    subhead:
      'A change reaches a running service through six stations, the same in every fork.',
    intro:
      '<p>A service fork owns a few of its paths. One template gives every fork its workflows, and sync brings in the community’s code every day.</p><p>Builds on the partition service from 103 and follows one upstream change to a running stack. This view works where the code comes from: the partition fork on GitHub, its workflows, and the stack its images run in.</p>',
    figure: 'One fork, six stations, one stack',
    selected: 'line-own',
    diagram: 'theLine',
    listen: [],
    guides: ['contribution-chain'],
    tryIt: {
      activity: 'read the partition fork’s line',
      summary: 'Try it: read the partition fork’s line · browser only',
      outcome:
        'Find the fork’s own paths, the time sync runs, the lane in a run on main, and the release step that tags an existing image.',
      badge: 'code-magnifier',
      variants: [
        {
          label: 'Read the line on GitHub',
          result:
            'Read one fork’s three owners, its sync schedule, a validation run on main with the lane in it, and the release job that adds a version tag to an image already built.',
          access: 'browser only',
          accessNote:
            'Read the public fork on GitHub without creating an environment.',
          prerequisites: [
            {
              kind: 'browser',
              label: 'A browser',
              text: 'For every step.',
              sources: ['partitionRepo'],
            },
          ],
          time: {
            active: 'About 10 minutes.',
            wait: 'No automated waiting.',
            cleanup: 'Under a minute.',
            minutes: { active: 10, wait: 0, cleanup: 1 },
          },
          footprint: [
            {
              place: 'workstation',
              state: 'untouched',
              note: 'Nothing installed.',
            },
            {
              place: 'github',
              state: 'reads',
              note: 'The partition fork’s files and workflow runs, in the browser.',
            },
            {
              place: 'azure',
              state: 'untouched',
              note: 'No environment is read or changed.',
            },
          ],
          effects:
            'Nothing is created or changed. Every step reads the public partition fork on GitHub.',
          steps: [
            {
              click:
                'Open the fork’s CONTRIBUTING.md and find Where a change belongs.',
              touch: { kind: 'reads', note: 'reads the fork’s main branch' },
              expect:
                'A table names three owners. The fork owns provider/*-azure/, testing/*-test-azure/, .spi/, and a few files that describe it; the template owns the rest of .github/, build/, and .release-please-config.json; everything else is the community’s shared code.',
              sources: ['partitionContributing'],
            },
            {
              click: 'Open .github/workflows/sync.yml and find its schedule.',
              touch: { kind: 'reads', note: 'reads one workflow file' },
              expect:
                "The schedule is cron: '0 0 * * *', daily at midnight UTC. The template supplies this file, so every fork carries the same schedule.",
              sources: ['partitionSyncWorkflow', 'synchronization'],
            },
            {
              click:
                'Open the Actions tab, choose the Validation workflow, and open its newest run from a push to main.',
              touch: { kind: 'reads', note: 'reads one workflow run' },
              expect:
                'The run’s jobs include Java Build, Docker Push, Deploy Gate, and Deploy and Test. Docker Push publishes the commit’s image; Deploy and Test is the lane, where that image takes its turn in a running stack.',
              sources: ['partitionValidateWorkflow', 'proof'],
            },
            {
              click:
                'Open .github/workflows/release.yml and find the Tag Release Image job.',
              touch: { kind: 'reads', note: 'reads one workflow file' },
              expect:
                'Its step waits for the release commit’s image, then adds the version tag with docker buildx imagetools create. The comment above it reads “Registry-side retag: add :<version> to the release commit’s image. No rebuild.”',
              sources: ['partitionReleaseWorkflow', 'release'],
            },
          ],
          alternate: {
            observation:
              'The run you opened skipped Deploy and Test, or a file no longer matches the description.',
            next: 'The run’s summary gives the reason Deploy and Test skipped; open an earlier run from a merged pull request. Files on main change as template updates arrive; search the file for the job or key the step names.',
          },
          cleanup: {
            steps: [
              {
                click: 'Close the tabs.',
                touch: { kind: 'reads', note: 'nothing to remove' },
                expect: 'Nothing to remove; every step only read.',
              },
            ],
            remains: 'Nothing was created.',
          },
          sources: [
            'partitionContributing',
            'partitionSyncWorkflow',
            'partitionValidateWorkflow',
            'partitionReleaseWorkflow',
          ],
          tested: {
            cli: 'Not applicable: browser steps only; the same files, runs, and job names were read with gh 2.102.0.',
            stack: 'Not applicable: no environment is read.',
            template:
              'Not applicable: reads the reference fork at osdu-spi-partition 8aa26ca0; no fork is created.',
            shell: 'Not applicable: no commands.',
            os: 'macOS 27.0.1 on Apple silicon',
            date: '2026-10-23',
          },
        },
      ],
    },
    mistakes: [],
    scope:
      'Read at level 100: one fork’s own paths, its workflows, and the six stations every fork shares. Lesson 04 reads the fork by its branches, lesson 05 follows its day, and lesson 06 opens the lane. This map is illustrative, executes nothing, and reports no live state.',
    sources: [
      'partitionContributing',
      'forkLifecycle',
      'engineering',
      'workflowSystem',
      'templateSync',
      'ownership',
      'synchronization',
      'cascade',
      'branches',
      'validation',
      'proof',
      'release',
      'images',
    ],
    question: 'How does a change reach a running service?',
    builds:
      'Builds on the partition service from 103 and follows one upstream change to a running stack.',
    where:
      'Where the code comes from: the partition fork on GitHub, its workflows, and the stack its images run in.',
    example: {
      title: 'Follow one upstream change along the line',
      code: 'Azure/osdu-spi-partition',
      scopes: ['line-stations', 'line-lane'],
      crossing: 'Upstream → Sync → Cascade → the lane → Main → Release',
      hops: [
        {
          detail: 'line-upstream',
          label: 'Upstream',
          copy: 'A change lands',
        },
        {
          detail: 'line-sync',
          label: 'Sync',
          copy: 'Proposed at 00:00 UTC',
        },
        {
          detail: 'line-cascade',
          label: 'Cascade',
          copy: 'Built with the Azure provider',
        },
        {
          detail: 'line-lane',
          label: 'The lane',
          copy: 'Its image takes a turn',
        },
        {
          detail: 'line-main',
          label: 'Main',
          copy: 'Main’s image takes its turn',
        },
        {
          detail: 'line-release',
          label: 'Release',
          copy: 'Tags an existing image',
        },
      ],
      note: 'The stations are the same in every fork; the change is one example. Main’s image is the one a stack runs by default. This site executes nothing and reports no live state.',
    },
    goal: 'Say how a change reaches a running service: the few paths a fork owns, the six stations every fork shares, and why a release only tags an image that is already there.',
    outcomes: [
      {
        headline: 'A fork owns only a few of its paths.',
        text: 'A service fork owns its Azure provider, its Azure tests, and the files that describe it; its workflows come from the template, and the community’s code is regenerated from upstream every day.',
        why: 'Partition’s CONTRIBUTING.md names three owners: the fork’s own paths, the template’s .github/, build/, and release configuration, and the community’s shared code. Template sync overwrites the template’s files and sync regenerates the community’s, so a change to either belongs in the template or upstream.',
        focus: ['line-own', 'line-template', 'line-community'],
        scopes: ['line-fork'],
        evidence: 'line-own',
        crossing: 'Three owners in one fork',
      },
      {
        headline: 'Every fork has the same six stations.',
        text: 'A change reaches a running service through upstream, sync, cascade, main, and release, with the lane beside them, and every fork has the same six because every fork comes from one template.',
        why: 'Every fork is created from the Azure/osdu-spi template and runs the same workflows. Not every change visits every station: a fork’s own change joins at main.',
        focus: [
          'line-template',
          'line-upstream',
          'line-sync',
          'line-cascade',
          'line-main',
          'line-release',
          'line-lane',
        ],
        scopes: ['line-stations', 'line-lane'],
        evidence: 'line-template',
        crossing: 'One template, six stations',
      },
      {
        headline: 'Every eligible commit is proved before any release.',
        text: 'Every eligible commit gets an image and a turn in a running stack before any release exists, so a release only tags an image that is already there.',
        why: 'The lane runs on the fork’s own pull requests and on pushes to the integration workspace and to main. A release waits for the release commit’s image, then adds its version tag without rebuilding; that image takes its own turn in the lane just after.',
        focus: ['line-image', 'line-lane', 'line-stack', 'line-release'],
        scopes: ['line-lane'],
        evidence: 'line-lane',
        crossing: 'Image → the lane → a version tag',
      },
    ],
  },
  'two-kinds-of-work': {
    kind: 'map',
    group: 'learn',
    book: 'Foundations',
    title: 'Two kinds of work',
    subtitle: 'Find who approves and your path',
    subhead:
      'The line carries the product, a person approves what reaches main, and your work picks your path.',
    intro:
      '<p>Automation opens much of the work on the line, and a person makes each call that moves a change into main or into a release.</p><p>Builds on the line from 104 and looks at who acts on it. This view works where the code comes from: the template, the stack, and the partition fork on GitHub.</p>',
    figure: 'The line, the product, and where a person acts',
    selected: 'kinds-template',
    diagram: 'twoKinds',
    listen: [],
    guides: ['contribution-chain'],
    tryIt: {
      activity: 'find the person on a pull request',
      summary: 'Try it: find the person on a pull request · browser only',
      outcome:
        'Find who opened, reviewed, approved, and merged the pull requests on one fork’s line.',
      badge: 'code-magnifier',
      variants: [
        {
          label: 'Read the pull requests on GitHub',
          result:
            'Read what merging into main needs, then find the person on a cascade, a sync, and a release pull request.',
          access: 'browser only',
          accessNote:
            'Read the public fork on GitHub without creating an environment.',
          prerequisites: [
            {
              kind: 'browser',
              label: 'A browser',
              text: 'For every step.',
              sources: ['partitionRepo'],
            },
          ],
          time: {
            active: 'About 10 minutes.',
            wait: 'No automated waiting.',
            cleanup: 'Under a minute.',
            minutes: { active: 10, wait: 0, cleanup: 1 },
          },
          footprint: [
            {
              place: 'workstation',
              state: 'untouched',
              note: 'Nothing installed.',
            },
            {
              place: 'github',
              state: 'reads',
              note: 'The partition fork’s files and closed pull requests, in the browser.',
            },
            {
              place: 'azure',
              state: 'untouched',
              note: 'No environment is read or changed.',
            },
          ],
          effects:
            'Nothing is created or changed. Every step reads the public partition fork on GitHub.',
          steps: [
            {
              click:
                'Open the fork’s CONTRIBUTING.md and find step 4 of Making a change.',
              touch: { kind: 'reads', note: 'reads the fork’s main branch' },
              expect:
                'Merging into main needs passing CodeQL and validation checks, every review thread resolved, and a code owner’s approval.',
              sources: ['partitionContributing'],
            },
            {
              click: 'Open .github/CODEOWNERS.',
              touch: { kind: 'reads', note: 'reads one file' },
              expect:
                'The file sorts the tree into the same three areas as CONTRIBUTING.md, and every area names the code owners whose review main requires.',
              sources: ['partitionCodeowners', 'forkLifecycle'],
            },
            {
              click:
                'In Pull requests, search the closed ones for “Upstream Integration to Main” and open the newest.',
              touch: { kind: 'reads', note: 'reads one pull request' },
              expect:
                'The automation app opened it. Copilot’s review arrives as comments, and a person’s approval comes before the merge. The Checks tab lists CodeQL and Validation Summary among its checks.',
              sources: ['cascade', 'engineering'],
            },
            {
              click:
                'Search the closed pull requests for “Sync with upstream” and open the newest.',
              touch: { kind: 'reads', note: 'reads one pull request' },
              expect:
                'The automation app opened it and a person merged it. It targets the fork’s copy of upstream, not main, so cascade opens a second pull request into main.',
              sources: ['synchronization'],
            },
            {
              click:
                'Search the closed pull requests for “chore: release” and open the newest.',
              touch: { kind: 'reads', note: 'reads one pull request' },
              expect:
                'The automation app opened it with the next version and its changelog, and a person merged it. That merge started the release workflow, which tagged an image already built.',
              sources: ['release'],
            },
          ],
          alternate: {
            observation:
              'A search finds no closed pull request, or a title no longer matches.',
            next: 'Sync, template, and release pull requests are updated in place while they wait, so the newest may still be open; open the newest closed one. If a title changed, filter the pull requests by the automation app as author.',
          },
          cleanup: {
            steps: [
              {
                click: 'Close the tabs.',
                touch: { kind: 'reads', note: 'nothing to remove' },
                expect: 'Nothing to remove; every step only read.',
              },
            ],
            remains: 'Nothing was created.',
          },
          sources: [
            'partitionContributing',
            'partitionCodeowners',
            'synchronization',
            'cascade',
            'release',
          ],
          tested: {
            cli: 'Not applicable: browser steps only; the same files, reviews, and merges were read with gh 2.102.0.',
            stack: 'Not applicable: no environment is read.',
            template:
              'Not applicable: reads the reference fork at osdu-spi-partition 8aa26ca0; no fork is created.',
            shell: 'Not applicable: no commands.',
            os: 'macOS 27.0.1 on Apple silicon',
            date: '2026-10-23',
          },
        },
      ],
    },
    mistakes: [],
    scope:
      'Read at level 100: who opens the work on the line, where a person approves it, and which path a kind of work takes. Lesson 05 follows the fork’s day with the issues and checks a person reads. This map is illustrative, executes nothing, and reports no live state.',
    sources: [
      'engineering',
      'workflowSystem',
      'templateSync',
      'pinnedEnv',
      'partitionContributing',
      'partitionCodeowners',
      'partitionProvider',
      'forkLifecycle',
      'synchronization',
      'cascade',
      'release',
    ],
    question: 'Who does what, and which path is mine?',
    builds: 'Builds on the line from 104 and looks at who acts on it.',
    where:
      'Where the code comes from: the template, the stack, and the partition fork on GitHub.',
    example: {
      title: 'Find the person on one upstream change',
      code: 'Azure/osdu-spi-partition',
      scopes: ['kinds-person'],
      crossing: 'Sync → Main → Release',
      hops: [
        {
          detail: 'kinds-sync-merge',
          label: 'Sync',
          copy: 'A person merges it',
        },
        {
          detail: 'kinds-main-approval',
          label: 'Main',
          copy: 'A code owner approves',
        },
        {
          detail: 'kinds-release-call',
          label: 'Release',
          copy: 'A person decides it’s ready',
        },
      ],
      note: 'Automation opened each pull request; a person made each call. The gates are the same in every fork. This site executes nothing and reports no live state.',
    },
    goal: 'Say what the line carries and what the product is, where a person approves a change, and which path your own work takes.',
    outcomes: [
      {
        headline: 'The line carries the product.',
        text: 'The line is the template and its workflows, the shared stack, and the automation that runs them; the product is each service’s code, its Azure provider, its tests, and what the service promises its callers.',
        why: 'Every fork is created from one template and runs its workflows, and every fork’s new images take their turn in the shared stack. A service’s Azure provider and Azure tests change in its own fork and its shared code changes upstream; the line changes in the template’s and the stack’s repositories.',
        focus: [
          'kinds-template',
          'kinds-stack',
          'kinds-automation',
          'kinds-service',
          'kinds-provider',
        ],
        scopes: ['kinds-line', 'kinds-product'],
        evidence: 'kinds-template',
        crossing: 'The line → the product',
      },
      {
        headline: 'A person approves what reaches main.',
        text: 'Automation opens the sync, cascade, release, dependency, and template pull requests, and nothing reaches main until a code owner approves it after its last push with the required checks green; when the line cannot go on alone, it opens an issue for a person.',
        why: 'Main’s ruleset requires a code owner’s review, an approval after the last push, every review thread resolved, and the required checks green. Cascade arms auto-merge, which waits for that approval, and a Copilot review never counts as one.',
        focus: [
          'kinds-automation',
          'kinds-main-approval',
          'kinds-copilot',
          'kinds-issue',
        ],
        scopes: ['kinds-person'],
        evidence: 'kinds-main-approval',
        crossing: 'Automation opens · a person approves',
      },
      {
        headline: 'Your work picks your path.',
        text: 'Changing what a service does is service work and takes the service path; changing what carries every service is platform work and takes the platform path; one person can do both.',
        why: 'Service work is a pull request in a service’s fork, in the paths the fork owns. Platform work lands in the template and the stack, and reaches every fork through template sync and the shared environment.',
        focus: ['kinds-service-work', 'kinds-platform-work'],
        scopes: ['kinds-line', 'kinds-product'],
        evidence: 'kinds-service-work',
        crossing: 'Service work · platform work',
      },
    ],
  },
  'bring-up': {
    kind: 'map',
    lesson: 'lifecycle',
    group: 'learn',
    book: 'The stack',
    title: 'How it comes to life',
    subtitle: 'Create, use, and remove',
    subhead: 'spi up creates the environment. Flux continues the rollout.',
    intro:
      'Build on the wide map from 102: follow your environment from your workstation into the resource group, AKS cluster, and namespaces, then remove it.',
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
      start: ['profiles'],
      provision: ['owners', 'profiles'],
      bootstrap: ['owners'],
      reconcile: ['timeline', 'inside-the-cluster'],
      inspect: ['milestones'],
      remove: ['credentials'],
    },
    tryIt: {
      activity: 'bring up an environment',
      summary: 'Try it: bring up an environment · Azure charges apply',
      outcome:
        'Set up an environment, monitor the deployment, and test an API request.',
      badge: 'workstation-cloud',
      variants: [
        {
          label: 'Run it in your subscription',
          result:
            'Create an environment in your Azure subscription, read what the lifecycle document says about readiness while it provisions, monitor progress with spi status --watch, and test the partition API with an authenticated request. Then decide whether to keep the environment for lesson 06 or remove it.',
          access: 'Azure resources billed separately',
          accessNote:
            'Use your own Azure subscription. You pay for the resources you create until you remove them.',
          prerequisites: [
            {
              kind: 'lesson',
              chapter: 'running-stack',
              label: 'The CLI from 102',
              text: 'Keep it current rather than reinstalling an older release; spi --version prints a version.',
              sources: ['install'],
            },
            {
              kind: 'tool',
              label: 'curl',
              text: 'curl.exe in Windows PowerShell.',
              sources: ['install'],
            },
            {
              kind: 'access',
              label: 'An Azure role that can create',
              text: 'Contributor plus a conditioned Role Based Access Control Administrator at subscription scope. spi check names any permission that is missing.',
              sources: ['install'],
            },
          ],
          time: {
            active:
              'About 30 minutes at the keyboard across the steps, most of it after provisioning, plus about 10 minutes of reading that fits inside the provisioning wait.',
            wait: 'Fresh provisioning was observed at roughly 45 to 50 minutes in centralus, and application readiness can take longer; these are planning estimates from prior runs, not guarantees for the current release or another region.',
            cleanup:
              'A few minutes of effort; spi down itself waits up to 45 minutes.',
            minutes: { active: 30, wait: 50, cleanup: 5 },
          },
          footprint: [
            {
              place: 'workstation',
              state: 'changes',
              note: 'az login keeps your sign-in here; the CLI runs from here.',
            },
            {
              place: 'github',
              state: 'reads',
              note: 'Flux follows the stack’s main branch; nothing is written.',
            },
            {
              place: 'azure',
              state: 'bills',
              note: 'Resource group spi-stack-<name>: AKS, Cosmos DB, Storage, Service Bus, Key Vault, identities.',
            },
          ],
          effects:
            'spi up creates a resource group named spi-stack-<name> containing an AKS Automatic cluster, Cosmos DB, Storage, Service Bus, Key Vault, and managed identities. It then configures the cluster and starts Flux. Even --dry-run creates or updates the resource group and its naming tag.',
          steps: [
            {
              command: 'az login\naz account show',
              touch: { kind: 'local', note: 'signs in; creates nothing' },
              expect:
                'Check the subscription name and ID: this is where Azure will bill the deployment. If it is wrong, use az account set to select your subscription before continuing.',
            },
            {
              command: 'spi up --env <name> --dry-run',
              touch: {
                kind: 'creates',
                note: 'creates the resource group, even as a dry run',
              },
              expect:
                'Check the proposed AKS and data-service changes and the final “Dry-run complete” message. The resource group now exists, even though the stack has not been deployed; use the cleanup steps below if you stop here. Resources that depend on the AKS OIDC issuer are not included in this preview.',
              sources: ['lifecycle', 'cli'],
            },
            {
              command: 'spi up --env <name>',
              touch: {
                kind: 'creates',
                note: 'creates and starts billing the environment',
              },
              expect:
                'This deploys the core profile in westus3, and Flux follows the main branch of the stack repository. The Bicep templates come from the installed CLI, which carries them inside its wheel, while the Kubernetes manifests come from that branch; keeping the CLI current keeps the two together. To choose another region, add --location <region> to both spi up commands; the pinned CLI help notes capacity constraints in eastus2 and centralus. A successful exit confirms the requested Git revision, not API readiness: Flux continues the rollout in the background.',
              sources: ['lifecycle', 'cli', 'packaging'],
            },
            {
              click:
                'While provisioning runs, open the deployment lifecycle document and read “From invocation to CLI exit”, then “Timing and readiness”.',
              touch: { kind: 'reads', note: 'reading while you wait' },
              expect:
                'Follow the stage table to Git-source finalization: before returning, the CLI verifies the requested revision, suspends Git fetching, and writes the deploy record, while Flux is already reconciling. Then compare the five readiness signals: CLI exit, a Git-source artifact, Ready Kustomizations and HelmReleases, Complete initialization Jobs, and a successful authenticated API request. Each confirms something different, and none guarantees the next.',
              sources: ['lifecycle'],
            },
            {
              command: 'spi status --watch',
              touch: { kind: 'reads', note: 'reads rollout progress' },
              expect:
                'Watch for Kustomizations and HelmReleases to become Ready and initialization Jobs to become Complete. A Running pod alone does not mean it is ready. This command checks rollout progress, not API responses; add --json in a separate run when you want the same status as structured output.',
              sources: ['lifecycle'],
            },
            {
              command: 'spi info --show-apis',
              touch: { kind: 'reads', note: 'reads the API URLs' },
              expect:
                'Find the partition API URL ending in /api/partition/v1/. Copy its hostname and replace <host> in the next command with it.',
              sources: ['cli'],
            },
            {
              command: {
                posix:
                  'curl -sS -H "Authorization: Bearer $(spi token)" \\\n  "https://<host>/api/partition/v1/partitions/opendes"',
                powershell:
                  'curl.exe -sS -H "Authorization: Bearer $(spi token)" "https://<host>/api/partition/v1/partitions/opendes"',
              },
              touch: { kind: 'reads', note: 'one authenticated lookup' },
              expect:
                'The response should contain the stored configuration for opendes as JSON. The command uses spi token to get a ten-minute bearer token for the deploy identity and include it in the Authorization header. A successful response confirms this authenticated partition lookup works; it does not test search, storage, or ingestion.',
              sources: ['workloadIdentity', 'cli'],
            },
            {
              click:
                'Decide: keep the environment for lesson 06, or remove it now.',
              touch: {
                kind: 'reads',
                note: 'a decision; billing continues until you remove it',
              },
              expect:
                'Keep it to avoid provisioning again for lesson 06; Azure charges continue while you keep the resources. To remove it now, follow the cleanup steps below, and read “Steady state and teardown” to compare what each removal option leaves behind.',
              sources: ['lifecycle'],
            },
          ],
          alternate: {
            observation:
              'spi up fails in the AKS or PaaS stage with a regional capacity or quota error.',
            next: 'Choose another region with --location <region> and retry with the same --env, partition list, and ingress settings. A failed run can leave resources behind. Follow the cleanup steps when you are done, even if provisioning did not finish.',
          },
          cleanup: {
            steps: [
              {
                command: 'spi down --env <name>',
                touch: {
                  kind: 'removes',
                  note: 'deletes the cluster and data; keeps the names',
                },
                expect:
                  'This deletes the cluster, data services, and their data, but keeps the resource group, managed identities, and naming tags for reuse. It asks you to type y to confirm. The command waits up to 45 minutes; that is a timeout, not an expected duration. If it exits with an error, inspect the listed remaining resources and retry.',
                sources: ['lifecycle'],
              },
              {
                command: 'spi down --env <name> --purge',
                touch: {
                  kind: 'removes',
                  note: 'deletes the resource group and identities',
                },
                expect:
                  'Use --purge when you no longer need the environment. It asks you to type y to confirm, then removes the identities’ external grants and deletes the resource group, including the identities, with a 45-minute timeout. Confirm removal with az group exists --name spi-stack-<name>; it should print false.',
                sources: ['lifecycle'],
              },
            ],
            ledger: {
              columns: ['spi down', 'spi down --purge'],
              rows: [
                { item: 'AKS cluster', after: ['removed', 'removed'] },
                {
                  item: 'Cosmos DB, Storage, Service Bus, Key Vault, and their data',
                  after: ['removed', 'removed'],
                },
                {
                  item: 'Resource group spi-stack-<name>',
                  after: ['kept', 'removed'],
                },
                { item: 'Managed identities', after: ['kept', 'removed'] },
                {
                  item: 'The identities’ external grants',
                  after: ['kept', 'removed'],
                },
                { item: 'Naming tags', after: ['kept', 'removed'] },
              ],
            },
            remains:
              'After ordinary spi down: the resource group spi-stack-<name>, its managed identities, and its naming tags, so a later spi up reuses the same names. After --purge: nothing of the environment.',
          },
          sources: [
            'lifecycle',
            'cli',
            'architecture',
            'ciSetup',
            'workloadIdentity',
          ],
          tested: {
            cli: 'spi 0.16.0; commands quoted from cli.py at dc2c956',
            stack: 'osdu-spi-stack dc2c956 (release 0.16.0)',
            template: 'Not applicable: no fork is used.',
            shell: 'zsh',
            os: 'macOS 26.6.2 on Apple silicon',
            date: '2026-09-13',
          },
        },
      ],
      connection: {
        text: 'Already have a stack that someone else created? You can connect to it instead of provisioning your own: spi connect --resource-group <resource-group> --cluster <cluster-name> sets your kubectl context. You need Azure sign-in and access to that cluster; then start at spi status --watch.',
        sources: ['forkDeploy'],
      },
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
      'Illustrated core profile · your environment / opendes. Running spi up creates billable resources; spi down deletes compute and data. The ≈45–50 min provisioning observations were from centralus; the CLI defaults to westus3. Times vary, and overlapping phases must not be added.',
    sources: ['install', 'lifecycle', 'flux', 'identity'],
    question: 'How is the stack created, and when is it usable?',
    builds:
      'Uses the boundaries from 102: the stack, AKS, and the resources outside it.',
    where:
      'The same wide picture through time: Azure resources, then the cluster, then the namespaces Flux assembles inside it.',
    example: {
      title: 'Before the lookup can answer',
      code: 'spi up --env <name>',
      scopes: ['environment', 'aks', 'resources'],
      crossing: 'Provision the environment, then look up opendes',
      hops: [
        {
          detail: 'aks',
          label: 'AKS',
          step: 'provision',
          copy: 'Created first, in spi-stack-<name>',
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
        why: 'spi up runs Bicep and the bootstrap. Flux starts reconciling before the CLI exits and keeps working after it returns.',
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
        why: 'Flux and initialization can continue after spi up returns. Watch spi status --watch, then verify the API operation you need.',
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
        why: 'Ordinary spi down deletes the cluster and its data but keeps the managed identities and the resource group. A rebuild reuses those names, not the deleted data.',
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
  'fork-shape': {
    kind: 'map',
    group: 'learn',
    book: 'The fork',
    title: 'The shape of the fork',
    subtitle: 'Who owns which paths',
    subhead: 'Upstream does not carry the Azure provider. The fork does.',
    intro:
      '<p>A service fork is a short list of paths the fork owns, beside a tree regenerated from upstream every day.</p><p>Read the repository by owner: each row is a path, each column is a branch, and the cells say where the path exists.</p>',
    premise:
      'The cache fallback from 103 has to live somewhere upstream cannot delete. From here the journey is illustrative: the real fix arrived from upstream before the filter; follow a fix like it made in the fork today.',
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
      'osdu-spi-partition is the reference fork. Every service the stack deploys has its own fork, each following the same filter with its own service name and writing its own descriptor. Customer mirror forks form a second tier and copy the service repository, not upstream. The descriptor row is fork-owned by rule.',
    sources: ['ownership', 'branches', 'forkTiers', 'workflowSystem'],
    question:
      'Who owns that provider code, and how does it survive upstream deleting it?',
    builds:
      'Uses the fork-owned paths from 103 and the image the stack pulls in 102.',
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
      note: 'Two changes are now waiting to meet: the provider fix on main, upstream’s on fork_upstream. The next view is the day they do.',
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
    subhead: 'From an upstream update to a candidate image.',
    intro:
      '<p>The three branches from 04, followed through one change.</p><p>Upstream is regenerated at midnight, the cascade carries it into the workspace, a person approves, every eligible commit gets an image digest and a turn in the stack, and a release is an optional tag on an image that already exists.</p>',
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
      'What happens to a provider change, and to upstream’s change, between midnight and an image digest?',
    builds: 'Uses the three branches and the ownership rows from 04.',
    where:
      'The same repository as 04, followed through five moments. The stack appears at the fourth, when a candidate digest borrows it.',
    example: {
      title: 'The cache fallback fix meets the upstream change',
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
          detail: 'stack-slot',
          label: 'A turn in the stack',
          copy: 'What 06 follows',
        },
      ],
      note: 'The cache fix and its unit tests are real. From here the example follows an illustrative acceptance run in the newer template’s lane, which the reference partition fork adopted in September 2026. The release moment is optional and comes after all of this.',
    },
    outcomes: [
      'A sync is a generated tree plus one PR and one tracking issue; upstream is never merged in as text, and the generated commit lands through a reviewed sync PR. The cascade merges main first, then fork_upstream, into the workspace.',
      'The labels on the tracking issue are the state: cascade-active, cascade-blocked, cascade-failed, validated. A blocked cascade is run again after a provider change on fork_integration; removing human-required is how a failed one retries.',
      'The integration PR and the version PR are different PRs. Validation runs on PRs and on pushes to main and fork_integration, pushes a digest for every eligible commit, and the stack is borrowed for it before any release exists.',
    ],
  },
  handshake: {
    kind: 'map',
    group: 'learn',
    lesson: 'steps',
    book: 'The seam',
    title: 'The handshake',
    subtitle: 'Borrow, prove, restore',
    subhead: 'Write the lock. Flux rolls out the image.',
    intro:
      '<p>The fork has a candidate image digest and the stack has a running environment.</p><p>One credentialed workflow run borrows the partition service’s slot in that environment: it reads the configuration the environment reports, records its run ID and the candidate digest in osdu-image-lock, checks that the pod is running the candidate digest, runs the suites the descriptor declares, and gives the slot back. Watch the lock and the pod change as you step through. The reference partition fork adopted this lane in September 2026; the run you step through is illustrative.</p>',
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
    guides: ['borrow-prove-restore', 'backing-environment'],
    mistakes: ['validation-summary-means-deployed', 'restore-always-restores'],
    scope:
      'A shared environment can be borrowed by several onboarded forks, one service slot each, serialised per service. The workflow does not yet load test inputs from Key Vault, check every descriptor requirement before borrowing, or verify the pod again before each suite. The lane shown is the one the template ships since 10 September; osdu-spi-partition adopted it in September 2026. The run’s digests, run IDs, and PR numbers are illustrative.',
    sources: [
      'forkDeploy',
      'proof',
      'descriptorContract',
      'partitionDescriptor',
      'statusContract',
    ],
    question:
      'How does a candidate image reach a running stack, what proves it, and how is the temporary test deployment restored?',
    builds: 'Uses the candidate digest from 05 and the environment from 102.',
    where:
      'Both maps at once: a GitHub Actions run on the fork side, and your environment’s image lock, pod, and deploy identity on the stack side.',
    example: {
      title: 'Candidate B borrows the partition slot in the stack',
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
    goal: 'You can say what one validation run writes in the environment, what proves the candidate is running, and when its restore can be trusted.',
    outcomes: [
      {
        headline: 'Writing the lock starts the deploy.',
        text: 'Writing the lock starts the deploy: Flux reconciles osdu-image-lock and the pod restarts on the pinned digest, and the run checks the pod before trusting any test result. Between runs the lock holds the canonical image.',
        why: 'The run writes the candidate digest and its run ID into osdu-image-lock; Verify then waits for a pod whose imageID matches before any suite runs.',
      },
      {
        headline: 'A green restore is a claim about this run.',
        text: 'The run only restores what it still owns, so a green restore is a claim about this run, not about the environment.',
        why: 'spi service reset --if-run writes the canonical image back only while the lock annotation still names this run; otherwise it writes nothing and exits 2.',
      },
      {
        headline: 'The stack publishes facts; the fork declares needs.',
        text: 'The stack publishes facts and the fork declares needs in its descriptor. Five repository settings, plus trust onboarding on the stack side, are all that connect them.',
        why: 'spi status --json and spi info --json are the facts; .spi/service.yaml is the descriptor. The deploy identity is federated to the repository.',
      },
    ],
  },
  'not-true': {
    kind: 'page',
    page: 'myths',
    group: 'learn',
    book: 'Across the path',
    title: 'Things that are not true',
    subtitle: 'Field check',
    subhead: 'The assumptions that cause trouble.',
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
  'whose-image': {
    kind: 'map',
    group: 'learn',
    book: 'Working the stack',
    title: 'Whose image is running',
    subtitle: 'Canonical images and their age',
    subhead:
      "Every service runs an image its Azure fork's main branch built, chosen once at spi up and kept until a refresh moves it.",
    intro:
      '<p>Thirteen services and schema’s loader each run a build of an Azure service fork’s main branch, pulled from GHCR and pinned by digest.</p><p>Builds on the environment from lesson 02 and the fork’s day from lesson 05. This view works where the code comes from: the fork on GitHub and its GHCR packages, and the image lock and pods in your environment.</p>',
    figure: 'From a fork commit to a running pod',
    selected: 'img-resolve',
    diagram: 'whoseImage',
    guides: [],
    listen: [],
    mistakes: ['refresh-is-automatic'],
    scope:
      'Canonical images only; pins are lesson 06’s subject. The tag, commit, and digest in the example are the values one environment showed. This map is illustrative, executes nothing, and reports no live state.',
    sources: ['images', 'imageLock', 'imagePins', 'envRefresh'],
    question:
      'Which build does each service run, where did it come from, and how long can it stay?',
    builds:
      'Builds on the environment from lesson 02 and the fork’s day from lesson 05.',
    where:
      'Where the code comes from: the service fork on GitHub, its GHCR packages, and the image lock and pods in your environment.',
    goal: 'You can say which commit each service runs, how the lock ties that commit to the digest the pods run, and when an image needs a refresh.',
    outcomes: [
      {
        headline: "Each service runs its Azure fork's main image from GHCR.",
        text: 'At spi up the CLI asks GHCR which digest main-snapshot names for each of thirteen forks and records it under the sha tag of the commit that built it; schema’s loader comes from the same commit as schema.',
        why: 'The community registry is not a source: its images don’t carry the Azure provider, and a missing or private package fails resolution rather than falling back. It is the build main last published, not a release. An environment can record a trusted mirror for one service at a time with spi onboard --canonical-source fork.',
        focus: ['img-fork', 'img-ghcr', 'img-resolve'],
        scopes: ['img-source'],
        crossing: 'Fork main → GHCR → spi up',
        evidence: 'img-resolve',
      },
      {
        headline: 'The lock ties each tag to one fork commit and one digest.',
        text: 'osdu-image-lock records each service’s repository, sha tag, digest, and build date; the tag names a commit on the fork’s main, and the pods run the digest.',
        why: 'A sha tag can move; the digest cannot, and Flux renders each service from it. spi info prints the tag cut to 12 characters. Its Source column is the policy the next refresh resolves; its Image column is what runs now.',
        focus: ['img-lock', 'img-ghcr', 'img-fork', 'img-pods', 'img-info'],
        scopes: ['img-environment'],
        crossing: 'Tag → fork commit · digest → pods',
        evidence: 'img-lock',
      },
      {
        headline:
          'A canonical image ages toward retention until a refresh moves it.',
        text: 'Nothing moves a canonical on its own: spi info and spi status mark one built more than 21 days ago, and the fork’s weekly retention can delete a sha image over 30 days old once main has built past it.',
        why: 'spi up keeps an existing lock unless asked to refresh. Only the shared environment refreshes on a schedule, every weekday at 04:00 UTC. On a personal environment the refresh is yours: spi service refresh with a service name, or --forks for every service. Pinned services are not marked.',
        focus: ['img-info', 'img-refresh', 'img-retention'],
        scopes: ['img-workstation'],
        crossing: 'Build date → 21-day mark → refresh',
        evidence: 'img-refresh',
      },
    ],
    example: {
      title: "Follow partition's tag home",
      code: 'spi info',
      scopes: ['img-environment'],
      crossing: 'spi info → lock → GHCR → fork commit → pods',
      hops: [
        {
          detail: 'img-info',
          label: 'spi info',
          copy: 'spi info reads the lock. Partition’s row shows sha-8aa26ca0, the tag cut to 12 characters, its build date, and source azure.',
        },
        {
          detail: 'img-lock',
          label: 'osdu-image-lock',
          copy: 'The lock holds partition’s repository, ghcr.io/azure/osdu-spi-partition, the full tag sha-8aa26ca007ad, the digest sha256:ace8c625…, and the build date.',
        },
        {
          detail: 'img-ghcr',
          label: 'GHCR tag',
          copy: 'On GHCR, sha-8aa26ca007ad points at the same digest the lock recorded.',
        },
        {
          detail: 'img-fork',
          label: 'Fork commit',
          copy: 'The tag names commit 8aa26ca007ad on Azure/osdu-spi-partition’s main, a merged upstream integration.',
        },
        {
          detail: 'img-pods',
          label: 'Running pods',
          copy: 'spi status shows both partition pods running osdu-spi-partition@sha256:ace8c625…. Whose image? The fork’s, from one commit you can read.',
        },
      ],
      note: 'The values are the ones one environment showed; yours name other commits and digests. This site executes nothing and reports no live state.',
    },
  },
  'who-is-asking': {
    kind: 'map',
    group: 'learn',
    book: 'Working the stack',
    title: 'Who is asking',
    subtitle: 'People, tokens, and roles',
    subhead:
      'Your own token passes the mesh, spi users puts you in entitlements groups, and the role you choose decides what you may do.',
    intro:
      '<p>Calls made with plain spi token act as the platform’s deploy identity. To call as yourself, you need a member record in entitlements.</p><p>Builds on the environment from lesson 02 and the token check from lesson 07’s identity theme. This view works at the namespaces-and-workloads level: the mesh’s identity filter and the Entitlements and Workflow services in osdu, and the CLI on your workstation.</p>',
    figure: 'From your token to an entitlements answer',
    selected: 'ask-mesh',
    diagram: 'whoIsAsking',
    guides: [],
    listen: [],
    mistakes: ['users-add-accumulates'],
    scope:
      'People calling a running stack; the deployer’s Azure roles belong to bringing an environment up. This map is illustrative, executes nothing, and reports no live state.',
    sources: ['peopleAccess', 'userRoles', 'jwt'],
    question: 'Who does the stack think you are, and what may you do?',
    builds:
      'Builds on the environment from lesson 02 and the token check from lesson 07’s identity theme.',
    where:
      'Namespaces and workloads: the mesh’s identity filter and the Entitlements and Workflow services in osdu, with the CLI on your workstation.',
    goal: 'You can explain why your own token is refused until you are a member, what spi users add stores and proves, and which roles let Workflow act for you.',
    outcomes: [
      {
        headline: 'Your own token passes the mesh, and entitlements decides.',
        text: 'spi token --me prints your own Azure token; the mesh accepts its issuer and writes your unique_name as x-user-id, and entitlements refuses you with 401 until you are a member.',
        why: 'Bring-up seeds three identities, the workload, the deploy identity, and the member, and no person. Plain spi token mints the deploy identity, which sits in users.datalake.ops, so every call made with it was the platform’s, never yours.',
        focus: [
          'ask-me-token',
          'ask-mesh',
          'ask-entitlements',
          'ask-deploy-token',
        ],
        scopes: ['ask-sidecar'],
        crossing: 'Your token → mesh → Entitlements',
        evidence: 'ask-mesh',
      },
      {
        headline: 'spi users stores the id the mesh writes, and proves it.',
        text: 'spi users add --me applies the mesh’s own claim order to your token and stores that id; the deploy identity writes your groups, then the command calls entitlements with your token for up to a minute.',
        why: 'On a default stack that id is unique_name, not your object id or sign-in name. The check proves entitlements admits you in the first partition written; it says nothing about data ACLs. An id typed for someone else is stored as typed and verified by nothing.',
        focus: ['ask-users-add', 'ask-groups', 'ask-entitlements'],
        scopes: ['ask-workstation'],
        crossing:
          'spi users add → deploy identity writes → your token verifies',
        evidence: 'ask-users-add',
      },
      {
        headline: 'Only editor, admin and ops can run ingestion as you.',
        text: 'A role is one of four presets of groups; editor, admin and ops carry users.datalake.impersonation, which lets the stack’s OSDU identity act for you through Workflow, and viewer does not.',
        why: 'Viewer is users and users.datalake.viewers; editor adds users.datalake.editors and impersonation; admin and ops each carry users.datalake.ops and impersonation. With no --role, the default is admin. As a viewer, spi test dags --as me stops before any run with impersonation_missing.',
        focus: ['ask-roles', 'ask-groups', 'ask-workflow'],
        scopes: ['ask-services'],
        crossing: 'Role preset → impersonation → Workflow',
        evidence: 'ask-roles',
      },
    ],
    example: {
      title: 'From 401 to 200',
      code: 'spi users add --me --role viewer',
      scopes: ['ask-sidecar', 'ask-services'],
      crossing:
        'Your token → mesh → Entitlements → spi users add → Entitlements',
      hops: [
        {
          detail: 'ask-me-token',
          label: 'Your token',
          copy: 'spi token --me prints your own token: a v1 token for the management audience. The call is GET /api/entitlements/v2/groups with data-partition-id: opendes.',
        },
        {
          detail: 'ask-mesh',
          label: 'Mesh',
          copy: 'The mesh accepts the v1 issuer and writes x-user-id from your unique_name. It authenticates you; it grants nothing.',
        },
        {
          detail: 'ask-entitlements',
          label: 'Entitlements: 401',
          copy: 'Entitlements finds no group for that id and refuses: HTTP 401.',
        },
        {
          detail: 'ask-users-add',
          label: 'spi users add',
          copy: 'spi users add --me --role viewer stores the same id, has the deploy identity add you to users and users.datalake.viewers, then checks with your token.',
        },
        {
          detail: 'ask-groups',
          label: 'Entitlements: 200',
          copy: 'Same token, same call: entitlements finds you in your groups and answers HTTP 200.',
        },
      ],
      note: 'The first call’s 401 is entitlements’ refusal, as the stack’s decision record describes; a status code alone does not name the boundary that refused. This site executes nothing and reports no live state.',
    },
  },
  'ready-not-loaded': {
    kind: 'map',
    group: 'learn',
    book: 'Working the stack',
    title: 'Ready is not loaded',
    subtitle: 'Readiness, deploys, and data',
    subhead:
      "Ready is Flux's verdict, Deployable adds the environment's own gates, and loading data is a separate step that changes neither.",
    intro:
      '<p>A Deployable environment holds its schemas and no records. Reference data arrives only when you run spi load.</p><p>Builds on the bring-up and spi status --watch from lesson 02, and caller access from lesson 09. This view works at the namespaces-and-workloads level: the Flux layers in osdu-flux, the schema and load Jobs and the Storage API in osdu, and the CLI on your workstation.</p>',
    figure: 'Two verdicts, then a load',
    selected: 'load-status',
    diagram: 'readyNotLoaded',
    guides: [],
    listen: [],
    mistakes: ['deployable-means-loaded'],
    scope:
      'Storage means the OSDU API, not an Azure Storage account. Counts are from one load of the reference data. This map is illustrative, executes nothing, and reports no live state.',
    sources: ['statusContract', 'namedLoads', 'loadRegistry', 'schemaLoad'],
    question:
      'When is a new environment ready, open for deploys, and holding data?',
    builds:
      'Builds on the bring-up and spi status --watch from lesson 02, and caller access from lesson 09.',
    where:
      'Namespaces and workloads: the Flux layers in osdu-flux, the schema and load Jobs and the Storage API in osdu, and the CLI on your workstation.',
    goal: 'You can tell Ready from Deployable, say what data a new environment holds, and read what a completed load does and does not prove.',
    outcomes: [
      {
        headline:
          'Deployable is Ready, with maintenance off and bootstrap finished.',
        text: 'spi status answers two questions: Ready means every gating Flux layer has converged, and Deployable adds maintenance off, a deploy record present, and the members Job finished in every partition.',
        why: 'Non-gating layers such as legal seeding and DAG registration are shown but never count, so read the boolean, not the count. An environment brought up with --tag starts in maintenance; a branch environment is deployable after convergence. Clearing maintenance is your decision, and spi status exits 0 only when Deployable.',
        focus: [
          'load-status',
          'load-gating',
          'load-nongating',
          'load-maintenance',
        ],
        scopes: ['load-flux'],
        crossing:
          'Flux layers → Ready → maintenance and bootstrap → Deployable',
        evidence: 'load-status',
      },
      {
        headline: 'A Deployable environment holds schemas and no records.',
        text: 'Bring-up registers the schemas through a Flux Job behind a gating layer and writes no records; reference data is loaded by nothing until you run spi load.',
        why: 'The stack version ships a registry of named loads that pins reference data to a data-definitions release and its commit and makes it wait for the schemas. spi load refuses with not_deployable, exit 2, until the environment is Deployable.',
        focus: ['load-schema-job', 'load-registry', 'load-cli', 'load-loads'],
        scopes: ['load-osdu'],
        crossing:
          'Schema Job at bring-up · reference data only through spi load',
        evidence: 'load-registry',
      },
      {
        headline:
          'Loaded means Storage accepted the records, not that search finds them.',
        text: 'spi load creates one Job per partition that checks every kind against Schema and writes in batches of 500, skipping duplicates; complete means Storage accepted the records, and the indexer may still be working.',
        why: 'The Job fails when more than 1% of records fail, so complete can include up to 1% failed. A load never changes Ready or Deployable. Deleting a load Job removes the fact, not the records.',
        focus: ['load-job', 'load-storage', 'load-loads'],
        scopes: ['load-osdu'],
        crossing: 'spi load → load Job → Storage',
        evidence: 'load-storage',
      },
    ],
    example: {
      title: 'From Ready to 80,103 records',
      code: 'spi load',
      scopes: ['load-osdu'],
      crossing:
        'spi status → spi maintenance clear → spi load → load Job → Storage → spi load --status',
      hops: [
        {
          detail: 'load-status',
          label: 'spi status',
          copy: 'An environment brought up at a release tag reads Ready, with 30 of 30 Kustomizations, and not deployable: the environment is in maintenance.',
        },
        {
          detail: 'load-maintenance',
          label: 'spi maintenance clear',
          copy: 'After a partition lookup answers, you clear the flag in spi-deploy-record. The next spi status reads Deployable.',
        },
        {
          detail: 'load-cli',
          label: 'spi load',
          copy: 'spi load checks Deployable and that schemas is complete, skips the schema load as already done, and creates the reference-data Job.',
        },
        {
          detail: 'load-job',
          label: 'Load Job',
          copy: 'load-reference-data-opendes-99f8fc88 fetches data-definitions at its pinned commit and checks all 584 kinds against Schema before writing.',
        },
        {
          detail: 'load-storage',
          label: 'Storage',
          copy: 'Storage accepts 80,103 records in batches of 500, none failed.',
        },
        {
          detail: 'load-loads',
          label: 'spi load --status',
          copy: 'reference-data for opendes reads complete, 80103 records. Ready and Deployable did not change.',
        },
      ],
      note: 'The counts are from one load on a core environment. Complete does not say whether search can find the records yet. This site executes nothing and reports no live state.',
    },
  },
  'core-dags': {
    kind: 'map',
    group: 'learn',
    book: 'Working the stack',
    title: 'On behalf of you',
    subtitle: 'Core DAGs and caller provenance',
    subhead:
      'The stack decides which files load, registers them with Workflow, and runs each task on behalf of whoever started it.',
    intro:
      '<p>In a core environment, Airflow runs the community’s manifest ingestion DAGs alongside the stack’s smoke DAGs.</p><p>Builds on the environment from lesson 02 and caller access granted through spi users. This view works at the namespaces-and-workloads level: Airflow and its registration Job in platform, Workflow and Storage APIs in osdu. To run ingestion as yourself, you need editor, admin, or ops access in the partition; viewer is not enough.</p>',
    figure: 'From reviewed files to a stored record',
    selected: 'dag-catalog',
    diagram: 'coreDags',
    guides: [],
    listen: [],
    mistakes: ['run-succeeded-means-stored'],
    scope:
      'Core-profile workloads and their reviewed inputs. Storage means the OSDU API, not an Azure Storage account. This map is illustrative, executes nothing, and reports no live state.',
    sources: ['coreDagsDecision', 'coreDagInputs', 'coreDagRegistration'],
    question:
      'How does a DAG reach the stack, who does each task act as, and how do you know it stored anything?',
    builds:
      'Builds on the core environment from lesson 02 and caller access granted through spi users.',
    where:
      'Namespaces and workloads: Airflow and a registration Job in platform, and Workflow and Storage APIs in osdu.',
    goal: 'You can explain how reviewed DAGs arrive, why registration is separate from Deployable, and how Storage proves a write on behalf of the caller.',
    outcomes: [
      {
        headline:
          'A DAG reaches Airflow from a reviewed catalog, hash by hash.',
        text: 'A reviewed catalog selects two DAG families and four IDs; init containers verify full commits and per-file SHA-256 hashes before the scheduler and processor receive their files.',
        why: 'Only spi-smoke (Echo_DAG, airflow_monitoring) and core-ingestion (Osdu_ingest, manifest_ingestion) load. Python libraries are hash-locked too. A failed fetch, hash, or install blocks the new pod; retaining an old pod during a rolling update is not a guarantee after node loss.',
        focus: ['dag-catalog', 'dag-loader', 'dag-processor', 'dag-task'],
        scopes: ['dag-delivery'],
        crossing: 'Reviewed source → init containers → Airflow files',
        evidence: 'dag-loader',
      },
      {
        headline: 'Registration comes later, and it does not gate Deployable.',
        text: 'After Airflow and initialization, the separate layer-6 Job registers system workflows and unpauses declared DAGs, but its success does not gate Deployable.',
        why: 'spi-osdu-dag-registration requires the exact declared set, fresh parses, and zero import errors. It pauses removed DAGs and never deletes DAGs or Workflow records. Deployable is neither registration readiness nor proof of ingestion.',
        focus: ['dag-registration', 'dag-airflow-api', 'dag-workflow'],
        scopes: ['dag-registration'],
        crossing: 'Airflow + init → non-gating registration → Workflow',
        evidence: 'dag-registration',
      },
      {
        headline: 'Each task writes on behalf of the caller.',
        text: 'Workflow derives the caller from their token; a LocalExecutor task inside the scheduler calls Storage with the OSDU identity plus on-behalf-of, and read-back must show that caller as createUser.',
        why: 'Workflow rejects a supplied user ID. Its Airflow login grants no OSDU authority. The identity needs users.datalake.delegation and the caller needs users.datalake.impersonation; spi users editor, admin, and ops grant impersonation, viewer does not. Tasks are scheduler processes, not task pods.',
        focus: [
          'dag-caller',
          'dag-caller-token',
          'dag-workflow',
          'dag-airflow-login',
          'dag-airflow-api',
          'dag-task',
          'dag-osdu-identity',
          'dag-storage',
        ],
        scopes: ['dag-provenance'],
        crossing: 'Your token → Airflow login → OSDU identity + caller',
        evidence: 'dag-osdu-identity',
      },
    ],
    example: {
      title: 'Proof: spi test dags, as me',
      code: 'spi test dags --as me',
      scopes: ['dag-provenance'],
      crossing: 'Caller → Workflow → Airflow API → scheduler task → Storage',
      hops: [
        {
          detail: 'dag-caller',
          label: 'Caller',
          copy: 'Preflight checks impersonation, both Workflow registrations, schemas, the legal tag when Legal permits validation, and ACL domains. It rejects invalid legal tags and mismatched domains. If Legal refuses validation, the result is “not checked” and the smoke continues. Domain comparison is not group-membership testing; the check grants no roles and creates no schemas or legal tags.',
        },
        {
          detail: 'dag-workflow',
          label: 'Workflow',
          copy: 'Your token identifies the submitter. Echo runs first through Workflow; only after it succeeds does the smoke submit Osdu_ingest with a one-record Manifest. The payload supplies no userId, token, on-behalf-of, or createUser.',
        },
        {
          detail: 'dag-airflow-api',
          label: 'Airflow API',
          copy: 'Workflow authenticates with the osdu-workflow Airflow login, role User. This is not an OSDU credential. The API server has no OSDU Workload Identity.',
        },
        {
          detail: 'dag-task',
          label: 'Scheduler task',
          copy: 'LocalExecutor runs the task in the scheduler pod, using platform/workload-identity-sa. The task calls Storage with the OSDU identity and on-behalf-of naming the caller, subject to delegation and impersonation memberships.',
        },
        {
          detail: 'dag-storage',
          label: 'Storage read-back',
          copy: 'The smoke reads the record from the OSDU Storage API, requiring the submitted data and createUser equal to the caller. A successful run alone is insufficient. --report puts the submitted and stored records on one page.',
        },
      ],
      note: 'Both Workflow runs and the new record are retained; repeated checks create new evidence. To check an existing run, read its record from Storage instead. This site executes nothing. CI does not run this smoke against a live cluster.',
    },
  },
  'prove-from-desk': {
    kind: 'map',
    group: 'learn',
    book: 'Working the stack',
    title: 'Prove it from your desk',
    subtitle: 'spi test, reports, and local pins',
    subhead:
      'spi test runs the suite the deployed commit shipped, the report says what its tests prove, and a local build reaches the environment as a pin you can test the same way.',
    intro:
      '<p>spi test runs a service’s own suite from your workstation against the commit your environment runs; a local pin proves a change before a pull request.</p><p>Builds on the image lock and the temporary test deployment from lesson 06, and the canonical images from lesson 08. This view works where the code comes from: the service fork at the deployed commit, your workstation, and the lock, registry, and pods in your environment.</p>',
    figure: 'One commit, from the fork to your desk to the pods',
    selected: 'desk-run',
    diagram: 'proveFromDesk',
    guides: [],
    listen: [],
    mistakes: ['passed-means-checked'],
    scope:
      'Service acceptance suites run from a workstation; spi test dags is lesson 11’s. The commit and counts in the example are from one run. This map is illustrative, executes nothing, and reports no live state.',
    sources: ['deployedSuites', 'suiteReport', 'localBuilds', 'imageLock'],
    question: 'How do you prove a service from your desk?',
    builds:
      'Builds on the image lock and the temporary test deployment from lesson 06, and the canonical images from lesson 08.',
    where:
      'Where the code comes from: the service fork at the deployed commit, your workstation, and the image lock, registry, and pods in your environment.',
    goal: 'You can run the suite a deployed commit shipped, read what a pass does and does not prove, and test a local change the same way.',
    outcomes: [
      {
        headline: 'spi test runs the suite the deployed commit shipped.',
        text: 'When a canonical is resolved, the lock also records the digest of the acceptance image built from the same commit; spi test runs that image by digest with the descriptor, resolver, and verdict script fetched from the fork at that commit.',
        why: 'The run refuses unless the environment is Deployable and the service is not borrowed, mints the test callers the way spi token does, and discards its result if the target changed during the suite. A pin, a non-canonical entry, or no recorded acceptance digest refuses paired mode.',
        focus: [
          'desk-lock',
          'desk-commit',
          'desk-acceptance',
          'desk-guards',
          'desk-run',
        ],
        scopes: ['desk-github'],
        crossing: 'Lock → fork commit → paired image → your machine',
        evidence: 'desk-run',
      },
      {
        headline: 'A pass counts tests, and the report shows what they prove.',
        text: 'The verdict is the commit’s own script: a zero exit, at least one test not skipped, and no failures; --report counts the passing tests with empty bodies, and --review grades what each test proves against the service’s own API docs.',
        why: 'JUnit reports a test with an empty body as a pass. --report computes its facts on your machine and sends nothing; --review sends the suite’s sources to a reviewer. Neither changes the verdict or the exit code.',
        focus: ['desk-verdict', 'desk-report'],
        scopes: ['desk-workstation'],
        crossing: 'Verdict → --report → --review',
        evidence: 'desk-report',
      },
      {
        headline: 'A change on your desk reaches the stack as a local pin.',
        text: 'spi service pin --source builds the JAR on your machine and the image in the environment’s own registry, pins it by digest, and waits for the rollout; spi test --source then runs your checkout’s suite, labeled matched when its commit and a clean tree equal the pin.',
        why: 'The pin records origin local and refuses while a fork run borrows the service. A dirty or prebuilt build is labeled unmatched. spi service reset puts the canonical back. Checkout mode needs a JDK and Maven; paired mode needs Docker; spi check covers neither.',
        focus: ['desk-checkout', 'desk-registry', 'desk-lock', 'desk-pods'],
        scopes: ['desk-environment'],
        crossing: 'Checkout → environment registry → lock → pods',
        evidence: 'desk-registry',
      },
    ],
    example: {
      title: 'spi test partition, paired',
      code: 'spi test partition --report',
      scopes: ['desk-workstation'],
      crossing: 'Guards → lock → GitHub at the commit → paired image → verdict',
      hops: [
        {
          detail: 'desk-guards',
          label: 'Guards',
          copy: 'The environment is Deployable and partition is not borrowed. The CLI reads the target: the lock entry, the pods’ digest, and the rollout revision.',
        },
        {
          detail: 'desk-lock',
          label: 'Image lock',
          copy: 'The lock gives the commit, sha-8aa26ca007ad, and the acceptance digest recorded beside it, sha256:7fbfeeed….',
        },
        {
          detail: 'desk-commit',
          label: 'GitHub at the commit',
          copy: 'At the full commit, Azure/osdu-spi-partition gives .spi/service.yaml, the acceptance resolver, and suite-verdict.py.',
        },
        {
          detail: 'desk-run',
          label: 'Paired image',
          copy: 'docker run pulls partition-acceptance by digest as linux/amd64 and runs the acceptance suite against the environment.',
        },
        {
          detail: 'desk-verdict',
          label: 'Verdict and page',
          copy: 'The commit’s verdict: pass, 11 tests and 1 skipped. The CLI reads the target again, and --report writes spi-test-partition-acceptance.html.',
        },
      ],
      note: 'The commit and counts are from one run; that run was not reviewed. This site executes nothing and reports no live state.',
    },
  },
  watch: {
    kind: 'page',
    page: 'watch',
    group: 'supplement',
    title: 'Fieldnotes',
    subtitle: 'Short videos',
    headline: 'Fieldnotes from the lessons',
    subhead:
      'Short narrated videos, one for each lesson. Each chapter is one of the lesson’s claims, so the video and the lesson use the same words.',
    intro: '',
    hero: {
      image: 'start/machinery.webp',
      width: 656,
      height: 372,
      alt: 'Three meshing gears joined by a loop arrow: the Azure stack, the provider interface inside a service, and the fork workflows.',
    },
    sources: ['architecture', 'lifecycle', 'forkTiers'],
  },
  listen: {
    kind: 'page',
    page: 'listen',
    group: 'supplement',
    title: 'Audio deep dives',
    subtitle: 'Two recordings',
    headline: 'Two deep dives into the machinery',
    subhead:
      'One conversation about the Azure stack, one about the workflows that keep its service forks current. Pick a marker to listen from that point; its link opens the lesson while the recording plays.',
    intro: '',
    hero: {
      image: 'listen/headphones.webp',
      width: 940,
      height: 320,
      alt: 'Headphones whose ear cups are the stack gear and the fork gear, with a sound wave between them.',
    },
    sources: ['architecture', 'lifecycle', 'identity', 'flux'],
  },
  'field-guides': {
    kind: 'page',
    page: 'guides',
    group: 'supplement',
    title: 'Visual field guides',
    subtitle: 'Maps, guides, and posters',
    headline: 'Architecture and troubleshooting reference',
    subhead:
      'Reference diagrams for the Azure stack, the service interface, and the fork workflows, grouped by the lessons they sit beside.',
    intro: '',
    hero: {
      image: 'guides/drafting.webp',
      width: 900,
      height: 340,
      alt: 'A pinned drafting sheet showing the three gears as an engineering drawing, with a magnifier over the middle one.',
    },
    sources: ['architecture', 'lifecycle', 'forkTiers', 'decisions'],
  },
};

export const chapterGroups = [
  { id: 'learn', label: 'Learn', numbered: true },
  { id: 'supplement', label: 'Supplements', numbered: false },
];
