# A software factory builds a training site

**Microsoft Hackathon 2026. One person, four days, seven AI systems, one interactive training site.**

This is the case study half of the project. The other half is the site itself: [OSDU Azure SPI Fieldnotes](https://danielscholl-osdu.github.io/osdu-spi-training/), an interactive course that teaches senior OSDU engineers how the Azure SPI Stack and its fork engineering system work. The site is the deliverable. The question behind the hackathon was whether a single engineer, acting as a manager rather than a coder, could get a product of that size built and reviewed by a factory of AI agents spanning Claude, OpenAI, and GitHub Copilot, with a durable shared record that survived every session boundary.

The short answer is yes, with costs that are easy to underestimate and a division of labour that only became clear halfway through. What follows is how it went, drawn from the session transcripts, the issue tracker, the git history, and the run ledger of the workflow engine. Every number and quotation below is taken from those records; the [numbers appendix](by-the-numbers.md) lists them with their sources.

## What was built, in one paragraph

The site has seven lessons that walk an engineer down the Azure stack, into one service's provider code, out to the service fork that owns that code, and back in through the image lock that deploys it. Each lesson is a set of claims over an inspectable architecture map, with an evidence drawer, one easy mistake, an optional hands-on activity, and a shelf of deeper material. Around the lessons sit two hour-long generated audio deep dives with chapter markers and source-check notes, a one-minute video, eight field guides drawn as SVG, and six posters. The content is held to a written standard: every explanation must name an artifact, command, resource, number, or failure mode that can be checked against the source repositories, and a content test cross-checks every route, marker, and component before a build can deploy. The result is 196 commits, 24 pull requests, and 83 deployments to GitHub Pages without one failed check.

## The factory

The word "factory" is the owner's. What it meant in practice was one orchestrating session that never wrote most of the code itself, a set of specialised agents it could hand work to, a review layer that was deliberately drawn from different vendors, and two pieces of shared state that every agent could read: an issue tracker and a design-intent document.

![The factory: owner, orchestrator, workers, reviewers, and shared state](factory-diagram.png)

The drawing is kept as an editable Excalidraw file beside the image (`factory-diagram.excalidraw`). The numbers on it come from the [appendix](by-the-numbers.md).

### The cast

| Agent              | Vendor and model                                                                                   | Reached through                     | Role                                                                                                     | Volume                                     |
| ------------------ | -------------------------------------------------------------------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| Orchestrator       | Anthropic Claude Fable 5.1 (Opus 5 in the first two days)                                          | Claude Code terminal                | Planning, briefing, verification, merging, the written record                                            | 13 sessions, 2,652 turns, 3,087 tool calls |
| Subagents          | Claude, spawned from the orchestrator                                                              | Agent tool                          | Parallel posters, fact-checks, adversarial reviews, bounded implementations in worktrees                 | 27 spawns, 829 turns                       |
| Peer sessions      | Claude Code, separate terminals                                                                    | Session messaging                   | An independent fact-check reviewer; a Start page rebuild; fixes to the Keelson beads rib                 | 3 sessions                                 |
| Keelson beads-work | OpenAI GPT-5.6 and GPT-6 Astra, Claude Sonnet 5 and Haiku 4.5, through the GitHub Copilot provider | Keelson MCP server                  | Plan, approval gate, implementation, three-lane review, draft PR, tracker write-back                     | 19 runs, 13 merged PRs                     |
| Codex              | OpenAI GPT-6 Astra (medium effort)                                                                 | Codex CLI and the ChatGPT Codex app | Usability, editorial, and source-checked reviews on `codex/review-*` branches; one lesson implementation | 15 review rounds, 1 implementation         |
| Astra              | OpenAI GPT-6 Astra                                                                                 | ChatGPT                             | Design direction: the story, map, inspector model; the lesson grammar; the lesson footer                 | 8 conversations                            |
| Copilot reviewer   | GitHub Copilot pull request review                                                                 | GitHub                              | Automatic review of every Keelson PR                                                                     | 13 reviews                                 |
| NotebookLM         | Google Gemini                                                                                      | NotebookLM                          | Two deep-dive conversations, a brief, and a video from written sources                                   | 5 generations                              |
| Gemini image model | Google Gemini 2.5 Flash Image                                                                      | API                                 | Hero strip, episode badges, drafting-sheet strip                                                         | 6 images                                   |
| beads              | `bd`, a Dolt-backed issue tracker                                                                  | CLI and the Keelson beads rib       | Plan of record across sessions, agents, and workflow runs                                                | 81 issues, 321 commands                    |
| Tracker artifact   | A Claude artifact page                                                                             | Claude Code Artifact tool           | Design intent, decisions, and a changelog that reviewers could target by revision                        | 38 publishes                               |

The owner sat above all of it. Across the four days they sent about 150 messages to the orchestrator. The orchestrator produced 2,652 turns in reply. That ratio, roughly one human message for every eighteen agent turns, is the first thing to understand about how the work was distributed.

## How a piece of work moved

By Saturday afternoon the factory had a fixed shape. A review found a problem. The orchestrator turned the finding into a bead with checkable acceptance criteria. A tier decision followed: a multi-file behaviour change went to a Keelson beads-work run, a bounded content change went to a subagent in a worktree, and a one-file fix was made directly. A Keelson run planned, paused for approval, implemented, reviewed itself, and opened a draft pull request. The orchestrator then opened the site in Chrome, took screenshots at 1440 and 390 pixels, probed the DOM for the invariants the bead named, made a fix pass on the branch, merged it, closed the bead with the commit and the measurements as the reason, and republished the tracker.

```mermaid
sequenceDiagram
    autonumber
    participant R as Reviewer (Codex, Astra, subagent)
    participant O as Owner
    participant C as Orchestrator (Claude)
    participant B as beads
    participant K as Keelson beads-work
    participant G as GitHub
    participant T as Tracker artifact

    R->>O: review findings
    O->>C: pasted with a sentence of direction
    C->>C: verify the concrete defects against the code
    C->>B: bd create with acceptance criteria
    C->>K: workflow_run beads-work fn-xxx
    K->>B: claim the bead
    K->>K: classify, investigate, plan (gpt-6-astra)
    K-->>C: plan awaiting approval
    C->>K: approve with corrections folded in
    K->>K: implement in a worktree (gpt-5.6-sol)
    K->>K: correctness, conventions, coverage lanes (gpt-5.6-terra)
    K->>K: triage, fix, re-review
    K->>G: push branch, open draft PR
    G->>G: Copilot reviews the PR
    K->>B: note: PR opened, claim retained until merge
    K-->>C: run report
    C->>G: browser verification, fix pass, merge
    C->>B: bd close with commit and measurements
    C->>T: republish the tracker revision
```

The approval gate is where the owner's judgement entered a run. It was never a rubber stamp. Every one of the thirteen successful runs was approved with corrections, and the corrections were specific. On the Go deeper shelf run: "No buttons inside a summary. Do not place the play chips inside the Hear it explained summary. A summary is already a button; nested interactive content is an accessibility problem." On the lesson 01 run: "Never run bd close on any bead, including fn-bhr and fn-7vh at the end of Task 7; the merge closes them." On the Try it run: "Drop cost: free|billable and costConditions. Use variant.access, exactly one of: browser only, workstation setup, public GitHub repository, Azure resources billed separately." The run then carried those corrections into implementation without pausing again.

## Four days

```mermaid
xychart-beta
    title "Commits per day"
    x-axis ["Thu 11", "Fri 12", "Sat 13", "Sun 14"]
    y-axis "commits" 0 --> 160
    bar [9, 19, 152, 16]
```

**Thursday evening.** The project began as a review request, not a build request. The owner had a five-file prototype and asked for "detailed feedback in areas of design, content, accuracy, creativity, engagement." The orchestrator ran it as a workflow: ten review lenses (accuracy of the stack claims, accuracy of the SPI claims, pedagogy, narrative, visual, accessibility, engagement, extensibility, front-end code, gaps), each verified by a second agent, then an editor's synthesis and a completeness critic. Ninety-one findings survived. The verdict line was "The map is right. The panels are empty." The one authoring rule it proposed, that every explanation must carry a fact you could only know from having run the system, became the first line of the content standard and never left it. The repository was initialised at 17:28 and the concept review was committed into it at the owner's request.

**Friday.** Media day. The owner brought a NotebookLM deep dive, two infographics, and a brief: "The reality is that just reading documentation is very hard. Diagrams, infographics, audio etc all can be used to help supplement the learning process and really capture the imagination of the engineer." Three poster subagents ran in parallel, each briefed with the infographic skill, and each came back having corrected the orchestrator's brief against the stack documentation. The site went public on GitHub Pages at 20:02 Thursday night. On Friday morning the first Codex review arrived, pasted as a prompt. It found a real routing defect in inline poster links and a factual error about what the partition provider reads. By afternoon the owner wanted the site expanded from the stack alone to the fork engineering system as well, and handed over a 103-page guide, two more recordings, and two infographics. Two subagents outlined the guide and mapped both repositories' documentation; a plan was written and agreed; the fork, day, and seam views were built on a branch and merged through the first pull requests. Late Friday the owner asked a second Claude session to fact-check the whole site "looking for things that read as AI slop". It returned 21 findings, including that the running example's cache fallback had been written upstream, not in the fork, and that the image path shown on the site was wrong.

Friday also held the day's most expensive churn. The orientation recording was regenerated four times in three hours as the owner tried to get a conversational introduction that framed the site without repeating the deep dives. The last generation came from a source document the orchestrator wrote specifically for NotebookLM after the owner shared the exact prompt they had been using. Two days later the owner cut the orientation and the brief from the site entirely: "if someone started there which naturally they would they wouldn't get to the content we really want them to listen to."

**Saturday.** Everything changed at 11:03, when the owner wrote: "Perhaps we use beads to coordinate our work. We have access to keelson, you have access to a coding agent peer. Your goal is to orchestrate work and get the work accomplished as you see fit best but control your context and try to delegate, review and orchestrate/coordinate what your plan ends up being." Before that message the project had a git history and a set of markdown iteration records. After it, the project had a tracker, a design-intent document, a workflow engine, and a browser the orchestrator could drive itself.

The first hour was rough. Keelson refused connections; the owner restarted it twice. The beads-work workflow was not installed on the project yet ("yea sorry I guess I haven't fixed the beads-work workflow yet"). The Chrome extension paired on the fourth attempt. A headless Chrome launched by a review agent hung, and the owner noticed before the orchestrator did: "I think the agent is waiting on a failed chrome process." Meanwhile lesson 01 was rebuilt around the new claims-first design by Codex, in parallel with a Claude agent doing the same brief in a separate worktree, because the owner had doubts: "From what I know gpt-6-astra code can often be not very good and it makes a lot of test." The orchestrator's verdict: "Codex is fine for a first draft against a precise spec; the Fable agent was the stronger finisher." A review agent had found ten defects in Codex's draft that its own checks had not; the Fable agent fixed nine cleanly on the first pass. Lesson 01 merged as PR #4 at 11:51.

By 12:38 Keelson was running the beads-work workflow, and the owner set the pace: "This would offload and do the work in a worktree and I think you could get maybe 2 or 3 going in parallel." Lessons 02 and 03 went out as the first two runs at 12:43. Between 14:06 and 15:32 seven more runs produced PRs #7 through #13: the Redis and Table Storage boundary fix, the readiness-signals correction, the three drawer defects, claim-specific evidence, the learner-facing copy edit, the CIMPL comparison, and the Try it band. Sixty-seven commits landed in those two hours. At 13:12 the owner gave the verdict that named the project: "thats good feedback, the software factory is working good. It takes a little longer but is more involved in advesarial reveiws and fixes as part of the workflow."

```mermaid
gantt
    title Keelson beads-work runs, Saturday 13 September (CDT)
    dateFormat YYYY-MM-DD HH:mm
    axisFormat %H:%M
    section Lessons 02 and 03
    fn-cca lesson 02 claims (PR 5)        :2026-09-13 12:43, 2026-09-13 13:18
    fn-bye lesson 03 claims (PR 6)        :2026-09-13 12:43, 2026-09-13 13:15
    section Round five follow-ups
    fn-kbc Redis vs Table Storage (PR 7)  :2026-09-13 14:06, 2026-09-13 14:22
    fn-loo readiness signals (PR 8)       :2026-09-13 14:07, 2026-09-13 14:28
    fn-0wv three drawer defects (PR 9)    :2026-09-13 14:08, 2026-09-13 14:36
    fn-p2j claim-specific evidence (PR 10):2026-09-13 14:31, 2026-09-13 14:59
    fn-e7u learner-facing copy (PR 11)    :2026-09-13 14:32, 2026-09-13 15:02
    fn-jy3 CIMPL comparison (PR 12)       :2026-09-13 15:03, 2026-09-13 15:25
    fn-u9u Try it band (PR 13)            :2026-09-13 15:04, 2026-09-13 15:30
    section Reading-flow round
    fn-bhr lesson 01 flow (PR 14)         :2026-09-13 17:06, 2026-09-13 17:29
    section Learning design review
    fn-tbt selectors in workspace (PR 15) :2026-09-13 22:22, 2026-09-13 22:55
    fn-j9v quiet Go deeper, field check (PR 16):2026-09-13 22:58, 2026-09-13 23:24
```

The afternoon and evening belonged to the reviewers and the owner's eye. Codex reviewed lessons 01 to 03 as implemented (seven follow-ups, all accepted), reviewed the Try it plan before any recipe was written (seven operational corrections, such as the dry run needing Azure access after all), and recommended naming CIMPL as the reference implementation. Astra reviewed the reading flow of Start and the first two lessons. Then, from 18:00 to just after midnight, the owner and the orchestrator worked the landing page together in short turns: the headline ("Maybe something like Understand the Azure SPI Machinery"), the order of the three meanings of SPI, a hero image generated with the Gemini image model at the owner's suggestion, the ban on the phrase "OSDU on Azure" because it named an older product, and finally the intro paragraph, which the owner wrote themselves and the orchestrator adopted nearly verbatim. At 19:09 on Saturday: "Okay I think we have a well looking landing page now. Job well done."

**Sunday morning.** Polish and closure. An adversarial subagent judged nineteen field guides and posters as a demanding learner; three generated posters were retired because each needed a correction list longer than its takeaways. Another adversarial pass answered the owner's question about whether Explore mode earned its place ("explore mode then caused me confusion as to am I missing something important?"); it did not, and it was removed. The last Keelson run built the Go deeper shelf, and the owner's review of its result led to the illustrated footer, the pager, and carrying the same shape through every lesson, all done directly by the orchestrator in PRs opened and merged within the same minute. At 11:05 the owner made the last process call: "Do you think running a full bead-work is the best way to do this it. It takes 40 minutes and we often have to adjust. This might be a better task to delegate to a subagent." The run was cancelled and a subagent did the work in eleven minutes. The final commit landed at 11:36. At 11:01 the owner had already said: "Okay I love the Start Page, the Learnings, The Audio Deep Dive."

## The human's job

The owner never edited code in the record and wrote site copy once. What they did instead falls into a small number of kinds, and the kinds matter more than the count.

**Direction with a reason.** Nearly every build request came with a learner-centred why. "The concepts have to flow otherwise a user can easily get lost." "People read top to bottom and might never get to the bottom with a giant Start there button that someone clicks on right away." "Ground all this in reality." The reasons were what the orchestrator could generalise from; the requests alone would not have been.

**Delegated taste.** "I'll follow your recommendation you know what things might be best to communicate and how." "Go ahead and make the changes necessary that you think are appropriate." "Merge and fix and keep me updated as the Lessons come online and I can review and offer my feedback." This is what let the factory run for hours between check-ins.

**Correction by looking.** The owner found what was wrong by using the site, not by reading diffs. The "You are Here" bar ("it isn't really landing for me and it did feel like navigation"), the map-jump navigation ("It causes things to jump and you sort of loose context then as the reader"), the three unexplained lines in a sidebar, a "prototype" badge in the header, a guide group that would not collapse, a lesson footer that felt overloaded. Each was fixed within the hour, and three of them were features that had been built the same day.

**Scope cuts.** Removing the orientation and brief recordings, retiring the posters, removing Explore mode, dropping the "Tested with" table to one line. The owner asked for an adversarial argument before most of these, then decided.

**Process rules, stated once.** Use beads and Keelson. Push to main without pull requests for this project. Approve the workflow plans. "Major work you send to a beads-work, smaller work you offload to a subagent." "Make the choices that you think would provide the best result balanced with token burn and time." The orchestrator wrote these into the tracker's memory so they survived the next session.

**Transport for the reviewers.** Every Codex and Astra review reached the orchestrator because the owner ran it elsewhere and pasted the result, usually with a sentence on top. Fifteen Codex rounds, eight Astra rounds. The owner was the bus between vendors.

**Environment repair.** Restarting Keelson, reconnecting MCP, re-pairing the Chrome extension, starting a peer session to fix the beads rib, noticing a hung process. The factory needed hands on the machine several times a day.

There is one more thing the record shows. The owner lost the thread twice on Sunday morning: "so you lost me. Are we good with our open tasks or there are still some left." and, a few minutes later, pasting the orchestrator's own status report back as a prompt. Both came after a night of dense status updates. A factory that reports too much is as hard to manage as one that reports too little.

## What each part was worth

### Keelson and the beads rib

Keelson is a local agent workbench reached over MCP. Its beads-work workflow takes an issue from the tracker's ready queue, plans, pauses for approval, implements in its own git worktree, discovers and runs the project's own checks, runs three independent review lanes and an adversarial triage, self-fixes, pushes, opens a draft pull request, and writes the outcome back onto the bead. It never closes the bead; the merge does that.

Thirteen runs succeeded and produced thirteen merged pull requests. Each ran between 16 and 53 minutes, with a median of 26, and made about seventeen model calls across a mixed cast: GPT-6 Astra planned, triaged, and checked coverage at the highest effort setting; GPT-5.6 Sol implemented and applied fixes; GPT-5.6 Terra ran the three review lanes; Luna and the small Claude models did the cheap steps such as classifying the bead and writing the PR. The implementation node alone averaged fifteen minutes. All of this routed through the GitHub Copilot provider, so the factory's implementers were OpenAI models running under a Copilot subscription, orchestrated by a Claude session.

What it was worth, in the owner's words on Saturday afternoon: "the keelson workflow beads-work is pretty powerful although takes time. It is important we scope the bead work being done worth the time effort. That is a learning." The value was in four places.

- **Isolation.** Every run worked in its own worktree on its own branch. Three runs at a time touched different files and none of them broke main. The six "merge origin/main" commits in the history are the worktrees catching up before their PRs merged.
- **The approval gate.** The plan came back before code was written, and the orchestrator could fold in corrections without a second pause. The plans were good. The tracker's own note after the first two runs: "Compared with the lesson 01 pass through Codex, the plans were stronger and the diffs needed fewer fixes."
- **Durability.** A run outlived the conversation that started it. When the orchestrator's context was compacted mid-run, which happened eight times in the main session, the run kept going and its report was waiting.
- **The write-back.** Each run left two lines on its bead: the approved plan and the PR it opened. Two memories in the tracker and the case study you are reading were reconstructed from those lines and Keelson's own run ledger.

What it cost was time and a certain rigidity. A run that a subagent could finish in ten minutes took thirty to fifty. When the owner expected to adjust the result anyway, the review loop inside the run bought little: twelve of the thirteen runs came back with "clean, no must-fix findings", and the one must-fix the loop did raise turned out to be a bad call. It demanded a browser regression test, the implementer added Playwright to do it, and the orchestrator's fix pass removed both because the project forbids new dependencies and the Pages workflow could not have run the test. Copilot's PR review flagged the same problem. The defects that mattered were found instead by the orchestrator's own browser pass after the run, and by external reviewers looking at the deployed site. By Sunday the owner had drawn the line: runs for multi-file behaviour changes worth an adversarial loop, subagents for bounded content work, the orchestrator for one-file items. That rule now lives in the tracker's memory.

The beads rib had its own rough edges. Dotted child ids broke the claim step until a subagent fixed the rib on Saturday afternoon. One claim write did not land. Worktrees were left behind by cancelled runs. There was no notification when a run paused for approval, so the orchestrator polled. The owner opened a dedicated Claude session on the rib's repository so those fixes stayed out of the orchestrator's context, which worked.

### beads

The tracker arrived on day three and held the rest of the project together. From `bd init` at 11:07 Saturday to the last close at 11:40 Sunday, 81 issues were created and 77 closed, with a median of 43 minutes from creation to close. Fifty carry acceptance criteria written as checkable statements ("at 1280px and 390px", "no horizontal overflow", "every route key and detail id unchanged", "npm run check green"). Forty-six of the seventy close reasons name a commit and twenty-nine name a pull request; many record the measurement that satisfied the acceptance, such as a page height before and after.

Two things made it work as shared state. First, the beads were written before the code. For the 49 commits cited in close reasons, 41 beads predate their commit; the exceptions are verification beads that name the commit they reviewed. Second, every agent read and wrote the same tracker: the orchestrator created beads, Keelson claimed and annotated them, review subagents commented on the beads their findings touched (five comments landing within twelve seconds is one review agent fanning out), and the peer session that rebuilt the Start page was assigned its bead by name. The dependency graph did real work: three reviewer-filed drawer bugs were kept as separate beads and closed by dependency when the one implementation task that fixed all three merged.

It also failed twice on Saturday, and the failure is instructive. Closures silently reverted. The first cause was the JSONL export being tracked in git and re-imported; the fix was to stop tracking it. The second cause, found only after the owner asked "I thought we removed beads from git so we don't get state out of sync", was the tracker's own git hooks re-importing a stale on-disk export on every checkout and merge, which the parallel worktrees triggered constantly. Uninstalling the hooks fixed it. The tracker recorded its own incident: the interaction log shows two beads closed, reopened without reason, and closed again. Both causes and both fixes are now memories in the tracker, so the next session starts knowing.

The tracker never distinguished who acted. All 108 interactions carry the owner's name. Keelson is visible only as note lines; Codex only as branch names in close reasons; subagents only as "done directly" or a run id. That was enough to reconstruct this case study, but a tracker that recorded the acting agent would have made it a query instead of a forensic exercise.

### The tracker artifact

On Saturday at 11:54 the owner said: "update our proposal artifact so we have a detailed plan and understanding of what and how things are going to change, we will use this as that 'understanding' of our design intent". From then on a single Claude artifact page, the Fieldnotes Layout Proposal, was the design-intent record. It went through 23 numbered revisions and 38 publishes. Each revision had a dated state line naming the commit on main, the rules every lesson follows, a lesson-by-lesson plan, the litmus questions, a decisions section where each question carried its outcome, and a changelog.

Its value was that it gave reviewers a stable target. Codex reviewed "Revision 6" and "Revision 14" by URL and said so. The owner's "Try it" idea became section 5 of revision 6 before any code, was reviewed against the source repositories, and was revised into revision 7 with seven corrections before the run that implemented it was started. When the owner and the orchestrator disagreed with a reviewer, the decision and its reason were written down where the next reviewer would read them. The changelog is also the only place where the fix passes after each run are described, which is where the difference between what the factory produced and what shipped can be seen.

Its cost was that it competed with AGENTS.md for the role of rulebook. The rules section of the artifact and the content standard in the repository said the same things in different words, and both grew. AGENTS.md ended the weekend at 4,518 words, edited in 46 commits; one bullet of it is over 900 words long. Every review round added rules. The rules were load-bearing, because every agent and every run read them, but the document is now hard for a person to read.

### Codex

Codex did two jobs. As a reviewer it was the most productive external voice in the project. Fifteen rounds, each a first-person report that named the commit reviewed, drove the site at desktop and phone widths, and cited the source repositories. It found the routing defect on day two, the wrong provider explanation, the Redis-inside-AKS versus Table-Storage-outside boundary error that became a P1 bead, the seven operational holes in the Try it plan, and the case for CIMPL as the named reference. It also named the AI voice in the recordings with counts: the orientation transcript "contains 14 uses of 'massive' and 16 standalone instances of 'exactly.'"

The orchestrator's habit was to verify the concrete claims before acting and to push back where the source disagreed, and the owner's habit was to say "consider the feedback" and let that happen. That combination is why the review rounds turned into fixes rather than arguments. Codex's reviews were committed on `codex/review-*` branches and merged as documents; none went through a pull request, so they are invisible to GitHub's review tooling.

As an implementer Codex was used once, for the lesson 01 rebuild, and not again. Its draft was usable against a precise specification, but it left visible defects, its sandbox blocked both git and the browser, and a Claude agent finished the job faster. After that, implementation went to Keelson, subagents, and a Claude peer, and Codex reviewed.

### Astra

The design conversations in ChatGPT with GPT-6 Astra are where the site's shape came from. The story, map, inspector model ("Tell the story first. Let the map be inspected second."), the lesson grammar, the decision that the claim is the primary interaction and everything else is evidence, the reading-flow simplification of Start, and the illustrated lesson footer all arrived as pasted design feedback on Saturday and Sunday. The owner's framing when the first round came in: "I still think we haven't landed on the exact right design." Eight rounds later, the design was settled enough to be written as rules.

Two observations. Astra's feedback was best when it argued from how a reader moves through a page and worst when it proposed icons, progress markers, and gradients that the content standard forbids; the tracker records that those were declined "by its own advice." And the transcripts never name Astra. The pasted text has a distinctive voice but no attribution, and the only statement that Astra was involved is the owner's brief for this case study. A factory should name its reviewers at paste time.

### Copilot

GitHub Copilot's pull request reviewer was the only reviewer on the repository. It reviewed exactly the thirteen Keelson pull requests, because the beads-work workflow requests it, and none of the eleven orchestrator branches, which were opened and merged in the same minute. Its findings were real: a Playwright test the Pages workflow could not run, a date check that accepts 31 February, an audio marker route without a timestamp, a `+` glyph that the shared disclosure rule rotates into an `×`. The problem was timing. The median pull request was merged six minutes after opening, which is about how long Copilot takes to post. Only two pull requests stayed open long enough for a person to plausibly read the review first. One finding was converted into a bead rather than fixed before merge; the rest were caught, if at all, by the orchestrator's fix pass. A factory that opens and merges its own pull requests has to decide whether the reviewer bot is a gate or a comment.

### Subagents and peers

The Claude subagents did the work that needed breadth or an adversary. Three poster subagents ran in parallel on Friday and each corrected the brief it was given against the source documentation. Two fact-check subagents inside the peer session produced the 21 findings. Three adversarial subagents were asked for by the owner by name: a first-visit review of the landing page, a demanding-learner pass over the field guides, and a case against Explore mode. Six implementation subagents worked in worktrees on bounded beads (the Try it bands, the dev1 sweep, the editorial sweep, the seam posters, the replacement scripts, the contact sheet, the lesson 06 steps). One subagent fixed the beads rib. The peer session that rebuilt the Start page was handed its bead by message and merged by the orchestrator.

The rule that emerged for subagents was written into memory alongside the tier rule: verify the diff, not the report. Subagents report what they meant to do. The orchestrator checked the branch in the browser every time before merging.

### NotebookLM and the Gemini image model

NotebookLM produced every recording and the video, from sources the owner selected and later from a source the orchestrator wrote for it. It was fast and the owner valued the result: "the impact on the 2 deep dives ... are huge." It also had the project's most visible quality problem. The Codex editorial review called the recordings "where the AI voice is most noticeable," with the "massive" and "exactly" counts, and the training-experience review found six factual errors in the orientation episode with timestamps. The site's answer was to keep the recordings, correct them in marker notes, write replacement scripts for approval, and record the corrections as a rule: a recording is replaced from an approved script, never by editing its transcript. Recording the replacements is still open. The Gemini image model, suggested by the owner on Saturday night ("I think you could even send something to gemini model api to create an image"), produced the hero strip and badges in the field-guide style with their prompts kept beside them; the footer badges on Sunday were drawn by hand as SVG because the orchestrator could not call the model itself.

## What worked

- **A written standard that every agent read, enforced by a test.** AGENTS.md and the content test changed together in six of every ten commits. Ninety-six workflow runs, none failed. The factory could move fast because the definition of correct was in the repository, not in anyone's head.
- **Reviews from a different vendor than the builder.** Codex found what the Claude orchestrator and the OpenAI implementers inside Keelson both missed, and the Claude peer found what Codex missed. The owner chose the mix on purpose and it paid.
- **The approval gate with corrections folded in.** Thirteen of thirteen plans were approved with specific corrections and none needed a second pause. This is the point where a few words from the owner changed the most.
- **Isolated parallel runs against a tracker.** Seven pull requests in two hours from runs that could not interfere with each other, each traceable to a bead with acceptance criteria.
- **The orchestrator verifying in the browser.** Screenshots at two widths and DOM probes for the named invariants caught more than any automated review lane. Once the Chrome extension worked, the orchestrator stopped trusting reports.
- **Adversarial single-agent passes before subtraction.** Every scope cut (posters, Explore mode, the orientation recordings) was preceded by an argument the owner asked for and then decided on. Nothing was removed on a whim and nothing removed came back.
- **Memories for process rules.** The delegation tiers, the run-scoping rule, and the two tracker failures were written into the tracker's memory the day they were learned and were applied the next day without being restated.
- **The owner writing copy when the options were not right.** The landing intro is the owner's. It took one message.

## What did not

- **Media churn.** Four orientation recordings in three hours on Friday, then both introductory recordings cut on Sunday. The lesson written into the standard afterwards, script first and record from the approved script, would have saved most of Friday afternoon.
- **Interaction features tried on the owner instead of tested against a user model.** The You are Here bar, map-jump navigation, and Explore mode were each built and removed within a day. Each cost a build, a review, and a removal.
- **The review loop inside Keelson found almost nothing.** Twelve clean verdicts and one wrong must-fix. The lanes are run by models from the same family as the implementer, on a diff they have just watched being written. The value of a Keelson run was isolation, planning, and durability, not its internal review.
- **Pull requests merged before their reviewer posted.** Copilot's findings were good and mostly late.
- **The tracker's state was unreliable for a day.** Two silent reverts, two fixes, and the owner had to ask. The fixes are now memories, but a tracker that can lose closures under parallel worktrees needs to be set up before the parallelism starts, not during it.
- **The environment needed hands.** Keelson restarts, MCP reconnects, Chrome pairing, a hung headless browser, a missing Copilot package that failed one run outright. None of these were the factory's fault and all of them stopped it.
- **Reviewer attribution was lost.** None of the nine review documents names its author. The Astra conversations are unattributed in the transcripts. The beads tracker records one actor for everything. Reconstructing who said what for this case study took five research agents most of an hour.
- **The rulebook grew without limit.** A 4,500-word AGENTS.md is correct and unreadable. Every review added rules and no review removed one.
- **Status reports outran the reader.** "So you lost me." A manager needs a one-line state and a list of open items, not a changelog.
- **Cost was visible only per vendor.** The Claude Code ledger shows about $251 across the sessions that logged it. Keelson's model calls went through the Copilot provider and are metered there. Codex, Astra, NotebookLM, and the image model are on their own subscriptions. Nobody saw one number.

## What we would do differently

1. Start the tracker and the design-intent document before the first line of code, not on day three.
2. Name the reviewer and the model at paste time, in the prompt, so the record carries it.
3. Set the delegation tiers on the first run: workflow runs for behaviour changes across files, subagents for bounded content work, the orchestrator for one-file items.
4. Hold a pull request open until its reviewer bot has posted, or turn the bot off.
5. Write the script, get it reviewed, then record. Never regenerate a recording to fix a framing problem.
6. Give the rulebook a size limit and a subtraction pass every round.
7. Ask for an adversarial argument before building an interaction feature, not only before removing one.
8. Report state to the owner as one line plus open items.
9. Fix the tracker's export and hook behaviour before running parallel worktrees.
10. Put every provider's spend in one place, even if it is a spreadsheet.

## What is still open

Four beads remain, and all four need a person rather than an agent: a pilot with four or five engineers who know OSDU and not Azure SPI; a walk of the personal-account fork path with a throwaway repository, which gates the hands-on bands for lessons 04 and 05; recording the three replacement scripts; and a reading-flow check on lessons 03 to 06 in their final form.

## Sources

- [By the numbers](by-the-numbers.md): every count in this document with where it came from.
- [Hackathon submission draft](hackathon-submission.md): the form fields.
- [The tracker artifact at revision 23](tracker-revision-23.pdf): the design-intent record as it stood when the build reached its done state, including the decisions and the changelog.
- [The reviews](../process/reviews/) and [iteration records](../process/iterations/).
- The beads tracker in `.beads/` (run `bd list --all` and `bd memories`).
- The Claude Code session transcripts and the Keelson run ledger are on the owner's machine and are not in the repository.
