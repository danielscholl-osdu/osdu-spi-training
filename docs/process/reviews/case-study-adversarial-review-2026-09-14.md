# Adversarial review of the software factory case study

Read on 14 September 2026 against the working tree (build tip `62be86e`, docs at `a9bf03e` plus uncommitted edits). Files: `docs/case-study/README.md` (the short study, "README" below), `docs/case-study/full-record.md` ("full record"), `docs/case-study/by-the-numbers.md` ("appendix"), `docs/case-study/usage/README.md` ("usage"), `docs/case-study/hackathon-submission.md`, and the Codex review of 14 September. Points from that review that have been applied are not repeated; two that have not are called out.

Every challenged number shows the command and the result. Commands ran read-only from the repository root or the Claude Code project directory.

## Findings, ranked

### 1. The orchestrator is described as one session and one model. It was thirteen sessions and two models.

**Lens:** engineer, then manager.
**Where:** README, "Who built": "A Claude Code session (Fable 5.1) was the orchestrator. ... It produced 2,652 turns and 3,087 tool calls". Usage, "Almost all input was cached": "caching is what made a 2,373-turn orchestrator session affordable". Appendix, "Orchestrator session alone": "1,301 turns".
**Why it matters:** the short study's central claim is one person directing one orchestrator. The appendix gives three different turn counts for what the README calls one session: 1,301 for the orchestrator session, 2,373 for all main sessions under the usage cutoff, 2,652 for all main sessions under the appendix cutoff. Opus 5 ran the first two days (664 turns by the appendix). Codex flagged this denominator; the short study still conflates it. A reader who checks will find the headline number does not describe the thing it is attached to.

```
$ python3 (count assistant message ids and tool_use blocks across the 13 session files, cutoff Mon 11:41 CDT)
assistant msgs 2603  tool_use 3043   (13 files; orchestrator file c783dfcd alone has the Sunday and Monday work)
```

The appendix figures are close to mine and are not the problem. The wording is.

**Fix:** "Thirteen Claude Code sessions did the Claude side, Opus 5 on Friday and Saturday and Fable 5.1 from Sunday. One 25-hour session from Sunday morning was the orchestrator: 1,301 turns, 86 messages from me, all 19 Keelson calls." Use 2,652 only when the sentence says "all sessions". Make usage say "a 2,373-turn corpus", not "session".

### 2. The tier rule is a preference with two anecdotes, presented as a measured finding.

**Lens:** engineer.
**Where:** README, decision 2: "A beads-work run took 16 to 53 minutes. A subagent in a worktree took ten." Full record, "What it cost": "A run that a subagent could finish in ten minutes took thirty to fifty." Tracker memory: "A run costs 35 to 60 minutes wall clock". Full record, rib section: "the most transferable finding in this case study."
**Why it matters:** the run side has three different ranges in the project's own records (16 to 53 with median 26 in the ledger, 30 to 50 in the prose, 35 to 60 in the memory). The subagent side has no row in the appendix at all. The transcripts give it:

```
$ python3 (first to last timestamp of each subagent transcript under the project directory)
 15.0 min Sun 20:58 c783dfcd  You are working in an isolated git worktree ...
 14.9 min Sun 20:58 c783dfcd  You are working in an isolated git worktree ...
 12.7 min Sun 21:29 c783dfcd  You are working in an isolated git worktree ...
 11.1 min Sun 17:44 c783dfcd  You are editing the OSDU Azure SPI Fieldnotes ...
  6.1 min Mon 11:07 c783dfcd  Build field guides ...   (the "eleven minutes" case; 11 min is ask-to-close, not agent time)
 16.3 min Mon 11:21 c783dfcd  Lesson 06 steps ...
```

Worktree subagents took 11 to 16 minutes, so the gap to a median run of 26 minutes is about two to one, not three to five. Nothing compares defect rates by tier, and the isolation benefit credited to runs is also what a worktree subagent has. Reasonable rule, but it was chosen on Sunday at 14:48 after two runs and applied once on Monday; the evidence for "most transferable" is one cancellation.

**Fix:** add a "Subagent duration, worktree tasks" row to the appendix (11 to 16 minutes, n=5). Reconcile the run range to the ledger everywhere, including a note that the memory's "35 to 60" was the Sunday estimate. Rewrite the rule as a choice: "I chose runs for changes that crossed files, because the plan gate caught things before code was written; subagents for the rest, because a run cost about twice the time. I did not measure whether the runs produced fewer defects." Drop "most transferable finding".

### 3. "One change through the factory" is the best case, on exactly the axis the study criticises.

**Lens:** engineer.
**Where:** README, "One change through the factory"; full record, "One change, end to end".
**Why it matters:** fn-m7u is the longest run in the ledger (53 minutes, the maximum) and PR #18 was the second-longest-open pull request of 24. It is one of only two PRs where Copilot posted before the merge. The study's own finding is that the median PR merged six minutes after opening and Copilot arrived late six times in nine. So the worked example demonstrates the process working in the one case where it was not typical.

```
$ gh pr list --state all --limit 50 --json number,createdAt,mergedAt --jq '... seconds open ...' | sort -n
3 3353s  18 2929s  5 1018s  16 663s  6 659s  14 515s  15 513s  9 493s  13 470s  7 441s  10 413s  12 399s  8 384s
11 195s  4 115s  22 39s  1 30s  17 18s  19 15s  20 12s  21 12s  2 3s  23 3s  24 3s
median = (384 + 399) / 2 = 392 s, about 6.5 min
```

Also a small timing slip: "opened draft PR #18 at 09:36" but GitHub records 14:33:21Z, which is 09:33 CDT.

**Fix:** keep the trace, but open it with "the longest run of the thirteen, chosen because it is the most complete record", and add a three-line typical case beneath it: fn-kbc, run 16 minutes, PR #7 merged 7 minutes after opening, Copilot's one comment posted 33 seconds after the merge.

### 4. A manager cannot get a cost per change from this study.

**Lens:** manager.
**Where:** README, "What the evidence shows": "The Claude Code cost ledger shows about $251 for the sessions that logged it; Keelson's models are metered on a Copilot subscription and Codex on its own, so nobody saw one number."
**Why it matters:** the audience is deciding whether to copy the approach. "Nobody saw one number" is honest but leaves the decision unmade. The usage file has the token counts to bound it: 14.86 M new input and 1.32 M output across 17 Keelson runs is roughly 1.1 M new input and 0.1 M output per run; Codex working agents were 5.35 M new input for 710 responses. Those figures can be turned into a per-merged-PR token cost and a list-price estimate with stated assumptions, and the two subscriptions can be named as fixed monthly costs. The $251 figure is also unqualified in the README, though the appendix says it is "indicative, not a bill".

**Fix:** add a short table to "What the evidence shows": per Keelson-merged PR, about 1.1 M new input and 0.1 M output tokens plus one Copilot review; per Claude-orchestrated PR, the share of the $251 ledger (about $10 per PR across 24 if spread evenly, labelled as such); Copilot and Codex as subscriptions with their monthly price. State the assumptions in one line. Carry "indicative, not a bill" into the README.

### 5. The owner is the author of three of the tools, and the study does not say what that bought.

**Lens:** manager.
**Where:** README, "Three of those tools are mine"; "Keelson, MCP, and the Chrome extension each needed my hands more than once"; full record, "The factory needed hands on the machine several times a day"; "The owner opened a dedicated Claude session on the rib's repository so those fixes stayed out of the orchestrator's context, which worked."
**Why it matters:** the question a manager asks is what happens when the person in the chair did not write Keelson, the beads rib, or the beads-work workflow, and cannot open a session to patch the rib on Sunday afternoon. The study lists the repairs (two Keelson restarts, a rib fix by a subagent, uninstalling the tracker's git hooks, four Chrome pairing attempts, a hung headless browser, a missing Copilot package) but never estimates their share of the 15 to 21 hours or says which needed the toolsmith rather than a user. "What another engineer could reuse" says Keelson is optional; it does not say what the four days would have looked like without its author present.

**Fix:** a paragraph under "What broke" or "The setup I would use next time": "Of the environment repairs, these needed me as the author of the tool: (list). These a user could have done from the docs: (list). I estimate the repairs took about N hours of the 15 to 21." If the split cannot be estimated, say that.

### 6. "Reviewers from a different vendor than the builders" is asserted, not shown, and the cast contradicts it.

**Lens:** engineer.
**Where:** README, "Who checked": "Reviewers from other vendors than the builders, on purpose." Setup item 4. Full record, "What worked": "Codex found what the Claude orchestrator and the OpenAI implementers inside Keelson both missed, and the Claude peer found what Codex missed. The owner chose the mix on purpose and it paid."
**Why it matters:** by the cast table, OpenAI models both built (Sol inside Keelson, Codex on Friday and for lesson 01) and reviewed (Codex, Astra, the Terra lanes). Claude both built (the orchestrator, subagents) and reviewed (the peer fact-check, the adversarial passes). Copilot's review model is unnamed. Every vendor was on both sides. The evidence given is that a second reviewer found things the first missed, which is evidence for having a second reviewer, not for vendor difference. Codex's review said "the record does not prove it caused missed defects"; the wording was softened in places but the setup list still states it as a rule.

**Fix:** rewrite as "A reviewer that had not seen the build found what the builder missed, in both directions. I chose different vendors on purpose, but this record cannot show that the vendor, rather than the fresh context, is what mattered." Change setup item 4 to "A reviewer that did not build the change, named in the prompt at paste time."

### 7. Five appendix and record numbers do not hold.

**Lens:** engineer.

**(a)** Appendix: "PRs opened and merged in the same minute: 11, all orchestrator branches". Nine were under 60 seconds; #3 was open 56 minutes and #4 two minutes (both orchestrator branches). Eleven is the count of orchestrator branches, not of same-minute merges. Result above in finding 3.

**(b)** Full record, "Isolation": 'The six "merge origin/main" commits in the history'. Four carry that subject; the other two non-PR merges are a Codex review branch and a merge whose subject is a feat line.

```
$ git log 62be86e --merges --format='%s' | grep -c 'origin/main'
4
$ git rev-list --merges --count 62be86e
20    (14 PR merges, 4 origin/main, 1 codex/review-try-it-plan, 1 "feat(content): add partition lookup ...")
```

**(c)** Full record, "The tracker artifact": "one bullet of it is over 900 words long". The longest top-level bullet in AGENTS.md, nested items included, is 602 words.

```
$ python3 (split AGENTS.md on top-level "- " items, count words)
602  - The start page, Audio deep dives, and Visual field guides have no rail; ...
536  - Visual field guides is one headline and subhead beside the drafting-sheet strip ...
```

**(d)** README, decision 2: "five context compactions later". The orchestrator session has eight compact summaries; six fall between the rule at Sunday 14:48 and the cancellation at Monday 11:05.

```
$ python3 (isCompactSummary timestamps in c783dfcd, CDT)
Sun 12:03, Sun 13:47, Sun 15:51, Sun 18:36, Sun 20:05, Sun 22:14, Mon 08:23, Mon 10:56
```

**(e)** Appendix, "Issues: 81". The tracker now holds 83 (two case-study beads added after the mining tip), with 51 carrying acceptance criteria and 47 close reasons naming a commit. The appendix states its tip, which is right; the README does not, so its "81 issues" will drift from what a reader who runs `bd list --all` sees.

```
$ bd --readonly list --all --json | python3 -c '...'
issues 83  Counter({'closed': 78, 'open': 4, 'in_progress': 1})  with acceptance 51  cite sha 47  cite PR 29  empty 7
```

**Fix:** (a) "9 opened and merged within a minute, all orchestrator branches; 11 orchestrator branches in all". (b) "six merges that were not pull requests, four of them worktrees catching up with main". (c) "the longest bullet is 600 words". (d) "six compactions later". (e) add "at the build tip `62be86e`" to the README's first use of a tracker count, or say "81 issues by the end of the build".

### 8. The Explore mode "adversarial subagent" was an inline answer.

**Lens:** engineer.
**Where:** README, "Who checked": "Three adversarial subagents argued for subtraction before I cut things." Full record, "Subagents and peers": "Three adversarial subagents were asked for by the owner by name: ... and a case against Explore mode." Full record, Monday: "another adversarial pass answered the owner's question".
**Why it matters:** the request is at 08:35 Monday and the removal commit at 08:41. No Agent tool call with Explore mode in its prompt exists in the orchestrator session, and no subagent transcript from that window exists. The orchestrator answered in the conversation. Two adversarial subagents are real (first visit 16:08 Sunday, field guides 19:23 Sunday). The full record's Monday paragraph says "pass" and its tools section says "subagent"; the README picks the stronger word.

```
$ grep -o '"name":"Agent","input":{...}' c783dfcd.jsonl | grep -i xplore      -> only an Explore-type search subagent about try-it prerequisites
$ git log --format='%h %ad %s' --date=format:'%a %H:%M' | grep -i explore
1b48c9c Mon 08:41 refactor(map): remove lesson focus and explore map toggle
```

**Fix:** "Two adversarial subagents and one inline argument" in both documents, and "before each cut I asked for the case against it" stays true.

### 9. "What the evidence shows" leads with activity, not outcome.

**Lens:** manager.
**Where:** README: "Delivery, checked: 196 commits, 24 merged pull requests, 82 deployments from 83 attempts, no failed run in GitHub Actions." Sunday's "67 commits landed in those two hours" appears in both documents.
**Why it matters:** every push to main deploys a static site, so 82 deployments is the push count. "No failed run" measures a format, test, and build gate on a site with no CI beyond that. Commit volume from a factory of agents is the cheapest thing to produce. The outcome measures that exist are elsewhere in the text: seven lessons, two deep dives, eight guides, six posters, 21 fact-check findings fixed, 91 concept-review findings triaged, Codex's routing and boundary defects found and fixed, three features built and removed. The pilot is honestly flagged as unrun.

**Fix:** open the section with the product inventory and the defects found and fixed by each check, then one line of volume, then the pilot caveat. Move "82 of 83" and "67 in two hours" to the appendix only.

### 10. Sentences Codex named are still in, and new ones of the same kind were added.

**Lens:** editor.
**Where:** full record, "What worked": "Nothing was removed on a whim and nothing removed came back." Full record, "What did not": "Every review added rules and no review removed one." Both were quoted in the Codex review as examples of rhetorical certainty. README, decision 3: "Nothing removed came back." New aphorisms: "The four days integrated a factory; they did not build one." "Same thread, two tiers." "A 4,500-word AGENTS.md is correct and unreadable." "The owner was the bus between vendors." "The plans were good." "it paid." "The lesson I took is the mirror image".
**Why it matters:** each is a closed epigram where a specific event would carry more weight. "No review removed one" is checkable and probably false in detail (the rules section was rewritten at least once; the README itself says rules were "edited in 46 commits"). "Nothing removed came back" is a claim about the future of a four-day project. Three or four of these per page is the texture a reader recognises as generated.

**Fix:** "Nothing removed came back" to "None of the six removals was reversed before the build ended." "Every review added rules and no review removed one" to "AGENTS.md grew in 46 commits; I cannot find a commit that only removed a rule." Cut "Same thread, two tiers", "correct and unreadable", "it paid", and "the mirror image"; the sentence before each already makes the point.

### 11. Two narrators, and first person that could only come from the machine's records.

**Lens:** editor.
**Where:** README is first person ("I wrote", "I never edited code"). Full record is third person ("the owner", "the word 'factory' is the owner's") with "What we would do differently" and "the case study you are reading". README line 7 says a Claude session "wrote most of the words, including these".
**Why it matters:** a reader who clicks from README to full record meets a different narrator describing the same person. Within the README, some "I" sentences carry knowledge the owner did not have at the time and could only get from telemetry: "five context compactions later", "the orchestrator stored it as a tracker memory with the reasoning", "97 percent of all input was cache reads", "It produced 2,652 turns and 3,087 tool calls". These are fine as reported facts but read oddly as first-person memory next to "I noticed that one first".

**Fix:** keep first person for decisions, observations, and quotes. Put telemetry in a reporting voice: "The transcripts show six compactions between the rule and its reuse." Make the full record match (first person, or a one-line note "compiled by the orchestrating session from the records, in the third person on purpose"). Replace "we would do differently" with one consistent pronoun.

### 12. Jargon the hackathon reader will not have.

**Lens:** editor.
**Where:** README uses, without a gloss: SPI and OSDU (never expanded anywhere in the study), worktree, MCP, compaction, lane, rib (defined in section 4, used in section 3), P1, Pages, xhigh, "the seam", "dev1 sweep", and the model names Astra, Sol, Terra, Luna, which read as people. Site features are named as if known: "You are Here bar", "map-jump navigation", "Explore mode", "Try it band", "Go deeper shelf".
**Why it matters:** the audience is engineers and managers outside this project. A manager who does not know that a worktree is an isolated checkout cannot evaluate the isolation claim, and one who does not know what a compaction is will miss the durability point in decision 2. Codex asked for worktree and MCP to be explained once; the README does neither.

**Fix:** a six-line gloss box after "The operating model" (worktree, compaction, MCP, lane, bead and rib, Pages), and expand OSDU and SPI on first use in the README and the submission. Say "GPT-6 Astra, GPT-5.6 Sol and Terra (OpenAI model variants)" once.

### 13. Repetition between the short study and the full record.

**Lens:** editor.
**Where:** the beads-work workflow's steps are described in full record "How a piece of work moved", again in the rib section ("Claim a bead, or take the one named..."), and again in "Keelson and the beads rib" ("takes an issue from the tracker's ready queue, plans, pauses..."), and once more in README section 4. The "next time" list is in README (9 items) and full record (10 items), nearly identical. "What existed before", "One change end to end", the delegation rule, and "unmeasured" all appear in both. README's Keelson, beads, and rib section is one 330-word paragraph, the longest in the document.
**Why it matters:** the full record is 8,680 words against Codex's suggested 2,500 to 3,500 for the narrative; the answer was to add a short version and keep growing the long one. A reader who reads both gets the workflow four times and the lessons twice.

**Fix, in order:** in README, cut the Keelson, beads, and rib section to three sentences with the two repository links and point to the full record. In the full record, delete "Keelson and the beads rib" under "What each part was worth" (its content is in the rib section and "What did not") and delete "What we would do differently" in favour of a link to the README's list. That removes about 1,200 words without losing a fact.

### 14. Owner time is one number with no split.

**Lens:** manager.
**Where:** README: "roughly 15 to 21 hours of active attention by the timestamps". Appendix: the per-day estimate.
**Why it matters:** the manager wants to know what the person did with those hours: direction, reading reviews, carrying reviews between tools, approving plans, environment repair, looking at the site. The full record lists the kinds ("The human's job") but attaches no time to any of them, and the 15 to 21 hours excludes Codex, ChatGPT, and NotebookLM time entirely, which for fifteen Codex rounds and eight Astra conversations is not small. "One person" is established; "four days" quietly means part of four days plus unmeasured time elsewhere.

**Fix:** one table: kind of work, rough hours, evidence (message clusters, run approvals, review pastes). Add a sentence: "Time in Codex, ChatGPT, and NotebookLM is not in the transcripts; I estimate it at N hours." If no estimate is possible, say the total is a floor.

### 15. "Three vendors" does not survive the cast table.

**Lens:** editor.
**Where:** README headline: "agents from three vendors". Submission: "a factory of Claude, OpenAI, and Copilot agents". Cast table: Anthropic, OpenAI, GitHub Copilot (a provider, running OpenAI and Anthropic models), Google (NotebookLM and the Gemini image model).
**Why it matters:** Copilot is not a model vendor and Google is one that shipped every recording and six images. The count is the first thing in the headline and it is wrong either way.

**Fix:** "agents from Anthropic, OpenAI, and Google, some reached through GitHub Copilot" or drop the count from the headline and keep "more than one vendor" in the body, which is what the text actually argues.

### 16. "41 of 49 checkable cases" has no definition in the README.

**Lens:** engineer.
**Where:** README, "What persisted": "written before the code in 41 of 49 checkable cases". Full record: "For the 49 commits cited in close reasons, 41 beads predate their commit; the exceptions are verification beads that name the commit they reviewed."
**Why it matters:** "checkable" reads as a selection the author controls. The full record has the definition; the README dropped it. Also, 8 of 49 being after-the-fact beads is itself worth a sentence, because it is the tracker being used as a log rather than a plan in a sixth of cases.

**Fix:** "Of the 49 closed beads whose close reason names a commit, 41 were created before that commit; the other 8 were written after the fact to record a review or a two-minute fix."

### 17. Self-praise quoted from the owner's own chat.

**Lens:** editor.
**Where:** full record: "Okay I think we have a well looking landing page now. Job well done." and "Okay I love the Start Page, the Learnings, The Audio Deep Dive." README and full record both quote "the software factory is working good" with its typos.
**Why it matters:** the quotes with typos preserved signal authenticity, and the 13:12 verdict is a real event worth keeping. "Job well done" and "I love the Start Page" add nothing a hackathon judge can use and read as the study grading itself. The verbatim typos ("advesarial reveiws") appear twice in the README alone.

**Fix:** cut the two praise quotes; keep 11:03, 13:12, 14:48, 20:54 ("so you lost me") and 11:05, each once. Quote "advesarial reveiws" once or silently correct with a note that quotes are lightly corrected.

## What is genuinely good and must not be lost

- **The failure list is specific and dated.** Tracker closures reverting twice with both causes, Copilot's six-of-nine late comments with the timestamp evidence, the Playwright revert, four recordings in three hours. This is what makes the rest believable, and few hackathon submissions include it.
- **The fn-m7u trace with measured acceptance.** A bead with "under 350px" as a criterion and a close reason that reports 261px and 2,658px is the clearest single demonstration of the method. Keep it, just label it as the longest run.
- **The appendix with a cutoff and a source column.** Most of its numbers reproduced from the repository on the first try (196 commits, 9/19/152/16, 67 in two hours, 82 of 83 Pages, 9 Copilot comments, 46 AGENTS.md commits, 4,518 words, 15 compactions with 8 in one session). That is rare and it is the study's strongest credential.
- **The owner's messages with times.** "Perhaps we use beads" at 11:03, "the software factory is working good" at 13:12, the tier rule at 14:48, "so you lost me" at 20:54, the cancellation at 11:05. All five verified in the transcript at the stated minute. They show judgement being exercised, which is the story.
- **"What remains unmeasured" and the pre-existing versus built split.** Saying plainly that onboarding benefit, labour saved, and total cost are unmeasured, and that the four days integrated tools written earlier, is the honesty a manager needs to trust the rest.

## Verdict

The case study would persuade an engineer who already believes in agent orchestration and wants a worked example, because its numbers reproduce and its failures are on the page. It would not yet persuade a manager deciding whether to copy the approach, for three reasons that are fixable in an afternoon: the cost of a change is not stated in any unit a budget holder can use, the person in the chair is the author of the tools and the study does not say how much that mattered, and the headline "one session, three vendors, 2,652 turns" describes something other than what the appendix records. The tier rule and the different-vendor rule are presented as findings when the record supports them only as choices; a sceptical reader will notice, and once they do the honest parts lose some of their credit. Fix the denominators, label the two rules as choices, add one cost table and one owner-time table, and cut the duplicated workflow descriptions, and the study becomes the rare hackathon entry whose claims survive being checked.
