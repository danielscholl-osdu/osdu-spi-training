# Fork feature review · 12 September 2026

The new chapter structure is worth keeping. Going from the stack, into one service, out to its fork, and back through the image lock gives this difficult subject a coherent route. The next iteration should make the change itself visible, correct several ownership and workflow claims, and reduce the amount an engineer must read before the diagrams can teach.

This is an expert review, not an observed learner study. I reviewed the local site at `http://127.0.0.1:5173`, training commit `39688c5`, against the local `osdu-spi` checkout at `080f0b8` and `osdu-spi-stack` at `dc2c956`. I inspected desktop at 1440 × 1000 and phone at 390 × 844, with particular attention to views 03–06. I sampled the preceding stack views, navigation, component selection, moment focus, retired routes, audio markers, and playback continuity. I did not listen to the full recording or audit every supplied poster.

The implementation plan identifies this as a review of the new spine before further guides and audio. Missing fork audio is therefore a next-phase design consideration, not a claim that an already-promised implementation failed.

## What to preserve

- **The round trip.** Familiar OSDU requests provide the reason to learn an unfamiliar engineering system. Keep this order and the book groupings in the rail.
- **The distinction between runtime and source.** The fork is outside Azure. The new views respect that boundary, which is fundamental to understanding the system.
- **The ownership matrix.** Paths against branches is a useful way to explain why the Azure provider survives upstream changes. It needs correction and a companion demonstration, not replacement with another large architecture poster.
- **The visual language.** The typography, restrained palette, diagram frame, and explanatory panel feel like one site. Preserve that consistency.
- **Inspectable evidence.** Named artifacts and source links make the material credible to engineers. The reminder that a green summary can conceal a skipped deployment is particularly useful.
- **The player architecture.** Playback continued when I navigated from the handshake to the stack, with one audio element. Mobile example hops selected the component, opened its explanation, and moved keyboard focus to it.

## Correct before the next learner review

### 1. The phone ownership table labels the wrong columns

**High priority · reproduced.** At 390 pixels, the empty path heading is removed from the grid with `display: none`. The remaining headings shift left, while the data rows retain all four columns. “Upstream tip” sits over the path names, `fork_upstream` sits over upstream values, and `main` sits over the generated branch's values. The real `main` cells have no heading above them.

This changes the meaning of the lesson: the Azure provider appears absent beneath “main.” The 56-pixel headings also wrap and overlap enough to be difficult to read. The five moment buttons have similar text clipping on a phone.

Evidence: [phone ownership table](../../../output/playwright/fork-shape-mobile-table.png), [phone moment controls](../../../output/playwright/fork-day-mobile-controls.png), [responsive table rules](../../../src/styles/architecture.css:932).

**Change:** preserve the corner's grid position as the immediate fix. Then give phone readers labeled ownership cards or an intentionally scrollable table with a persistent path column and clear scroll affordance. Do not compress branch names into tiny columns. Use a readable moment selector that keeps the active step and next action visible.

**Review criterion:** without opening a detail, a phone reader can correctly locate the Azure provider in every displayed branch.

### 2. The table gives the template ownership of the service descriptor

**High priority · source contradiction.** The “From the template” row groups `.spi/service.yaml` with workflows and `build/Dockerfile`. Its explanation says all arrive through Sync Template. The descriptor runbook says the service repository owns this file and template sync never changes it; the actual sync configuration explicitly excludes `.spi`.

Evidence: [table row](../../../src/components/diagrams.js:80), [explanation](../../../src/content/component-details.js:407), [descriptor ownership](../../../../osdu-spi/doc/src/runbooks/service-descriptor.md:3), [sync exclusion](../../../../osdu-spi/.github/sync-config.json:146).

**Change:** show separate rows for template-maintained machinery and service-maintained acceptance configuration. Both are protected from upstream generation, but they have different authors and update paths. That distinction is exactly what view 04 should teach.

### 3. Integration, release publication, and acceptance are being compressed into a misleading sequence

**High priority · source contradiction and teaching gap.** “Wait” presents `release/upstream-*`; “Release” immediately says that merging “the release PR” creates a version. These are two different PRs. The cascade proposes integration into `main`. Release Please separately proposes version and changelog changes; merging that PR publishes a release. The distinction exists in one detail panel, but the main sequence does not draw it.

The transition to 06 also suggests a tagged release is what first becomes eligible to borrow a stack. The implemented lane accepts eligible same-repository PRs and pushes after image publication. A semantic release is not its prerequisite. “Retagged, not rebuilt” is true of the release retagging operation: validation can still be building the image for that release commit concurrently. Do not imply the earlier integration candidate and a later release commit are necessarily one unchanged digest.

Evidence: [Wait and Release moments](../../../src/content/fork-moments.js:28), [two PRs hidden in the explanation](../../../src/content/component-details.js:509), [release phases](../../../../osdu-spi/doc/src/workflows/release.md:18), [implemented acceptance lane](../../../../osdu-spi/doc/src/architecture/deploy_test.md:17).

**Change:** distinguish “Integration PR” from “Version release PR.” Introduce “CI builds and pushes this commit's digest” before the handshake. Make publication an optional continuation of the source story. Keep the chapter order as a teaching order and explicitly say that acceptance also runs before release.

### 4. Several exact operational claims need a correction pass

These are small edits with large consequences for credibility:

| Current teaching                                                        | Source-grounded correction                                                                                                                                                                                                      |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The candidate is `ghcr.io/azure/osdu-spi-partition@sha256:…`.           | For the onboarded `partition` service from `Azure/osdu-spi-partition`, the package is `ghcr.io/azure/partition`. The ephemeral pin validates this mapping. The earlier image-source detail already uses the correct short name. |
| The start page says `spi up` pulls every service image from GHCR.       | Canonical source is selected per service. A missing source tag means community, using the OSDU GitLab registry; explicit fork promotion selects GHCR.                                                                           |
| Cascade Integration runs with `pull_request_target`.                    | `cascade.yml` runs through `workflow_dispatch`. The monitor handles the PR event and dispatches it.                                                                                                                             |
| Every cascade resets `fork_integration` to `main`.                      | The normal cascade merges `main` first, then `fork_upstream`, preserving local work. A hard reset is conditional stale-state recovery; cleanup is a separate concern.                                                           |
| The partition provider “does not call Cosmos, Storage, or Service Bus.” | It does read **Table Storage in common Storage**, after checking cache. Say it does not visit the partition's Cosmos DB, blob Storage, or Service Bus.                                                                          |

Sources: [package mapping and pin requirements](../../../../osdu-spi-stack/docs/design/fork-deployment.md:142), [canonical source policy](../../../../osdu-spi-stack/docs/decisions/033-explicit-canonical-image-source-policy.md:23), [cascade trigger](../../../../osdu-spi/.github/template-workflows/cascade.yml:3), [normal merge order](../../../../osdu-spi/.github/template-workflows/cascade.yml:203), [partition lookup implementation](../../../../osdu-spi-partition/provider/partition-azure/src/main/java/org/opengroup/osdu/partition/provider/azure/service/PartitionServiceImpl.java:98).

Also remove the unqualified “bring up in an hour” promise. The site's own lifecycle material correctly distinguishes provisioning observations from API readiness; the landing page should carry the same care.

### 5. Retired component links silently select the image lock

**Medium priority · reproduced.** `#engineering-system?detail=repo` opens the handshake and selects `delivery`. The chapter alias works, but the old component's meaning is lost. The previous scene also exposed `stack-source`, `upstream`, and `engineering`, which no longer belong in this destination.

Evidence: [alias handling](../../../src/router.js:5), [selection fallback](../../../src/main.js:223).

**Change:** map retired chapter-and-detail combinations to their new semantic homes. For example, the old service repository detail belongs in 04, while delivery belongs in 06. Extend the existing route check to assert the selected component, not just that a chapter resolves.

## Make the learning progression do more work

### 6. Give “the fix” a concrete reason to exist

The request has an API, a partition, and an environment. The fix has only a directory. Without a symptom and an expected result, the reader follows a pipeline without knowing what success would mean.

A suitable **illustrative** case is: “The cache is unavailable. The partition lookup should still return configuration from common Storage.” The current partition implementation already contains that fallback, making it a source-grounded behavior to explain, not a claim that the current code is broken.

Carry that behavior through the views:

| View             | What the reader should see change                                                                                                                         |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 03 · One service | A cache failure takes the Table Storage path and returns the stored `opendes` configuration.                                                              |
| 04 · Ownership   | The corresponding provider change remains in the fork-owned path while upstream changes its shared tree.                                                  |
| 05 · Integration | The provider change and new shared code meet in `fork_integration`; one concrete build/test result explains whether they remain compatible.               |
| 06 · Acceptance  | The candidate digest temporarily occupies the partition slot, the relevant declared tests provide evidence, and the recorded canonical image is restored. |

For a cache-failure demonstration, verify that the actual declared suite exercises that behavior before labeling its pass as proof. A generic green acceptance result should not be presented as evidence of an untested failure case.

Use a persistent name such as “Partition cache fallback” and illustrative commit/digest labels. Keep hypothetical states explicitly labeled as illustrations. The reader should recognize the same change without rereading every introduction.

### 7. Teach the three branches before asking the reader to follow them

View 05 says it builds on the three branches from 04. The ownership table in 04 shows upstream, `fork_upstream`, and `main`: one external source and only two of the fork's three branches. `fork_integration` first appears in explanation prose.

Evidence: [table columns](../../../src/components/diagrams.js:32).

**Change:** introduce the three jobs visibly: generated input (`fork_upstream`), integration workspace (`fork_integration`), protected result (`main`). Keep the community repository outside that group. The ownership matrix can remain compact if a small branch relationship diagram makes the omitted workspace explicit.

Then add one optional “Upstream removes Azure” state. Let the upstream provider disappear while the fork-owned provider remains. Explain why with one sentence and put merge-base mechanics behind the detail. This is the moment that can make the central idea click.

Customer mirrors are useful depth, but they should follow that understanding. They currently consume one of the three main outcomes before the missing branch relationship is established.

### 8. Make workflow interactions show movement and consequences

The day view changes active lanes, which is useful, but most of the transformation still lives in sentences. There are also two adjacent sequences: five running-example hops ending at a digest and five workflow moments ending at template receipt. Their numbering describes different things.

Evidence: [desktop workflow](../../../output/playwright/fork-day-cascade-map.png), [moment renderer](../../../src/components/diagrams.js:198).

**Change:** retain the running-example hops, but make one sequence the clear primary control. Draw the provider change and upstream change entering the integration workspace, and show the resulting artifact. Reduce repeated narration around it. Keep branches in stable positions across moments so the learner can compare states visually.

Template sync and Monday settings reconciliation are independent scheduled work. Put them in a separate “Meanwhile” lane or optional guide. An 08:00 template sync is not the fifth causal step after a human review that can take days. “The fork's recurring work” or a clearly qualified example day would be more accurate than an implied midnight-to-release timetable.

One optional failure comparison would add more teaching value than another poster: clean integration versus a shared-interface change that requires a provider update. Show the blocked branch, the responsible owner, and the evidence that permits retry. No quiz or completion tracking is needed.

### 9. Make the handshake visibly cross the boundary

The A/B/C grouping is understandable, but the central write is described in an arrow caption while the lock is in another column. On a phone, the whole run precedes the stack section, so the reader encounters Verify, Prove, and Restore before reaching the lock and pod they operate on.

Evidence: [handshake diagram](../../../output/playwright/handshake-desktop-map.png), [seam renderer](../../../src/components/diagrams.js:225).

**Change:** make the six existing hops drive a small state demonstration. Keep a lock/pod state visible alongside each step, or interleave it in the phone flow:

1. Canonical image A is running.
2. This run pins candidate B and records its ownership.
3. Verification observes B in the pod.
4. Declared suites produce inspectable reports.
5. Restore writes the recorded canonical A only while this run still owns the pin.

An optional “another run now owns it” state would make conditional restore understandable. Keep identity, descriptor bindings, and verification limitations in the selected component's explanation. Distinguish a successful lock write from reconciliation and API/test success in the headline or its immediate supporting sentence.

Reserve orange for fork-owned source. The image lock is a stack object temporarily written by the fork run; coloring it as fork-owned obscures that distinction.

### 10. Put the useful interaction earlier and make its explanation match

At 390 × 844, the start page's primary action begins around **y=878**. The fork ownership table begins around **y=1345**. The day view's moment selector begins around **y=1331**, and its branch map around **y=1760**. At 1440 × 1000, the day view's branch map begins around **y=982**. These are observed document positions in the review browser, not universal layout guarantees.

The introduction, premise, scope, running-example strip, moment selector, moment story, and detail panel often explain adjacent versions of the same idea before the diagram has done anything.

**Change:** retain one promise and one visible start action; shorten the opening explanation of SPI and let the later reference section provide the three meanings. “Follow one OSDU request down to its Azure provider, then follow a provider change back into a running stack” is a clearer promise than “Two repositories,” especially when the site later names three repositories.

For a learn view, aim for a short question, a one-sentence connection to the previous concept, the running-example hops, and the map. Move exact schedules, Git plumbing, labels, polling counts, and configuration details into the relevant explanations. Preserve technical precision there.

The explanations also need to answer the current click. In 03, “Common code” opens upstream sync mechanics, and “Table Storage” opens a Service Bus/indexer compatibility explanation. Neither explains this stage of the partition request. Give the runtime components runtime explanations; introduce their source ownership as the bridge to 04.

Evidence: [start on phone](../../../output/playwright/start-mobile-top.png), [runtime detail content](../../../src/content/component-details.js:262).

## Audio and field guides after the story is stable

The existing 22 audio markers cover the stack, service interface, and handshake. None targets `fork-shape` or `fork-day`. The architecture supports continued listening, but audio does not yet reinforce the new fork material.

Add short, optional narrated segments attached to the exact moments that need explanation: why the provider survives, where both trees meet, and why restore is conditional. Keep the complete episodes as deeper listening. Each short segment should explain the diagram's current state, with a transcript and an explicit link to the corresponding view. Audio should continue to avoid automatic navigation.

Use field guides for reference topics: labels and recovery, schedules and triggers, mirror contributions, and descriptor ownership. The main path should still work without opening any guide. Preserve source-check notes for generated narration and supplied posters; do not let known limitations disappear below a long page when the associated component is selected.

## Suggested iteration order

| Iteration                    | Scope                                                                                                                                                                            | What the next review should establish                                                                                                         |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 · Correct the model        | Mobile headings and controls; descriptor ownership; registry mapping; cascade behavior; PR distinctions; acceptance timing; retired links.                                       | Every visible relationship agrees with the source, and phone readers can identify the same owners as desktop readers.                         |
| 2 · Make one change tangible | Name the example; expose all three branches; demonstrate provider survival; carry the two changes through integration; show lock/pod/restore state. Shorten repeated setup text. | An engineer can follow why the provider survives and how one candidate is proved, using the diagrams and their explanations.                  |
| 3 · Reinforce and validate   | Add contextual audio and small field guides; observe a few engineers new to SPI using the path.                                                                                  | They can explain where a provider fix belongs, what a green check proves, and what image remains after the run, without help from the author. |

Those last questions are for a moderated product review, not quizzes or required exercises in the learning site. Observe where readers pause, misinterpret a branch, lose the example, or open documentation for an explanation the map should have supplied.

## Verification and limits

`npm run check` passed: formatting, all 12 content-integrity tests, and the production build. The browser reported no console errors during the sampled review. The tests verify connections and required fields; their success does not establish factual correctness or usable mobile geometry. The table and descriptor findings demonstrate that distinction.

Only this review document was added. Application source, reference PDFs, supplied reviews, and source repositories were not edited. Screenshots are in the ignored `output/playwright/` directory. No commands shown in the training material were executed against Azure or SPI environments.
