# Published polish verification

The deployed changes in `31947da` resolve the principal audio interaction issues and substantially improve the site-authored copy. The existing page structures should remain. Keeping the native guide titles and the timeline format is reasonable; neither needs to become another redesign task. The remaining work is concentrated in the poster artifacts, reference retrieval, and replacement media scripts.[^1]

This is a focused follow-up to the [three-page polish review](start-audio-field-guides-polish-review-2026-09-13.md). It checks the published changes using ordinary browser clicks and scrolling at 1280 × 720, with an additional 390 × 844 check of poster notes. It does not repeat the complete review or certify every navigation history sequence.

## Confirmed improvements

**Audio navigation and playback.** The subhead now distinguishes playing from a marker and following its lesson link. The revised descriptions name actual engineering subjects: provider resources, sync progress, fork ownership, and conditional restoration. The duplicate source-check prefix is gone. The fork episode summary is particularly improved: it explains what the listener will understand instead of presenting an inventory of internal terms.[^2]

With the stack episode playing, the dock remained hidden while the full controls were visible, appeared when normal scrolling moved them out of view, and hid again on scrolling back. Following the 15:15 marker’s visible “Assemble OSDU” link and using browser Back returned to exactly the departure position, **921.5 pixels**, while playback continued. This verifies the reported fix on the deployed site through actual interaction. Focus still returns to the page headline; restoring focus to the originating link could be a later keyboard refinement, but the previously reported loss of scroll position is resolved for this path.

**Start.** The concept cards now explain relationships more directly, the two lesson questions identify the provider boundary and common mistakes, and the Go deeper descriptions are shorter. The visual balance remains sound. There is no need to reopen the hero layout or lesson-index structure.[^3]

**Guide copy.** The course map now uses a digest-shaped image reference. The familiar guide distinguishes the schema loader from stored schema data and limits the Key Vault copy statement to Redis and Elasticsearch. The ownership and label wording is more concrete. The renamed storage guide makes its purpose and example clearer.[^4]

**Poster qualification.** Both seam posters are explicitly identified as target designs with a reviewed month. Their notes now travel into the lightbox. The Borrow poster’s implementation caveats were visible below the image on desktop and phone, and closing the dialog returned to its opener. This is a useful interim improvement while accurate learner versions are prepared.

## The two declined suggestions

**Keep the existing native guide titles.** Titles such as “Four owners, four boundaries” and “Three profiles, one Azure estate” express a meaningful distinction. A count is not inherently an AI tell. The concern was the cumulative repetition of counts and metaphors across the collection, not a requirement to eliminate all character from headings. The most confusing title—the generic request poster—has already been addressed in the surrounding text.

**Keep the timeline format.** The chart usefully shows reconciliation overlapping the CLI’s final work and continuing afterward. The lifecycle document supports approximately 30 minutes for AKS, 10–15 minutes for the Flux extension, and 45–50 minutes for prior fresh-provisioning observations in centralus. It does not establish exact timed slots for every intervening step.[^5]

The existing legend already distinguishes observed durations, unmeasured ordered steps, continuing work, and deadlines. A small additional caption would adequately address the remaining visual ambiguity: **“Observed durations are from earlier centralus runs; placement of unmeasured steps is illustrative.”** Treat that as a refinement, not a prerequisite for retaining the graphic. The earlier recommendation to replace the whole chart with an untimed sequence was stronger than necessary.

## Remaining concrete issues

**Update the image as well as its caption.** The storage poster now opens beneath “A storage read: identity and authorization checks,” but the image still contains “One request, end to end,” “Cosmos DB row,” and “Entra is the only data plane.” These wording changes need to reach `docs/reference/posters/one-request.html` and its rendered assets. The same consistency pass can align the namespace poster’s internal title with “Namespaces and rollout order.” Preserve the distinction between a caller’s bearer token and the pod’s Azure identity.[^4]

**Put target status before the enlarged image.** The target-design label is currently part of the notes below the image. On opening the Borrow poster, the first screen contains confident architectural claims without the status qualification. Move the existing short status line above the image; the detailed checks can remain below. This is especially useful until the two learner versions are redrawn.

**Keep a correction together.** In the desktop Borrow lightbox, the two-column notes layout split the first bullet across columns: its opening was at lower left and its final clause at upper right. Use one column for these short correction lists, or prevent individual bullets from breaking across columns. The phone notes already read in one column.

The larger guide-page retrieval and phone enlargement work remains appropriately open. The new lightbox notes improve accuracy but do not reduce the collection’s length or make dense image text easier to read. Replacement audio scripts also remain a separate editorial task; the transcript should continue to match the recording.

## Shared plan and review location

The newly supplied link with `?via=banner_open` now displays **“DESIGN INTENT · REVISION 14”**, and its changelog explicitly names `31947da`. The updated polish section matches the reported corrections, remaining poster work, and two declined recommendations. This supersedes the earlier observation of Revision 6 at the public link. The artifact's internal revision is verified; its separate Version 23 label was not needed for this assessment.[^6]

The plan's current decisions are sound, but earlier sections still compete with them. This is now its main editorial problem:

- The opening status still names `4d78d62`, whereas the latest changelog records `31947da`.
- Section 6 first describes a Resources disclosure, then correctly describes the current two masthead icon links. Decision Q3 still says the old Learn rail plus Explore, Listen, and Field guides remains unchanged.
- Section 8 labels the round-five fixes “next,” even though the later narrative and changelog say they shipped. The drawer template also remains headed “as shipped” while describing the earlier implementation.
- The recipe policy says recipes never ship before a walkthrough, while lesson 02 is explicitly live with its Azure route “not walked.” State the intended exception once: a browser-only route may ship after verification; the Azure route remains a clearly marked preview until its walkthrough is complete. If that is not the intended policy, hold the executable Azure recipe until it has been walked.

Keep current status and decisions authoritative, and move superseded descriptions into the changelog or label them historical. The plan does not need another design section; it needs fewer competing versions of the same decision. These are documentation follow-ups, not reasons to reopen the site's now-improved navigation.

The original review remains committed on `codex/review-page-polish`, separate from `main`. This follow-up is saved beside it on the same review branch. The published implementation was inspected from the live site and the named commit without switching the primary checkout or modifying site source.

Follow-up tracking: `fn-ee0` covers poster image/caption consistency; `fn-sys` now includes status placement and intact correction bullets; `fn-4oj` covers conflicting plan status. The two seam redraws remain in `fn-7gy`, and replacement scripts remain in `fn-45p`. Verification is recorded in `fn-afo`.

## Sources

[^1]: [Implementation commit 31947da](https://github.com/danielscholl-osdu/osdu-spi-training/commit/31947da4244565c4b8a35b4e341a0a795b57cb00), including copy changes, scroll memory, dock visibility, and lightbox notes.

[^2]: [Published Audio deep dives](https://danielscholl-osdu.github.io/osdu-spi-training/#listen), observed through playback, actual scrolling, lesson navigation, and Back.

[^3]: [Published Start](https://danielscholl-osdu.github.io/osdu-spi-training/#start).

[^4]: [Published Visual field guides](https://danielscholl-osdu.github.io/osdu-spi-training/#field-guides), including the Borrow and storage poster dialogs.

[^5]: Azure/osdu-spi-stack, [Deployment lifecycle, timing and readiness](https://github.com/Azure/osdu-spi-stack/blob/dc2c95638ded6459538085cfdb2ada46b692c27b/docs/design/deployment-lifecycle.md#timing-and-readiness), compared with the unchanged timeline implementation in `31947da`.

[^6]: [Shared Fieldnotes Layout Proposal, Revision 14](https://claude.ai/code/artifact/3a637ecc-f00a-450f-826f-f5b7e4401945?via=banner_open), including the current polish section, decisions, and changelog, observed after opening the newly supplied link.
