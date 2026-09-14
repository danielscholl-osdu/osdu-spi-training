# A software factory builds a training site

**Microsoft Hackathon 2026. One engineer, four days, agents from three vendors, one interactive training site.**

![A software factory builds a training site](software-factory.png)

This is the short case study. The [full record](full-record.md) has the day-by-day account, the tool-by-tool assessment, and the quotations (also rendered as [a PDF](full-record.pdf), the source for a generated audio conversation about the build); the [numbers](by-the-numbers.md) carry their sources; the [usage analysis](usage/README.md) shows where the tokens went. I wrote the site's direction and taste; a Claude Code session wrote most of the words, including these, from the records of what happened.

## The problem, and the experiment

Engineers who know OSDU still take weeks to become productive on the Azure SPI Stack and the engineering system behind the service forks. The documentation is complete, but complete is the problem: architecture guides, deployment guides, identity guides, decision records, and a fork workflow across three repositories. Reading does not build the mental model. You need to see the stack, trace one request through it, watch a change travel from a fork to a running image, and then read with that picture in your head.

So the deliverable was a training site, [OSDU Azure SPI Fieldnotes](https://danielscholl-osdu.github.io/osdu-spi-training/): seven lessons over an inspectable architecture map, each a small set of claims that focus the map when selected, with an evidence drawer, one easy mistake, an optional hands-on activity, and a shelf of deeper material; around them two generated audio deep dives with chapter markers and source-check notes, a short video, eight field guides, and six posters. Every explanation must name something checkable against the source repositories, and a content test cross-checks every route, marker, and component before a build can deploy.

The experiment was how to build it. I acted as a manager rather than a coder and put a factory of AI agents to work, deliberately drawn from more than one vendor, with two pieces of shared state that every agent could read: an issue tracker and a design-intent document. The question was whether one person could get something this size built and reviewed that way, and what the person actually has to do.

## What existed before

The four days integrated a factory; they did not build one. Already in place: the three source repositories and their documentation; two supplied PDF guides; Keelson, my local agent workbench, with its beads rib and the beads-work workflow, written earlier in the summer for other projects; the beads issue tracker; the Claude Code skills for posters, diagrams, and briefs; the Chrome extension; the Codex CLI; NotebookLM. And on Friday afternoon, before any Claude session, I worked with OpenAI Codex to build the five-file prototype, lay out the source tree, and implement the first response to a concept review. Built during the event: the site, the content standard in `AGENTS.md`, the content test, the tracker artifact, the bead conventions, and the delegation rules.

## The operating model

![The factory: owner, orchestrator, workers, reviewers, and shared state](factory-diagram.png)

**Who decided.** I did: direction with a reason, taste, approval of plans, scope cuts, and which review to bring in. About 150 messages over four days, roughly 15 to 21 hours of active attention by the timestamps. I never edited code, and supplied site copy once, by picking three paragraphs from a Codex suggestion and passing them across.

**Who built.** A Claude Code session (Fable 5.1) was the orchestrator. It wrote briefs, spawned 27 subagents for parallel and adversarial work, handed multi-file changes to Keelson, checked every change in a real browser at two widths, merged, and kept the record. It produced 2,652 turns and 3,087 tool calls, and wrote more output tokens than any other channel, because it was also writing the content. Keelson's beads-work workflow ran 17 times and merged 13 pull requests; inside a run, GPT-6 Astra planned and triaged, GPT-5.6 Sol implemented in an isolated worktree, and GPT-5.6 Terra ran three review lanes, all through the GitHub Copilot provider.

**Who checked.** Reviewers from other vendors than the builders, on purpose. Codex reviewed the deployed site fifteen times for usability, accuracy, and voice, on its own branches, and I carried each review across as a prompt. GPT-6 Astra in ChatGPT shaped the design in eight conversations. GitHub Copilot reviewed every workflow-built pull request. A second Claude session fact-checked the whole site once and found 21 things, including that the running example's cache fix had been written upstream, not in the fork. Three adversarial subagents argued for subtraction before I cut things.

**What persisted.** A beads tracker: 81 issues in 24 hours, written before the code in 41 of 49 checkable cases, with acceptance criteria that could be measured and close reasons that name the commit and the measurement. A design-intent document, kept as a Claude artifact through 23 revisions, that reviewers could cite by revision. And `AGENTS.md`, the content standard that every agent read and the test enforced, edited in 46 commits and 4,518 words long by the end.

### Keelson, beads, and the rib between them

Three of those tools are mine, so a word on each. **Keelson** is a local agent harness: it keeps conversations, workflow runs, outputs, and memory in a local database so agent work survives a closed terminal, and it expresses repeatable work as deterministic YAML workflows that mix agent turns with shell steps, approval gates, and loops, routing each node to whichever model suits it ([repository](https://github.com/danielscholl/keelson), [docs](https://danielscholl.github.io/keelson/)). The problem it solves is that a chat session is ephemeral, unrepeatable, and uninspectable after the fact. **beads** is an issue tracker that lives in the repository as an embedded database with a command line. It suits agents better than forge issues because every bead declares what blocks it, so an agent can ask for the ready queue ranked by leverage; every bead carries structured fields for acceptance, design, notes, and a close reason, so the definition of done travels with the work; and the commands are local and sub-second, which matters when an orchestrator issues three hundred of them in a day. **The beads rib** ([repository](https://github.com/danielscholl/keelson-rib-beads)) connects them: a live board where I could see what was startable, in progress, blocked, and claimed by a run; tools an agent can use; and the beads-work workflow. That workflow claims a bead, plans, pauses for approval and writes the approval onto the bead, implements in a worktree, runs the project's own checks, opens a draft pull request, reviews the captured diff in three lanes with an independent triage, fixes, requests the forge's review bot, and writes the outcome back. It never closes the bead; the merge does.

## Three decisions that changed the process

**1. Sunday 11:03: move the work into a tracker and a workbench.** Until then the project had a git history and some iteration notes. I wrote: "Perhaps we use beads to coordinate our work. We have access to keelson, you have access to a coding agent peer. Your goal is to orchestrate work and get the work accomplished as you see fit best but control your context and try to delegate, review and orchestrate/coordinate what your plan ends up being." The first hour was rough: Keelson refused connections and I restarted it twice, the beads-work workflow was not installed on the project yet, the Chrome extension paired on the fourth try, and a headless browser hung. I noticed that one first: "I think the agent is waiting on a failed chrome process." By 12:43 the first two runs were building lessons 02 and 03 in parallel; between 14:06 and 15:32 seven more produced pull requests #7 to #13, and 67 commits landed in those two hours. At 13:12 I said what I saw: "the software factory is working good. It takes a little longer but is more involved in advesarial reveiws and fixes as part of the workflow."

**2. Sunday 14:48: scope runs for worth.** A beads-work run took 16 to 53 minutes. A subagent in a worktree took ten. The runs earned their cost on changes that crossed files and changed behaviour, because the plan gate and the isolation paid for themselves; on copy edits and one-file fixes they did not. "Major work you send to a beads-work, smaller work you offload to a subagent," I wrote, and the orchestrator stored it as a tracker memory with the reasoning. The rule was applied without being restated on Monday morning, five context compactions later, when I cancelled a run two minutes in: "It takes 40 minutes and we often have to adjust. This might be a better task to delegate to a subagent." A subagent finished it in eleven.

**3. Ask for the argument, then cut.** Three things confused me as a reader and were removed the same day they were built: a "You are Here" bar, a map-jump navigation, and an Explore mode. Three generated posters were retired and two introductory recordings were taken off the deep-dives listing. Before each cut I asked for an adversarial case ("Can you do a quick advesarial question on if we really need explore mode"), read it, and decided. Nothing removed came back. The lesson I took is the mirror image: I should have asked for that argument before building the interaction features, not only before removing them.

## One change through the factory

The Go deeper shelf, Monday morning. At 08:28 I pasted a reviewer's note: after the lesson exit "the page asks the reader to decode four treatments ... On lesson 01 the optional band is 891px of a 3,551px page." At 08:51 the orchestrator wrote a bead with a seven-point design and acceptance that could be measured: the collapsed band under 350 pixels on desktop, every route unchanged, the check green. It started a run. Astra planned; the orchestrator approved with corrections ("No buttons inside a summary ... nested interactive content is an accessibility problem"). Sol implemented for 33 minutes in a worktree. The run opened draft PR #18 at 09:36, ran its three lanes on the diff, found nothing blocking, and requested Copilot, which posted six findings at 09:49, two of them real. The orchestrator opened the branch in Chrome and measured: shelf 261 pixels and page 2,658 at 1280 wide, was 891 and 3,551; one fix, so that shelf rows stay open within a chapter; merged at 10:22. The bead closed with those numbers as its reason and the tracker went to revision 18. The reviewer's follow-up ("calmer, but a little too much like a reference table") became a second bead the orchestrator did directly in six minutes. Same thread, two tiers.

## What the evidence shows

Delivery, checked: 196 commits, 24 merged pull requests, 82 deployments from 83 attempts, no failed run in GitHub Actions. Four layers of checking did different jobs and only one was automatic: the content test proved the structure held; reading the source repositories proved the facts; the browser pass proved the behaviour; the pilot with real learners, still to run, will prove whether it teaches.

Where the tokens went, across the three channels that keep a ledger: 30.8 million new input tokens, 904 million cached reads, 4.05 million output. Keelson consumed the most new input (14.9 million, mostly the implement node reading the repository fresh each run); the orchestrator wrote the most output (2.0 million); 97 percent of all input was cache reads, which is what made a 2,373-turn session affordable. The Claude Code cost ledger shows about $251 for the sessions that logged it; Keelson's models are metered on a Copilot subscription and Codex on its own, so nobody saw one number.

What was expensive: media. Four orientation recordings in three hours on Saturday, then both introductory pieces demoted on Sunday because a learner who started there would never reach the deep dives. The rule that came out of it, script first, then record from the approved script, would have saved Saturday afternoon. Also expensive: the workflow's internal review loop, which raised 27 candidates across 13 runs and blocked once, on a real gap whose remedy (a Playwright test the project forbids) had to be reverted. The defects that changed the product were visual and behavioural; they were found in the browser and by outside reviewers, not by lanes reading a diff. And pull requests merged before Copilot posted: six of its nine inline comments arrived after the merge.

What broke: the tracker silently reverted closures twice on Sunday, first from a tracked export, then from its own git hooks under parallel worktrees, and I had to ask why. Keelson, MCP, and the Chrome extension each needed my hands more than once. None of the review documents names its author, and the tracker records one actor for everything, so reconstructing who said what for this case study took five research agents an hour.

What remains unmeasured: whether the site shortens onboarding; whether the factory saved labour against building it by hand; whether this mix of tools beats another; and the total cost as one number.

## The setup I would use next time

1. Tracker and design-intent document from the first hour, not day three, with the tracker's export and hooks configured before any parallel worktree exists.
2. A content standard and a test that fails the build, written before the first agent-built change.
3. Delegation tiers stated on the first run: workflow runs for behaviour changes across files, subagents for bounded content work, direct edits for one-file items.
4. Reviewers from a different vendor than the builders, named in the prompt at paste time so the record keeps the attribution.
5. Hold a pull request until its review bot has posted, or turn the bot off.
6. Script, review, record. Never regenerate a recording to fix a framing problem.
7. Ask for the adversarial argument before building an interaction feature, not only before removing one.
8. Status to the owner as one line plus open items.
9. Every provider's spend in one place, even a spreadsheet.

The site is live. The pilot, the personal-account walkthrough that gates two of the hands-on bands, and the re-recording from approved scripts are the three things still waiting on me.
