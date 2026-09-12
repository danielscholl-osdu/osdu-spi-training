# Working on OSDU Fieldnotes

Install the pinned tools with `npm ci`, then start `npm run dev`. Work in `src/`; the development preview updates when you save. The development and preview servers listen only on the local machine.

## Where to make a change

| Change                                                          | File or directory                  |
| --------------------------------------------------------------- | ---------------------------------- |
| Chapter titles, introductions, source keys, or navigation order | `src/content/chapters.js`          |
| Explanation shown when a component is selected                  | `src/content/component-details.js` |
| Creation-step copy, command examples, and ownership             | `src/content/creation-moments.js`  |
| Azure / AKS map and creation-step interaction                   | `src/components/architecture.js`   |
| SPI and engineering-system diagrams                             | `src/components/diagrams.js`       |
| Shared clickable component markup                               | `src/components/node.js`           |
| Page frame                                                      | `src/index.html`                   |
| Chapter navigation and detail-panel behavior                    | `src/main.js`                      |
| Typography, colors, spacing, and responsive layout              | `src/styles/`                      |

Chapter order follows the entries in `chapters.js`. Navigation and next-chapter links are generated from that content. To add a chapter, give it a stable route key, select or add a diagram renderer, and connect its initial explanation. Keep existing route keys stable so bookmarked chapters continue to work. Routes are parsed in `src/router.js`; examples are `#bring-up/remove` and `#running-stack/request?detail=events`. A chapter-only lifecycle link always starts at the empty footprint.

Each component detail contains `label`, `title`, `body`, `artifact: { label, code }`, and a `source` key from `src/content/sources.js`. A diagram button's `data-detail` must match a key in that content. The integrity checks catch missing explanations, duplicate component IDs within a scene, broken chapter-to-renderer connections, and missing source files when sibling checkouts are present. Content is trusted, repository-authored material; selected fields intentionally contain HTML. Do not feed external user input into those templates.

## Validate a change

```sh
npm run format
npm run check
```

The check runs formatting validation, content integrity tests, and a production build. For an intentional visual change, review the affected chapter, component interactions, keyboard access, and a narrow layout. The learner experience contains no assessments; these checks are for the codebase.

`npm run build` regenerates `dist/`. `npm run preview` serves that build at http://127.0.0.1:4173. Generated files and installed packages are ignored by Git.

Use a focused branch and describe the learner-visible change and validation when reviewing it. This repository currently has no remote configured; local development does not depend on one.

## Content standards

Start from an OSDU engineer's existing knowledge, introduce each new boundary before its machinery, and keep detail optional. Prefer a diagram that explains one relationship over additional paragraphs. Cite current source documentation when describing system behavior. Record uncertainty rather than inventing a deployment guarantee.

If you confirm documentation drift, capture the source evidence and address it in the owning repository through its issue and pull-request workflow. Keep training-site changes here.

## Adding depth without adding a course

A useful detail names the thing an engineer can inspect and explains a consequence. For example, “the Git source is suspended” earns its place by naming `osdu-spi-stack-system` in `osdu-flux` and explaining that cached reconciliation continues. More paragraphs, learner questions, and completion state are not substitutes for that specificity.

Keep the overview and lifecycle on the same map renderer. When changing interaction, check one visible selected element, a matching explanation, browser back/forward, reload, and a phone-sized viewport. The desktop inspector stays beside the map; the phone inspector expands from the bottom and closes with its button or Escape.

Timing labels must say whether they are observations or deadlines. A 150-minute Job deadline is not evidence that a two-hour wait is healthy. External documentation links should use the published site when the source requires a documentation renderer.

Review reference material is preserved separately in `docs/concept-review.html` and `osdu-spi-stack-guide.pdf`. The review HTML is excluded from formatting. See `docs/feedback-response.md` for this iteration and `docs/audio-source-notes.md` before producing narration.
