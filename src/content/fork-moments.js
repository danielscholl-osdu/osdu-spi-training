// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// A day in a service fork, as moments on the branch map. Times are the
// scheduled triggers in the template workflows; nothing here is measured.
// The running example is the partition cache fallback (commit fc2dfbf in
// osdu-spi-partition); the digests and PR numbers around it are illustrative.
export const forkMoments = [
  {
    id: 'sync',
    name: 'Generate',
    owner: 'Sync Upstream · 00:00 UTC',
    title: 'fork_upstream is regenerated, not merged.',
    copy: 'The filter reads the upstream tip, keeps the shared modules, drops the other providers, injects the Azure profile, and writes the result as a new commit with two parents. One PR and one tracking issue carry it. The cache fallback fix is already on main and is not touched.',
    action: 'Regenerate fork_upstream from the upstream tip',
    detail: 'sync-pr',
    time: 'Daily, 00:00 UTC',
    timeKind: 'Scheduled trigger',
    active: ['upstream', 'fork-upstream'],
  },
  {
    id: 'cascade',
    name: 'Integrate',
    owner: 'Cascade Integration',
    title: 'The fix and the upstream change meet in the workspace.',
    copy: 'A person dispatches the cascade after merging the sync PR; Cascade Monitor catches a forgotten one within six hours. It merges main into fork_integration first, so the fix is there, then merges fork_upstream on top, then builds -P core,azure. This is the first time the provider compiles against the new shared code.',
    action: 'Merge main, then fork_upstream, into fork_integration',
    detail: 'cascade-run',
    time: 'After the sync PR merges',
    timeKind: 'Dispatched by a person; the monitor is the six-hour safety net',
    active: ['fork-upstream', 'fork-integration', 'main-branch'],
  },
  {
    id: 'review',
    name: 'Propose',
    owner: 'A person · labels',
    title: 'Nothing reaches main without a person, and the labels say why.',
    copy: 'A clean cascade opens the integration PR from release/upstream-* into main and marks the tracking issue validated. A conflict or a failed build leaves cascade-blocked or cascade-failed with human-required instead. Removing human-required is the retry signal.',
    action: 'Approve the integration PR, or resolve the conflict',
    detail: 'integration-pr',
    time: 'Until a person acts',
    timeKind: 'Escalated after 48 hours blocked',
    active: ['fork-integration', 'main-branch'],
  },
  {
    id: 'prove',
    name: 'Build and prove',
    owner: 'Validation · on PRs and on pushes',
    title: 'Every eligible commit gets a digest, and a turn in the stack.',
    copy: 'Validation builds the image and pushes it as sha-&lt;commit&gt;. Deploy Gate then decides whether this run may borrow the stack: same-repository PRs and pushes to main qualify, before any release exists. That borrowed turn is view 06.',
    action: 'Push the candidate digest, then borrow a slot in the stack',
    detail: 'candidate',
    time: 'On the PR, again on the merge',
    timeKind: 'Event · one run per service at a time',
    active: ['main-branch', 'image', 'stack'],
  },
  {
    id: 'release',
    name: 'Release',
    owner: 'Release Please · optional',
    title: 'A version is a tag on an image that already exists.',
    copy: 'A push to main makes Release Please open or update a separate version PR with the changelog. Merging that PR tags main, records the upstream version in a correlation tag, and adds the version tag to the sha-* image validation already pushed. No new build runs.',
    action: 'Merge the version PR; tag main and the existing image',
    detail: 'release-tag',
    time: 'When a person merges the version PR',
    timeKind: 'Polls the registry for the sha-* image, 60 × 20 s',
    active: ['main-branch', 'image'],
  },
];

// Scheduled work that runs beside the day and is not caused by it.
export const meanwhile = [
  {
    id: 'template-pr',
    name: 'Sync Template',
    when: 'Daily, 08:00 UTC',
    copy: 'Workflow and Dockerfile changes arrive as one PR.',
  },
  {
    id: 'monitor',
    name: 'Cascade Monitor',
    when: 'Every 6 hours',
    copy: 'Dispatches, retries, and escalates.',
  },
  {
    id: 'settings-apply',
    name: 'Settings Apply',
    when: 'Mondays, 04:00 UTC',
    copy: 'Rulesets, onboarding variables, GHCR visibility.',
  },
];
