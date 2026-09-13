# Lessons 01–03: implementation review

Reviewed 13 September 2026 on the [published site](https://danielscholl-osdu.github.io/osdu-spi-training/#running-stack), against training commit `99db13a`. The published JavaScript asset, `index-DuIx0HeR.js`, matches the local production build. This review covers the implemented lessons, their claims, maps, evidence drawers, and running examples. It does not propose a replacement visual design.

**The new lesson structure is worth keeping.** Each lesson now has a clear point, an explanation before exploration, and an exit before optional material. The largest remaining problems are the distance between controls and their visible results, evidence that sometimes answers a different question, and two technical statements that need correction. The prose needs a smaller, more selective edit than the earlier version did.

## Lesson 01: What is a stack?

**“AKS is one part of the stack” is an excellent headline.** It is short, specific, and immediately useful to someone who knows OSDU but has not operated this environment. The map substantiates it: the workstation and repositories are outside the environment, while AKS and Azure data resources occupy separate areas inside the stack boundary. Keep that geometry.

The partition-versus-shared-resource claim is also strong. It gives `opendes` a concrete meaning through Cosmos DB, Storage, and Service Bus, then shows what another partition would share. The third claim establishes the embedded provider before Lesson 03 opens the service. These three ideas form a sensible introduction, and the visible map plus prose support the carry-forward statements without requiring a drawer.

The main weakness is the interaction's reach. At the top of the desktop page, the first claim is selected, but all four highlighted component nodes are below the first viewport. On a phone, the map starts around 1,394 pixels down the document. Selecting a different claim updates the card and a distant map; the learner must scroll to discover what changed, then scroll back to compare another claim. The layout adapts to the narrow width, but the relationship between control and result is still awkward.

I would also make the first mention of the example explicit: “Use `opendes`, our example data partition, in the `dev1` environment.” The current goal assumes the reader already recognizes the name. The profile misconception is useful, but profiles have not yet been introduced on the required lesson surface. A misconception about treating AKS as the whole stack would reinforce this lesson more directly; the profile explanation can remain with the lifecycle or optional guide.

The provider claim's evidence needs a better opening. “How we know” currently opens “Shared OSDU code,” lists familiar services, and offers `kubectl get deployments -n osdu`. That establishes where workloads run, but does little to explain why the provider is inside the same service. Lead with that packaging relationship and link to the relevant source, then offer workload inspection as additional operational detail.

## Lesson 02: How it comes to life

**This lesson has the most useful progression.** Reusing the same architecture map across preparation, provisioning, bootstrap, reconciliation, use, and teardown makes the changes understandable. The six moments remain navigable, and their “Look closer” links select the intended component. Closing those drawers returned focus to the corresponding link in the browser checks.

Several details deserve to stay: `spi check` does not establish login or permissions; Flux overlaps the final CLI work; completed initialization matters; and ordinary teardown retains identity and naming while deleting application data. The timing labels distinguish observations, overlapping work, and deadlines. These are the kinds of distinctions an experienced engineer will use later.

**Correct the readiness outcome.** It calls a successful CLI exit “the first of five milestones” and says `spi status --watch` follows “the rest.” The deployment guide says the CLI verifies the Git source artifact revision before returning. Flux also runs concurrently with the final CLI stages. The source's five-row table distinguishes signals; it does not establish that chronological order. The lesson's own reason already correctly says that `status` does not make the final API call. Make the carry-forward sentence equally precise. [Deployment lifecycle](https://github.com/Azure/osdu-spi-stack/blob/dc2c956/docs/design/deployment-lifecycle.md).

Suggested outcome: “A successful `spi up` does not establish API readiness. Follow workload health and initialization with `spi status --watch`, then verify the API path with an authenticated request.”

The first claim also needs more relevant evidence. Its promise concerns CLI, Flux, and controller responsibilities; its drawer leads with Git fetching being suspended. That is useful later, but it is an indirect answer to the selected claim. Start by saying which artifacts the CLI creates and what Flux continues reconciling. Put the suspension detail after that account.

The claim cards are denser here than in Lesson 01. The readiness reason compresses five signals, three Kubernetes object kinds, a command, and an exception into one small paragraph. A compact set of labeled signals next to the relevant map state would be easier to read. Preserve the distinctions while reducing the prose the learner must scan inside a button.

## Lesson 03: The SPI boundary

**The service-image boundary is the strongest addition.** Showing shared code, `IPartitionService.getPartition`, and the Azure implementation inside one image makes the absence of an internal network hop concrete. The source-ownership area sits outside the runtime image, which correctly keeps a Git repository out of the deployed stack.

The cache-down variant is useful teaching material. It changes a specific condition and shows a specific consequence: the cache exception is handled, and Table Storage can still supply `opendes`. The visible condition note limits the example to a reachable table containing the partition. The fix, provider source, and regression-test name give this story substance. Keep this example.

**The resource block currently teaches the wrong authentication boundary.** It groups “Redis · common Storage tables” under “Azure data services,” “accessed with Workload Identity,” and “no stored keys.” In the reviewed stack, Redis runs in the `platform` namespace and uses middleware credentials. Common Table Storage is outside AKS and uses Azure identity. Both are outside the service image, but they are not the same kind of dependency. This compression conflicts with Lesson 01's correct map and with the stack documentation. [Architecture](https://github.com/Azure/osdu-spi-stack/blob/dc2c956/docs/architecture.md), [identity and middleware credentials](https://github.com/Azure/osdu-spi-stack/blob/dc2c956/docs/design/workload-identity.md).

Draw or label those two dependencies separately: “Redis cache · inside AKS” and “Common Table Storage · outside AKS · Workload Identity.” This can remain one compact flow. The learner needs to see which boundary each call crosses.

The third claim introduces `fork_upstream`, `fork_integration`, and `main` before Lesson 04 explains them. The ownership idea belongs here as a bridge; the branch mechanics can wait. “The fork maintains the Azure provider separately from generated shared code” is enough to prepare the next lesson.

The image claim's evidence also drifts into the next part of the course. It discusses public GHCR packages, tags, package-name variables, and image digests. For the claim that interface and implementation run together, the more direct proof is the provider POM's dependency on `partition-core`, its Spring Boot packaging, and the application's runtime entry point. Registry policy can remain deeper evidence for the fork and deployment lessons. [Provider POM](https://github.com/Azure/osdu-spi-partition/blob/3a5690d/provider/partition-azure/pom.xml), [Dockerfile](https://github.com/Azure/osdu-spi-partition/blob/3a5690d/build/Dockerfile).

## Shared interaction and evidence findings

These observations were reproduced in the published implementation; they are separate from preferences about the design.

| Finding                                              | Reproduction and consequence                                                                                                                                                                                                          | Recommended change                                                                                                                                                           |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Evidence opens below the useful viewport             | At 1440 × 800, open Lesson 01's first “How we know” from the top. The drawer starts at y=776 and ends at y=1306: only its top 24 pixels are visible. Lesson 02 and 03 evidence can start even lower.                                  | Keep evidence readable when invoked from a claim above the map. Check the visible drawer content, not just its expanded state.                                               |
| First opening does not reliably move keyboard focus  | Fresh-load Lesson 01, focus “How we know,” and press Enter. After the animation settles, focus remains on the link. Tab moves to the next claim. Reproduced at desktop and phone widths; on the phone that claim is behind the sheet. | Move focus once the drawer can receive it; retain the working close/Escape return to the opener.                                                                             |
| A saved evidence URL changes interaction mode        | Open Lesson 03 claim 1 evidence. `#spi-boundary?detail=azureimpl` initially leaves claim 1 selected and the example collapsed. Reload it: the example expands, hop 4 becomes current, and no claim is selected.                       | Resolve the ambiguity between a component used as claim evidence and the same component used as a trace hop. Preserve existing routes while defining consistent restoration. |
| “Owned by” often contains a category or location     | Examples include “The stack boundary,” “After ordinary spi down,” and “The Azure implementation.” These are not owners.                                                                                                               | Give ownership its own content field, use a contextual label, or omit it when it does not apply.                                                                             |
| Automatic truncation weakens contextual explanations | The drawer concatenates a title with the first sentence, placing the rest under “More.” For the provider this repeats a cache introduction while hiding the prose explanation of fallback.                                            | Author a short answer for the selected lesson context, followed by deliberately chosen optional detail.                                                                      |

The default phone sheet does appear correctly after its animation settles. The issue is focus, rather than a sheet that fails to open. Exploration restores all component weights, all fifteen running-example hops opened their targets, and no horizontal page overflow or browser console errors appeared in the tested routes.

The map-control distance deserves attention even after the drawer defects are fixed:

| Fresh lesson, example collapsed | Map begins: 1440 × 1000 | Map begins: 390 × 844 | Carry-forward section begins on phone |
| ------------------------------- | ----------------------: | --------------------: | ------------------------------------: |
| 01                              |                  776 px |              1,394 px |                              3,643 px |
| 02, initial preparation moment  |                  836 px |              1,494 px |                              3,434 px |
| 03                              |                  875 px |              1,531 px |                              3,668 px |

These are document positions, not loading times or quality scores. Long pages are acceptable when the reader sees a clear progression. Here the concern is that the primary control and the components it changes cannot be seen together. Consider a shorter claim area, a compact selected-claim reminder by the map, or an explicitly labeled map-jump action. Preserve the site's rule that ordinary selection does not unexpectedly move the page.

## Wording: what still sounds manufactured

The current copy generally sounds more like engineering instruction. Its best passages name an action, an artifact, and a consequence. The remaining awkwardness comes from author-facing lesson rules appearing in learner copy, repeated numerical framing, and abstractions introduced before their explanation. These are editorial observations, not evidence of who or what wrote a sentence.

| Current wording                                                             | Suggested wording                                                                                           | Reason                                                                           |
| --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| “With the drawer closed, you can point to…”                                 | “Trace the lookup from shared code into the Azure provider, and explain what happens when the cache fails.” | A goal should describe understanding; drawer policy belongs in the design notes. |
| “Where inside a service does OSDU stop and Azure begin?”                    | “Where does shared code hand the lookup to the Azure provider?”                                             | The Azure provider is still part of the OSDU service.                            |
| “Both halves are created by one spi up and named by one --env.”             | “`spi up --env dev1` creates AKS and its Azure resources together.”                                         | Shows a usable example instead of describing an option in isolation.             |
| “Three claims, one map · select one to see it”                              | “Select an idea to highlight it on the map.”                                                                | Describes the action without another count-based formula.                        |
| “Different owners, different clocks.”                                       | “Flux and Kubernetes controllers continue after the CLI returns.”                                           | States the operational consequence directly.                                     |
| “One command creates the environment. Flux finishes it.”                    | “`spi up` creates the environment; Flux continues the rollout.”                                             | Makes the overlap easier to retain.                                              |
| “The community repository, including the providers the fork does not want.” | “The community repository contains shared code and providers for several clouds.”                           | Describes repository content without attributing a preference to a repository.   |

Keep “AKS is one part of the stack,” “The provider lives inside the service,” and the explicit cache-fallback explanation. Also keep the carry-forward repetition: it gives the learner a useful stopping point. The editing goal is precision, not removing every short sentence or repeated idea.

## Recorded follow-ups and verification

The review is tracked as `fn-2bc`. Follow-up work is recorded in Beads:

| Priority | Issue    | Scope                                                                |
| -------- | -------- | -------------------------------------------------------------------- |
| P1       | `fn-kbc` | Correct Lesson 03's Redis/Table Storage location and authentication. |
| P2       | `fn-mjx` | Make claim results and evidence visible from their openers.          |
| P2       | `fn-5pw` | Fix keyboard focus on first drawer opening.                          |
| P2       | `fn-wes` | Preserve Lesson 03 evidence intent when restoring its URL.           |
| P2       | `fn-p2j` | Give evidence meaningful ownership and proof for the current claim.  |
| P2       | `fn-loo` | Correct the readiness signal ordering.                               |
| P3       | `fn-e7u` | Edit learner copy and reduce premature fork detail.                  |

I would address the factual corrections and drawer behavior before extending this pattern to more lessons. The existing pilot issue, `fn-29r`, remains valuable: observe whether engineers notice the claim-map relationship and choose optional depth without prompting. Browser verification cannot establish that learners retain the intended ideas.

The browser review exercised all nine claims and their evidence links at 1440 × 1000 and 390 × 844, all fifteen example hops, both Lesson 03 trace conditions, all six Lesson 02 moments, exploration mode, close/Escape, and targeted reload/history behavior. A separate 1440 × 800 check reproduced the visibility problem. Animation-sensitive findings were rechecked after transitions completed. Phone checks use a resized Chromium viewport, not physical-device or screen-reader testing. Recordings were outside this review's scope.

`npm ci` and `npm run check` passed: formatting, all 26 tests, and the production build. Technical comparisons used `osdu-spi-stack` at `dc2c956`, `osdu-spi` at `080f0b8`, and `osdu-spi-partition` at `3a5690d`. No Azure or SPI operations were run. The site implementation and earlier review artifacts remain unchanged.
