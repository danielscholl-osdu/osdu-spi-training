# Start and lessons 01–02: reading flow and editorial review

The next improvement should make the site easier to read straight through. The architecture, ownership distinctions, and concrete operational details are its strongest material. They currently compete with repeated introductions, overlapping navigation, and controls whose results appear somewhere other than the reader’s current position. The recommended direction is a simpler Start page, a closer relationship between each lesson’s explanation and its map, and fewer invitations to leave the lesson.

The review covers the published Start page, Lesson 1, and Lesson 2, observed on 13 September 2026 at 1280 × 720 and 390 × 844. It also considers the linked proposal, which still identifies itself as Revision 6, and the corresponding implementation at `21a02a8`. These are observed interface findings and editorial judgments, not results from a learner study or a deployment walkthrough. The later `ff7d1f1` change concerns placeholders in the fork diagrams and does not affect the three pages reviewed here.[^1][^2][^3][^4][^5]

**The course should lead with the stack and its engineering system.**

The intended reader already understands OSDU APIs and partitions. What is new is the Azure environment around those services, the provider code inside them, and the engineering system that maintains and tests that code. Opening with “You know the OSDU APIs” and then offering “Or trace one API request through the stack first” spends the next invitation on the familiar subject. A trace can reveal unfamiliar internals, but the invitation does not explain that distinction, and the rest of Start gives the trace more responsibility than it needs.[^1]

The current Start panel introduces a partition lookup, cache fallback, and the point where a real example becomes illustrative before the reader has begun a lesson. These are details about the example’s construction. They make the training sound like a guided debugging case, while the two intended outcomes are understanding the stack and understanding the engineering workflow. The new headline should name both outcomes.

Keep the partition example where it earns its space. In Lesson 1, `opendes` is useful because it makes shared and partition-specific resources concrete. In Lesson 2, an authenticated request is useful as one readiness check. The detailed cache and Table Storage path belongs with the provider explanation in Lesson 3 or in optional evidence. Removing the prominent trace invitation does not require removing its route, source evidence, or technical content.

CIMPL remains a useful reference. Define it once as the open-source community implementation, then compare a specific implementation choice at the point it becomes relevant. The introductory paragraph should not also explain how the site carries that comparison beside resources, provider code, forks, and the test environment. That describes the author’s teaching method rather than the subject.

**What is working and should survive the simplification.**

The visual direction is coherent. The navy frame, restrained colors, clear boundaries, and service/resource labels make the site feel like engineering material. Lesson 1’s headline, “AKS is one part of the stack,” is particularly effective: short, specific, and directly supported by the map. Lesson 2’s “spi up creates the environment. Flux continues the rollout.” also gives the reader a useful distinction immediately.[^2][^3]

The lesson sequence has a strong underlying logic: establish the deployed environment, explain its lifecycle, locate the provider, explain its source ownership, and show how changes return through CI/CD. The site does not need an API request to justify that sequence. The distinction between source outside Azure and workloads inside the deployed stack is especially valuable for this audience.

The evidence drawer now provides a much better kind of optional depth than a new page. In the inspected Lesson 1 interaction it appeared within the viewport, moved focus into the explanation, and returned focus to the opener on Escape. Short audio also plays through the shared player without navigating to another chapter. Both behaviors support reading in place and should be preserved.[^2][^6]

The optional Try it band has the right basic behavior: it expands in place and leaves the explanation usable without performing an exercise. Native field guides also expand within the lesson. These are useful interactions because they answer an immediate interest without requiring the reader to find their way back. The changes below concern their presentation and competing entry points, not their removal.[^2][^3][^7]

**Start: one introduction and one lesson index.**

Start currently contains several overlapping representations of the same curriculum. There are two entry cards, seven path cards, six linked stops in the round-trip figure, three lesson links in the SPI meanings section, and seventeen links in the six-place diagram. The main Start sections contain 43 links before the footer’s Next link; the collapsed documentation list adds more. This count is not a usability score, but it makes the duplication concrete.[^1][^7][^8]

The sidebar repeats the lesson index while the top bar offers Explore, Listen, and Field guides. “Explore” currently points to `#running-stack`, the same destination as Lesson 1, rather than a separate exploration view. Listen and Field guides appear in the top bar, sidebar, and Start’s lower content, with additional audio exits beside the introduction. The reader is repeatedly asked to reconsider where to go.[^1][^9]

Remove the sidebar from Start. Its chapter list is useful once someone is inside a lesson, where it shows their position and offers a deliberate change of chapter. On the landing page, the cards already perform that job with more context. Removing the sidebar should not produce an extra-wide paragraph; keep the introduction and lesson index within a comfortable reading width.

Use one lesson index in the body. Preserve the two intended audiences as group labels over that index: learning the stack, and learning the provider and engineering system. This retains the useful distinction between the two entry cards without adding a separate set of linked cards above the actual lessons. Give Lesson 1 the clear starting emphasis and let the group beginning at Lesson 3 provide the alternate entry.

| Current Start element                                        | Recommendation                                                                        | Why                                                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Sidebar containing the full curriculum                       | Remove on Start; retain within lessons                                                | The landing page already contains the curriculum.                                    |
| Two entry cards above the seven lesson cards                 | Merge their purpose into the lesson index’s group headings                            | Readers can choose an area without navigating through two representations of it.     |
| Trace-first link                                             | Remove from Start                                                                     | It introduces a third entry path and overstates the role of the API example.         |
| Top-bar Explore                                              | Remove until it opens a distinct, useful exploration experience                       | Its current destination is Lesson 1 under another name.                              |
| Highlighted top-bar Listen                                   | Remove the strong emphasis; use the introduction’s playback control                   | Audio should support the reading flow rather than compete with beginning the course. |
| Second introduction block below the lesson cards             | Remove when video opens from the top panel                                            | It currently repeats the media title, subject, and explanation.                      |
| Linked round-trip figure                                     | Move to reference, or replace the lesson index with it if it proves the better index  | Keep one main representation of the curriculum.                                      |
| Three meanings of SPI                                        | Keep as concise reference below the lesson index                                      | The terminology is useful, but each definition need not repeat a lesson link.        |
| Six-place diagram                                            | Move to Field guides, with a compact in-place reference disclosure if needed on Start | Its seventeen links make it another navigation system.                               |
| Documentation cards plus a separate documentation disclosure | Consolidate into one source area                                                      | Readers need dependable sources, not two source indexes.                             |

Keep a quiet way to reach supplementary resources. A simple Resources disclosure in the header could contain the recording library and Field guides; it need not become a new page. On lesson pages, the sidebar should be the chapter navigation and the header should serve a different purpose. Avoid repeating the same supplement links in both.

There is also a copy problem inside the cards. “What is a stack?” followed by “What is actually running when someone says ‘the stack’?” asks substantially the same question twice. A card can contain its number, one meaningful title or question, and only a description that adds information. Requiring every card to display a book label, title, and question is generating repetition.

The current page is about 4,443 pixels tall at the desktop size reviewed and 8,666 pixels tall on mobile. Length alone is not a defect, but much of this length is repeated orientation. On mobile the Start panel begins around 708 pixels down, and the lesson index begins around 1,524 pixels down. Shortening the opening and removing duplicate structures will help the introduction and first lesson become reachable sooner without shrinking the type.[^1]

**The video should open in a modal from the introduction.**

The video jump is confirmed. Clicking “Watch · one minute” on the initial desktop Start page changed the page’s scroll position from 0 to approximately 1,132 pixels and began playing the video below the lesson cards. The implementation explicitly scrolls the video to the center before playback. The click therefore skips over content the reader may still intend to consume.[^1][^6]

A modal is a good fit for this particular interaction. Watch means temporarily attending to the video, while Listen means allowing audio to accompany reading. Those two media types can have different presentations while keeping the reader’s place in the page. Merely deleting the scroll instruction would leave the video playing off screen, so this needs a presentation change as well as removal of the jump.

The Watch button should open one video player over the current page and begin playback from that explicit click. Closing it or pressing Escape should pause the video, restore the same page position, and return focus to Watch. Keyboard focus should stay within the open dialog, captions should remain available, and the player should fit a phone screen without requiring navigation to another page. Do not automatically start a lesson, another recording, or previously paused audio when the modal closes.

Keep the video’s source-check notes with the player, available without leaving the modal. They should remain truthful and accessible, but the first-screen invitation does not need a count of corrections or a paragraph about how the recording was generated. With the video in a modal, the lower duplicate introduction section can be removed rather than retained as another way to play the same item.

The introduction label also needs a small edit. “The introduction · three minutes” implies that the one-minute video and two-minute audio form a sequence to consume together, while the page says they tell the same story. “Introduction” with “Watch · 1 min” and “Listen · 2 min” presents them as clear alternatives. Remove “All episodes” from this compact area; the recording library can remain under Resources.

**Suggested Start copy.**

The following wording shifts the promise toward the intended subject and removes the need to introduce the running example before teaching anything. It retains a definition of SPI and a brief CIMPL reference. The exact line breaks should follow the layout.

> **Understand the Azure OSDU stack and the engineering system behind it.**
>
> SPI stands for Service Provider Interface. It connects shared OSDU code to a cloud implementation. Learn how the Azure stack is assembled and how service forks sync upstream changes, build images, and test them against Azure resources.
>
> CIMPL is the open-source community implementation used for comparison.

The small review line can become “Source-checked September 2026.” The existing second sentence, “Each view links the pages and code it draws on,” can be removed because the source links demonstrate it. Keep the date and the evidence; cut the explanation of how the site uses evidence.

For the lesson index, use “The stack” over 01–02 and “Provider code and engineering” over 03–06. The first two cards could simply read “01 · What runs in the stack?” and “02 · How is the stack created and made usable?” Later cards can introduce ownership, sync/build workflows, and validation against a deployed environment without requiring the reader to understand “the fix,” “that digest,” or “the slot” before opening them.

**Lesson 1: let the map explain the boundary sooner.**

Lesson 1’s central content is sound. The problem is how many times the page prepares to explain it. The reader encounters the headline, an introductory paragraph, a “This lesson answers” question, a “By the end” goal, three claims, the map heading, and an optional running-example row before reaching the architecture. Several of those layers say that the stack includes AKS and surrounding Azure resources.[^2][^5][^7]

The diagram begins around 886 pixels down on desktop and 1,547 pixels down on mobile. On the phone, the claims alone occupy roughly 551 pixels. A reader can therefore select an idea while its visual consequence is well below the visible screen. Adding an automatic scroll would reproduce the interruption being removed from Start; the better change is to bring the explanation and visual closer together.

Keep the headline and replace the opening with a shorter paragraph that carries the necessary conceptual content:

> The stack is one development and test environment in an Azure resource group. OSDU services run in AKS; Azure data services sit alongside it. Some resources belong to a partition such as `opendes`, while others are shared.

The CIMPL comparison can sit immediately beside the relevant boundary on the map or in one short sentence below that paragraph: “CIMPL runs supporting middleware in Kubernetes. Azure SPI uses Azure data services alongside AKS, while Elasticsearch, Redis, and Airflow’s database remain in the cluster.” This preserves the actual comparison without returning to the API request or implying that every dependency became PaaS.

Remove the separate question-and-goal row from the visible lesson opening, or reduce it to one sentence where it contributes something the headline does not. Keep the learning question and outcomes in the content model for review. They need not all be displayed as separate pieces of interface text. This would be a deliberate revision to the current lesson grammar, not simply a wording correction.

The three ideas are worth keeping: the complete environment, partition versus shared resources, and the provider inside the service. Shorten their reasons and place the selected explanation immediately beside or above the map. Keep essential facts visible without opening evidence. The existing selected-claim follow-up should address this by replacing redundant map framing, rather than adding another explanatory block below the current long opening.

| Current Lesson 1 wording                                                                | Suggested treatment                                                                                                                                             |
| --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| “An OSDU data partition supplies the configuration and data context that services use.” | Cut from the claim reason. This audience already knows partitions; proceed to which Azure resources are partition-specific.                                     |
| “Use opendes, the example data partition, in the environment you named.”                | Replace with “The map uses `opendes` as its example partition.” A reading lesson should not imply that the learner has already created or named an environment. |
| “Partitions own data resources; the environment shares platform resources.”             | Short control: “Partition resources and shared resources.” Keep the complete ownership explanation beside the map.                                              |
| “There is no separate Azure adapter to find. The provider is in the pod.”               | “Each service image includes its Azure provider.” This teaches the placement directly.                                                                          |
| “Follow the boundaries”                                                                 | Use “The deployed stack,” or replace this heading with the selected idea.                                                                                       |
| “Running example: Follow a partition lookup →”                                          | Move the trace into optional detail, labeled “Example: a partition lookup.” It need not sit between the main ideas and their map.                               |
| “Carry forward” above “What you can now say”                                            | Remove “Carry forward.” One recap heading is sufficient.                                                                                                        |

Do not remove useful map boundaries or owner labels to achieve a word-count reduction. “Outside the stack,” “Outside AKS,” and “Per partition” teach the distinction the lesson exists to explain. Conversely, the resource group node does not need to say both “Your environment” and “One development and test environment” when the surrounding paragraph already establishes that context. Cut repeated framing before cutting technical labels.

There is also a specific interaction to change. Clicking the already-selected first claim opens the evidence drawer, even though the instruction says to select an idea to highlight it. The implementation treats selecting the current claim as an evidence request. A repeated selection should leave the same idea selected; the explicitly labeled evidence link should open evidence. This makes the controls predictable and avoids turning a reader’s attempt to inspect highlighting into an unexpected panel.[^2][^6]

**Lesson 2: use the lifecycle as the main interaction.**

Lesson 2 has three claim controls, six lifecycle stage controls, an expandable five-hop example, a Lesson focus/Explore map toggle, an evidence link, a Look closer link for each stage, clickable components, and Previous/Continue controls beneath the map. These are different ways to operate substantially the same visual. The six lifecycle stages are the clearest mechanism for explaining how the environment comes into being, so they should carry the interaction.[^3][^7][^10]

My preferred revision is to make the three claims concise explanatory statements rather than a second stage-selection system. Let the stage control update the map and the adjacent explanation. Retain one explicit evidence entry for the current stage and direct component inspection. This changes the “claim is always the primary interaction” rule for a lesson whose subject is a lifecycle; the consistency to preserve is that a visible control changes a visible explanation and map together.

If the current claim-first structure is retained, at minimum bring the selected claim into the map header, remove the alternate lifecycle hops, and remove the extra bottom navigation. Otherwise the reader is choosing among claims, moments, and hops without needing to understand why the interface offers all three. Calling them subordinate in the plan does not remove the decisions they create on the page.

The bottom Continue control exposes the problem particularly clearly. From “Assemble OSDU,” it advanced to “Use the stack” while leaving the page around scroll position 2,104. The new explanation’s heading was approximately 978 pixels above the viewport. The reader saw a changed lower part of the map and another Continue button, but the prose explaining the new stage was out of view.[^3][^10]

Remove this second set of lifecycle navigation controls and keep the stage selector with its current explanation. The existing sticky stage bar is a useful starting point, but its relationship to the stage explanation needs to remain clear while the map is in view. If a bottom control is retained, it must be explicitly labeled to move to the next stage’s explanation and actually bring that explanation into view. A silent update above the reader is not a satisfactory interpretation of “Continue.”

The optional “Before the lookup can answer” example should leave the main Lesson 2 surface. It duplicates the lifecycle as five alternative stops and forces a deployment lesson back into the API trace. The concrete sequence already exists: prepare access, create Azure resources, prepare AKS, assemble workloads, assess readiness, and remove the environment. It teaches the stack without a second storyline.

The readiness claim has accumulated too much verification detail. Its reason names the Git artifact revision, Kustomizations, HelmReleases, initialization Jobs, request scope, and the limits of `spi status --watch`. Those are useful facts, but they need not all appear inside one claim control. A shorter surface explanation can preserve the distinction: “Flux and initialization can continue after `spi up` returns. Check workload health and initialization with `spi status --watch`, then verify the API operation you need.” Keep the separate signal definitions in the readiness explanation and evidence.[^3][^5]

Other useful Lesson 2 edits are small but cumulative. Replace “How does one command become all of that?” with “How is the stack created, and when is it usable?” Replace “Wire this environment into the cluster” with “Prepare cluster configuration and identity.” Replace “mint the app-only caller” with “get a token for an authenticated readiness check.” Keep the distinction between observed provisioning time, overlap, and deadlines; those labels prevent a real operational misunderstanding and are not expendable verbosity.[^3][^11]

Assume the learner’s own subscription in the primary Try it path. The “Already have a stack? Connect to it” link and shared-environment wording can remain in an optional connection note, rather than becoming another shortcut across the lesson. This is also a useful place to distinguish reading the engineering workflow from needing an environment to perform its validation activity. The current Start card’s “so you need one” makes that prerequisite sound necessary just to learn.

**The lesson exit should stop offering side trips.**

Immediately before “What you can now say,” each Easy mistake callout offers “All 22, by theme.” In Lesson 2’s Prepare AKS state, “Key Vault and seed Secrets” opens Lesson 1 with a drawer. In Assemble OSDU, “Flux on the map” also goes back to Lesson 1 even though Flux is present in the current lifecycle map. These links interrupt the point at which the learner should be consolidating the current lesson.[^2][^3][^12]

Remove “All 22” from the callout. Keep the misconception and a short correction, with optional evidence available locally. Retarget a relevant component to the current map where possible; when the required component is absent, show a compact explanation in place instead of changing chapter. The full misconception collection remains reachable through the course index or reference navigation.

The Lesson 1 callout also repeats the partition request’s cache/Table Storage behavior while correcting “The stack is just AKS.” That runtime detail answers another question. Cut it from this callout and retain the correction about the cluster and surrounding Azure resources. The example-specific detail should live where that example is actually being explained.

Guide interactions should behave consistently. Native guides currently expand here, while the namespace poster opens the Field guides page. Provide an in-place preview or lightbox for the poster, with its notes, just as the video has an intentional viewing surface. The existence of a reference library does not mean each reference must navigate to it.

The new Try it summaries also need a presentation field separate from their detailed content. Lesson 2’s collapsed summary concatenates both variants, access labels, and long timing sentences. It is roughly 163 pixels tall on the phone before opening anything. A concise summary such as “Try it: bring up an environment · Azure charges apply” is enough to invite inspection; the expanded panel can explain active time, provisioning waits, prerequisites, and cleanup before any steps.[^3][^7]

Keep the browser-only alternative inside that panel, after the subscription path. Its existence is useful, but it need not compete in the collapsed heading when the assumed learner has Azure and GitHub. Do not compress the real run to “30 minutes” on the summary: the current copy identifies that as keyboard time and separately describes provisioning waits. Shortening must not turn a qualified timing statement into an apparent total.

**The strongest “AI tells” are repeated scaffolding and vague references.**

No phrase proves how a passage was authored. The editorial problem is visible without identifying an author: the site often describes its structure, announces what the reader will understand, and then repeats the same point under a new label. The accumulation feels templated because each section appears to have received its own complete introduction without an editing pass across the whole page.

| Pattern on these pages                                                                         | Why it adds friction                                                            | Better treatment                                                                            |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| “Start here,” audience premise, “Start,” “The path,” “The shape of the site,” “The mental map” | Several labels orient the reader to the document rather than teach the subject. | Keep the useful title or group label and remove its decorative companion.                   |
| “Six views in order, then…” repeated in two places                                             | The count and sequence are already visible in the index.                        | Use one short instruction only if it changes how to use the index.                          |
| “The assumptions that cost an afternoon”                                                       | Repeated rhetorical stakes replace a specific description.                      | “Common deployment and workflow mistakes,” or omit when the card title is clear.            |
| “The reference this site keeps beside…”                                                        | Explains the author’s comparison method.                                        | Define CIMPL and show the specific comparison in context.                                   |
| “Each moment shows who acts and what changes”                                                  | Narrates a visible interface convention.                                        | Use the space for the ownership distinction, or cut it.                                     |
| “The split,” “the fix,” “that digest,” “the borrowed slot” before their explanation            | The writer knows the story, but a new reader has not met these objects.         | Name provider ownership, a service change, an image digest, or a temporary test deployment. |
| “The word” above “SPI means three things here”                                                 | Adds no new category or meaning.                                                | Keep the useful heading alone.                                                              |
| “Documentation” above “Source documentation,” then “Go deeper in the documentation”            | Multiple labels announce the same destination.                                  | One source heading or disclosure.                                                           |
| “Before provisioning / Starting point”                                                         | Two labels describe one position in time.                                       | Keep “Before provisioning.”                                                                 |
| Source-check counts, recording origin, timestamp, duration, and title on a small play chip     | Metadata competes with the decision to play.                                    | Show a meaningful title and duration; keep corrections available in the player.             |

Some repetition is useful. Repeating a lesson’s important distinction in a short closing recap reinforces it. Repeating a boundary label on a large map helps when the opening paragraph is no longer visible. The editing test should be whether the words establish a new fact, clarify the current action, orient someone at the current location, or reinforce the actual lesson at its close. If they do none of those jobs, remove them.

**Revisions to the proposal.**

The proposal’s principle that the lesson works with the drawer closed remains strong. So do its rules for optional Try it, stable routes, concrete evidence, and keeping media playback from changing chapters. However, the publicly linked Revision 6 describes Start as needing “No content change,” treats navigation as settled, and gives every lesson a mandatory running example. Those decisions no longer fit the observed Start page or the clarified emphasis on stack and engineering.[^4]

Revise the grammar so it preserves learning responsibilities without displaying every content field. Each lesson should still have a clear subject, supporting explanation, visual evidence, a concise recap, and an obvious next lesson. It should not require a visible question row, visible goal row, labeled running example, and repeated framing when those elements add no distinct value. The lifecycle lesson should be allowed to use stages as its main control.

Replace the broad rule “nothing moves the page” with a clearer interaction rule: selecting an idea or stage produces a visible local result; opening media or evidence preserves the reading position; navigating to another lesson clearly identifies the destination. Deliberate navigation may move the page. A reader should not have to infer whether a play button, a claim, or a vague Continue link will do so.

The proposal also lags the implementation: Try it bands are now present on 01–03, and the drawer/readiness fixes described as next work have corresponding implemented changes. Update the current-state paragraphs before treating the document as a precise implementation brief. Keep the useful design rationale, but remove obsolete status descriptions rather than accumulating another chronological account at the top.

**Recommended order of work.**

| Priority | Change                                                                                                | Evidence of completion                                                                                                                          |
| -------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| First    | Open video in a modal; retain in-place audio                                                          | Closing playback returns to the same reading position and control on desktop and phone. No second introduction block is needed below the cards. |
| First    | Give Start one lesson index and remove its sidebar, trace invitation, and misleading Explore shortcut | A reader can identify the stack and engineering paths without choosing among several duplicate indexes.                                         |
| First    | Correct claim re-selection and lifecycle Continue behavior                                            | Selection consistently highlights; evidence is explicit; a changed lifecycle explanation is visible where its control is used.                  |
| Next     | Shorten the lesson openings and bring explanation beside the map                                      | The selected idea and its visual consequence can be understood together without automatic page movement.                                        |
| Next     | Remove cross-lesson exits from Easy mistake and standardize local references                          | Readers can finish each lesson and inspect its supporting material without an unannounced change of chapter.                                    |
| Next     | Trim repeated labels and shorten collapsed Try it summaries                                           | Compact controls retain meaningful activity, access, and cost information; detailed conditions remain available before execution.               |

The existing learner pilot can assess these changes without adding quizzes or completion tracking. Observe whether someone can describe the course’s purpose from Start, distinguish Watch from Listen, and reach Lesson 1 without considering several equivalent links. Within the lessons, watch whether a selection’s result is apparent and whether the reader knows when they are advancing the lifecycle versus leaving the lesson. Treat confusion about those actions as a layout finding, not a request for another explanatory paragraph.

**Sources**

[^1]: OSDU Azure SPI Fieldnotes, [Start here](https://danielscholl-osdu.github.io/osdu-spi-training/#start), observed 13 September 2026. Link inventory excludes the sidebar and masthead; the 43-link count covers the eight main Start sections, with the footer and collapsed source list counted separately. Dimensions refer to the reviewed viewport and default collapsed content, not every possible state.

[^2]: OSDU Azure SPI Fieldnotes, [Lesson 1: What is a stack?](https://danielscholl-osdu.github.io/osdu-spi-training/#running-stack), observed 13 September 2026. Opening, claim selection, evidence opening/closing, map placement, exit, optional material, and mobile layout.

[^3]: OSDU Azure SPI Fieldnotes, [Lesson 2: How it comes to life](https://danielscholl-osdu.github.io/osdu-spi-training/#bring-up), including [Prepare AKS](https://danielscholl-osdu.github.io/osdu-spi-training/#bring-up/bootstrap), [Assemble OSDU](https://danielscholl-osdu.github.io/osdu-spi-training/#bring-up/reconcile), and [Use the stack](https://danielscholl-osdu.github.io/osdu-spi-training/#bring-up/inspect), observed 13 September 2026.

[^4]: [Fieldnotes Layout Proposal, Revision 6](https://claude.ai/code/artifact/3a637ecc-f00a-450f-826f-f5b7e4401945), dated 13 September 2026, sections 1–9. The artifact’s stated revision and status were distinguished from the later live implementation.

[^5]: OSDU Azure SPI Fieldnotes, [chapter content at 21a02a8](https://github.com/danielscholl-osdu/osdu-spi-training/blob/21a02a89a70611dc7985365eca927eb6d7886b6e/src/content/chapters.js), Start and lessons 01–02: introductory copy, claims, examples, outcomes, and Try it content.

[^6]: OSDU Azure SPI Fieldnotes, [interaction implementation at 21a02a8](https://github.com/danielscholl-osdu/osdu-spi-training/blob/21a02a89a70611dc7985365eca927eb6d7886b6e/src/main.js), particularly lines 681–715 for claim re-selection and 747–754 for video scrolling and playback.

[^7]: OSDU Azure SPI Fieldnotes, [page renderers at 21a02a8](https://github.com/danielscholl-osdu/osdu-spi-training/blob/21a02a89a70611dc7985365eca927eb6d7886b6e/src/components/pages.js), Start sections, claims, recaps, guide previews, audio chips, and Try it summary generation.

[^8]: OSDU Azure SPI Fieldnotes, [reference figure renderers at 21a02a8](https://github.com/danielscholl-osdu/osdu-spi-training/blob/21a02a89a70611dc7985365eca927eb6d7886b6e/src/components/infographics.js), and [reference concepts](https://github.com/danielscholl-osdu/osdu-spi-training/blob/21a02a89a70611dc7985365eca927eb6d7886b6e/src/content/concepts.js), for the round-trip, SPI meanings, and six-place navigation.

[^9]: OSDU Azure SPI Fieldnotes, [page frame at 21a02a8](https://github.com/danielscholl-osdu/osdu-spi-training/blob/21a02a89a70611dc7985365eca927eb6d7886b6e/src/index.html), masthead, sidebar, lesson frame, and evidence surface.

[^10]: OSDU Azure SPI Fieldnotes, [lifecycle renderer at 21a02a8](https://github.com/danielscholl-osdu/osdu-spi-training/blob/21a02a89a70611dc7985365eca927eb6d7886b6e/src/components/architecture.js#L103), stage navigation, per-stage explanation, and bottom Previous/Continue controls. Continue behavior was also observed directly in the live page.

[^11]: OSDU Azure SPI Fieldnotes, [creation moments at 21a02a8](https://github.com/danielscholl-osdu/osdu-spi-training/blob/21a02a89a70611dc7985365eca927eb6d7886b6e/src/content/creation-moments.js), stage copy, owners, commands, and timing labels.

[^12]: OSDU Azure SPI Fieldnotes, [misconception content at 21a02a8](https://github.com/danielscholl-osdu/osdu-spi-training/blob/21a02a89a70611dc7985365eca927eb6d7886b6e/src/content/myths.js), with callout rendering in the page renderer and destinations verified in the live lesson states.
