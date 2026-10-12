# Fieldnotes: the video series

One short narrated video per lesson, scripted from the lesson's own content, and built in motion for each idea. The design is the proposal page _Fieldnotes Video Series_; this folder is the part production reads: the series map, the shape every script follows, the spoken forms, and one storyboard per episode.

The training site owns what is said. The video library at `~/workspace/videos` (folder `fieldnotes/`) owns how it is made: voice, boards, compose, QA, and publish. A storyboard here is approved before the library voices a line of it, and every cut is watched in full before it is published.

## The series

| Fieldnote | Lesson                   | Form          | Storyboard                                               | Status                                  |
| --------- | ------------------------ | ------------- | -------------------------------------------------------- | --------------------------------------- |
| 00        | Start: three parts       | boards        | [00-three-parts.md](00-three-parts.md)                   | published                               |
| 01        | Anatomy of a stack       | boards        | [01-anatomy-of-a-stack.md](01-anatomy-of-a-stack.md)     | published                               |
| 02        | How it comes to life     | mixed         | [02-how-it-comes-to-life.md](02-how-it-comes-to-life.md) | approved; take being recorded           |
| 03        | The SPI boundary         | boards + code | [03-the-spi-boundary.md](03-the-spi-boundary.md)         | published                               |
| 04        | The shape of the fork    | mixed         |                                                          | after the claim migration for lesson 04 |
| 05        | A day in the fork        | mixed         |                                                          | after the claim migration for lesson 05 |
| 06        | The handshake            | boards        |                                                          | drawn; the run stays illustrative       |
| 07        | Things that are not true | boards        |                                                          | after 04 and 05                         |

## Script shape

Every lesson episode follows the lesson's content model in this order. Each beat comes from one field, and the spoken text is the lesson's own wording adapted for speech.

| Beat           | Taken from                   | On screen                                                              |
| -------------- | ---------------------------- | ---------------------------------------------------------------------- |
| Prequel        | episode number and title     | the notebook push-in; the gears turn as the tag `FIELDNOTE NN` sets    |
| Question       | `question`                   | a blank map sheet                                                      |
| Standfirst     | `subhead`                    | the scene's outline draws                                              |
| Claim, chapter | `outcomes[n]`                | the claim's `focus` at full weight and its `scopes` lit, as on the map |
| Example        | `example.hops`               | a dot traces the hops                                                  |
| Easy mistake   | `mistakes` into `myths.js`   | the quoted claim with its owner chip, then what is true and the check  |
| Recall         | `outcomes[].headline`        | the headlines stack up                                                 |
| Next           | the next lesson's `question` | postquel                                                               |

Each claim, the example, and the easy mistake is one chapter. Chapter titles are the claim headlines, "Example: …" with the example's title, and "Easy mistake: …" with the myth's claim. The player names its chapter marks with them, so a learner who selects a claim on the map and a learner who scrubs the video see the same words.

## Identity

- **Voice:** Harper, `en-US-Harper:MAI-Voice-2.1`, one narrator, with the Keelson shorts' settings: no style, default pauses.
- **Frame:** 1920 by 1080. The site's maps are wide.
- **Sheet:** the site's paper (`--paper #f4f7fa`) with a faint field-notes rule, ink `#102b43`, owner colors from `src/styles/base.css`, orange only for fork-owned source. DM Sans and Manrope.
- **Prequel:** an open field notebook on the desk, the camera pushing into the page until its gears register on the series emblem, the machinery gears from `docs/reference/start/machinery.png` cut into layers that turn one tooth as the tag `FIELDNOTE NN · TITLE` sets. About 5 seconds, carrying the line "Fieldnote one. Anatomy of a stack."
- **Postquel:** "Next" and the next lesson's question on the notebook's empty left page, then the camera pulls back to the spread with the series name. Nothing advances on its own.
- **Motion:** each idea is a concept scene built in vector motion, never a held screenshot.
- **Independent of the site's look:** no episode shows the site's interface or its map drawings. The series shares the site's palette and fonts, and the site may later take visual ideas from the videos, so a cut must not tie the two together.
- **Generated art:** illustrations made with Gemini image models, and the notebook still behind the bookends, kept with their prompts in the video library. They set mood, metaphor, and summary; they assert nothing the lesson does not state, carry no generated text, and use owner colors only where the lesson assigns an owner.
- **Captions:** a VTT track from the narration's word times, not burned in. A second VTT carries the chapters.
- **Sound:** one series audio bed under the prequel, with the episode line spoken over it, and a matching bed under the postquel. No music under narration.

## Spoken forms

Written into each line's `ssml` field.

| Written                         | Spoken                             |
| ------------------------------- | ---------------------------------- |
| OSDU                            | O S D U                            |
| SPI, spi up                     | S P I, S P I up                    |
| AKS                             | A K S                              |
| Cosmos DB                       | Cosmos D B                         |
| API                             | A P I                              |
| opendes                         | open dez (to confirm)              |
| CIMPL                           | simple (to confirm)                |
| osdu-image-lock                 | the O S D U image lock             |
| fork_upstream, fork_integration | fork upstream, fork integration    |
| osdu-spi-stack, osdu-spi        | O S D U S P I stack, O S D U S P I |
| CLI                             | C L I                              |
| getPartition, safeGet           | get partition, safe get            |
| partition-core                  | partition core                     |
| JAR                             | jar                                |
| 401, 403                        | four oh one, four oh three         |

## What never appears on screen

Subscription and tenant ids, a real environment name (written `<name>`), personal names, and tokens. Boards draw only what the lesson's map draws at its rung of the ladder.

## Keeping a cut true

When a cut is published, its entry in `src/content/videos.js` records the claim headlines and sentences, the myth id, and the next lesson's question as they stood. `npm test` fails when the lesson changes after the cut, naming the episode and field. The fix is a re-cut from a revised storyboard, or a source-check note on that chapter.
