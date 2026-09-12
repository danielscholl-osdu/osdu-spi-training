# Introduction conversation brief

Use **azure-spi-introduction.pdf** as the only selected source. Do not select the three guides or the earlier orientation source. The introduction is written to stay above the mechanisms those documents explain; giving the generator the mechanisms again is what produced a compressed deep dive last time.

## Why the earlier orientation missed

The earlier source, _The First Mental Model_, carried a commit hash, three branch names, a ConfigMap name, a descriptor filename, digests, and three identity relationships, and asked the conversation to carry one fix around the complete loop. The generator did exactly that and produced a 25-minute tour of mechanisms. That is a shorter deep dive, not an introduction. The new source names the things the deep dives explain and says why each exists, and it tells the generator in its own text what the two deep dives will cover so the conversation can point forward instead of going there.

## Suggested generation prompt

> This is the introductory episode for engineers who already know OSDU and work on or around Microsoft's managed offering, Azure Data Manager for Energy. Two deep-dive episodes follow it: one on the SPI Stack and one on the engineering system. This episode sets the frame those episodes assume. Use only the attached source.
>
> Establish, in the first three minutes, why Azure SPI exists: OSDU's ADR 61 splits the codebase into the Venus community line and the Mercury provider line and removes cloud-provider code from the community repositories, leaving the community implementation, CIMPL, which runs on cimpl-stack. So the Azure implementation becomes code Microsoft owns and must keep alive and prove on its own. Give the two-worlds picture: shared code is changed upstream and proved on CIMPL, then synchronizes into the Azure service forks, where the Azure provider hooks the same interfaces to Azure's managed services and is proved on the SPI Stack. Then give the shape of what was built: three things called SPI, the service fork as the unit of work with two owners in one tree, the image as the artifact, the Stack as the proving ground, and the one place the two projects meet. Spend the middle of the conversation on the six recurring ideas, each with the tempting alternative and why it fails, and on what changes in an engineer's day compared with the community model. Close by saying what each deep dive covers, so a listener knows where the detail lives.
>
> Use Venus and CIMPL to frame the situation, not as a subject. Do not describe CIMPL's architecture or cimpl-stack's internals beyond what the source says: in-cluster middleware, any Kubernetes, no cloud-provider technology, development and test. Stay at the level of the source. Do not explain branch mechanics, Git operations, workflow schedules, infrastructure ordering, identity configuration, configuration files, or historical incidents; name them as things the deep dives explain. Where the source gives a mechanism one sentence, give it one sentence. Do not add facts, commands, durations, counts, or guarantees from general knowledge. Do not describe the Stack as production or as ADME. Do not describe any check as proving more than the source says it proves.
>
> Keep it conversational and causal: one speaker can ask why the obvious simpler approach fails, and the other answers from the source. Avoid analogies that need their own explanation, generic admiration, and closing speculation. The tone is calm, precise, and curious. Aim for twelve to fifteen minutes.

## Review the generated conversation before using it

- By the two-minute mark the listener should have heard why the Azure implementation is now Microsoft's and what the two obligations are: keep it alive, prove it works.
- The three meanings of SPI should be distinguished once, early, with the caution that the interface is not a network hop and the meanings do not map onto three repositories.
- The conversation should not reach branch names, ConfigMaps, digests, descriptors, or commit hashes. If it does, that section belongs to a deep dive and should be cut or the prompt tightened.
- The Stack must remain a development and test environment: shared identity, no backup or disaster recovery, disposable. Nothing should suggest it is ADME or production.
- Restoration should be stated with its condition: the environment is put back while the run still owns the slot, and a lost run can leave work.
- Venus, Mercury, ADR 61, CIMPL, and cimpl-stack should be described as the source describes them, as framing. If the conversation spends more than a minute on CIMPL's architecture, or describes the community's own fork prototype as adopted, that section should be cut or the prompt tightened. The Microsoft project documentation does not name Venus; it describes only the consequence.
- The closing should point at the two deep dives and the site's views, not at speculation about the future of automation.

For site integration, the opening cue should run from the start through the three meanings and end at a natural boundary. Later cues should each cover one of the six ideas or one before-and-after pair. Keep the full conversation as optional listening.

Preserve the earlier recordings, sources, and briefs. Review the new recording against this source before changing the site's default episode.
