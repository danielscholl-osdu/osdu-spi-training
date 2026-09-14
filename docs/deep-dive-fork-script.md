# The fork deep dive: script for approval

**Status: draft for approval, revised after review.** This script replaces the recording _How the fork receives upstream changes_ when it is approved and a new recording is produced from it. Until a recording is replaced, the current recording, its transcript in `src/content/transcripts/branches.js`, and the marker notes in `src/content/audio.js` stay exactly as they are. Nothing on the site changes because this file exists.

The current recording opens with a story about a green check that hid a failure, then spends three minutes on the energy data problem before reaching the provider model at 5:31. This script is written for engineers who already know OSDU and are learning how a service fork is engineered. It opens on the engineering question, keeps the marker order of the current episode as its chapter spine, drops both openings, and states each corrected claim from the marker notes as the plain fact. It covers lessons 04 to 06: the shape of the fork, a day in the fork, and the handshake with the stack.

The spoken text is kept separately in `docs/narration/deep-dive-fork.md`. That file is what a narrator or generator receives; this document carries the editorial record around it.

**Length:** 4,432 words of narration, about 29.5 minutes at 150 words a minute and 34.1 at 130. Target: 25 to 35 minutes; the length follows the content and is not forced to a figure.

**Structure.** The narration is spoken in five parts, and each part heading is a spoken transition. The 25 chapter headings inside them are the marker titles the site will use for seeking; they are not announced. Target timestamps are at 150 words a minute.

**Part 1 · Ownership**

1. The provider model and the seam · 00:00 (230 words)
2. Upstream plans to remove the Azure code · 01:32 (164 words)
3. Ownership runs through the middle of the tree · 02:38 (152 words)
4. One template for eight services · 03:38 (183 words)
5. The bootstrap problem: local-actions · 04:52 (153 words)

**Part 2 · Generated upstream input**

6. Three branches, and why not two · 05:53 (220 words)
7. Generate the branch, do not merge into it · 07:21 (125 words)
8. fork_upstream as a function of the upstream tip · 08:11 (214 words)
9. Halt on the unknown · 09:36 (171 words)
10. How GitHub records sync progress · 10:45 (153 words)
11. Labels as a state machine · 11:46 (146 words)

**Part 3 · Integration and validation**

12. The cascade: main first · 12:44 (248 words)
13. Versioning without rewriting history · 14:24 (186 words)
14. Never a bare -P · 15:38 (147 words)
15. Why the template supplies the Dockerfile · 16:37 (139 words)
16. Credentials: app tokens and the guard clause · 17:32 (256 words)
17. The pull_request_target lesson · 19:05 (144 words)
18. No coverage gate · 20:02 (72 words)

**Part 4 · Deployment testing**

19. The tests are in the repository; the knowledge is not · 20:31 (150 words)
20. Three contracts: facts, descriptor, machinery · 21:31 (284 words)
21. Borrow, prove, restore · 23:25 (391 words)

**Part 5 · Customer forks, and the rule behind the design**

22. The customer tier and mirror mode · 26:01 (130 words)
23. The decision register and the derived learnings · 26:53 (65 words)
24. The fallback that hid a failure for months · 27:19 (122 words)
25. Split what fails differently · 28:08 (187 words)

Single narrator. Plain engineering language. One metaphor, the site's: machinery. The example partition is `opendes`; the environment placeholder is `<name>`. No real environment or subscription is named. The running example is the partition provider's cache fallback: the fix is real (commit fc2dfbf in osdu-spi-partition), and the acceptance run that follows it is illustrative.

**Adoption status, dated.** As of 13 September 2026, checked at `osdu-spi-partition` revision `3a5690d`, the reference partition fork has no `.spi/service.yaml` and its validation workflow has no Deploy Gate; the template at `osdu-spi` `080f0b8` implements the lane. Chapter 20 states that status. Recheck it immediately before recording: if the fork has adopted the lane by then, replace the status sentences with the demonstrated result.

**Division of labour with the stack deep dive.** The stack episode establishes the environment's side of the contract: the lock, the pin annotation, the reset rule, and trust. This episode explains the job that uses them, step by step, and refers to the environment's mechanics rather than restating them.

## Script

### Part 1 · Ownership

#### 1. The provider model and the seam · target 00:00

How does a service fork take the community's shared code every day and keep its own Azure provider, and how does a provider change become an image that has been proved on Azure? The stack deep dive covered the environment. This one covers the repository, the workflows that run in it, and the moment a workflow borrows the stack. It starts with who owns what.

Start where the stack episode ended, inside the partition service. partition-core holds the shared rules and is upstream's. provider/partition-azure holds the Azure implementation and is the fork's. Between them is the Service Provider Interface: partition-core calls IPartitionService.getPartition, and the Azure class behind it checks Redis, then reads the partition table in common Storage. That is where the friction lives. Upstream can change the shared interface without changing the OSDU API at all, and every such change can require an Azure change. So integration has to compile the shared tree and the Azure tree together, and something has to make sure the daily arrival of shared code never touches the Azure directory beside it.

The running example is a real change in that directory: the cache-read fallback in PartitionServiceImpl, commit fc2dfbf, 30 July 2026, with regression tests. It reached the fork from upstream on 25 August, before the filter existed. From lesson 04 on, the site follows a fix like it made in the fork today.

#### 2. Upstream plans to remove the Azure code · target 01:32

The community's ADR 61 splits the codebase and moves cloud-provider code out of the shared repositories. Upstream plans to remove its Azure implementations. As of September 2026 the upstream Azure directory is still there, and the fork is built so that the removal deletes nothing on its side whenever it lands.

That plan rules out the two easy answers. A snapshot, copying the code once and walking away, stops receiving shared-code changes and gradually diverges from the community implementation; each month the gap costs more to close. A hand-merged fork, where someone merges upstream by hand on a schedule, pays a compounding cost, and in a shared tree a break in another provider's build blocks yours.

So the fork has to own the Azure provider directory permanently while taking shared code from upstream every day. Ownership and responsibility moved to Microsoft; visibility did not. The service forks, the template, and the stack are public repositories under the Apache 2.0 licence. Nothing here is proprietary.

#### 3. Ownership runs through the middle of the tree · target 02:38

Ownership in this repository does not run around its edge. In one commit, partition-core is upstream's and must be replaced every day, and the directory next to it, provider/partition-azure, is the fork's and must never be. Standard branching cannot defend that line, because a merge does not know which directory belongs to whom.

Read the repository by owner and it becomes a short list. Upstream owns partition-core, partition-acceptance-test, and testing/partition-test-core; the fork never edits them, and a change there is an upstream contribution. The root pom.xml is upstream's too, with one Azure profile injected so the fork-owned module resolves. The fork owns provider/partition-azure and testing/partition-test-azure. The template delivers the engineering files, .github and build/Dockerfile, and none of them exist upstream. One engineering file the template never writes, .spi/service.yaml, is the service's own. And the AWS, Google, and IBM providers, partition-core-plus, devops, and the GitLab CI files never reach the fork at all.

#### 4. One template for eight services · target 03:38

The workflows do not live in the fork's history as hand-written files. They come from one template repository, Azure/osdu-spi. Its own .github/workflows run only in the template. What a fork receives is .github/template-workflows, delivered into the fork's .github/workflows, together with the composite actions, the labels, the rulesets, the Release Please configuration, and build/Dockerfile. Sync Template compares the template commit recorded in the fork with the template's main every day at 08:00 UTC and opens one pull request, chore(template-sync), at most one open at a time. It never touches .spi.

The system is designed for eight service forks, one per OSDU service, each generated from the template with its own service name. The partition fork is the reference fork and the first; as of September 2026 it is the only one. The division is exact: the template supplies the engineering workflows, and each fork owns its Azure provider code, its Azure tests, and its configuration. The rule the project states for this is "split what fails differently": a workflow bug and a provider bug fail in different places and are fixed in different repositories.

#### 5. The bootstrap problem: local-actions · target 04:52

A fork generated from the template has a problem on its first day: it cannot receive its machinery before it has the machinery to receive it. The initialization workflow has to merge fork_integration into main with unrelated histories before any template sync has happened.

The answer is chronological. The logic that must be correct at first run lives in .github/local-actions, part of the template's initial commit, so the fork has it from the moment it is created. init-complete.yml calls those actions. Once initialization completes, the sync configuration removes .github/local-actions from the fork, and everything else arrives through template sync from then on. The rejected alternative was a two-phase workflow that fetched the latest initialization files from the template first; it added a bootstrap commit to every fork and a runtime dependency on the template being reachable.

The same configuration lists what sync never touches: .spi, CODEOWNERS, the local actions, and the Copilot instructions.

### Part 2 · Generated upstream input

#### 6. Three branches, and why not two · target 05:53

The second part is how upstream's code arrives: the branches, the generated tree, and how a sync is tracked.

Every service fork has three branches with three jobs. fork_upstream is generated input: the filtered upstream tree, and no person ever writes there. fork_integration is the workspace where the two trees meet; it is allowed to break, its protection is relaxed so a person can resolve a conflict and push directly, and Integration Branch Cleanup resets it to main after each integration merge. main is the protected result: it needs CodeQL and Validation Summary to pass and a person to approve, and auto-merge uses a merge commit, never a squash, because a squash breaks the ancestry check the monitor relies on. Upstream is outside all three.

The two-branch design, fork plus main, was evaluated and rejected. With two branches, the day upstream's change breaks the build, that break lands in the team's own workspace and blocks feature work until someone fixes the community's problem. fork_integration isolates that failure: it breaks there, an issue names it, and work on main continues. The decision record is plain about the cost: three branches cost more than one, and they stay coherent only because workflows manage them. In exchange main stays stable, upstream and local changes are attributable, and conflicts are resolved away from main.

#### 7. Generate the branch, do not merge into it · target 07:21

Deleting the other providers once and then merging upstream every day fails on every sync, for a reason in Git's merge algorithm. It compares the common ancestor with both sides. When upstream modifies a file the fork deleted, that is a modify/delete conflict, and Git halts and asks a person. Upstream touches provider files constantly, so the automation halts constantly, on files the fork does not care about.

Under that pressure someone takes the shortcut, accepts the incoming tree, and commits, and the deleted providers come back into the fork. The project's own summary is exact: stripping the other cloud providers from a fork cannot be done by deleting them and merging upstream afterwards. The fork_upstream branch is therefore never merged into. It is generated.

#### 8. fork_upstream as a function of the upstream tip · target 08:11

fork_upstream has properties an ordinary branch does not. Developers do not make changes on it; inspecting it is fine. No feature branch starts from it. It has one producer, the daily sync, and one consumer, fork_integration. So its content can be a pure function of two inputs: the upstream tip and the filter configuration.

The sync uses Git plumbing rather than a merge. git read-tree loads the upstream tip into a scratch index. The filter runs over that index, keeps the shared modules, drops the provider tree, and injects the Azure profile into the root POM. git commit-tree writes the result as a new commit with two parents: the previous fork_upstream and the upstream commit it came from. Two trailers make it checkable: Upstream-Sha names the upstream commit, Filter-Rev names the filter revision. The history is merge-shaped, git blame still reaches the community author of every shared line, and the merge algorithm never ran.

The generated branch holds the shared code and the injected reference to the Azure module. The whole provider tree is absent, Azure included; the filter's expected-absent list names the provider directory as a whole. The Azure provider joins the tree on fork_integration. If the filter changes, the branch is regenerated, and the generated commit lands through a reviewed sync PR.

#### 9. Halt on the unknown · target 09:36

Generation trades a loud failure for a quiet one. A merge conflict stops you; a generated tree that silently omitted a new shared module compiles fine and fails three days later for no visible reason. So the filter classifies everything. upstream-filter.yml names every top-level path, every testing module, every Maven profile in the root POM, and every FOSSA module as keep, strip, fork, or inject. The whole provider tree and all of devops are handled wholesale. It also lists what must be present and what must be absent after generation, and the engine checks those post-conditions, so a wrong classification fails the sync instead of shipping.

Anything the configuration does not name makes the filter exit 2. The sync stops and opens an issue labelled sync-failed and human-required. Both default behaviours were considered and rejected: dropping unknown paths deletes a new shared module; keeping them lands a new upstream provider in the fork. The learnings put it in one line: guessing would have been convenient exactly once and wrong forever after.

#### 10. How GitHub records sync progress · target 10:45

The sync runs unattended on runners that remember nothing between runs. Without memory it would open a second pull request on Saturday and a third on Sunday for the same upstream state. The project rejected files on the runner, an external database, and hidden Git state, and put the memory in GitHub itself.

Three places hold it. The tracking issue's body carries a hidden HTML comment with the upstream commit the open sync is processing. A repository variable, SYNC_LAST_EVALUATED_SHA, remembers the last upstream commit evaluated and the filter generation. And the labels carry the state, which is the next chapter.

The result is one pull request per upstream state, never two. Sync Upstream pushes a branch named sync/upstream with a timestamp and opens a PR titled Sync with upstream and the version, with a tracking issue labelled upstream-sync and human-required. If upstream moves before that PR merges, the workflow updates the same PR.

#### 11. Labels as a state machine · target 11:46

Tracking-issue labels record the cascade state, and they are the audit trail. When the cascade starts, it removes human-required and adds cascade-active. A conflict or a failed validation swaps that for cascade-blocked. A run that fails leaves cascade-failed and human-required. Success removes all of those and adds validated as the integration PR opens.

human-required is the control signal, and it is not a note for whoever looks next. It means the automation has stopped and a person has to act. Removing the label is the retry signal for a failed cascade. No slash command, no manual workflow run is needed; but no webhook fires either. Cascade Monitor runs every six hours, notices the removed label, and dispatches the cascade again, and a person can dispatch it by hand sooner. Every six hours the monitor also escalates anything blocked longer than 48 hours with a separate issue.

### Part 3 · Integration and validation

#### 12. The cascade: main first · target 12:44

The third part is what happens once the generated tree exists: the cascade that integrates it, the version it produces, the build rules, and the credentials the workflows hold.

After a person reviews and merges the sync PR into fork_upstream, the cascade carries the change forward. It is a workflow_dispatch run: a person starts Cascade Integration with the tracking issue number, and the monitor catches a forgotten one within six hours. Merging into the workspace is cheap and automated; merging into main needs checks and review.

The order inside the cascade matters. It merges main into fork_integration first, so everything the fork has already accepted, including the cache fallback fix on main, is in the workspace. Then it merges fork_upstream on top, so upstream is evaluated against today's truth rather than a stale workspace. It stamps the Azure POM version from the upstream one and builds with Maven profiles core and azure on Java 17. This is the first time the provider compiles against the new shared code. When the build and tests pass, it opens the integration PR from a release/upstream branch into main, titled Upstream Integration to Main.

Suppose instead that upstream renamed a method on the provider interface. fork_upstream generates cleanly, because it carries no provider. The cascade fails to compile provider/partition-azure, the tracking issue gets cascade-blocked and human-required, a validation-failed issue opens, and main is untouched. The fix is a provider change on fork_integration by the fork's owner, and then the cascade runs again.

#### 13. Versioning without rewriting history · target 14:24

A sync can bring in hundreds of upstream commits, and the fork needs a semantic version for its release. Upstream commits are not conventional commits, so nothing in them says whether the sync is a patch or a feature. Squashing them into one commit would give Release Please something to read, and it would sever the link to upstream and break git blame.

Instead the sync appends one empty meta commit on the generated tree. Its subject classifies the whole range by rule: breaking beats feat, feat beats fix, and anything unclassifiable is a fix. The same input always produces the same bump, and the upstream history stays intact underneath.

Release Please reads that commit, and every push to main makes it open or update one version PR with the changelog. That PR is separate from the integration PR, and it can wait. Merging it tags main, records the upstream version in a correlation tag, and adds the version tag to the sha-tagged image that Validation already pushed for that commit. No new build runs. A release is a tag on an image that already exists.

#### 14. Never a bare -P · target 15:38

Maven has a rule that catches everyone once. The upstream root POM marks the core profile active by default, so a plain mvn install on a laptop builds the shared code. But the moment you pass any profile on the command line, Maven deactivates every profile that was active by default. mvn -P azure silently drops core, and the build fails far downstream with an unresolved dependency.

So the template never emits a bare -P. The build invocation is centralised, and it always writes -P core,azure. The one exception is deliberate: on fork_upstream, where the injected Azure profile points at a directory the generated tree omits, Maven would abort the reactor, so validation there builds core only and validates the branch as what it is, a provider-less tree. Azure compilation is validated where the trees exist: on fork_integration in the cascade, and on main on every PR.

#### 15. Why the template supplies the Dockerfile · target 16:37

The project first assumed each service repository would carry a working Dockerfile. The partition fork's upstream Azure Dockerfile based on openjdk:8-jdk-alpine while the service built on JDK 17, copied a JAR named partition-aks-1.0.0.jar that no longer existed, and used a module-relative build context. Nobody upstream was building it that way, so nobody noticed.

The engineering system now owns the service Dockerfile. The template delivers one canonical build/Dockerfile to every fork: the Microsoft OpenJDK 17 Azure Linux base, the provider's Spring Boot JAR copied to /app.jar, no Maven inside the image, and an entry point that runs java -jar /app.jar. Validation builds it and pushes the result to GHCR as ghcr.io/azure/osdu-spi-partition tagged sha- and the commit, which resolves to one digest. The package name is the SERVICE_NAME variable when set and the repository name otherwise; partition uses its repository name.

#### 16. Credentials: app tokens and the guard clause · target 17:32

The workflows write commits, publish images, and log in to Azure, so their credentials are the attack surface. The workflows use different credentials for different jobs. GitHub App tokens support repository automation: the sync, the cascade, the release, and template sync write commits and open pull requests with short-lived App installation tokens minted at the moment the job runs, decoupled from any person, where a personal access token would tie the pipeline to one account and expire with it. The image-publishing job uses GITHUB_TOKEN with package-write permission, and it is the only job in Validation with registry write. The deployment job uses GitHub OIDC to obtain Azure access, and it runs only when the gate's output says it may.

When a job may hold a credential is enforced in the workflow, not in review. The publishing job's condition is the trust clause: a push or a same-repository pull request, never Dependabot, never pull_request_target, never the generated fork_upstream branch. The one exception is a manual run with the force flag set, which a maintainer starts on purpose; the deployment gate refuses manual dispatch altogether. The gate that admits the deployment job carries the same clause in full, and the deployment job runs on the gate's output. The decision record defends writing the clause out rather than relying on a reviewer to notice a missing guard. The validate-only image build runs with read-only contents permission, no registry write, no Azure login, and never sets a checkout ref, so it cannot be turned into a privileged lane by mistake.

#### 17. The pull_request_target lesson · target 19:05

GitHub event contexts are not equally trusted, and the project learned that by doing it wrong. The cascade did not trigger reliably on pull_request, because that event runs the workflow file from the incoming branch. Switching to pull_request_target runs the trusted workflow file from the base branch, which fixed the trigger. But the trusted file then checked out the pull request's head to build it. That runs untrusted code inside a runner holding secrets, and CodeQL flagged it as cache poisoning.

The fix was structural, not a setting. The job that publishes excludes pull_request_target, pull requests from other repositories, and Dependabot, by the clause from the previous chapter. The cascade now runs on workflow_dispatch, started by the monitor or by a person; it does not use pull_request_target at all. The lesson in the learnings is short: know the event context before building a workaround.

#### 18. No coverage gate · target 20:02

JaCoCo reports coverage on every build, and the pipeline enforces no minimum. The reason is the ownership line. Most of the repository is generated from upstream; the fork writes only the Azure slice. A threshold would measure the community's testing habits, and the day an upstream feature arrived without tests, the sync itself would fail. Coverage is reported, not gated, and the fork's own tests are reviewed with the fork's own code.

### Part 4 · Deployment testing

#### 19. The tests are in the repository; the knowledge is not · target 20:31

The fourth part is the deployment test: why the acceptance suites cannot run on their own, the three contracts that let them, and the job that borrows the stack.

The upstream repository carries the acceptance tests, and they compile in the fork. They cannot run, because the knowledge of how to run them lived in upstream's own pipelines: the endpoints, the partition, the tokens. The filter strips devops and the GitLab CI files, and that orphans the suites.

Copying the values into the fork is what the project forbids: no environment values in the repository. A copied value is stale by construction the moment the environment changes, and the same workflows run in customers' mirror forks against environments Microsoft never sees. The environment has to say what it is, the fork has to say what it needs, and the two have to be joined at the moment of the run.

#### 20. Three contracts: facts, descriptor, machinery · target 21:31

That join is three contracts with three owners.

The stack owns the facts. spi status --json says whether the environment is deployable and, if not, exactly why, from a closed set of reasons: kustomization_not_ready, maintenance, missing_deploy_record, bootstrap_failed, bootstrap_pending. spi info --json supplies the gateway URL, the partition, the legal tag, and secret references. The run reads both fresh every time, and it installs the exact spi release the environment records, so the client matches the environment it talks to.

The service owns the descriptor, .spi/service.yaml. It names each suite, the image that runs it, its timeout, and its bindings by source: a gateway, a partition, a token. It never says where. Template sync excludes it by name, and its changes are reviewed with the code.

The template owns the machinery: a resolver that binds the descriptor's symbolic needs to the facts and three tokens the run mints. It halts on the unknown, like the filter. Its exit codes are typed: 2 for a descriptor violation, 3 for an environment that is not ready, 4 for an infrastructure contradiction, so a failure says which team to ask. Two parts of the contract are accepted but not wired yet: Key Vault bindings are not materialised, and descriptor loads, groups, and dependencies are not checked before borrowing.

Three facts about this lane stay separate. The template implements it. A fork has to adopt and configure it: take the workflow, onboard to an environment, and write its descriptor. And a run has to actually execute it rather than skip at the gate. As of September 2026, osdu-spi-partition has not adopted the lane and has not written its descriptor; until it does, the run the site shows is illustrative.

#### 21. Borrow, prove, restore · target 23:25

Now the candidate digest from Validation meets the environment from the stack deep dive.

Deploy Gate decides first, without credentials: only push and pull_request events, only pull requests from the same repository, not Dependabot, not fork_upstream, and only when the five repository settings, the descriptor, a pushed image, and a declared suite all exist. A refusal is a visible notice and the summary stays green. That is why Validation Summary being green is not evidence that anything was deployed.

If the run may borrow, it logs in through the federated credential, connects with spi connect, polls spi status --json every twenty seconds for up to ten minutes until the environment is deployable, and reads the facts. Then it borrows with spi service pin partition, the digest, and --ephemeral. Not kubectl set image, because Flux would revert that; the pin is the compare-and-set on the lock that the stack episode described, and it captures the canonical image to restore. It verifies for up to fifteen minutes that a running pod reports the candidate digest, failing immediately on lock_mismatch.

Then it proves. Each declared suite runs from the acceptance image with its bound environment file under its own timeout. The verdict is the Surefire and Failsafe reports: exit zero, at least one test that was not skipped, and no failures or errors. A container that exits zero has not passed by itself. For the running example, be exact about what this proves: the acceptance suite exercises the partition API on a pod whose cache is healthy. The fallback itself was proved by the provider's unit tests in the build, which mock a cache that throws.

Then it restores. The step runs even after failure, with spi service reset partition --if-run and this run's id. The rule is the environment's, from the stack episode: the captured canonical image goes back only while the pin still names this run, a newer run's pin is left alone, and the lane treats that refusal as success. Restore is a claim about this run, not about the environment. A cancelled run, an expired token, or a lost runner can strand a pin, and until the scheduled sweep step is built, that pin is work for a person. A push test does not leave its candidate installed; advancing the canonical image is the environment's refresh policy, not the lane's.

### Part 5 · Customer forks, and the rule behind the design

#### 22. The customer tier and mirror mode · target 26:01

The last part is the second tier of forks, the two documents that carry the reasoning, and the rule that names the design.

A customer does not fork the community upstream. They fork osdu-spi-partition on GitHub and run Adopt Fork instead of initialization. The repository variable SYNC_MODE set to mirror turns the filter off: fork_upstream becomes a verbatim copy of the service repository's main, with Filter-Rev recorded as mirror, and template sync is off because the service repository already carried it. The ownership assertion and the version stamp are gated off too, because at the mirror tier there is no ownership split to defend. A customer's fix travels back as a pull request whose head is in the fork network, which is why the second tier uses true GitHub forks.

#### 23. The decision register and the derived learnings · target 26:53

Two documents carry the reasoning. The decision records explain the choices: for each decision, what was decided, why, and what was rejected. The learnings record incidents and changes: what the team actually experienced, with dates and issue numbers. Both are linked from the site's Start page under Go deeper, and every claim in the site's lessons traces to one of them or to the source.

#### 24. The fallback that hid a failure for months · target 27:19

One learning belongs in this recording because it changed a rule. The pull request description path was designed to degrade to a structured template when the language model was unavailable. On 1 September 2026 the team found that the fallback was the only path that had ever run: the tool crashed on every invocation for the life of the reference fork while the workflow reported success, and reviewers merged the fallback bodies without noticing. A fallback that cannot be distinguished from success is not resilience; it hides the failure. Descriptions are now deterministic, and the meta commit classification is a rule rather than a model's opinion. No replacement was adopted, and the entry records the three constraints any replacement has to clear.

#### 25. Split what fails differently · target 28:08

The rule that names the whole design is "split what fails differently". Template workflows are split from delivered workflows, so a template bug is fixed once and arrives everywhere as a reviewable pull request. Bootstrap logic is split by when it must exist. Three branches split upstream breakage from feature work. And at the seam, the stack publishes facts and the fork declares needs: the run reads current environment facts instead of maintaining copied values in each fork.

What you can now say: the fork owns provider/partition-azure, its Azure tests, its descriptor, and the engineering files the template delivers, and everything else is upstream's, regenerated daily. fork_upstream is generated with the whole provider tree absent, Azure included, so an upstream deletion has nothing to delete on the fork side. A sync is a generated tree plus one PR and one tracking issue; the labels are the state; the cascade merges main first. Eligible builds publish a digest. An onboarded fork with a declared suite can then test that candidate in the stack. And the run gives the slot back only if the slot is still its own.

## Word list the narration must keep

- Service Provider Interface, never software provider interface.
- Plans to remove. As of September 2026 the upstream Azure directory is still there.
- Public repositories under Apache 2.0. Ownership and responsibility moved; visibility did not. Never "proprietary".
- Designed for eight service forks; the partition fork is the reference and, as of September 2026, the only one.
- Each fork owns its Azure provider code, tests, and configuration; the template supplies the workflows.
- The generated branch omits the whole provider tree, Azure included; the Azure provider joins on fork_integration. Developers do not make changes on fork_upstream; inspecting it is allowed.
- A snapshot fork gradually diverges from the community implementation; never "stops being OSDU".
- Removing human-required is the retry signal; Cascade Monitor notices it on its six-hour schedule, or a person dispatches the cascade. No webhook.
- The cascade runs on workflow_dispatch, started by a person with the issue number or by the monitor.
- Credentials by job: GitHub App tokens for repository automation; GITHUB_TOKEN with package-write permission in the image-publishing job; GitHub OIDC for Azure in the deployment job. Never "GITHUB_TOKEN cannot publish packages".
- The job that publishes excludes pull_request_target, cross-repository pull requests, and Dependabot.
- Copied environment values are stale by construction; the run reads current facts instead. No weekly-rebuild claim, no "within seven days", and no "a stale value cannot exist".
- Five repository settings, not five variables: AZURE_CLIENT_ID is a secret.
- A passing suite means exit zero, at least one non-skipped test, and no failures or errors.
- Captured canonical image, consistently. Restore writes it back only while the run still owns the pin; exit 2 is treated as success; a lost runner can strand a pin; the sweep's scheduled step is not built.
- The template implements the lane; a fork adopts and configures it; a run executes it. The cache fallback fix is real (fc2dfbf); the acceptance run is illustrative because osdu-spi-partition has not adopted the lane or written its descriptor (dated above; recheck before recording).
- Eligible builds publish a digest; an onboarded fork with a declared suite can then test that candidate. Never "every eligible commit gets a turn in the stack".

## What this script says differently from the current recording

Timestamps are the markers in `src/content/audio.js` for the `branches` episode (transcript times in the current recording).

| Marker                                                      | The current recording                                                                                                                                                                                 | This script                                                                                                                                                                                                                                                                                                                                                                                                    |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0:00 A fallback that looked like success                    | A dramatised opening about a green check that lied, "the ultimate nightmare", and praise for the guide as "an absolute masterclass" of "brutal honesty".                                              | Dropped. Chapter 1 opens on the engineering question. The learning itself is chapter 24, stated once with its date and issue.                                                                                                                                                                                                                                                                                  |
| 2:25 The energy data problem                                | Three minutes on petabytes, vendors that disagree on what a well is, and why OSDU exists.                                                                                                             | Dropped. The listener knows OSDU.                                                                                                                                                                                                                                                                                                                                                                              |
| 6:16 Upstream plans to remove the Azure code                | Upstream "announced they were going to permanently delete" the Azure code, "a literal bulldozer"; a snapshot fork "stops being OSDU"; the fork ships "as an official product".                        | Upstream plans to remove its Azure implementations; the directory is still there as of September 2026; a snapshot fork gradually diverges; the forks are public under Apache 2.0.                                                                                                                                                                                                                              |
| 10:17 One template for eight services                       | Eight named active forks; the forks "just own their specific configuration data".                                                                                                                     | Designed for eight; partition is the reference and only fork; each fork owns its Azure provider code, tests, and configuration, and the template supplies the workflows.                                                                                                                                                                                                                                       |
| 22:05 fork_upstream as a function of the upstream tip       | The generated branch described as the shared code without the other providers.                                                                                                                        | The whole provider tree is absent, Azure included; the Azure provider joins on fork_integration. Developers do not make changes on fork_upstream.                                                                                                                                                                                                                                                              |
| 29:06 Labels as a state machine                             | "That deletion event triggers a web hook waking up the automated sweeper bot."                                                                                                                        | Cascade Monitor notices the removed label on its six-hour schedule and dispatches the cascade; a person can dispatch it by hand.                                                                                                                                                                                                                                                                               |
| 30:46 The cascade: main first                               | "When a human finally approves that daily synchronization pull request, the system kicks off the cascade."                                                                                            | After the sync PR merges, a person dispatches Cascade Integration with the issue number; the monitor catches a forgotten one within six hours.                                                                                                                                                                                                                                                                 |
| 40:13 Credentials: app tokens and the guard clause          | "Publish production Docker images to registries"; the default token described as unable to publish packages.                                                                                          | Credentials by job: App tokens for repository automation, GITHUB_TOKEN with package-write permission in the publishing job, GitHub OIDC for Azure in the deployment job, which runs on the gate's output. Candidate images pushed to GHCR by digest; nothing in the lane is production.                                                                                                                        |
| 42:33 The pull_request_target lesson                        | Describes the switch to pull_request_target as the fix, and the lane split as the follow-up.                                                                                                          | The cascade now runs on workflow_dispatch; the publishing job excludes pull_request_target, cross-repository PRs, and Dependabot; CodeQL's finding named.                                                                                                                                                                                                                                                      |
| 48:52 The tests are in the repository; the knowledge is not | "The entire Kubernetes cluster is torn down and rebuilt from scratch every single week"; values "go completely stale in seven days"; developers testing "against my personal local Minikube cluster". | Copied values are stale by construction when the environment changes; the same workflows run in customer mirror forks. No rebuild schedule and no Minikube.                                                                                                                                                                                                                                                    |
| 52:04 Three contracts: facts, descriptor, machinery         | The three contracts described without their limits.                                                                                                                                                   | Adds the closed set of status reasons, the two contract fields the lane accepts but does not wire (Key Vault bindings, pre-borrow checks), and the three adoption facts: the template implements the lane, partition has not adopted it or written its descriptor, so the run shown is illustrative.                                                                                                           |
| 54:28 Borrow, prove, restore                                | "The pipeline executes an unconditional restore operation"; an Airbnb analogy; "unit and acceptance tests" run in the prove phase.                                                                    | Deploy Gate and its refusal list first, with five repository settings. The verdict is exit zero, at least one non-skipped test, and no failures or errors. The restore step always runs but writes the captured canonical image back only while this run owns the pin; the environment's mechanics are referred to the stack episode rather than restated. The fallback was proved by unit tests in the build. |
| 1:02:39 The fallback that hid a failure for months          | The story told twice, opening and closing, with the blindfold line as the episode's frame.                                                                                                            | Told once, in chapter 24, as the recorded learning: date, issue, what changed, what constraints a replacement must clear.                                                                                                                                                                                                                                                                                      |
| 1:05:48 Split what fails differently                        | Closing summary.                                                                                                                                                                                      | Kept as the closing rule, with "What you can now say" from lessons 04 to 06. The run reads current facts instead of copied values; eligible builds publish a digest, and an onboarded fork with a declared suite can then test the candidate. No "cannot exist" and no "every eligible commit gets a turn".                                                                                                    |

Throughout: no "masterclass", "brutal honesty", "nightmare", "wild", "mathematical cruelty", no house-and-roof, sculpting-versus-3D-printing, starter-motor, sticky-note, vampire, or Airbnb analogies, no repeated agreement between hosts, no praise of the source material, and no instruction to the narrator inside the spoken text.

## Generation brief

Give the narrator or generator **`docs/narration/deep-dive-fork.md`** as the only selected source. Never this document: it quotes the current recording's obsolete claims in the table above and carries instructions and post-production commands that are not narration. Do not select the osdu-spi guide, the decision register, the learnings, or the site; they are the sources the script was checked against, and giving the generator the mechanisms again is what produced the current 69-minute recording with two openings before the subject.

Suggested generation prompt, for NotebookLM or a narrator:

> Read the attached script as written, in order, as a single narrator. The audience is engineers who already know OSDU and are learning how a service fork is engineered. Speak the five part headings as transitions. Do not announce the numbered chapter headings inside them; they mark where the recording will be indexed, and the text under each must stay in order and complete. Do not add an introduction to OSDU, the energy industry, Git, or GitHub Actions. Do not add facts, commands, schedules, counts, or guarantees that are not in the script. Do not add analogies; the script uses one word, machinery, and no others. Do not praise the source material, express surprise, or describe anything as a nightmare, a masterclass, brutal, wild, or cruel. Do not describe any recording, image, or environment as production. Where the script states a condition in the same sentence as a behaviour, keep the condition in the same sentence. Calm, precise, plain. Aim for 25 to 35 minutes.

If the generator produces a two-voice conversation, the second voice may ask the question a part answers, and nothing else; every answer must come from the script.

### Review the recording before it replaces anything

- By the two-minute mark the listener has heard the seam named, that upstream plans to remove the Azure code and has not yet, and that the fork owns provider/partition-azure permanently while taking shared code daily.
- The forks are "designed for eight" with partition the first and only; each fork owns provider code, tests, and configuration.
- The generated branch is spoken as omitting the whole provider tree, Azure included.
- Removing human-required is followed by the monitor's six-hour schedule or a person's dispatch, never a webhook.
- The cascade is spoken as workflow_dispatch, started after the sync PR merges.
- Credentials are spoken by job: App tokens, GITHUB_TOKEN with package-write permission, GitHub OIDC; nothing says GITHUB_TOKEN cannot publish packages.
- pull_request_target is spoken as the lesson, with the publishing job's exclusions as the current rule.
- The gate's onboarding prerequisite is "five repository settings".
- The verdict is spoken as exit zero, at least one non-skipped test, and no failures or errors.
- Restore is spoken with its condition and with the stranded-pin consequence, and the image written back is the captured canonical image; the prove phase is the declared acceptance suites, and the fallback's proof is the unit tests.
- The three adoption facts are kept apart, the acceptance run is illustrative and the descriptor unwritten, after the status has been rechecked against the reference fork.
- The closing says the run reads current facts instead of copied values, and that eligible builds publish a digest which an onboarded fork with a declared suite can then test; no "cannot exist".
- No chapter names a real environment or subscription; only opendes and <name> appear.
- The blindfold story appears once, as a dated learning, and does not frame the episode.

### After recording

1. Encode: `ffmpeg -i <input> -ac 1 -c:a aac -b:a 56k public/audio/<slug>.m4a`.
2. Transcribe: `uvx --from mlx-whisper mlx_whisper public/audio/<slug>.m4a --model mlx-community/whisper-large-v3-turbo --output-format vtt --language en`, keep the VTT in `docs/reference/`, and regenerate `src/content/transcripts/branches.js` from it. The transcript represents the recording; do not edit it to say what the recording should have said.
3. Update the `branches` episode in `src/content/audio.js`: file, duration, `origin`, and the 25 markers with the recorded chapter times and the titles above. The part transitions are not markers. Drop the source-check notes the new recording no longer needs; add one for anything the narrator changed.
4. Re-point the `listen` cues in `src/content/chapters.js` that name the `branches` episode (lessons 03, 04, 05, and 06) at the new marker times. The content test requires each cue to start on a marker of its episode.
5. Retitle the episode on the Audio deep dives page from the script's subject, not from the generator's title; the generated title belongs in `origin`.
