# Working on OSDU Fieldnotes

Install the pinned tools with `npm ci`, then start `npm run dev`. Work in `src/`; the development preview updates when you save. The development and preview servers listen only on the local machine.

## Where to make a change

| Change                                                          | File or directory                  |
| --------------------------------------------------------------- | ---------------------------------- |
| Chapter titles, introductions, source keys, or navigation order | `src/content/chapters.js`          |
| Optional Try it activity data                                   | `src/content/chapters.js`          |
| Episodes, their markers, source-check notes, and notebook links | `src/content/audio.js`             |
| Things that are not true                                        | `src/content/myths.js`             |
| Poster captions, takeaways, and field-guide summaries           | `src/content/posters.js`           |
| A native field guide’s content or drawing                       | `src/components/infographics.js`   |
| Home, Listen, Field guides, and Not true page layout            | `src/components/pages.js`          |
| Player and dock behavior                                        | `src/components/player.js`         |
| Explanation shown when a component is selected                  | `src/content/component-details.js` |
| Creation-step copy, command examples, and ownership             | `src/content/creation-moments.js`  |
| The five moments of a day in the fork                           | `src/content/fork-moments.js`      |
| Azure / AKS map and creation-step interaction                   | `src/components/architecture.js`   |
| SPI and engineering-system diagrams                             | `src/components/diagrams.js`       |
| Shared clickable component markup                               | `src/components/node.js`           |
| Chapter-aware evidence resolution                               | `src/components/evidence.js`       |
| Page frame                                                      | `src/index.html`                   |
| Chapter navigation and detail-panel behavior                    | `src/main.js`                      |
| Typography, colors, spacing, and responsive layout              | `src/styles/`                      |

Chapter order follows the entries in `chapters.js`, grouped by `group` (`start`, `learn`, `supplement`). A chapter is either `kind: 'map'` (a diagram renderer plus the inspector) or `kind: 'page'` (a renderer in `pages.js`). To add a map chapter, give it a stable route key, select or add a diagram renderer, and connect its component explanations; list any field guides it should show beneath the map in `guides`. Keep existing route keys stable so bookmarked chapters continue to work. Routes are parsed in `src/router.js`; examples are `#bring-up/remove`, `#fork-day/cascade?detail=labels`, and `#running-stack/request?detail=events`. A chapter that has been split or renamed keeps its old key in `chapterAliases` so published links still resolve. A chapter-only lifecycle link always starts at the empty footprint.

Structured lessons add zero-based selection qualifiers when intent would otherwise be ambiguous: claim evidence uses `?detail=azureimpl&claim=0`, while a trace uses `?detail=azureimpl&hop=3`. Unqualified legacy URLs remain valid; when a component matches both, claim evidence wins, otherwise a matching hop restores the trace.

Each component detail contains `label`, `title`, `body`, `artifact: { label, code }`, and a `source` key from `src/content/sources.js`. `resolveDetail` overlays an optional `here[chapterKey]` record without changing the base detail. `label` remains metadata and is the fallback for drawer context; it never implies ownership. Add `owner` only when the source or runtime owner is explicit. The complete owner row stays hidden when `owner` is absent.

Use `summary` for an authored initial explanation and `more` only for deliberately optional detail. Without `summary`, the drawer shows the complete `title` and `body`; it does not split prose at punctuation or create an automatic disclosure. Source links always put the primary `source` first, then unique `goDeeper` keys in authored order.

A diagram button's `data-detail` must match a key in that content. Audio markers, field checks, and poster links use site routes; the integrity checks parse each route and confirm that a `detail` names a component on that map and a `guide` names a field guide. They also catch missing explanations, duplicate component IDs within a scene, broken chapter-to-renderer connections, missing poster and audio files, and missing source files when sibling checkouts are present.

## Authoring a Try it band

A learn chapter may carry a `tryIt` object. Omit the field until every route has been walked and its tested CLI release, stack ref, template commit, shell, operating system, and date have been recorded. Test fixtures prove the renderer contract but are not publication evidence. A present object is complete:

- `activity` is the short action in `Try it: <activity> · <access> · <active effort>`.
- `variants` is a nonempty ordered array. Each variant has a nonempty `label`, `result`, `effects`, and exactly one `access`: `browser only`, `workstation setup`, `public GitHub repository`, or `Azure resources billed separately`. An optional `accessNote` is a sentence that clarifies relevant conditions.
- `prerequisites` is a nonempty array of `{ text, sources }`; each `sources` list contains keys from `src/content/sources.js` so shared setup is linked instead of repeated.
- `time` has nonempty `active`, `wait`, and `cleanup` descriptions. State when waiting or cleanup does not apply; do not derive estimates from timeouts.
- `steps` is a nonempty ordered array. Each step has exactly one nonempty `command` or `click`, plus `expect` and optional source keys. The renderer shows `effects` before these steps and never executes their actions.
- `alternate` has a nonempty `observation` and `next`. `cleanup` has nonempty `steps` using the same action-and-observation shape and a nonempty `remains` statement.
- `sources` is a nonempty list of source keys for the quoted runbook, CLI help, or source artifact.
- `tested` has nonempty `cli`, `stack`, `template`, `shell`, `os`, and ISO `date` values. For a field that does not apply, write an explicit reason instead of inventing a version.

Multiple variants are complete alternatives, such as a future lesson 02 route without Azure and one with Azure. The collapsed summary names each variant's access and active effort. Commands use only `opendes`, `dev1`, and marked placeholders such as `<name>`. Keep prerequisites sufficient to start the activity, state resource effects before steps, and identify what remains after cleanup. The site must not promise that an activity is free, execute a command, imply live state, or track completion.

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

Keep the overview and lifecycle on the same map renderer. When changing interaction, check one visible selected element, a matching explanation, browser back/forward, reload, and a phone-sized viewport. The evidence drawer starts closed and overlays the full-width desktop map when a component, hop, evidence link, explicit map jump, or detail route requests it. Below 760px it opens as a bottom sheet. Its × button and Escape close it and return focus to the opener.

Timing labels must say whether they are observations or deadlines. A 150-minute Job deadline is not evidence that a two-hour wait is healthy. External documentation links should use the published site when the source requires a documentation renderer.

Review reference material is preserved separately in `docs/concept-review.html` and `osdu-spi-stack-guide.pdf`. The review HTML is excluded from formatting. See `docs/feedback-response.md` for this iteration and `docs/audio-source-notes.md` before producing narration.
