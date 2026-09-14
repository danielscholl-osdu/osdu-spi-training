# Review of the software factory case study

Reviewed by OpenAI Codex on 14 September 2026. This assesses the three Markdown drafts at `c78bb8b`, their stated build snapshot `62be86e`, and the first `software-factory.png` draft that appeared during the review. The poster and case study are still being developed. This is feedback, not a rewrite or an assessment of an unfinished poster as a final deliverable.

**The story is worth telling.** Its strongest material shows how one engineer learned to direct several AI tools: deciding what to delegate, transferring reviews, preserving decisions across sessions, checking the result, and changing the process when a workflow cost too much. The working site makes those choices concrete. The case study should give those decisions more space and give the tool inventory less.

The main narrative is about 6,700 words, before the numbers appendix and submission draft. Several observations appear in the chronology, again under individual tools, and again in the three closing lists. I would aim for roughly 2,500–3,500 words in the narrative, keeping detailed counts, model settings, issue identifiers, and run timestamps in the appendix.

**Corrections that affect the story**

1. **Restore the beginning of the project and Codex's implementation role.** The narrative starts with the Claude concept review and says Codex implemented only the later lesson 01 rebuild. The historical task **Create Azure SPI training plan** records Codex creating the initial interactive prototype, revising its architecture and lifecycle views, establishing the source structure and development checks, then implementing the first concept-review response. That work became `baa216b`. The five-file prototype was an earlier AI-built stage of this project, not an unexplained starting asset. This is a significant omission from the cast, chronology, submission, and poster. The [first response record](../iterations/feedback-response.md) and [commit](https://github.com/danielscholl-osdu/osdu-spi-training/commit/baa216b) substantiate the early work.

2. **Separate authorship from selection and transport.** The narrative says the owner wrote the landing-page introduction. In **Review Azure SPI training site**, Codex supplied the three paragraphs beginning “The Azure stack runs OSDU services alongside the resources they depend on.” The same suggestion, including its explanatory wrapper, appears in the Claude session as the user's message at 18:56:47 CDT on 13 September. The supported account is that the owner selected and passed on proposed copy. That is a useful example of editorial judgment and a cross-tool handoff. Likewise, identify which plan corrections the owner personally supplied and which the orchestrator made under delegated authority. The quoted Go deeper corrections were reported by the orchestrator as its own changes to the plan.

3. **Correct the assessment of Keelson's internal review.** Across the 13 successful runs, the three initial review lanes produced **27 candidate findings: 18 medium, eight low, and one high**. Twelve runs had at least one candidate. Triage retained one blocking finding; the other 12 runs had no confirmed high/critical blocker. These are different measurements from “twelve clean reviews” or “found almost nothing.” The browser-coverage finding identified a real gap; the resulting Playwright setup introduced a separate portability problem. Removing that test does not, by itself, establish that requesting coverage was wrong. Assess candidate quality, triage policy, and the implementation response separately.

4. **Correct the workflow sequence and the explanation of reviewer independence.** Recorded node timings show draft PR creation before the three internal review lanes, followed by triage/fixes and the Copilot request. Both Mermaid diagrams and the poster currently place the draft PR after internal review. The installed workflow gives the review lanes fresh contexts and a captured diff; they did not watch the implementation being written. Using related model families is a possible limitation, but the record does not prove it caused missed defects. Browser review also has different evidence and capabilities from a read-only diff review.

5. **Correct dates throughout.** In 2026, 11–14 September were **Friday through Monday**, not Thursday through Sunday. The underlying git dates support four calendar dates of work. Use dates and timezone consistently; the same wrong weekdays occur in the narrative, charts, appendix, submission, process index, and poster.

6. **Correct the media-removal story.** Orientation and brief were removed from the Audio deep dives listing. They remain in the content and published routes, and Start still uses the brief. The repeated claim that both recordings were cut from the site entirely is false. The Claude request was made at 19:09 CDT on 13 September; the narrative also disagrees with its own appendix about the day. The process lesson is that generated material needed an appropriate place and approved framing, rather than that all introductory audio was discarded. See [audio content](../../../src/content/audio.js) and [Start's cue](../../../src/content/chapters.js).

7. **Narrow what checks establish.** The submission says a content test cross-checks explanations against source repositories before deployment. The tests check content structure, known references, URL patterns, expected statements, and local source-path existence when sibling checkouts are available. They do not independently establish that every explanation is true. Factual review came from reading the source and documentation. Describe source review, automated integrity checks, browser checks, and learner validation as separate layers. The pilot is still pending, so the case study demonstrates delivery of a reviewed site; it has not yet demonstrated improved onboarding.

**Numbers: keep the evidence, repair the denominators**

Several headline figures check out at `62be86e`: **196 commits, 176 non-merge commits, 20 merges, daily counts of 9/19/152/16, and 46 commits touching AGENTS.md**. GitHub shows 24 merged PRs through the final build PR. The project tracker had 81 issues excluding the later case-study task, with 77 closed and four open. The two long recordings are approximately 59 and 69 minutes. These provide a credible sense of scope.

The following need correction or a clearer definition:

| Draft claim                                                           | Finding and recommended treatment                                                                                                                                                                                                                                                                                                |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 83 deployments; 96 workflow runs; zero failures                       | Through the Pages run for `62be86e`, GitHub records **82 successful Pages runs, one canceled Pages run, and 13 successful Copilot runs**. Say 82 successful deployments from 83 Pages attempts. “Zero failures” needs the explicit scope “GitHub Actions”; Keelson has a failed work run and a failed smoke test.                |
| 19 Keelson runs / 18 beads-work runs                                  | The project-scoped ledger currently contains **17 beads-work runs: 13 succeeded, three canceled, one failed; plus one beads-next run and two smoke tests**. That is 18 excluding smoke tests, 20 including them. Identify a missing run if a different total is intended.                                                        |
| AGENTS.md and the content test changed together in six of ten commits | The content test changed in 106 of 176 non-merge commits. **Both files changed in 38**, about 22%. The draft combines two different counts.                                                                                                                                                                                      |
| 81 issues closed                                                      | The submission needs **81 tracked, 77 closed, four open**. Calculate close-time statistics over closed issues only.                                                                                                                                                                                                              |
| 10 inline Copilot comments                                            | The current public PR-comment endpoint returns **nine**. Six arrived after merge; three arrived before merge, on PRs #5 and #18. Preserve an earlier export if it explains a removed tenth comment. Actual comment timestamps provide stronger evidence than guessing from median PR duration.                                   |
| About 150 human messages and 2,652 orchestrator turns                 | These are scoped to the selected Claude session corpus, not the total project or the one main orchestrator session. The appendix itself assigns 1,301 turns to that main session. The newly recovered early Codex work is outside this denominator. This ratio is activity telemetry, not measured human effort or productivity. |
| Seven AI systems                                                      | The inventory mixes vendors, models, applications, workflows, and roles. Define the count or remove it from the headline. A role-based cast is easier to understand.                                                                                                                                                             |

Freeze a common observation cutoff and distinguish it from authoring time. The final source commit is timestamped 11:36 CDT, while PR #24 opens at 11:40:20 and its Pages run starts at 11:40:25. Cross-system totals need an explicit cutoff that includes those events. Preserve a small sanitized export and the counting method; a source cell saying only “Transcripts” cannot explain exclusions, duplicated streaming records, or session boundaries. The cost ledger is indicative and incomplete, as the appendix appropriately notes. Carry that qualification wherever cost appears; do not present it as the price of building the product.

**Writing and narrative**

The concrete incidents are engaging: the owner spotting a stalled browser, a tracker silently reopening issues, a long workflow being replaced with a short subagent task, and reviewers disagreeing over what should ship. Keep the candid failures. They make the account more credible than a smooth success narrative.

The main AI mannerisms are rhetorical certainty and repeated structure, rather than an excess of fashionable words. Examples include “Everything changed,” “It was never a rubber stamp,” “Every review added rules and no review removed one,” “Nothing was removed on a whim,” and “The owner sat above all of it.” These turn incomplete observations into absolute conclusions and make the narrator sound omniscient. Prefer a specific event and its consequence.

For example, “Everything changed at 11:03” can become “On 13 September, I introduced a shared issue tracker and began delegating larger changes through Keelson.” “The review loop found almost nothing” can become “The reviewers raised 27 candidates, but triage treated only one as a blocker. Browser review remained necessary.” “One human message for every eighteen agent turns” can become “The agents performed many intermediate steps between my check-ins; those message counts do not measure my total time.”

Because this is the owner's case study, first person would make the account warmer and clearer. Use “I decided,” “Claude proposed,” and “I asked Codex to review” when the records establish those roles. First person does not require inventing thoughts, and quotations should remain verbatim or become clearly identified paraphrases. Three or four strong quotations will do more than a long collection of informal chat fragments.

Reduce training-site implementation detail to what proves a process point. A missing evidence link is an example of a review catching a defect; readers do not need its component ID. Explain a worktree once as an isolated checkout. Explain MCP once as the connection used to invoke the workbench. Put exact model identifiers and effort settings in the appendix. Also distinguish the factory that built the training site from the SPI engineering system that the site teaches: there are two engineering processes in this story.

The strongest narrative order would be:

1. The engineering learning problem, the hackathon experiment, and a glimpse of the delivered site.
2. What already existed: source repositories, documentation, media inputs, and the workbench; then the early Codex prototype.
3. The operating model: who decided, who built, who checked, and what persisted between them.
4. Three decisions that changed the process, each illustrated by one incident.
5. What the evidence demonstrates, what remained expensive, and what is still unmeasured.
6. The smaller, repeatable setup the owner would use next time.

For the submission form, give the software-factory experiment the first paragraph. Compress the lesson inventory to two sentences and reserve a short ending for the result and transferable lesson. The current form spends too much of its limited attention describing the site, then compresses most of the interesting process into two dense lists.

**Visuals, including the incoming poster**

I inspected the four Mermaid figures in GitHub's rendered view at a 1280px browser width. They render, but the large factory graph scales its labels down severely. The sequence diagram is also small and tall. The Gantt has tiny labels, large inactive gaps, and chart controls over the late-evening labels. The commit chart is readable, but its prominence suggests that commit volume is the primary result.

The new poster is a better visual direction: a coherent palette, clear columns, recognizable roles, and a visible shared-state layer. Treat it as the main overview after the factual corrections. Avoid repeating it immediately with another full factory graph and the complete cast table.

For the poster specifically:

- Replace the prominent human-message ratio with the main process lesson or a qualified outcome. Move most activity counts into the appendix.
- Correct the dates, Codex role, run total, review order, media story, and “0 failures.” Separate all-Claude-session totals from the central orchestrator's figures.
- Show the **delivered training site** as the output. The current factory diagram ends around PRs, merges, and trackers; the thing it produced deserves a visible place.
- Label automatic handoffs, owner-mediated transfers, and delegated approvals. “Every agent reads and writes” overstates what a manually transported review or generated audio artifact does to shared state.
- Give AGENTS.md and the source repositories an explicit role as standards and evidence. The issue tracker and proposal alone do not explain how the factory retained factual and behavioral constraints.
- Reduce the bottom prose panels to three short lessons. The current full-sheet image works as a zoomable reference; an inline Markdown copy will make its smallest text difficult to read.

The most useful additional visual would be **one real change traveling through the factory**: a reviewer finding, a short acceptance criterion, a plan correction, the implementation, a browser observation, and the closed issue. Choose a case such as the drawer repair and quote only the relevant fragments. This demonstrates the system more convincingly than additional logos or statistics.

Keep a small timeline to show parallel work, using plain task labels and focusing on the busy two-hour interval. Label its bars as elapsed workflow runs; they include more than model computation and do not represent human work. A before/after image pair could show the product consequence of a review decision, with one caption explaining the judgment. Avoid adding a chart without a question it answers.

**What is missing for the hackathon audience**

- **The initial conditions.** What was built during these four days, what was adapted, and what existed beforehand? Recover the early prototype work, and explain the pre-existing workbench and source material. Distinguish integrating a factory from building every part of that factory during the event.
- **The owner’s effort.** Record, if available, approximate active time spent reviewing, transferring feedback, fixing tools, and supplying domain knowledge. If it was not measured, say so. “One person” is valuable context but does not establish low effort.
- **A repeatable handoff contract.** Show a short real brief containing the objective, scope, evidence, acceptance criteria, and return format. Explain what another engineer would need to run the same process and which components are optional.
- **The boundary of the experiment.** The process delivered an inspectable, reviewed product. Learner benefit, labor savings, and superiority over another tool combination remain unmeasured. Include the planned pilot near the result rather than hiding it in the final open-items paragraph.
- **A context-recovery example.** Show how an agent resumed from a bead and a design revision after a session ended. Durability is central to the opening claim but is mostly asserted rather than demonstrated.
- **A decision about review costs.** The tiering rule is one of the most transferable findings. Explain the evidence that led to it, then give an example of a large change, a bounded task, and a direct edit. Avoid treating one unequal implementation comparison as a model benchmark.

The draft already has the raw material for these additions. The priority is to replace repeated inventory with evidence of judgment, not to make the case study longer.

**Review evidence and limits**

This review used the Markdown drafts; git history at `62be86e`; the current project-scoped Beads records; public GitHub PR, inline-comment, and Actions history; the Keelson project's read-only run and node-output ledger; the installed workflow and Keelson documentation; current site content and tests; and original Claude/Codex task history. Historical tasks consulted include **Create Azure SPI training plan**, **Review Azure SPI training site**, and **Codex Companion Task: You are implementing Phase A of the lesson 01 referen...**. The initial and paragraph-authorship evidence is specifically outside the Claude-only transcript corpus used by the draft.

The key Codex task IDs are `01a09240-b0c1-7932-ae3c-453784377397` (early prototype), `01a097b9-679f-7380-9740-494e59cf510a` (reviews and paragraph), and `01a09b8a-dabf-70d2-9844-560922eeac4b` (lesson 01 implementation). The Keelson project ID is `d2c13ff9-cade-4cbb-a09d-b6fb1107966e`. These identifiers support follow-up verification without copying private transcripts into the repository.

I did not independently validate every transcript-derived token, cost, generation, or model-attribution total. The eight ChatGPT design conversations should be attributed from their original conversations or explicitly to the owner's account, not inferred from writing style. No learner pilot or controlled tool comparison was performed as part of this review. The authoring task remains in progress; the findings here concern the observed drafts.
