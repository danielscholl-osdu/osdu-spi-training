# OSDU Fieldnotes

An interactive learning site for senior engineers who know OSDU and are new to Azure SPI Stack and the engineering system behind the service forks.

Three ways in, all ending in the source documentation:

- **Listen.** A one-hour generated deep dive with 22 chapter markers, source-check notes, and a transcript. It keeps playing while you move around the site.
- **Explore.** One architecture map through five views: **What is a stack?**, **How it comes to life**, **The SPI boundary**, **How changes arrive**, and **Things that are not true**. Learners select components and follow the same environment as it is assembled.
- **Read.** Field guides: two supplied posters, preserved as given, and five infographics built for the site (four owners, the spi up timeline, five milestones, three profiles, identity as two problems).

Explanations are optional, and source documentation supplies depth. There are no quizzes, scores, or required exercises.

## Local development

Requires Node.js 22.12 or newer and npm. From this repository:

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5173. Saving source changes updates the development preview. The site uses plain HTML, CSS, and JavaScript modules with [Vite](https://vite.dev/guide/) for development and builds. It has no runtime package dependencies.

The original review preview at http://127.0.0.1:8875 can continue serving `dist/` while it is running. It is separate from the development server and shows the most recent build when refreshed.

## Repository layout

```text
src/
  index.html                    Page frame, audio dock, lightbox
  main.js                       Navigation, map and page rendering
  router.js                     Chapter, moment, selection, guide, and time URLs
  content/
    chapters.js                 Chapter copy, order, kind, and source references
    component-details.js        Component explanations
    creation-moments.js         Six lifecycle moments
    sources.js                  Documentation labels and source locations
    audio.js                    Deep dive file, markers, and source checks
    transcript.js               Generated transcript paragraphs
    myths.js                    Things that are not true
    posters.js                  Supplied posters and native field guides
  components/
    architecture.js             Environment map and creation interaction
    diagrams.js                 Chapter diagram renderers
    infographics.js             Native field guides (HTML/SVG)
    pages.js                    Home, Listen, Field guides, Not true
    player.js                   Shared audio element and dock
    node.js                     Shared component markup
  styles/
    base.css                    Shared visual design
    architecture.css            Architecture and walkthrough layout
    pages.css                   Pages, field guides, player, lightbox
public/
  audio/                        Deep dive audio (26 MB, mono AAC)
  posters/                      Web-sized poster copies
docs/
  concept-review.html           Review of the first concept
  feedback-response.md          First iteration: changes and review disposition
  iteration-2.md                Second iteration: listen, explore, read
  audio-source-notes.md         Marker map and narration corrections
  reference/                    Supplied posters and the transcript, unchanged
tests/                         Content integrity checks
vite.config.js                 Local servers and static build
dist/                          Generated output; ignored by Git
```

## Commands

| Command           | Purpose                                              |
| ----------------- | ---------------------------------------------------- |
| `npm run dev`     | Development server at `127.0.0.1:5173`               |
| `npm run format`  | Format source and project files                      |
| `npm test`        | Check content, renderer, and explanation connections |
| `npm run build`   | Generate the static site in `dist/`                  |
| `npm run preview` | Preview the build at `127.0.0.1:4173`                |
| `npm run check`   | Check formatting, run tests, and build               |

See [CONTRIBUTING.md](CONTRIBUTING.md) for where to edit content and diagrams. [AGENTS.md](AGENTS.md) preserves the learning intent and repository conventions for coding agents.

## Concept review

[docs/concept-review.html](docs/concept-review.html) reviews the first concept against the current `osdu-spi-stack` and `osdu-spi` source documentation. It records what the prototype gets right and must keep, the claims that are factually wrong, and an ordered list of changes for the next iteration. Open the file in a browser. It reviews the five-file prototype at commit `fdc27d9`; the copy is unchanged by the move into `src/`, so its content findings still apply.

## Scope and sources

This is an illustrative development and test environment, not live Azure status. The complete stack includes AKS, its workloads, and supporting Azure resources. The creation moments simplify the deployment lifecycle; Flux rollout overlaps the final CLI work.

Technical content comes from the `osdu-spi-stack` architecture, deployment, identity, and fork-deployment guides and the `osdu-spi` concepts and engineering-system documentation. Each chapter links to its sources. The diagrams group examples; every service does not use every backend shown.

The site executes no Azure commands, requires no Azure credentials, and remains separate from the source repositories it explains. Google Fonts is optional; system-font fallbacks are provided. Nothing is published by the development or build commands. The site is published to GitHub Pages from `main` by `.github/workflows/pages.yml`: https://danielscholl-osdu.github.io/osdu-spi-training/

## Iterations

The architecture map runs through six lifecycle moments, from local preparation through teardown. Component explanations sit beside the map on a wide screen and open in a bottom panel on a phone. Deep links preserve a specific moment and component, for example `#bring-up/inspect?detail=connect`; `#listen?t=764` opens the deep dive at a marker, and `#field-guides?guide=profiles` opens a field guide.

[The feedback response](docs/feedback-response.md) records the first iteration. [Iteration 2](docs/iteration-2.md) records the home page, audio, field guides, and field checks. The original review remains unchanged.

The supplied [OSDU SPI Stack guide](osdu-spi-stack-guide.pdf) is the narrative source for the generated deep dive. [Audio source notes](docs/audio-source-notes.md) list every marker, its site destination, and the wording the narration should correct. The deep dive is a NotebookLM artifact; the [notebook](https://notebook.google.com/notebook/b54aaf01-b8c2-4d39-98e9-112ed9dc92b7/artifact/5c1f61ff-cf85-4a1b-813d-d80ae3d96a21) is linked from the Listen page.
