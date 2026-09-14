# Hackathon submission draft

Field contents for the Microsoft Hackathon 2026 idea form. Character limits are the form's.

## Title (140 characters)

OSDU Azure SPI Fieldnotes: a training site built by a software factory

## Tagline (300 characters)

An interactive course on the Azure SPI Stack and its fork engineering system, built in four days by one engineer managing a factory of Claude, OpenAI, and Copilot agents, with the case study of what that took.

## Keywords

software factory, agentic engineering, Claude Code, Keelson, beads, Codex, GitHub Copilot, NotebookLM, OSDU, Azure SPI, onboarding, training, human in the loop

## Visibility

Internal and external participants. The site and the repository are public.

## Images to attach after saving the idea

- `software-factory.png`, the one-page poster.
- `factory-diagram.png`, the drawn diagram of the factory and the flow of one piece of work.

## Description

Two deliverables, one repository.

**The training site.** [OSDU Azure SPI Fieldnotes](https://danielscholl-osdu.github.io/osdu-spi-training/) teaches senior engineers who know OSDU how the Azure SPI machinery works: the stack that runs it, the provider code inside each service, and the engineering system that keeps the service forks current with upstream. Seven lessons walk down the stack, into one service, out to its fork, and back in through the image lock. Each lesson is a set of claims over an inspectable architecture map, with an evidence drawer, one easy mistake, an optional hands-on activity on the learner's own account, and a shelf of deeper material. Around the lessons sit two generated audio deep dives with chapter markers and source-check notes, a one-minute video, eight field guides, and six posters. Every explanation is held to a written standard and cross-checked by a content test against the source repositories before it can deploy. Reading documentation alone is hard; the site exists so an engineer can build a mental model first and then read with it.

**The case study.** The site was built between Thursday evening and Sunday morning by one engineer who wrote almost no code. A Claude Code session acted as the orchestrator. It spawned subagents for parallel and adversarial work, handed multi-file changes to Keelson, a local workbench whose beads-work workflow plans, pauses for approval, implements in an isolated worktree with OpenAI models under the Copilot provider, runs its own review lanes, and opens a draft pull request that GitHub Copilot reviews. OpenAI Codex reviewed the deployed site fifteen times for usability, accuracy, and editorial voice. GPT-6 Astra shaped the design in eight conversations. Gemini NotebookLM produced the recordings and video. A beads issue tracker and a Claude artifact page held the plan of record and the design intent across every session, agent, and workflow run. The engineer set direction, judged taste, approved plans with corrections, cut scope, carried reviews between vendors, and fixed the environment when it broke.

The record is complete enough to measure. About 150 human messages produced 2,652 orchestrator turns and 3,087 tool calls. Nineteen Keelson runs yielded thirteen merged pull requests, each 16 to 53 minutes. Eighty-one tracked issues closed with a median of 43 minutes from creation to close, 41 of 49 written before the commit that closed them. One hundred and ninety-six commits and 24 pull requests deployed 83 times with no failed check.

What worked: a written standard every agent read, enforced by a test; reviewers from a different vendor than the builders; an approval gate where every plan was corrected before code; isolated parallel runs against a shared tracker; the orchestrator verifying every change in a real browser; adversarial arguments before every scope cut; process rules written into memory the day they were learned.

What did not: media regenerated four times and then cut; interaction features built for the owner and removed the same day; a workflow review loop that returned clean twelve times out of thirteen and was wrong the thirteenth; pull requests merged before their reviewer bot posted; a tracker whose closures silently reverted under parallel worktrees; an environment that needed hands several times a day; reviewer attribution lost in the record; a rulebook that grew to 4,500 words; spend visible only per vendor.

The case study in the repository, `docs/case-study/`, has the diagrams, the timeline, the numbers with their sources, what each tool was worth, and what we would do differently. The reviews and iteration records are kept verbatim under `docs/process/`.
