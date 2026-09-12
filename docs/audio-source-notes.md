# Guide and future audio overview

The supplied `osdu-spi-stack-guide.pdf` is a useful narrative source. The website still targets engineers who already know OSDU: use the guide to connect ownership, deployment, and operation, rather than replaying OSDU fundamentals. The PDF is preserved unchanged.

## Pair the narrative with a place in the site

| Narration beat                           | Existing visual destination                                     | What to make clear                                                                               |
| ---------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| The shape of an environment              | `#running-stack`                                                | AKS and Azure data services are inside the stack; the workstation and image sources are outside. |
| Familiar OSDU partitions                 | `#running-stack/developer?detail=cosmos`                        | SQL, Storage, and Service Bus are per partition; other resources are shared.                     |
| From nothing to an assembled environment | `#bring-up/start` through `#bring-up/inspect`                   | One `spi up` invocation crosses several owners; provisioning and API readiness differ.           |
| Inbound callers and backend identity     | `#running-stack/request?detail=client`, then `?detail=identity` | An OSDU caller and a service's Azure managed identity are separate paths.                        |
| Code ownership                           | `#spi-boundary`                                                 | Common service behavior and fork-owned Azure implementations compile together.                   |
| A fork candidate reaches the environment | `#engineering-system?detail=delivery`                           | The image lock links a digest to a workload; acceptance and restoration follow.                  |
| Leaving the environment                  | `#bring-up/remove`                                              | Ordinary teardown deletes compute and data while retaining identity and naming.                  |

When the recording is available, use a native audio player with playback speed, a transcript, and optional timestamp links to these scenes. Let the learner choose when to open a diagram; do not automatically navigate while they are exploring. Determine timestamps from the actual recording. No player or placeholder audio is added before the file exists.

## Tighten these phrases before recording

Page numbers below are the printed PDF page numbers. These are focused source checks, not an exhaustive technical audit of all 47 pages.

1. **Pages 7 and 37–38: distinguish provisioning from readiness.** “Forty-five to fifty minutes later … a running OSDU environment” and “Fifty Minutes, Start to Finish” overstate the measurement. Use: “Prior centralus smoke observations put fresh provisioning at roughly 45–50 minutes. Flux and initialization may continue after the CLI returns; verify the API path you need.” The 150-minute schema Job deadline is a ceiling, not an expected duration. Source: `osdu-spi-stack/docs/design/deployment-lifecycle.md`.
2. **Page 9: clarify the namespace count.** The prose says SPI uses three namespaces of its own, but the table also lists `osdu-flux`. Use: “The workload layers are foundation, platform, and osdu. SPI-owned GitOps objects and configuration live separately in osdu-flux.” Keep Azure-managed controller and mesh namespaces distinct. Source: `osdu-spi-stack/docs/architecture.md`.
3. **Page 38: scope the API evidence.** “Only the fifth means the environment works” is broader than one successful request proves. Use: “An authenticated response proves the API path and caller you exercised; other services and negative authorization cases need their own evidence.” Source: deployment lifecycle and `docs/design/fork-deployment.md`.
4. **Pages 36 and 38: purge does not remove arbitrary external grants.** The implementation discovers external role assignments and removes the stack-owned ExternalDNS grant. Unknown grants, failed discovery, or failed removal stop purge with the resource group intact. Replace “every role assignment” with this narrower behavior. Source: `osdu-spi-stack/docs/design/deployment-lifecycle.md`, “Full removal,” and `src/spi/teardown.py`.
5. **Pages 18 and 39: qualify live-edit reversion by ownership.** A suspended Git source stops fetching new commits. Controllers still reconcile cached desired state and other live inputs. Changes to a Flux-managed object can be reverted; CLI-owned bootstrap inputs and the image lock have separate owners. Avoid saying every live edit is reverted. Source: `osdu-spi-stack/docs/design/flux-reconciliation.md` and `docs/architecture.md`, ownership boundaries.

Keep broader guide material on middleware, certificates, and incident examples available for later depth. This prototype's next review should first validate that the four-view learning flow and map interaction hold attention.
