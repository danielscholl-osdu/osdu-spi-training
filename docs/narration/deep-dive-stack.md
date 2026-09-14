# The stack deep dive: narration

## Part 1 · The environment

### 1. Shared core, swappable providers

What is actually running when someone says "the stack", and how was it engineered so that a service fork can prove an Azure change against it? You already know the OSDU APIs and data partitions. What is new is the environment around them, and the provider inside each service.

Start inside one service. Every OSDU service keeps its business logic in a core module and reaches its cloud through a provider implementation. The boundary between them is the Service Provider Interface, SPI. For the partition service, the shared code is partition-core and the Azure provider is provider/partition-azure. Both compile into one executable JAR, and one image runs it. Crossing the interface is a Java call, not a network hop.

Take one request as the running example: a lookup of the partition called opendes, GET /api/partition/v1/partitions/opendes. The shared code admits the caller, validates the id, and calls getPartition on the provider interface. The Azure implementation checks Redis inside the cluster, and on a miss, or when the cache read throws, it reads the stored configuration from a table in common Storage outside the cluster. That lookup returns where opendes lives. Other services use the answer to find their own Cosmos DB, Storage, and Service Bus.

The provider implements the cloud-specific behavior behind the shared interface. The stack exists so that code can be run and proved against the real Azure services.

### 2. Fifty resources, one command

Provisioning this environment by hand means roughly fifty Azure resources in the right order: the cluster, its identities, the data services that need the cluster's OIDC issuer before they can be wired, Key Vault, networking. The spi CLI compresses that into one invocation: spi up --env <name>. It creates a resource group named spi-stack-<name>, runs Bicep to create AKS first, reads the cluster's OIDC issuer, then provisions the data services and managed identities that depend on it, seeds the cluster with namespaces, configuration, and credentials, and activates Flux.

The command has three profiles, bare, minimal, and core, with core the default, and it takes --tag to pin an immutable release of the GitOps source. The CLI refuses a tag whose version differs from its own, so the tested pair stays reproducible. Profiles change the Kubernetes workloads. They do not remove the baseline AKS cluster or Azure data services. bare omits the application and middleware workloads and keeps the cluster, the data services, and the GitOps machinery; minimal adds the middleware; core adds the OSDU services.

The documentation records timing as observations. Prior smoke runs in centralus were observed at roughly 45 to 50 minutes, including about 30 minutes for AKS and 10 to 15 minutes for the Flux extension. Those are planning estimates from earlier runs, not a guarantee for the current release or for another region; the CLI defaults to westus3, and its help names eastus2 and centralus as constrained. The phases overlap, so they are not added. And the CLI returning is not the environment being ready. API readiness can follow the CLI exit, and the fifth chapter says how to tell.

### 3. A development and test environment by design

First, the scope. This stack is a development and test environment. Every OSDU service shares one Azure managed identity. There is no backup and no disaster recovery. The middleware is sized for testing. It is not production, and it is not Azure Data Manager for Energy.

The scope follows from the purpose. The environment exists to run the Azure provider code against real Azure services and to be borrowed by service forks for that. A disposable environment that comes up from one command and goes away with another serves that purpose. Per-service identity isolation, replication, and rotation would serve a different one, at a cost the test target does not need to carry.

The trade-off is real and the documentation states it. Because every OSDU pod is the same Azure principal, a compromise of one service reaches everything the environment's identity can reach. For a shared test target that is accepted. Nobody should carry this design to a production system, and the site says so on every view where identity appears.

Disposable has a precise meaning too. Ordinary spi down --env <name> deletes the cluster, the data services, and their data. It waits up to 45 minutes, and that is a timeout, not a promised duration; an incomplete delete exits nonzero and lists what remains, so you run it again. What survives is the managed identities, the resource group spi-stack-<name>, and its naming tags, so the next spi up reuses the same names and identity client ids. Cluster seed Secrets are lost and middleware passwords are regenerated. spi down --purge is the separate, final choice: it removes the identities' external grants and deletes the resource group itself. And a green teardown job in CI is not proof of deletion. The CI step requests the deletion asynchronously and tolerates failure, which is why az group exists is the check.

## Part 2 · Owners, and what runs where

### 4. Four owners, four boundaries

Four owners keep this machinery from fighting itself, and each one has a boundary. This part follows those boundaries through the environment: who creates what, what runs in Azure, what stays in the cluster, and what the cluster's platform demands.

The CLI and Bicep own Azure: the resource group, the cluster, the data services, the identities, the seed inputs in the cluster. They run when a person or a CI job runs spi up, and then they stop.

Flux owns the workloads. It reads the osdu-spi-stack manifests and local Helm charts and applies Kustomizations and HelmReleases in dependency order. Its controllers live in flux-system; the stack's own GitRepository and inputs live in osdu-flux, which keeps SPI-owned objects apart from the extension-controlled namespace.

Kubernetes controllers and operators keep the workloads healthy. In the foundation namespace, ECK manages Elasticsearch, CloudNativePG manages PostgreSQL, and cert-manager and trust-manager handle certificates and trust. The platform namespace holds the middleware. The osdu namespace holds the OSDU services and their initialization Jobs.

And people own the decisions: when to update the environment, when to diagnose it, when to remove it.

The practical use of the boundaries is diagnosis. When something fails, start in the namespace that owns the failed workload, and ask which owner's view of the world you are looking at. kubectl get kustomizations -n osdu-flux shows Flux's view. kubectl get pods -n platform shows the middleware's.

### 5. The CLI exits; Flux keeps working

A successful spi up does not establish API readiness. Before spi up returns, it waits for the Git source, verifies that Flux has the requested revision, then suspends the Git source and writes the deploy record. Flux is already reconciling while those final CLI stages run. There is no moment when the CLI stops and Flux starts; they overlap. A successful exit means the orchestration completed without a fatal error.

The documentation lists five signals, and each establishes something different. The CLI exited successfully: the orchestration completed. The Git source has an artifact: Flux has manifests to reconcile, and the CLI verified that before it returned. The Kustomizations and HelmReleases are Ready: the declared resources passed their health checks. The initialization Jobs are Complete: the partition and entitlements bootstrap and the schema load finished. An authenticated API request succeeds: that request path is usable. They are separate signals; read the one that answers your question.

spi status --watch follows the third and fourth: workloads turning Ready, Jobs reaching Complete. It makes no API request. A pod in the Running phase is not necessarily Ready, and a finished Job should read Complete, not Running. spi info --show-apis discovers the endpoints. spi token exchanges a short-lived Kubernetes token for an OSDU bearer as the environment's deploy identity; its JSON output includes the bearer's expiry, which is the figure to check when a long suite sees a 401 mid-run. Then one authenticated lookup of opendes proves that one path. It proves nothing about search, storage, or ingestion. Check the signal you actually need.

### 6. Why the provider uses Azure PaaS

The Azure provider talks to Cosmos DB, Service Bus, Storage, and Key Vault. The community implementation, CIMPL, runs its dependencies inside Kubernetes: PostgreSQL, RabbitMQ, MinIO. Testing the Azure provider against substitutes like those would bypass the very code the environment exists to prove. So the stack uses the Azure services, and it is Azure-only by design rather than by preference.

The layout follows the partition model you know. In this stack the partition opendes owns a Cosmos DB SQL account, a Storage account, and a Service Bus namespace. The environment shares common Storage, which holds the partition table, the entitlements graph in Cosmos DB Gremlin, Key Vault, and the service identity. The first partition is also the primary one, which hosts the system database schema loading uses. Partition-specific resources do not create partition-specific identities; the OSDU workloads still share one.

One operational fact belongs here because it looks like a bug. Cosmos data-plane grants are Cosmos-native role assignments. They do not appear in az role assignment output, they propagate in five to fifteen minutes, and services cache their clients at startup. A fresh grant can therefore need a pod restart before it takes effect. "The role assignment is missing" is usually the wrong diagnosis.

### 7. The three that stayed in the cluster

Three systems did not move to Azure services, and each has a reason.

Elasticsearch stays in the cluster because the OSDU search and indexer services speak the Elasticsearch API, and Azure AI Search does not implement it. Replacing it would mean rewriting the shared search code, which is the code the stack is meant to run as published.

Redis stays because the services expect custom CA-backed TLS and specific database isolation, and Azure Cache for Redis would add network latency and cost for what is a cache.

PostgreSQL stays because Airflow needs a small relational database for its own metadata, and a managed instance is poor value for that scratch pad.

They run in the platform namespace, managed by the operators in foundation, outside the Istio mesh that the OSDU pods join. And they carry the consequence the identity part comes back to: the Redis and Elasticsearch passwords are real credentials. They live in Kubernetes Secrets and are mirrored into Key Vault. Deleting a Secret does not rotate them: reconciliation does not regenerate a chart Secret, and the next spi up copies the same value back from the persistent seed in osdu-flux. Deleting the seed itself is worse, because a later spi up can generate values the running middleware does not know.

### 8. Letting Azure run the cluster

The cluster is AKS Automatic. Microsoft manages the nodes, the managed Istio revision, and the platform defaults, and the stack lives by the platform's rules. Two of those rules shape everything above them.

The first is a version floor. The cluster pins Kubernetes 1.36. Below 1.36, AKS Automatic blocks the creation of any MutatingWebhookConfiguration for every identity, regardless of RBAC. cert-manager, CloudNativePG, and ECK all rely on mutating webhooks, so the operator model cannot work there. From 1.36 the block narrows to a scoped policy that the stack's webhooks do not touch. A region where 1.36 is not available cannot host the stack until it rolls out.

The second is Deployment Safeguards, and they cannot be bypassed. Every pod must run as non-root, drop Linux capabilities, declare resource requests and limits, and carry probes. That is good hygiene, and it collides with the community Helm charts, which were not written for it.

### 9. One local Helm chart

Patching the community charts at deploy time was considered and rejected, because a patch depends on the exact structure of the upstream template. When the community moves a block or renames a value, the patch stops applying, and either the deployment is rejected or it lands without the security context you thought you had added.

Instead the stack keeps one local chart, osdu-spi-service, and every OSDU service deploys through it. The non-root user, the dropped capabilities, the limits, and the probes are written into the chart at authoring time. Compliance is a property of the artifact, not of a step that runs on the way in.

The cost is that the community chart version no longer tells you what is running; the image reference does. The partition HelmRelease in osdu-flux installs the osdu-spi-service chart into the osdu namespace, and the resulting Deployment is named partition. To see the image it runs, read the Deployment's container image, not a chart version.

## Part 3 · Assembly and reconciliation

### 10. Ordering is the design; the deliberate pause

Now the assembly itself: the order Flux applies things in, the pause the CLI leaves it in, and the two ways it gets stuck.

Flux does not apply everything at once. The Kustomizations form a strict dependency graph: the foundation operators, then the platform middleware, then the OSDU services, then the initialization Jobs. A blocked Kustomization sits at DependencyNotReady; follow its dependsOn chain to the first unhealthy dependency. Runtime API dependencies and Flux rollout dependencies are different graphs, so a service being deployed does not mean the services it calls are ready.

When spi up finishes, it suspends the Git source. Suspension stops Flux fetching new commits. It does not stop reconciliation. The cached revision keeps being applied, so a live edit to a Flux-managed object is reverted, external chart repositories keep their own schedules, and the controllers keep running. What the pause buys is that a colleague's merge to the stack repository cannot change the environment under you while you are chasing a failure in it. "Suspended means frozen" is one of the easy mistakes on the site: nothing is frozen, only the fetch.

### 11. When reconciliation gets stuck

Two documented traps end a rollout without an obvious error.

The first is retry exhaustion. When a HelmRelease fails to install or upgrade, helm-controller retries, then gives up. The release reports Stalled with reason RetriesExceeded, its dependents sit at DependencyNotReady, and spi status renders it as Stalled. Re-applying the same manifest does nothing, because nothing changed and the release's generation does not move. spi reconcile clears the failure count and forces one attempt. A terminal stall, a bad chart or an invalid health-check expression, needs a real change; forcing it again reproduces the same failure. flux get helmreleases in osdu-flux is where to look for RetriesExceeded.

The second is the immutable Job template. A Job's pod template cannot change after the Job exists. When a chart change touches that template, the initialization HelmRelease, osdu-spi-init or osdu-spi-legal, holds at RollbackFailed, and the Helm error names the field as immutable. Both cases are in the Flux reconciliation guide with the commands to check. Neither is fixed by waiting.

## Part 4 · Identity

### 12. Identity is two different jobs: outbound

Identity in this environment is two separate jobs, and conflating them wastes hours in the wrong layer. Outbound identity answers whether a pod can obtain an Azure token to call Cosmos DB, Storage, Service Bus, or Key Vault. Inbound identity answers whether an incoming OSDU request is accepted and as whom. This part takes them in that order.

Outbound uses Workload Identity. Each OSDU pod runs under the ServiceAccount workload-identity-sa in the osdu namespace. The cluster projects a short-lived, signed token into the pod. A federated credential on the managed identity spi-stack-<name>-osdu-identity tells Entra ID to trust tokens from this cluster's OIDC issuer for that ServiceAccount. The Azure SDK exchanges the projected token for an Azure access token. Shared-key access on the Storage accounts is disabled, local authentication on Service Bus is disabled, and the retained connection-string fields hold the placeholder DISABLED. No usable Azure data-plane key or connection string is stored in the cluster.

Workload Identity replaces stored keys for the Azure data services. It does not replace every credential. Redis runs in the platform namespace and authenticates with a middleware password from the Secret platform/redis-credentials, whose value is mirrored into Key Vault; Elasticsearch has one too. In the running example, the partition provider reads Redis with that password, then reads the partition table in common Storage with Workload Identity.

### 13. The shared-identity trade-off

There is one such identity for all the OSDU services. Every OSDU pod is the same Azure principal. That is operationally simple for a test target: one set of role assignments, one federated credential, nothing to keep in step as services are added. It is not an architecture for production, and the decision register says so.

Two clarifications keep the picture accurate. Partition-specific Azure resources, the Cosmos account and Storage account that opendes owns, do not imply isolation between services; they are all reached by the same identity. And the workload identity is not the only identity in the environment. There is a separate deploy identity, which the fork lane and spi token use, and there are member and no-access test identities for exercising entitlements as a non-admin and as a caller absent from the groups. spi token --member and spi token --no-access select them.

### 14. The async path that does not work

Enforcing identity-based access on Service Bus has one documented casualty. The intended indexing path is Service Bus, then indexer-queue, then indexer, then Elasticsearch. The community indexer-queue image builds a Service Bus connection string regardless of Workload Identity, finds the placeholder DISABLED, and cannot authenticate. Records-changed indexing therefore needs a Workload-Identity-capable replacement image.

The stack does not work around it by re-enabling connection strings for that one service. It documents the boundary and leaves the path broken until the image supports token-based authentication. "Async indexing works with the default images" is on the site's list of things that are not true, with the Key Vault check that shows the DISABLED value.

### 15. Inbound: rewriting identity at the door

Inbound identity has a constraint that comes from the Azure provider itself: it reads the caller's identity from HTTP headers, x-app-id and x-user-id, and its Spring filter chain does not read the request principal directly. A header the client can write is not an identity. So the stack establishes it at the edge.

The gateway spi-gateway binds to the AKS managed ingress in aks-istio-ingress and routes to the service. In the osdu namespace, a RequestAuthentication validates the bearer against the accepted issuers and audiences, and an EnvoyFilter on the sidecar's inbound path reads the validated claims and writes x-app-id from the token's own application id and x-user-id from the issuer-specific claims. Whatever the client sent in those headers is replaced by what the token proves. No audience maps to a fixed principal; a caller is projected as itself.

Then the service still makes its own authorization decision. A token being accepted does not mean the call is authorized; entitlements decides what the caller may do. And the failure mode is specific: if a token's audience is not in the accepted list, validation is skipped, the filter exits early, and downstream services answer 403 with an empty app-id. Check the RequestAuthentication and EnvoyFilter first when Jobs return 401 or 403.

One more thing at the door. Port 80 serves the API routes in every ingress mode, and nothing redirects. A client that uses an http URL sends its bearer token in plaintext, even when a certificate exists for the host. Use the https endpoint that spi info --show-apis prints.

## Part 5 · From an empty OSDU to a borrowed one

### 16. Making an empty OSDU useful

The last part covers what turns a converged environment into a usable one, and then what the environment provides so that a service fork can borrow it.

A converged environment with green probes still cannot store a record. Three things have to exist first: a partition record, so services can find their backends; the entitlements root groups, so authorization has a graph to evaluate; and default legal tags, so ingestion has a policy to attach. Beyond those, the schema service needs about 1,386 shared schemas loaded before any record that references a kind can be stored.

The stack runs these as initialization Jobs managed by Flux, in the osdu namespace, ordered after the services. A completed Job object is the evidence that the step ran. Partition and entitlements initialization precede schema loading. The schema-load Job has a 150-minute deadline and its Kustomization a 155-minute timeout. Those are ceilings for a stuck load, not a normal wait. When progress stalls, read the Job's conditions and logs rather than the clock.

Not every runtime input comes from Git. Before Flux starts, the CLI creates bootstrap inputs in the namespaces that consume them: the namespaces themselves, seed credentials, ServiceAccounts, ConfigMaps such as spi-cluster-config, and identity bindings, across osdu-flux, platform, and osdu. osdu-flux holds the stack's GitOps inputs, apart from the extension-controlled flux-system namespace, and the test-caller ServiceAccounts that spi token uses are in spi-test. The workloads consume those inputs when Flux starts. A rebuild from Git alone does not recreate them; spi up does.

### 17. The image lock

Every service image in the environment is named in one ConfigMap, osdu-image-lock, in the osdu-flux namespace. It has one key per service, PARTITION_IMAGE_DIGEST among them, and Flux substitutes the values into the manifests at apply time. The environment pins by digest, never by tag, so a retag in a registry cannot change what runs. A deploy is an edit to the lock.

Between fork runs, the lock holds the canonical image for each service. Today that comes from the community registry on GitLab. A service fork publishes to GHCR under its repository name, ghcr.io/azure/osdu-spi-partition, and that package must stay public: if its visibility flips, pods fail with ErrImagePull, and the fork's weekly settings check can only report it. The stack also provisions a small Azure Container Registry, but it is not the source of either kind of image; mirroring into it is a possible follow-up, not the implemented path. Promoting a fork's image to become a service's canonical image is designed in the decision register and not built; today a fork run captures the canonical image when it pins and writes that captured canonical image back afterwards, so the lock returns to the community image after every run. To see what the environment considers canonical, read the ConfigMap: kubectl get configmap osdu-image-lock -n osdu-flux.

### 18. One environment, eight forks by design

Everything so far is about deploying OSDU. The reason the stack is engineered this carefully is that a standing shared environment is the test target for the service forks. The design is for eight forks, one per service, each borrowing its own service's slot.

Three facts stay separate here. The template implements the testing lane. A fork has to adopt and configure it: take the workflow, onboard to an environment, and write its descriptor. And a run has to actually execute it rather than skip at the gate. The partition fork is the reference fork and the first; as of September 2026 it is also the only one, and it has not adopted the lane, so the run the site walks through is illustrative until it does.

While the partition slot is pinned to a candidate, the other services keep running their canonical images. A candidate that is ready but wrong can fail a sibling's suite. Runs from one fork are serialised per service by a concurrency group, and that group is repository-scoped: it orders that fork's own runs and nothing else. Several onboarded forks can share the environment at once, one service slot each, and the environment's maintenance flag is what stops new deploys while it is being worked on. The environment is a stack like any other: spi up made it, Flux assembles it, and its deploy identity survives spi down, so onboarded forks keep working across a rebuild.

### 19. Pinned versions and ephemeral pins

The shared environment tracks a reviewed release tag of the stack, never a rolling branch. If the substrate moved under the forks, every fork would fail at once and none would know why.

A fork deploy is a pin. The environment's side of it is three CLI verbs. spi service pin partition with the candidate digest and --ephemeral records the workflow run id, the source repository and commit, and the captured canonical image to restore, in the annotation spi-stack.osdu.dev/pins on the lock. The write is a compare-and-set, so a lost write is caught and a later pin takes over. Flux reconciles the lock and the pod restarts on the pinned digest. spi service verify checks the Deployment template, a running pod's imageID, and rollout completion; lock_mismatch fails immediately because someone else changed the lock.

Restore has one rule. spi service reset partition --if-run with a run's id writes the captured canonical image back only while the annotation still names that run. A newer run's pin is left alone; the reset exits 2, and the fork's lane treats that as success. So a green restore is a claim about one run, not about the environment. A cancelled run, an expired token, or a lost runner can strand a pin. The sweep verb exists, spi service reset --ephemeral --stale-only, but the scheduled workflow step that would run it is not built, so today a stranded pin is work for a person.

### 20. Trusting a repository without trusting its pull requests

For a fork's workflow to write the lock at all, the environment has to trust it, and it does so without a stored secret. spi onboard partition --repo, with the fork's owner and name, adds a federated credential on the environment's deploy identity for one subject: that repository's protected environment named spi-stack. It also writes five repository settings into the fork: the client id as a secret, and the tenant id, subscription id, resource group, and cluster as variables. Trust is an OIDC relationship between the fork's GitHub environment and the deploy identity.

In the cluster the deploy identity holds two Roles. spi-fork-deployer in osdu-flux may read and patch the image lock and nothing else. spi-fork-verifier in osdu may read Deployments, Pods, logs, events, ConfigMaps, and Jobs. It cannot create resources, delete a Deployment, or read Secrets.

That is the environment's side of the contract: a lock that one identity may patch, a pin annotation that names the owning run, a reset that honours that name, and trust granted one repository at a time. Whether a particular run may use any of it is decided in the fork, by a gate that runs before any Azure login. The fork deep dive follows that job step by step.

### 21. What the design is really about

Step back and the design has one purpose: let the Azure provider code be run against real Azure services by the forks that own it. Ordered assembly and a suspended source keep the environment steady while you work in it. Identity is exchanged, not stored, for the Azure services, and rewritten from the token at the edge for callers. The image lock gives a run a controlled way to deploy and restore its candidate. The environment is still shared, so a candidate can affect other services.

What you can now say: the stack is a resource group with AKS and the Azure data services beside it, not the cluster alone. spi up creates; Flux assembles; controllers keep workloads healthy; CLI exit, convergence, readiness, and proof are separate signals. And the provider you will change lives inside the service image, which is where the fork deep dive picks up: how that provider stays fork-owned while the shared code around it is regenerated every day.
