# Azure SPI training experience review

The site has a strong instructional idea and a credible technical foundation. The most valuable feature is the round trip: a familiar partition request reaches Azure code, a fix to that code travels through the fork, and a candidate image returns to a running stack. Preserve that story, the visual direction, and the separation between learning and reference documentation.

The experience is not yet consistently delivering the progressive understanding it promises. It often provides a short explanation, another framing paragraph, a running-example strip, a large map, an inspector, audio cues, misconceptions, and several field guides before letting the learner move on. The information is relevant, but the learner must decide what matters and integrate it across several places. That is part of the work the training experience should do for them.

My recommendation is a focused completion pass, followed by a small facilitated pilot before broad self-directed release. The remaining work is principally instructional sequencing, visible cause and effect, and consistency between the media. More chapters, posters, or long recordings would add less value than improving these.

## What is working particularly well

**The course has a real connecting example.** opendes, dev1, the partition provider, and the cache fallback make the subject concrete. The fallback is verified source history, not a generic invented bug. There is a meaningful consequence to understand: a cache exception can become a logged miss while Table Storage still supplies the answer. [1]

**Boundaries provide a useful organizing principle.** The site distinguishes the workstation, Azure, the complete stack, AKS, namespaces, and service source. Showing Azure data resources beside the cluster avoids the common error of treating Kubernetes as the entire platform. Reusing the architecture map through creation is a particularly good choice.

**The fork ownership table teaches a relationship that prose struggles to convey.** Paths as rows and branches as columns make it possible to see what exists where. The optional upstream-deletion experiment now includes a local before/after comparison. I verified that its visible cells and accessible names change together. This is one of the strongest interactions on the site.

**The handshake has useful, observable state.** Candidate and canonical digests, pin ownership, the running pod, test reports, and conditional restore give an engineer something firmer than a generic pipeline diagram. On the phone layout, the updated inspector repeats lock and pod state where the explanation opens. The alternative-owner state also works.

**The material is unusually candid about what a success signal proves.** Readiness versus CLI exit, skipped acceptance lanes, conditional restoration, and implementation gaps are valuable engineering lessons. The explicit distinction between the real cache fix and the illustrative acceptance run is present near the transition in views 05 and 06. Preserve it.

**Audio is integrated thoughtfully at the interaction level.** A map cue plays without navigating, the player persists while navigating, and corrections now appear beside a playing cue. I verified the orientation's restore correction directly from view 06. These are substantial improvements over an isolated podcast link.

## Does Start here establish the right principles?

**It establishes the purpose more clearly than the principles.** The promise is good: follow one request down and a fix back. However, the principles that make the later detail intelligible are distributed across the opening audio, lower reference sections, and later lessons. The opening still asks the engineer to learn several names while simultaneously discovering why they relate.

The desired foundation is small:

| Principle                                             | What the learner should understand first                                                                     | Later detail it makes easier                                  |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| The familiar OSDU contract remains the starting point | An HTTP API and an internal provider interface are different contracts.                                      | Java interfaces, Azure implementations, integration failures. |
| The environment and its source are different things   | A repository produces an image; a stack runs workloads built from images.                                    | Fork workflow, image lock, deployment verification.           |
| Ownership determines where a change belongs           | Shared code, Azure provider code, engineering workflows, and environment configuration have different homes. | Generated branches, template updates, contribution tiers.     |
| Declared state and observed state differ              | A command or configuration write starts work; observation establishes what happened.                         | Flux, readiness, image verification, test evidence.           |
| Recovery follows an explicit contract                 | A known fallback can preserve behavior; cleanup must respect current ownership.                              | Cache fallback, conditional restore, failed or stranded runs. |
| Evidence supports a particular conclusion             | A build, unit test, deployed digest, and API suite answer different questions.                               | Reading validation results and diagnosing failures.           |

The course already contains these ideas. The completion task is to introduce them deliberately, then deepen them in recognizable steps. The engineering system's purpose should be audible and visible before its schedules, Git internals, or permission details.

### The opening currently repeats the promise

At 390 × 844, the primary Start button begins at document y=826 and ends below the initial viewport. The header introduction and the Where to begin panel both explain essentially the same request/fix journey before the action. The opening is therefore longer without establishing much additional structure.

The start page's rendered main content contains approximately 1,372 whitespace-delimited words, excluding the navigation. The learning path begins around y=1,276; the three meanings of SPI appear around y=4,947. These are observations in the review browser, not universal device measurements.

The full three-meanings reference and six-place map should remain after the learning path, as the site's design intends. They should not become more competing prerequisites. Instead, let the opening promise and its short audio supply just enough vocabulary to begin, and use the path to reveal the rest.

### A more effective opening, using the existing direction

The first visible block could say:

> You know the OSDU APIs. This guide shows how they run on Azure, where their Azure implementation is maintained, and how a change to it is proved.
>
> Follow a partition lookup for opendes in dev1. Then follow a cache fallback fix from its service repository back into a running environment.

Place the primary action immediately there. An adjacent optional opening cue should establish the interface, stack, and engineering system with the same example. It should explain their relationship, not spend most of its time reintroducing the energy data problem.

Keep the path next. Its cards should state the next question and a simple benefit. Today, the card for 05 introduces generated trees, tracking issues, cascade order, and two branch names before the engineer has reached the fork. Those are appropriate takeaways after the lesson. On the start page, “How shared code and your Azure fix become one candidate image” would better prepare the learner.

The start page also contains multiple alternate routes: start at 01, trace a request first, listen first, and later choose between operating a stack and maintaining a fork. Those are useful return-visit choices, but the first-time recommendation should remain unmistakable. “Views 01 and 02 explain the stack; continue through 06 to understand provider engineering” is clearer than a second invitation to skip directly to 03.

## The main path and optional depth need a clearer separation

“Optional” currently describes intent more than layout. In the default view 01 on a 390px screen, the diagram starts around y=1,140, the takeaways around y=7,056, and Next around y=7,791. The familiar-things guide, namespace poster, and profile guide sit between the map and that exit.

This is not an argument that a long page is inherently bad. It is evidence that a learner following the apparent reading order encounters a substantial reference collection before reaching the next part of the story. A person who already struggles to commit time can reasonably conclude that every page requires this amount of reading.

Give each main lesson a visible boundary:

1. One question and a short bridge from what came before.
2. The running example and one map showing the relationship.
3. The selected component's useful explanation and one relevant easy mistake.
4. Two or three takeaways and a clear next action.
5. An explicitly optional area for field guides and further listening.

The field guides can remain in the page, with disclosure or compact previews where appropriate. The main-path exit should be available before them. This preserves depth while making it possible to choose depth deliberately.

There is research support for presenting component names before complex causal explanations, for learner-controlled segmentation, and for putting corresponding words and pictures together. It does not establish a magic page length or prove these recommendations will work for this specific audience; a learner pilot is still needed. [2]

## Where understanding becomes disconnected

| View                         | What it teaches well                                                       | Where it breaks down                                                                                                                                                                                                                                            | Highest-value adjustment                                                                                                                               |
| ---------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 01: What is a stack?         | Cluster versus environment; shared versus partition resources.             | The running example is a request, but the default path is Developer. Selecting its final configuration hop opens an explanation headed by Gremlin and entitlements.                                                                                             | Start the guided request consistently; give common Storage its own request-specific explanation.                                                       |
| 02: How it comes to life     | Reusing the same architecture through time; separate owners and readiness. | Five example hops, six lifecycle controls, moment prose, and the map provide overlapping ways to follow the same progression. Some default explanations describe future behavior rather than the current preparation step.                                      | Make one control sequence the primary progression; keep the other as an unobtrusive shortcut. Show the current change and readiness evidence together. |
| 03: The SPI boundary         | Shared code and Azure implementation in one image; real cache fallback.    | It says to watch the provider when the cache is down, but the failure is mostly told in prose. The Azure implementation's default explanation immediately switches to source seeding.                                                                           | Add a compact cache-available/cache-unavailable comparison and make the first implementation explanation about the runtime operation.                  |
| 04: The shape of the fork    | Ownership table and deletion experiment.                                   | The full table introduces several engineering lanes before the learner sees the minimal core/provider contrast. A stale descriptor misconception contradicts the updated adoption note.                                                                         | Emphasize the shared-core and Azure-provider rows first, then let the other rows explain additional ownership. Fix the descriptor copy.                |
| 05: A day in the fork        | Separating generated input, integration, review, candidate, and release.   | The five-moment order can suggest approval happens before validation, although the copy says validation also runs on the PR. The real fix begins already on main, so the learner sees more of upstream maintenance than the act of contributing a provider fix. | Show validation as evidence required around the PR and again after merge; provide a short bridge explaining how the provider fix reached main.         |
| 06: The handshake            | Observable digest state and conditional restore.                           | The headline says the lock write is the whole deploy. The diagram uses A/B/C for areas while A/B also identify images.                                                                                                                                          | Say the write starts the rollout; keep observation distinct. Use descriptive area labels instead of another set of A/B meanings.                       |
| 07: Things that are not true | Useful operational reference with sources.                                 | Twenty-one contradictions become the final experience, followed by Next: Listen. There is no equally clear sense that the central story is now complete.                                                                                                        | Close the request/fix loop first, then offer the misconception collection and audio as optional reference.                                             |

### The running example needs protection from adjacent examples

In view 01, selecting “Stored configuration” correctly selects common Storage's combined node. The inspector headline is “Entitlements uses the shared Gremlin backend.” The body eventually explains common Storage, but the first and most prominent answer concerns another service and another data model. On mobile, the inspector occupies most of the viewport, so that competing explanation dominates.

In view 03, “One request, end to end” is a poster about reaching a Cosmos DB row. It is not the partition configuration lookup that the lesson has just established. The poster can be useful, but the adjacent caption needs to say “A different example: a record request” or the guide should be offered after the main story. Otherwise the visual artifact can undo the carefully qualified prose above it.

The most useful small illustration would show the partition response as configuration: “opendes -> stored resource configuration,” with a restrained sample of what that means. It should not look like a retrieved well record. Then show other OSDU services using that configuration to reach their own resources. This makes the distinction visible rather than depending on another warning sentence.

### The cache example deserves an actual before/after

Preserve the real fix and add one optional control: “Show the cache unavailable.”

The changed visual should show a failed cache read, a warning, continued Table Storage access, and the returned configuration. With the old behavior selected, the failure ends the request. With the fixed behavior selected, the fallback preserves the answer when the table read succeeds.

No score, answer submission, or required exercise is needed. This is a demonstration whose cause and effect can be inspected. Clicking an object to reveal a paragraph offers useful reference access; changing a condition and seeing its consequence does more to explain the mechanism. The distinction between manipulating material and generating an explanation is consistent with the ICAP research framework, although a website click is not automatically the framework's strongest form of interactive learning. [3]

This also creates an excellent conceptual conversation: why is cache fallback good when the engineering system criticizes hidden fallbacks? The answer is the contract and the evidence. This provider has a valid durable alternative and logs the failure. A missing required check cannot be turned into evidence by concealing its failure.

## Audio: strong supporting material, uneven orientation

The three recordings total 2 hours, 24 minutes, and 32 seconds according to their declared durations. They should be presented as optional depth, not an implicit listening curriculum that follows completion of seven views.

| Recording          | Best use                                                             | Assessment                                                                                                                                                     |
| ------------------ | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Orientation, 16:56 | Establish the common model before detail.                            | The intended role is right. Its present ordering and several claims make it the most important recording to replace.                                           |
| Stack, 58:36       | Deeper explanations of environment design and operational tradeoffs. | Strong raw material for selected, contextual segments. It travels beyond views 01-03 into the seam, so its label should continue to make that clear.           |
| Fork, 69:00        | Rationale for source ownership and workflow design.                  | Appropriate as optional depth after the basic fork model. Git plumbing, Maven behavior, labels, and historical incidents are too much for a first orientation. |

The audio has a useful advantage over another summary: speakers can articulate the doubt that makes a design decision necessary. The best moments ask why a plausible simpler approach fails, then connect the answer to a concrete mechanism. Preserve that conversational structure.

The weaker moments use generic admiration, escalating metaphors, and absolute assurances. Phrases that present the design as brilliant or perfectly safe do not improve comprehension. They can make a qualified engineering tradeoff sound like a guarantee.

### The current orientation reverses the site's progression

Its first roughly two minutes explain the general energy-data problem. The three meanings of SPI begin at 2:03. The next section introduces providers, then upstream deletion, modify/delete conflicts, Git trees, branch generation, branch roles, and filter failure behavior. The stack does not receive its own section until 9:18.

That is a plausible explanation for someone already interested in the fork problem. It is a weak match for a start page that sends the engineer into the stack first. The listener may know Git's tree mechanics before they have a stable picture of where the service runs, what the stack includes, or how a built image reaches it.

The start page's three-minute cue has a narrower issue. Most of it establishes why OSDU exists, which the stated audience already knows, and the distinction between the three meanings arrives late. A revised opening should use those three minutes to establish the entire high-level relationship and the concrete request.

### Content corrections that matter before broad use

These findings come from the current machine transcript, marker copy, and repository source. They identify editorial review points, not a phonetic audit of every spoken word.

| Location in orientation | Problem                                                                                                                                                                                                         | Source-grounded treatment                                                                                                                                                            |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Around 5:35             | The narrated modify/delete example describes deletions in a way that does not establish the conflict it claims: it introduces a core modification and deletion of an AWS directory already deleted in the fork. | Remove Git conflict mechanics from orientation. A deeper explanation should demonstrate a file modified on one side and deleted on the other, using a concrete tree comparison.      |
| Around 8:01             | main is described as production.                                                                                                                                                                                | Call it the protected source branch. Distinguish source review, release, deployment, and a production environment.                                                                   |
| Around 9:40             | One command is described as producing immediately usable APIs after a rounded duration.                                                                                                                         | Keep orchestration, convergence, and authenticated API readiness distinct. Existing source notes qualify timing but the primary narration should carry the distinction.              |
| Around 11:44            | The live path is framed around every PR.                                                                                                                                                                        | Say eligible, onboarded runs with the required inputs; a skipped live lane is possible.                                                                                              |
| Around 12:17-13:22      | Image pinning is used to resolve a question about services ruining each other's tests.                                                                                                                          | Per-service image changes do not isolate service behavior. A broken partition candidate can affect a sibling suite.                                                                  |
| Around 14:47-15:17      | Reviewer approval is treated as inherent to federation, and narrow lock access becomes reassurance that a compromised fork cannot do more than change an image.                                                 | Required reviewers are an additional policy. Trusted writers can patch the whole lock, and selected code runs with workload access. OIDC does not make a compromised image harmless. |

The last finding is especially important. The current marker corrects the reviewer assumption but still says “no secret to steal.” The source documents explicitly retain middleware credentials, give the deploy identity Key Vault access, and describe the shared lock as a trust boundary around the object rather than its individual service entries. The source also warns that OSDU workload identities are shared. These statements cannot support a general assurance of harmless compromise. [4, 5]

Existing source notes are valuable, and their display has improved. They should remain an editorial backstop. An engineer listening while away from the screen should be able to learn an accurate model from the narration itself.

The longer recordings also need targeted checks. In the stack recording around 14:21-15:24, the speakers turn “a successful CLI exit does not establish readiness” into a claim that the API will definitely fail immediately afterward, and describe the CLI as doing only infrastructure. The source describes bootstrap work as well, and permits readiness to follow the exit without asserting that every immediate call must fail. This material falls within an early map cue that currently has no source-check note. In the fork recording around 55:26, an illustrative five-second Flux reversion is presented as a definite clock. Replace such absolutes with the supported distinction: reconciliation continues, and manually changing a managed workload does not change its declared input.

### The fourth PDF is the right intervention

The three existing inputs are 47, 56, and 103 pages, with approximately 15,854, 16,401, and 30,510 extracted words respectively. They contain extensive, overlapping reference material. Asking a generator to make an orientation from all of them leaves it to decide which details constitute the foundation. The present result favors compelling mechanisms and incidents.

The new **Azure SPI: The First Mental Model** is an 11-page source document with roughly 4,200 words of teaching material plus references. It is a deliberately bounded explanation, not a compressed replacement for the books.

It establishes the system first, follows the same request and fix, introduces only the details needed to understand the relationships, and explains evidence and recovery without security or readiness guarantees. It contains enough rationale and causal tension for a conversation. The separate generation brief supplies the audience, order, and editorial criteria.

Select only the fourth PDF when producing the new orientation. The original books remain deeper reference inputs for other recordings. The resulting audio still needs a source check before replacing the current episode; constrained input reduces drift but does not prove the generated claims.

## Specific content and source-link repairs

These are smaller than the instructional changes, but should accompany them.

**Correct the partition authorization explanation.** The current Common code inspector says partition-core checks the caller through the shared entitlements client. In the reference source, PartitionApi uses AuthorizationFilter, which delegates to IAuthorizationService; the Azure implementation checks the app-only principal. That is not an entitlements call on this path. Use service-specific wording and preserve the more general authentication/authorization distinction elsewhere. [6]

**Fix the remaining descriptor contradiction.** The updated chapters correctly say the reference partition fork has not adopted the acceptance lane. The descriptor misconception in views 04 and 07 still says its Deploy Gate skips because the descriptor is missing. It has no such gate in the reviewed workflow. The missing-descriptor skip describes behavior after adopting the newer workflow. This is a remaining copy occurrence, not an unresolved site-wide correction. [7]

**Make the source link answer the clicked question.** The cache fallback inspector links to ADR-038 about ownership rather than the implementation and regression-test commit. The start-page card labeled osdu-spi-partition also links to that ADR, not the service repository. A link can resolve successfully while failing the learner's drill-in need. Add direct links to the provider implementation, its interface, and the real fix, with the ownership ADR as an additional rationale link.

**Tighten memorable claims.** “A lock write is the whole deploy” is catchy but collapses input and completion. “Write the lock; Flux rolls out the image” better preserves the model. “The stack keeps no critical state in the cluster” appears in the permanent-fork poster takeaways even though stateful middleware runs there. Replace the blanket claim with the specific data-placement decisions. Preserve supplied artwork; correct its presentation in captions or use an approved native guide. [5, 8]

**Remove accidental ambiguity from compact labels.** Use Fork inputs / Workflow run / Stack objects instead of A/B/C in the handshake, reserving A and B for digests. In summaries, distinguish an integration PR from a version PR. The start's “three repositories matching three meanings” is also too neat: the interface is a code boundary, not the partition repository itself.

## Visual enhancements with the best return

**Prioritize changed state over more decoration.** Keep the present typography, restrained colors, and orange for fork-owned source. The need is not an aesthetic replacement.

**Use stable objects across chapter transitions.** The same partition service should look recognizable in the stack, the service view, and the image handoff. A small persistent context line can say “dev1: environment / opendes: partition / partition: service.” It should be prose or labels, not another navigation strip.

**Make the active path visually specific.** When following the partition request, emphasize the gateway, service, cache, and common Storage. Other resources can remain available for exploration but should recede. Grouped resource cards are useful in an overview; the selected request needs a precise destination.

**Show one condition changing in view 03.** The cache comparison should keep the control, path, result, and warning together. The deletion experiment in 04 is a good existing model for this interaction.

**Separate desired image from observed image.** Keep the state panel in 06, with lock B and pod A while rollout is pending, then pod B when verified. End with A restored or a newer owner's pin retained. Show how the state becomes evidence rather than making every selection look instantly successful.

**Reduce mobile inspector burden.** The revised restore inspector now shows the important state, which is a real improvement. Its long body can still cover the selected control. Prefer a short result and compact state at the top, with operational detail disclosed below. Check the visible relationship at 390px, not only overflow or selected attributes.

**Give reference material an index by question.** Field guides currently begin with nine full poster entries before the native guides. A compact list such as “Where does this run?”, “Who owns it?”, “Why isn't it ready?”, and “What did the test prove?” would make return visits faster. Preserve supplied originals and their notes. Do not put generated misspellings in the primary instructional path merely because they are documented in a caption.

## A slightly different approach worth trying

Keep the existing six core views, but make their default presentation a **guided case walkthrough**. Every view advances one observable change in the request/fix story. The map remains inspectable, and deeper details remain optional.

This would feel less like seven illustrated articles and more like watching a system reveal its structure:

| Story beat                               | What changes on screen                                                       | The principle it establishes               |
| ---------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------ |
| A partition lookup arrives               | The request crosses the gateway into the service.                            | Runtime location and boundaries.           |
| Look at the environment that supports it | Resources and workload layers appear through the lifecycle.                  | Owners and readiness.                      |
| The cache becomes unavailable            | A failed cache read falls back to stored configuration.                      | Provider behavior and observable recovery. |
| Upstream removes its Azure directory     | The upstream cell disappears; the fork's provider remains.                   | Source ownership.                          |
| New shared code meets the provider fix   | Integration and its build evidence appear.                                   | Compatibility still requires engineering.  |
| A candidate borrows the stack            | Lock and pod diverge, converge, produce reports, then restore conditionally. | Artifact identity and scoped proof.        |

These are optional demonstrations, not learner tests. The important change is that the main story earns each new complication by first showing the simpler state it changes.

## Recommended completion sequence

| Priority             | Action                                                                                                           | Evidence that it is complete                                                                                                          |
| -------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Before broad release | Generate and review the new orientation from the fourth PDF.                                                     | Its opening establishes the system; the request path, eligibility, readiness, identity, and restore claims agree with the source.     |
| Before broad release | Repair partition authorization, the stale descriptor myth, source destinations, and blanket headlines/takeaways. | Every sampled explanation answers its selected object and its linked source directly supports the claim.                              |
| Next design pass     | Shorten the opening and move the main-path exit ahead of optional guides.                                        | Start action is fully visible on the tested phone layout; a learner can follow the story without traversing every reference artifact. |
| Next design pass     | Make the cache failure visible and stabilize object names across chapters.                                       | A learner can describe what changed after toggling the condition, using what remains on screen.                                       |
| Next design pass     | Clarify PR validation order and the final story closure.                                                         | The path distinguishes pre-merge evidence, post-merge builds, optional releases, and the end of orientation.                          |
| After those changes  | Run a facilitated pilot with a small group of senior OSDU engineers new to SPI.                                  | Their explanations reveal whether the intended model transfers beyond the example.                                                    |

A useful pilot would involve four to six engineers, with variation in Azure and Kubernetes familiarity. Ask them to explore normally and explain what they think is happening at a few natural stops. This is a product review, not a quiz built into the course.

Observe whether they can distinguish dev1 from opendes, place common Storage outside AKS, identify where a provider fix belongs, explain why upstream deletion does not remove it, and tell what a green check does or does not establish. Ask what they would inspect if another service's test failed while a partition candidate was running.

Also watch navigation behavior. Do they know when a lesson is finished? Do they understand why a field guide is optional? When they open a source link, does it answer their question? A diagram being attractive, a recording being engaging, or someone spending a long time on the page does not establish that they formed the intended model.

## Evidence and review limits

The review covered the published site at its supplied URL, all seven learning views, the start page, Listen, and Field guides. I drove request selection, lifecycle selection, the deletion experiment, mobile chapter navigation, restore and ownership-loss states, contextual playback, and persistent audio navigation. Desktop screenshots used the browser's 1280 × 720 viewport; responsive checks used 390 × 844. The temporary viewport override was reset.

The orientation transcript was read in full. The longer recordings were reviewed through their complete marker structures and selected transcript material; playback mechanics were sampled. This was not an uninterrupted listening review of all 2 hours 24 minutes, an acoustic production review, or an exhaustive screen-reader audit.

The three original PDFs were inspected for structure, relevant conceptual passages, and representative diagrams. They remain unchanged. Technical checks used osdu-spi-stack at dc2c956, osdu-spi at 080f0b8, and osdu-spi-partition at 3a5690d, with cache-fix history fc2dfbf. The training checkout was on main at 7cf2714. Findings are about these source snapshots and the observed published experience, not live Azure status.

The existing project check passed: formatting, all 12 content-integrity tests, and a production build. No browser console errors were reported in the sampled session. These checks establish buildability and content connections, not instructional effectiveness or the truth of every sentence.

Earlier reviews were consulted and their findings were not assumed to remain open. The visible deletion comparison, accessible deletion state, in-place audio correction, early real/illustrative distinction, and compact mobile restore state are improvements verified in this pass. The current report is separate from those preserved reviews.

No site source, reference PDF, existing recording, or sibling repository was changed. This work adds the review, the orientation source and generation brief, and the generated fourth PDF. Nothing was committed or published.

## Sources

1. Azure, reference partition cache fix fc2dfbf, 30 July 2026. [Commit and regression tests](https://github.com/Azure/osdu-spi-partition/commit/fc2dfbf). The provider implementation is also present in the local reference checkout.
2. Richard E. Mayer and Roxana Moreno, “Nine Ways to Reduce Cognitive Load in Multimedia Learning,” Educational Psychologist 38(1), 2003, pp. 43-52. [Research paper](https://carpentries.github.io/instructor-training/files/papers/mayer-reduce-cognitive-load-2003.pdf). Used for the limited claims about pretraining, segmentation, and related words/pictures.
3. Michelene T. H. Chi and Ruth Wylie, “The ICAP Framework: Linking Cognitive Engagement to Active Learning Outcomes,” Educational Psychologist 49(4), 2014, pp. 219-243. [Author-hosted paper](https://education.asu.edu/sites/default/files/lcl/chiwylie2014icap_2.pdf). Used to distinguish observable clicking from deeper explanatory engagement; the proposed site changes remain design judgments.
4. Azure, [ADR-032: Environment deploy identity and namespace RBAC](https://github.com/Azure/osdu-spi-stack/blob/main/docs/decisions/032-environment-deploy-identity.md), and [Fork deployment loop](https://github.com/Azure/osdu-spi-stack/blob/main/docs/design/fork-deployment.md). Eligibility, reviewer policy, lock-object permissions, and test/restore limits.
5. Azure, [Workload Identity and request authentication](https://github.com/Azure/osdu-spi-stack/blob/main/docs/design/workload-identity.md). Shared workload access, retained middleware credentials, and separate authentication paths.
6. Reference partition code: [AuthorizationFilter](../../../../osdu-spi-partition/partition-core/src/main/java/org/opengroup/osdu/partition/auth/AuthorizationFilter.java:35), [Azure AuthorizationService](../../../../osdu-spi-partition/provider/partition-azure/src/main/java/org/opengroup/osdu/partition/provider/azure/utils/AuthorizationService.java:38), and [PartitionController](../../../../osdu-spi-partition/partition-core/src/main/java/org/opengroup/osdu/partition/controller/PartitionController.java:58). Local source access at 3a5690d.
7. Current training copy: [descriptor myth](../../../src/content/myths.js:196), [runtime explanations](../../../src/content/component-details.js:262), [chapter transitions](../../../src/content/chapters.js:366), and the reference [partition validation workflow](../../../../osdu-spi-partition/.github/workflows/validate.yml:1).
8. Azure, [Stack architecture](https://github.com/Azure/osdu-spi-stack/blob/main/docs/architecture.md), [Deployment lifecycle](https://github.com/Azure/osdu-spi-stack/blob/main/docs/design/deployment-lifecycle.md), and [Flux reconciliation](https://github.com/Azure/osdu-spi-stack/blob/main/docs/design/flux-reconciliation.md).
9. Training sources: [published start](https://danielscholl-osdu.github.io/osdu-spi-training/#start), [audio markers](../../../src/content/audio.js:155), [orientation transcript](../../../src/content/transcripts/machinery.js:1), [start-page renderer](../../../src/components/pages.js:76), and [poster captions](../../../src/content/posters.js:1).
10. Supplied local reference artifacts, inspected without alteration: osdu-spi-stack-guide.pdf (47 pages), osdu-spi-guide.pdf (56 pages), and osdu-spi-complete-guide.pdf (103 pages). Their structure explains the breadth of the current audio inputs; current repository source takes precedence for technical behavior.
