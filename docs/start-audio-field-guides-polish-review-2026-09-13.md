# Start, Audio deep dives, and Visual field guides: polish review

The site now has a clear visual identity and a much stronger opening. Start is close to finished. Audio deep dives has a useful structure but needs a plainer editorial voice. Visual field guides contains valuable engineering reference material, but its length, repeated explanations, and a few diagrams that get ahead of the implementation make it harder to trust and use quickly.

The next pass should preserve the current page structure and visual direction while improving three things: accuracy at the point of reading, retrieval without losing one’s place, and language that explains the system without narrating how impressive or complicated it is.

This review covers the published pages at 1280 × 720 and 390 × 844, the supplied proposal, and the training source at `5b9741f`. The proposal still identifies itself as Revision 6; the published site has since changed its navigation and guide organization. Those later improvements are treated as the current design, not deviations to reverse. Findings are observations and editorial judgments, not results from a learner study. Audio coverage includes both episode pages, every marker summary and correction, selected transcript passages, and playback/navigation checks; it does not include listening to both complete recordings.[^1][^2][^3][^4][^5]

## The changes with the greatest payoff

| Priority | Change                                                                                        | Why it matters                                                                                                              |
| -------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| First    | Replace or revise the two implementation-ahead posters and correct contradictory summaries.   | A reference diagram should teach the right model without requiring the reader to reconcile it with a correction underneath. |
| First    | Fix the audio page’s marker description and preserve return position after visiting a lesson. | The current description promises the wrong action, and Back loses the reader’s place.                                       |
| Next     | Shorten the field-guide presentation and give the lesson groups an in-place way to expand.    | The collection is useful, but finding a fork reference should not require scrolling through the complete stack reference.   |
| Next     | Rewrite episode summaries and marker copy in the site’s own voice.                            | The remaining AI-like language is concentrated here, rather than in the new Start introduction.                             |
| Next     | Improve poster reading on phones and provide explicit text for visual states.                 | Enlarging a dense poster currently exposes a horizontally clipped image with small text.                                    |
| Last     | Make small Start copy and alignment refinements.                                              | Start no longer needs a structural redesign.                                                                                |

## What is working

The navy masthead, restrained page background, white panels, and consistent typography give the three pages a recognizable identity. The illustrations are small enough to support the subject and share a coherent gear motif. Keep this direction. Adding more decorative imagery would have less value than improving the material already present.

The two quiet resource links in the header are sufficient. Start, Audio, and Guides no longer carry a duplicate lesson rail. The phone header now fits: at a 390-pixel viewport, the document width is also 390 pixels. This resolves the previously observed masthead overflow. The icon-only treatment retains accessible names, although the tiny field-guide glyph could be more recognizable.[^1][^2][^3]

Start’s image-and-paragraph composition is a substantial improvement. The paragraphs explain the relationship among the deployed stack, provider code, and maintained forks. The three cards then give those ideas recognizable names and repository homes. That is useful reinforcement, provided the cards do not expand into a second introduction.

The video dialog now matches the intended interaction: Watch opens a temporary player with captions, and closing it pauses playback and restores focus to Watch. There is no need to move the video back into the reading flow. The short audio alternative also belongs here.

The audio page’s two long recordings are a sensible selection. Their durations, lesson coverage, artwork, and selected state make the choice understandable. The transcript is collapsed by default, its timestamps seek into the recording, and playback continues when following a lesson link. These are useful features worth preserving.

The best field guides answer practical engineering questions. Readiness distinguishes successful orchestration from usable APIs. Profiles distinguishes workload selection from infrastructure provisioning. Credentials explains why deleting a Secret is not a rotation procedure. These are reasons to return to the site after finishing the lessons—not merely attractive illustrations.[^3][^8]

## Start: keep the structure, remove a little friction

### The opening is now credible

The current first paragraph is direct:

> The Azure stack runs OSDU services alongside the resources they depend on. Inside each service, shared OSDU code calls an Azure provider through the Service Provider Interface (SPI).

Keep it. It names the system, places the provider inside the service, and explains the acronym in context. There is no benefit in rewriting it again simply to make it different.

The second paragraph is also substantially stronger than the earlier single sentence about “three parts.” The only small repetition is between keeping shared code current and bringing in those updates. If shortening is useful for layout, this version preserves the thought:

> Service forks maintain the Azure provider code and receive updates to shared code from upstream OSDU. Their workflows build service images and test changes against a running Azure stack.

The CIMPL paragraph could become:

> Where the Azure implementation differs from the open-source OSDU Community Implementation (CIMPL), the lessons explain the difference.

Keep CIMPL as a reference, not another prerequisite. Nothing here should imply that a learner must first read or deploy cimpl-stack. The existing link is enough for optional context.[^1]

“Machinery” can remain the central metaphor. It fits the artwork and the subject. Its effectiveness depends on avoiding a proliferation of additional metaphors in supporting copy: floors, lanes, seams, clocks, blindfolds, and playgrounds should not all be needed to explain one system.

### The cards need a few small edits

| Current wording                                                                                                                        | Suggested wording                                                                                                       | Reason                                                                                               |
| -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| “Bicep for the resources, the spi CLI to drive it, Flux for the workloads.”                                                            | “The spi CLI runs Bicep to provision Azure resources; Flux deploys the workloads.”                                      | Explains the relationship rather than presenting three shorthand labels.                             |
| “Inside every OSDU service, partition for example, the seam where common code calls a cloud provider.”                                 | “The interface through which shared OSDU code calls a cloud provider.”                                                  | Removes the awkward insertion and sentence fragment. Put the partition path in its own example line. |
| “The template that gives every service fork its sync, cascade, build, and validation workflows, so the Azure code stays maintainable.” | “The shared template supplies the workflows that sync upstream changes, build images, and validate the Azure provider.” | Avoids introducing “cascade” before the lessons explain it.                                          |
| “Where does shared code hand off to Azure?”                                                                                            | “Where does shared code call the Azure provider?”                                                                       | Names a code boundary rather than suggesting a network hop into Azure.                               |
| “Which assumptions do the docs contradict?”                                                                                            | “Which common assumptions cause problems?”                                                                              | Describes the learner’s reason to visit Lesson 07. The current question is about the documents.      |

The two-versus-five lesson-column balance is acceptable. Lesson 01 is clearly the starting point, and the numbering establishes order. Do not add filler cards or stretch the two stack lessons to fill the right column’s height.

At 390 pixels wide, Lesson 01 starts approximately 1,904 pixels down the page. That is a trade-off of the chosen introduction/media/concepts order, not evidence that the order must be reversed. First shorten the concept-card text and generous gaps. Avoid adding another floating Start button or another lesson index to compensate.

The six Go deeper cards now have a distinct role and no duplicate documentation accordion. Keep that arrangement. Remove phrases that merely certify where a link goes:

| Card                            | Suggested description                                     |
| ------------------------------- | --------------------------------------------------------- |
| Stack architecture              | “Azure resources, the spi CLI, and Flux.”                 |
| Design guides                   | “How the stack is built and operated.”                    |
| Decision register               | “Architecture decisions and their trade-offs.”            |
| Engineering-system architecture | “Service-fork branches, synchronization, and validation.” |
| CIMPL Stack architecture        | “The community implementation used for comparison.”       |
| Community partition provider    | “The community implementation of the partition service.”  |

“As the stack repository describes them” and “from its own documentation” add no information beyond the link and repository label. The community provider card is useful evidence, but “sits beside” is ambiguous when it links to a separate repository. Prefer the literal description.

## Audio deep dives: useful controls, a voice that needs restraint

### Correct the interaction promise

The subhead currently says:

> Keep exploring while it plays: every marker opens the matching lesson.

The timestamp/title button seeks and plays audio. A separate link opens a lesson or guide; several links lead to Start or the misconceptions page rather than an exact matching lesson. This is a functional description that should be corrected, not just stylistic polish.[^2]

Suggested subhead:

> Two conversations about the Azure stack and the workflows that maintain its service forks. Choose a chapter below to listen from that point.

The durations are already on the episode cards. “An hour on the stack, then an hour inside the fork” is therefore optional, and “then” needlessly suggests a required sequence.

Keep timestamps and titles as playback controls. Adding a small play glyph would clarify their action. Keep lesson links visually secondary and label destinations consistently, such as “Lesson 02: How it comes to life.” Do not make the entire marker card both a seek target and a navigation target.

### Preserve the reader’s position

Observed sequence: select the 15:15 stack marker, follow “Assemble OSDU,” then use browser Back. The recording keeps playing, but the audio page returns to scroll position zero. The reader has to find the marker again. Preserve the previous scroll position and, where appropriate, restore focus to the lesson link that was followed.

The persistent dock is useful while reading another part of the page or another lesson. On the audio page it appears even while the full player is visible, producing two pause buttons and two seek bars. Show the dock when the full player is out of view, and continue to use it on other pages. This reduces competing controls without removing capability.[^2][^6]

### Let the episode cards explain the benefit

The fork summary currently lists “generated branches, labels as state, the meta commit, the Maven trap, the pull_request_target lesson, and the AI fallback that hid its own failure.” It reads like notes prepared for the author. A learner cannot yet use that list to decide whether to listen.

Suggested card copy:

**How the Azure stack is built and run**

> Provisioning, Flux, identity, and the shared environment used to test service changes.

**How service forks stay current**

> How upstream changes enter a fork, how ownership is preserved, and how builds and tests prepare a change for review.

These titles also balance better on desktop and phone. The original generated titles can remain in the provenance line. Keep the NotebookLM disclosure, but shorten the recurring instruction to “Corrections appear beside the relevant chapters.” “Open the notebook” can move beside the source information; it is not part of the playback task.

### Rewrite the summaries independently of the recording

The site-authored marker descriptions can be accurate, plain summaries even when the recording is more dramatic. They do not need to reproduce its rhetoric.

| Current wording                                                          | Problem                                                        | Suggested direction                                                                                                 |
| ------------------------------------------------------------------------ | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| “Controllers and operators own what they manage. You own the decisions.” | Circular and unspecific.                                       | “Controllers keep workloads healthy; operators choose when to update, diagnose, or remove the environment.”         |
| “Flux is still assembling half the system.”                              | “Half” reads as a measurement without a defined basis.         | “Flux may still be deploying workloads and running initialization Jobs.”                                            |
| “State lives in Azure PaaS, not in the cluster.”                         | Too broad; the next marker describes in-cluster middleware.    | “The Azure provider uses Cosmos DB, Storage, and Service Bus. Elasticsearch, Redis, and PostgreSQL run inside AKS.” |
| “The Azure-only bet”                                                     | Editorial drama instead of a subject.                          | “Why the provider uses Azure PaaS.”                                                                                 |
| “Memory for an amnesiac runner”                                          | A metaphor makes an operational reference harder to scan.      | “How GitHub records sync progress.”                                                                                 |
| “The Dockerfile that rotted”                                             | Distracting tone.                                              | “Why the template supplies the Dockerfile.”                                                                         |
| “The forks … own only their configuration.”                              | Conflicts with the course’s central ownership lesson.          | “The template supplies engineering workflows; each fork owns its Azure provider code, tests, and configuration.”    |
| “A snapshot fork stops being OSDU.”                                      | Turns eventual divergence into an immediate categorical claim. | “A fork that stops receiving upstream changes gradually diverges from the community implementation.”                |
| “Hard-coding values … goes stale within a week.”                         | Unnecessary exact-sounding timeframe.                          | “Copied environment values become stale when the environment changes.”                                              |
| “A pin … then restores itself.”                                          | Gives a data record agency and implies guaranteed cleanup.     | “The workflow restores the canonical image if it still owns the pin.”                                               |

The 33:55 stack note visibly starts “Source check. Source check —”. Remove the duplicate prefix and the closing instruction to follow the already adjacent link. Keep the substantive distinction between Azure identity and middleware passwords.[^2][^7][^8]

In the fork’s 54:28 marker, the main summary still promises “an unconditional restore,” then the correction qualifies it. Make the site summary correct in its own right. The note can explain that the recording uses broader language. Likewise, add a reviewed month to changing claims about upstream removals, indexer-queue support, and capabilities that are not yet wired.

### The recordings themselves are the strongest remaining AI tell

This is an editorial judgment about the language, not a method of detecting authorship. The opening transcripts contain repeated agreement, exaggerated stakes, elaborate analogies, and praise of the source material: “absolute masterclass,” “brutal honesty,” “impenetrable wall,” “ultimate nightmare,” and “which is wild to think about.” Those phrases spend attention without teaching Azure SPI.[^9]

The stack recording spends approximately its first six minutes on why OSDU exists before the 6:08 provider marker. The fork recording also revisits the energy-data problem before reaching the provider model at 5:31 and ownership change at 6:16. That is a poor fit for an audience that already knows OSDU, especially when the two episodes are presented together.

A future recording should begin with an engineering question: what runs in the Azure environment, or how a service fork accepts shared-code changes while preserving its provider. Keep concrete failures and actual trade-offs; reduce applause, mock surprise, and metaphors about the community. A useful incident does not need to be called a nightmare.

Do not silently rewrite the transcript to make an unchanged recording sound better. Keep it faithful; substantive narration corrections require an approved replacement script and a new recording. In the meantime, improve the summaries and retain accurate source notes. The Start video has the same longer-term issue: its local dialog is good UX, but its notes still correct “proprietary” and already-completed upstream removal. The most prominent introduction should eventually need fewer corrections, not just a more polished player.[^2][^5]

## Visual field guides: valuable content, too much presentation around it

### Make it a reference collection people can find their way through

The page contains 16 items: two course maps, eight native guides, and six posters. At the reviewed desktop size it is approximately 12,610 pixels tall and contains 130 links in the main content. At 390 pixels wide it is approximately 20,364 pixels tall. These are observations, not performance scores; many links are legitimate sources. They explain why the page can feel harder to use than its orderly headings suggest.[^3]

The new lesson grouping is sensible. Preserve it. The problem is that a returning reader must pass two large course maps and the full stack collection before reaching the fork material. The fork group begins around 9,000 pixels down on desktop and 14,500 on phone.

First remove duplicate descriptions, repetitive takeaways, and source lists that dominate the caption. Then consider five in-place disclosures using the existing lesson-group headings. A reader can open “The fork · Lessons 04 and 05” without navigating away or jumping through thousands of pixels. A direct guide link should automatically reveal its group and land on the requested guide. This would be one retrieval mechanism, not a new sidebar plus another table of contents.

There is a trade-off: a disclosure adds a click. It earns that click if it replaces long scrolling and preserves context. If the page remains fully expanded, shorten the two course maps or make that introductory group optional. Do not add a large new navigation system before first reducing the content it navigates.

Suggested page subhead:

> Reference diagrams for the Azure stack, service providers, and fork workflows, grouped by lesson.

The current first paragraph describes the page’s construction and announces discrepancies between posters and documentation. That is not a compelling first encounter with a reference collection.

### Give every guide one distinct job

| Guide                                                         | Value and recommendation                                                                                                                                                                                                                     |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Down the stack, out to the fork, back in through the lock** | Keep as an optional course overview. It explains how runtime and source connect, but its API-lookup opening should not become the main framing of the collection. Shorten the title to **How the stack and fork connect**.                   |
| **Six places, from the outside in**                           | Keep. This is the stronger architecture orientation because it distinguishes resources beside AKS from things inside it and places source outside the stack. Shorten the long introductory paragraph.                                        |
| **Where the familiar things live**                            | Keep prominently. It provides the bridge from known OSDU concepts to Azure implementation choices. Inline explanations work well. Correct the location/scope issues below.                                                                   |
| **Four owners, four boundaries**                              | Keep. It helps readers decide which system controls a change. Tighten the owner labels and replace the abstract final thesis with a concrete distinction.                                                                                    |
| **One spi up, on the clock**                                  | Keep the concurrency explanation, revise the chart. It visually assigns precise positions to steps whose durations are not measured. A qualitative sequence with separately labeled observed durations would be more trustworthy.            |
| **Readiness signals and what they prove**                     | Keep prominently. This is a strong troubleshooting reference. A compact Signal / What it proves / Check table could use less height while preserving the distinctions.                                                                       |
| **Three profiles, one Azure estate**                          | Keep prominently. It corrects a consequential misconception. Rename to **What each deployment profile includes**, and explicitly label included/excluded layers.                                                                             |
| **Namespaces and the order things come up**                   | Keep. The namespaces, dependency ordering, and diagnosis commands give it a useful operational shape. Shorten to **Namespaces and rollout order** and reduce repeated warnings.                                                              |
| **Where every credential lives, and what spi down forgets**   | Keep prominently. The seed/copies/Key Vault distinction and teardown boundary are valuable. Rename to **Credentials and what survives teardown**; state the seed’s lifetime directly.                                                        |
| **Identity is two different problems**                        | Keep. It distinguishes OSDU caller identity from a pod’s Azure identity. Prefer **Caller identity and workload identity** and show the inbound path first to follow the reader’s request direction.                                          |
| **One request, end to end**                                   | Keep only with a clearer identity-troubleshooting purpose and revised title. It follows a storage-record read, not the course’s partition lookup. It adds value when explaining failure boundaries; a second generic request story does not. |
| **The Contribution Chain**                                    | Keep. It answers where a contribution belongs and how community, Microsoft, and customer changes travel. This is one of the strongest supplied posters. Trim the text beside it and remove the empty assurance that it matches its source.   |
| **The fork’s recurring work, on its own clocks**              | Keep. The schedule comparison is useful. Rename to **When fork workflows run** and remove references to what causes “moments in the day view.”                                                                                               |
| **The labels are the state machine**                          | Keep. It tells an engineer how to interpret and recover a sync. Correct the label count and overstatement about where state is stored.                                                                                                       |
| **Borrow, Prove, Restore**                                    | Keep the central transaction, replace or revise this artifact. Its contract and gate details include capabilities the current lane does not enforce. Focus the learner version on the implemented image-test-and-restore sequence.           |
| **The Backing Environment**                                   | Consolidate or replace for the learner collection. It repeats the borrow/prove/restore sequence and presents a broad target operating model. Its most distinctive useful content is versioning and what environment maintenance changes.     |

The collection does not need to shrink to only a handful of subjects. It needs clearer reasons to open each subject, less repetition around the image, and a stronger distinction between current operational reference and future design material.

### Correct these content issues

**A candidate tag is labeled as a digest.** The course round-trip map places `ghcr.io/…:sha-*` under “A candidate digest.” That is a tag-shaped reference. Show `ghcr.io/…@sha256:…` when teaching the immutable digest that is pinned and verified. The distinction matters to the proof workflow.[^3][^7]

**The familiar-concepts guide mixes storage location and the job that writes it.** The Schemas row labels its location “AKS · osdu namespace,” then says schemas are loaded into the primary partition’s system database. Say that the loader Job runs in `osdu` and the loaded schema data lives in the system database. The credentials row likewise needs to distinguish Azure identity from Kubernetes Secrets; only the Redis and Elasticsearch values are mirrored to Key Vault, not every middleware credential.[^3][^8]

**The owner labels are mechanically assembled.** “Controllers and operators owns The things they manage” is both grammatically awkward and circular. “You, the operator owns The decisions” has the same problem. Use “Controllers and operators” followed by “Workload health,” and “You” followed by “Updates, diagnosis, and teardown.” The actual scope paragraph can carry the precision.

**The label guide claims four labels while displaying six distinct label names.** It shows `upstream-sync`, `human-required`, `cascade-active`, `validated`, `cascade-blocked`, and `cascade-failed`. Drop the count. Also remove “nothing else remembers”: the system records information in tracking issues and repository variables as well. Describe the labels as visible progress and recovery signals.[^3][^10]

**The request poster needs its example named before the reader studies it.** Its main title does not say storage, and the clarification appears under “Read it with these checks.” Use **A storage read: identity and authorization checks**. Replace “Cosmos DB row” with “stored record in Cosmos DB.” The first diagram hop should include the relevant OSDU request headers, grounded in the API contract; the absence of a header explanation in one stack document is not a reason to omit it from a purported end-to-end example.

Keep the three distinct checks: caller authentication, OSDU authorization, and Azure access. Make the visual a request path with an Azure identity exchange alongside it, rather than implying the client’s bearer token travels onward into Cosmos. Replace “Entra is the only data plane” with “Azure data services use Entra authentication.” Move the asynchronous indexer-queue caveat to its relevant event-path reference; it is not part of a storage read.[^3]

**The two seam posters teach future behavior with current-tense confidence.** In September 2026, the reviewed ADR explicitly says Key Vault bindings are not materialized by the lane and descriptor loads, groups, and dependencies are not checked before borrowing. The Borrow poster nevertheless diagrams Key Vault resolution and a gate that checks seeding and dependencies. The lifecycle guide explicitly marks reset/teardown workflows, the backstop workflow step, and some onboarding work as unbuilt. The Backing poster visually emphasizes the Saturday rebuild and source-policy behavior.[^7][^11][^12]

The Backing poster does contain a target-lifecycle qualification in its introduction, and both page captions disclose limitations. That is better than no qualification, but the visual claims remain stronger than the qualification. An image opened alone in the lightbox does not include the page’s corrective caption. Preserve supplied originals as references; create current learner-facing versions or remove these two from the main collection until they can stand on their own.

**The timing chart is more precise than its evidence.** Its minute axis places unmeasured ordered steps in narrow timed slots and gives the CLI-exit line a specific visual position. The legend distinguishes those categories, which is good, but the geometry still invites a measured-Gantt reading. Use an untimed sequence for the ordering and separately annotate the observed AKS and Flux component durations. Keep CLI exit, continuing reconciliation, and the 150/155-minute deadline values visibly different concepts.[^3][^13]

### Reduce the text surrounding each poster

The current poster format includes a long provenance kicker, title, summary, four takeaways, a second list of checks, several lesson links, and multiple source links. Much of that repeats text already inside the image. At desktop width, the narrow caption column can occupy substantially more height than the adjacent poster.

A leaner presentation would contain the title, a sentence naming when to use it, the image, one essential scope note when needed, one lesson destination, and sources in a quiet disclosure. Keep a structured text equivalent for accessibility, but do not force every reader through both that equivalent and the entire poster as a single uninterrupted sequence.

Cut “Take from it” and “Read it with these checks” as mandatory headings. A real correction should be specific and prominent; an assurance such as “This poster matches the fork-tiers documentation” can be deleted. Long “Built for this site from…” kickers belong with the source information.

The recurring count formulas are another AI-like pattern: “Three contracts, one credentialed job, five steps”; “Three credential lanes, one persistent seed, and two teardowns with different floors”; “Three owners · one ladder … two switches.” A count is useful when choosing among options. Here it often adds a second summary without explaining the subject. Replace it with the operational point.

### Make the mobile reference usable

The page has no overall horizontal overflow at 390 pixels, which is good. The poster dialog also closes correctly and returns focus to the opener. However, the tested Borrow poster renders as a 700-pixel-wide image in a roughly 374-pixel dialog. Sideways panning works, but only part of the diagram is visible, and its body text remains small. “At full size” overpromises this experience.[^3][^6]

Use “Enlarge diagram” as the action. A diagram viewer should provide a clear way to fit the whole image and zoom into a section, retaining the close control. Where the content is principally a comparison or a list, a native responsive guide is a better phone experience than a dense image. Keep image text available as real text rather than relying on title-only alternative text.

The profile chart has a related issue: included and excluded layers have the same text in the accessibility tree; their distinction is styling. Add explicit Included / Not deployed labels or equivalent accessible text. Readers should not have to infer state solely from color or fading. The timeline’s alternative text should also convey its key timing distinctions rather than only naming the picture.

## A practical final polish pass

Work in three bounded passes. First, correct current-versus-planned claims, digest terminology, credential scope, label wording, and audio behavior descriptions. These affect understanding and trust. Second, repair return position, simplify the visible player controls, and improve guide retrieval and mobile reading. Third, trim repeated prose and replace the most conspicuous generated narration with scripts written for this audience.

For validation, give a few OSDU engineers realistic retrieval tasks: find which profile includes middleware; determine what a successful CLI exit proves; locate where a provider fix belongs; and explain what happens if a test runner disappears before restore. Observe whether they find the reference and interpret it correctly. These are product-review tasks, not learner quizzes or completion requirements.

Start should receive the smallest share of the next change. Its current opening, media placement, lesson hierarchy, and resource area are working. The greater opportunity is to make the supplements as direct and dependable as that first page.

## Sources

[^1]: [Published Start page](https://danielscholl-osdu.github.io/osdu-spi-training/#start), reviewed on 13 September 2026.

[^2]: [Published Audio deep dives](https://danielscholl-osdu.github.io/osdu-spi-training/#listen), including the stack and fork selections and all marker summaries.

[^3]: [Published Visual field guides](https://danielscholl-osdu.github.io/osdu-spi-training/#field-guides), including all 16 items and all six poster images.

[^4]: [Supplied design proposal](https://claude.ai/code/artifact/3a637ecc-f00a-450f-826f-f5b7e4401945?via=banner_open), accessed in the browser; its displayed revision is 6.

[^5]: Training implementation at `5b9741f`: [chapter copy](https://github.com/danielscholl-osdu/osdu-spi-training/blob/5b9741f/src/content/chapters.js), [page renderers](https://github.com/danielscholl-osdu/osdu-spi-training/blob/5b9741f/src/components/pages.js), [audio metadata and source notes](https://github.com/danielscholl-osdu/osdu-spi-training/blob/5b9741f/src/content/audio.js), and [poster/guide definitions](https://github.com/danielscholl-osdu/osdu-spi-training/blob/5b9741f/src/content/posters.js).

[^6]: Training interaction implementation at `5b9741f`: [player](https://github.com/danielscholl-osdu/osdu-spi-training/blob/5b9741f/src/components/player.js), [navigation and media dialogs](https://github.com/danielscholl-osdu/osdu-spi-training/blob/5b9741f/src/main.js), and [page styles](https://github.com/danielscholl-osdu/osdu-spi-training/blob/5b9741f/src/styles/pages.css). Browser observations are reported separately from source-derived explanations.

[^7]: Azure/osdu-spi, [ADR-041: Borrow, Prove, Restore Lane](https://github.com/Azure/osdu-spi/blob/080f0b8289d6fc5519aa858531547e23287a280d/doc/src/adr/041-borrow-prove-restore-lane.md), especially “Not yet wired.”

[^8]: Azure/osdu-spi-stack, [Secret lifecycle](https://github.com/Azure/osdu-spi-stack/blob/dc2c95638ded6459538085cfdb2ada46b692c27b/docs/design/secret-lifecycle.md).

[^9]: Published transcripts represented by [stack transcript](https://github.com/danielscholl-osdu/osdu-spi-training/blob/5b9741f/src/content/transcripts/stack.js) and [fork transcript](https://github.com/danielscholl-osdu/osdu-spi-training/blob/5b9741f/src/content/transcripts/branches.js), sampled at the openings and relevant marker passages.

[^10]: Azure/osdu-spi, [Cascade monitor pattern](https://github.com/Azure/osdu-spi/blob/080f0b8289d6fc5519aa858531547e23287a280d/doc/src/adr/019-cascade-monitor-pattern.md), plus [three-branch strategy](https://github.com/Azure/osdu-spi/blob/080f0b8289d6fc5519aa858531547e23287a280d/doc/src/architecture/three_branch_strategy.md) and [fork tiers](https://github.com/Azure/osdu-spi/blob/080f0b8289d6fc5519aa858531547e23287a280d/doc/src/architecture/fork_tiers.md).

[^11]: Azure/osdu-spi-stack, [Shared environment lifecycle](https://github.com/Azure/osdu-spi-stack/blob/dc2c95638ded6459538085cfdb2ada46b692c27b/docs/design/environment-lifecycle.md), status and implementation sequencing.

[^12]: Azure/osdu-spi-stack, [Fork deployment contract](https://github.com/Azure/osdu-spi-stack/blob/dc2c95638ded6459538085cfdb2ada46b692c27b/docs/design/fork-deployment.md), implemented trust and pin behavior versus planned source policy and workflow backstop.

[^13]: Training [native guide implementation](https://github.com/danielscholl-osdu/osdu-spi-training/blob/5b9741f/src/components/infographics.js) and Azure/osdu-spi-stack [Deployment and teardown](https://github.com/Azure/osdu-spi-stack/blob/dc2c95638ded6459538085cfdb2ada46b692c27b/docs/design/deployment-lifecycle.md).
