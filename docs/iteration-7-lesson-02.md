# Iteration 7 · Lesson 02 lifecycle claims

Lesson 02 now uses the claims-first grammar established by lesson 01 while
retaining all six lifecycle moments and their stable routes.

## What changed

**Three claims drive six moments.** The ownership claim covers preparation at
`start`, then enters at `provision` and remains compatible through `bootstrap`
and `reconcile`. The readiness claim enters at `inspect`; the teardown claim
enters at `remove`. Selecting a different claim moves to its entry moment
without opening the drawer. Clicking the selected claim opens its evidence,
using the same rule as lesson 01.

**Entry and evidence moments can differ.** The first claim enters when Bicep
creates Azure, but its Flux evidence exists at `reconcile`, so “How we know →”
opens `#bring-up/reconcile?detail=flux`. The readiness and teardown evidence
remain at their entry moments. Route restoration derives the compatible claim
and running-example hop from each moment rather than retaining stale in-memory
state.

**Every moment offers explicit evidence.** “Look closer” appears under each
moment story and opens that moment’s existing detail without scrolling the
page. `readiness` is now a selectable workstation observation at `inspect`.
Bare lesson and moment routes leave the drawer closed and unselected; closing
evidence with × or Escape returns focus to its opener.

**Focus follows what exists at that moment.** Claim 1 focuses the workstation
and AKS at `provision`, adds bootstrap inputs at `bootstrap`, and reaches Flux at
`reconcile`; it does not draw future workloads into earlier scenes. The
readiness claim focuses the readiness observation, initialization Jobs, and API
caller. The teardown claim focuses the retained managed identities and resource
group. Boundaries remain at full weight, and Explore map restores all component
affordances.

**The required explanation stays on the lesson surface.** The claims name the
overlap between final CLI work and Flux, the five distinct readiness signals,
and the identity/naming footprint retained by ordinary teardown. The collapsed
running example carries its own provider note: cache, then Azure Table Storage
in common Storage, without visiting the partition’s Cosmos DB, blob Storage, or
Service Bus.

## Verification

`npm run check` passes formatting, the content tests, and the production build.
The focused Node tests cover stable lifecycle routes, real evidence targets,
moment-aware claim focus, canonical evidence links, all five example hops, and
unchanged lesson 01 paths.

An off-repository Chrome DevTools Protocol probe passes at 1440px and 390px. It checks bare-route drawer state, claim and moment
synchronization, repeat selection, Look closer and node focus return,
Back/Forward hop restoration, modifier clicks, grammar order, all six visible
moment controls, and horizontal overflow.

With the drawer, running example, and optional disclosures closed, the lesson
supports this account: the CLI drives Bicep to create Azure and seeds AKS; Flux
assembles workloads while final CLI work overlaps it, and controllers continue
maintaining them. CLI success is not API readiness: follow health and
initialization with `spi status --watch`, then exercise an authenticated
request. Ordinary `spi down` deletes compute and application data but retains
identities and the resource group’s naming footprint.

An independent agent reviewed `origin/main..HEAD` for missing targets, stale
claim or hop state, drawer intent and focus restoration, and lesson 01
regressions. It reported no substantive findings.

## Not done, on purpose

- No lifecycle routes, moment IDs, detail IDs, or query parameters were added or
  renamed.
- No second architecture renderer, framework, dependency, or learner progress
  state was introduced.
- No Azure or SPI command was executed. The browser checks inspect only the
  illustrative training site.
- `docs/iteration-6.md`, generated `dist/`, transcripts, supplied reviews, and
  reference artifacts remain unchanged.
