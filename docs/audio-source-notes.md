# Guide and audio overview

The supplied `osdu-spi-stack-guide.pdf` is a useful narrative source. The website still targets engineers who already know OSDU: use the guide to connect ownership, deployment, and operation, rather than replaying OSDU fundamentals. The PDF is preserved unchanged.

## The deep dive audio

`Engineering the OSDU SPI Stack on Azure` is a NotebookLM discussion generated from the guide (58:36). It is served from `public/audio/` and played by the Listen page (`#listen`) and the persistent dock. The 22 chapter markers, their target views, and their source-check notes live in `src/content/audio.js`; the transcript paragraphs in `src/content/transcript.js` are generated from `docs/reference/engineering-the-osdu-spi-stack-on-azure.vtt`.

Rules for markers:

- Marker times come from the transcript, not from the guide’s page order.
- Every marker links a site view. It never navigates automatically; the learner chooses.
- Where the narration rounds a number or overstates a guarantee, the marker carries a `note` that says what the source documentation claims, with the same wording standard as the map explanations.

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
| 47:43 | The image lock                               | `#engineering-system?detail=delivery`         |                                                                                  |
| 48:57 | One environment, eight forks                 | `#engineering-system?detail=running`          |                                                                                  |
| 50:40 | Pinned versions and ephemeral pins           | `#engineering-system?detail=proof`            |                                                                                  |
| 55:20 | Trusting a repository, not its pull requests | `#engineering-system?detail=repo`             |                                                                                  |
| 56:46 | What the design is really about              | `#not-true`                                   |                                                                                  |

## Tighten these phrases before recording a narration

Page numbers below are the printed PDF page numbers. These are focused source checks, not an exhaustive technical audit of all 47 pages. They also apply to the generated audio, which follows the guide.

1. **Pages 7 and 37–38: distinguish provisioning from readiness.** “Forty-five to fifty minutes later … a running OSDU environment” and “Fifty Minutes, Start to Finish” overstate the measurement. Use: “Prior centralus smoke observations put fresh provisioning at roughly 45–50 minutes. Flux and initialization may continue after the CLI returns; verify the API path you need.” The 150-minute schema Job deadline is a ceiling, not an expected duration. Source: `osdu-spi-stack/docs/design/deployment-lifecycle.md`.
2. **Page 9: clarify the namespace count.** The prose says SPI uses three namespaces of its own, but the table also lists `osdu-flux`. Use: “The workload layers are foundation, platform, and osdu. SPI-owned GitOps objects and configuration live separately in osdu-flux.” Keep Azure-managed controller and mesh namespaces distinct. Source: `osdu-spi-stack/docs/architecture.md`.
3. **Page 38: scope the API evidence.** “Only the fifth means the environment works” is broader than one successful request proves. Use: “An authenticated response proves the API path and caller you exercised; other services and negative authorization cases need their own evidence.” Source: deployment lifecycle and `docs/design/fork-deployment.md`.
4. **Pages 36 and 38: purge does not remove arbitrary external grants.** The implementation discovers external role assignments and removes the stack-owned ExternalDNS grant. Unknown grants, failed discovery, or failed removal stop purge with the resource group intact. Replace “every role assignment” with this narrower behavior. Source: `osdu-spi-stack/docs/design/deployment-lifecycle.md`, “Full removal,” and `src/spi/teardown.py`.
5. **Pages 18 and 39: qualify live-edit reversion by ownership.** A suspended Git source stops fetching new commits. Controllers still reconcile cached desired state and other live inputs. Changes to a Flux-managed object can be reverted; CLI-owned bootstrap inputs and the image lock have separate owners. Avoid saying every live edit is reverted. Source: `osdu-spi-stack/docs/design/flux-reconciliation.md` and `docs/architecture.md`, ownership boundaries.

Keep broader guide material on middleware, certificates, and incident examples available for later depth.
