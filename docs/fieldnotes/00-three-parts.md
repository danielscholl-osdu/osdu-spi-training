# Fieldnote 00 · Three parts

**Status: storyboard for approval.** Replaces the Start video, _How Microsoft engineers Azure OSDU_, when the cut is approved. The narration is `docs/narration/start-video.md` exactly as written (393 words, about 2 minutes 40 seconds); its editorial record, word list, and review checklist are in `docs/start-video-script.md` and apply to this cut unchanged. This file adds only the boards, the sting line, and the close.

Fieldnote 00 has no chapters. It is the Start page's introduction, not a lesson, and the script's five sections are beats a storyboard follows, not markers.

**Before voicing:** recheck the adoption status in section 4 against the partition fork (`../osdu-spi-partition` at the head of `main`: does `.spi/service.yaml` exist, and does the validation workflow have a Deploy Gate?). If the fork has adopted the lane, stop: the sentence changes, and the script goes back for approval before anything is voiced.

## Lines and boards

Each board is drawn by the renderer of the lesson that teaches it, so the learner meets the same drawing in that lesson. A board shows only what its section's narration names.

| Line | Section                                      | Narration                                  | Board                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ---- | -------------------------------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| n0   | Sting                                        | Fieldnote zero. Three parts.               | The gears draw on the sheet; tag `FIELDNOTE 00 · THREE PARTS`.                                                                                                                                                                                                                                                                                                                                                                         |
| n1   | 1 · Three parts                              | Section 1 of the narration.                | The three machinery gears, labeled as the narration names them: the stack, the Azure provider inside each service, the workflows that keep it current. On “how those parts fit together”, the gears turn once together.                                                                                                                                                                                                                |
| n2   | 2 · Inside one service                       | Section 2.                                 | `spiBoundaryDiagram` (lesson 03): one service image with the shared code and the Azure provider inside it. On “through the Service Provider Interface”, the interface line lights; on “no network hop”, the image boundary holds both.                                                                                                                                                                                                 |
| n3   | 3 · The fork keeps the provider              | Section 3.                                 | `forkShapeDiagram` (lesson 04): the fork with its fork-owned provider path in orange. On “generates a branch … with the whole provider tree absent”, `fork_upstream` draws without provider paths; on “joins it on the integration branch”, the provider joins `fork_integration`.                                                                                                                                                     |
| n4   | 4 · A candidate is tested in a running stack | Section 4.                                 | `seamDiagram` (lesson 06): a digest written into the image lock, the pod running that digest, the suites, the captured canonical image written back. Drawn and labeled as illustrated, matching the spoken adoption status.                                                                                                                                                                                                            |
| n5   | 5 · The stack, and what you can then do      | Section 5.                                 | `architectureOverview` (lesson 01): the resource group with AKS beside Cosmos DB, Storage, Service Bus, and Key Vault. On “starts Flux, which continues assembling workloads after the command returns”, the CLI chip finishes while the Flux node is still working. On the two repositories, two owner chips: `osdu-spi-stack` (`--cli`) and `osdu-spi`. On “a partition lookup for opendes”, the dot traces the lesson 01 hops once. |
| n6   | Next                                         | Start with lesson one: anatomy of a stack. | End card: “Start with lesson 01” and its question, with “Fieldnotes · Azure SPI”.                                                                                                                                                                                                                                                                                                                                                      |

n1 to n5 are the five sections of `docs/narration/start-video.md`, voiced as written, one line per section. n0 and n6 are the only words added, and neither states a fact.

## Review the cut

The checklist in `docs/start-video-script.md` ("Review the recording before it replaces anything"), plus:

- Every board after the sting is a site renderer's drawing; no board shows a component, number, or name the narration does not say.
- Section 5 never draws a handoff where Flux starts when the CLI stops.
- No board labels the stack production or shows a real environment name.

## After the cut is approved

`frameVideo` in `src/content/audio.js` gives way to the Fieldnote 00 entry in `src/content/videos.js`; the three source-check notes are dropped because the narration states the corrected version, and the Start card keeps its caption, "How the machinery is engineered", with the new length. `docs/start-video-script.md` records that the script was recorded.
