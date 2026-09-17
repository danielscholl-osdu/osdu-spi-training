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
        label: 'The stack',
        lessons: {
          'running-stack': 'What runs in the stack?',
          'bring-up': 'How is the stack created and made usable?',
        },
      },
      {
        label: 'Provider code and engineering',
        lessons: {
          'spi-boundary': 'Where does shared code call the Azure provider?',
          'fork-shape': 'Who owns which paths in a service fork?',
          'fork-day': 'How does an upstream update become a candidate image?',
          handshake: 'How is a candidate image tested in a running stack?',
          'not-true': 'Which common assumptions cause problems?',
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
    book: 'The stack',
    title: 'What is a stack?',
    subtitle: 'Place familiar OSDU concepts',
    headline: 'AKS is one part<span>of the stack.</span>',
    intro:
      "The stack is one development and test environment in an Azure resource group. OSDU services run in AKS; Azure data services sit alongside it. Some resources belong to a partition such as opendes, while others are shared. CIMPL runs supporting middleware in Kubernetes. Azure SPI uses Azure data services alongside AKS, while Elasticsearch, Redis, and Airflow's database remain in the cluster.",
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
              note: 'No sign-in; spi check only reads tool versions.',
            },
          ],
          effects:
            'Installs spi locally through uv and makes it available on PATH. Any prerequisite tools you install also stay on your workstation. Nothing is created or changed in Azure or GitHub; spi check only reads tool versions.',
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
                'Check that az, bicep, kubectl, kubelogin, and flux each show OK and a version, followed by “All 5 tools available.” If a tool is missing, install it and rerun spi check. This confirms the tools are available, not that you have access to an Azure subscription.',
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
        why: 'Each service is a Deployment in the osdu namespace; aks-istio-ingress routes the API paths to them.',
        focus: ['gateway', 'service'],
        scopes: ['aks', 'service-boundary'],
        evidence: 'service',
        crossing: 'Authenticated OSDU request',
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
    headline:
      'spi up creates the environment.<span>Flux continues the rollout.</span>',
    intro:
      'Build on lesson 01’s wide map: follow your environment from your workstation into the resource group, AKS cluster, and namespaces, then remove it.',
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
              label: 'The CLI from lesson 01',
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
              text: 'Resource groups, services, and role assignments. The stack’s CI uses Contributor plus User Access Administrator at subscription scope.',
              sources: ['ciSetup'],
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
                  'This deletes the cluster, data services, and their data, but keeps the resource group, managed identities, and naming tags for reuse. The command waits up to 45 minutes; that is a timeout, not an expected duration. If it exits with an error, inspect the listed remaining resources and retry.',
                sources: ['lifecycle'],
              },
              {
                command: 'spi down --env <name> --purge',
                touch: {
                  kind: 'removes',
                  note: 'deletes the resource group and identities',
                },
                expect:
                  'Use --purge when you no longer need the environment. It removes the identities’ external grants and deletes the resource group, including the identities, with a 45-minute timeout. Confirm removal with az group exists --name spi-stack-<name>; it should print false.',
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
      'Uses the boundaries from 01: the stack, AKS, and the resources outside it.',
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
  'spi-boundary': {
    kind: 'map',
    group: 'learn',
    book: 'One service',
    title: 'The SPI boundary',
    subtitle: 'Find where the Azure code sits',
    headline: 'The provider lives<span>inside the service.</span>',
    intro:
      'Builds on the partition lookup from 01 and works at one service inside the osdu namespace: partition in your environment. Inside it, a Service Provider Interface (SPI) connects shared behavior to an implementation. The community partition-core-plus implementation and the fork-owned Azure implementation connect that interface to different dependencies. Follow the opendes lookup across the Azure seam.',
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
              note: 'The reference fork’s source at a pinned commit, in the browser.',
            },
            {
              place: 'azure',
              state: 'reads',
              note: 'Optional: one field of one Deployment, through kubectl.',
            },
          ],
          effects:
            'Nothing is created or changed. The steps read the reference fork at a pinned commit; the optional kubectl step reads one field of one Deployment.',
          steps: [
            {
              click:
                'Open PartitionServiceImpl at 3a5690d and find getPartition.',
              touch: { kind: 'reads', note: 'reads the pinned source' },
              expect:
                'The provider checks its cache first with safeGet. If the result is null, tableStore.getPartition reads stored configuration from Azure Table Storage in common Storage. The provider wraps the result in PartitionInfo and caches it with safePut; an empty result returns 404. This lookup does not visit the partition’s Cosmos DB, blob Storage, or Service Bus.',
              sources: ['partitionProvider'],
            },
            {
              click:
                'Scroll to the private safeGet method near the end of the same file.',
              touch: { kind: 'reads', note: 'reads the pinned source' },
              expect:
                'A failed cache read does not stop the lookup. In safeGet, the catch block logs a warning and returns null, so getPartition falls back to Table Storage just as it would for a cache miss.',
              sources: ['partitionProvider', 'partitionCacheFix'],
            },
            {
              click:
                'Open the provider POM and find partition-core, then spring-boot-maven-plugin.',
              touch: { kind: 'reads', note: 'reads the pinned source' },
              expect:
                'The Azure module depends on partition-core, the shared service code, at the same project version. The spring-boot-maven-plugin repackage goal bundles both into one executable JAR, with PartitionApplication as its entry point.',
              sources: ['partitionPom'],
            },
            {
              click: 'Open build/Dockerfile.',
              touch: { kind: 'reads', note: 'reads the pinned source' },
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
              'The provider file shows a different revision, or you cannot find the named method.',
            next: 'Reopen the pinned provider source link and check that the revision starts with 3a5690d. The main branch changes as upstream and template updates arrive.',
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
    headline: 'From an upstream update<span>to a candidate image.</span>',
    intro:
      'The three branches from 04, followed through one change. Upstream is regenerated at midnight, the cascade carries it into the workspace, a person approves, every eligible commit gets an image digest and a turn in the stack, and a release is an optional tag on an image that already exists.',
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
      note: 'The cache fix and its unit tests are real. From here the example follows an illustrative acceptance run using the newer template; the reference partition fork has not adopted that lane or written its descriptor yet. The release moment is optional and comes after all of this.',
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
    headline: 'Write the lock.<span>Flux rolls out the image.</span>',
    intro:
      'The fork has a candidate image digest and the stack has a running environment. One credentialed workflow run borrows the partition service’s slot in that environment: it reads the configuration the environment reports, records its run ID and the candidate digest in osdu-image-lock, checks that the pod is running the candidate digest, runs the suites the descriptor declares, and gives the slot back. Watch the lock and the pod change as you step through. The run is illustrative: it uses the lane the newer template ships, which the reference partition fork has not adopted yet.',
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
      'A shared environment can be borrowed by several onboarded forks, one service slot each, serialised per service. The workflow does not yet load test inputs from Key Vault, check every descriptor requirement before borrowing, or verify the pod again before each suite. The lane shown is the one the template ships since 10 September; osdu-spi-partition has neither adopted it nor written its descriptor yet, so this run is illustrative until it does.',
    sources: ['forkDeploy', 'proof', 'descriptorContract', 'statusContract'],
    question:
      'How does a candidate image reach a running stack, what proves it, and how is the temporary test deployment restored?',
    builds: 'Uses the candidate digest from 05 and the environment from 01.',
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
    headline: 'Field check:<span>the assumptions that cause trouble.</span>',
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
