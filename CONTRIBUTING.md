# Working on OSDU Fieldnotes

Install the pinned tools with `npm ci`, then start `npm run dev`. Work in `src/`; the development preview updates when you save. The development and preview servers listen only on the local machine.

## Where to make a change

| Change                                                                              | File or directory                  |
| ----------------------------------------------------------------------------------- | ---------------------------------- |
| Chapter titles, introductions, comparison records, source keys, or navigation order | `src/content/chapters.js`          |
| Optional Try it activity data                                                       | `src/content/chapters.js`          |
| Episodes, their markers, source-check notes, and notebook links                     | `src/content/audio.js`             |
| Things that are not true                                                            | `src/content/myths.js`             |
| Poster captions, takeaways, and field-guide summaries                               | `src/content/posters.js`           |
| A native field guide or specialized comparison drawing                              | `src/components/infographics.js`   |
| Page layouts and chapter-local disclosure rendering                                 | `src/components/pages.js`          |
| Player and dock behavior                                                            | `src/components/player.js`         |
| Explanation shown when a component is selected                                      | `src/content/component-details.js` |
| Creation-step copy, command examples, and ownership                                 | `src/content/creation-moments.js`  |
| The five moments of a day in the fork                                               | `src/content/fork-moments.js`      |
| Azure / AKS map and creation-step interaction                                       | `src/components/architecture.js`   |
| SPI and engineering-system diagrams                                                 | `src/components/diagrams.js`       |
| Shared clickable component markup                                                   | `src/components/node.js`           |
| Chapter-aware evidence resolution                                                   | `src/components/evidence.js`       |
| Page frame and chapter-local comparison slot                                        | `src/index.html`                   |
| Chapter navigation, comparison population, and detail-panel behavior                | `src/main.js`                      |
| Typography, colors, spacing, and responsive layout                                  | `src/styles/`                      |

Chapter order follows the entries in `chapters.js`, grouped by `group` (`start`, `learn`, `supplement`). A chapter is either `kind: 'map'` (a diagram renderer plus the inspector) or `kind: 'page'` (a renderer in `pages.js`). To add a map chapter, give it a stable route key, select or add a diagram renderer, and connect its component explanations; list any field guides it should show beneath the map in `guides`. Keep existing route keys stable so bookmarked chapters continue to work. Routes are parsed in `src/router.js`; examples are `#bring-up/remove`, `#fork-day/cascade?detail=labels`, and `#running-stack/request?detail=events`. A chapter that has been split or renamed keeps its old key in `chapterAliases` so published links still resolve. A chapter-only lifecycle link always starts at the empty footprint.

Structured lessons use compact claim controls above the map. Selecting a claim updates the full sentence, reason, and map emphasis in place; selecting it again is idempotent. Only the explicit **How we know** link opens evidence. Structured lessons add zero-based selection qualifiers when intent would otherwise be ambiguous: claim evidence uses `?detail=azureimpl&claim=0`, while a trace uses `?detail=azureimpl&hop=3`. Unqualified legacy URLs remain valid; when a component matches both, claim evidence wins, otherwise a matching hop restores the trace.

A lesson whose subject is a lifecycle sets `lesson: 'lifecycle'` on its chapter; today only `bring-up` does. Its stage bar is the main control: a stage link updates the map, the stage explanation, its **Look closer** evidence entry, and the easy mistake together, and leaves that explanation readable just below the sticky stage bar. The one bottom control is labeled `Continue to <next stage> →`, brings the next stage's explanation into view, and moves focus to its heading; the last stage has none. Its claims render as statements (headline and reason) with no selection state, still feed **What you can now say**, and keep their published `?claim=` evidence routes resolving. There is no Lesson focus toggle; nothing recedes unless a running-example hop is traced. An easy mistake whose collection route points at another lesson can name an in-lesson target with `here: { '<chapter>': '<route>' }` in `myths.js`.

Every map lesson with a running example renders it as a collapsed native disclosure after the lesson outcomes, exit, and optional Try it band. This applies to structured and unstructured lessons. A bare lesson route leaves it closed; a matching hop route opens it and restores the trace. Expanding or collapsing the disclosure alone changes no route or stored state.

Each component detail contains `label`, `title`, `body`, `artifact: { label, code }`, and a `source` key from `src/content/sources.js`. `resolveDetail` overlays an optional `here[chapterKey]` record without changing the base detail. `label` remains metadata and is the fallback for drawer context; it never implies ownership. Add `owner` only when the source or runtime owner is explicit. The complete owner row stays hidden when `owner` is absent.

Use `summary` for an authored initial explanation and `more` only for deliberately optional detail. Without `summary`, the drawer shows the complete `title` and `body`; it does not split prose at punctuation or create an automatic disclosure. Source links always put the primary `source` first, then unique `goDeeper` keys in authored order.

A chapter-local comparison keeps its authored record in `chapters.js`, its specialized native figure in `infographics.js`, and its disclosure wrapper in `pages.js`. Cite community implementation behavior from the service repository, environment bindings from the stack configuration, and identify both with pinned source snapshots.

A diagram button's `data-detail` must match a key in that content. Audio markers, field checks, and poster links use site routes; the integrity checks parse each route and confirm that a `detail` names a component on that map and a `guide` names a field guide. They also catch missing explanations, duplicate component IDs within a scene, broken chapter-to-renderer connections, missing poster and audio files, and missing source files when sibling checkouts are present.

The transcript modules are generated: to regenerate one, transcribe the audio to VTT (mlx-whisper, large-v3-turbo), replace the file in `docs/reference/`, and rebuild `src/content/transcripts/<episode>.js` with the same paragraph grouping. Marker times in `audio.js` are read from the transcript. A chapter's `listen` cues must start on a marker of the episode they name; the integrity checks enforce this. Content is trusted, repository-authored material; selected fields intentionally contain HTML. Do not feed external user input into those templates.

## Authoring a Try it band

A learn chapter may carry a `tryIt` object. Omit the field until every route has been walked and its tested CLI release, stack ref, template commit, shell, operating system, and date have been recorded. Test fixtures prove the renderer contract but are not publication evidence. A present object is complete:

- `activity` is the short action, and `summary` is the one collapsed line, at most 64 characters, that starts with `Try it: <activity>` and may add one qualifier such as `· Azure charges apply`. Timings and variant access stay inside the band.
- `variants` is a nonempty ordered array. Each variant has a nonempty `label`, `result`, `effects`, and exactly one `access`: `browser only`, `workstation setup`, `public GitHub repository`, or `Azure resources billed separately`. An optional `accessNote` is a sentence that clarifies relevant conditions.
- `prerequisites` is a nonempty array of `{ text, sources }`; each `sources` list contains keys from `src/content/sources.js` so shared setup is linked instead of repeated.
- `time` has nonempty `active`, `wait`, and `cleanup` descriptions. State when waiting or cleanup does not apply; do not derive estimates from timeouts.
- `steps` is a nonempty ordered array. Each step has exactly one nonempty `command` or `click`, plus `expect` and optional source keys. The renderer shows `effects` before these steps and never executes their actions.
- `alternate` has a nonempty `observation` and `next`. `cleanup` has nonempty `steps` using the same action-and-observation shape and a nonempty `remains` statement.
- `sources` is a nonempty list of source keys for the quoted runbook, CLI help, or source artifact.
- `tested` has nonempty `cli`, `stack`, `template`, `shell`, `os`, and ISO `date` values. For a field that does not apply, write an explicit reason instead of inventing a version.
- An optional `connection` of `{ text, sources }` is a note for using an environment that already exists; it renders after the variants and links nothing on the map.

Multiple variants are complete alternatives, such as lesson 02's route in your own subscription and its route without Azure; list the primary route first. Commands use only the running example's partition name (`opendes`) and marked placeholders such as `<name>` for the environment; the site names no environment, because each learner creates their own with `--name`. Keep prerequisites sufficient to start the activity, state resource effects before steps, and identify what remains after cleanup. The site must not promise that an activity is free, execute a command, imply live state, or track completion.

The transcript modules are generated: to regenerate one, transcribe the audio to VTT (mlx-whisper, large-v3-turbo), replace the file in `docs/reference/`, and rebuild `src/content/transcripts/<episode>.js` with the same paragraph grouping. Marker times in `audio.js` are read from the transcript. A chapter's `listen` cues must start on a marker of the episode they name; the integrity checks enforce this. Content is trusted, repository-authored material; selected fields intentionally contain HTML. Do not feed external user input into those templates.

## Validate a change

```sh
npm run format
npm run check
```

The check runs formatting validation, content integrity tests, and a production build. For an intentional visual change, review the affected chapter, component interactions, keyboard access, and a narrow layout. The learner experience contains no assessments; these checks are for the codebase.

`npm run build` regenerates `dist/`. `npm run preview` serves that build at http://127.0.0.1:4173. Generated files and installed packages are ignored by Git.

Use a focused branch and describe the learner-visible change and validation when reviewing it. Pushes to `main` publish the site to GitHub Pages through `.github/workflows/pages.yml`, which runs `npm run check` before deploying `dist/`.

## Content standards

Start from an OSDU engineer's existing knowledge, introduce each new boundary before its machinery, and keep detail optional. Prefer a diagram that explains one relationship over additional paragraphs. Cite current source documentation when describing system behavior. Record uncertainty rather than inventing a deployment guarantee.

If you confirm documentation drift, capture the source evidence and address it in the owning repository through its issue and pull-request workflow. Keep training-site changes here.

## Adding depth without adding a course

A useful detail names the thing an engineer can inspect and explains a consequence. For example, “the Git source is suspended” earns its place by naming `osdu-spi-stack-system` in `osdu-flux` and explaining that cached reconciliation continues. More paragraphs, learner questions, and completion state are not substitutes for that specificity.

Keep the overview and lifecycle on the same map renderer. When changing interaction, check one visible selected element, its matching explanation at the map, browser back/forward, reload, and a phone-sized viewport. Claim selection changes emphasis without opening evidence or moving the page; only **How we know**, a component, a hop, an explicit map jump, or a detail route opens the evidence drawer. The drawer starts closed and overlays the full-width desktop map. Below 760px it opens as a bottom sheet. Its × button and Escape close it and return focus to the opener.

Timing labels must say whether they are observations or deadlines. A 150-minute Job deadline is not evidence that a two-hour wait is healthy. External documentation links should use the published site when the source requires a documentation renderer.

Review reference material is preserved separately in `docs/concept-review.html` and `osdu-spi-stack-guide.pdf`. The review HTML is excluded from formatting. See `docs/feedback-response.md` for this iteration and `docs/audio-source-notes.md` before producing narration.
