# Fieldnotes: the video series

Short narrated videos, each built in motion around one question and ordered as a curriculum. Level 100 is five foundation episodes everyone watches in order. Level 200 is two paths: the service path for engineers who change a service, and the platform path for engineers who run the stack and the line. Level 300 is a library of deep dives, opened when a task calls for one. The design is the proposal page _Fieldnotes Curriculum_, and the look comes from _Fieldnotes Video Series_; this folder is the part production reads: the curriculum, the shape every script follows, the spoken forms, and one storyboard per episode.

The training site owns what is said. The video library at `~/workspace/videos` (folder `fieldnotes/`) owns how it is made: voice, boards, compose, QA, and publish. The library voices and cuts a storyboard from this folder with no separate approval step. No cut is published until every frame has been scanned and the cut has been watched in full; published cuts are reviewed on the site.

## The curriculum

Codes name the level and the path: 103 is the third foundation episode, S203 the third on the service path, P305 a platform deep dive. The code is shown in the sting tag and on the episode's card, and is never spoken. `src/content/curriculum.js` records the ideas each episode teaches and the myths it is home to; `npm test` fails when an idea or a myth has two homes in a path.

### Level 100: Foundations

| Code | Episode                                           | Question                                                | From                                          | Status    |
| ---- | ------------------------------------------------- | ------------------------------------------------------- | --------------------------------------------- | --------- |
| 101  | [Three parts](101-three-parts.md)                 | What is the Azure SPI machinery made of?                | Fieldnote 00, re-cut to the three parts       | published |
| 102  | [Anatomy of a stack](102-anatomy-of-a-stack.md)   | What is actually running when someone says "the stack"? | Fieldnote 01's body with new bookends         | published |
| 103  | [The provider inside](103-the-provider-inside.md) | Where does the Azure code live in a service?            | Fieldnote 03's boards, without the code panes | published |
| 104  | The line                                          | How does a change reach a running service?              | new, from boards in Fieldnotes 04 and 05      | planned   |
| 105  | Two kinds of work                                 | Who does what, and which path is mine?                  | new                                           | planned   |

The service path (S201 to S207), the platform path (P201 to P208), and the library get their tables in the rounds that make them.

### Lesson cuts

The thirteen cuts made one per lesson stay published, with their routes, until the curriculum episode that replaces each one is published.

| Fieldnote | Lesson                   | Form          | Storyboard                                                       | Status                     |
| --------- | ------------------------ | ------------- | ---------------------------------------------------------------- | -------------------------- |
| 00        | Start: three parts       | boards        | [00-three-parts.md](00-three-parts.md)                           | replaced by 101            |
| 01        | Anatomy of a stack       | boards        | [01-anatomy-of-a-stack.md](01-anatomy-of-a-stack.md)             | replaced by 102            |
| 02        | How it comes to life     | mixed         | [02-how-it-comes-to-life.md](02-how-it-comes-to-life.md)         | published; re-take on 0.32 |
| 03        | The SPI boundary         | boards + code | [03-the-spi-boundary.md](03-the-spi-boundary.md)                 | replaced by 103            |
| 04        | The shape of the fork    | mixed         | [04-the-shape-of-the-fork.md](04-the-shape-of-the-fork.md)       | published                  |
| 05        | A day in the fork        | mixed         | [05-a-day-in-the-fork.md](05-a-day-in-the-fork.md)               | published                  |
| 06        | The handshake            | boards        | [06-the-handshake.md](06-the-handshake.md)                       | published                  |
| 07        | Things that are not true | boards        | [07-things-that-are-not-true.md](07-things-that-are-not-true.md) | published                  |

#### Season 2: Working the stack

Season 1 ends at one authenticated partition lookup by the deploy identity. Season 2 covers what an engineer does with a running core environment on spi 0.32: whose images it runs, who may call it, what data it holds, how ingestion runs, and how to prove a service from a workstation. Each episode is cut from the stack's own decision records and docs and paired with its lesson in the _Working the stack_ book.

| Fieldnote | Episode                 | Covers (osdu-spi-stack)                                                                    | Form        | Storyboard                                                     | Status    |
| --------- | ----------------------- | ------------------------------------------------------------------------------------------ | ----------- | -------------------------------------------------------------- | --------- |
| 08        | Whose image is running? | canonical source per service, fork `main` on GHCR, weekday refresh, 21-day age (ADR-033)   | mixed       | [08-whose-image-is-running.md](08-whose-image-is-running.md)   | published |
| 09        | Who is asking           | `spi users` roles, `spi token --me`, entitlements groups (ADR-039)                         | mixed       | [09-who-is-asking.md](09-who-is-asking.md)                     | published |
| 10        | Ready is not loaded     | `spi load` and its registry; ready, deployable, loaded, ingesting (ADR-040, ADR-030)       | mixed       | [10-ready-is-not-loaded.md](10-ready-is-not-loaded.md)         | published |
| 11        | On behalf of you        | core DAGs, registration, `on-behalf-of`, `spi test dags --report` (ADR-044)                | mixed       | [11-on-behalf-of-you.md](11-on-behalf-of-you.md)               | published |
| 12        | Prove it from your desk | `spi test <service>`, `--report`, `--review`, `spi build`, `pin --source` (ADR-036 to 038) | footage-led | [12-prove-it-from-your-desk.md](12-prove-it-from-your-desk.md) | published |

The season shares one take day: a throwaway core environment on 0.32, which also re-records Fieldnote 02 through Ready and a successful lookup (its 12 October take stalled at 20 of 29 on an image lineage the stack has since retired).

## Episode shape

Every curriculum episode follows this order. The storyboard is written once, and the episode and its companion page are both made from it.

| Beat                         | Spoken                                                          | On screen                                                                                 |
| ---------------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Cold open, when there is one | the result, in a line or two                                    | the result itself: the last lines of a take, or the finished board                        |
| Prequel and sting            | the track and the title: "Foundations. Anatomy of a stack."     | the notebook push-in; the gears turn as the tag `FIELDNOTE 102 · ANATOMY OF A STACK` sets |
| Question                     | the question the episode answers                                | the question on a clean sheet                                                             |
| Beats, two or three          | one idea each, in the companion page's words adapted for speech | a concept scene built for each idea                                                       |
| Easy mistake, only at home   | the myth, what is true, and the check                           | the quoted claim with its owner chip, then what is true and the check                     |
| Recall                       | one line: "So now you can say: …"                               | the line on the sheet                                                                     |
| Next                         | the next episode's question                                     | the postquel: "Next", the next episode's code and title, and its question                 |

The tracks are spoken as "Foundations" (101 to 105), "Service path" (S2), "Platform path" (P2), and "Deep dive" (level 300). Next names the next episode in the viewer's path. 105 closes on the choice of path: S201 for engineers who change a service, P201 for engineers who run the stack and the line. A library episode closes on the episode it builds on or the next one a task leads to.

Each beat, a traced example, and the easy mistake is one chapter, titled as on the companion page: the claim headline, "Example: …" with the example's title, and "Easy mistake: …" with the myth's claim. The player names its chapter marks with them, so a learner who selects a claim on the map and a learner who scrubs the video see the same words.

Each level has its own depth:

| Level | Shows                                                               | Leaves out                                    |
| ----- | ------------------------------------------------------------------- | --------------------------------------------- |
| 100   | the model and the words: the parts, their owners, where things live | flags, exit codes, edge cases, and code panes |
| 200   | real commands and their output, the usual path, and one failure     | the mechanism under a command                 |
| 300   | the mechanism: code, logs, and decision records                     |                                               |

Five rules keep an idea from being taught twice:

- **One home per idea.** An idea is taught once in a path. A later episode names its home in a sentence ("you brought this environment up in S201") and moves on.
- **Each path stands alone.** An idea both paths need at the same depth lives in level 100. A practical detail both need, such as reading a green Validation Summary, is taught once in each path.
- **Examples advance.** An example is traced in full once. The service path's example is the viewer's own environment and change; the platform path follows one fork and the shared environment. A request's path through the stack is traced in 102 and nowhere else.
- **Each idea is said once.** No standfirst previews the beats, and the recall is one line, not the headlines again.
- **Mistakes live at home.** An easy mistake appears in the episode that is its idea's home: at most one in a level 100 or 200 episode, while a level 300 episode about failure may carry several.

## Identity

- **Voice:** Harper, `en-US-Harper:MAI-Voice-2.1`, one narrator, with the Keelson shorts' settings: no style, default pauses.
- **Frame:** 1920 by 1080. The site's maps are wide.
- **Sheet:** the site's paper (`--paper #f4f7fa`) with a faint field-notes rule, ink `#102b43`, owner colors from `src/styles/base.css`, orange only for fork-owned source. DM Sans and Manrope.
- **Prequel:** an open field notebook on the desk, the camera pushing into the page until its gears register on the series emblem, the machinery gears from `docs/reference/start/machinery.png` cut into layers that turn one tooth as the tag `FIELDNOTE <code> · TITLE` sets. About 5 seconds, carrying the track and the title: "Foundations. Anatomy of a stack."
- **Postquel:** "Next", the next episode's code and title, and its question on the notebook's empty left page, then the camera pulls back to the spread with the series name. Nothing advances on its own.
- **Motion:** each idea is a concept scene built in vector motion, never a held screenshot.
- **Independent of the site's look:** no episode shows the site's interface or its map drawings. The series shares the site's palette and fonts, and the site may later take visual ideas from the videos, so a cut must not tie the two together.
- **Generated art:** illustrations made with Gemini image models, and the notebook still behind the bookends, kept with their prompts in the video library. They set mood, metaphor, and summary; they assert nothing the lesson does not state, carry no generated text, and use owner colors only where the lesson assigns an owner.
- **Captions:** a VTT track from the narration's word times, not burned in. A second VTT carries the chapters.
- **Sound:** the bright-mallets cue under the prequel (`kit/generated/audio/bed-prequel-mallets.wav` in the video library), with the episode line spoken over it, and its matching bed under the postquel (`bed-postquel-mallets.wav`). Under narration, only the series' under-narration bed (`kit/generated/audio/under/`), and only beneath a traced example, a recall, a cold open, or footage of a proof: ducked 10 dB under every line, cut at 2 kHz, and at least 7 dB under the voice in 1 to 4 kHz by `film aqa`. Never under code or a log the viewer has to read.
- **Production line:** Keelson's `film` (the `film-cut` workflow, `film compose`, `film review`) from the series' `series.yaml` in the video library. Every cut keeps a cut record, so `film_status` flags a cut whose storyboard, takes, or boards changed after it.

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

When a cut is published, its entry in `src/content/videos.js` records the claim headlines and sentences, the myth id, and the next lesson's question as they stood. `npm test` fails when the lesson changes after the cut, naming the episode and field. The fix is a re-cut from a revised storyboard, or a source-check note on that chapter; when the next question changes, the note is on the whole video and quotes the new question verbatim.

The Azure provider used to live upstream and now lives in each service's fork. Say where it lives now, in the present tense, and give the past one clause at most. Never narrate the removal as an event or a process: no "plans to", "has begun", or "survives upstream deleting it", and no dates or per-service lists on screen or in lesson copy. The dated evidence goes in the storyboard's take notes, the cut's `NOTES.md`, a source-check note, or `docs/README.md`.
