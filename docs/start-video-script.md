# The Start video: script for approval

**Status: draft for approval.** This script replaces the start page's video, _How Microsoft engineers Azure OSDU_, shown on the Watch card as "How the machinery is engineered", when it is approved and a new recording is produced from it. Until a recording is replaced, the current video, its captions in `public/video/`, and its notes in `src/content/audio.js` stay exactly as they are. Nothing on the site changes because this file exists.

The current video calls the Azure logic proprietary, says the community stripped out all cloud-specific code, and says the environment is restored completely. The site corrects all three in the player's notes. This script states the corrected version so the most prominent introduction needs no corrections. It opens on the engineering question, not on why OSDU exists, and it is written for engineers who already know OSDU.

**Length:** 303 words in the script body, about two minutes spoken. Target: 280 to 320 words.

**Sections** (the video has no markers; these are the beats a storyboard follows):

1. The question · 0:00
2. Inside one service · about 0:15
3. The fork keeps the provider · about 0:40
4. A candidate is proved in a running stack · about 1:10
5. The stack, and the two repositories · about 1:40

Single narrator. Plain engineering language. One metaphor, the site's: machinery. The example partition is `opendes`; the environment placeholder is `<name>`. No real environment or subscription is named. The card title stays "How the machinery is engineered".

## Script

How do you keep an Azure implementation of OSDU current when the shared code changes every day, and the community plans to remove the Azure code from its repositories?

Start inside one service. Shared OSDU code handles the request. Where it needs a database, a queue, or a storage account, it calls a provider through the Service Provider Interface, SPI. The Azure provider ships in the same image as the shared code. There is no network hop between them.

That provider is now Microsoft's to maintain. Each OSDU service gets a public service fork, one repository per service, that owns its Azure provider, its Azure tests, and its build configuration. Every day a workflow generates a branch from the upstream tip with the other providers absent, so upstream's planned removal deletes nothing on the fork side. Shared code arrives daily. The provider stays put.

A change in the fork becomes a candidate image, addressed by digest. A build passing is not evidence that the provider works on Azure. For that, a workflow borrows the service's slot in a running Azure stack: it writes the digest into the image lock, waits until the pod is running that digest, runs the test suites the service declares, and writes the previous image back while it still owns the pin. A lost run can leave that work for a person.

The stack itself is a development and test environment in one resource group: AKS beside Cosmos DB, Storage, Service Bus, and Key Vault, created by one command, spi up, and assembled by Flux after the CLI returns. It is shared and disposable. It is not production.

Two repositories carry this. osdu-spi-stack builds the environment. osdu-spi supplies every fork's workflows. The lessons follow one partition lookup, for opendes, through the stack, into the provider, and around the fork.

## Word list the narration must keep

- Service Provider Interface, never software provider interface.
- Plans to remove, not stripped out or removed. As of September 2026 the upstream Azure directory is still there.
- Public service forks. Nothing is proprietary; the forks and both projects are Apache 2.0.
- Writes the previous image back while it still owns the pin. Never "restores the environment completely".
- Development and test environment. Never production, never Azure Data Manager for Energy.
- The forks own provider code, tests, and configuration; the template supplies workflows.

## What this script says differently from the current recording

Timestamps are the caption cues in `public/video/how-microsoft-engineers-azure-osdu.vtt`.

| Caption | The current recording                                                                                                              | This script                                                                                                                                                                |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0:06    | "The engineering engine that keeps Microsoft's OSDU data platform running."                                                        | No product framing. The question is how the Azure implementation stays current.                                                                                            |
| 0:12    | "The community stripped out all cloud-specific code, leaving Microsoft as the sole owner."                                         | The community plans to remove the Azure code; the fork is built so that removal deletes nothing on its side.                                                               |
| 0:32    | "Microsoft's proprietary Azure logic."                                                                                             | Public service forks; the provider is Microsoft's to maintain, not proprietary.                                                                                            |
| 0:44    | "Enter the stack, an on-demand, fully-provisioned Azure environment."                                                              | A development and test environment: one resource group, AKS beside the Azure data services, created by spi up and assembled by Flux after the CLI returns. Not production. |
| 0:48    | "Executes its API-level acceptance tests directly against real Azure data services, and then restores the environment completely." | Runs the suites the service declares and writes the previous image back while it still owns the pin; a lost run can leave work for a person.                               |
| 0:59    | "Microsoft ensures its OSDU platform never falls behind the community standard."                                                   | Closes on what the lessons follow: one partition lookup for opendes through the stack, the provider, and the fork.                                                         |

## Generation brief

Use **this script** as the only selected source. Do not select the introduction source, the guides, or the site; they are what this script was checked against, and the current video was generated from the introduction source without a script.

Suggested generation prompt, for NotebookLM's video overview or a narrator with a storyboard:

> Narrate the attached script as written, in order, as a single narrator, in about two minutes. The audience is engineers who already know OSDU. Do not add an introduction to OSDU or the energy industry, and do not add facts, product names, durations, or guarantees that are not in the script. Do not add analogies; the script uses one word, machinery, and no others. Do not describe the code as proprietary, the removal as done, the restore as complete, or the environment as production. Draw five scenes matching the five sections: one service image with shared code and an Azure provider inside it; a fork with a generated branch beside a fork-owned directory; a candidate digest borrowing one slot in a running stack and giving it back; the resource group with AKS beside the Azure data services; the two repositories. Label only what the narration names. Calm, precise, plain.

### Review the recording before it replaces anything

- The first sentence is the engineering question. Nothing precedes it.
- SPI is expanded once as Service Provider Interface, and the image is described as holding both the shared code and the provider with no network hop.
- Removal is spoken as planned, and the forks as public.
- The restore is spoken with its condition in the same sentence.
- The stack is spoken as a development and test environment, and no scene labels it production or names a real environment.
- Any on-screen text matches the narration; a scene that shows a number, a name, or a schedule the script does not say is cut.

### After recording

1. Encode: `ffmpeg -i <input> -c:v libx264 -crf 23 -c:a aac -b:a 96k -movflags +faststart public/video/<slug>.mp4`, keep the current portrait frame unless the storyboard changes it, and export a poster frame to `public/video/<slug>.jpg`.
2. Captions: transcribe with `uvx --from mlx-whisper mlx_whisper public/video/<slug>.mp4 --model mlx-community/whisper-large-v3-turbo --output-format vtt --language en`, keep the VTT beside the video in `public/video/` and a copy in `docs/reference/`. The captions represent the recording; do not edit them to say what the recording should have said.
3. Update `frameVideo` in `src/content/audio.js`: title, file, poster, captions, duration, width, height, and `origin`. Drop the three notes the new recording no longer needs; add one for anything the narrator changed. The card title, "How the machinery is engineered", does not change.
4. The content test checks that the video, poster, and captions exist in `public/`.
