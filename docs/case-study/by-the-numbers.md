# By the numbers

Every figure in the [case study](README.md) with its source. Times are America/Chicago (CDT) unless marked UTC. The records were mined on 14 September 2026 at the repository tip `62be86e`.

Sources:

- **Transcripts.** The thirteen Claude Code session files for this project and their fifty subagent transcripts, parsed line by line. Human turns are user messages with text that are not tool results, slash commands, or system-injected output.
- **Tracker.** `bd list --all --json`, `bd memories`, and the passive exports `.beads/issues.jsonl` and `.beads/interactions.jsonl`.
- **Git and GitHub.** `git log --numstat`, `gh pr list --state all`, `gh run list`, and the review and comment endpoints for every pull request.
- **Keelson.** The `workflow_runs`, `workflow_node_outputs`, and `usage_events` tables in the workbench's own database.

## Span

| Measure                                       | Value                        | Source      |
| --------------------------------------------- | ---------------------------- | ----------- |
| First session opened                          | Thu 11 Sep 17:10             | Transcripts |
| First commit                                  | Thu 11 Sep 17:29             | Git         |
| Last commit of the build                      | Sun 14 Sep 11:36             | Git         |
| Calendar days with commits                    | 4                            | Git         |
| Hours with a commit on Saturday               | 12 of 12 from 11:00 to 23:00 | Git         |
| Commits between midnight and 08:00 on any day | 0                            | Git         |

## Volume

| Measure                                          | Value                                                                                                         | Source         |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | -------------- |
| Commits                                          | 196 (176 non-merge, 20 merges)                                                                                | Git            |
| Commits per day                                  | Thu 9, Fri 19, Sat 152, Sun 16                                                                                | Git            |
| Commits in the two hours 14:00 to 16:00 Saturday | 67                                                                                                            | Git            |
| Commit types                                     | feat 73, docs 38, refactor 23, fix 18, chore 8, test 7, style 7                                               | Git            |
| Lines added and removed                          | +49,229 / −11,283 (includes generated transcripts)                                                            | Git            |
| Ten largest commits                              | all on Thursday and Friday; four are successive orientation-episode replacements within three hours on Friday | Git            |
| Commits touching the content test                | 106 of 176                                                                                                    | Git            |
| Commits touching AGENTS.md                       | 46                                                                                                            | Git            |
| AGENTS.md at the end                             | 4,518 words                                                                                                   | `wc`           |
| Pull requests                                    | 24, all merged                                                                                                | GitHub         |
| Median time from PR open to merge                | 6 minutes                                                                                                     | GitHub         |
| PRs opened and merged in the same minute         | 11, all orchestrator branches                                                                                 | GitHub         |
| PRs open longer than 45 minutes                  | 2 (#3 at 55 min, #18 at 48 min)                                                                               | GitHub         |
| GitHub Actions runs                              | 96: 83 Pages deploys, 13 Copilot reviews                                                                      | GitHub         |
| Failed runs                                      | 0 (one Pages run cancelled by a superseding push)                                                             | GitHub         |
| Deployed site                                    | https://danielscholl-osdu.github.io/osdu-spi-training/                                                        | Pages workflow |

## People and agents

| Measure                                                                   | Value                                                                                                                                                            | Source                            |
| ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| Human messages to the orchestrator (all sessions)                         | about 150 (137 by the strict count; 150 including absolute file paths dropped in as prompts)                                                                     | Transcripts                       |
| Human messages per day                                                    | Thu 16, Fri 27, Sat 73, Sun 21                                                                                                                                   | Transcripts                       |
| Slash commands typed                                                      | 41 (`/compact` 15, `/sdlc:prime` 7, `/model` 6, `/rename` 5, `/effort` 4)                                                                                        | Transcripts                       |
| Manual context compactions                                                | 15, eight in the orchestrator session                                                                                                                            | Transcripts                       |
| Assistant turns (main sessions)                                           | 2,652                                                                                                                                                            | Transcripts                       |
| Tool calls (main sessions)                                                | 3,087                                                                                                                                                            | Transcripts                       |
| Tool results flagged as errors                                            | 80                                                                                                                                                               | Transcripts                       |
| Orchestrator session alone                                                | 25.6 hours open, 86 human messages, 1,301 turns, 1,508 tool calls, 15 subagent spawns, all 19 Keelson runs, 36 of 38 tracker publishes, 315 of 321 `bd` commands | Transcripts                       |
| Subagents spawned with the Agent tool                                     | 27 (24 general-purpose, 2 Explore, 1 Codex rescue)                                                                                                               | Transcripts                       |
| Subagent transcripts including the concept-review workflow's 22 reviewers | 50; 829 assistant turns, 1,258 tool calls                                                                                                                        | Transcripts                       |
| Peer Claude sessions                                                      | 3 (fact-check reviewer, Start page rebuild, beads rib fixes)                                                                                                     | Transcripts                       |
| Messages exchanged with peer sessions                                     | 13 received, 31 sent                                                                                                                                             | Transcripts                       |
| Browser tool calls by the orchestrator                                    | 175 JavaScript probes, 126 screenshots and clicks, 71 navigations                                                                                                | Transcripts                       |
| Models behind the orchestrator                                            | Claude Fable 5.1 for 1,987 turns, Claude Opus 5 for 664 (the first two days)                                                                                     | Transcripts                       |
| Codex review rounds pasted as prompts                                     | 15                                                                                                                                                               | Transcripts                       |
| Design conversations pasted from ChatGPT (GPT-6 Astra)                    | 8                                                                                                                                                                | Transcripts and the owner's brief |
| Codex review branches                                                     | 4 `codex/review-*` branches; 4 review documents merged; 3 commits on one branch never merged                                                                     | Git                               |
| Codex as implementer                                                      | 1 run (lesson 01, GPT-6 Astra at medium effort)                                                                                                                  | Transcripts                       |
| NotebookLM generations handed over                                        | 5 (three deep-dive attempts, a brief, a video)                                                                                                                   | Transcripts                       |
| Gemini image generations                                                  | 6 images with prompts kept in `docs/reference/`                                                                                                                  | Repository                        |

## Tokens and cost

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

| Measure                                                         | Value                                                                                                       | Source          |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------- |
| Workflow runs on the project                                    | 19: beads-work 18, beads-next 1 (plus two smoke tests)                                                      | Keelson         |
| beads-work outcomes                                             | 13 succeeded, 3 cancelled by the orchestrator, 1 failed at start (a missing Copilot platform package)       | Keelson         |
| Run duration, successful                                        | 16 to 53 minutes, median 26                                                                                 | Keelson         |
| Model calls per successful run                                  | 16 or 17                                                                                                    | Keelson         |
| Nodes per run                                                   | 46 (41 in the first two runs, before the rib gained a dependency audit and trailer scrub)                   | Keelson         |
| Implementation node                                             | gpt-5.6-sol at xhigh effort, 14.6 minutes average                                                           | Keelson         |
| Plan, triage, coverage nodes                                    | gpt-6-astra at xhigh effort                                                                                 | Keelson         |
| Review lanes (correctness, conventions, coverage) and re-review | gpt-5.6-terra at xhigh and high effort                                                                      | Keelson         |
| Classify, brief extraction, report                              | gpt-5.6-luna, claude-haiku-4.5, claude-sonnet-5                                                             | Keelson         |
| PR creation                                                     | claude-sonnet-5 (8), claude-haiku-4.5 (2), gpt-5.6-sol (2), claude-opus-5 (1)                               | Keelson         |
| Plans approved with corrections                                 | 13 of 13                                                                                                    | Keelson         |
| Review-loop verdicts                                            | 12 "clean, no must-fix"; 1 must-fix (browser regression coverage) that the orchestrator's fix pass reverted | Keelson and Git |
| Runs in parallel at the Saturday peak                           | 3                                                                                                           | Keelson         |
| Pull requests from runs                                         | #5 to #16 and #18                                                                                           | GitHub          |

Run ledger, successful beads-work runs, CDT:

| Bead                                             | Started   | Minutes | PR  |
| ------------------------------------------------ | --------- | ------: | --- |
| fn-cca Lesson 02 in the frozen grammar           | Sat 12:43 |      35 | #5  |
| fn-bye Lesson 03 with the cache-down trace       | Sat 12:43 |      32 | #6  |
| fn-kbc Redis and Table Storage boundary          | Sat 14:06 |      16 | #7  |
| fn-loo Readiness as distinct signals             | Sat 14:07 |      21 | #8  |
| fn-0wv Three evidence drawer defects             | Sat 14:08 |      28 | #9  |
| fn-p2j Claim-specific evidence                   | Sat 14:31 |      28 | #10 |
| fn-e7u Learner-facing language                   | Sat 14:32 |      30 | #11 |
| fn-jy3 CIMPL comparison prototype                | Sat 15:03 |      21 | #12 |
| fn-u9u Try it band                               | Sat 15:04 |      26 | #13 |
| fn-bhr Lesson 01 reading flow (second attempt)   | Sat 17:06 |      23 | #14 |
| fn-tbt Selectors into the map workspace          | Sat 22:22 |      33 | #15 |
| fn-j9v Quiet Go deeper, lesson 07 as field check | Sat 22:58 |      25 | #16 |
| fn-m7u One Go deeper shelf                       | Sun 08:51 |      53 | #18 |

## beads

| Measure                                            | Value                                                                                        | Source               |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------- |
| Tracker initialised                                | Sat 11:07                                                                                    | Git and tracker      |
| Issues                                             | 81: 77 closed, 4 open, none blocked                                                          | Tracker              |
| Types                                              | task 49, bug 13, feature 12, epic 5, decision 1, chore 1                                     | Tracker              |
| Priorities                                         | P1 13, P2 58, P3 9, P4 1                                                                     | Tracker              |
| Created per day (CDT)                              | Sat 71, Sun 10                                                                               | Tracker              |
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

| Measure                          | Value                                                                                | Source                   |
| -------------------------------- | ------------------------------------------------------------------------------------ | ------------------------ |
| Publishes                        | 38                                                                                   | Transcripts              |
| Numbered revisions               | 23 (revisions 1 to 3 on 12 to 13 Sep; 4 to 14 on Sat 13 Sep; 15 to 23 on Sun 14 Sep) | The artifact's changelog |
| Length at revision 23            | about 13,500 words, 35 printed pages                                                 | The PDF in this folder   |
| Became the design record         | Sat 11:54                                                                            | Transcripts              |
| Reviews that cite it by revision | 2 (Try it plan review, revision 6; polish verification, revision 14)                 | Reviews                  |

## Reviews

| Measure                                            | Value                                                       | Source                  |
| -------------------------------------------------- | ----------------------------------------------------------- | ----------------------- |
| Review documents in the repository                 | 9                                                           | `docs/process/reviews/` |
| Concept review                                     | 10 lenses, each verified, 91 surviving findings, 1 blocking | The document            |
| Copilot PR reviews                                 | 13, on exactly the 13 Keelson PRs; 10 inline comments       | GitHub                  |
| Human or Codex comments on pull requests           | 0                                                           | GitHub                  |
| Findings from the peer fact-check                  | 21                                                          | Transcripts             |
| Follow-up beads filed by the implementation review | 7                                                           | Tracker                 |
| Items judged by the field-guides critic            | 19; 3 posters retired                                       | Transcripts             |

## Rework visible in the record

| Item                                     | Built                             | Removed                                    | Source                  |
| ---------------------------------------- | --------------------------------- | ------------------------------------------ | ----------------------- |
| You are Here bar                         | Thu night                         | Thu 22:59, within the hour                 | Transcripts             |
| On-the-map jump navigation               | Fri morning                       | Fri 09:14                                  | Transcripts             |
| Orientation recording                    | 4 generations, Fri 12:00 to 15:10 | Both introductory recordings cut Sat 19:09 | Git and transcripts     |
| Explore map mode                         | Sat, in the lesson 01 prototype   | Sun 08:36                                  | Tracker and transcripts |
| Three generated posters                  | supplied Fri                      | Retired Sat 19:33                          | Tracker                 |
| Playwright browser test                  | added by a Keelson run Sat 13:07  | removed in the orchestrator's fix pass     | Git and Keelson         |
| Beads closures                           |                                   | reverted twice Sat 13:05 to 18:01          | Tracker                 |
| beads-work run for the field guides page | started Sun 11:04                 | cancelled at 11:06 in favour of a subagent | Keelson and transcripts |
