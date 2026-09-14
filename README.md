# OSDU Azure SPI Fieldnotes

An interactive learning site for senior engineers who know OSDU and are new to Azure SPI Stack and the engineering system behind the service forks.

Three ways in, all ending in the source documentation:

- **Listen.** A one-minute video and a two-minute brief give the frame on the start page. Three generated conversations, a 22-minute orientation and two hour-long deep dives, each carry chapter markers, source-check notes, and a transcript. Playback keeps going while you move around the site, and the learn views carry short cues into the recordings.
- **Explore.** Seven views, each answering one question, in a round trip: **What is a stack?**, **How it comes to life**, and **The SPI boundary** go down the stack; **The shape of the fork** and **A day in the fork** go out to the service fork that owns the Azure code; **The handshake** comes back in through the image lock; **Things that are not true** collects the contradictions from both. Every view says which of six places it works at, shows one easy mistake directly under the map, and ends with what the learner can now say. The six map lessons then offer a collapsed running example after the lesson exit: a partition lookup for opendes, followed by a fix to the partition provider.
- **Read.** Field guides: two maps of the course, eight infographics built in HTML (where the familiar things live, four owners, the spi up timeline, readiness signals, three profiles, the labels state machine, the fork's clocks, identity as two problems), and six posters (one supplied with the training material, two adopted from the source repositories, three built for this site: namespaces and ordering, one request end to end, credentials and teardown). Three generated posters supplied with the material are retired; their links land on the guide that covers the same subject.

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
    chapters.js                 Chapter copy, questions, outcomes, zoom levels
    concepts.js                 The zoom ladder and the three meanings of SPI
    component-details.js        Component explanations
    creation-moments.js         Six lifecycle moments
    fork-moments.js             Five moments in a service fork's day
    sources.js                  Documentation labels and source locations
    audio.js                    Four episodes and the video: files, markers, source checks
    transcripts/                Generated transcript paragraphs, one per episode
    myths.js                    Things that are not true
    posters.js                  Supplied posters and native field guides
  components/
    architecture.js             Environment map and creation interaction
    diagrams.js                 SPI boundary, fork, day-in-the-fork, and seam renderers
    infographics.js             Native field guides (HTML/SVG)
    pages.js                    Home, Listen, Field guides, Not true
    player.js                   Shared audio element and dock
    node.js                     Shared component markup
  styles/
    base.css                    Shared visual design
    architecture.css            Architecture and walkthrough layout
    pages.css                   Pages, field guides, player, lightbox
public/
  audio/                        Episode audio (mono AAC; the deep dives are 25–30 MB each)
  video/                        The one-minute overview, its poster, and its captions
  posters/                      Web-sized poster copies
docs/
  concept-review.html           Review of the first concept
  feedback-response.md          First iteration: changes and review disposition
  iteration-2.md                Second iteration: listen, explore, read
  audio-source-notes.md         Marker map and narration corrections
  reference/                    Supplied posters and the transcripts, unchanged
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

## Reviewed against

The technical claims were last checked on 12 September 2026 against these sibling checkouts: `osdu-spi-stack` at `dc2c956`, `osdu-spi` at `080f0b8`, and `osdu-spi-partition` at `3a5690d`. The content test resolves every source path against those checkouts when they are present. When the sources move, re-check the dated statements first: the upstream Azure directory is still present, the reference fork has not adopted the newer validation lane or written its descriptor, per-service image promotion (osdu-spi-stack ADR-033) is designed but not built, and the scheduled stale-pin sweep is not wired.

The partition-lookup comparison was reviewed separately on 13 September 2026 against community Partition at `5aa406b978dec178fe05f1c9a0ee0ca02eb239b4`, community `cimpl-stack` at `fe56aa1b13e9a15aee8af97f103484f8240a9cb3`, `Azure/osdu-spi-stack` at `dc2c95638ded6459538085cfdb2ada46b692c27b`, and `Azure/osdu-spi-partition` at `3a5690da3147d022ca9a2402858cd7b96e4688cf`. The community service source establishes its lookup behavior, while `cimpl-stack` establishes the environment binding. This source review did not establish a paired deployment, match either checkout to a deployed image digest, or produce an acceptance-test result.

## Iterations

The architecture map runs through six lifecycle moments, from local preparation through teardown. Component explanations sit beside the map on a wide screen and open in a bottom panel on a phone. Deep links preserve a specific moment and component, for example `#bring-up/inspect?detail=connect`; `#listen?t=764` opens the deep dive at a marker, and `#field-guides?guide=profiles` opens a field guide.

[The feedback response](docs/feedback-response.md) records the first iteration. [Iteration 2](docs/iteration-2.md) records the home page, audio, field guides, and field checks. [Iteration 3](docs/iteration-3.md) records the concept flow: the zoom ladder, the three meanings of SPI, and per-view outcomes. [Iteration 4](docs/iteration-4.md) records the response to the external review: the shorter landing page, the corrected ladder geometry, the running example, easy-mistake callouts, and the phone chapter menu. [Iteration 5](docs/iteration-5.md) records the fork and seam views, the cache fallback example, the two new episodes, and the response to the [fork feature review](docs/fork-feature-review-2026-09-12.md). The original reviews remain unchanged. The [editorial review](docs/deep-review-and-editorial-2026-09-12.md) of 12 September drove the plainer start page, the retitled recordings, the guides index, and the [brief script](docs/azure-spi-brief-script.md).

The orientation episode, the brief, and the video were generated from [an introduction written for them](docs/azure-spi-introduction-source.md) with [its brief](docs/azure-spi-introduction-generation-brief.md), which replaced [an earlier orientation source](docs/azure-spi-orientation-source.md); the supplied [OSDU SPI Stack guide](osdu-spi-stack-guide.pdf) is the narrative source for the stack episode and the [complete osdu-spi guide](osdu-spi-complete-guide.pdf) for the fork episode. [Audio source notes](docs/audio-source-notes.md) list every marker, its site destination, and the wording the narration should correct. The episodes are NotebookLM artifacts; the stack episode's [notebook](https://notebook.google.com/notebook/b54aaf01-b8c2-4d39-98e9-112ed9dc92b7/artifact/5c1f61ff-cf85-4a1b-813d-d80ae3d96a21) is linked from the Listen page.
