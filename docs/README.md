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

| Path                  | What it is                                                                                                                                                                                                       |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `case-study/`         | The hackathon case study: how a software factory of Claude, OpenAI, and Copilot agents built the site with a person in the loop, what it cost, what worked, and what did not. Start with `case-study/README.md`. |
| `process/reviews/`    | The nine external review documents, preserved verbatim. Responses are recorded in the iteration records, never in the reviews.                                                                                   |
| `process/iterations/` | What changed in each iteration and why, one file per round.                                                                                                                                                      |
| `process/plans/`      | Plans that were agreed before an iteration was built.                                                                                                                                                            |

`process/README.md` maps each review to the iteration that answered it.
