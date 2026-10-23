# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Read `AGENTS.md` before changing content: it carries the learning intent and the content standards (running example, easy-mistake callouts, ladder of six places, owner colors, recording and poster rules) that reviews hold every change to. `CONTRIBUTING.md` maps each kind of change to its file.

## Commands

Node.js 22.12+ and npm. No runtime dependencies; Vite and Prettier are the only dev dependencies.

```sh
npm ci
npm run dev            # http://127.0.0.1:5173 (strictPort; fails rather than moving)
npm test               # node --test: content integrity checks in tests/content.test.js
npm run format         # prettier --write . (run after editing)
npm run build          # static site to dist/ (ignored by Git)
npm run preview        # serves dist/ at http://127.0.0.1:4173
npm run check          # format:check + test + build; CI runs this before deploying
```

Run a single test by name:

```sh
node --test --test-name-pattern="audio markers" tests/content.test.js
```

A review preview may already be serving `dist/` on port 8875. Leave it running.

Pushes to `main` deploy to GitHub Pages (`.github/workflows/pages.yml`), so keep `main` deployable and work on branches.

## Architecture

A vanilla ES module single-page app. Vite's `root` is `src/`, `publicDir` is `public/`, and `base: './'` keeps the build relative for Pages. All state lives in the URL hash; there is no framework and no store.

**Content is data, components render it.** `src/content/*.js` exports plain objects; `src/components/*.js` exports functions that return HTML strings, which `src/main.js` assigns with `innerHTML`. Content fields intentionally contain HTML, so content is trusted repository material and must never take external input.

**Chapters drive everything.** Each entry in `src/content/chapters.js` has a `group` (`start`, `learn`, `supplement`), a `book` for learn views, and a `kind`:

Learn navigation order supplies lesson numbers and the **Lesson N of M** labels. **Working the stack** follows **Across the path**; `whose-image`, `who-is-asking`, `ready-not-loaded`, `core-dags`, and `prove-from-desk` are lessons 08 to 12, in storyboard order, while the field check remains 07 with its Back to the start exit. A Fieldnote maps to its lesson by its `chapter`, never by its number: a lesson cut shares its lesson's number (Fieldnote 11 is `core-dags`), and a curriculum episode keeps its own code (102 serves lesson 01, 103 serves lesson 03). A lesson can ship without a produced video; keep synthetic episode fixtures in tests and publish no media entry or Watch chip until a cut exists.

- `kind: 'map'` names a `diagram` key in `diagramRenderers` (`src/components/diagrams.js`). The `overview` and `creation` renderers both come from `architecture.js`, which is the single architecture renderer shared by the overview and the lifecycle. A map chapter also names its `guides`, `listen` cues, and outcomes.
- `kind: 'page'` names a `page` key in `pageRenderers` (`src/components/pages.js`).

**Selection is by ID.** Clickable elements carry `data-detail="<id>"` produced by `node()` in `src/components/node.js`; the ID must be a key in `src/content/component-details.js`, whose `source` must be a key in `src/content/sources.js`. `selectDetail` in `main.js` highlights the element and fills the inspector (beside the map on desktop, a bottom sheet on phones). A node whose ID is in `nodeIcons` (`src/components/icons.js`) carries that product's icon; the Fieldnotes videos draw the same icons from that file.

**Routing.** `src/router.js` parses `#<chapter>/<step>?detail=<id>&t=<seconds>&guide=<id>&watch=<seconds>` and `#watch/<id>?t=<seconds>`. Steps come from `creation-moments.js` or `fork-moments.js` depending on the chapter. Renamed chapters stay reachable through `chapterAliases`, removed component IDs through `retiredDetails`, and lesson cuts replaced by a curriculum episode through `retiredFieldnotes` in `videos.js`; never drop a published route key.

**Audio.** `src/components/player.js` owns one `<audio>` element in the page frame (`src/index.html`) that survives chapter changes. Episodes, markers, and source-check notes are in `src/content/audio.js`; marker times are read from the generated `src/content/transcripts/*.js`. Fieldnotes, the curriculum videos (`docs/fieldnotes/README.md`, mapped in `src/content/curriculum.js`), are in `src/content/videos.js` and play in the video dialog in `src/index.html` or on the `#watch` page, never in the dock. Every episode's files, the Start video's included, resolve against `videoBase`, the media repository; a path under `video/` would be served from `public/`.

**Posters and field guides.** Posters are listed in `src/content/posters.js` with web copies in `public/posters/`. Supplied originals and the self-contained HTML sources of site-built posters are in `docs/reference/posters/`; edit that HTML and re-render rather than editing a PNG. Native field guides are HTML and SVG functions in `src/components/infographics.js`.

## What the tests enforce

`tests/content.test.js` imports the content modules and renderers directly and cross-checks them, so most broken edits fail `npm test` rather than the browser. It checks:

- every chapter reaches a renderer, and every `data-detail` in a rendered scene has an explanation;
- component IDs are unique within a scene;
- every route in audio markers, field checks, and poster links parses and names a real component or guide;
- `listen` cues start on a marker of their episode;
- each Fieldnote chapter names a real claim, the example, or one of the lesson's myths, and each `cutFrom` still matches `chapters.js` and `myths.js`;
- in `src/content/curriculum.js`, every idea and myth has a home, at most one per path, and a level 100 home is its only one; an episode uses only ideas taught before it in its path or by an episode its `after` names, and an episode above level 100 may use any level 100 idea; a level 100 or 200 episode carries at most one myth; and every deep dive names an episode it builds on;
- audio, poster, and local video files exist in `public/` (episode files in the media repository are not fetched).

Source links must point at the published docs (`azure.github.io/osdu-spi/`) or the default branch (`main`) of `github.com/Azure/osdu-spi-stack` and `osdu-spi-partition`; comparison evidence may also point at the default branch of the community Partition repository (`master`) and `cimpl-stack` (`main`). A file link never pins a revision and a label never carries a commit id: the site follows the repositories as they are, and the revisions a claim was reviewed against are recorded in `docs/README.md`, not in the interface. A commit link (the cache-fallback fix) names an event, not a snapshot. When sibling checkouts exist at `../osdu-spi`, `../osdu-spi-stack`, or `../osdu-spi-partition`, each source `path` must also exist there. A missing file means the upstream moved; re-check the claim, and update the "Reviewed against" revisions and dated statements in `docs/README.md`.

## Things not to edit directly

- `dist/` is generated.
- `src/content/transcripts/*.js` and `docs/reference/*.vtt` represent the recordings. Put corrections in marker notes in `audio.js`. A recording is replaced from an approved script such as `docs/azure-spi-brief-script.md`.
- The dated review documents in `docs/process/reviews/` are preserved verbatim; record responses in separate files.

## Project Locations for relating code

- `osdu-spi` is located ../osdu-spi
- `osdu-spi-stack` is located ../osdu-spi-stack
- `cimpl-stack` is located ../../cimpl-stack

<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:7510c1e2 -->

## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

**Architecture in one line:** issues live in a local Dolt DB; sync uses `refs/dolt/data` on your git remote; `.beads/issues.jsonl` is a passive export that git ignores (the embedded Dolt DB in the primary checkout is the only source of truth for every worktree and session on this machine). See https://github.com/gastownhall/beads/blob/main/docs/SYNC_CONCEPTS.md for details and anti-patterns.

## Session Completion

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**

- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds

<!-- END BEADS INTEGRATION -->
