# Review of Revision 6 and the Try It track

Reviewed 13 September 2026: [Fieldnotes Layout Proposal, Revision 6](https://claude.ai/code/artifact/3a637ecc-f00a-450f-826f-f5b7e4401945), all nine sections, against training commit `9bdccfa`. The artifact was read in the browser, including the proposed hands-on table, implementation sequence, and decisions. Technical checks used the same revisions named in the training README: `osdu-spi-stack` at `dc2c956`, `osdu-spi` at `080f0b8`, and `osdu-spi-partition` at `3a5690d`.

**Try It is a useful addition. I would approve the direction and revise the operational promises before implementing the bands.** The site now teaches a mental model; an optional practical path can help engineers recognize that model in their tools and repositories. The plan protects the existing experience well: no compulsory exercise, no scoring, no live execution by the site, and no requirement to have Azure access merely to learn.

The main weakness is the assumption that a short command sequence will reliably produce the illustrated outcome. Several outcomes depend on prerequisites, workflow versions, upstream changes, or permissions that the table does not yet include. Those gaps matter more in a runnable guide than in an architecture explanation.

## What works in the revised plan

- **Practice stays optional and follows the lesson exit.** A learner can understand the lesson and move on, or choose to apply it. Keep that separation.
- **The action includes something to observe.** “Run this” becomes useful when the learner knows which resource, artifact, or condition should appear. This is the right foundation for each step.
- **Personal accounts lower an unnecessary barrier.** GitHub supports registering and installing an App under a personal account. The repository-permission approach is plausible; an organization need not be the default written path. That platform capability still needs a complete workflow walkthrough. [GitHub App registration](https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/registering-a-github-app), [installing your own App](https://docs.github.com/en/apps/using-github-apps/installing-your-own-github-app).
- **The existing seven fixes remain first.** Adding another disclosure before resolving drawer visibility and focus would make the interface harder to assess.
- **The boundary between onboarding and Flux is correct.** Onboarding establishes the fork's ability to use the stack; it does not redirect Flux to the learner's service repository.
- **The plan excludes capabilities documented ahead of the code.** Keep this rule, and apply the same scrutiny to workflow adoption and test-suite configuration.
- **A real personal-account walkthrough is explicitly planned.** This is essential evidence for a practical guide. Extend its coverage to the complete advertised outcome, including cleanup.

## Corrections needed before the recipes ship

### 1. The Azure preview is not a no-subscription activity

Lesson 02 says to run `spi up --env <name> --dry-run`, “then, if you have a subscription,” do the real run. The conditional is in the wrong place. Dry run also needs Azure access. It creates or updates the resource group and its naming tag, then previews the templates. Without an AKS OIDC issuer, its preview also omits dependent federated credentials.

Make two explicit options: inspect documented example output without an Azure account, or run an Azure what-if with the required access. For the latter, describe the resource-group mutation and its cleanup. “Does not provision the full stack” is a different claim from “changes nothing.” The CLI's help text and implementation both expose this distinction. [Deployment preview](https://github.com/Azure/osdu-spi-stack/blob/dc2c956/docs/design/deployment-lifecycle.md), [infrastructure orchestration](https://github.com/Azure/osdu-spi-stack/blob/dc2c956/src/spi/azure_infra.py).

### 2. Lesson 03 cannot promise that the running image came from the learner's fork

The proposed observation says: “The image the cluster runs is the one the fork built.” A newly created stack normally uses community images. Looking at a deployment's image reference identifies what is running; it does not establish a relationship to a fork the learner has not yet created or deployed.

Change the outcome to “Identify the partition image currently deployed and distinguish it from an image built by a fork.” Reserve the candidate-digest comparison for Lesson 06, where a workflow actually pins a candidate. A successful test normally restores the previous canonical image afterward. [Current image resolution](https://github.com/Azure/osdu-spi-stack/blob/dc2c956/src/spi/images.py), [deployment loop](https://github.com/Azure/osdu-spi-stack/blob/dc2c956/docs/design/fork-deployment.md).

### 3. Onboarding is only part of Lesson 06's prerequisites

The table moves from `spi onboard` to a validation run that pins, verifies, tests, and resets. The current template requires more:

- A workflow revision containing the intended deploy-test lane.
- A valid `.spi/service.yaml` with a real suite and the correct inputs.
- A consistent service identifier, package name, and `SERVICE_NAME` where needed.
- An eligible same-repository PR or push that actually builds and publishes an image.
- A usable core environment and the five onboarding values.

A descriptor-only or Markdown-only PR does not trigger the necessary build. The reference partition fork at `3a5690d` has no `.spi/service.yaml` and does not yet contain the template's newer deploy-test lane. Consequently, the mirror alternative cannot silently be treated as equivalent to a fresh template-created repository for this exercise. The source also allows a skipped deployment to leave Validation Summary green. [Fork lifecycle](https://github.com/Azure/osdu-spi/blob/080f0b8/doc/src/runbooks/fork-lifecycle.md), [Deploy Gate](https://github.com/Azure/osdu-spi/blob/080f0b8/.github/template-workflows/validate.yml), [reference fork workflow](https://github.com/Azure/osdu-spi-partition/blob/3a5690d/.github/workflows/validate.yml).

Provide a tested partition-specific descriptor and identify the workflow revision that uses it. Define the observed result as the gate entering the deploy-test lane, the expected digest reaching a ready pod, at least one non-skipped test with no failures, and the restoration result. A green overall check alone is insufficient. Keep this band planned until someone has demonstrated that exact route. [Suite and verdict contract](https://github.com/Azure/osdu-spi-stack/blob/dc2c956/docs/design/fork-deployment.md).

### 4. Sync Upstream may correctly create no PR

Immediately after initialization, the fork may already match upstream. The sync workflow explicitly exits cleanly when no upstream change requires a PR. Changes confined to filtered paths can also produce no new tree. The table currently promises a sync PR, tracking issue, and cascade unconditionally. A learner could interpret correct behavior as a failed exercise.

Show both outcomes: “Already current: no PR is needed,” or “New shared changes: inspect the sync PR and tracking issue.” Do not ask learners to manipulate tracking state just to force the illustrated result. If seeing a cascade is essential, provide a separately explained, controlled training input or recorded example. The learner's own provider change is a more deterministic build activity. [Synchronization behavior](https://github.com/Azure/osdu-spi/blob/080f0b8/doc/src/workflows/synchronization.md).

### 5. Personal-account support does not establish a solo merge path

The default main-branch rules require an approving review, approval of the latest push, and applicable code-owner approval; the declared bypass list is empty. GitHub prevents authors from approving their own PRs. A learner may approve an App-authored sync or cascade PR, but that does not settle what happens when the learner authors and pushes the provider change themselves. [Default ruleset](https://github.com/Azure/osdu-spi/blob/080f0b8/.github/rulesets/default-branch.json), [GitHub review behavior](https://docs.github.com/en/enterprise-cloud%40latest/pull-requests/how-tos/review-pull-requests/reviewing-proposed-changes-in-a-pull-request?tool=webui).

The walkthrough should explicitly test this distinction. Either name a second reviewer as a prerequisite for merging the learner's own change, or make observing its PR validation a complete stopping point. Do not assume that repository ownership bypasses the shipped rules, and do not quietly remove the review requirement to make the example work.

### 6. A published image is not necessarily pullable by AKS

Add package visibility to the gotchas and the walkthrough. The current build helper checks visibility and reports a private package; it does not change visibility and does not fail the build. Some README/action descriptions still say that it flips visibility, which is an example of why quoting documentation alone is insufficient. A successful image push can therefore be followed by `ErrImagePull` in the cluster. [Actual visibility helper](https://github.com/Azure/osdu-spi/blob/080f0b8/.github/actions/docker-build/set-package-visibility.sh).

Have the learner inspect the service package's visibility before the Azure exercise, with the appropriate personal-account settings link. State the intended public-repository/public-package conditions up front rather than treating them as incidental troubleshooting.

### 7. Qualify “free” and separate effort from waiting

“Free on GitHub” is reasonable for the tested public-repository path using standard GitHub-hosted runners. It should not be a promise about every account, repository visibility, or runner choice. Private repositories have included quotas and possible charges; ruleset availability also depends on the plan and repository visibility. [Actions billing](https://docs.github.com/en/actions/concepts/billing-and-usage), [ruleset availability](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets).

Use activity-specific labels: browser only; workstation setup; public GitHub repository; Azure resources billed separately. Lesson 03's browser path is free to inspect, but its optional live-stack path continues to incur Azure charges.

The 45–50 minutes are provisioning observations from earlier runs, not a complete session estimate or an API-readiness promise. The 45-minute deletion value is a timeout, not guaranteed successful cleanup by that time. “10 minutes” for Lesson 01 should say whether installation of `uv` and the five prerequisite tools is already complete. Label active effort, automated waiting, and cleanup separately, and replace provisional figures with walkthrough observations. [Timing and deletion semantics](https://github.com/Azure/osdu-spi-stack/blob/dc2c956/docs/design/deployment-lifecycle.md).

## The learning design needs two small changes

**Make every band self-contained given its prerequisites, rather than claiming every band can run in any order.** Lessons 05 and 06 already list dependencies on earlier setup. The proposed rule is internally contradictory and will encourage either missing setup or repeated setup instructions. A better rule is: “Each activity states its prerequisites and can be started once they are met. Link to shared setup rather than repeating it.”

Keep the conceptual lesson order. Offer a quiet practical entry point for readers with no Azure subscription: browser inspection, workstation preparation, then the public GitHub route. That gives the hands-on path flexibility without making the teaching sequence harder to follow. A small index or context link is enough; another major navigation mode is unnecessary.

**Make each activity apply the lesson's actual idea.** Lesson 01's proposed CLI installation is useful preparation, but it does not demonstrate that AKS is only one part of the stack. Label it as preparation for Lesson 02. Lesson 03's POM inspection overlaps its evidence drawer; it becomes more purposeful when the learner follows the actual `getPartition` call into `safeGet` and the table fallback. An optional existing regression-test run can provide a further step once its build prerequisites are documented.

For the later lessons, replace “change one line” with a named, reproducible change and an expected build or test result. Specify which branch, which PR target, and whether the change is intended to merge. Preserve the real cache-fallback story, but do not tell learners to apply a fix that the current provider already contains.

| Lesson | Recommended practical result                                                                                                                                                   |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 01     | Prepare the workstation and distinguish tool readiness from Azure access.                                                                                                      |
| 02     | Create an owned development environment, identify readiness signals, and make one authenticated partition request. Provide documented output for readers without Azure access. |
| 03     | Follow the same lookup through the real source; identify the deployed image only when a stack is available.                                                                    |
| 04     | Create the chosen kind of personal repository and inspect its actual ownership/branch structure.                                                                               |
| 05     | Interpret a sync result, including no change; make one controlled provider change and observe its validation.                                                                  |
| 06     | Use a tested descriptor/workflow combination to observe candidate deployment, meaningful test results, and restoration.                                                        |
| 07     | Keep the existing reference/check material; a new band is unnecessary.                                                                                                         |

## Give the band a clear result and a clear exit

The collapsed summary should say what the reader will do. “Try it · free · 30 min” is compact but generic. “Try it: trace the partition lookup · browser only” is more useful. Once expanded, show the required access and the resource effects before the first command.

Each recipe needs: the intended result; prerequisites and tested versions; cost conditions and time assumptions; an action with its expected observation; a common alternate result and next step; and a stopping/cleanup path. Mark sample output as illustrative and focus it on stable fields rather than volatile pod names or IDs.

For billable work, distinguish “keep this environment for Lesson 06” from “stop and remove it now.” Otherwise a learner who follows Lesson 02's cleanup immediately must provision again for Lesson 06. Keeping it has a continuing cost. Failed provisioning can leave resources too; cleanup must not depend on the happy path having completed.

Cleanup should identify what remains. Ordinary `spi down` retains identity and naming; purge is a separate destructive choice. A reusable stack may need the learner's repository trust removed when the exercise ends. `spi onboard --remove` also has a planning/write distinction, and removing trust does not remove the repository's own values. For a disposable GitHub setup, describe how to stop its schedules and remove the dedicated App installation when it is no longer needed. These are concrete consequences of the proposed activities, not a general safety checklist. [Removal behavior](https://github.com/Azure/osdu-spi/blob/080f0b8/doc/src/runbooks/fork-lifecycle.md).

Do not add Azure tokens, private keys, connection testing, or account state to the page. The existing “site describes; workstation runs” boundary is sufficient. Copyable commands should clearly identify placeholders and the supported shell; a learner should not mistake angle-bracket placeholders for a ready-to-run command.

## Tighten the plan before using it as an implementation brief

Revision 6 contains old decisions beside their replacements. I would make these edits before delegating another lesson:

- Section 1's exit rule still omits Try It, although the grammar rule includes it. Its “everything else is evidence” rule and Section 3's four-layer table also need a place for optional practice.
- The “fixed” drawer template still uses the old label/first-sentence mapping that the accepted evidence issue is meant to replace. Describe the desired ownership/context fields separately from the shipped template.
- The shipped-history list says Lessons 02–07 retain their old shape; 02 and 03 have since changed. Mark that paragraph as historical or update it.
- Section 7 says the rollout waits on the pilot, Q2 says 04–06 wait for both, and Q15 says they no longer wait. Keep the latest policy in one active location. The historical decisions can point to it.
- Section 8 describes draft PRs and a pre-merge review, then says work goes directly to main and there are no PRs. Use one current workflow consistent with the repository instructions.
- Several rollout claims still repeat wording already accepted for correction, including the first-of-five readiness statement. Distinguish shipped wording from the desired wording so an implementer does not copy the defect back.

These are document-consistency fixes. The plan need not become longer. Move implementation history and tool comparisons into a dated changelog; retain current behavior, decisions, prerequisites, and acceptance evidence in the working brief.

The prose can become more direct too: replace “adds the missing verb” with “adds optional practical activities”; replace “the shape of the track follows the money” with “GitHub activities can be tried without Azure resources”; and replace “free and takes minutes to see” with the actual public-repository conditions and observed setup time. The name **Try It** is already clear and needs little promotional framing.

## Release evidence and recorded follow-up

Proceed with the common renderer after the existing interaction fixes. Write Lessons 01–03 from corrected recipes, keeping browser-only and Azure-backed variants explicit. The personal-account walkthrough should cover setup, unchanged sync, changed sync when available, an author-created PR, package visibility, and cleanup. The Lesson 06 walkthrough additionally needs the exact descriptor, workflow revision, candidate digest, non-skipped suite results, and restore result. This is distinct from the learner-comprehension pilot; keeping that pilot alongside rollout does not remove the need to verify executable instructions before publishing them.

A named documentation revision is useful but does not make a recipe reproducible if installation resolves the latest CLI and provisioning follows a changing branch. Record the tested CLI release, stack source ref, template/fork commit, operating system/shell, and test date. The CLI supports matching a released version with a stack `--tag`; choose the tested pair when authoring the recipe. Separate supported version ranges from a claim that every future release has been tested. [CLI version checks](https://github.com/Azure/osdu-spi-stack/blob/dc2c956/src/spi/cli.py).

Content tests should check the recipe's structure and source references. Browser checks should cover disclosure, focus, copy controls if added, and the page after expansion at phone and laptop sizes. Neither proves that the instructions work in GitHub or Azure. The real walkthrough supplies that evidence.

This review is tracked as `fn-wqb`. Feedback is attached to the existing Try It epic (`fn-nkh`), renderer task (`fn-u9u`), Lessons 01–03 content task (`fn-z1m`), personal-account walkthrough (`fn-dt3`), and lesson rollout epic (`fn-8kx`). Their existing scope and acceptance criteria are preserved; the comments record the review recommendations.

No learner repository, App, Azure resource, permission, or workflow run was created or changed during this review. No SPI command was executed. The plan artifact, site implementation, and AGENTS.md are unchanged. The factual corrections above come from source inspection and official GitHub documentation; the complete personal-account and Azure journey still needs the planned hands-on verification.

The review file passes its formatting check. The repository-wide formatter traversed nested working copies and failed on existing reference HTML; its formatting-only changes to the surviving reference files were verified and restored. The exclusion defect is recorded separately as `fn-abo`. No application code changed, so application tests were not rerun for this document-only review.
