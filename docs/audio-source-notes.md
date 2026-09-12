# Guides and audio overviews

Two supplied guides are the narrative sources: `osdu-spi-stack-guide.pdf` for the stack, and `osdu-spi-complete-guide.pdf` (103 pages, superseding the earlier 56-page `osdu-spi-guide.pdf`) for the engineering system. The website still targets engineers who already know OSDU: use the guides to connect ownership, deployment, and operation, rather than replaying OSDU fundamentals. The PDFs are preserved unchanged.

## The three episodes

All three are NotebookLM discussions. They are served from `public/audio/` as mono AAC at about 57 kb/s, played by the Listen page (`#listen?episode=<id>`) and the persistent dock, and cued from the learn views by short `listen` entries in `src/content/chapters.js`. Markers, target views, and source-check notes live in `src/content/audio.js`; transcript paragraphs in `src/content/transcripts/` are generated from the VTT files in `docs/reference/` (mlx-whisper, large-v3-turbo).

| Order | Episode id  | Title                                   | Source                  | Length | Markers |
| ----- | ----------- | --------------------------------------- | ----------------------- | ------ | ------- |
| 1     | `machinery` | The Azure SPI OSDU machinery            | all three guides        | 16:56  | 19      |
| 2     | `stack`     | Engineering the OSDU SPI Stack on Azure | SPI Stack guide         | 58:36  | 22      |
| 3     | `branches`  | Why Azure 3D-prints Git branches        | complete osdu-spi guide | 69:00  | 27      |

The order is the site’s, not the recording order. The orientation is seventeen minutes, surveys the same ground as the six views, and sets the frame they assume, so it is the default episode and the first tab; the start page cues its first three minutes (through “SPI means three things”). The stack episode and the fork episode are the deep dives their books cue into. A 56-minute round-trip discussion, `the-azure-osdu-service-provider-interface`, was carried briefly and then replaced by the orientation: same frame, a third of the length, and nothing in it that the two deep dives do not cover. Its VTT and markers are in the branch history (`fb5f509`) if a marker is ever wanted back.

Rules for markers:

- Marker times come from the transcript, not from the guide’s page order.
- Every marker links a site view. It never navigates automatically; the learner chooses.
- Where the narration rounds a number, mishears a command, or overstates a guarantee, the marker carries a `note` that says what the source documentation claims, with the same wording standard as the map explanations.
- A learn view’s `listen` cues start on a marker of the episode they name and play in place; the dock appears and playback stops at the end of the cued section (a cue may name its own `end`). While a cue plays, the line under the chips and a disclosure in the dock show the current marker’s source check, so a correction is read where the claim is heard.

### `stack` · Engineering the OSDU SPI Stack on Azure

| Time  | Narration beat                               | Site destination                              | Source check                                                                     |
| ----- | -------------------------------------------- | --------------------------------------------- | -------------------------------------------------------------------------------- |
| 0:00  | Why OSDU exists                              | `#start`                                      |                                                                                  |
| 6:08  | Shared core, swappable providers             | `#spi-boundary`                               |                                                                                  |
| 7:57  | Fifty resources, one command                 | `#bring-up/start`                             | 45–50 min is a centralus observation; readiness can follow the CLI exit.         |
| 10:57 | A dev/test environment by design             | `#running-stack/developer?detail=identity`    | “40 of 50 minutes on role assignments” is an illustration; docs record 5–15 min. |
| 12:44 | Four owners, four boundaries                 | `#running-stack`                              |                                                                                  |
| 15:15 | CLI exit is not readiness                    | `#bring-up/reconcile`                         |                                                                                  |
| 16:55 | The Azure-only bet                           | `#running-stack/developer?detail=cosmos`      |                                                                                  |
| 19:51 | The three that stayed in the cluster         | `#running-stack/developer?detail=middleware`  |                                                                                  |
| 22:52 | Letting Azure run the cluster                | `#running-stack/developer?detail=aks`         |                                                                                  |
| 26:03 | One local Helm chart                         | `#running-stack/developer?detail=service`     |                                                                                  |
| 27:27 | Ordering and the deliberate pause            | `#running-stack/developer?detail=flux`        |                                                                                  |
| 30:31 | When reconciliation gets stuck               | `#not-true`                                   |                                                                                  |
| 33:55 | Identity, outbound                           | `#field-guides?guide=identity`                |                                                                                  |
| 37:02 | The shared-identity trade-off                | `#running-stack/developer?detail=shared-data` |                                                                                  |
| 39:06 | The async path that does not work            | `#running-stack/request?detail=events`        |                                                                                  |
| 41:15 | Identity, inbound                            | `#running-stack/request?detail=gateway`       |                                                                                  |
| 44:21 | Making an empty OSDU useful                  | `#bring-up/reconcile?detail=initialization`   |                                                                                  |
| 47:43 | The image lock                               | `#handshake?detail=delivery`                  |                                                                                  |
| 48:57 | One environment, eight forks                 | `#handshake?detail=running`                   |                                                                                  |
| 50:40 | Pinned versions and ephemeral pins           | `#handshake?detail=proof`                     |                                                                                  |
| 55:20 | Trusting a repository, not its pull requests | `#handshake?detail=trust`                     |                                                                                  |
| 56:46 | What the design is really about              | `#not-true`                                   |                                                                                  |

### `machinery` · The Azure SPI OSDU machinery

| Time  | Narration beat                         | Site destination                         | Source check                                                                                                                                                                    |
| ----- | -------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0:00  | Your orientation                       | `#start`                                 |                                                                                                                                                                                 |
| 0:36  | An archive the size of a city          | `#start`                                 |                                                                                                                                                                                 |
| 2:03  | SPI means three things                 | `#start`                                 |                                                                                                                                                                                 |
| 3:00  | The provider model                     | `#spi-boundary`                          |                                                                                                                                                                                 |
| 3:41  | Upstream deletes the vendor code       | `#fork-shape`                            |                                                                                                                                                                                 |
| 4:48  | Ownership runs through the tree        | `#fork-shape?detail=provider-azure`      |                                                                                                                                                                                 |
| 5:29  | The modify/delete conflict             | `#fork-day/sync`                         | “-X theirs” is used exactly once, for the one-time seed at initialization, never for the daily sync.                                                                            |
| 6:21  | Generate the branch, do not merge      | `#fork-day/sync?detail=sync-pr`          |                                                                                                                                                                                 |
| 7:33  | Three branches, three jobs             | `#fork-shape?detail=fork-integration`    |                                                                                                                                                                                 |
| 8:28  | Halt on the unknown                    | `#fork-shape?detail=filter`              |                                                                                                                                                                                 |
| 9:18  | The stack: spi up                      | `#bring-up/start`                        | “Roughly 50 minutes” is a centralus observation; readiness can follow the CLI exit.                                                                                             |
| 10:09 | The Azure-only bet, and not production | `#running-stack/developer?detail=cosmos` |                                                                                                                                                                                 |
| 11:34 | One shared environment, eight forks    | `#handshake`                             | The narration gives two different service counts; the lock names every service the stack deploys and a run pins one.                                                            |
| 12:31 | Flux and the image lock                | `#handshake?detail=delivery`             |                                                                                                                                                                                 |
| 13:11 | Borrow, prove, restore                 | `#handshake?detail=restore`              | Restore writes the canonical image back only while this run still owns the pin.                                                                                                 |
| 14:02 | No stored credentials                  | `#handshake?detail=trust`                | The federated subject names the fork and its `spi-stack` environment, which admits every branch; no reviewer approves the job. The Roles also read deployments, pods, and logs. |
| 15:28 | Strict boundaries, not more parts      | `#fork-day`                              |                                                                                                                                                                                 |
| 16:13 | Loud failures over quiet assumptions   | `#not-true`                              |                                                                                                                                                                                 |

### `branches` · Why Azure 3D-prints Git branches

| Time  | Narration beat                                | Site destination                       | Source check                                                                                                                    |
| ----- | --------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 0:00  | The green checkmark that lied                 | `#not-true`                            |                                                                                                                                 |
| 2:25  | The energy data problem                       | `#start`                               |                                                                                                                                 |
| 5:31  | The provider model and the seam               | `#spi-boundary`                        |                                                                                                                                 |
| 6:16  | Upstream takes a bulldozer to the Azure code  | `#fork-shape?detail=upstream`          |                                                                                                                                 |
| 9:31  | Ownership runs through the middle of the tree | `#fork-shape`                          |                                                                                                                                 |
| 10:17 | One template for eight services               | `#fork-shape?detail=engineering`       |                                                                                                                                 |
| 13:27 | The bootstrap problem: local-actions          | `#fork-shape?detail=engineering-files` |                                                                                                                                 |
| 15:02 | Three branches, and why not two               | `#fork-shape?detail=fork-integration`  |                                                                                                                                 |
| 17:21 | Generate the branch, do not merge into it     | `#fork-day/sync?detail=sync-pr`        |                                                                                                                                 |
| 21:21 | From sculpting to 3D printing                 | `#fork-shape?detail=fork-upstream`     |                                                                                                                                 |
| 23:39 | Halt on the unknown                           | `#fork-shape?detail=filter`            |                                                                                                                                 |
| 25:59 | Memory for an amnesiac runner                 | `#fork-day/sync?detail=sync-pr`        |                                                                                                                                 |
| 29:06 | Labels as a state machine                     | `#fork-day/review?detail=labels`       | Removing `human-required` is noticed by Cascade Monitor on its six-hour schedule, not by a webhook; a person can also dispatch. |
| 30:46 | The cascade: main first                       | `#fork-day/cascade?detail=cascade-run` |                                                                                                                                 |
| 33:05 | Versioning without rewriting history          | `#fork-day/sync?detail=meta-commit`    |                                                                                                                                 |
| 36:11 | Never a bare -P                               | `#fork-day/cascade?detail=cascade-run` |                                                                                                                                 |
| 38:35 | The Dockerfile that rotted                    | `#fork-shape?detail=engineering-files` |                                                                                                                                 |
| 40:13 | Credentials: app tokens and the guard clause  | `#fork-day/prove?detail=candidate`     |                                                                                                                                 |
| 42:33 | The pull_request_target lesson                | `#handshake?detail=gate`               | The cascade now runs on `workflow_dispatch`; the narration describes the lesson, not the current trigger.                       |
| 46:28 | No coverage gate                              | `#fork-day/cascade?detail=cascade-run` |                                                                                                                                 |
| 48:52 | The tests are in the repository               | `#handshake?detail=descriptor`         |                                                                                                                                 |
| 52:04 | Three contracts: facts, descriptor, machinery | `#handshake?detail=facts`              |                                                                                                                                 |
| 54:28 | Borrow, prove, restore                        | `#handshake?detail=delivery`           | Restore always runs, but writes the canonical image back only while this run still owns the pin.                                |
| 57:45 | The customer tier and mirror mode             | `#fork-shape?detail=mirror`            |                                                                                                                                 |
| 61:04 | The decision register and derived learnings   | `#not-true`                            |                                                                                                                                 |
| 62:39 | The AI blindfold                              | `#not-true`                            |                                                                                                                                 |
| 65:48 | Split what fails differently                  | `#fork-shape?detail=engineering`       |                                                                                                                                 |

## Tighten these phrases before recording a narration

Page numbers below are the printed PDF page numbers of the SPI Stack guide. These are focused source checks, not an exhaustive technical audit. They also apply to the generated audio, which follows the guides.

1. **Pages 7 and 37–38: distinguish provisioning from readiness.** “Forty-five to fifty minutes later … a running OSDU environment” and “Fifty Minutes, Start to Finish” overstate the measurement. Use: “Prior centralus smoke observations put fresh provisioning at roughly 45–50 minutes. Flux and initialization may continue after the CLI returns; verify the API path you need.” The 150-minute schema Job deadline is a ceiling, not an expected duration. Source: `osdu-spi-stack/docs/design/deployment-lifecycle.md`.
2. **Page 9: clarify the namespace count.** The prose says SPI uses three namespaces of its own, but the table also lists `osdu-flux`. Use: “The workload layers are foundation, platform, and osdu. SPI-owned GitOps objects and configuration live separately in osdu-flux.” Source: `osdu-spi-stack/docs/architecture.md`.
3. **Page 38: scope the API evidence.** “Only the fifth means the environment works” is broader than one successful request proves. Use: “An authenticated response proves the API path and caller you exercised; other services and negative authorization cases need their own evidence.” Source: deployment lifecycle and `docs/design/fork-deployment.md`.
4. **Pages 36 and 38: purge does not remove arbitrary external grants.** The implementation discovers external role assignments and removes the stack-owned ExternalDNS grant. Unknown grants, failed discovery, or failed removal stop purge with the resource group intact. Source: `osdu-spi-stack/docs/design/deployment-lifecycle.md`, “Full removal,” and `src/spi/teardown.py`.
5. **Pages 18 and 39: qualify live-edit reversion by ownership.** A suspended Git source stops fetching new commits. Controllers still reconcile cached desired state and other live inputs. Source: `osdu-spi-stack/docs/design/flux-reconciliation.md` and `docs/architecture.md`.
6. **Complete guide, the handshake chapter: the image goes to GHCR.** The fork episode says the candidate is pushed to an Azure container registry. Validation pushes `ghcr.io/<owner>/<service>:sha-<commit>`; the provisioned ACR is a possible future mirror. Source: `osdu-spi-stack/docs/decisions/033-explicit-canonical-image-source-policy.md`.
7. **Complete guide, the cascade chapter: the trigger and the merge order.** Say the cascade is dispatched by Cascade Monitor with the tracking issue number, merges `main` first and then `fork_upstream`, and resets `fork_integration` only as stale-state recovery. Source: `osdu-spi/.github/template-workflows/cascade.yml`.
8. **Complete guide, the restore step: qualify by ownership.** `spi service reset --if-run` writes the recorded canonical image only while the annotation still names this run; exit 2 means not the owner, treated as success. Source: `osdu-spi-stack/docs/decisions/031-fork-image-deploys-as-ephemeral-pins.md`.
