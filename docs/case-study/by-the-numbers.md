# By the numbers

Every figure in the [case study](README.md) with its source. Times are America/Chicago (CDT) unless marked UTC. The records were mined at the end of Day 4 at the repository tip `62be86e`.

Sources:

- **Transcripts.** The thirteen Claude Code session files for this project and their fifty subagent transcripts, parsed line by line. Human turns are user messages with text that are not tool results, slash commands, or system-injected output.
- **Tracker.** `bd list --all --json`, `bd memories`, and the passive exports `.beads/issues.jsonl` and `.beads/interactions.jsonl`.
- **Git and GitHub.** `git log --numstat`, `gh pr list --state all`, `gh run list`, and the review and comment endpoints for every pull request.
- **Keelson.** The `workflow_runs`, `workflow_node_outputs`, and `usage_events` tables in the workbench's own database.

## Span

| Measure                                       | Value                        | Source      |
| --------------------------------------------- | ---------------------------- | ----------- |
| First session opened                          | Day 1, 17:10                 | Transcripts |
| First commit                                  | Day 1, 17:29                 | Git         |
| Last commit of the build                      | Day 4, 11:36                 | Git         |
| Calendar days with commits                    | 4                            | Git         |
| Hours with a commit on Day 3                  | 12 of 12 from 11:00 to 23:00 | Git         |
| Commits between midnight and 08:00 on any day | 0                            | Git         |

## Volume

| Measure                                                             | Value                                                                                                 | Source         |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | -------------- |
| Commits                                                             | 196 (176 non-merge, 20 merges)                                                                        | Git            |
| Commits per day                                                     | Fri 9, Sat 19, Sun 152, Mon 16                                                                        | Git            |
| Commits in the two hours 14:00 to 16:00 on Day 3                    | 67                                                                                                    | Git            |
| Commit types                                                        | feat 73, docs 38, refactor 23, fix 18, chore 8, test 7, style 7                                       | Git            |
| Lines added and removed                                             | +49,229 / −11,283 (includes generated transcripts)                                                    | Git            |
| Ten largest commits                                                 | all on Days 1 and 2; four are successive orientation-episode replacements within three hours on Day 2 | Git            |
| Commits touching the content test                                   | 106 of 176                                                                                            | Git            |
| Commits touching AGENTS.md (38 of them also touch the content test) | 46                                                                                                    | Git            |
| AGENTS.md at the end                                                | 4,518 words                                                                                           | `wc`           |
| Pull requests                                                       | 24, all merged                                                                                        | GitHub         |
| Median time from PR open to merge                                   | 6 minutes                                                                                             | GitHub         |
| PRs opened and merged within a minute                               | 9, all orchestrator branches (11 orchestrator branches in all)                                        | GitHub         |
| PRs open longer than 45 minutes                                     | 2 (#3 at 55 min, #18 at 48 min)                                                                       | GitHub         |
| GitHub Actions runs                                                 | 96: 83 Pages attempts (82 deployed, 1 cancelled by a newer push), 13 Copilot reviews                  | GitHub         |
| Failed GitHub Actions runs                                          | 0 (Keelson separately had one failed run and one failed smoke test)                                   | GitHub         |
| Deployed site                                                       | https://danielscholl-osdu.github.io/osdu-spi-training/                                                | Pages workflow |

## People and agents

| Measure                                                                   | Value                                                                                                                                                                                                                 | Source                            |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| Human messages to the orchestrator (all sessions)                         | about 150 (137 by the strict count; 150 including absolute file paths dropped in as prompts); activity telemetry, not effort                                                                                          | Transcripts                       |
| Human messages per day                                                    | Fri 16, Sat 27, Sun 73, Mon 21                                                                                                                                                                                        | Transcripts                       |
| Owner's active hours, estimated from message timestamps                   | about 15 hours with gaps under 30 minutes bridged, about 21 with gaps under an hour (Fri 2 to 3, Sat 4 to 7, Sun 8 to 10, Mon 2); not measured directly                                                               | Transcripts                       |
| Slash commands typed                                                      | 41 (`/compact` 15, `/sdlc:prime` 7, `/model` 6, `/rename` 5, `/effort` 4)                                                                                                                                             | Transcripts                       |
| Manual context compactions                                                | 15, eight in the orchestrator session                                                                                                                                                                                 | Transcripts                       |
| Assistant turns (main sessions)                                           | 2,652                                                                                                                                                                                                                 | Transcripts                       |
| Tool calls (main sessions)                                                | 3,087                                                                                                                                                                                                                 | Transcripts                       |
| Tool results flagged as errors                                            | 80                                                                                                                                                                                                                    | Transcripts                       |
| Orchestrator session alone                                                | 25.6 hours open, 86 human messages, 1,301 turns, 1,508 tool calls, 15 subagent spawns, all 19 Keelson runs, 36 of 38 tracker publishes, 315 of 321 `bd` commands                                                      | Transcripts                       |
| Subagents spawned with the Agent tool                                     | 27 (24 general-purpose, 2 Explore, 1 Codex rescue)                                                                                                                                                                    | Transcripts                       |
| Subagent transcripts including the concept-review workflow's 22 reviewers | 50; 829 assistant turns, 1,258 tool calls                                                                                                                                                                             | Transcripts                       |
| Peer Claude sessions                                                      | 3 (fact-check reviewer, Start page rebuild, beads rib fixes)                                                                                                                                                          | Transcripts                       |
| Messages exchanged with peer sessions                                     | 13 received, 31 sent                                                                                                                                                                                                  | Transcripts                       |
| Browser tool calls by the orchestrator                                    | 175 JavaScript probes, 126 screenshots and clicks, 71 navigations                                                                                                                                                     | Transcripts                       |
| Models behind the orchestrator                                            | Claude Fable 5.1 for 1,987 turns, Claude Opus 5 for 664 (the first two days)                                                                                                                                          | Transcripts                       |
| Codex review rounds pasted as prompts                                     | 15                                                                                                                                                                                                                    | Transcripts                       |
| Design conversations pasted from ChatGPT (GPT-6 Astra)                    | 8                                                                                                                                                                                                                     | Transcripts and the owner's brief |
| Codex review branches                                                     | 4 `codex/review-*` branches; 4 review documents merged; 3 commits on one branch never merged                                                                                                                          | Git                               |
| Codex as implementer                                                      | the five-file prototype, the source layout and first review response (Day 1, before the first Claude session), and the lesson 01 rebuild (Day 3); 710 responses across 7 tasks, 138 at medium effort and 572 at xhigh | Codex task ledger                 |
| NotebookLM generations handed over                                        | 5 (three deep-dive attempts, a brief, a video)                                                                                                                                                                        | Transcripts                       |
| Gemini image generations                                                  | 6 images with prompts kept in `docs/reference/`                                                                                                                                                                       | Repository                        |

## Tokens and cost

The full breakdown by channel, model, role, and day, with the accounting rules, is in [usage/README.md](usage/README.md). The cutoff for every cross-channel figure is the Pages run for `62be86e`, Day 4 at 11:41 CDT.

| Measure                                    | Value                                                                                                                         | Source      |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | ----------- |
| Output tokens, main sessions               | 2,250,628                                                                                                                     | Transcripts |
| Cache-read input tokens, main sessions     | 596,907,597                                                                                                                   | Transcripts |
| Cache-creation input tokens, main sessions | 7,420,100                                                                                                                     | Transcripts |
| Uncached input tokens, main sessions       | 53,028                                                                                                                        | Transcripts |
| Subagent output tokens                     | 84,775 (86.2 M cache reads)                                                                                                   | Transcripts |
| Claude Code cost ledger                    | $251.07 across the ten sessions that logged a cost line                                                                       | Transcripts |
| Keelson model time (all training runs)     | about 364 minutes of model calls; 5.6 M uncached input tokens and 1.3 M output tokens, metered by the GitHub Copilot provider | Keelson     |
| Codex, Astra, NotebookLM, Gemini image     | on their own subscriptions; not metered here                                                                                  |             |

The transcript cost lines are the CLI's own running total per session and are indicative, not a bill.

## Keelson

| Measure                                                         | Value                                                                                                                                                         | Source                  |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| Workflow runs on the project                                    | 17 beads-work runs recorded, 1 beads-next, 2 smoke tests; the orchestrator issued 18 beads-work calls, one of which did not register                          | Keelson and transcripts |
| beads-work outcomes                                             | 13 succeeded, 3 cancelled by the orchestrator, 1 failed at start (a missing Copilot platform package)                                                         | Keelson                 |
| Run duration, successful                                        | 16 to 53 minutes, median 26 (the Day 3 memory's "35 to 60" was an estimate)                                                                                   | Keelson                 |
| Subagent duration, worktree tasks                               | 11 to 16 minutes (n = 5); the Day 4 contact-sheet task 6 minutes                                                                                              | Transcripts             |
| Model calls per successful run                                  | 16 or 17                                                                                                                                                      | Keelson                 |
| Nodes per run                                                   | 46 (41 in the first two runs, before the rib gained a dependency audit and trailer scrub)                                                                     | Keelson                 |
| Implementation node                                             | gpt-5.6-sol at xhigh effort, 14.6 minutes average                                                                                                             | Keelson                 |
| Plan, triage, coverage nodes                                    | gpt-6-astra at xhigh effort                                                                                                                                   | Keelson                 |
| Review lanes (correctness, conventions, coverage) and re-review | gpt-5.6-terra at xhigh and high effort                                                                                                                        | Keelson                 |
| Classify, brief extraction, report                              | gpt-5.6-luna, claude-haiku-4.5, claude-sonnet-5                                                                                                               | Keelson                 |
| PR creation                                                     | claude-sonnet-5 (8), claude-haiku-4.5 (2), gpt-5.6-sol (2), claude-opus-5 (1)                                                                                 | Keelson                 |
| Plans approved with corrections                                 | 13 of 13                                                                                                                                                      | Keelson                 |
| Review-lane candidates                                          | 27 across 13 runs (18 medium, 8 low, 1 high); 12 runs had at least one candidate                                                                              | Keelson                 |
| Node order inside a run                                         | implement, validate, create the draft PR, then the three review lanes on the captured diff, triage, fixes, re-review, then the Copilot review request         | Keelson node timings    |
| Triage verdicts                                                 | 12 "ship ready, no must-fix"; 1 must-fix (browser regression coverage), whose Playwright remedy the orchestrator's fix pass removed as a forbidden dependency | Keelson and Git         |
| Runs in parallel at the Day 3 peak                              | 3                                                                                                                                                             | Keelson                 |
| Pull requests from runs                                         | #5 to #16 and #18                                                                                                                                             | GitHub                  |

Run ledger, successful beads-work runs, CDT:

| Bead                                             | Started   | Minutes | PR  |
| ------------------------------------------------ | --------- | ------: | --- |
| fn-cca Lesson 02 in the frozen grammar           | Sun 12:43 |      35 | #5  |
| fn-bye Lesson 03 with the cache-down trace       | Sun 12:43 |      32 | #6  |
| fn-kbc Redis and Table Storage boundary          | Sun 14:06 |      16 | #7  |
| fn-loo Readiness as distinct signals             | Sun 14:07 |      21 | #8  |
| fn-0wv Three evidence drawer defects             | Sun 14:08 |      28 | #9  |
| fn-p2j Claim-specific evidence                   | Sun 14:31 |      28 | #10 |
| fn-e7u Learner-facing language                   | Sun 14:32 |      30 | #11 |
| fn-jy3 CIMPL comparison prototype                | Sun 15:03 |      21 | #12 |
| fn-u9u Try it band                               | Sun 15:04 |      26 | #13 |
| fn-bhr Lesson 01 reading flow (second attempt)   | Sun 17:06 |      23 | #14 |
| fn-tbt Selectors into the map workspace          | Sun 22:22 |      33 | #15 |
| fn-j9v Quiet Go deeper, lesson 07 as field check | Sun 22:58 |      25 | #16 |
| fn-m7u One Go deeper shelf                       | Mon 08:51 |      53 | #18 |

## beads

| Measure                                            | Value                                                                                        | Source               |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------- |
| Tracker initialised                                | Sun 11:07                                                                                    | Git and tracker      |
| Issues at the build tip                            | 81: 77 closed, 4 open, none blocked (the case-study beads added afterwards are excluded)     | Tracker              |
| Types                                              | task 49, bug 13, feature 12, epic 5, decision 1, chore 1                                     | Tracker              |
| Priorities                                         | P1 13, P2 58, P3 9, P4 1                                                                     | Tracker              |
| Created per day (CDT)                              | Sun 71, Mon 10                                                                               | Tracker              |
| Wall clock from first bead to last close           | 24 h 32 min                                                                                  | Tracker              |
| Median create-to-close                             | 42.9 minutes (quartiles 10.3 / 42.9 / 75.7)                                                  | Tracker              |
| Closed within an hour                              | 52 of 77                                                                                     | Tracker              |
| Median claim-to-close                              | 14.2 minutes                                                                                 | Tracker              |
| Issues with acceptance criteria                    | 50 (median 268 characters)                                                                   | Tracker              |
| Median description length                          | 570 characters                                                                               | Tracker              |
| Close reasons citing a commit / a PR               | 46 / 29 of 70                                                                                | Tracker              |
| Empty close reasons                                | 7, all superseded duplicates                                                                 | Tracker              |
| Beads created before the commit that closed them   | 41 of 49 checkable; the 8 others are verification beads or fixes recorded within two minutes | Tracker and Git      |
| Dependency edges                                   | 35: 20 blocks, 8 parent-child, 7 supersedes                                                  | Tracker              |
| Beads annotated by Keelson runs                    | 9                                                                                            | Tracker              |
| Comments (review agents fanning findings to beads) | 17 on 12 issues                                                                              | Tracker              |
| Memories                                           | 4                                                                                            | Tracker              |
| Hours the JSONL export was tracked in git          | under 5                                                                                      | Git                  |
| Silent closure reverts                             | 2 incidents (export re-import, then git hooks)                                               | Tracker and memories |
| `bd` commands run by the orchestrator              | 321: close 61, show 58, update 55, create 43, list 38, dep 30                                | Transcripts          |
| Open at the end                                    | fn-29r pilot, fn-dt3 fork walkthrough, fn-y2o recordings, fn-kwp reading-flow check          | Tracker              |

## The tracker artifact

| Measure                          | Value                                                                               | Source                   |
| -------------------------------- | ----------------------------------------------------------------------------------- | ------------------------ |
| Publishes                        | 38                                                                                  | Transcripts              |
| Numbered revisions               | 23 (revisions 1 to 3 on Day 2 and early Day 3; 4 to 14 on Day 3; 15 to 23 on Day 4) | The artifact's changelog |
| Length at revision 23            | about 13,500 words, 35 printed pages                                                | The PDF in this folder   |
| Became the design record         | Sun 11:54                                                                           | Transcripts              |
| Reviews that cite it by revision | 2 (Try it plan review, revision 6; polish verification, revision 14)                | Reviews                  |

## Reviews

| Measure                                            | Value                                                                                                     | Source                  |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------- |
| Review documents in the repository                 | 9                                                                                                         | `docs/process/reviews/` |
| Concept review                                     | 10 lenses, each verified, 91 surviving findings, 1 blocking                                               | The document            |
| Copilot PR reviews                                 | 13, on exactly the 13 Keelson PRs; 9 inline comments, 3 posted before the PR merged (#5, #18) and 6 after | GitHub                  |
| Human or Codex comments on pull requests           | 0                                                                                                         | GitHub                  |
| Findings from the peer fact-check                  | 21                                                                                                        | Transcripts             |
| Follow-up beads filed by the implementation review | 7                                                                                                         | Tracker                 |
| Items judged by the field-guides critic            | 19; 3 posters retired                                                                                     | Transcripts             |

## Rework visible in the record

| Item                                     | Built                             | Removed                                                                                                                          | Source                  |
| ---------------------------------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| You are Here bar                         | Fri night                         | Fri 22:59, within the hour                                                                                                       | Transcripts             |
| On-the-map jump navigation               | Sat morning                       | Sat 09:14                                                                                                                        | Transcripts             |
| Orientation recording                    | 4 generations, Sat 12:00 to 15:10 | Orientation and brief taken off the Audio deep dives listing Sun 19:09; both stay in the content and Start still plays the brief | Git and transcripts     |
| Explore map mode                         | Sun, in the lesson 01 prototype   | Mon 08:36                                                                                                                        | Tracker and transcripts |
| Three generated posters                  | supplied Sat                      | Retired Sun 19:33                                                                                                                | Tracker                 |
| Playwright browser test                  | added by a Keelson run Sun 13:07  | removed in the orchestrator's fix pass                                                                                           | Git and Keelson         |
| Beads closures                           |                                   | reverted twice Sun 13:05 to 18:01                                                                                                | Tracker                 |
| beads-work run for the field guides page | started Mon 11:04                 | cancelled at 11:06 in favour of a subagent                                                                                       | Keelson and transcripts |
