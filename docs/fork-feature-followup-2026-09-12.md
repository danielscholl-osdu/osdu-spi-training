# Fork feature review · Follow-up

Reviewed `fb5f509` on `feat/fork-and-seam`, including `a3abc25`, against the local preview at `127.0.0.1:5173`. This supplements the original review; it does not replace it.

## Assessment

The revision resolves the major problems with the lesson's structure. The progression from a request, to its provider, to the repository, to a candidate image, and back into the stack now has a concrete thread. The real cache fallback gives the engineer something worth following. Keep the six-view structure and the distinction between unit-test evidence and acceptance-suite evidence.

The next pass should concentrate on the moment of understanding: **keep the learner's action, its visible result, and its short explanation together.** Several interactions now change the correct state, but the learner cannot see that state from the place where the interaction leaves them. Audio has a related problem: its corrections exist, but are separated from the place where the learner hears the claims.

I would address the first three findings below before adding further lessons, recordings, or posters. They require focused changes, not another restructuring of the course.

## Improvements verified

- At 390px, the ownership table has four correctly labeled cells per row. `main` owns the Azure provider; `fork_upstream` does not. The five moment controls fit without horizontal page overflow. The branch names still wrap quite tightly, but their ownership is no longer shifted under the wrong headings.
- View 04 includes all three fork branches and gives `.spi/service.yaml` its own repository-authored row, marked as not yet written in the partition fork.
- View 05 distinguishes the integration PR from the version PR, places eligible acceptance runs before release, and moves independent scheduled work into the Meanwhile strip.
- The cache fallback is real. Commit `fc2dfbf` changes the provider and regression tests. Showing the request's cache failure and Table Storage fallback is a better teaching example than an unnamed patch.
- The handshake state panel changes with selection, and the ownership-loss alternative leaves the newer pin in place. The lock uses the stack's visual language.
- Map audio cues switch episodes and seek without leaving the map. Opening Listen preserves the current episode. One audio element serves the page frame.
- Browser checks confirmed the retired repository, image, release-PR, and template-PR links select `main-branch`, `candidate`, `integration-pr`, and `template-pr`, respectively.

## 1. Keep the changing state visible when the learner acts

**Priority: high.** The new visual interactions work internally, but their teaching effect can disappear offscreen.

On a 390×844 viewport, I selected the running example's **Restore** hop in 06. The URL and selection changed to `restore`, and the state panel correctly showed A restored and the pod returning from B to A. However, the entire state panel was above the viewport: its bottom was about 130px above the visible area. The explanation sheet opened from roughly y=295 to the bottom of the screen and covered the selected Restore control itself. The learner sees a long explanation, while the diagram that demonstrates it is missing.

[Observed Restore result on a phone](/Users/danielscholl/source/spi-workspace/training/output/playwright/review2-restore-mobile.png)

The upstream-deletion toggle has the same spatial problem. At 390px, the changed upstream provider and test cells were about 446px and 308px above the viewport after clicking the toggle. At desktop size, the provider cell was also above the viewport and the test cell was behind the header. The nearby result paragraph appears, which is useful, but the actual before/after ownership comparison is not visible.

**Recommended change:** In 06, give the selected stage a compact visual result next to its control or at the top of its mobile explanation: lock digest, owner, pod digest, and one sentence. Keep longer operational detail optional. For the deletion experiment, place a compact before/after provider row next to the toggle, or move the control beside the affected rows. Preserve the full table for inspection.

Do not solve this by making every selection scroll. Links below a map still need their current in-place behavior. Fix the geometry of the explicit map jump and the location of the changing evidence.

The relevant jump currently centers the selected element and then expands the inspector in [main.js](/Users/danielscholl/source/spi-workspace/training/src/main.js:245). The changing state is a separate section above the controls in [diagrams.js](/Users/danielscholl/source/spi-workspace/training/src/components/diagrams.js:308).

**Verification:** At desktop and phone sizes, select Restore and toggle upstream deletion. Assert that the changed visual state is in the usable viewport and not covered by the header, player, or explanation. A selected attribute and a zero-overflow measurement do not establish that the learner saw the result.

## 2. Show source corrections where the audio plays

**Priority: high.** The new in-map cues can deliver incorrect narration without displaying the corrections already written for it.

The handshake cue at 48:46 correctly plays the interface episode in place. Its marker notes correct three material claims: GHCR rather than an Azure registry, suites running once each rather than three times, and restore being conditional on ownership. Those corrections appear on Listen, but neither the map cue nor the player displays them. The same gap affects the fork's labels cue: its note corrects the narration's webhook claim to the monitor's six-hour schedule.

The implementation resolves each marker to obtain its end time, but does not render its `note` in [listenChips](/Users/danielscholl/source/spi-workspace/training/src/components/pages.js:252). The existing handshake correction is in [audio.js](/Users/danielscholl/source/spi-workspace/training/src/content/audio.js:319).

**Recommended change:** When a cue starts, show its short source-check note beside the cue or in an accessible player disclosure, with the correction's existence immediately visible. Keep it synchronized as the recording enters subsequent marked sections. The learner should not have to leave the map and find the corresponding marker to discover that the narration needs qualification.

The recordings are useful optional explanations; keep that role. Longer term, short purpose-written passages synchronized to a single visible relationship would reduce these corrections. That is a later content investment, not a prerequisite for fixing the current cues.

One smaller clarity point: the displayed “2 min” is a section duration, not a playback limit. Playback continues into the episode. Label that behavior clearly, or offer an optional stop-at-section-end behavior; either is reasonable.

**Verification:** Start both the handshake cue and the labels cue from their maps. Confirm correct episode, timestamp, unchanged route, and a visible correction without opening Listen.

## 3. Mark the transition from a real fix to an illustrative acceptance run

**Priority: high.** The running example becomes more credible by naming a real commit, but that also makes its later journey sound historical.

The reference partition checkout at `3a5690d` has neither `.spi/service.yaml` nor the `deploy-gate`/`deploy-test` jobs in its validation workflow. The acceptance lane exists in the newer template. Your iteration record correctly states this distinction, but the lesson largely carries the fix into dev1 as if that run already exists. Its scope note comes after the lesson—about 4,972px down the phone layout in the state I inspected.

There is also a precise wording error: “its gate skips today” is not the current partition checkout's behavior, because that checkout has no gate yet. After adopting the newer workflow, a missing descriptor would cause the gate to skip.

**Recommended copy, immediately before the handoff to the acceptance lane:**

> The cache fix and its unit tests are real. Next, follow an illustrative acceptance run using the newer template; the reference partition fork has not adopted that lane or written its descriptor yet.

Use this once at the conceptual transition, with a concise reminder on a direct visit to 06. Keep the detail about pending capabilities inside components or the scope note. There is no need for a large warning banner or live-status language.

Correct the present-tense gate claim in [chapters.js](/Users/danielscholl/source/spi-workspace/training/src/content/chapters.js:404) and the [descriptor explanation](/Users/danielscholl/source/spi-workspace/training/src/content/component-details.js:419). Source evidence is the partition [validation workflow](/Users/danielscholl/source/spi-workspace/osdu-spi-partition/.github/workflows/validate.yml:1) and the template's [deploy-and-test design](/Users/danielscholl/source/spi-workspace/osdu-spi/doc/src/architecture/deploy_test.md:7), which dates the shipped lane to 10 September.

A related small factual correction: the version-PR explanation says the cache fallback has a `fix:` prefix. Commit `fc2dfbf` is titled `[Azure] Fixes for High API Error Count`. Keep `fix: → patch` as an explicitly illustrative conventional-commit example, or cite the actual release-driving commit; do not attribute that prefix to the named historical fix. See [component-details.js](/Users/danielscholl/source/spi-workspace/training/src/content/component-details.js:530).

## 4. Honor timestamp-only Listen navigation

**Priority: medium; reproduced functional defect.**

1. Navigate to `#listen?episode=interface&t=239`.
2. In the same loaded page, navigate to `#listen?episode=interface&t=2926`.
3. The URL changes, but the audio remains at 239 seconds.

The seek runs only when the chapter or episode changes in [main.js](/Users/danielscholl/source/spi-workspace/training/src/main.js:160). A time-only hash change does neither. Fresh-load seeking works.

Handle explicit timestamp changes independently of page rendering. Keep a bare `#listen` from resetting the current position. Add one browser check covering two timestamp links within the same episode, then Back/Forward through them.

## 5. Update accessible ownership state along with the visible cells

**Priority: medium; confirmed in DOM and accessibility snapshots.**

After the deletion toggle, the visible upstream cell becomes absent, but its accessible name remains “present, scheduled for removal”; the test row remains “present.” The change is CSS-generated content, while `aria-label` keeps its original value. Mobile also hides the branch-heading controls, so the per-cell accessible names should carry their branch identity explicitly.

Update the actual cell state and accessible text together. For example: “Upstream tip: absent”; “main: fork-owned.” Preserve a keyboard-accessible way to inspect branch explanations on the phone layout. Relevant code: [treeCell](/Users/danielscholl/source/spi-workspace/training/src/components/diagrams.js:136) and the [CSS toggle](/Users/danielscholl/source/spi-workspace/training/src/styles/architecture.css:989).

This was a DOM/accessibility-tree inspection, not a full screen-reader audit.

## Next iteration and learner review

Keep the current visual direction. The useful next increment is a small pass on visible cause and effect, audio corrections, and the real/illustrative boundary, plus the two functional fixes. More posters or more prose would not resolve these gaps.

Then observe a few senior OSDU engineers exploring the site. This is a product review, not a learner quiz or a completion gate. Watch whether they can follow the cache failure, discover why an upstream deletion cannot remove the fork's provider, distinguish the two PRs, and see why a successful acceptance run gives the slot back. Ask them to explain what changed after a click. If they need to scroll around to find the answer, the interaction still needs work.

## Review coverage

- Drove desktop and 390px phone layouts with Playwright, including selection, the deletion toggle, map jumps, playback, episode switching, timestamp navigation, and retired links.
- `npm run check` passed: formatting, all 12 content-integrity tests, and production build.
- Grounded source checks in local `osdu-spi` at `080f0b8`, `osdu-spi-stack` at `dc2c956`, and `osdu-spi-partition` at `3a5690d`, including historical fix `fc2dfbf`.
- Sampled the new cue behavior and inspected marker corrections; this was not a complete listening audit of all three recordings or an exhaustive accessibility audit.
- Changed no application source. Preserved the previous review, supplied PDF, reference artifacts, branch, and development server. Nothing committed or pushed. Screenshots linked above are local review evidence in the ignored `output/playwright/` directory.
