# OSDU Fieldnotes

An interactive learning site for senior engineers who know OSDU and are new to Azure SPI Stack and the engineering system behind the service forks.

The prototype follows four views: **What is a stack?**, **How it comes to life**, **The SPI boundary**, and **How changes arrive**. Learners explore architecture and follow the same environment as it is assembled. Explanations are optional, and source documentation supplies depth. There are no quizzes, scores, or required exercises.

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
  index.html                    Page frame
  main.js                       Navigation and shared interaction
  router.js                     Chapter, moment, and selection URLs
  content/
    chapters.js                 Chapter copy, order, and source references
    component-details.js        Component explanations
    creation-moments.js         Six lifecycle moments
    sources.js                  Documentation labels and source locations
  components/
    architecture.js             Environment map and creation interaction
    diagrams.js                 Chapter diagram renderers
    node.js                     Shared component markup
  styles/
    base.css                    Shared visual design
    architecture.css            Architecture and walkthrough layout
docs/
  concept-review.html           Review of the first concept
  feedback-response.md          Changes and review disposition
  audio-source-notes.md         Guide-to-site mapping and narration corrections
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

The site executes no Azure commands, requires no Azure credentials, and remains separate from the source repositories it explains. Google Fonts is optional; system-font fallbacks are provided. Nothing is published by the development or build commands.

## Current iteration and overview audio

The next iteration keeps the same architecture map through six lifecycle moments, from local preparation through teardown. Component explanations sit beside the map on a wide screen and open in a bottom panel on a phone. Deep links preserve a specific moment and component, for example `#bring-up/inspect?detail=connect`.

[The feedback response](docs/feedback-response.md) records the changes, verification, and remaining scope. The original review remains unchanged.

The supplied [OSDU SPI Stack guide](osdu-spi-stack-guide.pdf) is useful overview material. [Audio source notes](docs/audio-source-notes.md) map it to the four website views and identify wording to correct before narration. When the audio is available, add a native player with a transcript and optional links to these diagram states. No audio file has been supplied or included in the build yet.
