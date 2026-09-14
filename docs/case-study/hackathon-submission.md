# Hackathon submission draft

Field contents for the Microsoft Hackathon 2026 idea form, written as a proposal: what the project sets out to do, why, and how it will be judged. Character limits are the form's. The measured results live in the [case study](README.md) and are for the final showcase, not the idea form.

## Title (140 characters)

Azure SPI Fieldnotes: an onboarding site built by a multi-vendor software factory

## Tagline (300 characters)

Build an interactive course that teaches engineers the Azure SPI machinery, and build it with a factory of Claude, OpenAI, and Copilot agents under one engineer's direction, so we learn how far human-in-the-loop AI engineering can be pushed on real, complex work.

## Keywords

software factory, agentic engineering, human in the loop, Claude Code, Keelson, beads, Codex, GitHub Copilot, NotebookLM, OSDU, Azure SPI, onboarding, training

## Visibility

Internal and external participants. The source repositories the course explains are public.

## Images

Leave the form without images at the idea stage. The poster and diagram in this folder show measured results and belong with the final showcase.

## Description

### The problem

Engineers who know OSDU well still take weeks to become productive on the Azure SPI Stack and the engineering system behind the service forks. The documentation is complete but it is also large: architecture guides, deployment guides, identity guides, decision records, and a fork workflow that touches three repositories at once. Reading alone does not build the mental model. People need to see the stack, trace one request through it, watch a change travel from a fork to a running image, and then read the documentation with that picture in their heads.

### Two deliverables

**A training site.** An interactive, static site that walks an engineer down the Azure stack, into one service's provider code, out to the service fork that owns that code, and back in through the image lock that deploys it. Each lesson is a small set of claims over an inspectable architecture map: select a claim and the map focuses on the components that prove it; open the evidence drawer to see what it is, why it matters here, how to verify it, and where it is substantiated in the source repositories. Around the lessons: generated audio deep dives with chapter markers and source-check notes where the narration and the documentation differ, a short video, hand-drawn field guides, and posters. No quizzes, no scores, no required exercises. An optional hands-on band per lesson tells the learner what to run on their own account to see the idea for real.

**A case study of how it gets built.** The site is a real product with a real quality bar, which makes it a fair test of a question we want answered: can one engineer, acting as a manager rather than a coder, get something this size built and reviewed by a factory of AI agents drawn from more than one vendor, with a durable shared record that survives every session boundary? The case study will document how the work moved, what each agent and tool was worth, what it cost, what worked, and what did not.

### The factory we intend to run

- **One orchestrator.** A Claude Code session that plans, writes briefs, delegates, verifies every change in a real browser, merges, and keeps the record. It should write as little code as possible itself.
- **Workers.** Claude subagents for parallel and bounded work such as posters, fact-checks, and adversarial reviews. Keelson, a local agent workbench, running its beads-work workflow for multi-file changes: it plans, pauses for the owner's approval, implements in an isolated worktree with OpenAI models under the GitHub Copilot provider, runs its own review lanes, and opens a draft pull request.
- **Reviewers from other vendors.** OpenAI Codex for usability, accuracy, and editorial reviews of the deployed site. GPT Astra in ChatGPT for design direction. GitHub Copilot's pull request reviewer on every workflow-built PR. The builders and the reviewers should not share a model family.
- **Generated media.** Gemini NotebookLM for the audio deep dives and video from written sources; the Gemini image model for artwork in a consistent style.
- **Shared state.** A beads issue tracker as the plan of record that every agent and every workflow run reads and writes, and a single design-intent document, kept as a Claude artifact, that reviewers can target by revision.
- **A written standard, enforced by a test.** Every explanation must name an artifact, command, resource, number, or failure mode that can be checked against the source repositories, and a content test must cross-check every route, marker, and component before a build can deploy.

The engineer's job is direction, taste, approval of plans with corrections, scope cuts, carrying reviews between vendors, and fixing the environment when it breaks. The plan is to measure that job, not assume it.

### What we will measure

- Human messages against agent turns and tool calls, per day, so the ratio of direction to execution is visible.
- Workflow runs: how many, how long, how many merged, what the internal review loop caught, and what the approval gate changed.
- The tracker: issues written before code, time from creation to close, and whether close reasons carry evidence.
- Pull requests and deployments: time to merge, reviewer findings, failed checks.
- Rework: anything built and then removed, and why.
- Cost, as far as each vendor makes it visible.

### What success looks like

A published site that a senior OSDU engineer can use to build a correct mental model of the Azure SPI machinery in an afternoon, held to a standard a test enforces. And a case study that a team considering the same approach can read to decide what to copy, what to avoid, and what the person in the loop actually has to do.
