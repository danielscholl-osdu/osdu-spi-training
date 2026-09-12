# The two-minute brief: approved script

The recording that plays as the start page's cue, _Rebuilding OSDU for real Azure infrastructure_, was generated from the introduction source without a script. It expands SPI as "software provider interfaces", closes on a promotional sentence, and leans on a car-chassis analogy. The marker notes correct the expansion, but a listener hears the wrong definition first. The next brief should be produced from this script, either read by a narrator or given to NotebookLM as the only source with the instruction to read it as written.

Nothing in the script goes beyond what the site's views and the source documentation say. Every claim below has a view that shows it and a document that supports it.

## Script (about 120 seconds at a spoken pace)

OSDU services separate shared application code from cloud-specific implementations. The Service Provider Interface, or SPI, connects the two inside each service. There is no network hop between them: the interface and its implementation ship in one image.

The community plans to remove its Azure implementations from the shared repositories. Microsoft maintains the Azure provider in service forks, one repository per service, and brings upstream changes into the shared code through scheduled workflows. Every day the fork regenerates a branch from the upstream tip with the Azure paths left out by construction, so upstream's removal deletes nothing on the fork's side.

Two projects support that work. osdu-spi supplies the fork workflows: the sync, the cascade, the build, and the validation that pushes a candidate image for every eligible commit. osdu-spi-stack creates a development and test environment on Azure, a resource group with a Kubernetes cluster and the Azure data services beside it, from one command.

A successful build is not evidence that the provider works on Azure. To prove a candidate, a workflow borrows one service's slot in a running stack: it records its run and the candidate digest in the image lock, waits for the pod to run that digest, runs the test suites the service declares, and puts the canonical image back while it still owns the pin. A lost runner can leave that pin for a person to clear.

This site follows a partition lookup for a partition called opendes. You will see where it runs, how the provider reads stored configuration from Table Storage when its cache fails, and where a change to that provider belongs. The later views follow an acceptance run that is illustrative: the reference partition fork has not adopted the newer workflow yet.

Use the stack to test Azure behavior, and the fork to maintain the provider code.

## Word list the narration must keep

- Service Provider Interface, never software provider interface.
- Plans to remove, not removed or stripped out. As of September 2026 the upstream Azure directory is still there.
- Public repositories. Nothing here is proprietary; the forks and both projects are Apache 2.0.
- Restore is conditional on still owning the pin.
- Development and test environment. Never production, never Azure Data Manager for Energy.

## After recording

1. Encode: `ffmpeg -i <input> -ac 1 -c:a aac -b:a 56k public/audio/<slug>.m4a`.
2. Transcribe: `uvx --from mlx-whisper mlx_whisper public/audio/<slug>.m4a --model mlx-community/whisper-large-v3-turbo --output-format vtt --language en`, keep the VTT in `docs/reference/`, and regenerate `src/content/transcripts/brief.js` from it. The transcript must represent the recording; do not edit it to say what the recording should have said.
3. Update the `brief` episode in `src/content/audio.js`: file, duration, markers with real times, and drop the source-check notes the new recording no longer needs.
4. The start-page cue in `src/content/chapters.js` ends at the recording's duration; the content test asserts that value.

The same approach applies to the orientation if it is re-recorded: write the script from `docs/azure-spi-introduction-source.md` first, keep the analogies out, and let the marker notes go quiet.
