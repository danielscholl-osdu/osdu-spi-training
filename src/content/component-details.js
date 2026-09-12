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
    body: 'Community service images resolve from the OSDU GitLab registry. A service fork publishes to ghcr.io/<owner>/<service>, using the short service name. The provisioned ACR is a possible future mirror; it is not the source in this flow.',
    artifact: {
      label: 'A fork package',
      code: 'ghcr.io/azure/partition@sha256:<digest>',
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
    title: 'The Azure provider resolves the backend work.',
    body: 'Shared service code calls a Service Provider Interface. The Azure implementation uses the partition service to resolve the requested partition’s backends and accesses Azure through Workload Identity. This implementation ships inside the service image, not as a separate network hop.',
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
    title: 'Entitlements uses the shared Gremlin backend.',
    body: 'The entitlements graph lives in Cosmos DB Gremlin, shared by the environment. Common Storage is shared too. Partition-specific Azure resources do not imply isolation between service identities: OSDU workloads share one managed identity.',
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
    label: 'Three readiness signals',
    title: 'CLI success is the first signal, not the last.',
    body: 'Check configured workload health and initialization completion with spi status --watch, then discover endpoints with spi info --show-apis. An authenticated response proves the particular API path you exercised. A pod in Running phase and a completed Job are different signals.',
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
    title: 'Upstream still owns the common service behavior.',
    body: 'Sync regenerates fork_upstream from the shared upstream tree and injects references to the Azure modules. Azure source is absent on that branch, so its validation builds core only. Azure compilation happens when the trees meet on fork_integration.',
    artifact: {
      label: 'Integration path',
      code: 'fork_upstream → fork_integration → main',
    },
    source: 'ownership',
  },
  azureimpl: {
    label: 'Fork-owned source',
    title: 'Azure source is seeded once and maintained in the fork.',
    body: 'ADR-038 responds to upstream’s plan to remove its Azure implementations. provider/<svc>-azure and testing/<svc>-test-azure remain on fork_integration and main, outside the generated upstream tree. Late upstream Azure fixes need an explicit port.',
    artifact: {
      label: 'Reference fork-owned paths',
      code: 'provider/partition-azure/\ntesting/partition-test-azure/',
    },
    source: 'ownership',
  },
  azureclients: {
    label: 'Inside the provider',
    title: 'Azure client compatibility is part of the implementation.',
    body: 'Workload Identity provides tokens, but each backend client must support identity-based authentication. DISABLED key placeholders expose clients that still require keys or SAS; infrastructure does not supply a working connection-string fallback.',
    artifact: {
      label: 'A concrete compatibility check',
      code: 'indexer-queue → Service Bus subscription client',
    },
    source: 'identity',
  },
  upstream: {
    label: 'OSDU community',
    title: 'Shared changes enter through a generated branch.',
    body: 'Filtered sync keeps shared code and removes provider implementations from fork_upstream. Cascade merges into fork_integration with fork-owned Azure source and stamps upstream-derived Maven versions. Customer mirror forks consume the service fork’s main verbatim, using a different sync mode.',
    artifact: {
      label: 'Read the branch roles',
      code: 'fork_upstream: generated shared tree\nfork_integration: shared + Azure\nmain: reviewed release line',
    },
    source: 'branches',
  },
  repo: {
    label: 'One fork per service',
    title: 'The partition fork is a concrete place to begin.',
    body: 'osdu-spi-partition is the reference service fork. Each service repository has its own branch topology, Azure source, acceptance descriptor, and GHCR package. Provider changes belong in that service repository; the engineering-system repository supplies shared automation.',
    artifact: {
      label: 'Reference fork and descriptor',
      code: 'Azure/osdu-spi-partition\n.spi/service.yaml',
    },
    source: 'forkDeploy',
  },
  engineering: {
    label: 'osdu-spi',
    title: 'Shared workflows keep the service forks maintainable.',
    body: 'The template distributes synchronization, cascade, build, and validation machinery. Its upstream filter is in .github/actions/upstream-filter; fork validation is supplied from .github/template-workflows/validate.yml. Changes to that machinery belong in osdu-spi.',
    artifact: {
      label: 'Engineering-system source',
      code: '.github/actions/upstream-filter/\n.github/template-workflows/validate.yml',
    },
    source: 'engineering',
  },
  image: {
    label: 'Build artifact',
    title: 'A fork build publishes a GHCR image by digest.',
    body: 'The package uses the short service name: ghcr.io/<owner>/partition, even if the repository is osdu-spi-partition. Publishing an image does not install it into a stack. The deploy lane must pin and verify that digest.',
    artifact: {
      label: 'Example image identity',
      code: 'ghcr.io/azure/partition@sha256:<digest>',
    },
    source: 'forkDeploy',
  },
  'stack-source': {
    label: 'osdu-spi-stack',
    title: 'This repository owns the runtime mechanism.',
    body: 'infra/ defines Azure provisioning. software/ defines charts and workload configuration. The CLI owns the image-lock pin, verify, and reset operations used by fork validation. A shared environment runs a selected stack release independently of a candidate service image.',
    artifact: {
      label: 'Two kinds of desired state',
      code: 'infra/ → Azure resources\nsoftware/ → Kubernetes workloads',
    },
    source: 'architecture',
  },
  running: {
    label: 'Shared running environment',
    title: 'Several service forks can use the same stack.',
    body: 'Eligible deploy lanes wait for the environment’s deployable verdict before pinning an image. The lane then verifies rollout and the running digest. A green workflow with a skipped deploy gate does not establish live acceptance coverage.',
    artifact: {
      label: 'Read deployment eligibility',
      code: 'spi status --json',
    },
    source: 'forkDeploy',
  },
  delivery: {
    label: 'Deploy handoff',
    title: 'The image lock connects a build to the runtime.',
    body: 'An ephemeral pin records the candidate digest and its owning workflow run in osdu-image-lock. Flux reconciles the changed lock. Verification checks the Deployment template, the running pod imageID, and rollout completion.',
    artifact: {
      label: 'The handoff artifact',
      code: 'kubectl get configmap osdu-image-lock -n osdu-flux -o yaml',
    },
    source: 'forkDeploy',
  },
  proof: {
    label: 'Borrow → prove → restore',
    title: 'A successful test run should return the borrowed environment.',
    body: 'The deploy lane runs the suites declared in .spi/service.yaml, then attempts reset with --if-run. Restoration changes the pin only while that run still owns it. A lost runner can strand a pin, so restoration is an operation to inspect, not a guarantee.',
    artifact: {
      label: 'Ownership-aware restoration',
      code: 'spi service reset <service> --if-run <run-id>',
    },
    source: 'proof',
  },
};
