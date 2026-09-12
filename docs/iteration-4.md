# Iteration 4: the first visit

An external review of the published site found the foundation strong and the first visit too heavy: too many decisions before the picture settled, one confirmed navigation defect, and a mental map that implied the cluster sat inside the data services. This iteration responds to that review.

## Defect

Inline poster links on the learn views carried a second `#` (`#field-guides#poster-…`), which the router read as an unknown chapter and sent to Start. They now use the existing `?guide=` parameter, and poster articles on the guides page share the `guide-` id scheme with native guides, so one scroll handler serves both.

## Changes

- **Landing page.** The start page now opens with one promise and one action: find your request on the map, then see what built the map and where its Azure code lives; start with view 01, or trace one API request first. The path follows immediately. The three meanings of SPI and the six places come after the path, as reference, and the meanings are ordered as the views meet them (01, 03, 04) so their links no longer compete with the path order.
- **Ladder geometry.** The six places are no longer drawn as one nesting. The resource group holds the Azure data services and the AKS cluster side by side; the cluster nests namespaces and one service; the source sits outside with the label "built from, not inside". Level names and details were adjusted to say "beside".
- **Running example.** One example runs through the learn views: a partition lookup for `opendes` in a stack called `dev1` (`GET /api/partition/v1/partitions/opendes`), then a fix to the partition provider that reaches `dev1` through the image lock. Each view carries it in a second line under "In this view".
- **Easy mistakes.** Each map view shows one entry from "Things that are not true" beside its map, keyed by moment where the map has moments: profiles and the estate on the developer path, the http endpoint on the request path, suspension during reconcile, CLI exit at inspect, teardown at remove, Cosmos data-plane grants at the SPI boundary, and the smoke test in the engineering view. The collected page is unchanged and linked from every callout.
- **Development and test.** View 01 now says in its intro that the stack is built for development and test, rather than only in the scope note at the bottom.
- **Phone menu.** Below 760px the chapter list collapses behind a button that names the current chapter, so the map starts within the first screen.

## Not done

- A guided first render of the view 01 map (client, one service, its partition resources, with the rest revealed on request) is the remaining item from the review. It needs a filter in the architecture renderer and is left for a later iteration.
- Illustrative "what success looks like and what it still does not prove" evidence beside every command. The five-milestones guide already covers this for bring-up; extending it to every artifact is a content pass on component details.
