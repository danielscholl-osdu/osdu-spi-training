# Documentation

Two kinds of material live here. The first supports the training site itself: scripts, narration, generation briefs, and reference assets that the site, its tests, or its posters depend on. The second is the record of how the site was built over four days in September 2026, kept for the hackathon case study.

## Site material (do not move)

| Path                                                                             | What it is                                                                                                                                                        |
| -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `audio-source-notes.md`                                                          | Marker map for every recording and the wording the narration should correct. Read it before producing narration.                                                  |
| `azure-spi-brief-script.md`                                                      | The approved script for the two-minute brief. A recording is replaced from a script like this, never by editing its transcript.                                   |
| `azure-spi-introduction-source.md`, `azure-spi-introduction-generation-brief.md` | The written source and the NotebookLM prompt behind the current introduction episode, brief, and video.                                                           |
| `azure-spi-orientation-source.md`, `azure-spi-orientation-generation-brief.md`   | The earlier orientation source and prompt, superseded the same day but kept because the recordings they produced are still in the repository.                     |
| `deep-dive-stack-script.md`, `deep-dive-fork-script.md`, `start-video-script.md` | Replacement scripts drafted for approval, with the editorial notes around each.                                                                                   |
| `narration/`                                                                     | The spoken text alone for each replacement script. This is what a narrator or generator receives.                                                                 |
| `reference/`                                                                     | Supplied posters and their site-built HTML sources, generated artwork with its prompts, transcript VTT files, and the lesson 01 prototype. Preserved as supplied. |

## Process record

| Path                  | What it is                                                                                                                                                                                                                                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `case-study/`         | The hackathon case study: how a software factory of Claude, OpenAI, and Copilot agents built the site with a person in the loop, what it cost, what worked, and what did not. Start with `case-study/README.md`; `case-study/full-record.md` is the long form and `case-study/usage/` the token and model analysis. |
| `process/reviews/`    | The ten external review documents, nine of the site and two of the case study, preserved verbatim. Responses are recorded in the iteration records, never in the reviews.                                                                                                                                           |
| `process/iterations/` | What changed in each iteration and why, one file per round.                                                                                                                                                                                                                                                         |
| `process/plans/`      | Plans that were agreed before an iteration was built.                                                                                                                                                                                                                                                               |

`process/README.md` maps each review to the iteration that answered it.

## Reviewed against

The site's technical claims were checked against pinned revisions of the source repositories. This section was kept out of the top-level README so that the case study could lead; the content test still resolves every source path against the sibling checkouts named here.

The Try it shell variants were reviewed on 16 September 2026 against `osdu-spi-stack` at `c15d9bc2cb8db9156bf2d87180c0262b97e9e16b` (installation instructions) and the existing `dc2c95638ded6459538085cfdb2ada46b692c27b` lesson walkthrough. The engineering-system checkout was `osdu-spi` at `d02dda8d383fb0e20a229d56ec56104c88082cf0`; this change makes no new engineering-system claims. [The shell review](try-it-shell-review.md) records command checks and the remaining walkthrough and browser validation.

The technical claims were last checked on 12 September 2026 against these sibling checkouts: `osdu-spi-stack` at `dc2c956`, `osdu-spi` at `080f0b8`, and `osdu-spi-partition` at `3a5690d`. The content test resolves every source path against those checkouts when they are present. When the sources move, re-check the dated statements first: the upstream Azure directory is still present, the reference fork has not adopted the newer validation lane or written its descriptor, per-service image promotion (osdu-spi-stack ADR-033) is designed but not built, and the scheduled stale-pin sweep is not wired.

The partition-lookup comparison was reviewed separately on 13 September 2026 against community Partition at `5aa406b978dec178fe05f1c9a0ee0ca02eb239b4`, community `cimpl-stack` at `fe56aa1b13e9a15aee8af97f103484f8240a9cb3`, `Azure/osdu-spi-stack` at `dc2c95638ded6459538085cfdb2ada46b692c27b`, and `Azure/osdu-spi-partition` at `3a5690da3147d022ca9a2402858cd7b96e4688cf`. The community service source establishes its lookup behavior, while `cimpl-stack` establishes the environment binding. This source review did not establish a paired deployment, match either checkout to a deployed image digest, or produce an acceptance-test result.
