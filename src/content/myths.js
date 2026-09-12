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
    id: 'token-accepted-means-authorized',
    theme: 'identity',
    claim: 'The token was accepted, so the call is authorized.',
    reality:
      'The sidecar validates the JWT against the configured Entra issuers and projects x-app-id and x-user-id. That is authentication. The service still decides authorization from partition configuration and entitlements, and a 401 or 403 alone does not say which of the two boundaries failed.',
    check:
      'kubectl get requestauthentication spi-osdu-jwt-authn -n osdu -o yaml',
    source: 'identity',
    route: '#running-stack/request?detail=gateway',
    routeLabel: 'The gateway and its sidecar',
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
      'Reconciliation does not regenerate a chart Secret, and the next spi up copies the same value back from the persistent seed. Deleting the seed itself is worse: a later spi up can generate values the running middleware does not know.',
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
      'A HelmRelease that has exhausted its remediation retries is marked Stalled with reason RetriesExceeded, and re-applying the unchanged manifest does not move its generation. spi reconcile clears the failure count and forces one attempt; a terminal stall (a bad chart or CEL expression) needs a real change.',
    check: 'flux get helmreleases -n osdu-flux   # look for RetriesExceeded',
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
  {
    id: 'fork-is-a-snapshot',
    theme: 'fork',
    claim: 'A fork is a copy we took once and patch as we go.',
    reality:
      'The service fork keeps a relationship with upstream, not a copy of it. Every day the filter regenerates fork_upstream from the upstream tip, and the cascade carries that into the fork-owned tree. What the fork owns is a short list of paths, not the repository.',
    check:
      'git log -1 --format=%B fork_upstream | grep -E "Upstream-Sha|Filter-Rev"',
    source: 'ownership',
    route: '#fork-shape?detail=fork-upstream',
    routeLabel: 'The generated branch',
  },
  {
    id: 'merge-fork-upstream',
    theme: 'fork',
    claim:
      'When the sync conflicts, I merge upstream into fork_upstream by hand.',
    reality:
      'fork_upstream is generated, never merged into. A conflict is resolved on fork_integration, where the generated tree meets the fork-owned code. A hand merge on fork_upstream would be overwritten by the next generation and would put Azure paths into the merge base.',
    check: 'git branch -r --contains fork_upstream | head',
    source: 'synchronization',
    route: '#fork-day/cascade?detail=fork-integration',
    routeLabel: 'The workspace branch',
  },
  {
    id: 'azure-profile-alone',
    theme: 'fork',
    claim: 'mvn -P azure builds the Azure provider.',
    reality:
      'The core profile is active by default and Maven drops it as soon as any -P is passed. Bare -P azure loses the core module and the provider fails to resolve it. CI always builds -P core,azure; on a first-tier fork_upstream it builds core only, because the generated tree has no Azure module.',
    check: 'mvn -P core,azure -DskipTests package',
    source: 'mavenProfile',
    route: '#fork-day/cascade?detail=cascade-run',
    routeLabel: 'The cascade build',
  },
  {
    id: 'human-required-is-a-note',
    theme: 'fork',
    claim: 'human-required is a note for whoever looks next.',
    reality:
      'It is state. While the label is on the tracking issue nothing retries. Removing it is the signal: the monitor relabels the issue cascade-active within six hours and runs the cascade again. Fixing the conflict without removing the label leaves the fork stopped.',
    check: 'gh issue list --label human-required --label cascade-failed',
    source: 'cascadeMonitor',
    route: '#fork-day/review?detail=labels',
    routeLabel: 'The labels on the map',
  },
  {
    id: 'release-rebuilds-image',
    theme: 'fork',
    claim: 'A release builds a fresh image for the version tag.',
    reality:
      'Validation already pushed an immutable sha-* image for the release commit. Release Please tags the commit; the release workflow waits for that image and adds the semantic-version tag to it. The bytes that were tested are the bytes that get the version.',
    check:
      'gh api /orgs/Azure/packages/container/osdu-spi-partition/versions --jq ".[0].metadata.container.tags"',
    source: 'release',
    route: '#fork-day/release?detail=release-tag',
    routeLabel: 'The release moment',
  },
  {
    id: 'template-sync-overwrites',
    theme: 'fork',
    claim:
      'Template sync will overwrite the workflow change I made in my fork.',
    reality:
      'It opens a pull request. Sync Template compares the template commit range with the fork and proposes the difference as one PR labeled template-sync, updated in place if the template moves again. A local change you want to keep is a review comment, not a lost file.',
    check: 'gh pr list --label template-sync',
    source: 'templateSync',
    route: '#fork-day/template?detail=template-pr',
    routeLabel: 'The template PR',
  },
  {
    id: 'validation-summary-means-deployed',
    theme: 'seam',
    claim:
      'Validation Summary is green, so the change ran in a real environment.',
    reality:
      'The deploy lane can skip with a visible reason and the summary still passes: the repository is not onboarded, there is no .spi/service.yaml, no image was pushed, or the run came from another repository. Deploy Gate reports which. Green is not evidence that the environment was borrowed.',
    check:
      'gh run view --job "Deploy Gate" --log | grep "Deploy and Test skipped"',
    source: 'validation',
    route: '#handshake?detail=gate',
    routeLabel: 'The gate on the map',
  },
  {
    id: 'restore-always-restores',
    theme: 'seam',
    claim: 'The restore step puts the previous image back.',
    reality:
      'Only while this run still owns the pin. spi service reset --if-run compares the run id in the lock annotation with its own; a newer run’s pin is left alone and the reset exits 2, which the lane treats as success. A cancelled run or a lost runner can strand a pin until the stale sweep finds it.',
    check:
      'kubectl -n osdu-flux get configmap osdu-image-lock -o jsonpath="{.metadata.annotations.spi-stack\.osdu\.dev/pins}"',
    source: 'ephemeralPins',
    route: '#handshake?detail=restore',
    routeLabel: 'The restore step',
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
  {
    id: 'fork',
    title: 'The fork and its branches',
    built: { label: '04 · The shape of the fork', href: '#fork-shape' },
  },
  {
    id: 'seam',
    title: 'The seam',
    built: { label: '06 · The handshake', href: '#handshake' },
  },
];
