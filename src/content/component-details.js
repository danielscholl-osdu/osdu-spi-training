// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export const componentDetails = {
  'line-own': {
    label: 'Azure/osdu-spi-partition / the fork’s own paths',
    title:
      'The fork owns its Azure provider, its Azure tests, and the files that describe it.',
    body: 'Partition’s CONTRIBUTING.md names three owners, and the fork’s own share is short: provider/*-azure/, testing/*-test-azure/, .spi/, and a few files such as its CODEOWNERS and README. A change to them is a pull request in the fork; neither sync nor template sync writes over them.',
    artifact: {
      label: 'Where a change belongs',
      code: 'provider/*-azure/ · testing/*-test-azure/ · .spi/\n.github/upstream-filter.yml · .github/CODEOWNERS\nCONTRIBUTING.md · README.md',
    },
    source: 'partitionContributing',
    goDeeper: ['partitionCodeowners', 'ownership'],
  },
  'line-template': {
    label: 'Azure/osdu-spi-partition / workflows from the template',
    title: 'Every fork’s workflows come from one template.',
    body: 'Each service fork is created from the Azure/osdu-spi template and runs the same workflows. The template also owns the rest of .github/, build/, and the release configuration, and template sync proposes its updates to each fork every day at 08:00 UTC, one pull request at a time.',
    artifact: {
      label: 'How a fork is created',
      code: 'gh repo create <org>/<service> --template Azure/osdu-spi --public',
    },
    source: 'forkLifecycle',
    goDeeper: ['templateSync', 'workflowSystem'],
  },
  'line-community': {
    label: 'Azure/osdu-spi-partition / community code',
    title: 'The community’s code is regenerated from upstream every day.',
    body: 'Everything else in the tree is the community’s shared service code. Sync regenerates it from the upstream tip, keeps the shared modules, and drops other providers. Anything its filter cannot classify stops the sync and opens an issue for a person.',
    artifact: {
      label: 'The filter sync applies',
      code: '.github/upstream-filter.yml',
    },
    source: 'ownership',
    goDeeper: ['synchronization'],
  },
  'line-upstream': {
    label: 'OSDU community / upstream',
    title: 'Upstream is where the community changes shared code.',
    body: 'The community’s partition repository is the first station. Sync reads the tip of its default branch, and a change there reaches the fork through sync, or sooner when a fix is ported by hand. Upstream carries no Azure provider; that lives in the fork.',
    artifact: {
      label: 'The upstream repository',
      code: 'https://community.opengroup.org/osdu/platform/system/partition',
    },
    source: 'synchronization',
    goDeeper: ['ownership'],
  },
  'line-sync': {
    label: 'Azure/osdu-spi-partition / sync',
    title: 'Sync proposes upstream’s changes to the fork every day.',
    body: 'At midnight UTC the sync workflow fetches the upstream tip, regenerates the community’s code, and opens a pull request with a tracking issue. It proposes and never merges: a person merges the pull request, and that merge starts cascade.',
    artifact: {
      label: 'Its schedule',
      code: ".github/workflows/sync.yml\ncron: '0 0 * * *'  # Daily at midnight UTC",
    },
    source: 'synchronization',
    goDeeper: ['partitionSyncWorkflow'],
  },
  'line-cascade': {
    label: 'Azure/osdu-spi-partition / cascade',
    title: 'Cascade builds upstream’s changes with the fork’s own code.',
    body: 'Once a sync is merged, cascade combines main with the synced code, checks that the Azure provider and tests are still there, builds and tests the service with its Azure provider, and opens a pull request into main. A conflict or a failed build opens an issue for a person instead.',
    artifact: {
      label: 'Its workflow',
      code: '.github/workflows/cascade.yml',
    },
    source: 'cascade',
    goDeeper: ['branches'],
  },
  'line-main': {
    label: 'Azure/osdu-spi-partition / main',
    title: 'Main is the fork’s protected branch.',
    body: 'Cascade’s pull request lands here. So does a fork’s own change, such as a fix to its Azure provider, without visiting upstream, sync, or cascade. A push to main that changes code builds an image, and that image takes its turn in the lane.',
    artifact: {
      label: 'The image main last built',
      code: 'ghcr.io/azure/osdu-spi-partition:main-snapshot',
    },
    source: 'branches',
    goDeeper: ['images'],
  },
  'line-release': {
    label: 'Azure/osdu-spi-partition / release',
    title: 'A release tags an image that is already there.',
    body: 'Each push to main updates a release pull request with the next version and its changelog. When a person merges it, the release workflow creates the GitHub release, waits for the release commit’s image, and adds the version tag to that image. Nothing is rebuilt.',
    artifact: {
      label: 'The retag, in the release workflow',
      code: '# Registry-side retag: add :<version> to the release commit\'s image. No rebuild.\ndocker buildx imagetools create --tag "${REPO}:${VERSION}" "$SRC"',
    },
    source: 'release',
    goDeeper: ['partitionReleaseWorkflow'],
  },
  'line-image': {
    label: 'GHCR / ghcr.io/azure/osdu-spi-partition',
    title: 'Every eligible commit gets an image.',
    body: 'When the Java build passes on the fork’s own pull request or on a push to the integration workspace or main, the validation workflow builds the service image and pushes it to GHCR under the commit’s sha tag. That image, not a rebuild, is what the lane runs, and a release adds its version tag to the release commit’s image the same way.',
    artifact: {
      label: 'The tag a commit’s image carries',
      code: 'ghcr.io/azure/osdu-spi-partition:sha-<12>',
    },
    source: 'validation',
    goDeeper: ['ghcr'],
  },
  'line-lane': {
    label: 'Azure/osdu-spi-partition / the lane',
    title: 'In the lane, a new image takes a turn in a running stack.',
    body: 'Deploy and Test runs on the fork’s own pull requests and on pushes to the integration workspace and to main. It runs the new image in a stack and checks it with the service’s own tests. The run after a merge to main proves the image a stack runs by default. Only a release commit’s image is tagged before its turn: the release tags it as soon as it is pushed, and its turn follows.',
    artifact: {
      label: 'The lane’s jobs',
      code: '.github/workflows/validate.yml\nDeploy Gate · Deploy and Test',
    },
    source: 'proof',
    goDeeper: ['deployTest', 'partitionValidateWorkflow'],
  },
  'line-stack': {
    label: 'Azure / a running stack',
    title: 'A stack runs main’s image by default.',
    body: 'A service with no recorded source runs the image its fork’s main last published: the digest main-snapshot names, recorded under the sha tag of the commit that built it. The packages are public, so no trust record is needed.',
    artifact: {
      label: 'The default, from tag to digest',
      code: 'main-snapshot → sha-<12> → sha256:<digest>',
    },
    source: 'images',
  },
  'kinds-template': {
    label: 'Azure/osdu-spi / the template',
    title: 'One template gives every fork the same workflows.',
    body: 'Each service fork is created from Azure/osdu-spi and keeps receiving the template’s workflows, its build/ directory, and its release configuration through template sync: a pull request into main, opened every day at 08:00 UTC when the template has moved. A change to the line made here reaches every fork that way.',
    artifact: {
      label: 'Template sync’s schedule',
      code: ".github/workflows/sync-template.yml\ncron: '0 8 * * *'  # Daily at 08:00 UTC",
    },
    source: 'templateSync',
    goDeeper: ['workflowSystem'],
  },
  'kinds-stack': {
    label: 'Azure/osdu-spi-stack / the shared stack',
    title: 'The shared stack is where each new image takes its turn.',
    body: 'Azure/osdu-spi-stack holds the CLI and the definitions that build an environment. The shared environment the forks’ lanes run in is pinned to a stack release, and moving it to a newer one is a pull request a person merges.',
    artifact: {
      label: 'The shared environment’s declaration',
      code: 'ops/environments/shared.yaml',
    },
    source: 'pinnedEnv',
    goDeeper: ['architecture'],
  },
  'kinds-automation': {
    label: 'GitHub / automation',
    title: 'Automation opens much of the work.',
    body: 'The fork’s workflows open the sync, cascade, release, and template sync pull requests, and Dependabot opens dependency updates for the Azure modules. Only cascade arms auto-merge, and auto-merge waits for the approval main requires.',
    artifact: {
      label: 'Where the pull requests come from',
      code: 'sync.yml · cascade.yml · release.yml · sync-template.yml\n.github/dependabot.yml',
    },
    source: 'workflowSystem',
    goDeeper: ['cascade'],
  },
  'kinds-platform-work': {
    label: 'The line / platform work',
    title: 'Platform work changes what carries every service.',
    body: 'Changing the stack, the template’s workflows, or the shared environment changes the line under every service. That work lands in Azure/osdu-spi and Azure/osdu-spi-stack and reaches the forks through template sync and stack releases. It is the platform path’s work.',
    artifact: {
      label: 'Where platform work lands',
      code: 'Azure/osdu-spi · Azure/osdu-spi-stack',
    },
    source: 'engineering',
    goDeeper: ['architecture'],
  },
  'kinds-service': {
    label: 'Azure/osdu-spi-partition / the service',
    title: 'The product is what a service does for its callers.',
    body: 'Partition’s code, its tests, and the API its callers use are what the line carries. Its shared code comes from the community through sync; its Azure provider and Azure tests are the fork’s own, changed by pull requests into main.',
    artifact: {
      label: 'The service’s repository',
      code: 'Azure/osdu-spi-partition',
    },
    source: 'partitionRepo',
    goDeeper: ['partitionContributing'],
  },
  'kinds-provider': {
    label: 'Azure/osdu-spi-partition / the Azure provider',
    title: 'The Azure provider is the fork’s own code.',
    body: 'provider/partition-azure/ connects partition’s shared code to Azure services. The fork owns it, so a change to it is a pull request into the fork’s main, and nothing from upstream or the template writes over it.',
    artifact: {
      label: 'Where it lives',
      code: 'provider/partition-azure/',
    },
    source: 'partitionProvider',
    goDeeper: ['partitionContributing'],
  },
  'kinds-service-work': {
    label: 'The product / service work',
    title: 'Service work changes what a service does.',
    body: 'A new feature, a fix to the Azure provider, or a new test is service work: a pull request in the service’s fork, approved by its code owners and proved in the lane. It is the service path’s work.',
    artifact: {
      label: 'Where service work starts',
      code: 'Branch from main · open a pull request against main',
    },
    source: 'partitionContributing',
  },
  'kinds-sync-merge': {
    label: 'Azure/osdu-spi-partition / the sync pull request',
    title: 'A person merges the sync pull request.',
    body: 'Sync opens its pull request and a tracking issue at midnight UTC and then waits for a person. Merging it starts cascade. While it waits, the next day’s sync updates the same pull request instead of opening another.',
    artifact: {
      label: 'The step that waits',
      code: 'Waits for human review: the team merges the PR to continue the cascade',
    },
    source: 'synchronization',
  },
  'kinds-main-approval': {
    label: 'Azure/osdu-spi-partition / the gate before main',
    title: 'Nothing reaches main until a code owner approves it.',
    body: 'Main’s ruleset needs a code owner’s review, an approval given after the last push, every review thread resolved, and the CodeQL and Validation Summary checks green on a branch that is up to date. The fork’s CODEOWNERS names the owners, and one person cannot approve their own pull request.',
    artifact: {
      label: 'What merging needs',
      code: 'Passing CodeQL and validation checks, every review thread resolved, and a code owner’s approval.',
    },
    source: 'partitionContributing',
    goDeeper: ['partitionCodeowners', 'forkLifecycle', 'engineering'],
  },
  'kinds-release-call': {
    label: 'Azure/osdu-spi-partition / the release pull request',
    title: 'A person decides when a release is ready.',
    body: 'Release Please keeps one release pull request open with the next version and its changelog, updated on each push to main. A person merges it when the version and changelog are ready, and the release workflow then tags the image already built, without rebuilding.',
    artifact: {
      label: 'The person’s step, in the release guide',
      code: 'Merge the generated PR when the version and changelog are ready',
    },
    source: 'release',
  },
  'kinds-copilot': {
    label: 'GitHub / Copilot review',
    title: 'Copilot may review first; its review is never the approval.',
    body: 'Where the organization supports it, a ruleset asks Copilot to review each pull request into main on every push. Its review arrives as comments. The approval main needs comes from a code owner.',
    artifact: {
      label: 'How it shows on a pull request',
      code: 'copilot-pull-request-reviewer · Commented',
    },
    source: 'engineering',
  },
  'kinds-issue': {
    label: 'GitHub / an issue for a person',
    title: 'When the line cannot go on alone, it opens an issue for a person.',
    body: 'A sync that finds something its filter cannot classify stops and opens an issue. A cascade that hits a merge conflict or a failed build opens one that records the error and the recovery steps. Each waits for a person to fix the cause and start the line again.',
    artifact: {
      label: 'Where cascade records a failure',
      code: 'A dedicated issue records the error and the recovery steps',
    },
    source: 'cascade',
    goDeeper: ['synchronization'],
  },
  'dag-catalog': {
    label: 'Reviewed stack inputs',
    title: 'The catalog approves the code Airflow may run.',
    body: 'catalog.yaml declares spi-smoke (Echo_DAG, airflow_monitoring) and core-ingestion (Osdu_ingest, manifest_ingestion). Only selected files load. Stack reviewers approve full upstream commits and per-file SHA-256 hashes; hashes make inputs immutable, not authentic.',
    artifact: {
      label: 'Review the executable inputs',
      code: 'software/stacks/osdu/dags/catalog.yaml',
    },
    source: 'coreDagInputs',
  },
  'dag-loader': {
    label: 'platform / scheduler and DAG processor init',
    title: 'An unverified file holds the new pod in init.',
    body: 'load-osdu-dags fetches the reviewed commit, verifies each selected file against its SHA-256, and stages only cataloged files into dags/<family>/. A failed fetch or hash check exits 1. During a rolling update the old pod can keep serving until its replacement is ready; node loss or rescheduling has no old pod to retain.',
    artifact: {
      label: 'Read loader evidence',
      code: 'kubectl logs -n platform deployment/airflow-scheduler -c load-osdu-dags',
    },
    source: 'coreDagInputs',
    goDeeper: ['coreDagsDecision'],
  },
  'dag-processor': {
    label: 'platform / Airflow',
    title: 'The processor parses the staged catalog without OSDU authority.',
    body: 'The DAG processor uses a chart-created ServiceAccount without OSDU Workload Identity. Its init loader stages the selected files, then hash-locked Python libraries must install before parsing starts. A failed install never starts the parser; running pip alone must not mark the processor Ready.',
    artifact: {
      label: 'Locked startup libraries',
      code: '-r /opt/spi/osdu/requirements.txt --require-hashes --only-binary :all:',
    },
    source: 'coreDagsDecision',
    goDeeper: ['coreDagInputs'],
  },
  'dag-registration': {
    label: 'platform / separate registration Job',
    owner: 'Flux',
    title:
      'Layer 6 registers the exact fresh catalog without gating Deployable.',
    body: 'spi-osdu-dag-registration follows spi-airflow and spi-osdu-init. Its identity-using Job requires the exact declared non-stale DAG set, fresh parses since the Job started, and zero import errors. It registers system workflows and unpauses declared IDs; removed IDs are paused, never deleted. Failure leaves Deployable unchanged.',
    artifact: {
      label: 'Inspect the non-gating layer',
      code: 'kubectl get kustomization spi-osdu-dag-registration -n osdu-flux -o yaml',
    },
    source: 'coreDagRegistration',
  },
  'dag-caller': {
    label: 'Your workstation / signed-in person',
    title: 'The smoke creates proof without creating its prerequisites.',
    body: 'spi test dags --as me checks caller impersonation, registrations, schemas, legal validity when available, and ACL domains. It grants no role and creates no schema or legal tag. Echo runs before ingestion; both runs and the new record remain as evidence. --report presents the submitted and stored records together.',
    artifact: {
      label: 'Create and retain new ingestion evidence',
      code: 'spi test dags --as me --report',
    },
    source: 'coreDagInputs',
  },
  'dag-workflow': {
    label: 'osdu / Workflow API',
    title: 'Workflow derives the submitter from the caller token.',
    body: 'Workflow records the authenticated caller as submittedBy and derives the run userId; a supplied user ID is rejected. It triggers Airflow through the osdu-workflow login. The smoke supplies neither userId nor createUser, so Workflow and Storage must establish caller provenance rather than trust the manifest.',
    artifact: {
      label: 'Read the Workflow result',
      code: 'submittedBy · execution_context.userId',
    },
    source: 'coreDagsDecision',
    goDeeper: ['coreDagInputs'],
  },
  'dag-airflow-api': {
    label: 'platform / Airflow API server',
    title: 'The Airflow API accepts a login, not an OSDU credential.',
    body: 'Workflow reaches Airflow as osdu-workflow. The API server retains a chart-created ServiceAccount without OSDU Workload Identity; accepting a DAG run does not authorize an OSDU Storage write. The scheduler runs the task with separate OSDU authority.',
    artifact: {
      label: 'Airflow authentication endpoint',
      code: '/airflow/auth/token',
    },
    source: 'coreDagsDecision',
    goDeeper: ['coreDagRegistration'],
  },
  'dag-task': {
    label: 'platform / inside the scheduler pod',
    title: 'LocalExecutor runs task processes inside the scheduler.',
    body: 'Core uses LocalExecutor with parallelism 2 and allowPodLaunching: false, not separate task pods. The scheduler uses platform/workload-identity-sa; tasks share its CPU, memory, and OSDU identity. A scheduler restart stops its remaining tasks, and task logs are not durable.',
    artifact: {
      label: 'Scheduler execution contract',
      code: 'LocalExecutor · parallelism: 2 · allowPodLaunching: false',
    },
    source: 'coreDagsDecision',
  },
  'dag-storage': {
    label: 'osdu / Storage API',
    title: 'Only record read-back establishes the ingestion result.',
    body: 'The smoke reads the new record from the OSDU Storage API and requires matching data and createUser equal to the caller. Osdu_ingest fails when Storage refuses every record, but finishes when it refuses only some, for example a rejected legal tag or an ACL in another domain. To inspect an existing run, read back each of its records; rerunning the smoke creates different evidence.',
    artifact: {
      label: 'Required read-back evidence',
      code: 'stored.data = submitted.data\nstored.createUser = authenticated caller',
    },
    source: 'coreDagInputs',
  },
  'dag-caller-token': {
    label: 'Caller → Workflow',
    title: 'Your token authenticates the first API call.',
    body: '--as me uses the signed-in person’s Azure CLI token, as spi token --me does. The token identifies the caller to Workflow; it is not the osdu-workflow Airflow login and is not embedded in the one-record manifest.',
    artifact: {
      label: 'Caller selection',
      code: 'spi test dags --as me',
    },
    source: 'coreDagInputs',
  },
  'dag-airflow-login': {
    label: 'Workflow → Airflow API',
    title: 'The Airflow User role grants no OSDU authority.',
    body: 'The osdu-workflow login authenticates to Airflow with role User. Registration reads its password from platform/airflow-api-credentials#workflow-password. This login permits the Airflow interaction, not a Storage write; the scheduler’s OSDU identity is a different credential.',
    artifact: {
      label: 'Airflow login reference, not a secret value',
      code: 'osdu-workflow · platform/airflow-api-credentials#workflow-password',
    },
    source: 'coreDagRegistration',
  },
  'dag-osdu-identity': {
    label: 'Scheduler task → Storage',
    title: 'Delegation requires two separate memberships.',
    body: 'The task sends the OSDU identity’s token plus on-behalf-of naming the run’s caller. The identity needs users.datalake.delegation; the caller needs users.datalake.impersonation. spi users editor, admin, and ops grant caller impersonation, but viewer does not. Existing people may need their intended preset reapplied; spi up enrolls no operator.',
    artifact: {
      label: 'Illustrative provenance header',
      code: 'on-behalf-of: <you>\nidentity: users.datalake.delegation\ncaller: users.datalake.impersonation',
    },
    source: 'coreDagsDecision',
  },
  'img-fork': {
    label: 'GitHub / the Azure service fork',
    title: 'Each merge to the fork’s main builds the image the stack runs.',
    body: 'Every service has an Azure/osdu-spi-<service> repository that carries the Azure provider and publishes its main line to GHCR. In the example, partition’s tag names commit 8aa26ca007ad on main, a merged upstream integration. The community registry is not a source: its images don’t carry the Azure provider.',
    artifact: {
      label: 'Read the commit a tag names',
      code: 'gh api repos/Azure/osdu-spi-partition/commits/<12-char sha> --jq .commit.message',
    },
    source: 'images',
  },
  'img-ghcr': {
    label: 'GHCR / ghcr.io/azure/osdu-spi-<service>',
    title: 'main-snapshot names the build; the sha tag names its commit.',
    body: 'Each package carries a main-snapshot pointer and a sha-<12> tag on the same digest. spi up records the digest main-snapshot names under the tag of the commit that built it. The packages are public, so no trust record is needed; a missing or private package fails resolution and never falls back to another source.',
    artifact: {
      label: 'Resolve a tag to its digest',
      code: 'docker buildx imagetools inspect ghcr.io/azure/osdu-spi-partition:sha-<12>',
    },
    source: 'images',
    goDeeper: ['imageLock'],
  },
  'img-retention': {
    label: 'GHCR / the fork’s retention',
    title: 'Retention can delete an old sha image once main has built past it.',
    body: 'Each fork prunes its sha-* versions weekly once they are more than 30 days old. A version main-snapshot still names is kept, so an image ages out only after main has built past it. The CLI marks a canonical at 21 days, which leaves nine before retention can delete it.',
    artifact: {
      label: 'The window, in days',
      code: '21: spi info and spi status mark the build\n30: weekly retention can delete it',
    },
    source: 'images',
    goDeeper: ['deployedSuites', 'imagePins'],
  },
  'img-resolve': {
    label: 'Your workstation / spi up',
    title: 'spi up resolves each canonical once, then keeps the lock.',
    body: 'With no lock, spi up asks GHCR, for each of thirteen forks, which digest main-snapshot names, and records it under the commit’s sha-<12> tag. Schema’s loader, osdu-spi-schema-load, comes from schema’s commit, which makes fourteen lock entries. A rerun keeps an existing lock unless --refresh-images is given. An environment can record a trusted mirror for one service with spi onboard --canonical-source fork.',
    artifact: {
      label: 'Resolve again on purpose',
      code: 'spi up --env <name> --refresh-images',
    },
    source: 'images',
    goDeeper: ['imageLock'],
  },
  'img-info': {
    label: 'Your workstation / spi info',
    title: 'spi info reads the lock, one row per entry.',
    body: 'The OSDU Service Versions table shows Image, Built, and Source for each lock entry. Image is what runs now, its tag cut to 12 characters; Source is the policy the next refresh resolves, and (next refresh) marks a running image that predates it. An unpinned canonical built more than 21 days ago shows its Built date in the warning color.',
    artifact: {
      label: 'The same rows as data',
      code: 'spi info --json | jq .osdu_versions',
    },
    source: 'imagePins',
    goDeeper: ['statusContract'],
  },
  'img-refresh': {
    label: 'Your workstation / spi service refresh',
    title: 'On a personal environment, the refresh is yours to run.',
    body: 'spi service refresh <service> re-resolves one service to the digest main-snapshot names now, and --forks re-resolves every service. Once a build passes 21 days, spi status prints the refresh it needs. The shared environment runs env-refresh every weekday at 04:00 UTC; no schedule refreshes a personal environment. Pinned services are not marked.',
    artifact: {
      label: 'Move every canonical forward',
      code: 'spi service refresh --forks',
    },
    source: 'images',
    goDeeper: ['envRefresh', 'imagePins'],
  },
  'img-lock': {
    label: 'osdu-flux / ConfigMap osdu-image-lock',
    title: 'The lock keeps the digest; the tag beside it can move.',
    body: 'osdu-image-lock records each service’s repository, sha-<12> tag, digest, and build date. Flux substitutes the entry into each service, whose chart renders repository@digest, so a tag repushed on GHCR changes nothing that runs. In the example, partition’s entry is ghcr.io/azure/osdu-spi-partition, sha-8aa26ca007ad, sha256:ace8c625….',
    artifact: {
      label: 'Read partition’s entry',
      code: 'kubectl -n osdu-flux get configmap osdu-image-lock -o yaml | grep PARTITION_IMAGE',
    },
    source: 'imageLock',
  },
  'img-pods': {
    label: 'osdu / partition pods',
    title: 'The pods run the digest the lock recorded.',
    body: 'spi status lists each OSDU pod with its image as osdu-spi-<service>@sha256:…. In the example, both partition pods run sha256:ace8c625…, the digest the lock holds and the sha-8aa26ca007ad tag points at on GHCR. A pod names the digest, not the tag.',
    artifact: {
      label: 'See what each pod runs',
      code: 'spi status',
    },
    source: 'imageLock',
  },
  'ask-me-token': {
    label: 'Your workstation / your own token',
    title: 'spi token --me prints your own Azure token.',
    body: 'It is the token your az sign-in holds for the environment’s token audience: a v1 token for https://management.azure.com on a default stack. Plain spi token mints the deploy identity instead, and --member and --no-access mint the other two seeded identities. Until you are a member, a call with your own token is refused.',
    artifact: {
      label: 'Call as yourself',
      code: 'curl -H "Authorization: Bearer $(spi token --me)" -H \'data-partition-id: opendes\' https://<gateway>/api/entitlements/v2/groups',
    },
    source: 'peopleAccess',
  },
  'ask-deploy-token': {
    label: 'Your workstation / seeded identity',
    title: 'Plain spi token borrows the deploy identity.',
    body: 'The deploy identity sits in users.datalake.ops, which entitlements lets manage any group, so every call made with plain spi token was the platform’s, never yours. spi users writes people’s groups with this token. Anyone who can mint it can already call every API as an operator, so granting a person a role adds no authority.',
    artifact: {
      label: 'Mint the deploy identity',
      code: 'spi token',
    },
    source: 'peopleAccess',
    goDeeper: ['forkRbac'],
  },
  'ask-mesh': {
    label: 'osdu / the mesh’s identity filter',
    title:
      'The mesh authenticates your token and names you; it does not authorize.',
    body: 'spi-osdu-jwt-authn accepts the v1 issuer for the management audience, and the spi-osdu-identity-filter Lua on each service’s sidecar writes x-user-id from unique_name, else appid, else upn. For a person on a default stack that is unique_name, which is neither the object id nor reliably the sign-in name. Entitlements decides what that id may do.',
    artifact: {
      label: 'Read the claim order',
      code: 'kubectl get envoyfilter spi-osdu-identity-filter -n osdu -o yaml',
    },
    source: 'jwt',
    goDeeper: ['peopleAccess'],
  },
  'ask-entitlements': {
    label: 'osdu / Entitlements API',
    title: 'Entitlements refuses a person it holds no membership for.',
    body: 'Bring-up’s members Job seeds exactly three identities, the workload, the deploy identity, and the member, and no person; spi up enrolls no people. So your own token passes the mesh and gets entitlements’ 401. Membership lives only in entitlements: a reset or a new partition drops it, and each person runs spi users add --me again.',
    artifact: {
      label: 'List the people enrolled',
      code: 'spi users list',
    },
    source: 'peopleAccess',
  },
  'ask-users-add': {
    label: 'Your workstation / spi users add',
    title: 'spi users add --me stores the id the mesh writes, then proves it.',
    body: 'It applies the identity filter’s claim order to your token and stores that id, so it matches what entitlements will see. The deploy identity writes users and the role’s groups. Then the command calls the entitlements group listing with your token, in the first partition written, for up to a minute. That proves entitlements admits you there; it says nothing about data whose ACL names other groups.',
    artifact: {
      label: 'Add yourself as a viewer',
      code: 'spi users add --me --role viewer',
    },
    source: 'userRoles',
    goDeeper: ['peopleAccess', 'projectedId'],
  },
  'ask-groups': {
    label: 'osdu / your entitlements groups',
    title: 'Your groups are users plus your role’s preset.',
    body: 'After spi users add --me --role viewer, entitlements holds you in users and users.datalake.viewers, and the call that returned 401 returns 200 with the same token. An id added for someone else, with spi users add <id>, is stored as typed and verified by nothing; a mistyped id shows only when that person’s call is refused.',
    artifact: {
      label: 'The call that now answers',
      code: 'GET /api/entitlements/v2/groups\ndata-partition-id: opendes',
    },
    source: 'peopleAccess',
  },
  'ask-roles': {
    label: 'spi users / role presets',
    title: 'A role is set, not accumulated.',
    body: 'viewer is users and users.datalake.viewers. editor adds users.datalake.editors and users.datalake.impersonation. admin is users, users.datalake.admins, users.datalake.ops, and impersonation; ops is users, users.data.root, users.datalake.ops, and impersonation. The default, with no --role, is admin. Running add with another role removes the other presets’ groups, then adds this one’s; users stays.',
    artifact: {
      label: 'Change your role',
      code: 'spi users add --me --role editor',
    },
    source: 'peopleAccess',
    goDeeper: ['userRoles'],
  },
  'ask-workflow': {
    label: 'osdu / Workflow API',
    title: 'Workflow runs ingestion as you only when you hold impersonation.',
    body: 'users.datalake.impersonation lets the stack’s OSDU identity act for you through Workflow. Editor, admin, and ops carry it; viewer does not. As a viewer, spi test dags --as me stops before submitting anything, with impersonation_missing. A return to viewer removes impersonation, so ingestion as you stops.',
    artifact: {
      label: 'Check before you ingest',
      code: 'spi test dags --as me',
    },
    source: 'coreDagsDecision',
    goDeeper: ['peopleAccess'],
  },
  'load-status': {
    label: 'Your workstation / spi status',
    title: 'spi status answers two questions: Ready and Deployable.',
    body: 'Ready is Flux convergence of the gating Kustomizations. Deployable is Ready with maintenance unset, a deploy record present, and the entitlements-members Job Complete for every partition. spi status exits 0 only when Deployable and 2 when not, naming the first blocker. The Kustomization count includes non-gating layers, so 30 of 30 is not the verdict; read the boolean.',
    artifact: {
      label: 'Read both verdicts',
      code: 'spi status --json | jq "{ready, deployable, reason}"',
    },
    source: 'statusContract',
  },
  'load-gating': {
    label: 'osdu-flux / gating Kustomizations',
    owner: 'Flux',
    title: 'Ready means every gating layer has converged.',
    body: 'Each gating Kustomization must report Ready=True. spi-osdu-schema-load is one of them, so the shared schemas are registered before an environment reads Ready. Ready says nothing about maintenance, and nothing about records.',
    artifact: {
      label: 'List the layers',
      code: 'kubectl get kustomizations -n osdu-flux',
    },
    source: 'statusContract',
    goDeeper: ['ordering'],
  },
  'load-nongating': {
    label: 'osdu-flux / non-gating Kustomizations',
    owner: 'Flux',
    title: 'Non-gating layers are shown and never counted toward Ready.',
    body: 'spi-osdu-legal, spi-osdu-members, and spi-osdu-dag-registration carry spi-stack.gating: "false". They stay in the not-ready list with a typed reason but never flip ready. Deployable separately requires the entitlements-members Job to be Complete in every partition.',
    artifact: {
      label: 'Find the non-gating layers',
      code: 'kubectl get kustomizations -n osdu-flux -l spi-stack.gating=false',
    },
    source: 'statusContract',
  },
  'load-maintenance': {
    label: 'Your workstation / spi maintenance clear',
    title: 'Clearing maintenance is your decision; spi up never makes it.',
    body: 'An environment brought up with --tag starts in maintenance, a flag in the spi-deploy-record ConfigMap in osdu-flux; a branch environment is deployable after convergence. spi maintenance clear patches that flag once readiness and a probe such as a partition lookup have passed. A rerun of spi up keeps the existing flag.',
    artifact: {
      label: 'Allow deploys',
      code: 'spi maintenance clear',
    },
    source: 'statusContract',
    goDeeper: ['resetBoundary'],
  },
  'load-registry': {
    label: 'osdu / ConfigMap spi-load-registry',
    title: 'The stack version ships the list of named loads.',
    body: 'load-registry.yaml reaches the cluster as spi-load-registry through spi-osdu-init. It names schemas, run by Flux, and reference-data, a Job the CLI creates from data-definitions v0.30.0 pinned to commit 99f8fc88 and fetched from community GitLab. reference-data requires schemas. The CLI carries no dataset list, so a CLI and an environment of different versions agree on what a name means.',
    artifact: {
      label: 'The registry in the stack',
      code: 'software/stacks/osdu/init/load-registry.yaml',
    },
    source: 'loadRegistry',
    goDeeper: ['namedLoads'],
  },
  'load-schema-job': {
    label: 'osdu / schema-load Job',
    owner: 'Flux',
    title: 'Bring-up registers the schemas and writes no records.',
    body: 'The schema-load Job runs the loader built from schema’s commit, behind the gating spi-osdu-schema-load layer. spi load reports it against the image lock and never creates it; spi load --dataset schemas --force deletes the Job and reconciles the layer.',
    artifact: {
      label: 'Inspect the Flux-owned Job',
      code: 'kubectl get job schema-load -n osdu',
    },
    source: 'schemaLoad',
    goDeeper: ['namedLoads'],
  },
  'load-cli': {
    label: 'Your workstation / spi load',
    title: 'spi load refuses to start until the environment is Deployable.',
    body: 'Before a Job runner load, spi load checks Deployable and refuses with not_deployable, exit 2. It refuses reference-data with requires_unmet until schemas is complete or stale. Then the newest Job decides: none creates one, a running Job is waited on, a complete Job for the same source changes nothing, and a failed one is recreated.',
    artifact: {
      label: 'Load the defaults',
      code: 'spi load',
    },
    source: 'namedLoads',
  },
  'load-job': {
    label: 'osdu / load Job',
    title: 'One Job per partition checks every kind, then writes.',
    body: 'spi load creates load-reference-data-<partition>-<first 8 of the commit>, running as workload-identity-sa. It fetches the archive by commit, checks that every kind in the payload is registered in Schema, 584 in this release, and fails with schema_behind when one is missing. Each record gets the partition’s data.default.owners and data.default.viewers and its seeded legal tag. The Job carries no TTL; deleting it removes the fact, not the records.',
    artifact: {
      label: 'The example’s Job',
      code: 'kubectl get job load-reference-data-opendes-99f8fc88 -n osdu',
    },
    source: 'namedLoads',
  },
  'load-storage': {
    label: 'osdu / Storage API',
    title:
      'Complete means Storage accepted the records, not that search finds them.',
    body: 'The loader writes in batches of 500 with skipdupes; 200, 201, and 409 count as success, and the Job fails when more than 1% of records fail, so complete can include up to 1% failed. The indexer may still be working after complete. A first load of the 80,103 records was measured at about 7 minutes on a core environment; the 7200 s Job deadline is headroom, not a measurement.',
    artifact: {
      label: 'What counts as accepted',
      code: '200 · 201 · 409 = accepted\nmore than 1% failed = Job failed',
    },
    source: 'namedLoads',
  },
  'load-loads': {
    label: 'Your workstation / spi load --status',
    title: 'spi load --status says what data the environment holds.',
    body: 'Each load reads absent, running, complete, stale, or failed; stale is a completed load whose source is not the one the registry now names. spi info --json publishes the same state in its loads block, so a suite that needs seeded data can gate on complete or stale. A load never changes ready or deployable.',
    artifact: {
      label: 'Read the loads, change nothing',
      code: 'spi load --status',
    },
    source: 'namedLoads',
    goDeeper: ['statusContract'],
  },
  'desk-guards': {
    label: 'Your workstation / before the suite',
    title:
      'spi test runs only on a Deployable environment and an unborrowed service.',
    body: 'The run refuses while spi status reports the environment not deployable, and refuses with service_borrowed, naming the run id, while an ephemeral pin holds the service. It reads the service’s lock entry, its pods’ digest, and its rollout revision before the suite and again after; a change discards the result as target_changed. spi test holds no lease.',
    artifact: {
      label: 'Bind and stop, without a verdict',
      code: 'spi test partition --dry-run',
    },
    source: 'deployedSuites',
  },
  'desk-lock': {
    label: 'osdu-flux / image lock',
    title: 'The lock pairs the service digest with its acceptance image.',
    body: 'When canonical resolution records a fork image, it also reads the digest of <package>-acceptance:sha-<12> at the same commit and records it as <SERVICE>_ACCEPTANCE_DIGEST. The pair promises the commit, not the build. A pin, an entry its canonical repository did not build, or no recorded digest refuses paired mode with unpaired.',
    artifact: {
      label: 'The paired key',
      code: 'PARTITION_ACCEPTANCE_DIGEST',
    },
    source: 'deployedSuites',
    goDeeper: ['imageLock'],
  },
  'desk-commit': {
    label: 'GitHub / the deployed commit',
    title: 'The commit supplies the descriptor, the resolver, and the verdict.',
    body: 'The CLI resolves the lock’s short sha to the full commit through the GitHub commits API and fetches .spi/service.yaml, the acceptance resolver, and suite-verdict.py at that commit. It never reads the descriptor itself; the resolver runs with facts from spi info. Each paired run makes one commit lookup and three file fetches, against an anonymous limit of 60 requests an hour without gh authentication or GH_TOKEN.',
    artifact: {
      label: 'Files fetched at the commit',
      code: '.spi/service.yaml\n.github/actions/acceptance-resolver/resolve.py\n.github/actions/acceptance-image/suite-verdict.py',
    },
    source: 'deployedSuites',
    goDeeper: ['partitionDescriptor'],
  },
  'desk-acceptance': {
    label: 'GHCR / the acceptance image',
    title: 'The suite image is built from the same commit as the service.',
    body: 'The fork’s template builds osdu-spi-<service>-acceptance:sha-<12> beside the service image, amd64 only, with the descriptor baked in. Retention can prune it once main has moved past it; the run then fails with pair_pruned, and the ways forward are spi service refresh onto a newer commit or --source at the deployed one.',
    artifact: {
      label: 'The paired package',
      code: 'ghcr.io/azure/osdu-spi-partition-acceptance@sha256:…',
    },
    source: 'deployedSuites',
  },
  'desk-run': {
    label: 'Your workstation / docker run',
    title: 'Paired mode runs the suite image by digest on your machine.',
    body: 'spi test pulls the acceptance image for linux/amd64 by the recorded digest and runs it with docker run, passing only an env file and SUITE_DIR. The CLI mints the deploy, member, and no-access callers through the path spi token uses. On Apple Silicon the image runs under emulation. Paired mode needs Docker, which spi check does not cover.',
    artifact: {
      label: 'Run the acceptance suite',
      code: 'spi test partition --report',
    },
    source: 'deployedSuites',
  },
  'desk-verdict': {
    label: 'Your workstation / the verdict',
    title: 'The verdict is the commit’s own script, and it counts tests.',
    body: 'suite-verdict.py passes a run with a zero exit, at least one test not skipped, and no failures or errors. The exit code is 0 passed, 3 the suite ran and failed, 2 not run or discarded, and 1 not run for any other reason. With --report the run also writes spi-test-<service>-<suites>.html under the system temporary directory.',
    artifact: {
      label: 'Exit codes',
      code: '0 passed · 3 failed · 2 not run or discarded · 1 other',
    },
    source: 'deployedSuites',
    goDeeper: ['suiteReport'],
  },
  'desk-report': {
    label: 'Your workstation / --report and --review',
    title: 'Hollow counts the passing tests that prove nothing.',
    body: 'JUnit reports a test whose body holds no statement as a pass. --report finds those empty tests in the suite’s own sources and sends nothing anywhere. --review sends the sources and the run’s facts to a reviewer (copilot -p), which grades each test against the service’s api-docs: 0 nothing, 1 the status, 2 the body or headers, 3 state read back. Without a review, Hollow counts only the empty tests, and the scoreboard marks the service not reviewed. Neither option changes a verdict or an exit code.',
    artifact: {
      label: 'Report and review every suite',
      code: 'spi test partition --suite all --report --review',
    },
    source: 'suiteReport',
  },
  'desk-checkout': {
    label: 'Your workstation / your checkout',
    title: 'Your checkout builds on your machine and tests the same way.',
    body: 'spi service pin <service> --source <path> runs Maven on the host (clean install -P core,azure -DskipTests), builds the image with az acr run for linux/amd64, pins it by digest, and waits for the rollout. spi test <service> --source <path> then runs the checkout’s own descriptor and suite with native mvn, labeled matched when its commit equals the pin and the tree is clean, unmatched otherwise. Checkout mode needs a JDK and Maven.',
    artifact: {
      label: 'Pin your change, then test it',
      code: 'spi service pin partition --source <path>\nspi test partition --source <path>',
    },
    source: 'localBuilds',
    goDeeper: ['deployedSuites'],
  },
  'desk-registry': {
    label: 'Azure / the environment’s container registry',
    title: 'A local build lands in your environment’s own registry.',
    body: 'The image is <registry>/local/<service>, tagged sha-<12>, sha-<12>-dirty when the tree had uncommitted changes, or -prebuilt when Maven did not write the JAR in the same run. The pin records origin local, and the cluster pulls as its kubelet identity with AcrPull. A local pin refuses while a fork run borrows the service. Nothing prunes local/ repositories.',
    artifact: {
      label: 'Put the canonical back',
      code: 'spi service reset partition',
    },
    source: 'localBuilds',
  },
  'desk-pods': {
    label: 'osdu / partition pods',
    title: 'The pods follow the lock, canonical or pinned.',
    body: 'A local pin overwrites the service’s lock keys and records the canonical image in the lock annotation; Flux renders the new digest and the pods roll. spi service reset restores the canonical entries exactly. A paired spi test refuses a pinned service with unpaired, so a local pin is tested with --source.',
    artifact: {
      label: 'See active pins',
      code: 'spi service list',
    },
    source: 'imageLock',
    goDeeper: ['localBuilds'],
  },
  environment: {
    label: 'The stack boundary',
    title: 'AKS is one part of the environment.',
    body: 'Your environment includes AKS and its Azure data services. A data partition such as opendes gets its own Cosmos DB SQL account, Storage account, and Service Bus namespace. Gremlin, common Storage, Key Vault, and middleware are shared by the environment.',
    artifact: {
      label: 'Environment identity',
      code: '--env <name> → resource group spi-stack-<name>',
    },
    source: 'architecture',
    here: {
      'running-stack': {
        context: 'The environment boundary',
        summary:
          'The spi-stack-<name> resource group contains AKS and the Azure data resources beside it. --env <name> selects that whole environment; AKS is one part of the stack, not the stack itself.',
      },
    },
  },
  workstation: {
    label: 'Outside the stack',
    title: 'Your terminal starts the work; controllers keep it running.',
    body: 'spi up drives Bicep and seeds the cluster. Before returning, it verifies the requested Git revision and suspends further Git fetching. Flux and Kubernetes continue running when you close the terminal.',
    artifact: {
      label: 'Start an environment',
      code: 'spi up --env <name>',
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
    label: 'Image registry',
    title: 'Each service runs the image its Azure fork publishes.',
    body: 'Every service follows the main build its fork, Azure/osdu-spi-<service>, publishes to GHCR, recorded in the image lock by digest. An environment can record a trusted mirror instead, one service at a time. Community images are not a source: they do not carry the Azure provider.',
    artifact: {
      label: 'The canonical partition image',
      code: 'ghcr.io/azure/osdu-spi-partition@sha256:<digest>',
    },
    source: 'images',
    goDeeper: ['forkDeploy'],
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
    here: {
      'bring-up': {
        context: 'How the environment converges',
        summary:
          'spi up --env <name> creates Azure infrastructure with Bicep and supplies bootstrap inputs such as spi-cluster-config. Flux applies Kustomizations and HelmReleases, while Kubernetes controllers keep maintaining the workloads after the CLI exits.',
        more: 'The Git source is suspended after deployment by default. Controllers still reconcile the cached configuration and live inputs, including osdu-image-lock; follow a blocked Kustomization’s dependsOn chain to the first unhealthy dependency.',
        source: 'architecture',
        goDeeper: ['lifecycle', 'flux'],
      },
    },
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
    label: 'platform',
    title: 'The gateway routes; the receiving sidecar identifies the caller.',
    body: 'spi-gateway is a Gateway in platform; managed Istio deploys its workload and the cluster’s one ingress LoadBalancer, spi-gateway-istio, from it. RequestAuthentication and an EnvoyFilter in osdu validate tokens and project x-app-id and x-user-id. Caller authentication and OSDU authorization remain separate checks.',
    artifact: {
      label: 'Inspect the entry point',
      code: 'kubectl get gateway spi-gateway -n platform',
    },
    source: 'identity',
    goDeeper: ['gateway'],
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
    here: {
      'running-stack': {
        context: 'The osdu namespace',
        summary:
          'Partition, entitlements, legal, schema, storage, search, and indexer run here as Kubernetes workloads, one image each, behind the Istio gateway. The SPI boundary (103) opens the partition service to show the shared code and the Azure provider packaged inside it.',
        artifact: {
          label: 'List the service workloads',
          code: 'kubectl get deployments -n osdu',
        },
        source: 'architecture',
      },
    },
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
    here: {
      'running-stack': {
        summary:
          'opendes has its own Cosmos DB SQL account, Storage account, and Service Bus namespace. The environment shares common Storage, Gremlin, the service identity, and Key Vault; partition-specific resources do not create a separate service identity.',
      },
    },
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
    title: 'This registry holds local builds, not the canonical images.',
    body: 'The stack provisions a Basic ACR with its admin account disabled, and the cluster’s kubelet identity can pull from it. spi service pin --source builds a checkout into <registry>/local/<service> and pins the resulting digest; every canonical image still comes from GHCR.',
    artifact: {
      label: 'Build a checkout and pin it',
      code: 'spi service pin <service> --source <checkout>',
    },
    source: 'localBuilds',
    goDeeper: ['images'],
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
    body: 'For the opendes lookup in your environment, a successful spi up does not prove that the request path is ready. Before exiting, the CLI verifies the requested Git artifact revision while Flux overlaps the final CLI work; these signals are not a first-to-last checklist. spi status --watch observes configured workload health and initialization, and spi info --show-apis discovers the endpoint. Only a successful authenticated lookup proves that exercised API path, not every API. A pod in Running phase is not necessarily Ready, and a completed initialization Job should be Complete rather than Running.',
    artifact: {
      label: 'Observe the environment',
      code: 'spi status --watch\nspi info --show-apis',
    },
    source: 'lifecycle',
    here: {
      'bring-up': {
        context: 'Proof after spi up',
        summary:
          'For the opendes lookup in your environment, a successful spi up does not prove that the request path is ready. The CLI verifies the requested Git artifact revision before it exits, while Flux overlaps its final work. Ready Kustomizations and HelmReleases report workload health, and Complete initialization Jobs report initialization; spi status --watch observes both but makes no API request. spi info --show-apis discovers the endpoint, and only a successful authenticated lookup proves the exercised API path, not every API. A Running pod is not necessarily Ready.',
      },
    },
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
      code: 'az resource list --resource-group spi-stack-<name> --output table',
    },
    source: 'lifecycle',
    here: {
      'bring-up': {
        summary:
          'Ordinary spi down deletes the cluster and application data while retaining managed identities, the resource group, and its naming tags. A rebuild can reuse resource names and identity client IDs, not the deleted application data; seed Secrets are lost and middleware passwords are regenerated.',
      },
    },
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
    body: 'PartitionServiceImpl.getPartition asks the cache for opendes. When the cache misses, or when the read throws, it reads the stored configuration from the partition table in common Storage; the cache failure is logged as a warning, and the lookup still answers when that table is reachable and contains opendes. The code lives in provider/partition-azure, which the fork owns: it stays on fork_integration and main, outside the tree regenerated from upstream (osdu-spi ADR-038), so it does not depend on upstream carrying an Azure provider.',
    artifact: {
      label: 'The fallback, with its tests',
      code: 'PartitionServiceImpl.getPartition(id)\n  safeGet(cache, id)  → null on miss or exception (logged)\n  tableStore.getPartition(id)  when null\nPartitionServiceImplTest.java\n  should_fallBackToTableStore_when_cacheReadThrows_onGetPartition',
    },
    source: 'partitionProvider',
    goDeeper: ['partitionCacheFix', 'ownership'],
    here: {
      'spi-boundary': {
        context: 'The provider call',
        owner: 'The partition service fork',
        summary:
          'The in-process interface call reaches PartitionServiceImpl, which asks Redis inside AKS using middleware credentials. A cache miss or caught read exception is logged as a warning before the provider reads common Table Storage outside AKS with Workload Identity; fallback succeeds only when that table is reachable and contains opendes. This lookup does not visit the partition’s Cosmos DB, blob Storage, or Service Bus.',
      },
    },
  },
  redis: {
    label: 'Inside AKS · outside the service image',
    title: 'Redis can return the partition before the table is read.',
    body: 'PartitionServiceImpl asks Redis in the platform namespace for opendes. A hit returns the cached configuration without a table read; a miss or caught read exception returns control to the provider, which reads the table, and the exception is logged as a warning. Redis authenticates with a middleware password from platform/redis-credentials, whose redis-password value is mirrored into Key Vault. The provider client is inside provider/partition-azure; Redis itself is outside the service image.',
    artifact: {
      label: 'Where the credential lives',
      code: 'platform/redis-credentials\nredis-password  → mirrored into Key Vault',
    },
    source: 'partitionProvider',
    goDeeper: ['partitionCacheFix', 'architecture', 'secrets'],
    summary:
      'Redis runs in the platform namespace inside AKS and is the first read for opendes. A miss or caught read exception is logged as a warning and returns control to PartitionServiceImpl, which can read common Table Storage when it is reachable and contains opendes. The service uses the middleware password from platform/redis-credentials for Redis.',
  },
  azureclients: {
    label: 'Outside AKS · common Storage',
    title: 'The provider reads the durable row with Workload Identity.',
    body: 'After a cache miss or caught read exception, PartitionServiceImpl reads opendes from the partition table in common Storage. The table is outside AKS and the service image; the fork-owned client inside provider/partition-azure uses a Workload Identity token instead of a stored Storage key. A successful fallback requires a reachable table containing opendes. After the read, the provider attempts to write the answer back to Redis; if that write fails, it logs the failure without invalidating the durable answer.',
    artifact: {
      label: 'Durable read and non-fatal cache write-back',
      code: 'tableStore.getPartition(id)\ncache.put(id, partitionInfo)  // failure logged; answer kept',
    },
    source: 'partitionProvider',
    goDeeper: ['partitionCacheFix', 'identity', 'secrets', 'architecture'],
    summary:
      'After a Redis miss or caught read exception, PartitionServiceImpl uses Workload Identity to read opendes from common Table Storage outside AKS. Fallback succeeds only when that table is reachable and contains opendes; this lookup does not visit the partition’s Cosmos DB, blob Storage, or Service Bus. A failed Redis write-back is logged without replacing the durable answer.',
  },
  upstream: {
    label: 'Upstream tip',
    title:
      'The community repository holds the shared code, not the Azure provider.',
    body: 'community.opengroup.org publishes the partition service: core, acceptance tests, and the community implementation, with no Azure provider. The fork never checks this tree out as a branch. Sync Upstream reads it with git plumbing and generates fork_upstream from it, so the fork’s provider never shares a merge base with upstream.',
    artifact: {
      label: 'Where the sync reads from',
      code: 'https://community.opengroup.org/osdu/platform/system/partition\nUPSTREAM_REPO_URL  (repository variable, set at initialization)',
    },
    source: 'synchronization',
    here: {
      'spi-boundary': {
        summary:
          'In the service’s fork, partition-core/, the shared code, sits beside provider/partition-azure/, the Azure implementation. The community repository carries partition-core and IPartitionService and no Azure provider, so the Azure source lives only in the fork.',
        source: 'ownership',
        goDeeper: ['synchronization'],
      },
    },
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
    here: {
      'spi-boundary': {
        context: 'One executable process',
        owner: 'The partition service fork',
        summary:
          'provider/partition-azure/pom.xml depends on partition-core and uses Spring Boot repackage to produce the executable application. build/Dockerfile copies that JAR to /app.jar, and build/docker-entrypoint.sh starts it with java -jar /app.jar. The Java interface and its Azure implementation therefore run in one process, not across a network.',
        artifact: {
          label: 'Build and runtime chain',
          code: 'partition-azure → partition-core\nspring-boot:repackage → /app.jar\ndocker-entrypoint.sh → java -jar /app.jar',
        },
        source: 'partitionPom',
        goDeeper: ['partitionDockerfile', 'partitionEntrypoint'],
      },
    },
  },
  running: {
    label: 'The partition pod',
    title: 'Flux reconciles the lock; the pod follows it.',
    body: 'The environment is a stack like any other: spi up made it, Flux assembles it, and its deploy identity survives spi down. While partition is pinned to a candidate, the other services keep running their canonical images, so a broken-but-ready candidate can fail a sibling’s suite. Several onboarded forks can share the environment, one service slot each, and a concurrency group serialises runs per service.',
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
    body: 'The lock is a stack object in osdu-flux with one key per service, PARTITION_IMAGE_DIGEST among them, and Flux substitutes the values at apply time. A fork run writes its digest with spi service pin --ephemeral, which also records the run id, the source commit, and the canonical image to restore, in the spi-stack.osdu.dev/pins annotation. The write is a compare-and-set, so a lost write is caught and a later pin takes over. Between runs the lock holds the canonical image: the main build of the service’s Azure fork, or of a trusted mirror the environment records (osdu-spi-stack ADR-033).',
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
    title: 'Upstream does not carry this directory. The fork holds it.',
    body: 'provider/partition-azure implements the interface from 103. It exists on main and fork_integration and is absent from fork_upstream by construction, so nothing upstream does to that path reaches the fork. It was brought across once by a scripted cutover and has been fork-owned since.',
    artifact: {
      label: 'Where it is and is not',
      code: 'upstream tip:      absent\nfork_upstream:     absent (never enters the merge base)\nmain:              provider/partition-azure/  fork-owned',
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
    body: '.spi/service.yaml declares the acceptance suites the stack should run against this service and what each needs. It is excluded from template sync by name: the service repository writes it, and changes to it are reviewed with the code. The workflows come from osdu-spi. The service team writes this descriptor; osdu-spi-partition wrote its own in September 2026. After onboarding, Deploy Gate skips the run while .spi/service.yaml is missing, with the reason no .spi/service.yaml declares the suites.',
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
    body: 'Every push to main makes Release Please read the conventional commits since the last release, choose the bump from them, and open or update one PR with the new version and changelog. A fix: commit means a patch, a feat: commit a minor bump; the meta commit on a sync says how big the upstream part is. The cache fallback itself was titled “[Azure] Fixes for High API Error Count”, so the bump below is illustrative. This PR is separate from the integration PR and can wait as long as the team likes; the candidate digests already exist and the stack has already been borrowed for them.',
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
  'stack-slot': {
    label: 'A slot in the stack',
    title: 'The stack is borrowed for the candidate, not for the release.',
    body: 'After the push, Deploy Gate decides without credentials whether this run may borrow the environment: only push and pull_request events, only same-repository PRs, not Dependabot, not fork_upstream, and only when the five onboarding values, the descriptor, and a pushed image exist. If it may, the run pins the candidate digest into the environment’s image lock, checks the pod runs it, runs the declared suites, and restores the canonical image. View 06 follows that run step by step. The lane is the newer template’s, and the reference partition fork adopted it in September 2026; the run the example follows from here is illustrative.',
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
    body: 'Merging the version PR makes Release Please tag main and publish the release. The workflow adds <release-tag>-upstream-<upstream-version> which records the upstream version the release carries (the nearest tag on upstream’s default branch, or its short commit when no tag is reachable, as on partition), then polls GHCR for the sha-* image validation pushed for that commit and adds the semantic-version tag to it. No new build runs. The digest with the version tag is the merge commit’s build, which may differ from the digest a PR run borrowed the stack for.',
    artifact: {
      label: 'Tags on one digest',
      code: 'ghcr.io/azure/osdu-spi-partition:sha-<commit>\nghcr.io/azure/osdu-spi-partition:v1.4.0\ngit tag v1.4.0-upstream-<upstream-commit>',
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
    body: '.spi/service.yaml names each suite, the directory and Maven arguments that run it, its timeout, and the bindings it wants: a gateway URL, a partition, a token. The resolver in the run binds those from environment facts and minted tokens. The service repository owns this file; template sync excludes it. osdu-spi-partition wrote its descriptor in September 2026, declaring an acceptance suite and an integration suite. The example below is its acceptance suite; the run shown here is illustrative.',
    artifact: {
      label: 'One suite, declared',
      code: 'tests:\n  acceptance:\n    type: maven\n    path: partition-acceptance-test\n    mavenArguments: [test]\n    timeoutMinutes: 15\n    bindings:\n      HOST: { source: gateway }\n      DATA_PARTITION_ID: { source: partition }\n      PRIVILEGED_USER_TOKEN: { source: token }',
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
