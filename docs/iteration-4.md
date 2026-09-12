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

## Second pass: reading without losing your place

The "On the map →" links in the familiar-things guide had become a remote control for the map: every click scrolled the page up, opened a panel, and left the table out of view. The rule now is that a link below the map never moves the page unless its label says so.

- **Explain in place.** Each familiar-things row is a disclosure. Opening it shows the component's explanation (the same text the map panel shows, with its artifact and source) under the row, without scrolling. "Show it on the map ↑" is a secondary link inside the open row and is the only thing that moves the page.
- **One rule in the renderer.** Only links carrying `data-map-jump` scroll the map into view and expand the explanation. Other same-view changes update the selection silently. The easy-mistake callout labels its link "Show it on the map ↑" when it points into the current view.
- **The example is drawn, not described.** The running-example paragraph is gone from the text above the map. Each map view draws it as five hops above the map (client → gateway → partition service → its provider → stored configuration in common Storage tables; the lifecycle version steps through moments; the SPI version follows the lookup through the interface; the engineering version is the old journey strip, moved). Clicking a hop selects that component; the current hop and the ones before it are marked, and the matching components on the map are ringed.
- **The provider path is corrected.** The partition service's Azure provider checks a cache and then reads stored properties from Azure Table Storage in common Storage. It returns configuration; other services use that to find their Cosmos, Storage, and Service Bus. The SPI diagram's endpoint, the outcome line, and the shared-data explanation now say this, traced to PartitionServiceImpl.java and the workload-identity guide (Storage Table Data Contributor is granted on common Storage only).
- **Callouts moved under the map** and the SPI-boundary one changed from Cosmos role assignments to authentication versus authorization, which is the boundary the followed request actually crosses. That entry is new in "Things that are not true" (eleven now).
- **Scope sentences shortened** to one line each.
