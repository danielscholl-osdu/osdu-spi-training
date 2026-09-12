export const myths = [
  {
    id: 'finished-means-ready',
    theme: 'readiness',
    claim: 'The command finished, so it is ready.',
    reality:
      'A successful spi up exit means the orchestration completed. Flux is still converging, initialization Jobs may still be running, and schema loading alone carries a 150-minute deadline. Readiness is a later milestone the CLI does not wait for.',
    check: 'spi status --watch',
    source: 'lifecycle',
    route: '#bring-up/inspect?detail=readiness',
    routeLabel: 'The three readiness signals',
  },
  {
    id: 'suspended-means-frozen',
    theme: 'gitops',
    claim: 'GitOps is suspended, so nothing changes.',
    reality:
      'Suspension stops fetching new commits. The cached revision keeps being applied, so live edits to Flux-managed objects are reverted, external chart repositories keep their own schedules, and controllers keep running.',
    check: 'kubectl get gitrepository osdu-spi-stack-system -n osdu-flux',
    source: 'flux',
    route: '#running-stack/developer?detail=flux',
    routeLabel: 'Flux on the map',
  },
  {
    id: 'async-indexing-works',
    theme: 'identity',
    claim: 'Async indexing works with the default images.',
    reality:
      'The community indexer-queue builds a Service Bus connection string regardless of Workload Identity and reads the DISABLED placeholder. Records-changed indexing needs a Workload-Identity-capable replacement image.',
    check: 'kubectl get secret -n osdu | grep -i servicebus',
    source: 'entra',
    route: '#running-stack/request?detail=events',
    routeLabel: 'Service Bus on the request path',
  },
  {
    id: 'certificate-means-encrypted',
    theme: 'network',
    claim: 'There is a certificate, so the connection is encrypted.',
    reality:
      'Port 80 serves the API routes in every ingress mode and nothing redirects. A client that uses an http:// URL sends its bearer token in plaintext, even when a Let’s Encrypt certificate exists.',
    check: 'spi info --show-apis   # use the https:// endpoint',
    source: 'gateway',
    route: '#running-stack/request?detail=gateway',
    routeLabel: 'The gateway',
  },
  {
    id: 'profiles-save-money',
    theme: 'estate',
    claim: 'Profiles save money.',
    reality:
      'bare, minimal, and core select Kubernetes workloads. All three provision the full Azure estate, including the cluster and every PaaS service. A bare deployment simply has nothing running on top.',
    check: 'spi up --env dev1 --profile minimal   # same Azure bill',
    source: 'architecture',
    route: '#field-guides?guide=profiles',
    routeLabel: 'Three profiles, one estate',
  },
  {
    id: 'role-assignment-missing',
    theme: 'identity',
    claim: 'The role assignment is missing.',
    reality:
      'Cosmos DB data-plane grants are Cosmos-native assignments that do not appear in standard Azure role-assignment queries, and propagation can lag five to fifteen minutes. Services cache clients at startup, so a fresh grant may need a pod restart.',
    check:
      'az cosmosdb sql role assignment list --account-name <account> -g spi-stack-dev1',
    source: 'entra',
    route: '#running-stack/developer?detail=cosmos',
    routeLabel: 'Cosmos DB on the map',
  },
  {
    id: 'delete-secret-rotates',
    theme: 'identity',
    claim: 'Deleting the Secret rotates the password.',
    reality:
      'The chart consumes the CLI-created Secret, and the CLI reuses the persistent credential seed. You get the same password back. Deleting the seed itself is worse: a later spi up can generate values the running middleware does not know.',
    check: 'kubectl get secret spi-secrets -n osdu-flux',
    source: 'secrets',
    route: '#running-stack/developer?detail=vault',
    routeLabel: 'Key Vault and seed Secrets',
  },
  {
    id: 'reapply-retries',
    theme: 'gitops',
    claim: 'Re-applying the manifest will retry it.',
    reality:
      'A HelmRelease that has exhausted its remediation retries is marked Stalled with reason RetriesExceeded. The controller reacts to a generation change, and identical content does not change the generation.',
    check: 'kubectl get helmrelease -n osdu   # look for RetriesExceeded',
    source: 'flux',
    route: '#running-stack/developer?detail=flux',
    routeLabel: 'Reconciliation on the map',
  },
  {
    id: 'smoke-proves-api',
    theme: 'readiness',
    claim: 'The smoke test passed, so the API works.',
    reality:
      'The scheduled smoke test defaults to the bare profile, which deploys no OSDU services at all. It proves infrastructure and GitOps readiness. Even a non-bare run proves the network and TLS path, not authenticated API behavior.',
    check: 'gh workflow run smoke.yml --ref main -f profile=core',
    source: 'smoke',
    route: '#bring-up/inspect?detail=caller',
    routeLabel: 'Make an authenticated call',
  },
  {
    id: 'teardown-green-means-deleted',
    theme: 'estate',
    claim: 'The teardown job was green, so it was deleted.',
    reality:
      'The CI teardown step requests resource-group deletion asynchronously and tolerates failure. Green means the request was made. A separate orphan sweeper exists precisely because that is not enough.',
    check: 'az group list --tag spi-name-suffix --output table',
    source: 'smoke',
    route: '#bring-up/remove',
    routeLabel: 'Removing the stack',
  },
];

// Grouping for the page, each pointing at the view where the concept was built.
export const mythThemes = [
  {
    id: 'readiness',
    title: 'Readiness and proof',
    built: { label: '02 · How it comes to life', href: '#bring-up/inspect' },
  },
  {
    id: 'gitops',
    title: 'GitOps and reconciliation',
    built: { label: '02 · How it comes to life', href: '#bring-up/reconcile' },
  },
  {
    id: 'identity',
    title: 'Identity and data access',
    built: { label: '03 · The SPI boundary', href: '#spi-boundary' },
  },
  {
    id: 'network',
    title: 'The front door',
    built: { label: '01 · What is a stack?', href: '#running-stack/request' },
  },
  {
    id: 'estate',
    title: 'The Azure estate',
    built: { label: '01 · What is a stack?', href: '#running-stack' },
  },
];
