# The stack deep dive: script for approval

**Status: draft for approval.** This script replaces the recording _Engineering the OSDU SPI Stack on Azure_ when it is approved and a new recording is produced from it. Until a recording is replaced, the current recording, its transcript in `src/content/transcripts/stack.js`, and the marker notes in `src/content/audio.js` stay exactly as they are. Nothing on the site changes because this file exists.

The current recording spends its first six minutes on why OSDU exists and reaches the provider model at 6:08. This script is written for engineers who already know OSDU and are learning Azure SPI. It opens on the engineering question, keeps the marker order of the current episode as its chapter spine, drops the OSDU introduction, and states each corrected claim from the marker notes as the plain fact. It covers lessons 01 to 03: what runs in the stack, how it comes to life, and where the Azure provider sits inside a service.

**Length:** 4,219 words in the script body, about 28 minutes spoken at 150 words a minute. Target: 25 to 35 minutes.

**Chapters** (each heading is the marker title the site will use, with the target timestamp at 150 words a minute):

1. Shared core, swappable providers · 00:00 (235 words)
2. Fifty resources, one command · 01:34 (284 words)
3. A development and test environment by design · 03:28 (305 words)
4. Four owners, four boundaries · 05:30 (205 words)
5. The CLI exits; Flux keeps working · 06:52 (193 words)
6. Why the provider uses Azure PaaS · 08:09 (204 words)
7. The three that stayed in the cluster · 09:30 (212 words)
8. Letting Azure run the cluster · 10:55 (152 words)
9. One local Helm chart · 11:56 (168 words)
10. Ordering is the design; the deliberate pause · 13:03 (171 words)
11. When reconciliation gets stuck · 14:12 (166 words)
12. Identity is two different jobs: outbound · 15:18 (224 words)
13. The shared-identity trade-off · 16:48 (145 words)
14. The async path that does not work · 17:46 (110 words)
15. Inbound: rewriting identity at the door · 18:30 (258 words)
16. Making an empty OSDU useful · 20:13 (200 words)
17. The image lock · 21:33 (196 words)
18. One environment, eight forks by design · 22:51 (174 words)
19. Pinned versions and ephemeral pins · 24:01 (260 words)
20. Trusting a repository without trusting its pull requests · 25:45 (179 words)
21. What the design is really about · 26:56 (178 words)

Single narrator. Plain engineering language. One metaphor, the site's: machinery. The example partition is `opendes`; the environment placeholder is `<name>`. No real environment or subscription is named.

## Script

### 1. Shared core, swappable providers · target 00:00

What is actually running when someone says "the stack", and how was it engineered so that a service fork can prove an Azure change against it? That is the question this recording answers. You already know the OSDU APIs and data partitions. What is new is the environment around them, and the provider inside each service.

Start inside one service. Every OSDU service keeps its business logic in a core module and reaches its cloud through a provider implementation. The boundary between them is the Service Provider Interface, SPI. For the partition service, the shared code is partition-core and the Azure provider is provider/partition-azure. Both compile into one executable JAR, and one image runs it. Crossing the interface is a Java call, not a network hop.

Take one request as the running example: a lookup of the partition called opendes, GET /api/partition/v1/partitions/opendes. The shared code admits the caller, validates the id, and calls getPartition on the provider interface. The Azure implementation checks Redis inside the cluster, and on a miss, or when the cache read throws, it reads the stored configuration from a table in common Storage outside the cluster. That lookup returns where opendes lives. Other services use the answer to find their own Cosmos DB, Storage, and Service Bus.

The provider only exists to talk to Azure services. The stack exists so that code can be run and proved against the real ones.

### 2. Fifty resources, one command · target 01:34

Provisioning this environment by hand means roughly fifty Azure resources in the right order: the cluster, its identities, the data services that need the cluster's OIDC issuer before they can be wired, Key Vault, networking. The spi CLI compresses that into one invocation: spi up --env <name>. It creates a resource group named spi-stack-<name>, runs Bicep to create AKS first, reads the cluster's OIDC issuer, then provisions the data services and managed identities that depend on it, seeds the cluster with namespaces, configuration, and credentials, and activates Flux.

The command has three profiles, bare, minimal, and core, with core the default, and it takes --tag to pin an immutable release of the GitOps source. The CLI refuses a tag whose version differs from its own, so the tested pair stays reproducible. The profiles select Kubernetes workloads, not Azure resources: all three provision the full estate, including the cluster and every data service, and a bare deployment simply has nothing running on top. Profiles do not save money; az resource list on the resource group returns the same count under any of them.

On timing, be precise about what the documentation records. Prior smoke runs in centralus were observed at roughly 45 to 50 minutes, including about 30 minutes for AKS and 10 to 15 minutes for the Flux extension. Those are planning estimates from earlier runs, not a guarantee for the current release or for another region; the CLI defaults to westus3, and its help names eastus2 and centralus as constrained. The phases overlap, so they are not added. And the CLI returning is not the environment being ready. API readiness can follow the CLI exit, and the fifth chapter says how to tell.

### 3. A development and test environment by design · target 03:28

Before the map, the scope. This stack is a development and test environment. Every OSDU service shares one Azure managed identity. There is no backup and no disaster recovery. The middleware is sized for testing. It is not production, and it is not Azure Data Manager for Energy.

That scope is a decision, not an omission. The purpose of the environment is to run the Azure provider code against real Azure services and to be borrowed by service forks for that purpose. A disposable environment that comes up from one command and goes away with another serves that purpose. Per-service identity isolation, replication, and rotation would serve a different one.

The trade-off is real and the documentation states it. Because every OSDU pod is the same Azure principal, a compromise of one service reaches everything the environment's identity can reach. For a shared test target that is accepted. Nobody should carry this design to a production system, and the site says so on every view where identity appears.

Disposable has a precise meaning too. Ordinary spi down --env <name> deletes the cluster, the data services, and their data. It waits up to 45 minutes, and that is a timeout, not a promised duration; an incomplete delete exits nonzero and lists what remains, so you run it again. What survives is the managed identities, the resource group spi-stack-<name>, and its naming tags, so the next spi up reuses the same names and identity client ids. Cluster seed Secrets are lost and middleware passwords are regenerated. spi down --purge is the separate, final choice: it removes the identities' external grants and deletes the resource group itself. And a green teardown job in CI is not proof of deletion. The CI step requests the deletion asynchronously and tolerates failure, which is why az group exists is the check.

### 4. Four owners, four boundaries · target 05:30

Four owners keep this machinery from fighting itself, and each one has a boundary.

The CLI and Bicep own Azure: the resource group, the cluster, the data services, the identities, the seed inputs in the cluster. They run when a person or a CI job runs spi up, and then they stop.

Flux owns the workloads. It reads the osdu-spi-stack manifests and local Helm charts and applies Kustomizations and HelmReleases in dependency order. Its controllers live in flux-system; the stack's own GitRepository and inputs live in osdu-flux, which keeps SPI-owned objects apart from the extension-controlled namespace.

Kubernetes controllers and operators keep the workloads healthy. In the foundation namespace, ECK manages Elasticsearch, CloudNativePG manages PostgreSQL, and cert-manager and trust-manager handle certificates and trust. The platform namespace holds the middleware. The osdu namespace holds the OSDU services and their initialization Jobs.

And people own the decisions: when to update the environment, when to diagnose it, when to remove it.

The practical use of the boundaries is diagnosis. When something fails, start in the namespace that owns the failed workload, and ask which owner's view of the world you are looking at. kubectl get kustomizations -n osdu-flux shows Flux's view. kubectl get pods -n platform shows the middleware's.

### 5. The CLI exits; Flux keeps working · target 06:52

Here is the boundary that costs people an afternoon. Before spi up returns, it waits for the Git source, verifies that Flux has the requested revision, then suspends the Git source and writes the deploy record. Flux is already reconciling while those final CLI stages run. There is no moment when the CLI stops and Flux starts; they overlap. So a successful exit means the orchestration completed without a fatal error. It is not a readiness check.

The documentation lists five signals, and none implies the next. The CLI exited successfully. The Git source has an artifact. The Kustomizations and HelmReleases are Ready. The initialization Jobs are Complete. An authenticated API request succeeds.

spi status --watch follows the third and fourth: workloads turning Ready, Jobs reaching Complete. It makes no API request. A pod in the Running phase is not necessarily Ready, and a finished Job should read Complete, not Running. spi info --show-apis discovers the endpoints, and spi token mints a ten-minute bearer for the environment's deploy identity. Then one authenticated lookup of opendes proves that one path. It proves nothing about search, storage, or ingestion. Check the signal you actually need.

### 6. Why the provider uses Azure PaaS · target 08:09

The Azure provider talks to Cosmos DB, Service Bus, Storage, and Key Vault. The community implementation, CIMPL, runs its dependencies inside Kubernetes: PostgreSQL, RabbitMQ, MinIO. Testing the Azure provider against substitutes like those would bypass the very code the environment exists to prove. So the stack uses the Azure services, and it is Azure-only by design rather than by preference.

The layout follows the partition model you know. In this stack the partition opendes owns a Cosmos DB SQL account, a Storage account, and a Service Bus namespace. The environment shares common Storage, which holds the partition table, the entitlements graph in Cosmos DB Gremlin, Key Vault, and the service identity. The first partition is also the primary one, which hosts the system database schema loading uses. Partition-specific resources do not create partition-specific identities; the OSDU workloads still share one.

One operational fact belongs here because it looks like a bug. Cosmos data-plane grants are Cosmos-native role assignments. They do not appear in az role assignment output, they propagate in five to fifteen minutes, and services cache their clients at startup. A fresh grant can therefore need a pod restart before it takes effect. "The role assignment is missing" is usually the wrong diagnosis.

### 7. The three that stayed in the cluster · target 09:30

Three systems did not move to Azure services, and each has a reason.

Elasticsearch stays in the cluster because the OSDU search and indexer services speak the Elasticsearch API, and Azure AI Search does not implement it. Replacing it would mean rewriting the shared search code, which is the code the stack is meant to run as published.

Redis stays because the services expect custom CA-backed TLS and specific database isolation, and Azure Cache for Redis would add network latency and cost for what is a cache.

PostgreSQL stays because Airflow needs a small relational database for its own metadata, and a managed instance is poor value for that scratch pad.

They run in the platform namespace, managed by the operators in foundation, outside the Istio mesh that the OSDU pods join. And they carry the consequence the identity chapter comes back to: the Redis and Elasticsearch passwords are real credentials. They live in Kubernetes Secrets and are mirrored into Key Vault. Deleting a Secret does not rotate them: reconciliation does not regenerate a chart Secret, and the next spi up copies the same value back from the persistent seed in osdu-flux. Deleting the seed itself is worse, because a later spi up can generate values the running middleware does not know.

### 8. Letting Azure run the cluster · target 10:55

The cluster is AKS Automatic. Microsoft manages the nodes, the managed Istio revision, and the platform defaults, and the stack lives by the platform's rules. Two of those rules shape everything above them.

The first is a version floor. The cluster pins Kubernetes 1.36. Below 1.36, AKS Automatic blocks the creation of any MutatingWebhookConfiguration for every identity, regardless of RBAC. cert-manager, CloudNativePG, and ECK all rely on mutating webhooks, so the operator model cannot work there. From 1.36 the block narrows to a scoped policy that the stack's webhooks do not touch. A region where 1.36 is not available cannot host the stack until it rolls out.

The second is Deployment Safeguards, and they cannot be bypassed. Every pod must run as non-root, drop Linux capabilities, declare resource requests and limits, and carry probes. That is good hygiene, and it collides with the community Helm charts, which were not written for it.

### 9. One local Helm chart · target 11:56

The obvious answer to that collision is to patch the community charts at deploy time. The stack rejected it because a patch depends on the exact structure of the upstream template. When the community moves a block or renames a value, the patch stops applying, and either the deployment is rejected or it lands without the security context you thought you had added.

Instead the stack keeps one local chart, osdu-spi-service, and every OSDU service deploys through it. The non-root user, the dropped capabilities, the limits, and the probes are written into the chart at authoring time. Compliance is a property of the artifact, not of a step that runs on the way in.

The cost is that the community chart version no longer tells you what is running; the image reference does. The partition HelmRelease in osdu-flux installs the osdu-spi-service chart into the osdu namespace, and the resulting Deployment is named partition. To see the image it runs, read the Deployment's container image, not a chart version.

### 10. Ordering is the design; the deliberate pause · target 13:03

Flux does not apply everything at once. The Kustomizations form a strict dependency graph: the foundation operators, then the platform middleware, then the OSDU services, then the initialization Jobs. A blocked Kustomization sits at DependencyNotReady; follow its dependsOn chain to the first unhealthy dependency. Runtime API dependencies and Flux rollout dependencies are different graphs, so a service being deployed does not mean the services it calls are ready.

Then comes the decision that surprises people who know GitOps. When spi up finishes, it suspends the Git source. Suspension stops Flux fetching new commits. It does not stop reconciliation. The cached revision keeps being applied, so a live edit to a Flux-managed object is reverted, external chart repositories keep their own schedules, and the controllers keep running. What the pause buys is that a colleague's merge to the stack repository cannot change the environment under you while you are chasing a failure in it. "Suspended means frozen" is one of the easy mistakes on the site: nothing is frozen, only the fetch.

### 11. When reconciliation gets stuck · target 14:12

Two documented traps end a rollout without an obvious error.

The first is retry exhaustion. When a HelmRelease fails to install or upgrade, helm-controller retries, then gives up. The release reports Stalled with reason RetriesExceeded, its dependents sit at DependencyNotReady, and spi status renders it as Stalled. Re-applying the same manifest does nothing, because nothing changed and the release's generation does not move. spi reconcile clears the failure count and forces one attempt. A terminal stall, a bad chart or an invalid health-check expression, needs a real change; forcing it again reproduces the same failure. flux get helmreleases in osdu-flux is where to look for RetriesExceeded.

The second is the immutable Job template. A Job's pod template cannot change after the Job exists. When a chart change touches that template, the initialization HelmRelease, osdu-spi-init or osdu-spi-legal, holds at RollbackFailed, and the Helm error names the field as immutable. Both cases are in the Flux reconciliation guide with the commands to check. Neither is fixed by waiting.

### 12. Identity is two different jobs: outbound · target 15:18

Identity in this environment is two separate jobs, and conflating them wastes hours in the wrong layer. Outbound identity answers whether a pod can obtain an Azure token to call Cosmos DB, Storage, Service Bus, or Key Vault. Inbound identity answers whether an incoming OSDU request is accepted and as whom.

Outbound uses Workload Identity. Each OSDU pod runs under the ServiceAccount workload-identity-sa in the osdu namespace. The cluster projects a short-lived, signed token into the pod. A federated credential on the managed identity spi-stack-<name>-osdu-identity tells Entra ID to trust tokens from this cluster's OIDC issuer for that ServiceAccount. The Azure SDK exchanges the projected token for an Azure access token. Shared-key access on the Storage accounts is disabled, local authentication on Service Bus is disabled, and the retained connection-string fields hold the placeholder DISABLED. No usable Azure data-plane key or connection string is stored in the cluster.

State the scope exactly, because the current recording overstates it. Workload Identity replaces stored keys for the Azure data services. It does not replace every credential. Redis runs in the platform namespace and authenticates with a middleware password from the Secret platform/redis-credentials, whose value is mirrored into Key Vault; Elasticsearch has one too. In the running example, the partition provider reads Redis with that password, then reads the partition table in common Storage with Workload Identity.

### 13. The shared-identity trade-off · target 16:48

There is one such identity for all the OSDU services. Every OSDU pod is the same Azure principal. That is operationally simple for a test target: one set of role assignments, one federated credential, nothing to keep in step as services are added. It is not an architecture for production, and the decision register says so.

Two clarifications keep the picture accurate. Partition-specific Azure resources, the Cosmos account and Storage account that opendes owns, do not imply isolation between services; they are all reached by the same identity. And the workload identity is not the only identity in the environment. There is a separate deploy identity, which the fork lane and spi token use, and there are member and no-access test identities for exercising entitlements as a non-admin and as a caller absent from the groups. spi token --member and spi token --no-access select them.

### 14. The async path that does not work · target 17:46

Enforcing identity-based access on Service Bus has one documented casualty. The intended indexing path is Service Bus, then indexer-queue, then indexer, then Elasticsearch. The community indexer-queue image builds a Service Bus connection string regardless of Workload Identity, finds the placeholder DISABLED, and cannot authenticate. Records-changed indexing therefore needs a Workload-Identity-capable replacement image.

The stack does not work around it by re-enabling connection strings for that one service. It documents the boundary and leaves the path broken until the image supports token-based authentication. "Async indexing works with the default images" is on the site's list of things that are not true, with the Key Vault check that shows the DISABLED value.

### 15. Inbound: rewriting identity at the door · target 18:30

Inbound identity has a constraint that comes from the Azure provider itself: it reads the caller's identity from HTTP headers, x-app-id and x-user-id, and its Spring filter chain does not read the request principal directly. A header the client can write is not an identity. So the stack establishes it at the edge.

The gateway spi-gateway binds to the AKS managed ingress in aks-istio-ingress and routes to the service. In the osdu namespace, a RequestAuthentication validates the bearer against the accepted issuers and audiences, and an EnvoyFilter on the sidecar's inbound path reads the validated claims and writes x-app-id from the token's own application id and x-user-id from the issuer-specific claims. Whatever the client sent in those headers is replaced by what the token proves. No audience maps to a fixed principal; a caller is projected as itself.

Then the service still makes its own authorization decision. A token being accepted does not mean the call is authorized; entitlements decides what the caller may do. And the failure mode is specific: if a token's audience is not in the accepted list, validation is skipped, the filter exits early, and downstream services answer 403 with an empty app-id. Check the RequestAuthentication and EnvoyFilter first when Jobs return 401 or 403.

One more thing at the door. Port 80 serves the API routes in every ingress mode, and nothing redirects. A client that uses an http URL sends its bearer token in plaintext, even when a certificate exists for the host. Use the https endpoint that spi info --show-apis prints.

### 16. Making an empty OSDU useful · target 20:13

A converged environment with green probes still cannot store a record. Three things have to exist first: a partition record, so services can find their backends; the entitlements root groups, so authorization has a graph to evaluate; and default legal tags, so ingestion has a policy to attach. Beyond those, the schema service needs about 1,386 shared schemas loaded before any record that references a kind can be stored.

The stack runs these as initialization Jobs managed by Flux, in the osdu namespace, ordered after the services. A completed Job object is the evidence that the step ran. Partition and entitlements initialization precede schema loading. The schema-load Job has a 150-minute deadline and its Kustomization a 155-minute timeout. Those are ceilings for a stuck load, not a normal wait. When progress stalls, read the Job's conditions and logs rather than the clock.

Not every runtime input comes from Git. Before Flux starts, the CLI creates the namespaces, the seed credentials, the ServiceAccounts, ConfigMaps such as spi-cluster-config, and the identity bindings. Those live in osdu-flux, apart from the extension-controlled flux-system namespace, and the workloads consume them when Flux starts. A rebuild from Git alone does not recreate them; spi up does.

### 17. The image lock · target 21:33

Every service image in the environment is named in one ConfigMap, osdu-image-lock, in the osdu-flux namespace. It has one key per service, PARTITION_IMAGE_DIGEST among them, and Flux substitutes the values into the manifests at apply time. The environment pins by digest, never by tag, so a retag in a registry cannot change what runs. A deploy is an edit to the lock.

Between fork runs, the lock holds the canonical image for each service. Today that comes from the community registry on GitLab. A service fork publishes to GHCR under its repository name, ghcr.io/azure/osdu-spi-partition, and that package must stay public: if its visibility flips, pods fail with ErrImagePull, and the fork's weekly settings check can only report it. The stack also provisions a small Azure Container Registry, but it is not the source of either kind of image; mirroring into it is a possible follow-up, not the implemented path. Promoting a fork's image to become a service's canonical image is designed in the decision register and not built; today the lock returns to the community image after every fork run. To see what the environment considers canonical, read the ConfigMap: kubectl get configmap osdu-image-lock -n osdu-flux.

### 18. One environment, eight forks by design · target 22:51

Everything so far is about deploying OSDU. The reason the stack is engineered this carefully is that a standing shared environment is the test target for the service forks. The design is for eight forks, one per service, each borrowing its own service's slot. The partition fork is the reference fork and the first; as of September 2026 it is also the only one, and it has not yet adopted the acceptance lane the newer template ships, so the run the site walks through is illustrative until it does.

While the partition slot is pinned to a candidate, the other services keep running their canonical images. A candidate that is ready but wrong can fail a sibling's suite, which is one reason runs are serialised per service by a concurrency group. Several onboarded forks can share the environment at once, one service slot each. The environment is a stack like any other: spi up made it, Flux assembles it, and its deploy identity survives spi down, so onboarded forks keep working across a rebuild.

### 19. Pinned versions and ephemeral pins · target 24:01

The shared environment tracks a reviewed release tag of the stack, never a rolling branch. If the substrate moved under the forks, every fork would fail at once and none would know why.

A fork deploy is a pin. The workflow runs spi service pin partition with the candidate digest and --ephemeral, which records the workflow run id, the source repository and commit, and the canonical image to restore, in the annotation spi-stack.osdu.dev/pins on the lock. The write is a compare-and-set, so a lost write is caught and a later pin takes over. Flux reconciles the lock and the pod restarts on the pinned digest. The run then polls spi service verify for up to fifteen minutes, checking the Deployment template, a running pod's imageID, and rollout completion; lock_mismatch fails immediately because someone else changed the lock. There is no second verify before each suite.

Restore is the part to say precisely. The last step always runs, even after a failure. spi service reset partition --if-run with this run's id writes the canonical image back only while the annotation still names this run. A newer run's pin is left alone; the reset exits 2, and the lane treats that as success. So a green restore is a claim about this run, not about the environment. A cancelled run, an expired token, or a lost runner can strand a pin. The sweep verb exists, spi service reset --ephemeral --stale-only, but the scheduled workflow step that would run it is not built, so today a stranded pin is work for a person.

### 20. Trusting a repository without trusting its pull requests · target 25:45

For a fork's workflow to write the lock at all, the environment has to trust it, and it does so without a stored secret. spi onboard partition --repo, with the fork's owner and name, adds a federated credential on the environment's deploy identity for one subject: that repository's protected environment named spi-stack. It also writes five repository variables into the fork: the client, tenant, and subscription ids, the resource group, and the cluster. Trust is an OIDC relationship between the fork's GitHub environment and the deploy identity.

In the cluster the deploy identity holds two Roles. spi-fork-deployer in osdu-flux may read and patch the image lock and nothing else. spi-fork-verifier in osdu may read Deployments, Pods, logs, events, ConfigMaps, and Jobs. It cannot create resources, delete a Deployment, or read Secrets.

And the fork's own gate decides, before any Azure login, whether a run may borrow at all: only push and pull_request events, only pull requests from the same repository, not Dependabot, not the generated fork_upstream branch. A pull request from a stranger's fork never carries the deploy identity.

### 21. What the design is really about · target 26:56

Step back and the design has one purpose: let the Azure provider code be proved against real Azure services, by many forks, without the forks breaking each other or the environment. Ordered assembly and a suspended source keep the environment steady while you work in it. Identity is exchanged, not stored, for the Azure services, and rewritten from the token at the edge for callers. The image lock is the one object a fork run writes, and it writes it with its own run id so it can give the slot back only if the slot is still its own.

What you can now say: the stack is a resource group with AKS and the Azure data services beside it, not the cluster alone. spi up creates; Flux assembles; controllers keep workloads healthy; CLI exit, convergence, readiness, and proof are four different signals. And the provider you will change lives inside the service image, which is where the fork deep dive picks up: how that provider stays fork-owned while the shared code around it is regenerated every day.

## Word list the narration must keep

- Service Provider Interface, never software provider interface.
- Development and test environment. Never production, never Azure Data Manager for Energy.
- Plans to remove. Upstream's removal of its Azure implementations is planned (community ADR 61, osdu-spi ADR-038); as of September 2026 the directory is still there.
- Observed at roughly 45 to 50 minutes in centralus, a planning estimate from prior runs. Never "takes", never "guaranteed".
- Cosmos data-plane role propagation is five to fifteen minutes; no other figure for waiting on role assignments.
- Workload Identity replaces stored keys for the Azure data services, not every credential; Redis and Elasticsearch passwords remain in Kubernetes Secrets mirrored into Key Vault.
- Restore writes the canonical image back only while the run still owns the pin; a lost runner can strand a pin; the stale sweep's workflow step is not built.
- Designed for eight forks; the partition fork is the reference and, as of September 2026, the only one, and it has not adopted the acceptance lane yet.
- Public repositories under Apache 2.0. Nothing is proprietary.

## What this script says differently from the current recording

Timestamps are the markers in `src/content/audio.js` for the `stack` episode (transcript times in the current recording).

| Marker                                                         | The current recording                                                                                                                                          | This script                                                                                                                                                                                                                                                                            |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0:00 Why OSDU exists                                           | Six minutes on a merger, trapped data, and what OSDU is, plus praise of the source material.                                                                   | Dropped. Chapter 1 opens on the engineering question and assumes the listener knows OSDU.                                                                                                                                                                                              |
| 7:57 Fifty resources, one command                              | "You wait approximately 45 to 50 minutes" as a property of the tool; "a multi-day expert exercise".                                                            | 45 to 50 minutes is an observation from prior centralus smoke runs and a planning estimate, region-dependent, with overlapping phases not summed; API readiness can follow the CLI exit.                                                                                               |
| 10:57 A development and test environment by design             | "Destroy itself two hours later"; "40 of those 50 minutes just waiting for Entra ID to propagate role assignments for 30 different microservices".             | No lifetime claim. Cosmos data-plane role propagation is five to fifteen minutes, and services cache clients at startup.                                                                                                                                                               |
| 19:51 The three that stayed in the cluster                     | "450 gigabytes of premium SSD storage".                                                                                                                        | Dropped; not in the reviewed documentation. Redis and PostgreSQL reasons stated from ADR-003.                                                                                                                                                                                          |
| 30:31 When reconciliation gets stuck                           | A Flux-versus-webhook fight over 50 and 100 millicores, resolved by hard-coding the request.                                                                   | The two documented traps only: Stalled with RetriesExceeded, and RollbackFailed on an immutable Job template, with spi reconcile as the retry.                                                                                                                                         |
| 33:55 Identity is two different jobs: outbound                 | "There is literally no password stored anywhere in the cluster."                                                                                               | Workload Identity replaces stored keys for the Azure data services. Redis and Elasticsearch passwords remain in Secrets mirrored into Key Vault; the partition provider reads Redis with that password, then Table Storage with Workload Identity.                                     |
| 37:02 The shared-identity trade-off                            | "Holds the keys to the entire kingdom"; only one identity described.                                                                                           | Plain statement of the trade-off, plus the separate deploy, member, and no-access identities.                                                                                                                                                                                          |
| 47:43 The image lock                                           | The lock "holds the repository URL, the release tag, and the digest"; compared to a package lock file.                                                         | One key per service holding a digest; Flux substitutes at apply time; canonical images from the community registry, fork images from GHCR, ACR not the source.                                                                                                                         |
| 48:57 One environment, eight forks by design                   | Eight active forks "inject Azure-specific optimizations" and "deploy their unmerged, untested code into this one persistent environment all day long".         | Designed for eight; partition is the reference fork and, as of September 2026, the only one; it has not adopted the acceptance lane, so the run shown is illustrative. Serialised per service.                                                                                         |
| 50:40 Pinned versions and ephemeral pins                       | Last-write-wins on the lock; a run "queries spi status as JSON" and aborts when superseded; "a scheduled sweeper cron job" restores orphan pins automatically. | Compare-and-set on the lock; spi service verify with lock_mismatch; restore with --if-run writes the canonical image back only while the run owns the pin, exit 2 treated as success; the sweep verb exists but its scheduled step is unbuilt, so a stranded pin is work for a person. |
| 55:20 Trusting a repository without trusting its pull requests | RBAC described generally.                                                                                                                                      | The two Roles named with their verbs, the five repository variables, and the gate's refusal list.                                                                                                                                                                                      |
| 56:46 What the design is really about                          | Closing speculation about complexity "too massive for any single human mind".                                                                                  | Closes on the four signals to distinguish and hands off to the fork deep dive.                                                                                                                                                                                                         |

Throughout: no "masterclass", "brutal honesty", "nightmare", "wild to think about", no mock surprise, no construction-site or interior-decorator analogy, no evaluation of the documentation's candour.

## Generation brief

Use **this script** as the only selected source. Do not select the SPI Stack guide, the decision register, or the site; they are the sources the script was checked against, and giving the generator the mechanisms again is what produced the current hour-long recording with the six-minute introduction.

Suggested generation prompt, for NotebookLM or a narrator:

> Read the attached script as written, chapter by chapter, in order, as a single narrator. The audience is engineers who already know OSDU and are learning the Azure stack. Keep every chapter heading as a spoken chapter break so the recording can be marked at each one. Do not add an introduction to OSDU, the energy industry, or data platforms. Do not add facts, commands, durations, counts, percentages, or guarantees that are not in the script. Do not add analogies; the script uses one word, machinery, and no others. Do not praise the source material, express surprise, or describe anything as a nightmare, a masterclass, brutal, wild, or terrifying. Do not describe the stack as production or as Azure Data Manager for Energy. Where the script states a condition in the same sentence as a behaviour, keep the condition in the same sentence. Calm, precise, plain. Aim for 25 to 35 minutes.

If the generator produces a two-voice conversation, the second voice may ask the question a chapter answers, and nothing else; every answer must come from the script.

### Review the recording before it replaces anything

- By the two-minute mark the listener has heard the Service Provider Interface named, that the interface and its implementation ship in one image, and that the opendes lookup reads a cache then common Table Storage.
- The 45 to 50 minute figure is spoken as an observation from prior centralus runs, never as a duration the tool takes.
- The role-propagation figure is five to fifteen minutes and nothing else.
- Workload Identity is scoped to the Azure data services, and Redis and Elasticsearch passwords are mentioned in the same chapter.
- Restore is spoken with its condition: only while the run still owns the pin; a lost runner can strand a pin; the sweep step is not built.
- The forks are "designed for eight" with partition the first and only, and the acceptance run is illustrative.
- No chapter names a real environment or subscription; only opendes and <name> appear.
- The closing hands off to the fork deep dive rather than speculating.

### After recording

1. Encode: `ffmpeg -i <input> -ac 1 -c:a aac -b:a 56k public/audio/<slug>.m4a`.
2. Transcribe: `uvx --from mlx-whisper mlx_whisper public/audio/<slug>.m4a --model mlx-community/whisper-large-v3-turbo --output-format vtt --language en`, keep the VTT in `docs/reference/`, and regenerate `src/content/transcripts/stack.js` from it. The transcript represents the recording; do not edit it to say what the recording should have said.
3. Update the `stack` episode in `src/content/audio.js`: file, duration, `origin`, and the 21 markers with the recorded chapter times and the titles above. Drop the source-check notes the new recording no longer needs; add one for anything the narrator changed.
4. Re-point the `listen` cues in `src/content/chapters.js` that name the `stack` episode (lessons 01, 02, and 06) at the new marker times. The content test requires each cue to start on a marker of its episode.
5. Retitle the episode on the Audio deep dives page from the script's subject, not from the generator's title; the generated title belongs in `origin`.
