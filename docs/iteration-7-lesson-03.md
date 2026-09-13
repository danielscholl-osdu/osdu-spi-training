# Iteration 7 · The provider boundary and cache fallback

Lesson 03 now uses the claim-led grammar established in iteration 6. It covers bead `fn-bye` on branch `keelson/beads-work/dc72835a` and leaves the shared two-column orientation and lesson 01 unchanged.

## What changed

**Three claims drive lesson 03.** The lesson first shows how `partition-core` calls `IPartitionService.getPartition` and how `provider/partition-azure` uses Workload Identity for Azure access. It then shows that both sides of the interface execute in one service image, with no network hop between them. The final claim separates upstream-owned source from the fork-owned provider outside generated `fork_upstream`.

**One map shows runtime and source ownership.** The existing SPI map now includes the service-image boundary, Azure resources outside that image, and selectable upstream and engineering-system nodes. Claim selection focuses the relevant components and boundaries. The cache exception remains visible in the first claim's reason with the evidence drawer closed.

**One five-hop trace has two presentations.** The collapsed running example opens to Normal and Cache down controls over the same `client`, `core`, `contract`, `azureimpl`, and `azureclients` hops. Normal is a healthy cache miss. Cache down changes hop four to “Cache read throws; treated as a miss” and hop five to “Table Storage answers anyway.” Both assume common Table Storage is reachable and contains `opendes`; neither implies that Table Storage failures or a missing partition are swallowed.

**Provider evidence is ordered.** The Azure implementation drawer links the cache fallback fix at commit `fc2dfbf` first, ADR-038 second, and `PartitionServiceImpl` third. Its verification artifact names `PartitionServiceImplTest.should_fallBackToTableStore_when_cacheReadThrows_onGetPartition`.

## Verification

`npm run check` passes: formatting, 23 content and renderer tests, and the production build. The tests cover exact claim focus and evidence sets, map scope targets, immutable shared hops, both trace presentations, ordered source links, restrictive commit URLs, step-less evidence routes, lesson 01 compatibility, and an unconverted lesson.

A Chrome DevTools Protocol probe exercised the actual controls at 1440 by 1100 and 390 by 1100. At both widths the clean route keeps the drawer and example closed with claim one selected; claim, evidence, component, policy, variant, and hop interactions update the same map; Escape and × restore focus; evidence Back and Forward select the matching claim; and the page has no horizontal overflow. The cache-down trace reaches hop five after the handled hop-four exception.

The screenshots and raw probe result are kept outside the repository in the session artifact directory:

- `lesson-03-1440.png` and `lesson-03-390.png`
- `lesson-03-cache-down-1440.png` and `lesson-03-cache-down-390.png`
- `lesson-03-map-cache-down-1440.png` and `lesson-03-map-cache-down-390.png`
- `lesson-03-browser-results.json`, `lesson-03-browser-probe.mjs`, and `npm-run-check.log`

With the drawer closed, the observed answer is: “Shared `partition-core` code calls `IPartitionService.getPartition`. Fork-owned `provider/partition-azure` implements it in the same service image. It checks the cache, then reads `opendes` from common Table Storage using Workload Identity even if the cache read throws.”

## Review disposition

A second agent reported one medium concern: step-less lesson 03 hop URLs do not restore trace intent after reload. No code change was made for that finding. This iteration deliberately keeps variant and hop selection as local presentation state, adds no route parameter, and gives bare `?detail=` URLs evidence intent so direct `azureimpl`, `image`, and `upstream` links select their matching claims. The browser probe confirmed those evidence links and Back and Forward behavior. Explicit hop clicks continue to provide unambiguous trace intent during the current lesson visit.

## Not done, on purpose

- **Shared orientation and lesson 01:** the settled question-plus-goal orientation is unchanged. Lesson 03 names its prerequisite and place in its own introduction.
- **A second cache diagram:** Normal and Cache down remain presentations of one map and one canonical hop list.
- **Persistent variant state:** the selected trace condition survives same-chapter interactions and resets on chapter change or reload.
- **Live execution:** the switch is illustrative and makes no Azure, SPI, cache, or storage request.

## Reference adaptations

The source comparison sits outside the runtime image because the fork has no place inside Azure. Orange remains reserved for fork-owned source; the handled cache failure uses a text label and a non-orange rule. Redis and common Table Storage remain outside the service-image boundary, while the provider interface and implementation remain inside it. The provider-path note explicitly excludes the partition's Cosmos, blob Storage, and Service Bus from this lookup.
