# Iteration 2: listen, explore, read

The first iteration produced one interactive map with four views. This iteration keeps that map and the authoring rules around it, and adds the material an engineer needs before and around the map: a front door, a one-hour audio deep dive, a set of field guides, and a page of documented contradictions. The goal is unchanged: help an engineer who knows OSDU understand what the SPI Stack is, why it is shaped the way it is, and how to use it, then hand them the documentation.

## What changed

| Area         | Change                                                                                                                                                                                                                                                                                                         |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Start here   | A home page (`#start`) with the whole picture as a five-stop spine (workstation → Azure → Flux → the service → the client), three ways in (listen, explore, read), the learning path, three field checks, and the documentation sets.                                                                          |
| Listen       | The NotebookLM deep dive (58:36) plays from one `<audio>` element in the page frame, so it keeps playing across chapter navigation. A dock shows the current marker and links to the matching view. The Listen page has 22 chapter markers with source-check notes, playback speed, and a seekable transcript. |
| Field guides | The two supplied posters, preserved as given, with takeaways, source checks, explore links, and a full-size lightbox. Five infographics built in HTML/SVG: four owners, the spi up timeline, five milestones, three profiles, identity as two problems. Each also appears beneath the map view it explains.    |
| Not true     | A fifth learning view: ten plausible assumptions the documentation contradicts, each with a check command, a source, and a place on the map.                                                                                                                                                                   |
| Design       | Navy masthead with site navigation and a Listen call to action; a grouped rail (Start, Learn, Supplements); an owner color system (CLI + Bicep, Flux, controllers, operator; orange still reserved for fork-owned source) used consistently in the spine, the field guides, and legends.                       |
| Sources      | Eleven new source entries: gateway ingress, secret lifecycle, CI smoke, environment lifecycle, ADR-004, ADR-013, ADR-017, ADR-021, ADR-023, and the design and decision indexes.                                                                                                                               |
| Routes       | `#start` is the default. `#listen?t=<seconds>` seeks without autoplay. `#field-guides?guide=<id>` scrolls to a guide. Existing chapter, moment, and `detail` routes are unchanged.                                                                                                                             |

## Source grounding

- Audio marker notes flag two places where the narration departs from the repositories: the 45–50 minute figure is a centralus observation and readiness can follow the CLI exit; the “forty of fifty minutes waiting on role assignments” is an illustration, while the documented Cosmos propagation is five to fifteen minutes.
- The supplied Blueprint poster carries generated spelling errors and a “days to 50 minutes” claim; its caption records both. The Contribution Chain poster matches the fork-tiers documentation.
- The timeline field guide labels observed component times, ordered steps with unmeasured duration, work that continues after the CLI, and deadlines, and repeats that overlapping phases must not be added.
- The ten field checks are drawn from the guide’s “Things that are not true” and each was checked against the named design guide or decision record before inclusion.

## Assets

- `public/audio/engineering-the-osdu-spi-stack-on-azure.m4a` (26 MB): mono AAC at 56 kb/s, re-encoded from the 113 MB supplied file. The original is not committed.
- `public/posters/*.jpg`: 2000-pixel JPEG copies for the site. The supplied PNGs are preserved unchanged in `docs/reference/`.
- `docs/reference/engineering-the-osdu-spi-stack-on-azure.vtt`: the Whisper large-v3-turbo transcript from which `src/content/transcript.js` is generated.

## Verification

`npm run check` passes: formatting, eight content integrity tests, and a production build. New tests cover marker ordering and routes, field-check routes resolving to real components, poster files existing, every field guide rendering, and `t`, `guide`, and default-route parsing. Browser checks covered playback continuing across navigation, marker and transcript seeking, the lightbox, and a 390-pixel layout.

## Out of scope, still

Quizzes, scores, completion tracking, a cost meter, and scrollytelling remain out. Publishing is not configured. The audio is a generated discussion of the guide; a recorded narration with the corrections in `audio-source-notes.md` applied would replace it.
