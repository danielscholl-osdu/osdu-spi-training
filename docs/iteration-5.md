# Iteration 5 · The fork, the day, and the seam

This iteration added the engineering system to the site as three learn views, then corrected them against the [fork feature review of 12 September 2026](fork-feature-review-2026-09-12.md). The plan is in [iteration-5-plan.md](iteration-5-plan.md). Branch `feat/fork-and-seam`.

## What changed

**One running example, real and named.** Every view from 03 to 06 now follows the partition cache fallback: commit `fc2dfbf` in `osdu-spi-partition` (30 July 2026), where a Redis cache that throws is treated as a miss and the lookup answers from Table Storage. View 03 shows the lookup with the cache down; 04 shows where that code rests and what regenerates around it; 05 carries it through the day to a candidate digest; 06 borrows dev1 for that digest. The fallback is proved by the provider’s unit tests in the build. The acceptance suites prove the API on the pinned pod, and the site says so rather than claiming the environment run proves the failure path. Digests, PR numbers, and run ids on the maps are marked as illustrative.

**View 04 shows all three branches.** The ownership table has four columns: the community upstream, then `fork_upstream`, `fork_integration`, and `main` under one band. The descriptor has its own row, “Written in this repository”, because `.spi/service.yaml` is excluded from template sync by name; the workflows and Dockerfile keep their own row. The partition fork has not written its descriptor yet, and the cell says so (◇). A toggle, “What if upstream deletes its Azure directory tomorrow?”, empties the upstream column only, so the reader sees that the fork side has nothing to delete. On a phone each row becomes a card with four labeled cells, which fixes the shifted headings the review reproduced.

**View 05 separates integration, release, and acceptance.** The five moments are now Generate, Integrate, Propose, Build and prove, Release. The integration PR (`release/upstream-*` into `main`) and the version PR (Release Please) are different components. A new `dev1` lane and the “Build and prove” moment say that every eligible same-repository PR and every push gets a `sha-*` digest and a turn in the stack before any release exists. The cascade is described as it is implemented: dispatched by the monitor, `main` merged first, `fork_upstream` second, a hard reset only as stale-state recovery. Template sync, the monitor, and Settings Apply moved out of the sequence into a “Meanwhile, on their own clocks” strip, and an optional “If it conflicts” component shows the blocked path, its owner, and the retry.

**View 06 shows the lock and the pod changing.** A state panel follows the selected step: canonical A running; B pinned and owned by run 9901; B verified in the pod; suites running; A restored because the annotation still names this run; and an optional “another run owns the pin” state where the reset exits 2 and writes nothing. The lock is drawn in the stack’s color, since it is a stack object the fork run writes through one Role. The crumb comes from the candidate digest in 05, not from a release.

**Exact claims corrected.** The package is `ghcr.io/azure/partition` (short service name, from `SERVICE_NAME`), the start page no longer says every image comes from GHCR or promises an hour, the partition provider is described as reading Table Storage in common Storage rather than “not calling Storage”, and the runtime explanations in 03 now answer the click instead of opening sync mechanics.

**Retired links keep their meaning.** `#engineering-system?detail=<x>` and the old `release-pr` and `template` step map to the component that now carries the same meaning, and the integrity check asserts the selected component, not just the chapter.

**Three episodes, cued from the maps.** The two new NotebookLM discussions were transcribed (mlx-whisper, large-v3-turbo), transcoded to mono AAC, and given markers with source-check notes: 26 for the whole-round-trip episode and 27 for the fork-in-depth episode. The Listen page has episode tabs; the dock shows the current episode; `#listen?episode=<id>&t=<s>` deep-links. Each learn view carries two or three “Hear it explained” cues that start a marker in place, so the diagram stays on screen while the audio plays. [Audio source notes](audio-source-notes.md) list every marker and the narration corrections, including the two the review predicted: the image goes to GHCR, and restore is conditional on ownership.

**Two supplied posters and two native guides.** “The Architecture of a Permanent Azure Fork” and “The Engineering System for Continuous Forking” are on the field-guides page with captions that record where the posters differ from the source (label misspellings, the sync cadence box, the lock’s name, the merge order, the schema count). Two native guides sit beside 05: the labels as a state machine, and the fork’s recurring work on its own clocks.

**Two field checks added.** “Template sync will deliver `.spi/service.yaml`” and “The stack only ever runs released versions of a fork”, both under the fork theme. Twenty-one entries in all.

## Verification

`npm run check` passes: formatting, twelve content-integrity tests, and the production build. The tests now cover three episodes, every listen cue starting on a marker, and retired routes resolving to a named component. Playwright drove the built site to confirm the handshake state panel follows the selection, the what-if toggle empties only the upstream column, a listen chip switches episodes and shows the dock, the Listen page shows the episode being played, the retired `repo` link lands on `main` in 04, and at 390 pixels the moment buttons fit and the page does not scroll sideways. No console errors.

## Not done, on purpose

- No recorded narration segments. The cues reuse the generated episodes; a short narrated segment per moment would need a voice the team chooses.
- The partition fork has neither the deploy lane nor a descriptor as of the 2 September template sync, so view 06 shows the lane the template ships and says so in its scope note.
- The learner review the plan calls for has not happened; the review document’s success criteria are the ones to observe against.
