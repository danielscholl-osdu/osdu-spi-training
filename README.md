# OSDU Azure SPI Fieldnotes

> **Microsoft Hackathon 2026 project.** Two deliverables: this training site, and a [case study](docs/case-study/README.md) of how one engineer had it built in four days by a software factory of AI agents. The case study folder holds the short read, the [full record](docs/case-study/full-record.md) with its PDF, the [usage analysis](docs/case-study/usage/README.md), and the [numbers](docs/case-study/by-the-numbers.md) with their sources.

An interactive learning site for senior engineers who know OSDU and are new to the Azure SPI Stack and the engineering system behind the service forks. Published at https://danielscholl-osdu.github.io/osdu-spi-training/.

## The site

Three ways in, all ending in the source documentation:

- **Learn.** Seven lessons in a round trip: **Anatomy of a stack**, **How it comes to life**, and **The SPI boundary** go down the stack; **The shape of the fork** and **A day in the fork** go out to the service fork that owns the Azure code; **The handshake** comes back in through the image lock; **Field check** closes with the assumptions that cause trouble. Each lesson opens with its claims, shows them on the map, keeps evidence in a drawer that opens only when asked, shows one easy mistake, and ends with what the learner can now say. After the exit come an optional **Try it** activity on the learner's own account and a **Go deeper** shelf: the running example (a partition lookup for `opendes`, then a fix to the partition provider), audio excerpts, field guides, and sources.
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
