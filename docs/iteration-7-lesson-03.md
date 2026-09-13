# Iteration 7 · The provider boundary and cache fallback

Lesson 03 now uses the claim-led grammar established in iteration 6. It leaves the shared two-column orientation and lesson 01 unchanged.

## What changed

**Three claims drive lesson 03.** The lesson first shows how `partition-core` calls `IPartitionService.getPartition` and how `provider/partition-azure` uses Workload Identity for Azure access. It then shows that both sides of the interface execute in one service image, with no network hop between them. The final claim separates upstream-owned source from the fork-owned provider outside generated `fork_upstream`.

**One map shows runtime and source ownership.** The existing SPI map now includes the service-image boundary, Azure resources outside that image, and selectable upstream and engineering-system nodes. Claim selection focuses the relevant components and boundaries. The cache exception remains visible in the first claim's reason with the evidence drawer closed.

**One five-hop trace has two presentations.** The collapsed running example opens to Normal and Cache down controls over the same `client`, `core`, `contract`, `azureimpl`, and `azureclients` hops. Normal is a healthy cache miss. Cache down changes hop four to “Cache read throws; treated as a miss” and hop five to “Table Storage answers anyway.” Both assume common Table Storage is reachable and contains `opendes`; neither implies that Table Storage failures or a missing partition are swallowed.

**Provider evidence is ordered.** The Azure implementation drawer links the cache fallback fix at commit `fc2dfbf` first, ADR-038 second, and `PartitionServiceImpl` third. Its verification artifact names `PartitionServiceImplTest.should_fallBackToTableStore_when_cacheReadThrows_onGetPartition`.

## Verification

`npm run check` passes: formatting, 23 content and renderer tests, and the production build. The tests cover exact claim focus and evidence sets, map scope targets, immutable shared hops, both trace presentations, ordered source links, restrictive commit URLs, step-less evidence routes, lesson 01 compatibility, and an unconverted lesson.

A Chrome DevTools Protocol probe exercised the actual controls at 1440 by 1100 and 390 by 1100. At both widths the clean route keeps the drawer and example closed with claim one selected; claim, evidence, component, policy, variant, and hop interactions update the same map; Escape and × restore focus; evidence Back and Forward select the matching claim; and the page has no horizontal overflow. The cache-down trace reaches hop five after the handled hop-four exception.

The source comparison sits outside the runtime image because the fork has no place inside Azure. Orange remains reserved for fork-owned source; the handled cache failure uses a text label and a non-orange rule. Redis and common Table Storage remain outside the service-image boundary, while the provider interface and implementation remain inside it. The provider-path note explicitly excludes the partition's Cosmos, blob Storage, and Service Bus from this lookup.
