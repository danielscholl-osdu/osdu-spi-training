# OSDU Azure SPI Fieldnotes

An interactive learning site for senior engineers who know OSDU and are new to the Azure SPI Stack and the engineering system behind the service forks. Published at https://danielscholl-osdu.github.io/osdu-spi-training/.

This repository is a Microsoft Hackathon 2026 project with two deliverables:

- **The site.** Seven lessons over an inspectable architecture map, two generated audio deep dives, a video, eight field guides, and six posters, all held to a written content standard and cross-checked by a test before deploy.
- **The case study.** The site was built in four days by one engineer managing a software factory of AI agents spanning Claude, OpenAI, and GitHub Copilot, with a beads tracker and a design-intent document as shared state. [`docs/case-study/`](docs/case-study/README.md) records how the work moved, what each agent and tool was worth, what it cost, what worked, and what did not. The [numbers](docs/case-study/by-the-numbers.md) carry their sources.

## The site

Three ways in, all ending in the source documentation:

- **Learn.** Seven lessons in a round trip: **What is a stack?**, **How it comes to life**, and **The SPI boundary** go down the stack; **The shape of the fork** and **A day in the fork** go out to the service fork that owns the Azure code; **The handshake** comes back in through the image lock; **Field check** closes with the assumptions that cause trouble. Each lesson opens with its claims, shows them on the map, keeps evidence in a drawer that opens only when asked, shows one easy mistake, and ends with what the learner can now say. After the exit come an optional **Try it** activity on the learner's own account and a **Go deeper** shelf: the running example (a partition lookup for `opendes`, then a fix to the partition provider), audio excerpts, field guides, and sources.
- **Listen.** A one-minute video and a two-minute brief frame the subject on the start page. Two hour-long generated deep dives, one on the stack and one on the fork, carry chapter markers, source-check notes where the narration and the documentation differ, and a transcript. Playback keeps going while you move around the site.
- **Read.** Visual field guides: two maps of the course, eight guides drawn in SVG (where the familiar things live, four owners, the `spi up` timeline, readiness signals, three profiles, the labels state machine, the fork's clocks, identity as two problems), and six posters. The lessons compare the Azure implementation against CIMPL, the community implementation, where the comparison teaches.

Explanations are optional and the source documentation supplies depth. There are no quizzes, scores, or required exercises.

## Local development

Requires Node.js 22.12 or newer and npm. From this repository:

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5173. Saving source changes updates the development preview. The site uses plain HTML, CSS, and JavaScript modules with [Vite](https://vite.dev/guide/) for development and builds. It has no runtime package dependencies.

A review preview may already be serving `dist/` at http://127.0.0.1:8875. It is separate from the development server and shows the most recent build when refreshed.

| Command           | Purpose                                              |
| ----------------- | ---------------------------------------------------- |
| `npm run dev`     | Development server at `127.0.0.1:5173`               |
| `npm run format`  | Format source and project files                      |
| `npm test`        | Check content, renderer, and explanation connections |
| `npm run build`   | Generate the static site in `dist/`                  |
| `npm run preview` | Preview the build at `127.0.0.1:4173`                |
| `npm run check`   | Check formatting, run tests, and build               |

Pushes to `main` deploy to GitHub Pages through `.github/workflows/pages.yml`, which runs `npm run check` first.

## Repository layout

```text
src/
  index.html                    Page frame, audio dock, lightbox, video modal
  main.js                       Navigation, map and page rendering, the drawer
  router.js                     Chapter, moment, selection, guide, and time URLs
  content/                      Chapters, claims, explanations, moments, sources,
                                audio markers, myths, posters, generated transcripts
  components/                   Architecture map, diagrams, field guides, badges,
                                pages, the audio player, shared node markup
  styles/                       Base, architecture, and page styles
public/
  audio/ video/ posters/        Episode audio, the video, web-sized poster copies
tests/                          Content integrity checks
docs/
  case-study/                   How the site was built: the case study, the numbers,
                                the hackathon form draft, the tracker at revision 23
  process/                      Reviews (verbatim), iteration records, and plans
  reference/                    Supplied posters and site-built poster sources,
                                generated artwork with prompts, transcript VTT files
  *.md, narration/              Scripts, narration, generation briefs, source notes
vite.config.js                  Local servers and static build
dist/                           Generated output; ignored by Git
```

[CONTRIBUTING.md](CONTRIBUTING.md) maps each kind of change to its file. [AGENTS.md](AGENTS.md) holds the product intent and the content standard that every change, human or agent, is reviewed against. [docs/README.md](docs/README.md) says which documents the site depends on and which are the process record.

## Scope and sources

This is an illustrative development and test environment, not live Azure status. The complete stack includes AKS, its workloads, and supporting Azure resources. The creation moments simplify the deployment lifecycle; Flux rollout overlaps the final CLI work.

Technical content comes from the `osdu-spi-stack` architecture, deployment, identity, and fork-deployment guides and the `osdu-spi` concepts and engineering-system documentation. Each lesson links to its sources. The diagrams group examples; every service does not use every backend shown.

The site executes no Azure commands, requires no Azure credentials, and remains separate from the source repositories it explains. Google Fonts is optional; system-font fallbacks are provided. Nothing is published by the development or build commands.

## Reviewed against

The technical claims were last checked on 12 September 2026 against these sibling checkouts: `osdu-spi-stack` at `dc2c956`, `osdu-spi` at `080f0b8`, and `osdu-spi-partition` at `3a5690d`. The content test resolves every source path against those checkouts when they are present. When the sources move, re-check the dated statements first: the upstream Azure directory is still present, the reference fork has not adopted the newer validation lane or written its descriptor, per-service image promotion (osdu-spi-stack ADR-033) is designed but not built, and the scheduled stale-pin sweep is not wired.

The partition-lookup comparison was reviewed separately on 13 September 2026 against community Partition at `5aa406b978dec178fe05f1c9a0ee0ca02eb239b4`, community `cimpl-stack` at `fe56aa1b13e9a15aee8af97f103484f8240a9cb3`, `Azure/osdu-spi-stack` at `dc2c95638ded6459538085cfdb2ada46b692c27b`, and `Azure/osdu-spi-partition` at `3a5690da3147d022ca9a2402858cd7b96e4688cf`. The community service source establishes its lookup behavior, while `cimpl-stack` establishes the environment binding. This source review did not establish a paired deployment, match either checkout to a deployed image digest, or produce an acceptance-test result.

## How it was built

The build ran from Thursday evening 11 September to Sunday morning 14 September 2026. A Claude Code session orchestrated: it spawned subagents, handed multi-file changes to Keelson's beads-work workflow, verified every change in a browser, and kept the record in a beads tracker and a design-intent artifact. OpenAI Codex and GPT-6 Astra reviewed usability, accuracy, and design. GitHub Copilot reviewed the workflow's pull requests. Gemini NotebookLM produced the recordings and video. The engineer set direction, approved plans, cut scope, and carried reviews between vendors.

The [case study](docs/case-study/README.md) tells that story with diagrams and quotations from the record. [The process record](docs/process/README.md) maps each of the nine external reviews to the iteration that answered it. The recordings, the video, and the supplied posters were generated from [an introduction written for NotebookLM](docs/azure-spi-introduction-source.md), the supplied [OSDU SPI Stack guide](osdu-spi-stack-guide.pdf), and the [complete osdu-spi guide](osdu-spi-complete-guide.pdf); [audio source notes](docs/audio-source-notes.md) list every marker, its destination, and the wording the narration should correct. Replacement scripts written for engineers who already know OSDU are drafts for approval in [the Start video script](docs/start-video-script.md), [the stack deep-dive script](docs/deep-dive-stack-script.md), and [the fork deep-dive script](docs/deep-dive-fork-script.md), each with its spoken text alone in [docs/narration/](docs/narration/). The current recordings and their transcripts stay until a recording is replaced.
