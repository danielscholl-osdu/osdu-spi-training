# Iteration 6 · Claims, map focus, and the evidence drawer

Phase A implements lesson 01 on branch `feat/lesson-01-reference`, using the [proposal](https://claude.ai/code/artifact/3a637ecc-f00a-450f-826f-f5b7e4401945) and [lesson 01 prototype](https://claude.ai/code/artifact/d9ca0695-603b-4967-bad3-d6b7cfd99b86). It covers beads fn-5rl.1 through fn-5rl.4.

## What changed

**Claims drive lesson 01.** The original three outcome sentences now carry a reason, focused components, focused boundaries, and an evidence component. The position line, question and goal introduce the lesson. Selecting a claim changes the existing architecture map. “How we know →” opens the evidence drawer. The local “Lesson focus | Explore map” toggle changes the weight and Inspect affordances without changing routes. Boundaries never recede.

**The running example is optional evidence.** Its collapsed line retains the GET request. Expanding it reveals inline hops; selecting one traces the path up to that component and opens the drawer. The provider explanation on the page names cache, then Table Storage in common Storage, and distinguishes that lookup from the partition’s other backends.

**The exit precedes the references.** The easy mistake uses a left orange rule, followed by the three claims again and the Next link. Listen cues, expandable field-guide previews, sources, and the scope note follow under “Optional · go deeper”. The existing navigation frame stays in place.

**Every map uses the evidence drawer.** The inspector column is gone. With no detail in the route, no default component is selected and the drawer is closed. A component click or detail route opens it. The template reads Inspecting, Owned by, What it is, Why it matters here, Verify it, and Go deeper; additional sentences are behind More. The seam’s compact lock and pod state stays at the top. Escape and × close the drawer and return focus. The desktop overlay is positioned within the visible portion of a tall map without scrolling the page; phones retain the bottom sheet and audio-dock offset.

## Verification

`npm run check` passes: formatting, the content suite (13 tests, including the new check that every structured claim's focus, scope, and evidence IDs exist in the rendered scene on both overview paths), and the production build.

Headless Chrome screenshots at 1440px and 390px of `#running-stack`, `#running-stack/request?detail=flux`, `#bring-up/reconcile`, and `#handshake` were compared against the prototype: the position line, two-column orientation, claims strip with its selected state, collapsed running example, full-width focused map, drawer template, easy mistake as a rule, carry-forward list, Next block, and optional band match; the older lessons render as before apart from the drawer. Two defects found in that pass were fixed: the carry-forward list inherited white text once its navy panel was removed, and the Inspect label sat on its own line inside every node of the older lessons (it is now hover and focus only there).

A second agent reviewed the diff and found ten defects, nine of which are fixed: a stale trace after browser Back, the drawer clipped on tall maps when opened from their bottom rows, `aria-pressed` leaking onto the diagram element, chapter-change focus landing in the drawer instead of the headline when a link carries `?detail=`, the drawer opening without an announced name, lesson text hardcoded in `main.js` (now `crossing` per claim and on the example), modifier-clicks on hops leaking trace state, the selected claim not inferred from a bookmarked evidence route, and a brittle test. The tenth is accepted: closing the drawer rewrites the URL without its `detail`, so one Back press after closing does nothing visible; the alternative, leaving `detail` in the URL while the drawer is closed, would make reload and the URL disagree with what is on screen.

## Not done, on purpose

- **Navigation frame:** the masthead, rail grouping, and current rail label keep their existing design.
- **Explore page:** the local map policy is implemented; a separate Explore page is not.
- **Lessons 02 to 06:** their page shapes and lesson content are unchanged apart from the shared drawer and Inspect affordance. Lesson 07 also retains its existing content.

## Reference adaptations

The evidence link is a separate keyboard-accessible link beside its claim button, avoiding an interactive link nested inside a button. Clicking the already selected claim also opens its evidence, matching the prototype handler. Existing route keys and the single architecture renderer are retained; the old overview path controls are hidden only for the structured lesson. Native field guides expand within the optional band, which becomes one column while a full figure is open so the figure remains readable. The site’s established colors, native diagrams, and navigation frame replace the prototype’s inline styling and mock navigation.
