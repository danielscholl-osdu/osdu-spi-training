export const componentDetails = {
  environment: {
    label: 'The stack boundary',
    title: 'AKS is one part of the environment.',
    body: 'The dev1 environment includes AKS and its Azure data services. A data partition such as opendes gets its own Cosmos DB SQL account, Storage account, and Service Bus namespace. Gremlin, common Storage, Key Vault, and middleware are shared by the environment.',
    artifact: {
      label: 'Environment identity',
      code: '--env dev1 → resource group spi-stack-dev1',
    },
    source: 'architecture',
  },
  workstation: {
    label: 'Outside the stack',
    title: 'Your terminal starts the work; controllers keep it running.',
    body: 'spi up drives Bicep and seeds the cluster. Before returning, it verifies the requested Git revision and suspends further Git fetching. Flux and Kubernetes continue running when you close the terminal.',
    artifact: {
      label: 'Start an environment',
      code: 'spi up --env dev1',
    },
    source: 'lifecycle',
  },
  client: {
    label: 'The OSDU request',
    title: 'The partition header still selects your data partition.',
    body: 'The gateway routes the request to an OSDU service. Its sidecar validates the bearer and projects caller identity; the service still makes its authorization decision. A valid Azure token alone does not establish that the caller can use an OSDU API.',
    artifact: {
      label: 'Request headers',
      code: 'Authorization: Bearer <token>\ndata-partition-id: opendes',
    },
    source: 'identity',
  },
  'config-source': {
    label: 'Outside the stack',
    title: 'Git supplies workload configuration.',
    body: 'The osdu-spi-stack source supplies manifests and local Helm charts. Its GitRepository lives in osdu-flux, while Flux controllers live in flux-system. A suspended Git source keeps its cached revision available to reconciliation.',
    artifact: {
      label: 'Inspect the selected revision',
      code: 'kubectl get gitrepository osdu-spi-stack-system -n osdu-flux -o yaml',
    },
    source: 'flux',
  },
  'image-source': {
    label: 'Image registries',
    title: 'Community images and fork images have different sources.',
    body: 'Community service images resolve from the OSDU GitLab registry. A service fork publishes to ghcr.io/<owner>/<SERVICE_NAME, or the repository name when that variable is unset>. The provisioned ACR is a possible future mirror; it is not the source in this flow.',
    artifact: {
      label: 'A fork package',
      code: 'ghcr.io/azure/osdu-spi-partition@sha256:<digest>',
    },
    source: 'forkDeploy',
  },
  aks: {
    label: 'Kubernetes boundary',
    title: 'Namespaces tell you where to look.',
    body: 'foundation hosts operators, platform hosts middleware, and osdu hosts APIs and initialization jobs. OSDU pods receive Istio sidecars; platform middleware stays outside that mesh. Start diagnosis in the namespace that owns the failed workload.',
    artifact: {
      label: 'Inspect operators and middleware',
      code: 'kubectl get pods -n foundation\nkubectl get pods -n platform',
    },
    source: 'architecture',
  },
  flux: {
    label: 'flux-system / osdu-flux',
    title: 'Git fetching and reconciliation are separate switches.',
    body: 'The Git source is suspended after deployment by default. Controllers still reconcile the cached configuration and live inputs, including osdu-image-lock. If a downstream Kustomization is blocked, follow its dependsOn chain to the first unhealthy dependency.',
    artifact: {
      label: 'Read rollout conditions',
      code: 'kubectl get kustomizations -n osdu-flux',
    },
    source: 'flux',
  },
  operators: {
    label: 'foundation',
    title: 'Operators make the middleware possible.',
    body: 'ECK manages Elasticsearch; CloudNativePG manages PostgreSQL. cert-manager and trust-manager provide certificate and trust handling. Flux orders these dependencies ahead of the workloads that need them.',
    artifact: {
      label: 'Find the operator pods',
      code: 'kubectl get pods -n foundation',
    },
    source: 'architecture',
  },
  gateway: {
    label: 'aks-istio-ingress',
    title: 'The gateway routes; the receiving sidecar identifies the caller.',
    body: 'spi-gateway binds to the AKS managed ingress Service. RequestAuthentication and an EnvoyFilter in osdu validate tokens and project x-app-id and x-user-id. Caller authentication and OSDU authorization remain separate checks.',
    artifact: {
      label: 'Inspect the entry point',
      code: 'kubectl get gateway spi-gateway -n aks-istio-ingress',
    },
    source: 'identity',
  },
  service: {
    label: 'osdu',
    title: 'Your familiar OSDU APIs run here.',
    body: 'Partition, entitlements, legal, schema, storage, search, and indexer are Kubernetes workloads. Each service packages shared code with its Azure provider. Runtime API dependencies and Flux rollout dependencies are different graphs.',
    artifact: {
      label: 'Find the service workloads',
      code: 'kubectl get deployments -n osdu',
    },
    source: 'architecture',
  },
  provider: {
    label: 'Inside an OSDU service',
    title: 'The Azure provider does the Azure work for this service.',
    body: 'Shared service code calls a Service Provider Interface; the Azure implementation behind it ships in the same image. For the partition service that work is a cache read and a Table Storage read in common Storage. It does not visit the partition’s own Cosmos DB, blob Storage, or Service Bus; other services use the answer it returns to find those.',
    artifact: {
      label: 'Reference provider source',
      code: 'provider/partition-azure/',
    },
    source: 'ownership',
  },
  middleware: {
    label: 'platform',
    title: 'Search still depends on Elasticsearch.',
    body: 'Elasticsearch, Redis, and Airflow’s PostgreSQL run in the cluster. Azure AI Search does not implement the Elasticsearch APIs OSDU uses. The default community indexer-queue still expects a Service Bus connection string, so records-changed indexing needs a Workload-Identity-capable replacement image.',
    artifact: {
      label: 'Inspect the middleware layer',
      code: 'kubectl get pods -n platform',
    },
    source: 'architecture',
  },
  initialization: {
    label: 'osdu / initialization',
    title: 'A running service can still be waiting for its data.',
    body: 'Partition and entitlements initialization precede schema loading. The schema-load Job has a 150-minute deadline and its Kustomization a 155-minute timeout. Those are ceilings, not a normal wait time; inspect conditions and logs when progress stalls.',
    artifact: {
      label: 'Check completion, not just pod phase',
      code: 'kubectl get jobs -n osdu\nspi status --watch',
    },
    source: 'lifecycle',
  },
  cosmos: {
    label: 'Per partition · opendes',
    title: 'Records and metadata have a partition-specific account.',
    body: 'Each OSDU data partition gets a Cosmos DB SQL account. The first partition is also the primary partition, which hosts the system database used by schema loading. Cosmos data-plane grants are Cosmos-native assignments and do not appear in az role assignment output.',
    artifact: {
      label: 'Infrastructure definition',
      code: 'infra/main.bicep',
    },
    source: 'architecture',
  },
  'partition-storage': {
    label: 'Per partition · opendes',
    title: 'Each partition gets its own Storage account.',
    body: 'Storage supplies the Azure provider’s blob and table backends. Shared-key access is disabled; retained connection-string fields contain DISABLED placeholders. A client that still requires an account key must be adapted to the identity-based data plane.',
    artifact: {
      label: 'Identity-based access',
      code: 'workload-identity-sa · namespace osdu',
    },
    source: 'identity',
  },
  events: {
    label: 'Per partition · opendes',
    title: 'Service Bus carries records-changed events.',
    body: 'The intended indexing path is Service Bus → indexer-queue → indexer → Elasticsearch. Local Service Bus authentication is disabled. The default community queue image’s connection-string client cannot use that path until replaced with a Workload-Identity-capable image.',
    artifact: {
      label: 'The documented compatibility boundary',
      code: 'docs/decisions/005-workload-identity.md',
    },
    source: 'identity',
  },
  'shared-data': {
    label: 'Shared by the environment',
    title: 'The partition table lives in common Storage.',
    body: 'The partition service keeps each partition’s stored configuration in tables in common Storage, a Storage account shared by the whole environment; the workload identity’s table role is granted there and nowhere else. The entitlements graph is shared the same way, in Cosmos DB Gremlin. Partition-specific Azure resources do not imply isolation between service identities: OSDU workloads share one managed identity.',
    artifact: {
      label: 'Partition layout',
      code: 'opendes: SQL + Storage + Service Bus\nenvironment: Gremlin + common Storage',
    },
    source: 'architecture',
  },
  identity: {
    label: 'Azure managed identity',
    title: 'Services share one Azure access identity.',
    body: 'spi-stack-<env>-osdu-identity is bound to Kubernetes ServiceAccounts through the AKS OIDC issuer. The Azure SDK exchanges the projected token for Azure access. The environment’s deploy, member, and no-access test identities are separate from this workload identity.',
    artifact: {
      label: 'ServiceAccount wiring',
      code: 'kubectl get serviceaccount workload-identity-sa -n osdu -o yaml',
    },
    source: 'identity',
  },
  vault: {
    label: 'Azure Key Vault',
    title: 'Identity-based Azure access still leaves middleware credentials.',
    body: 'Cosmos, Storage, and Service Bus use Azure identity rather than usable stored access keys. Redis and Elasticsearch passwords still live in Kubernetes Secrets and are mirrored into Key Vault. Bootstrap configuration is not all recreated from Git.',
    artifact: {
      label: 'Bootstrap configuration',
      code: 'osdu-config · osdu-image-lock · seed Secrets',
    },
    source: 'architecture',
  },
  registry: {
    label: 'Provisioned ACR',
    title: 'This registry is not the source of the shown images.',
    body: 'The stack provisions a Basic ACR with its admin account disabled. Community images come from GitLab; fork images come from GHCR. ADR-013 describes mirroring into this ACR as a possible follow-up, not the implemented image path.',
    artifact: {
      label: 'Provisioned infrastructure',
      code: 'infra/modules/acr.bicep',
    },
    source: 'images',
  },
  bootstrap: {
    label: 'CLI-owned cluster inputs',
    title: 'Some runtime inputs come from bootstrap, not Git.',
    body: 'The CLI creates namespaces, seed credentials, service accounts, ConfigMaps, and identity policies before activating Flux. osdu-flux keeps SPI-owned inputs separate from the extension-controlled flux-system namespace.',
    artifact: {
      label: 'Inspect environment inputs',
      code: 'kubectl get configmap spi-cluster-config -n osdu-flux -o yaml',
    },
    source: 'lifecycle',
  },
  readiness: {
    label: 'Readiness signals',
    title: 'CLI success does not establish API readiness.',
    body: 'For the opendes lookup in dev1, a successful spi up does not prove that the request path is ready. Before exiting, the CLI verifies the requested Git artifact revision while Flux overlaps the final CLI work; these signals are not a first-to-last checklist. spi status --watch observes configured workload health and initialization, and spi info --show-apis discovers the endpoint. Only a successful authenticated lookup proves that exercised API path, not every API. A pod in Running phase is not necessarily Ready, and a completed initialization Job should be Complete rather than Running.',
    artifact: {
      label: 'Observe the environment',
      code: 'spi status --watch\nspi info --show-apis',
    },
    source: 'lifecycle',
  },
  connect: {
    label: 'Join an existing stack',
    title: 'Use the environment coordinates your team gives you.',
    body: 'spi connect requires the resource group and cluster name and sets the kubectl context. You need Azure login and cluster access. You can then inspect the shared environment without provisioning another stack.',
    artifact: {
      label: 'Replace the two placeholders',
      code: 'spi connect --resource-group <resource-group> --cluster <cluster-name>',
    },
    source: 'forkDeploy',
  },
  caller: {
    label: 'Authenticate an API call',
    title: 'spi token mints the environment’s app-only caller.',
    body: 'The default caller is the deploy identity; --member selects a non-admin member and --no-access selects a caller absent from entitlements. Minting uses ServiceAccounts in spi-test and requires access. Partition admits tenant app-only callers differently, so it is not a witness for the negative entitlements cases.',
    artifact: {
      label: 'Capture the bearer locally',
      code: 'TOKEN=$(spi token)\n# Use it with the endpoint from spi info --show-apis',
    },
    source: 'identity',
  },
  retained: {
    label: 'After ordinary spi down',
    title: 'Identity and naming survive; application data does not.',
    body: 'Ordinary spi down deletes the cluster and data resources but retains managed identities, the resource group, and its tags, including spi-name-suffix. A rebuild reuses resource names and identity client IDs; cluster seed Secrets are lost and middleware passwords are regenerated.',
    artifact: {
      label: 'Inspect the remaining footprint',
      code: 'az resource list --resource-group spi-stack-dev1 --output table',
    },
    source: 'lifecycle',
  },
  contract: {
    label: 'Service Provider Interface',
    title: 'The public API can stay stable while provider work changes.',
    body: 'The common module calls a provider interface; the Azure module implements it. A changed shared interface can require an Azure code change even when the OSDU API contract is unchanged. This is why integration must compile the shared and Azure trees together.',
    artifact: {
      label: 'Reference service tree',
      code: 'partition-core/\nprovider/partition-azure/',
    },
    source: 'ownership',
  },
  core: {
    label: 'Shared OSDU code',
    title: 'The common module handles the request; it never names Azure.',
    body: 'partition-core receives the lookup, admits the caller through an authorization filter that delegates to the provider (the Azure implementation checks for an app-only caller; this path is not an entitlements lookup), validates the partition id, and calls getPartition on the provider interface. Nothing in this module knows which cloud answers. That is what lets upstream own it: the fork takes this code as published, every day, and view 04 shows how.',
    artifact: {
      label: 'The call that crosses the seam',
      code: 'IPartitionService.getPartition(partitionId)\n// implemented by provider/partition-azure',
    },
    source: 'ownership',
  },
  azureimpl: {
    label: 'The Azure implementation',
    title: 'The provider checks its cache, then reads Table Storage.',
    body: 'PartitionServiceImpl.getPartition asks the cache for opendes. When the cache misses, or when the read throws, it reads the stored configuration from the partition table in common Storage; a cache failure is logged as a warning and the lookup still answers. The code lives in provider/partition-azure, which the fork owns: it stays on fork_integration and main, outside the tree regenerated from upstream (osdu-spi ADR-038), so upstream’s planned removal of its Azure implementations deletes nothing here.',
    artifact: {
      label: 'The fallback, with its tests',
      code: 'PartitionServiceImpl.getPartition(id)\n  safeGet(cache, id)  → null on miss or exception (logged)\n  tableStore.getPartition(id)  when null\nPartitionServiceImplTest.java\n  should_fallBackToTableStore_when_cacheReadThrows_onGetPartition',
    },
    source: 'partitionProvider',
    goDeeper: ['partitionCacheFix', 'ownership', 'partitionProvider'],
  },
  azureclients: {
    label: 'Inside the provider',
    title:
      'Cache first. Table Storage when the cache misses, or when it throws.',
    body: 'The Azure implementation asks a Redis cache for opendes. On a miss it reads the partition row from Table Storage in common Storage, using a Workload Identity token rather than a stored key, and writes the answer back to the cache. Since commit fc2dfbf a cache that throws is treated as a miss too: the lookup still answers from the table, and a warning is logged. That fallback is the running example for the rest of the site.',
    artifact: {
      label: 'The fallback, in the provider',
      code: 'safeGet(cache, id)      // exception → null, logged\nif (pi == null) pi = tableStore.getPartition(id)',
    },
    source: 'partitionProvider',
  },
  upstream: {
    label: 'Upstream tip',
    title:
      'The community repository, including the providers the fork does not want.',
    body: 'community.opengroup.org publishes the whole partition service: core, acceptance tests, and one provider per cloud, including an Azure one that upstream plans to remove. The fork never checks this tree out as a branch. Sync Upstream reads it with git plumbing and generates fork_upstream from it, so upstream’s Azure directory and the fork’s never share a merge base.',
    artifact: {
      label: 'Where the sync reads from',
      code: 'https://community.opengroup.org/osdu/platform/system/partition\nUPSTREAM_REPO_URL  (repository variable, set at initialization)',
    },
    source: 'synchronization',
  },
  engineering: {
    label: 'osdu-spi, the template',
    title:
      'The workflows come from one repository and reach every fork as pull requests.',
    body: 'Azure/osdu-spi is a template repository. Its own .github/workflows/ run only in the template; .github/template-workflows/ is what a fork receives into its .github/workflows/, along with build/Dockerfile, the label and ruleset files, and the Release Please configuration. Sync Template delivers changes daily at 08:00 UTC as a PR. It never touches .spi/, which the service repository owns.',
    artifact: {
      label: 'Two directories, two audiences',
      code: '.github/workflows/            runs in the template only\n.github/template-workflows/   delivered to every service fork\n.spi/                         excluded from sync',
    },
    source: 'workflowSystem',
  },
  image: {
    label: 'The image, by digest',
    title: 'One Dockerfile, one public package, addressed by digest.',
    body: 'Validation builds build/Dockerfile on the Microsoft OpenJDK 17 Azure Linux base with the provider JAR and pushes it as ghcr.io/azure/osdu-spi-partition tagged sha-<commit>. The package name is SERVICE_NAME when the repository sets that variable and the repository name otherwise; partition has not set it, so it publishes under its repository name. The stack pins by digest, never by tag, so a retag cannot change what runs. The package must stay public: if its visibility flips, pods fail with ErrImagePull and Settings Apply can only report it.',
    artifact: {
      label: 'What leaves the fork',
      code: 'ghcr.io/azure/osdu-spi-partition:sha-<commit>\nghcr.io/azure/osdu-spi-partition@sha256:<digest>\nSERVICE_NAME   (repository variable; unset on partition)',
    },
    source: 'ghcr',
  },
  running: {
    label: 'The partition pod',
    title: 'Flux reconciles the lock; the pod follows it.',
    body: 'dev1 is a stack like any other: spi up made it, Flux assembles it, and its deploy identity survives spi down. While partition is pinned to a candidate, the other services keep running their canonical images, so a broken-but-ready candidate can fail a sibling’s suite. Several onboarded forks can share the environment, one service slot each, and a concurrency group serialises runs per service.',
    artifact: {
      label: 'What the run may read',
      code: 'Role spi-fork-verifier (namespace osdu):\n  deployments, pods, pods/log, events, configmaps, jobs · get/list',
    },
    source: 'envLifecycle',
  },
  delivery: {
    label: 'osdu-image-lock',
    title:
      'One ConfigMap names every service image. A deploy is an edit to it.',
    body: 'The lock is a stack object in osdu-flux with one key per service, PARTITION_IMAGE_DIGEST among them, and Flux substitutes the values at apply time. A fork run writes its digest with spi service pin --ephemeral, which also records the run id, the source commit, and the canonical image to restore, in the spi-stack.osdu.dev/pins annotation. The write is a compare-and-set, so a lost write is caught and a later pin takes over. Between runs the lock holds the canonical image, which today comes from the community registry; per-service promotion to a fork (osdu-spi-stack ADR-033) is designed, not built.',
    artifact: {
      label: 'The pin',
      code: 'spi service pin partition --image ghcr.io/azure/osdu-spi-partition@sha256:… \\\n  --ephemeral --run-id $GITHUB_RUN_ID --source-repo Azure/osdu-spi-partition --source-sha …',
    },
    source: 'imageLock',
  },
  proof: {
    label: 'Prove',
    title:
      'The suites the descriptor declares, run from an image, against the pinned pod.',
    body: 'The resolver binds each suite’s inputs from environment facts and three tokens the run mints. Each suite runs as docker run --env-file <suite>.env from the acceptance image under its own timeout. The verdict is the Surefire and Failsafe reports: exit zero, at least one test that was not skipped, no failures. For the cache fallback, be precise about what this proves: the acceptance suite exercises the partition API against a pod whose cache is healthy. The fallback itself is proved by the provider’s unit tests in the build, which mock a cache that throws.',
    artifact: {
      label: 'What counts as passing',
      code: 'exit 0  AND  tests run > 0  AND  failures + errors = 0\nreports uploaded as suite-reports',
    },
    source: 'deployTest',
  },
  // View 04: the shape of the fork. Rows are paths; columns are branches.
  'core-tree': {
    label: 'Shared code and tests',
    title: 'Upstream owns these, and the fork takes them every day.',
    body: 'partition-core, partition-acceptance-test, and testing/partition-test-core are kept by the filter exactly as upstream publishes them. The fork never edits them; a change here is an upstream contribution. On fork_upstream they are the whole build, which is why that branch compiles with the core profile alone.',
    artifact: {
      label: 'Filter classification',
      code: 'partition-core: keep\npartition-acceptance-test: keep\ntesting/partition-test-core: keep',
    },
    source: 'ownership',
  },
  pom: {
    label: 'Root pom.xml',
    title: 'Kept from upstream, with one Azure profile injected.',
    body: 'The root POM comes from upstream, but the generated tree has no Azure module for it to reference. The filter injects an azure profile that points at provider/partition-azure, so the fork-owned module resolves once the two trees meet on fork_integration. The cascade also stamps the Azure POM version from the upstream one.',
    artifact: {
      label: 'Filter classification',
      code: 'pom.xml: keep\nprofiles.azure: inject',
    },
    source: 'ownership',
  },
  'provider-azure': {
    label: 'The Azure provider',
    title: 'Upstream plans to remove this directory. The fork holds it.',
    body: 'provider/partition-azure implements the interface from view 03. It exists on main and fork_integration and is absent from fork_upstream by construction, so an upstream deletion has nothing to delete on the fork side. It was brought across once by a scripted cutover and has been fork-owned since.',
    artifact: {
      label: 'Where it is and is not',
      code: 'upstream tip:      present, scheduled for removal\nfork_upstream:     absent (never enters the merge base)\nmain:              provider/partition-azure/  fork-owned',
    },
    source: 'ownership',
  },
  'test-azure': {
    label: 'Azure integration tests',
    title: 'The tests for the provider live beside it, under the same rule.',
    body: 'testing/partition-test-azure is classified fork, so the generated branch leaves it out and the fork keeps it. The descriptor’s integration suite runs it from the acceptance image with -pl partition-test-azure. Community acceptance tests, by contrast, are upstream-owned and kept.',
    artifact: {
      label: 'Filter classification',
      code: 'testing/partition-test-azure: fork\ntesting/partition-test-core: keep',
    },
    source: 'ownership',
  },
  stripped: {
    label: 'Stripped paths',
    title: 'Other providers never reach the fork at all.',
    body: 'AWS, GC, GCP, and IBM providers and tests, partition-core-plus, devops/, .gitlab-ci.yml, and the other GitLab CI files are stripped when fork_upstream is generated. They are not deleted from a copy; they are never written. A new upstream path with no classification halts the sync with exit 2 and the labels sync-failed and human-required.',
    artifact: {
      label: 'Filter classification',
      code: 'provider/*-aws, -gc, -gcp, -ibm: strip\npartition-core-plus: strip\n.gitlab, .gitlab-ci.yml, devops: strip\nunknown path: halt',
    },
    source: 'ownership',
  },
  'engineering-files': {
    label: 'Engineering files',
    title:
      'The workflows and the Dockerfile are the fork’s, delivered by the template.',
    body: '.github/ holds the workflows, actions, labels, and rulesets the template delivers; build/Dockerfile is the one canonical service image recipe. None of them exist upstream, so the filter protects them from generation. They arrive and change through Sync Template pull requests, at most one open at a time. The cache fallback fix was checked by exactly these workflows before it reached main.',
    artifact: {
      label: 'Template-delivered, fork-held',
      code: '.github/workflows/    from .github/template-workflows/\nbuild/Dockerfile      mcr.microsoft.com/openjdk/jdk:17-azurelinux\n.release-please-config.json',
    },
    source: 'workflowSystem',
  },
  'descriptor-file': {
    label: 'The descriptor',
    title: 'The one engineering file the template does not write.',
    body: '.spi/service.yaml declares the acceptance suites the stack should run against this service and what each needs. It is excluded from template sync by name: the service repository writes it, and changes to it are reviewed with the code. The workflows come from osdu-spi. The service team writes this descriptor. osdu-spi-partition has not written its descriptor yet. After onboarding, Deploy Gate skips the run while .spi/service.yaml is missing, with the reason no .spi/service.yaml declares the suites.',
    artifact: {
      label: 'Service-owned, never synced',
      code: '.spi/service.yaml    schemaVersion: 3, written in this repository\nsync-config.json     "exclusions": [".spi", "CODEOWNERS", …]',
    },
    source: 'descriptor',
  },
  'fork-upstream': {
    label: 'fork_upstream',
    title: 'A generated tree with two parents and no Azure code.',
    body: 'Every sync writes the filtered upstream tip as a new commit whose parents are the previous fork_upstream and the upstream commit. Two trailers make it checkable: Upstream-Sha names the upstream commit and Filter-Rev names the filter configuration. Upstream is never merged in as text, and the generated commit lands through a reviewed sync PR; if the filter changes, the branch is regenerated.',
    artifact: {
      label: 'What a sync commit carries',
      code: 'git commit-tree <tree> -p fork_upstream -p <upstream-sha>\nUpstream-Sha: <sha>\nFilter-Rev: <revision>',
    },
    source: 'branches',
  },
  'fork-integration': {
    label: 'fork_integration',
    title: 'The workspace where the two trees meet.',
    body: 'The cascade merges main into this branch first, so everything the fork already accepted is here, then merges fork_upstream on top, stamps versions, and builds -P core,azure. Conflicts are resolved here, by a person, and pushed directly; its protection is relaxed for that reason. Integration Branch Cleanup resets it to main after each integration merge; the cascade also self-heals a workspace that drifted ahead of main with nothing in flight.',
    artifact: {
      label: 'Order of merges',
      code: '1. fork_integration ← main           (the fix is here)\n2. fork_integration ← fork_upstream  (upstream’s change)\n3. mvn -P core,azure install',
    },
    source: 'cascade',
  },
  'main-branch': {
    label: 'main',
    title: 'Protected. Two required checks, named exactly.',
    body: 'main receives the fork-owned fix through an ordinary pull request and the upstream change through the integration PR the cascade opens from release/upstream-*. Both need CodeQL and Validation Summary to pass and a person to approve. Auto-merge is armed with a merge commit, never a squash, because a squash breaks the ancestry check the monitor relies on. The rulesets that say so are reconciled every Monday.',
    artifact: {
      label: 'Required status checks',
      code: 'CodeQL\nValidation Summary',
    },
    source: 'threeBranchDecision',
  },
  filter: {
    label: 'The filter',
    title: 'One YAML file says what upstream is allowed to be here.',
    body: 'upstream-filter.yml classifies every top-level path, test module, Maven profile, and FOSSA module as keep, strip, fork, or inject. It also lists what must be present and what must be absent after generation, so a wrong classification fails the sync rather than shipping. The engine runs in generate, verify, stamp, and seed modes.',
    artifact: {
      label: 'Post-conditions the engine checks',
      code: 'expected_kept:   pom.xml, partition-core, testing/partition-test-core\nexpected_absent: provider, devops, partition-core-plus, .gitlab-ci.yml',
    },
    source: 'ownership',
  },
  mirror: {
    label: 'A customer mirror fork',
    title: 'The second tier copies the service repository, not upstream.',
    body: 'A customer forks osdu-spi-partition on GitHub and runs Adopt Fork instead of initialization. SYNC_MODE=mirror makes fork_upstream a verbatim copy of the service repository’s main, with Filter-Rev: mirror; template sync is off, because the service repository already carried it. A customer fix travels back as a pull request whose head is in the fork network.',
    artifact: {
      label: 'Two tiers, one difference',
      code: 'service repo:  upstream = community GitLab, SYNC_MODE=filter\nmirror fork:   upstream = Azure/osdu-spi-partition, SYNC_MODE=mirror',
    },
    source: 'forkTiers',
  },
  // View 05: a day in the fork.
  'sync-pr': {
    label: 'The sync PR',
    title: 'One PR per upstream state, never two.',
    body: 'Sync Upstream pushes a branch named sync/upstream-<timestamp> and opens a PR titled “Sync with upstream <version>” with a tracking issue labeled upstream-sync and human-required. If upstream moves before the PR merges, the workflow updates the same PR rather than opening another. The last evaluated upstream commit is remembered in a repository variable.',
    artifact: {
      label: 'What the run leaves behind',
      code: 'branch  sync/upstream-YYYYMMDD-HHMMSS\nPR      ⬆️ Sync with upstream <version>\nissue   <!-- upstream-sha: … -->  labels: upstream-sync, human-required\nvar     SYNC_LAST_EVALUATED_SHA=<sha>:<generation>',
    },
    source: 'synchronization',
  },
  'meta-commit': {
    label: 'The meta commit',
    title: 'One empty commit tells Release Please how big the change is.',
    body: 'Upstream commits are not conventional commits, so nothing in them says whether a sync is a patch or a feature. The sync classifies the whole range by rule, breaking over feat over fix, defaulting to fix, and writes an empty commit with that subject on the generated tree. Release Please reads that commit; the upstream history is not rewritten.',
    artifact: {
      label: 'The rule',
      code: 'breaking > feat > fix\nno conventional marker → fix:',
    },
    source: 'metaCommit',
  },
  'cascade-run': {
    label: 'Cascade Integration',
    title: 'The first build of the provider against the new shared code.',
    body: 'The cascade is where the fork-owned fix, already on main, and the upstream change, on fork_upstream, compile together. It is a workflow_dispatch run: a person starts it with the tracking issue number after merging the sync PR, and Cascade Monitor catches a forgotten one within six hours. It merges main first, then fork_upstream, builds -P core,azure with Java 17, and opens the integration PR when the build and tests pass. Coverage is reported, not gated.',
    artifact: {
      label: 'Cascade build',
      code: "mvn -B clean install -P ${{ vars.MAVEN_PROFILE || 'core,azure' }}",
    },
    source: 'cascade',
  },
  labels: {
    label: 'The labels',
    title: 'The labels are the state machine, and the audit trail.',
    body: 'The cascade removes human-required and adds cascade-active when it starts. A conflict or a failed validation swaps that for cascade-blocked; a failed run leaves cascade-failed plus human-required. Success removes all three and adds validated to the tracking issue as it opens the integration PR. Every six hours Cascade Monitor escalates anything blocked longer than 48 hours and retries anything whose human-required label a person has removed.',
    artifact: {
      label: 'Transitions',
      code: 'upstream-sync + human-required → cascade-active → validated\ncascade-active → cascade-blocked        (conflict or failed validation)\ncascade-active → cascade-failed + human-required\nremove human-required → cascade-active   (retry)',
    },
    source: 'cascadeMonitor',
  },
  'integration-pr': {
    label: 'The integration PR',
    title: 'The cascade proposes; a person approves.',
    body: 'A clean cascade opens a PR from release/upstream-<timestamp> into main, titled Upstream Integration to Main, carrying the combined tree. Review is asymmetric on purpose: the sync PR into fork_upstream carries a generated tree and is reviewed for what upstream changed, while this PR gets the same checks as any other change to main. It is not the release. Release Please opens a separate version PR after the merge.',
    artifact: {
      label: 'Two different PRs into main',
      code: 'release/upstream-<timestamp>  → main   the integration PR (cascade)\nrelease-please--branches--main → main  the version PR (Release Please)',
    },
    source: 'cascade',
  },
  'version-pr': {
    label: 'The version PR',
    title:
      'Release Please proposes a version; nothing ships until a person merges it.',
    body: 'Every push to main makes Release Please read the conventional commits since the last release, choose the bump from them, and open or update one PR with the new version and changelog. A fix: commit means a patch, a feat: commit a minor bump; the meta commit on a sync says how big the upstream part is. The cache fallback itself was titled “[Azure] Fixes for High API Error Count”, so the bump below is illustrative. This PR is separate from the integration PR and can wait as long as the team likes; the candidate digests already exist and dev1 has already been borrowed for them.',
    artifact: {
      label: 'What decides the bump',
      code: 'fix:   → patch   (illustrative)\nfeat:  → minor\nfeat!: → major\nchore:, docs: → no bump',
    },
    source: 'release',
  },
  conflict: {
    label: 'A blocked cascade',
    title: 'When the shared interface changes, the provider has to follow.',
    body: 'Suppose upstream renamed a method on the partition provider interface. fork_upstream generates cleanly, because it carries no provider. The cascade then fails to compile provider/partition-azure against the new interface: the tracking issue gets cascade-blocked and human-required and a validation-failed issue opens, no integration PR opens, and main is untouched. The fix is a provider change on fork_integration by the fork’s owner. Removing human-required tells the monitor to run the cascade again.',
    artifact: {
      label: 'Who acts, and the retry',
      code: 'labels: cascade-blocked, human-required\nfix on: fork_integration (provider/partition-azure)\nretry:  run Cascade Integration again\n        (removing human-required retries only cascade-failed)',
    },
    source: 'humanRequired',
  },
  candidate: {
    label: 'The candidate digest',
    title:
      'Every eligible commit gets an immutable image before anyone talks about releases.',
    body: 'Validation runs on the PR and again on the push to main. Each run builds build/Dockerfile and pushes ghcr.io/azure/osdu-spi-partition:sha-<commit>, which resolves to one digest. That digest, not a version, is what the stack borrows a slot for in view 06. Release tags are added to a sha-* image later, if a release happens at all; the digest tested on the PR and the digest on the merge commit are two different builds.',
    artifact: {
      label: 'One commit, one digest',
      code: 'docker-push: ghcr.io/azure/osdu-spi-partition:sha-<commit>\n             → sha256:<digest>   (the candidate)',
    },
    source: 'validation',
  },
  'dev1-slot': {
    label: 'A slot in dev1',
    title: 'The stack is borrowed for the candidate, not for the release.',
    body: 'After the push, Deploy Gate decides without credentials whether this run may borrow the environment: only push and pull_request events, only same-repository PRs, not Dependabot, not fork_upstream, and only when the five onboarding values, the descriptor, and a pushed image exist. If it may, the run pins the candidate digest into dev1’s image lock, checks the pod runs it, runs the declared suites, and restores the canonical image. View 06 follows that run step by step. The lane is the newer template’s; the reference partition fork has not adopted it or written its descriptor yet, so from here the example is illustrative.',
    artifact: {
      label: 'Who may borrow',
      code: 'push | pull_request (same repository)\nnot dependabot[bot], not fork_upstream\nonboarded + .spi/service.yaml + image pushed',
    },
    source: 'deployTest',
  },
  monitor: {
    label: 'Cascade Monitor',
    title: 'The scheduler that dispatches, retries, and escalates.',
    body: 'Every six hours the monitor looks at the tracking issues. A merged sync PR with no cascade yet is dispatched; a human-required label that a person removed is retried; anything blocked longer than 48 hours is escalated with a comment. Resetting fork_integration after a merge belongs to Integration Branch Cleanup, not the monitor. It is why the day view has no step called wait for the monitor.',
    artifact: {
      label: 'What it looks for',
      code: 'schedule: every 6 hours\nissue labels: upstream-sync, cascade-blocked, cascade-failed, human-required',
    },
    source: 'cascadeMonitor',
  },
  'release-tag': {
    label: 'The release tag',
    title: 'The version lands on an image that already exists.',
    body: 'Merging the version PR makes Release Please tag main and publish the release. The workflow adds <release-tag>-upstream-<upstream-version> which records the upstream version the release carries (on partition it reads upstream-v0.0.0, because the lookup expects an upstream main and partition’s is master), then polls GHCR for the sha-* image validation pushed for that commit and adds the semantic-version tag to it. No new build runs. The digest with the version tag is the merge commit’s build, which may differ from the digest a PR run borrowed dev1 for.',
    artifact: {
      label: 'Tags on one digest',
      code: 'ghcr.io/azure/osdu-spi-partition:sha-<commit>\nghcr.io/azure/osdu-spi-partition:v1.4.0\ngit tag v1.4.0-upstream-0.29.0',
    },
    source: 'release',
  },
  'template-pr': {
    label: 'The template-sync PR',
    title:
      'Workflow changes arrive as a reviewable diff, at most one at a time.',
    body: 'Sync Template compares the template commit recorded in .github/.template-sync-commit with the template’s main, and opens a PR titled chore(template-sync): sync template updates <date> for the configured paths. A later template change updates the same PR. The conventional title is required because validation gates PR titles.',
    artifact: {
      label: 'What arrives',
      code: 'PR    chore(template-sync): sync template updates <date>\nlabel template-sync\nfile  .github/.template-sync-commit',
    },
    source: 'templateSync',
  },
  'settings-apply': {
    label: 'Settings Apply',
    title: 'Repository settings are reconciled, not remembered.',
    body: 'Every Monday at 04:00 UTC the fork reapplies its rulesets from the JSON files the template delivered, checks that the onboarding variables are set, and reports GHCR package visibility. A ruleset someone loosened is tightened again. It cannot fix everything: a GHCR package flipped to private is reported, not repaired, and the pods see ErrImagePull until a person flips it back.',
    artifact: {
      label: 'What it reconciles',
      code: '.github/rulesets/default-branch.json\n.github/rulesets/integration-branch.json\nvars: AZURE_CLIENT_ID … SPI_STACK_CLUSTER',
    },
    source: 'workflowSystem',
  },
  // View 06: the handshake.
  gate: {
    label: 'Deploy Gate',
    title:
      'Decides whether this run may borrow the environment, without credentials.',
    body: 'The gate runs before any Azure login. Only push and pull_request events pass; it refuses PRs from other repositories, Dependabot, and fork_upstream, and it checks that the five onboarding values exist, .spi/service.yaml is present, Docker Push succeeded, and the descriptor declares a suite. A refusal is a visible notice and the summary stays green, which is why green is not deployment evidence.',
    artifact: {
      label: 'Skip reasons, verbatim',
      code: '<event> runs never borrow the environment\npull request from another repository carries no deploy identity\nfork_upstream builds no Azure image\nrepository is not onboarded to a stack (missing: …)\nno .spi/service.yaml declares the suites\nno image was pushed',
    },
    source: 'validation',
  },
  trust: {
    label: 'The deploy identity',
    title: 'The environment trusts a repository, never its pull requests.',
    body: 'spi onboard adds a federated credential on the environment’s deploy identity for the subject repo:<org>/<fork>:environment:spi-stack, at most 19 per identity. In the cluster the identity holds two Roles: spi-fork-deployer in osdu-flux may patch the image lock and nothing else; spi-fork-verifier in osdu may only read Deployments and Pods. Identities survive spi down so onboarded forks keep working across a rebuild.',
    artifact: {
      label: 'One command, five repository settings',
      code: 'spi onboard partition --repo <org>/osdu-spi-partition\n→ AZURE_CLIENT_ID, AZURE_TENANT_ID, AZURE_SUBSCRIPTION_ID\n→ SPI_STACK_RESOURCE_GROUP, SPI_STACK_CLUSTER',
    },
    source: 'forkRbac',
  },
  facts: {
    label: 'Environment facts',
    title:
      'The stack publishes what the run needs. Nothing is pushed into the repository.',
    body: 'spi status --json says whether the environment is deployable and, if not, exactly why, from a closed set of reasons. spi info --json supplies the gateway URL, the partition, the legal tag, and secret references. The run reads both every time, and reinstalls the exact spi release the environment records, so the client always matches the environment it is talking to.',
    artifact: {
      label: 'Reasons the run can see',
      code: 'deployable: false\nreason.code: kustomization_not_ready | maintenance |\n             missing_deploy_record | bootstrap_failed | bootstrap_pending',
    },
    source: 'statusContract',
  },
  descriptor: {
    label: 'The descriptor',
    title: 'The fork declares what its suites need; it never says where.',
    body: '.spi/service.yaml names each suite, the image that runs it, its timeout, and the bindings it wants: a gateway URL, a partition, a token. The resolver in the run binds those from environment facts and minted tokens. The service repository owns this file; template sync excludes it. osdu-spi-partition has not written one yet, and its checkout does not carry the gate either, so the run shown here is illustrative for that fork. The example below is the shape the runbook gives.',
    artifact: {
      label: 'One suite, declared',
      code: 'tests:\n  acceptance:\n    path: partition-acceptance-test\n    timeoutMinutes: 15\n    bindings:\n      HOST: { source: gateway }\n      DATA_PARTITION_ID: { source: partition }\n      PRIVILEGED_USER_TOKEN: { source: token }',
    },
    source: 'descriptor',
  },
  verify: {
    label: 'Verify',
    title: 'The pod is running the digest, or the run stops here.',
    body: 'After the pin, the run polls spi service verify for up to 15 minutes. The CLI checks the Deployment template, a running pod’s imageID, and rollout completion. lock_mismatch fails immediately: somebody else changed the lock. There is no second verify before each suite, so a replacement after this point is not caught by it.',
    artifact: {
      label: 'What verify compares',
      code: 'lock:  PARTITION_IMAGE_DIGEST=sha256:…\npod:   status.containerStatuses[].imageID\nrollout: complete',
    },
    source: 'forkDeploy',
  },
  restore: {
    label: 'Restore',
    title: 'Give the slot back, but only if it is still yours.',
    body: 'The last step runs even after a failure. spi service reset --if-run <run-id> writes the recorded canonical image back into the lock only while the annotation still names this run; a newer run’s pin is left alone and the reset exits 2, treated as success. A push test does not leave its candidate installed; advancing the canonical image is the environment’s refresh policy, not the lane’s.',
    artifact: {
      label: 'Ownership-aware restore',
      code: 'spi service reset partition --if-run $GITHUB_RUN_ID\nexit 0  restored\nexit 2  not the owner, or no pin: treated as success',
    },
    source: 'ephemeralPins',
  },
  'lock-taken': {
    label: 'Another run owns the pin',
    title: 'Restore is a claim about this run, not about the environment.',
    body: 'Suppose a second partition run pinned its own candidate while this one was still proving. The lock annotation now names the newer run id. This run’s reset --if-run compares ids, finds it is not the owner, writes nothing, and exits 2, which the lane treats as success. The newer run will restore the canonical image when it finishes. The concurrency group makes this rare, but the rule is what makes a lost runner safe: no run can put back an image over someone else’s pin.',
    artifact: {
      label: 'The comparison',
      code: 'annotation spi-stack.osdu.dev/pins: {"partition": {"run_id": "9902", …}}\nthis run:  --if-run 9901   → exit 2, nothing written',
    },
    source: 'ephemeralPins',
  },
};
