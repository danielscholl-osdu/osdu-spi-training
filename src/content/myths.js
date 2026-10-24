// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export const myths = [
  {
    id: 'run-succeeded-means-stored',
    owner: 'you',
    theme: 'readiness',
    claim: 'The run finished, so every record is stored.',
    reality:
      'When Storage refuses every record in a manifest, Osdu_ingest fails the run. When it refuses only some, because of a rejected legal tag or an ACL in another domain, the run still finishes and the skipped records appear only in the task log. For an existing run, read each record it sent back from the OSDU Storage API and check its data and createUser. The command below creates and retains new proof instead: two Workflow runs and a new record. Its preflight rejects invalid legal tags when Legal allows validation; otherwise Legal is “not checked” and the smoke continues.',
    correction:
      'A finished ingestion run does not prove that Storage wrote every record.',
    check: 'spi test dags --as me --report',
    source: 'coreDagInputs',
    route: '#core-dags?detail=dag-storage&claim=2',
    routeLabel: 'Storage read-back on the map',
  },
  {
    id: 'deployable-means-loaded',
    owner: 'cli',
    theme: 'readiness',
    claim: "It's Deployable, so the data is there.",
    reality:
      'Bring-up registers the schemas and writes no records. Reference data is loaded by spi load, which runs after the environment is Deployable and never changes ready or deployable, so a search suite on a fresh environment can find nothing, and nothing says why unless you read the loads. A complete load means Storage accepted the records; the indexer may still be working.',
    correction:
      'Deployable says an environment can take a deploy; the loads say what data it holds.',
    check: 'spi load --status',
    source: 'namedLoads',
    route: '#ready-not-loaded?detail=load-loads&claim=0',
    routeLabel: 'The loads on the map',
  },
  {
    id: 'finished-means-ready',
    owner: 'flux',
    theme: 'readiness',
    claim: 'The command finished, so it is ready.',
    reality:
      'A successful spi up exit means orchestration completed without a fatal error; it does not establish API readiness. Flux reconciliation and initialization Jobs may still be working, and spi status --watch follows them but does not make an API call. A successful authenticated request verifies only the path exercised. The schema Job’s 150-minute value is a deadline, not an expected wait.',
    correction:
      'A successful spi up exit proves orchestration completed, not that an API is ready.',
    check: 'spi status --watch',
    source: 'lifecycle',
    route: '#your-environment?detail=env-status&claim=1',
    routeLabel: 'spi status on the map',
    here: { 'bring-up': '#bring-up/inspect?detail=readiness' },
  },
  {
    id: 'suspended-means-frozen',
    owner: 'flux',
    theme: 'gitops',
    claim: 'GitOps is suspended, so nothing changes.',
    reality:
      'Suspension stops fetching new commits. The cached revision keeps being applied, so live edits to Flux-managed objects are reverted, external chart repositories keep their own schedules, and controllers keep running.',
    correction:
      'Suspension stops fetching new commits, but Flux keeps applying its cached revision.',
    check: 'kubectl get gitrepository osdu-spi-stack-system -n osdu-flux',
    source: 'flux',
    route: '#running-stack/developer?detail=flux',
    routeLabel: 'Flux on the map',
    here: { 'bring-up': '#bring-up/reconcile?detail=flux' },
  },
  {
    id: 'async-indexing-works',
    owner: 'cli',
    theme: 'identity',
    claim: 'Async indexing works with the default images.',
    reality:
      'The community indexer-queue builds a Service Bus connection string regardless of Workload Identity and reads the DISABLED placeholder. Records-changed indexing needs a Workload-Identity-capable replacement image.',
    correction:
      'Records-changed indexing needs a Workload-Identity-capable replacement image.',
    check:
      'az keyvault secret list --vault-name <vault> --query "[?ends_with(name,`sb-connection`)].name"',
    source: 'entra',
    route: '#running-stack/request?detail=events',
    routeLabel: 'Service Bus on the request path',
  },
  {
    id: 'certificate-means-encrypted',
    owner: 'flux',
    theme: 'network',
    claim: 'There is a certificate, so the connection is encrypted.',
    reality:
      'Port 80 serves the API routes in every ingress mode and nothing redirects. A client that uses an http:// URL sends its bearer token in plaintext, even when a Let’s Encrypt certificate exists.',
    correction:
      'Port 80 still serves API routes without redirecting clients to HTTPS.',
    check: 'spi info --show-apis   # use the https:// endpoint',
    source: 'gateway',
    route: '#running-stack/request?detail=gateway',
    routeLabel: 'The gateway',
  },
  {
    id: 'stack-is-only-aks',
    owner: 'cli',
    theme: 'estate',
    claim: 'The stack is just AKS.',
    reality:
      'AKS runs the Kubernetes workloads, while the same resource group also contains Azure data services outside the cluster. For opendes, those resources include Cosmos DB, Storage, and Service Bus.',
    correction:
      'The resource group contains Azure data services alongside AKS.',
    check: 'az resource list -g spi-stack-<name> --output table',
    source: 'architecture',
    route: '#running-stack/developer?detail=environment',
    routeLabel: 'The stack boundary',
  },
  {
    id: 'profiles-save-money',
    owner: 'cli',
    theme: 'estate',
    claim: 'Profiles save money.',
    reality:
      'bare, minimal, and core select Kubernetes workloads. All three provision the full Azure estate, including the cluster and every PaaS service. A bare deployment simply has nothing running on top.',
    correction:
      'Profiles change Kubernetes workloads, not the Azure estate they provision.',
    check:
      'az resource list -g spi-stack-<name> --query "length(@)"   # same count under any profile',
    source: 'architecture',
    route: '#field-guides?guide=profiles',
    routeLabel: 'Three profiles, one estate',
    guideHere: { 'bring-up': 'profiles' },
  },
  {
    id: 'token-accepted-means-authorized',
    owner: 'flux',
    theme: 'identity',
    claim: 'The token was accepted, so the call is authorized.',
    reality:
      'The sidecar validates the JWT against the configured Entra issuers and projects x-app-id and x-user-id. That is authentication. The service still decides authorization: for most services that is an entitlements lookup, while the partition service admits app-only callers instead. A 401 or 403 alone does not say which of the two boundaries failed.',
    correction:
      'JWT validation authenticates the caller; each service still decides authorization.',
    check:
      'kubectl get requestauthentication spi-osdu-jwt-authn -n osdu -o yaml',
    source: 'identity',
    route: '#running-stack/request?detail=gateway',
    routeLabel: 'The gateway and its sidecar',
  },
  {
    id: 'role-assignment-missing',
    owner: 'cli',
    theme: 'identity',
    claim: 'The role assignment is missing.',
    reality:
      'Cosmos DB data-plane grants are Cosmos-native assignments that do not appear in standard Azure role-assignment queries, and propagation can lag five to fifteen minutes. Services cache clients at startup, so a fresh grant may need a pod restart.',
    correction:
      'Cosmos DB data-plane grants do not appear in standard Azure role-assignment queries.',
    check:
      'az cosmosdb sql role assignment list --account-name <account> -g spi-stack-<name>',
    source: 'entra',
    route: '#running-stack/developer?detail=cosmos',
    routeLabel: 'Cosmos DB on the map',
  },
  {
    id: 'delete-secret-rotates',
    owner: 'cli',
    theme: 'identity',
    claim: 'Deleting the Secret rotates the password.',
    reality:
      'Reconciliation does not regenerate a chart Secret, and the next spi up copies the same value back from the persistent seed. Deleting the seed itself is worse: a later spi up can generate values the running middleware does not know.',
    correction:
      'Deleting a chart Secret does not rotate the persistent seed value.',
    check: 'kubectl get secret spi-secrets -n osdu-flux',
    source: 'secrets',
    route: '#running-stack/developer?detail=vault',
    routeLabel: 'Key Vault and seed Secrets',
    here: { 'bring-up': '#bring-up/bootstrap?detail=vault' },
  },
  {
    id: 'users-add-accumulates',
    owner: 'cli',
    theme: 'identity',
    claim: 'Running spi users add again adds to the role I hold.',
    reality:
      'A role is one of four presets, and it is set, not accumulated. A second add with another role removes the other presets’ groups and adds this one’s; users stays. Going back to viewer removes users.datalake.impersonation, so ingestion as yourself stops.',
    correction: 'spi users add sets your role; it replaces the one you held.',
    check: 'spi users list',
    source: 'peopleAccess',
    route: '#who-is-asking?detail=ask-roles&claim=1',
    routeLabel: 'The role presets on the map',
  },
  {
    id: 'reapply-retries',
    owner: 'flux',
    theme: 'gitops',
    claim: 'Re-applying the manifest will retry it.',
    reality:
      'A HelmRelease that has exhausted its remediation retries is marked Stalled with reason RetriesExceeded, and re-applying the unchanged manifest does not move its generation. spi reconcile clears the failure count and forces one attempt; a terminal stall (a bad chart or CEL expression) needs a real change.',
    correction:
      'Re-applying an unchanged manifest does not reset an exhausted HelmRelease retry count.',
    check: 'flux get helmreleases -n osdu-flux   # look for RetriesExceeded',
    source: 'flux',
    route: '#running-stack/developer?detail=flux',
    routeLabel: 'Reconciliation on the map',
  },
  {
    id: 'smoke-proves-api',
    owner: 'you',
    theme: 'readiness',
    claim: 'The smoke test passed, so the API works.',
    reality:
      'The scheduled smoke test defaults to the bare profile, which deploys no OSDU services at all. It proves infrastructure and GitOps readiness. Even a non-bare run proves the network and TLS path, not authenticated API behavior.',
    correction:
      'The default bare smoke test proves infrastructure and GitOps readiness, not authenticated API behavior.',
    check:
      'gh run list --workflow smoke.yml --limit 5   # then open one: the profile input is bare unless set',
    source: 'smoke',
    route: '#bring-up/inspect?detail=caller',
    routeLabel: 'Make an authenticated call',
  },
  {
    id: 'teardown-green-means-deleted',
    owner: 'cli',
    theme: 'estate',
    claim: 'The teardown job was green, so it was deleted.',
    reality:
      'The CI teardown step requests resource-group deletion asynchronously and tolerates failure. Green means the request was made. A separate orphan sweeper exists precisely because that is not enough.',
    correction:
      'A green teardown means deletion was requested, not that the resource group is gone.',
    check: 'az group exists --name <resource-group-from-run>',
    source: 'smoke',
    route: '#bring-up/remove',
    routeLabel: 'Removing the stack',
  },
  {
    id: 'fork-is-a-snapshot',
    owner: 'fork',
    theme: 'fork',
    claim: 'A fork is a copy we took once and patch as we go.',
    reality:
      'The service fork keeps a relationship with upstream, not a copy of it. Every day the filter regenerates fork_upstream from the upstream tip, and the cascade carries that into the fork-owned tree. What the fork owns is a short list of paths, not the repository.',
    correction:
      'fork_upstream is regenerated from upstream daily; the fork owns only a short list of paths.',
    check: 'git log -1 --grep=Upstream-Sha --format=%B fork_upstream',
    source: 'ownership',
    route: '#fork-shape?detail=fork-upstream',
    routeLabel: 'The generated branch',
  },
  {
    id: 'merge-fork-upstream',
    owner: 'fork',
    theme: 'fork',
    claim:
      'When the sync conflicts, I merge upstream into fork_upstream by hand.',
    reality:
      'fork_upstream is generated, never merged into. A conflict is resolved on fork_integration, where the generated tree meets the fork-owned code. A hand merge on fork_upstream would be overwritten by the next generation and would put Azure paths into the merge base.',
    correction:
      'Conflicts are resolved on fork_integration because fork_upstream is generated.',
    check: 'git branch -r --contains fork_upstream | head',
    source: 'synchronization',
    route: '#fork-day/cascade?detail=fork-integration',
    routeLabel: 'The workspace branch',
  },
  {
    id: 'azure-profile-alone',
    owner: 'fork',
    theme: 'fork',
    claim: 'mvn -P azure builds the Azure provider.',
    reality:
      'The core profile is active by default and Maven drops it as soon as any -P is passed. Bare -P azure loses the core module and the provider fails to resolve it. CI always builds -P core,azure; on a first-tier fork_upstream it builds core only, because the generated tree has no Azure module.',
    correction: 'The provider build needs both core and Azure Maven profiles.',
    check: 'mvn -P core,azure -DskipTests package',
    source: 'mavenProfile',
    route: '#fork-day/cascade?detail=cascade-run',
    routeLabel: 'The cascade build',
  },
  {
    id: 'human-required-is-a-note',
    owner: 'fork',
    theme: 'fork',
    claim: 'human-required is a note for whoever looks next.',
    reality:
      'It is state. While the label is on the tracking issue nothing retries. For a failed cascade, removing it is the signal: the monitor relabels the issue cascade-active within six hours and runs the cascade again. For a blocked one, fix on fork_integration and run Cascade Integration again. Fixing the conflict without doing either leaves the fork stopped.',
    correction:
      'Nothing retries while the human-required label remains on the tracking issue.',
    check: 'gh issue list --label human-required --label cascade-failed',
    source: 'cascadeMonitor',
    route: '#fork-day/review?detail=labels',
    routeLabel: 'The labels on the map',
  },
  {
    id: 'release-rebuilds-image',
    owner: 'fork',
    theme: 'fork',
    claim: 'A release builds a fresh image for the version tag.',
    reality:
      'Validation already pushed an immutable sha-* image for the release commit. Release Please tags the commit; the release workflow waits for that image and adds the semantic-version tag to it. The bytes on the merge commit are the bytes that get the version; a PR run borrowed the stack for its own, earlier digest.',
    correction:
      'A release tags the immutable image already built for the release commit.',
    check:
      'gh api /orgs/Azure/packages/container/osdu-spi-partition/versions --jq \'.[].metadata.container.tags | select(any(test("^[0-9]")))\'',
    source: 'release',
    route: '#fork-day/release?detail=release-tag',
    routeLabel: 'The release moment',
  },
  {
    id: 'template-sync-overwrites',
    owner: 'fork',
    theme: 'fork',
    claim:
      'Template sync will overwrite the workflow change I made in my fork.',
    reality:
      'It opens a pull request. Once a day Sync Template proposes the template’s changes to main as one pull request labeled template-sync, and updates that same pull request if the template moves again. A local edit you want to keep shows there as a change to review, and nothing lands on main until a person merges.',
    correction:
      'Template sync proposes the template’s changes in a pull request; nothing lands on main until a person merges it.',
    check:
      'gh pr list -R Azure/osdu-spi-partition --label template-sync --state all',
    source: 'templateSync',
    route: '#changes-to-you?detail=chg-template-pr&claim=2',
    routeLabel: 'Template sync on the map',
    here: { 'fork-day': '#fork-day?detail=template-pr' },
  },
  {
    id: 'descriptor-comes-from-template',
    owner: 'fork',
    theme: 'fork',
    claim:
      'Template sync will deliver .spi/service.yaml along with the workflows.',
    reality:
      'It is excluded by name. The service repository writes its own descriptor, and changes to it are reviewed with the code. Workflows, actions, rulesets, and the Dockerfile arrive from osdu-spi; the descriptor never does. osdu-spi-partition wrote its own in September 2026.',
    correction:
      '.spi/service.yaml is excluded from template sync and belongs to the service repository.',
    check: 'jq .exclusions .github/sync-config.json   # in osdu-spi',
    source: 'descriptor',
    route: '#fork-shape?detail=descriptor-file',
    routeLabel: 'The descriptor row',
  },
  {
    id: 'acceptance-needs-a-release',
    owner: 'fork',
    theme: 'fork',
    claim: 'The stack only ever runs released versions of a fork.',
    reality:
      'A pull request from a branch in the fork and a push to main each push a sha-* digest when the service changes, and Deploy Gate lets that run borrow the stack for it. The cascade’s own push to fork_integration starts no run; an upstream change gets its image from the cascade’s pull request and the push to main. A release comes later and tags one of those digests, and its pull request can stay open while each merge is proved. For the push run on main, read its Deploy and Test job beside the latest release.',
    correction:
      'Pull requests from the fork and pushes to main deploy sha-* images in the stack before any release.',
    check:
      'gh release list -R Azure/osdu-spi-partition --limit 1\ngh run view <run-id> -R Azure/osdu-spi-partition --json jobs --jq \'.jobs[] | select(.name=="Deploy and Test") | [.name, .conclusion, .completedAt] | @tsv\'',
    source: 'deployTest',
    route: '#ship-it?detail=ship-release',
    routeLabel: 'The release on the map',
    here: { 'fork-day': '#fork-day/prove?detail=stack-slot' },
  },
  {
    id: 'validation-summary-means-deployed',
    owner: 'fork',
    theme: 'seam',
    claim:
      'Validation Summary is green, so the change ran in a real environment.',
    reality:
      'The deploy lane can skip with a visible reason and the summary still passes: the repository is not onboarded, there is no .spi/service.yaml, no image was pushed, or the run came from another repository. Deploy Gate reports which. Green is not evidence that the environment was borrowed.',
    correction:
      'A green summary can include a skipped deploy lane, so it does not prove the environment was borrowed.',
    check:
      'gh run view <run-id> -R Azure/osdu-spi-partition --json jobs --jq \'.jobs[] | select(.name=="Deploy Gate") | .databaseId\'\ngh run view --job <job-id> -R Azure/osdu-spi-partition --log | grep "Deploy and Test skipped"',
    source: 'validation',
    route: '#handshake?detail=gate',
    routeLabel: 'The gate on the map',
  },
  {
    id: 'restore-always-restores',
    owner: 'you',
    theme: 'seam',
    claim: 'The restore step puts the previous image back.',
    reality:
      'Only while this run still owns the pin. spi service reset --if-run compares the run id in the lock annotation with its own; a newer run’s pin is left alone and the reset exits 2, which the lane treats as success. A cancelled run or a lost runner strands the pin. An operator clears it with spi service reset --ephemeral --stale-only; the scheduled sweep that would run that command is designed, not yet wired.',
    correction:
      'Reset restores the previous image only while the run still owns the pin.',
    check:
      'kubectl -n osdu-flux get configmap osdu-image-lock -o jsonpath="{.metadata.annotations.spi-stack\\.osdu\\.dev/pins}"',
    source: 'ephemeralPins',
    route: '#handshake?detail=restore',
    routeLabel: 'The restore step',
  },
  {
    id: 'refresh-is-automatic',
    owner: 'you',
    theme: 'seam',
    claim: "My environment picks up the fork's new main on its own.",
    reality:
      'spi up chooses images once and keeps the lock on a rerun unless you ask for a refresh. Only the shared environment refreshes on a schedule. On a personal environment, spi info and spi status mark an old canonical, and GHCR retention can delete it once main has built past it, so the refresh is yours to run.',
    correction:
      'A personal environment keeps its images until you refresh them.',
    check: 'spi info',
    source: 'images',
    route: '#whose-image?detail=img-refresh&claim=1',
    routeLabel: 'The refresh on the map',
  },
  {
    id: 'passed-means-checked',
    owner: 'fork',
    theme: 'seam',
    claim: 'The suite passed, so every test checked something.',
    reality:
      'The verdict counts tests, and JUnit reports a test with an empty body as a pass. The report’s Hollow column counts the passing tests that prove nothing: the empty ones --report finds in the suite’s sources, and the ones --review grades as proving nothing against the service’s own API contract. Without a review, Hollow counts only the empty ones, and the scoreboard marks the service not reviewed.',
    correction:
      "A passing suite can hold tests that prove nothing; the report's Hollow count, with --review, says how many.",
    check: 'spi test partition --suite all --report --review',
    source: 'suiteReport',
    route: '#prove-from-desk?detail=desk-verdict&claim=0',
    routeLabel: 'The verdict on the map',
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
    built: { label: '103 · The SPI boundary', href: '#spi-boundary' },
  },
  {
    id: 'network',
    title: 'The front door',
    built: {
      label: '102 · Anatomy of a stack',
      href: '#running-stack/request',
    },
  },
  {
    id: 'estate',
    title: 'The Azure estate',
    built: { label: '102 · Anatomy of a stack', href: '#running-stack' },
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
