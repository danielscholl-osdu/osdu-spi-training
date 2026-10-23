# Fieldnote 08 · Whose image is running?

**Status: published.** Season 2, _Working the stack_. Cut from osdu-spi-stack ADR-033 (`docs/decisions/033-explicit-canonical-image-source-policy.md`), ADR-017, ADR-036's pairing rule, PR #371 (v0.30.0), `src/spi/images.py`, `src/spi/pins.py` and `src/spi/info.py`, and `.github/workflows/env-refresh.yml`, read at `main` 870f729 (identical to the v0.32.0 tag 3d3106d outside `ops/`); the fork template's `.github/template-workflows/ghcr-retention.yml` in `Azure/osdu-spi`; and the 22 October take on spi 0.32.0. The lesson it proposes is `whose-image` in the _Working the stack_ book.

**Who is watching:** an engineer who has brought up a core environment (Fieldnote 02) and has seen a fork's day (Fieldnote 05). **What they should believe after it:** every service runs an image its Azure fork's `main` built, chosen once at `spi up`; the image lock ties that image's tag to one commit and one digest, which is what the pods run; and an image ages toward GHCR retention unless someone refreshes it, which on a personal environment is you.

**Money shot:** partition's row in `spi info`, `sha-8aa26ca0`, drawn out to the fork commit it names and back to the two pods running digest `sha256:ace8c625…`.

**Form: mixed, footage first.** It opens cold on the take's `spi info` table, every source reading `azure`, then follows one row home. Footage carries what the environment reported (`spi info`, `spi status`); boards carry what the take could not record (GHCR, the fork's commit, retention over thirty days). The fork commit and the GHCR digest are drawn from the repository and the registry, checked on 22 October, and labeled as such.

**Length:** about 4 minutes (estimate below).

## Angles considered

- **Follow one tag home** (chosen). Footage first, about 4 minutes. One row, one commit, one digest, then the clock on it. Best for engineers who will read `spi info` and wonder where a build came from.
- **The day the source changed.** Before 0.30 a bare `spi up` resolved community GitLab images, which stopped resolving when the community `azure_deploy` job failed; PR #371 moved every service to its Azure fork. Dropped as the frame: it builds the episode around a defect the stack has since removed. Kept as one sentence in claim 1.
- **Thirty days.** Retention first: the 21-day mark, the Monday prune, the weekday refresh. Boards only, about 2 minutes. Nothing in the take is old enough to show the mark, so every frame would be drawn. Kept as claim 3 and the easy mistake.
- **Mirrors.** `spi onboard --canonical-source fork` and the `spi-source-<service>` tag. Dropped: the take recorded no mirror, and the lesson's audience runs Azure canonicals. Named once in claim 1's reason.

## The look

The series sheet, ink and fonts. Owners: the `spi` CLI (resolves at `spi up`, reports in `spi info`), Flux (applies the lock), the service fork, and you. **Orange appears once, on the fork's commit card**, because that card is fork-owned source; the GHCR package and the lock are drawn in neutral ink. Product icons from `src/components/icons.js` for GitHub and the cluster.

**New devices for the series:** a table row that lifts out of the footage and becomes a card; a thread drawn from that card to the fork commit and on to the pod rows, one segment per hop; a thirty-day ruler with two marks, used again in the easy mistake.

## The sound

- Series bookend beds under the prequel and postquel.
- The under-narration bed under the cold open (c1), the traced example (n6) and the recall (n8), ducked 10 dB under every line with the 2 kHz cut. No bed under n3 to n5 or n7, where table rows and code are read.
- Effects, two in all: a soft tick as each hop of the thread lands (n4 and n6), a page turn when the 21-day mark sets (n5).
- -16 LUFS integrated; 1 to 4 kHz of the bed at least 7 dB under the voice, measured with `film aqa`.

## Lines and boards

Times are approximate; the narration sets them.

| Line | Beat · chapter                                                                           | Narration                                                                                                                                                                                                                                                                                                                                                                                                        | Board                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Form         | Sound                               |
| ---- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ----------------------------------- |
| c1   | Cold open                                                                                | Thirteen services and the schema loader. Every source reads azure. None of these came from the community registry. Each one is a build of a service fork's main branch. So whose image is running? Follow one.                                                                                                                                                                                                   | Footage: `spi info` from the take (s08-info), cropped to the _OSDU Service Versions_ table: fourteen rows, Image, Built, Source. On "Every source", the Source column lights top to bottom. On "Follow one", every row but partition dims.                                                                                                                                                                                                                                                                                                                                        | take         | bed in under the first word, ducked |
| n0   | Prequel                                                                                  | Fieldnote eight. Whose image is running?                                                                                                                                                                                                                                                                                                                                                                         | The notebook push-in; the gears turn one tooth as `FIELDNOTE 08 · WHOSE IMAGE IS RUNNING?` sets.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | bookend      | series bed                          |
| n1   | Question                                                                                 | Which build does each service run, where did it come from, and how long can it stay?                                                                                                                                                                                                                                                                                                                             | Kinetic type on the spoken times, then the question lifts into the left third.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | drawn        |                                     |
| n2   | Standfirst                                                                               | Every service runs an image built from its Azure fork's main branch. S P I up chooses it once, the image lock records it, and it stays until a refresh moves it.                                                                                                                                                                                                                                                 | Four boxes draw left to right on their words: fork `main` (orange outline), GHCR package, `osdu-image-lock`, pods in `osdu`. A dashed loop labeled `refresh` sets over the second and third on "until a refresh".                                                                                                                                                                                                                                                                                                                                                                 | drawn        |                                     |
| n3   | Claim 1 · **Each service runs its Azure fork's main image from GHCR.**                   | At S P I up, the C L I asks G H C R, for each of thirteen forks, which digest main snapshot names, and records it under the commit's sha tag. Schema's loader comes from the same commit as schema. The community registry is not a source: its images don't carry the Azure provider. An environment can record a trusted mirror for one service. This one had none.                                            | Thirteen package cards stack in a column, `ghcr.io/azure/osdu-spi-<service>`, each with a `main-snapshot` pointer to a digest and a `sha-<12>` tag on the same digest. On "Schema's loader", `osdu-spi-schema-load` hangs off schema's card with the same tag. Footage: s08-info's schema and schema-load rows, both `sha-dc3f14ca`. On "community registry", a grey GitLab card draws at the edge and crosses out. On "This one had none", back to the Source column, all `azure`.                                                                                               | board + take |                                     |
| n4   | Claim 2 · **The lock ties each tag to one fork commit and one digest.**                  | Partition's tag names a commit on its fork's main, an upstream integration merged that same day. On G H C R, that tag points at one digest, and that digest is what both partition pods run. A tag can move. The lock keeps the digest, and the build date beside it.                                                                                                                                            | The partition row lifts out of the s08-info footage as a card: `sha-8aa26ca0 · 2026-10-22 · azure`. A thread draws left to a fork commit card (orange): `Azure/osdu-spi-partition · main · 8aa26ca0 · merge #202, upstream integration`, labeled _from the repository_. Then right to a GHCR card: `sha-8aa26ca007ad → sha256:ace8c625…`, labeled _from the registry_. Then down into footage: s08-status's two `osdu-partition-…` rows, `osdu-spi-partition@sha256:ace8c625…`, lit. On "A tag can move", the tag label slides off the digest and the lock's digest stays pinned. | board + take | tick per hop                        |
| n5   | Claim 3 · **A canonical image ages toward retention until a refresh moves it.**          | That image does not move on its own. Every Monday, each fork prunes sha images older than thirty days, once main has built past them. So S P I info and S P I status mark a canonical built more than twenty-one days ago, which leaves nine days. On the shared environment, a run every weekday morning refreshes every service, an hour ahead of Monday's prune. On yours, that's you: S P I service refresh. | A ruler from day 0 to day 30 draws under the partition card. At 21 a warning tick sets with the CLI chip; at 30 a prune mark sets with the fork chip and `Mon 05:00 UTC`. Footage: s08-info's Built column, the oldest dates (`2026-10-15`, seven days on the take) placed on the ruler; none reaches 21. On "On the shared environment", a weekday strip `04:00 UTC, Mon to Fri` draws above the ruler for `shared` only. On "that's you", the command `spi service refresh --forks` sets under it.                                                                              | board + take | page turn on the 21-day mark        |
| n6   | Example · **Example: Follow partition's tag home**                                       | Follow partition's row home. S P I info reads the image lock. The lock holds the repository, the commit's tag, the digest and the build date. On G H C R, that tag points at the same digest. The tag names a merge on the fork's main. And S P I status shows both pods running that digest. Whose image? The fork's, from one commit you can read.                                                             | A dot traces five hops with the example's labels: `spi info`, `osdu-image-lock`, `GHCR tag`, `Fork commit`, `Running pods`. Each hop shows its one value from the take or the repository, the same values as n4, with its source label. The last hop is s08-status footage.                                                                                                                                                                                                                                                                                                       | board + take | bed under, ducked; tick per hop     |
| n7   | Easy mistake · **Easy mistake: My environment picks up the fork's new main on its own.** | An easy mistake: my environment picks up the fork's new main on its own. It doesn't. S P I up chooses images once, and running it again keeps the lock unless you ask for a refresh. Only the shared environment refreshes on a schedule. On yours, read the built date in S P I info, and refresh before the mark becomes a deleted image.                                                                      | The myth writes itself in quotes with the _You, the operator_ chip and an `spi` tool chip. The n5 ruler returns with a second partition card ghosted at day 25, its Built date in the warning color and the status line drawn under it, labeled _illustrative_: `partition runs an image built over 21 days ago; GHCR retention can delete it at 30 days. Run 'spi service refresh partition'.` On "refresh", the ghost card slides back to day 0.                                                                                                                                | drawn        |                                     |
| n8   | Recall                                                                                   | So now you can say: each service runs its Azure fork's main image from G H C R. The lock ties each tag to one fork commit and one digest. And a canonical image ages toward retention until a refresh moves it.                                                                                                                                                                                                  | The three headlines stack up on a notebook spread, set from the claims.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | drawn        | bed under, ducked                   |
| n9   | Next                                                                                     | Next: who does the stack think you are, and what may you do?                                                                                                                                                                                                                                                                                                                                                     | Postquel: the Next card on the notebook's empty left page, then the pull-back with "Fieldnotes · Azure SPI".                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | bookend      | series bed                          |

**Runtime estimate:** about 480 words at 150 a minute is 3 minutes 10 seconds, plus the bookends and board hand-offs, about 3 minutes 55 seconds. If the voiced total lands above 4 minutes 15, cut n3's mirror sentences ("An environment can record… This one had none.") first; the Source column already says it.

## The take

Two casts from the 22 October session on the throwaway core environment, spi 0.32.0, recorded after the environment was Ready and maintenance was cleared. Nothing else was recorded for this episode, and the environment is torn down.

| Cast         | Command      | Recorded (UTC) | Length | Used in        |
| ------------ | ------------ | -------------- | ------ | -------------- |
| `s08-info`   | `spi info`   | 23:25:23       | 8.6 s  | c1, n3, n4, n5 |
| `s08-status` | `spi status` | 23:25:28       | 4.0 s  | n4, n6         |

- **What the take showed:** fourteen lock entries (thirteen services and `schema-load`), each Source `azure`, none marked `(next refresh)`, none pinned; Built dates from `2026-10-15` to `2026-10-22`; caption `resolved 2026-10-22T22:38:06Z`. `spi status` showed every OSDU pod running `osdu-spi-<service>@sha256:…`; partition's two pods ran `sha256:ace8c625…`.
- **Checked off camera on 22 October:** `ghcr.io/azure/osdu-spi-partition:sha-8aa26ca007ad` resolves to `sha256:ace8c6259992…`, the take's pod digest; `Azure/osdu-spi-partition` commit `8aa26ca007ad` is `Merge pull request #202 from Azure/release/upstream-20261022-172631`, merged to `main` at 17:59 UTC, four and a half hours before the take resolved images. These are drawn and labeled, not footage.
- **Masked on screen:** the environment name and every resource name or hostname built from it (the cluster context, the Key Vault, Cosmos, Service Bus and storage account names, the gateway FQDN) as `<name>`; the gateway IP; the `Azure` panel and _Internal Services_ table are cropped out. Image digests may show their first eight hex characters, as the take's own truncation does.
- `spi info` prints the tag cut to 12 characters (`sha-8aa26ca0`); the lock and GHCR carry `sha-8aa26ca007ad`. Boards show which one they are quoting.

## Keep it true

- The default canonical is `Azure/osdu-spi-<service>`'s `main`: the digest `main-snapshot` names in `ghcr.io/azure/osdu-spi-<service>`, recorded under the `sha-<12>` tag of the commit that built it. Schema's loader is `osdu-spi-schema-load` at schema's commit. Never say "the latest image" or "a release".
- Thirteen services follow forks; fourteen lock entries include the loader. Never say fourteen forks.
- The community GitLab registry is not a source (since v0.30.0, PR #371): its images don't carry the Azure provider. Narrate it as the end state, with no version or date on screen. A recorded `community` source reads as `azure`. Do not say the stack "falls back" to anything: a missing or private package fails resolution.
- A trusted mirror (`spi-source-<service>` tag, `spi onboard --canonical-source fork`) is the only other canonical, one service at a time. The take had none.
- `spi info`'s Source column is the policy the next refresh resolves; the Image column is what runs now. `(next refresh)` marks a running image that predates the policy.
- The lock records repository, tag, digest and build date; the pods run the digest. The `sha-<12>` tag is mutable, the digest is not.
- `spi up` resolves images when there is no lock and preserves an existing lock on a rerun unless `--refresh-images` is given. `spi reconcile --refresh-images` and `spi service refresh` are the other ways to move a canonical.
- Retention is the fork template's `ghcr-retention.yml`: weekly, Mondays 05:00 UTC, deleting a version whose tags are all `sha-*` and whose age is over 30 days. A version that still carries `main-snapshot` is not deleted. Say "once main has built past it", not "every image older than 30 days".
- The mark is at 21 days (`FORK_CANONICAL_REFRESH_AGE_DAYS`), on unpinned entries only: the Built date in `spi info` turns to the warning color, and `spi status` prints the refresh it needs. Pinned services are not marked.
- The weekday refresh is `env-refresh.yml` against the shared environment only (`ops/environments/shared.yaml`), 04:00 UTC Monday to Friday. No schedule refreshes a personal environment.
- `spi service refresh --forks` re-resolves every service, whatever its source; its help text still says "whose canonical source is a fork". Do not quote the help text.
- Never draw a pin: the take had none, and pins are lesson 06's subject.

## Spoken forms

Adds to the series table.

| Written                    | Spoken                       |
| -------------------------- | ---------------------------- |
| GHCR                       | G H C R                      |
| `main-snapshot`            | main snapshot                |
| `sha-8aa26ca0`, `sha-<12>` | (not spoken; on screen only) |
| `spi info`, `spi status`   | S P I info, S P I status     |
| `spi service refresh`      | S P I service refresh        |
| `osdu-image-lock`          | the image lock               |

## Chapters

n3, n4, n5, n6 and n7, titled with the bold text above. The cold open and the question sit before the first chapter.

## Review the cut

- c1 and the n3 to n6 footage are the take's own frames, cropped and zoomed, not retyped.
- The fork commit and GHCR cards carry their _from the repository_ and _from the registry_ labels in every frame they appear.
- Orange appears only on the fork commit card.
- The 21-day warning in n7 is labeled _illustrative_; no frame claims the take showed one.
- No environment name, hostname, IP, account name, or full digest is readable in any frame.
- The bed is under c1, n6 and n8 only, and measures at least 7 dB under the voice in 1 to 4 kHz.
- Chapter marks fall on n3 to n7 and read exactly as titled.
- Each claim board and the table crop read at 405 px wide.

## Cut-downs

- **40 s, 16:9:** c1 into n4's thread, ending on the pod rows. For the docs page on canonical images.
- **The clock:** n5 and n7 together, about 50 s, for operators of personal environments.

## Proposed lesson

`whose-image`, in the _Working the stack_ book, before `core-dags`. Map lesson at the seam's rung: the fork repository on GitHub, its GHCR packages, and your environment's image lock and pods, as lesson 06 draws them.

- **Title:** Whose image is running
- **Subhead:** Every service runs an image its Azure fork's main branch built, chosen once at spi up and kept until a refresh moves it.
- **Question:** Which build does each service run, where did it come from, and how long can it stay?
- **Builds on:** the environment from lesson 02 and the fork's day from lesson 05.
- **Outcomes (headlines):**
  1. Each service runs its Azure fork's main image from GHCR.
  2. The lock ties each tag to one fork commit and one digest.
  3. A canonical image ages toward retention until a refresh moves it.
- **Example:** _Follow partition's tag home_, `spi info`. Hops: `spi info` (reads the lock; partition `sha-8aa26ca0`, built 2026-10-22, source azure) → `osdu-image-lock` (repository, tag, digest, build date) → GHCR (`sha-8aa26ca007ad` points at the recorded digest) → the fork commit (`Azure/osdu-spi-partition` `main`, a merged upstream integration) → the running pods (`spi status`: both pods on that digest).
- **Easy mistake:** `refresh-is-automatic`, owner `you`, theme `seam`. Claim: "My environment picks up the fork's new main on its own." Reality: `spi up` resolves canonicals once and preserves the lock on a rerun; only the shared environment refreshes on a weekday schedule; on a personal environment `spi info` and `spi status` mark a canonical older than 21 days, and the fork's weekly retention can delete it once it is over 30 days and `main` has built past it. Correction: "A personal environment keeps its images until you refresh them." Check: `spi info`. Sources: `images` (ADR-033), `imageLock` (ADR-017), and a new key for `ghcr-retention.yml` in `Azure/osdu-spi`.

## Unverified

- That a pod rescheduled after retention deletes its digest fails to pull. ADR-033 says the digest "is no longer pullable"; nothing in the take or the tests exercises it. The episode says only that the image can be deleted.
- Why the oldest images on the take were built on 15 October (whether those forks had not built since, or `main-snapshot` had not moved). Not narrated.

## Choices for Daniel

- **The fork commit and GHCR digest are drawn, not recorded.** Recommended: keep them as labeled cards; both were checked against the live repository and registry on 22 October. The alternative is a browser capture of the commit page, which would need a re-take day.
- **Episode title punctuation.** Recommended: the episode keeps its question mark (`FIELDNOTE 08 · WHOSE IMAGE IS RUNNING?`), and the lesson title drops it, since a lesson H1 is a phrase with no punctuation.
