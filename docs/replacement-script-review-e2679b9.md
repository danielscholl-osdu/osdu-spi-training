# Replacement scripts and field-guide closeout

## Recommendation

Keep the shipped guide improvements. Revise the three scripts before recording. Their subjects and overall voice are right, but several statements would reproduce the problem the replacement recordings are meant to solve: a confident explanation that needs a correction beside it.

This review reads the complete scripts at `e2679b9`, checks selected consequential claims against the source revisions below, and spot-checks the published guide interactions. It does not execute the personal-account walkthrough, produce media, or certify every operational claim. The public plan visibly shows revision 15 with its state at `e2679b9`.

| Deliverable              | Assessment                                                                                                                                          |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Start video              | Good subject and length. Revise the opening order, adoption status, generated-branch explanation, and Flux timing before recording.                 |
| Stack deep dive          | Strong operational material. Correct token lifetime, profile cost, and bootstrap location; reduce repetition and put implementation status earlier. |
| Fork deep dive           | Strongest explanation of ownership and integration. Correct the credential model and remove guarantees that the implementation does not establish.  |
| Field-guide presentation | Keep. Group disclosures, shorter captions, and explicit fit/zoom improve retrieval and reading.                                                     |
| Seam posters             | Much better reference artifacts. The dated unfinished-work bands now qualify the image itself. Keep their visual structure.                         |

## What is working

The scripts open on engineering questions and assume the listener already knows OSDU. The provider/core explanation is concrete, the fork ownership story is substantially clearer, and the distinction between compiling a provider and exercising it on Azure earns its place. The conditional restore explanation is particularly useful: an ownership refusal is different from a restore failure, and a lost runner can leave recovery work.

The fork script's central sequence is worth keeping: generated shared code, integration with the fork-owned provider, validation, then the optional deployment test. The difference between the integration PR and the version PR is also useful. These are subjects the audience is here to learn.

The tables comparing old and new narration are valuable editorial records. Keeping transcripts unchanged until the corresponding recording is replaced is correct.

## Corrections before recording

### 1. Separate the two token lifetimes

Stack chapter 5 says `spi token` mints a ten-minute bearer. The identity guide describes a ten-minute Kubernetes ServiceAccount assertion exchanged for an Entra bearer whose default lifetime is approximately an hour. The command's JSON output exposes the actual expiry. Confusing the two teaches the wrong explanation for a suite that loses authorization mid-run.[1]

Suggested narration: **“spi token exchanges a short-lived Kubernetes token for an OSDU bearer. Its JSON output includes the bearer’s expiry.”** An exact lifetime is unnecessary in this overview. If one is retained, identify which token it belongs to and keep the qualification.

### 2. Teach the actual credential split

Fork chapter 16 says the default `GITHUB_TOKEN` is too restricted to publish packages or push commits, then describes App installation tokens as the answer. The inspected image-publishing job explicitly grants `packages: write` and passes `secrets.GITHUB_TOKEN` to the image actions. The release workflow also uses that token for registry retagging. Its default permissions are not a universal capability limit.[2]

Suggested narration: **“The workflows use different credentials for different jobs. GitHub App tokens support repository automation. The image-publishing job uses GITHUB_TOKEN with package-write permission. The deployment job uses GitHub OIDC to obtain Azure access.”** Explain each boundary once; avoid saying every credential-bearing job repeats an identical condition when the deploy job is controlled by the gate's output.

Stack chapter 20 also calls all five onboarding values repository variables. The implementation stores `AZURE_CLIENT_ID` as a repository secret and the other four as variables. Say **“five repository settings”** on the audio surface; keep their exact storage locations in the written reference.[3]

### 3. Put current adoption status where the test workflow is introduced

The video describes every service getting a public fork and a candidate routinely being tested in the running stack. The deep dives eventually explain that partition is the reference fork, that it has not adopted the newer acceptance lane, and that the site's acceptance run is illustrative. In the stack recording that clarification arrives around minute 23; it is absent from the video.

Distinguish three facts: the template implements the lane, a particular fork must adopt and configure it, and a particular run must actually execute it. The inspected reference partition checkout has no `.spi/service.yaml`; the template gate can report a successful skip when prerequisites are absent.[2][4]

A compact video sentence is enough: **“The template includes a workflow for testing a candidate in a running stack; the partition fork has not adopted it yet, so the lessons illustrate that part of the process.”** Date this status in the production source and check it immediately before recording. If adoption has happened by then, replace the sentence with the demonstrated result.

In the fork closing, replace **“Every eligible commit gets a digest and a turn in the stack”** with **“Eligible builds publish a digest. An onboarded fork with a declared suite can then test that candidate in the stack.”** Build eligibility and deployment eligibility are different gates.

### 4. Preserve the overlap between the CLI and Flux

The video says the stack is assembled by Flux “after the CLI returns.” The stack script itself correctly explains that reconciliation starts before the final CLI stages finish. The latter account matches the deployment lifecycle guide.[5]

Use **“spi up creates the Azure resources and starts Flux, which continues assembling workloads after the command returns.”** Carry this correction into the video's comparison table and storyboard, so the picture does not reintroduce a sequential handoff.

Likewise, stack chapter 5 should describe readiness observations as **separate signals**, rather than saying none implies the next. The CLI already verifies the Git artifact before returning. The useful distinction is what each observation establishes, not universal independence.

### 5. Keep the profile claim about resource scope

Stack chapter 2 goes beyond “all profiles provision the same Azure estate” to **“Profiles do not save money”** and an invariant resource count. The profile decision explicitly discusses removing Redis PVCs and Azure disks when workloads are removed. Equal infrastructure templates do not establish equal workload or storage cost.[6]

Use **“Profiles change the Kubernetes workloads. They do not remove the baseline AKS cluster or Azure data services.”** This makes the intended point without making an unsupported billing claim. Describe `bare` as omitting application and middleware workloads; it still has platform and GitOps machinery.

### 6. Correct bootstrap placement

Stack chapter 16 groups namespaces, Secrets, ServiceAccounts, ConfigMaps, and bindings under “Those live in osdu-flux.” The lifecycle guide places bootstrap inputs across `osdu-flux`, `platform`, and `osdu`; test-caller ServiceAccounts are in `spi-test`.[1][5]

Use **“The CLI creates bootstrap inputs in the namespaces that consume them; osdu-flux holds the stack’s GitOps inputs.”** The episode is teaching where to look during diagnosis, so this distinction matters.

### 7. Remove guarantees from the closing summaries

The fork closing says a stale value “cannot exist.” Discovery reduces copied configuration, but the workflow reads facts into a per-run file; it does not make the environment immutable. The lane also lacks a second verification before each suite and does not yet enforce declared dependencies before borrowing.[2][4]

Use **“The run reads current environment facts instead of maintaining copied values in each fork.”**

The stack closing promises many forks can test “without the forks breaking each other or the environment.” That is a design goal, not an established isolation guarantee. Its earlier paragraph admits that one candidate can fail another service's suite. Concurrency groups are repository-scoped, and the lifecycle guide explicitly says they cannot serialize jobs across repositories.[7]

Use **“The image lock gives a run a controlled way to deploy and restore its candidate. The environment is still shared, so a candidate can affect other services.”** This is more credible and consistent with the unfinished-work bands on the new posters.

### Smaller wording corrections in the same pass

- The video's generated branch should explicitly omit **Azure source too**, not merely “the other providers.” The filter's expected-absent list includes the entire `provider` tree; Azure code joins it on the integration branch.[8]
- Use **“captured canonical image”** consistently instead of the video's “previous image.” Restoration is not necessarily undoing whichever candidate happened to be visible immediately before this run.[4]
- Change “The provider only exists to talk to Azure services” to **“The provider implements the cloud-specific behavior behind the shared interface.”** The partition implementation also uses Redis inside AKS.
- When stating the test verdict as a rule, include **no failures or errors**, as the implementation guide does. Keep the actual run status distinct from a successful container exit.[4]

## Spoken clarity and remaining AI tells

The conspicuous metaphors have largely gone. The remaining pattern is rhetorical certainty: an obvious approach is proposed, rejected, and replaced with a design described as inevitable. Repeating that structure makes the engineering history sound more uniform than it is.

| Current wording                                                          | Cleaner treatment                                                                       |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| “Here is the boundary that costs people an afternoon.”                   | “A successful spi up does not establish API readiness.”                                 |
| “State the scope exactly, because the current recording overstates it.”  | Delete the editorial instruction; start with the actual Workload Identity scope.        |
| “That is the question this recording answers.”                           | The opening question already does that work.                                            |
| “That scope is a decision, not an omission.”                             | Give the concrete reason for the development/test scope.                                |
| “The labels … are not decoration.”                                       | “Tracking-issue labels record the cascade state.”                                       |
| “The decision register is the textbook … the learnings are the journal.” | “The decision records explain the choices; the learnings record incidents and changes.” |
| “No developer checks it out.”                                            | “Developers do not make changes on fork_upstream.” Inspection is allowed.               |

Keep memorable technical rules where they help, including the current guide titles. This does not require flattening every sentence or banning all metaphors. Remove author-facing instructions from spoken copy, and prefer an operational consequence to praise of the design.

The video still begins with upstream removal and ends with following a partition lookup. Those are useful supporting examples, but the user-facing promise is learning the stack and engineering system. A stronger opening is:

> Azure SPI connects three things: the stack that runs OSDU, the Azure provider inside each service, and the workflows that keep that provider current. This site explains how those parts fit together, from creating an environment to building and testing a service change.

Introduce upstream removal when explaining fork ownership. Close with the learner's ability to locate a change, understand how it reaches an image, and know what a running-stack test proves. Use the lookup as an example within that story.

## Length, chapter structure, and production sources

I independently counted narration words, excluding headings and editorial material:

| Script      | Words | At 150 words/minute | At 130 words/minute |
| ----------- | ----: | ------------------: | ------------------: |
| Start video |   303 |         2.0 minutes |         2.3 minutes |
| Stack       | 4,219 |        28.1 minutes |        32.5 minutes |
| Fork        | 4,171 |        27.8 minutes |        32.1 minutes |

These are planning estimates. Spoken commands, chapter titles, pauses, and diagrams will change the result. Do not force both deep dives to finish at 28 minutes.

The marker lists are useful editing aids, but 21 and 25 separately announced chapters can make a single-narrator recording feel like documentation read aloud. Retain fine-grained seek markers while using fewer major spoken transitions. The fork sequence can group into ownership, generated upstream input, integration and validation, deployment testing, and customer forks.

Reduce duplication before increasing speaking speed. Stack chapters 17–20 already spend several minutes on the image lock, fork adoption, pin ownership, and trust; the fork episode returns to most of that. Let the stack episode establish the environment's side of the contract, and let the fork episode explain the job in detail. Repetition should give a new perspective each time.

Create a **narration-only production source** after approval. The current Markdown files also contain obsolete claims quoted in comparison tables, instructions, and post-production commands. Sending the entire document to a generator as the “only source” still exposes those old claims. Keep the review tables as editorial records, supply approved narration separately, and judge the resulting recording by what it actually says. Target timestamps become real markers only after that review.

There is also an uncovered Start entry point: **Listen still plays the old two-minute brief**. Its approved replacement already exists in `docs/azure-spi-brief-script.md`. The new video and two deep dives do not replace that file or episode. Include the brief in the recording plan, with a short consistency check against the same adoption and canonical-image wording, so the prominent Listen option does not retain the old SPI expansion.[9]

## Published guides and posters

The public plan shows revision 15 and the new shipped state. On the published guide page, Maps of the course starts open and the four lesson groups start closed. Opening The seam reveals its two posters without traversing the stack collection. Lean captions and folded reference details reduce competing links while retaining evidence.

Both seam posters were inspected in their desktop lightboxes. The distinction between current behavior and unfinished work is now inside the image. The Borrow poster's pass/fail/skip/restore panel is useful, and the Backing Environment's three version axes distinguish changes that were previously easy to conflate. These are operational reference sheets with a clear purpose.

At 390 × 844, the Borrow poster initially fits the dialog. Zoom in enlarges it, horizontal panning works, and the control changes to Fit to screen. The text remains dense and requires panning, but the user now has a deliberate way to inspect it. This is a material improvement over forcing a wide image immediately. These were spot checks, not an exhaustive accessibility audit or a new proof of every poster claim.

## What the fork walkthrough must demonstrate

The walkthrough is still evidence to collect, not a completed document waiting to be read. Keep the two demonstrations distinct:

1. **Personal GitHub fork, lessons 04–05:** template/App setup; the actual ownership and branch layout; an unchanged sync and a changed sync when available; App-authored versus learner-authored PR approval; candidate image naming and package visibility; cleanup; actual waiting times and exact revisions.
2. **Azure-connected test, lesson 06:** the tested descriptor and workflow revision; onboarding to the chosen core-profile environment; a gate that enters the deployment job; the candidate digest on the expected rollout; at least one non-skipped test with no failures or errors; the restore result; removal of trust/settings and environment cleanup as applicable.

An Azure subscription and GitHub account are the starting assumptions, not proof that permissions, package visibility, repository review rules, or the descriptor already satisfy the workflow. A clean no-change sync is a valid observation. An author-created PR awaiting a second reviewer is also a valid stopping point for the GitHub activity. Neither proves the complete Azure-connected path.

## Sources and review record

Script inputs: [Start video](https://github.com/danielscholl-osdu/osdu-spi-training/blob/e2679b9/docs/start-video-script.md), [stack deep dive](https://github.com/danielscholl-osdu/osdu-spi-training/blob/e2679b9/docs/deep-dive-stack-script.md), [fork deep dive](https://github.com/danielscholl-osdu/osdu-spi-training/blob/e2679b9/docs/deep-dive-fork-script.md). Public checks: [Visual field guides](https://danielscholl-osdu.github.io/osdu-spi-training/#field-guides) and [plan](https://claude.ai/code/artifact/3a637ecc-f00a-450f-826f-f5b7e4401945).

Source checkout revisions: `osdu-spi-stack` at `dc2c95638ded6459538085cfdb2ada46b692c27b`; `osdu-spi` at `080f0b8289d6fc5519aa858531547e23287a280d`; reference `osdu-spi-partition` at `3a5690da3147d022ca9a2402858cd7b96e4688cf`. Statements about unadopted or unfinished behavior are bounded to these revisions and require rechecking before media production.

1. [Workload identity: minting through the cluster issuer](https://github.com/Azure/osdu-spi-stack/blob/dc2c95638ded6459538085cfdb2ada46b692c27b/docs/design/workload-identity.md#minting-through-the-cluster-issuer).
2. [Template validation workflow](https://github.com/Azure/osdu-spi/blob/080f0b8289d6fc5519aa858531547e23287a280d/.github/template-workflows/validate.yml), especially docker-push, deploy-gate, deploy-test, and Restore; [release registry authentication](https://github.com/Azure/osdu-spi/blob/080f0b8289d6fc5519aa858531547e23287a280d/.github/template-workflows/release.yml).
3. [Onboarding settings and secret names](https://github.com/Azure/osdu-spi-stack/blob/dc2c95638ded6459538085cfdb2ada46b692c27b/src/spi/onboard.py).
4. [Implemented deployment sequence and limitations](https://github.com/Azure/osdu-spi-stack/blob/dc2c95638ded6459538085cfdb2ada46b692c27b/docs/design/fork-deployment.md#the-sequence); [template design's implemented-lane status](https://github.com/Azure/osdu-spi/blob/080f0b8289d6fc5519aa858531547e23287a280d/doc/src/architecture/deploy_test.md#implemented-lane-and-remaining-work).
5. [Deployment lifecycle](https://github.com/Azure/osdu-spi-stack/blob/dc2c95638ded6459538085cfdb2ada46b692c27b/docs/design/deployment-lifecycle.md).
6. [Profile scope and removal of billable disks](https://github.com/Azure/osdu-spi-stack/blob/dc2c95638ded6459538085cfdb2ada46b692c27b/docs/decisions/021-middleware-only-minimal-profile.md).
7. [Environment lifecycle: repository-scoped concurrency and future drain](https://github.com/Azure/osdu-spi-stack/blob/dc2c95638ded6459538085cfdb2ada46b692c27b/docs/design/environment-lifecycle.md).
8. [Filter configuration and expected-absent paths](https://github.com/Azure/osdu-spi/blob/080f0b8289d6fc5519aa858531547e23287a280d/.github/fork-resources/upstream-filter.yml).
9. [Already approved brief](https://github.com/danielscholl-osdu/osdu-spi-training/blob/e2679b9/docs/azure-spi-brief-script.md); [Start cue](https://github.com/danielscholl-osdu/osdu-spi-training/blob/e2679b9/src/content/chapters.js) and [current brief recording](https://github.com/danielscholl-osdu/osdu-spi-training/blob/e2679b9/src/content/audio.js).

Review tracking: `fn-mqw`. Draft-script corrections are `fn-fwb`, a prerequisite for recording production in `fn-y2o`; that production task also records the approved brief and narration-only source recommendation. Walkthrough evidence remains in `fn-dt3`. The site and draft scripts were not modified by this review.
