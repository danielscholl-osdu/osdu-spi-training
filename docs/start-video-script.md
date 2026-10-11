# The Start video: script for approval

**Status: recorded.** This script was recorded as Fieldnote 00, _Three parts_ (storyboard `docs/fieldnotes/00-three-parts.md`), which replaced the start page's video, _How Microsoft engineers Azure OSDU_, on the Watch card "How the machinery is engineered". The narration is `docs/narration/start-video.md` voiced as written; the captions are `docs/reference/fieldnote-00-three-parts.vtt`. The old video's three source-check notes were dropped because the narration states the corrected version.

The current video calls the Azure logic proprietary, says the community stripped out all cloud-specific code, and says the environment is restored completely. The site corrects all three in the player's notes. This script states the corrected version so the most prominent introduction needs no corrections. It opens on the three parts the site connects, not on why OSDU exists, and it is written for engineers who already know OSDU.

The spoken text is kept separately in `docs/narration/start-video.md`. That file is what a narrator or generator receives; this document carries the editorial record around it.

**Length:** 398 words of narration, about 2.7 minutes at 150 words a minute and 3.0 at 130. Target: about two and a half minutes. The reviewed draft was 303 words; the three-part opening, the adoption status, and the CLI-and-Flux overlap account for the growth, and nothing else was added.

**Sections** (the video has no markers; these are the beats a storyboard follows, at 150 words a minute):

1. Three parts · 0:00
2. Inside one service · about 0:17
3. The fork keeps the provider · about 0:41
4. A candidate is tested in a running stack · about 1:15
5. The stack, and what you can then do · about 1:55

Single narrator. Plain engineering language. One metaphor, the site's: machinery. The example partition is `opendes`; the environment placeholder is `<name>`. No real environment or subscription is named. The card title stays "How the machinery is engineered".

**Adoption status, dated.** Rechecked on 11 October 2026 at `osdu-spi-partition` revision `0656cda5`: the fork added its `.spi/service.yaml` on 16 September 2026 (`7f83d2d6`), and its validation workflow has Deploy Gate and Deploy and Test. Run 37499442304 on `main`, on 6 October 2026, pinned the partition service to the candidate digest, verified the pod, passed both declared suites, and restored the partition service to canonical. Section 4 states that status. On 13 September 2026, at revision `3a5690d`, the fork had neither. Recheck immediately before recording.

## Script

### 1. Three parts

Azure SPI connects three things: the stack that runs OSDU, the Azure provider inside each service, and the workflows that keep that provider current. This site explains how those parts fit together, from creating an environment to building and testing a service change.

### 2. Inside one service

Start inside one service. Shared OSDU code handles the request. Where it needs a database, a queue, or a storage account, it calls a provider through the Service Provider Interface, SPI. The provider implements the cloud-specific behavior behind that interface, and the Azure provider ships in the same image as the shared code, with no network hop between them.

### 3. The fork keeps the provider

That provider is Microsoft's to maintain, and the community plans to remove the Azure code from its repositories. So each OSDU service gets a public service fork, one repository per service, that owns its Azure provider, its Azure tests, and its build configuration. Every day a workflow generates a branch from the upstream tip with the whole provider tree absent, Azure included, and the fork's own provider joins it on the integration branch. Upstream's planned removal deletes nothing on the fork side.

### 4. A candidate is tested in a running stack

A change in the fork becomes a candidate image, addressed by digest. A passing build is not evidence that the provider works on Azure. The template includes a workflow for testing a candidate in a running stack: it writes the digest into the environment's image lock, waits until the pod runs that digest, runs the suites the service declares, and writes the captured canonical image back while it still owns the pin; a lost run can leave that work for a person. The partition fork adopted it in September, and a run on its main branch has passed both of the suites it declares.

### 5. The stack, and what you can then do

The stack itself is a development and test environment in one resource group: AKS beside Cosmos DB, Storage, Service Bus, and Key Vault. spi up creates the Azure resources and starts Flux, which continues assembling workloads after the command returns. It is shared and disposable, and it is not production.

Two repositories carry this: osdu-spi-stack builds the environment, and osdu-spi supplies every fork's workflows. After the lessons you can locate a change in a fork, follow it into an image, and say what a test in the running stack proves. The lessons follow one example: a partition lookup for opendes, through the stack, into the provider, and around the fork.

## Word list the narration must keep

- Service Provider Interface, never software provider interface.
- The provider implements the cloud-specific behavior behind the shared interface. Never "only exists to talk to Azure services": the partition provider also uses Redis inside AKS.
- Plans to remove, not stripped out or removed. As of September 2026 the upstream Azure directory is still there.
- The generated branch omits the whole provider tree, Azure included; the Azure provider joins on the integration branch.
- Public service forks. Nothing is proprietary; the forks and both projects are Apache 2.0.
- spi up creates the Azure resources and starts Flux, which continues assembling workloads after the command returns. Never "assembled by Flux after the CLI returns".
- Writes the captured canonical image back while it still owns the pin. Never "restores the environment completely", never "the previous image".
- The template includes the testing workflow; the partition fork adopted it in September, and a run on its main branch passed both declared suites. Never that every run passes or that every fork has adopted it. Dated above; recheck before recording.
- Development and test environment. Never production, never Azure Data Manager for Energy.
- The forks own provider code, tests, and configuration; the template supplies workflows.

## What this script says differently from the current recording

Timestamps are the caption cues of the old recording, `docs/reference/how-microsoft-engineers-azure-osdu.vtt`.

| Caption | The current recording                                                                                                              | This script                                                                                                                                                                                                                                                                          |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0:06    | "The engineering engine that keeps Microsoft's OSDU data platform running."                                                        | No product framing. The opening names the three parts the site connects: the stack, the Azure provider inside each service, and the workflows that keep it current.                                                                                                                  |
| 0:12    | "The community stripped out all cloud-specific code, leaving Microsoft as the sole owner."                                         | The community plans to remove the Azure code, introduced inside the ownership explanation; the generated branch omits the whole provider tree, Azure included, so the removal deletes nothing on the fork side.                                                                      |
| 0:32    | "Microsoft's proprietary Azure logic."                                                                                             | Public service forks; the provider is Microsoft's to maintain, not proprietary. The provider implements the cloud-specific behavior behind the shared interface.                                                                                                                     |
| 0:44    | "Enter the stack, an on-demand, fully-provisioned Azure environment."                                                              | A development and test environment: one resource group, AKS beside the Azure data services. spi up creates the Azure resources and starts Flux, which continues assembling workloads after the command returns. Not production.                                                      |
| 0:48    | "Executes its API-level acceptance tests directly against real Azure data services, and then restores the environment completely." | The template's workflow runs the suites the service declares and writes the captured canonical image back while it still owns the pin; a lost run can leave work for a person. The partition fork adopted it in September, and a run on its main branch passed both declared suites. |
| 0:59    | "Microsoft ensures its OSDU platform never falls behind the community standard."                                                   | Closes on what the learner can then do: locate a change, follow it into an image, and say what a running-stack test proves. The opendes lookup is the example that runs through the lessons.                                                                                         |

## Generation brief

Give the narrator or generator **`docs/narration/start-video.md`** as the only selected source. Never this document: it quotes the current recording's obsolete claims in the table above and carries instructions that are not narration. Do not select the introduction source, the guides, or the site; they are what this script was checked against, and the current video was generated from the introduction source without a script.

Suggested generation prompt, for NotebookLM's video overview or a narrator with a storyboard:

> Narrate the attached script as written, in order, as a single narrator, at a natural pace, about three minutes. The audience is engineers who already know OSDU. Do not add an introduction to OSDU or the energy industry, and do not add facts, product names, durations, or guarantees that are not in the script. Do not add analogies; the script uses one word, machinery, and no others. Do not describe the code as proprietary, the removal as done, the restore as complete, or the environment as production. Draw five scenes matching the five sections: the three parts side by side, the stack, one service with its provider, and the workflows between them; one service image with shared code and an Azure provider inside it; a fork with a generated branch beside a fork-owned directory, the provider joining on the integration branch; a candidate digest borrowing one slot in a running stack and giving it back; the resource group with AKS beside the Azure data services, with Flux still assembling workloads as the command returns. Label only what the narration names. Calm, precise, plain.

### Review the recording before it replaces anything

- The first sentence names the three parts. Nothing precedes it.
- SPI is expanded once as Service Provider Interface, and the image is described as holding both the shared code and the provider with no network hop.
- Removal is spoken as planned, inside the ownership explanation, and the forks as public.
- The generated branch is spoken as omitting the whole provider tree, Azure included.
- The adoption status is spoken as the script states it, after it has been rechecked against the reference fork.
- The restore is spoken with its condition in the same sentence, and the image written back is the captured canonical image.
- spi up is spoken as creating the Azure resources and starting Flux, which continues after the command returns; no scene draws a handoff where Flux starts when the CLI stops.
- The stack is spoken as a development and test environment, and no scene labels it production or names a real environment.
- Any on-screen text matches the narration; a scene that shows a number, a name, or a schedule the script does not say is cut.

### After recording

1. Encode: `ffmpeg -i <input> -c:v libx264 -crf 23 -c:a aac -b:a 96k -movflags +faststart public/video/<slug>.mp4`, keep the current portrait frame unless the storyboard changes it, and export a poster frame to `public/video/<slug>.jpg`.
2. Captions: transcribe with `uvx --from mlx-whisper mlx_whisper public/video/<slug>.mp4 --model mlx-community/whisper-large-v3-turbo --output-format vtt --language en`, keep the VTT beside the video in `public/video/` and a copy in `docs/reference/`. The captions represent the recording; do not edit them to say what the recording should have said.
3. Update `frameVideo` in `src/content/audio.js`: title, file, poster, captions, duration, width, height, and `origin`. Drop the three notes the new recording no longer needs; add one for anything the narrator changed. The card title, "How the machinery is engineered", does not change.
4. The content test checks that the video, poster, and captions exist in `public/`.
