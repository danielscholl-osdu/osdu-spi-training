/**
 * @typedef {object} TryItAction
 * @property {string} [command] Inert shell text; mutually exclusive with click.
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
        'Install the spi CLI and its prerequisite tools before lesson 02; nothing here signs you in.',
      badge: 'workstation',
      variants: [
        {
          label: 'Install the CLI and check the tools',
          result:
            'The spi CLI and its five prerequisite tools are installed, and you can tell tool readiness from Azure access: nothing in this activity signs you in.',
          access: 'workstation setup',
          accessNote:
            'No Azure subscription or GitHub account is needed for this activity; it is preparation for lesson 02.',
          prerequisites: [
            {
              text: 'uv installed, and az, kubectl, kubelogin, and flux installed or installable with your package manager. bicep can come from the az CLI extension.',
              sources: ['install'],
            },
          ],
          time: {
            active:
              'About 10 minutes when uv and the tools are already present; longer if you install them.',
            wait: 'No automated waiting.',
            cleanup: 'Under a minute.',
          },
          effects:
            'Installs the spi tool into uv’s tool directory and puts it on PATH. Nothing is created or changed in Azure or GitHub; spi check reads tool versions only.',
          steps: [
            {
              command:
                'uv tool install "$(curl -fsSL https://api.github.com/repos/Azure/osdu-spi-stack/releases/latest \\\n  | grep -o \'https://github.com/Azure/osdu-spi-stack/releases/download/[^"]*-py3-none-any.whl\')"\nspi --version',
              expect:
                'uv installs the spi tool, and spi --version prints the release, for example spi 0.16.0. The macOS and Linux form is shown; the install guide has the PowerShell form.',
              sources: ['install'],
            },
            {
              command: 'spi check',
              expect:
                'A table titled SPI Stack Prerequisites with five rows, az, bicep, kubectl, kubelogin, and flux, each OK with a version, then “All 5 tools available.” Nothing asked you to sign in: the check reads tool versions and says nothing about your subscription.',
            },
            {
              command: 'spi up --help',
              expect:
                'Read, do not run. --env is required; --profile offers bare, minimal, and core, with core the default; --location defaults to westus3; --partition can repeat; --tag pins an immutable release of the GitOps source.',
            },
          ],
          alternate: {
            observation:
              'A row in the spi check table shows a status other than OK.',
            next: 'Install that tool with your package manager and rerun spi check. bicep is found through the az CLI’s bicep extension even when no bicep binary is on your PATH, and the check reports it OK.',
          },
          cleanup: {
            steps: [
              {
                command: 'uv tool uninstall spi',
                expect: 'uv removes the spi tool and its entry on PATH.',
              },
            ],
            remains:
              'The five prerequisite tools stay installed. Nothing was created in Azure or GitHub.',
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
      note: 'The map uses opendes as its example partition. The answer describes where opendes lives. Other services use it to find their Cosmos, Storage, and Service Bus.',
    },
    goal: 'You can distinguish the AKS cluster from the Azure resources around it and explain which resources opendes owns or shares in the environment.',
    outcomes: [
      {
        headline: 'The stack is AKS plus Azure data services.',
        text: 'A stack is a resource group: AKS plus the Azure data services around it, not the cluster alone.',
        why: 'spi up --env <name> creates AKS and its Azure resources together.',
        focus: ['flux', 'gateway', 'cosmos', 'shared-data'],
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
        headline: 'The Azure provider lives inside each OSDU service.',
        text: 'The OSDU services run in the osdu namespace, and each one carries its Azure provider inside its own image.',
        why: 'Each service image includes its Azure provider.',
        focus: ['gateway', 'service', 'provider'],
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
        'Provision an environment yourself, watch it reach readiness, and prove one API path.',
      badge: 'workstation-cloud',
      variants: [
        {
          label: 'Run it in your subscription',
          result:
            'An environment you provisioned yourself, observed to readiness with spi status --watch and proven on one API path with an authenticated partition lookup, then a deliberate keep-or-remove choice.',
          access: 'Azure resources billed separately',
          accessNote:
            'Your identity must create resource groups, deploy the Azure services, and create role assignments; the stack’s own CI runs with Contributor plus User Access Administrator at subscription scope. AKS Automatic capacity varies by region: westus3 is the default, and the CLI help names eastus2 and centralus as constrained. Commands are quoted from cli.py at dc2c956; this route has not yet been walked end to end and waits for the recorded walkthrough (fn-dt3).',
          prerequisites: [
            {
              text: 'The spi CLI and its five tools from lesson 01, with spi --version reporting spi 0.16.0.',
              sources: ['install'],
            },
            {
              text: 'An Azure subscription you may bill, with the roles above, and curl on the workstation.',
              sources: ['ciSetup'],
            },
          ],
          time: {
            active:
              'About 30 minutes at the keyboard across the steps, most of it after provisioning.',
            wait: 'Fresh provisioning was observed at roughly 45 to 50 minutes in centralus, and application readiness can take longer; these are planning estimates from prior runs, not guarantees for the current release or another region.',
            cleanup:
              'A few minutes of effort; spi down itself waits up to 45 minutes.',
          },
          effects:
            'spi up creates a resource group named spi-stack-<name> and, in it, an AKS Automatic cluster, Cosmos DB, Storage, Service Bus, Key Vault, and managed identities, then seeds the cluster and activates Flux. Everything in that group is billed to your subscription for as long as it exists. --dry-run alone creates or updates the resource group and its naming tag.',
          steps: [
            {
              command: 'az login\naz account show',
              expect:
                'The subscription you mean to bill, by name and id. Switch with az account set before going further.',
            },
            {
              command: 'spi up --env <name> --dry-run',
              expect:
                'This needs Azure access. The CLI creates or updates the resource group and its naming tag, then runs what-if previews of the AKS and PaaS templates and prints “Dry-run complete”. It is a preview of the stack, not a no-op: the group now exists and needs the same cleanup as a real run. Resources that depend on the AKS OIDC issuer are missing from the preview.',
              sources: ['lifecycle', 'cli'],
            },
            {
              command: 'spi up --env <name> --tag <release>',
              expect:
                'The default core profile. <release> is the tag matching your CLI, vX.Y.Z, so v0.16.0 for spi 0.16.0; the CLI refuses a tag whose version differs from its own, which keeps the tested pair reproducible. Each az and kubectl command is shown before it runs. When the CLI returns it has verified the requested Git revision and suspended Git fetching, and it says Flux is reconciling in the background. That is CLI exit, not readiness.',
              sources: ['lifecycle', 'cli'],
            },
            {
              command: 'spi status --watch',
              expect:
                'Workload health and initialization: Kustomizations and HelmReleases turning Ready, then initialization Jobs reaching Complete. It makes no API request, and a Running pod is not necessarily ready.',
              sources: ['lifecycle'],
            },
            {
              command: 'spi info --show-apis',
              expect:
                'The cluster’s endpoints with the full OSDU API list, including the partition base URL /api/partition/v1/ under your environment’s host. Copy that host for the next step.',
              sources: ['cli'],
            },
            {
              command:
                'curl -sS -H "Authorization: Bearer $(spi token)" \\\n  "https://<host>/api/partition/v1/partitions/opendes"',
              expect:
                'spi token mints a ten-minute bearer as the deploy identity and writes only the token to stdout, so it composes into the header. A JSON body of stored configuration for opendes. This proves only that path: one authenticated partition lookup, nothing about search, storage, or ingestion.',
              sources: ['workloadIdentity', 'cli'],
            },
            {
              click:
                'Decide: keep the environment for lesson 06, or remove it now.',
              expect:
                'Keeping it costs money for every hour it runs and saves a second 45 to 50 minute provisioning later. Removing it now is the first clean-up step below.',
            },
          ],
          alternate: {
            observation:
              'spi up fails in the AKS or PaaS stage with a regional capacity or quota error.',
            next: 'Rerun with --location <region> to choose another region, keeping the same --env, partition list, and ingress settings. The resource group from the failed run already exists and needs the same cleanup as a completed one, so run spi down --env <name> when you are done, whether or not provisioning finished.',
          },
          cleanup: {
            steps: [
              {
                command: 'spi down --env <name>',
                expect:
                  'Deletes the cluster, the data services, and their data, waiting up to 45 minutes; that is a timeout, not a promise. An incomplete delete exits nonzero and lists what remains, so rerun it. Managed identities, the resource group, and its naming tags stay.',
                sources: ['lifecycle'],
              },
              {
                command: 'spi down --env <name> --purge',
                expect:
                  'When you are done for good: removes the identities’ external grants, then deletes the resource group itself within the same 45-minute deadline. az group exists --name spi-stack-<name> prints false.',
                sources: ['lifecycle'],
              },
            ],
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
            cli: 'spi 0.16.0; commands quoted from cli.py at dc2c956; Azure route not walked',
            stack: 'osdu-spi-stack dc2c956 (release 0.16.0)',
            template: 'Not applicable: no fork is used.',
            shell: 'zsh',
            os: 'macOS 26.6.2 on Apple silicon',
            date: '2026-09-13',
          },
        },
        {
          label: 'Read a run without Azure',
          result:
            'You can name the five readiness signals as separate signals, say what the CLI verifies before it returns, and say what ordinary spi down keeps, without creating anything.',
          access: 'browser only',
          accessNote:
            'The three --help commands read the CLI installed in lesson 01 and contact no subscription; skip them if it is not installed.',
          prerequisites: [
            {
              text: 'A browser. The spi CLI from lesson 01 if you want to read its help; no Azure subscription and no sign-in.',
              sources: ['install'],
            },
          ],
          time: {
            active: 'About 15 minutes of reading.',
            wait: 'No automated waiting.',
            cleanup: 'Nothing to clean up.',
          },
          effects:
            'Nothing is created or changed. The linked documents are read in the browser, and --help prints option text without calling Azure.',
          steps: [
            {
              click:
                'Open the deployment lifecycle document and read “From invocation to CLI exit”.',
              expect:
                'A stage table that ends in Git-source finalization: the CLI waits for the source, verifies the requested artifact revision, then suspends the source and writes the deploy record before it returns. Under the table: “Flux runs concurrently with those final CLI stages”; there is no moment when the CLI stops and Flux starts.',
              sources: ['lifecycle'],
            },
            {
              click: 'In the same document, read “Timing and readiness”.',
              expect:
                'A five-row signal table: the CLI exits successfully, the Git source has an artifact, Kustomizations and HelmReleases are Ready, initialization Jobs are Complete, an authenticated API request succeeds. Each establishes a different thing and none implies the next. The 45 to 50 minute figure is a centralus planning estimate from prior runs, not a measurement or a guarantee.',
              sources: ['lifecycle'],
            },
            {
              click: 'Read “Steady state and teardown”.',
              expect:
                'Ordinary spi down deletes data and compute; managed identities, the resource group spi-stack-<name>, and its tags survive, so the next spi up reuses the same names. spi down --env <name> --purge is a separate destructive choice that deletes the group and its identities after external-grant cleanup.',
              sources: ['lifecycle'],
            },
            {
              command: 'spi up --help',
              expect:
                'Read, do not run. --env is required; --profile defaults to core; --location defaults to westus3 and its help names eastus2 and centralus as regions with capacity constraints; --tag pins an immutable release tag; --dry-run says it creates the resource group. This needs only the CLI from lesson 01 and makes no Azure call.',
              sources: ['cli'],
            },
            {
              command: 'spi status --help',
              expect:
                'Two options besides --help: --watch (-w) for continuous refresh, and --json. The description is deployment health and reconciliation progress; nothing about API requests.',
              sources: ['cli'],
            },
            {
              command: 'spi down --help',
              expect:
                '--env is required. The description says managed identities survive unless --purge, and --purge deletes the resource group itself, including the managed identities.',
              sources: ['cli'],
            },
          ],
          alternate: {
            observation:
              'spi: command not found, or spi --version reports a release other than 0.16.0.',
            next: 'The three commands are optional here. Install the CLI with lesson 01’s band, or read the same options in cli.py at the reviewed revision.',
          },
          cleanup: {
            steps: [
              {
                click: 'Close the document tabs.',
                expect: 'Nothing to remove; --help changed nothing.',
              },
            ],
            remains: 'Nothing was created.',
          },
          sources: ['lifecycle', 'cli'],
          tested: {
            cli: 'spi 0.16.0',
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
        'Find the lines where the Azure provider reads its cache and falls back to Table Storage.',
      badge: 'code-magnifier',
      variants: [
        {
          label: 'Follow the lookup in the source',
          result:
            'You can point at the line where the Azure provider reads its cache, the line where it falls back to Table Storage, and the build steps that put both into the one image the partition Deployment runs.',
          access: 'browser only',
          accessNote:
            'The last step is optional and needs a stack from lesson 02 with kubectl connected; everything else is reading on GitHub.',
          prerequisites: [
            {
              text: 'A browser. For the optional last step only, a stack from lesson 02 and kubectl connected with spi connect.',
              sources: ['partitionProvider', 'lifecycle'],
            },
          ],
          time: {
            active: 'About 15 minutes.',
            wait: 'No automated waiting.',
            cleanup: 'Under a minute.',
          },
          effects:
            'Nothing is created or changed. The steps read the reference fork at a pinned commit; the optional kubectl step reads one field of one Deployment.',
          steps: [
            {
              click:
                'Open PartitionServiceImpl at 3a5690d and find getPartition.',
              expect:
                'The first line of work is safeGet(partitionServiceCache, partitionId). Only when that returns null does the method call tableStore.getPartition(partitionId), build a PartitionInfo from the map, and safePut it back into the cache. An empty map raises 404 “partition not found”.',
              sources: ['partitionProvider'],
            },
            {
              click:
                'Scroll to the private safeGet method near the end of the same file.',
              expect:
                'The cache read is wrapped in try/catch: an exception is logged as a warning, “Partition cache (Redis/AMR) read failed … treating as cache miss and using durable store”, and null is returned. A cache outage becomes a miss, so the Table Storage read still happens.',
              sources: ['partitionProvider', 'partitionCacheFix'],
            },
            {
              click:
                'Open the provider POM and find partition-core, then spring-boot-maven-plugin.',
              expect:
                'A dependency on org.opengroup.osdu:partition-core at the project version: the shared service code is compiled into this module. Under build, spring-boot-maven-plugin runs the repackage goal with mainClass PartitionApplication: one executable JAR holds the shared code and the Azure implementation together.',
              sources: ['partitionPom'],
            },
            {
              click: 'Open build/Dockerfile.',
              expect:
                'COPY ${JAR_FILE} /app.jar onto an MCR OpenJDK 17 base, and no Maven runs in the image. One image, one JAR, both source owners inside it.',
              sources: ['partitionDockerfile'],
            },
            {
              command:
                "kubectl get deployment partition -n osdu -o jsonpath='{.spec.template.spec.containers[0].image}'",
              expect:
                'Optional, with a stack up. The image reference the cluster runs for partition: the HelmRelease named partition in osdu-flux installs the osdu-spi-service chart into the osdu namespace, so the Deployment is named partition. A fresh stack runs a community image resolved into the image lock; a fork-built candidate appears only in lesson 06, when a workflow pins one.',
              sources: ['partitionRelease', 'images'],
            },
          ],
          alternate: {
            observation:
              'A link opens main instead of 3a5690d, or a symbol is not where this band says.',
            next: 'Use the pinned links in the sources; the fork moves as template sync and upstream sync land. The revision in each link is the one this band was checked against.',
          },
          cleanup: {
            steps: [
              {
                click: 'Close the tabs.',
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
