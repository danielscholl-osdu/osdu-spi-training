// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// Fieldnotes: one short narrated video per lesson, its id a lesson cut's two
// digits or a curriculum code from curriculum.js. A file path with no scheme
// resolves against videoBase, the media repository on Pages; a path under
// video/ is served from this site's public/ directory. A chapter names a claim
// index, the example, a myth id, or (lesson 07) a theme id. `cutFrom` records
// the lesson as it stood when the episode was cut ({ claims: [{ headline, text
// }] or the plain sentences, example, mistake: { id, claim }, themes: [{ theme,
// mistake }], next }); the content tests
// compare it with chapters.js and myths.js. A note is a string for the whole
// video or { chapter, text } for one chapter.
export const videoBase =
  'https://danielscholl-osdu.github.io/osdu-spi-training-media/';

export const fieldnotes = [
  {
    id: '101',
    chapter: 'start',
    title: 'Three parts',
    card: 'How the machinery is engineered',
    duration: 94,
    width: 1920,
    height: 1080,
    files: {
      video: 'fieldnote-101/video.mp4',
      poster: 'fieldnote-101/poster.jpg',
      captions: 'fieldnote-101/captions.vtt',
      chapters: null,
    },
    chapters: [],
    cutFrom: null,
    summary:
      'The Azure stack, the service interface with the Azure provider behind it, and the engineering system that keeps every service fork current: where each one lives, and how a change moves between them.',
    notes: [],
  },
  {
    id: '102',
    chapter: 'running-stack',
    title: 'Anatomy of a stack',
    duration: 126,
    width: 1920,
    height: 1080,
    files: {
      video: 'fieldnote-102/video.mp4',
      poster: 'fieldnote-102/poster.jpg',
      captions: 'fieldnote-102/captions.vtt',
      chapters: 'fieldnote-102/chapters.vtt',
    },
    chapters: [
      { time: 13.2, claim: 0 },
      { time: 27.7, claim: 1 },
      { time: 51.0, claim: 2 },
      { time: 64.9, example: true },
      { time: 89.6, mistake: 'stack-is-only-aks' },
    ],
    cutFrom: {
      claims: [
        {
          headline: 'The stack is AKS plus Azure data services.',
          text: 'A stack is a resource group: AKS plus the Azure data services around it, not the cluster alone.',
        },
        {
          headline: 'Partition resources and shared resources.',
          text: 'My partition’s records, blobs, and events each have their own Azure resource; entitlements, identities, and Key Vault are shared by the environment.',
        },
        {
          headline:
            'The OSDU services run in one namespace behind one gateway.',
          text: 'The OSDU services run in the osdu namespace, one image each, and every request reaches them through the Istio gateway.',
        },
      ],
      example: 'a partition lookup',
      mistake: {
        id: 'stack-is-only-aks',
        claim: 'The stack is just AKS.',
      },
      next: 'Where does the Azure code live in a service?',
    },
    notes: [],
  },
  {
    id: '103',
    chapter: 'spi-boundary',
    title: 'The provider inside',
    duration: 102,
    width: 1920,
    height: 1080,
    files: {
      video: 'fieldnote-103/video.mp4',
      poster: 'fieldnote-103/poster.jpg',
      captions: 'fieldnote-103/captions.vtt',
      chapters: 'fieldnote-103/chapters.vtt',
    },
    chapters: [
      { time: 12.6, claim: 0 },
      { time: 31.2, claim: 1 },
      { time: 51.1, claim: 2 },
      { time: 60.0, example: true },
    ],
    cutFrom: {
      claims: [
        {
          headline: 'Common code calls Azure through a provider interface.',
          text: 'Common service code calls a provider interface, and the Azure implementation behind it connects that interface to Azure services.',
        },
        {
          headline: 'The interface and implementation ship in one image.',
          text: 'The interface and its implementation ship in one image. There is no network hop between them.',
        },
        {
          headline: 'The Azure code lives in the service’s fork.',
          text: 'The Azure implementation is source in the service’s fork, in its own provider folder beside the shared code.',
        },
      ],
      example: 'Follow the same lookup through the provider',
      next: 'How does a change reach a running service?',
    },
    notes: [],
  },
  {
    id: '104',
    chapter: 'the-line',
    title: 'The line',
    duration: 142,
    width: 1920,
    height: 1080,
    files: {
      video: 'fieldnote-104/video.mp4',
      poster: 'fieldnote-104/poster.jpg',
      captions: 'fieldnote-104/captions.vtt',
      chapters: 'fieldnote-104/chapters.vtt',
    },
    chapters: [
      { time: 12.5, claim: 0 },
      { time: 34.9, claim: 1 },
      { time: 72.2, claim: 2 },
      { time: 92.4, example: true },
    ],
    cutFrom: {
      claims: [
        {
          headline: 'A fork owns only a few of its paths.',
          text: 'A service fork owns its Azure provider, its Azure tests, and the files that describe it; its workflows come from the template, and the community’s code is regenerated from upstream every day.',
        },
        {
          headline: 'Every fork has the same six stations.',
          text: 'A change reaches a running service through upstream, sync, cascade, main, and release, with the lane beside them, and every fork has the same six because every fork comes from one template.',
        },
        {
          headline: 'Every eligible commit is proved before any release.',
          text: 'Every eligible commit gets an image and a turn in a running stack before any release exists, so a release only tags an image that is already there.',
        },
      ],
      example: 'Follow one upstream change along the line',
      next: 'Who does what, and which path is mine?',
    },
    notes: [
      {
        chapter: 2,
        text: 'A release commit’s own image is the exception: the release tags it as soon as it is pushed, and its turn in the lane follows.',
      },
    ],
  },
  {
    id: '105',
    chapter: 'two-kinds-of-work',
    title: 'Two kinds of work',
    duration: 130,
    width: 1920,
    height: 1080,
    files: {
      video: 'fieldnote-105/video.mp4',
      poster: 'fieldnote-105/poster.jpg',
      captions: 'fieldnote-105/captions.vtt',
      chapters: 'fieldnote-105/chapters.vtt',
    },
    chapters: [
      { time: 12.8, claim: 0 },
      { time: 33.6, claim: 1 },
      { time: 60.1, claim: 2 },
      { time: 83.8, example: true },
    ],
    cutFrom: {
      claims: [
        {
          headline: 'The line carries the product.',
          text: 'The line is the template and its workflows, the shared stack, and the automation that runs them; the product is each service’s code, its Azure provider, its tests, and what the service promises its callers.',
        },
        {
          headline: 'A person approves what reaches main.',
          text: 'Automation opens the sync, cascade, release, dependency, and template pull requests, and nothing reaches main until a code owner approves it after its last push with the required checks green; when the line cannot go on alone, it opens an issue for a person.',
        },
        {
          headline: 'Your work picks your path.',
          text: 'Changing what a service does is service work and takes the service path; changing what carries every service is platform work and takes the platform path; one person can do both.',
        },
      ],
      example: 'Find the person on one upstream change',
      next: [
        { code: 'S201', title: 'Your own environment' },
        { code: 'P201', title: 'How it comes to life' },
      ],
    },
    notes: [],
  },
  {
    id: 'S201',
    chapter: 'your-environment',
    title: 'Your own environment',
    duration: 135.9,
    width: 1920,
    height: 1080,
    files: {
      video: 'fieldnote-S201/video.mp4',
      poster: 'fieldnote-S201/poster.jpg',
      captions: 'fieldnote-S201/captions.vtt',
      chapters: 'fieldnote-S201/chapters.vtt',
    },
    chapters: [
      { time: 11.314, claim: 0 },
      { time: 39.102, claim: 1 },
      { time: 70.682, claim: 2 },
      { time: 92.582, mistake: 'finished-means-ready' },
    ],
    cutFrom: {
      claims: [
        {
          headline: 'Check first, then spi up builds your environment',
          text: 'spi check confirms the tools spi drives and that your Azure sign-in may create resource groups, clusters and role assignments; spi up --env <name> then builds your stack as one resource group in your subscription.',
        },
        {
          headline:
            'spi up returns before the environment is usable; wait for Deployable',
          text: 'spi up returns while Flux is still reconciling, so follow the rollout with spi status --watch until its summary reads Deployable, which in this take came 22 minutes after the command returned.',
        },
        {
          headline:
            'spi info names your endpoints, and spi down gives the environment back',
          text: 'spi info prints your environment’s base URL and its endpoints, and spi down --env <name> takes the environment down when you are done, keeping its managed identities for the next spi up.',
        },
      ],
      example: null,
      mistake: {
        id: 'finished-means-ready',
        claim: 'The command finished, so it is ready.',
      },
      next: 'Who does the stack think you are?',
    },
    notes: [],
  },
  {
    id: 'S202',
    chapter: 'who-is-asking',
    title: 'Who is asking',
    duration: 127.8,
    width: 1920,
    height: 1080,
    files: {
      video: 'fieldnote-S202/video.mp4',
      poster: 'fieldnote-S202/poster.jpg',
      captions: 'fieldnote-S202/captions.vtt',
      chapters: 'fieldnote-S202/chapters.vtt',
    },
    chapters: [
      { time: 12.414, claim: 0 },
      { time: 63.856, claim: 1 },
      { time: 85.548, mistake: 'users-add-accumulates' },
    ],
    cutFrom: {
      claims: [
        {
          headline: 'The mesh authenticates and entitlements authorizes',
          text: 'spi token --me prints your own Azure token; the mesh accepts it and writes your unique_name as the caller, entitlements refuses you with 401 until you are a member, and spi users add --me makes you one and checks with your own token.',
        },
        {
          headline:
            'A role is a preset of groups, and spi users add replaces it',
          text: 'A role is one of four presets of groups, and you hold one at a time: viewer is users and users.datalake.viewers; editor, admin and ops each add their own groups and users.datalake.impersonation; and spi users add with another role replaces the one you held.',
        },
      ],
      example: 'From 401 to 200',
      mistake: {
        id: 'users-add-accumulates',
        claim: 'Running spi users add again adds to the role I hold.',
      },
      next: 'What does a new environment hold, and does ingestion work?',
    },
    notes: [],
  },
  {
    id: 'S203',
    chapter: 'ready-not-loaded',
    title: 'Ready is not loaded',
    duration: 134.9,
    width: 1920,
    height: 1080,
    files: {
      video: 'fieldnote-S203/video.mp4',
      poster: 'fieldnote-S203/poster.jpg',
      captions: 'fieldnote-S203/captions.vtt',
      chapters: 'fieldnote-S203/chapters.vtt',
    },
    chapters: [
      { time: 13.386, claim: 0 },
      { time: 35.374, claim: 1 },
      { time: 52.074, claim: 2 },
      { time: 72.238, example: true },
      { time: 91.282, mistake: 'deployable-means-loaded' },
    ],
    cutFrom: {
      claims: [
        {
          headline: 'A Deployable environment holds schemas and no records',
          text: 'Bring-up registers the schemas and writes no records; reference data, from the community’s data definitions, is loaded by nothing until you run spi load, and spi load refuses to start until the environment is Deployable.',
        },
        {
          headline:
            'Loaded means Storage accepted the records, not that search finds them',
          text: 'spi load creates one Job per partition that writes the reference data to Storage; complete means Storage accepted the records, and the indexer may still be working.',
        },
        {
          headline: 'Ingestion writes on behalf of whoever started it',
          text: 'Deployable does not wait for the DAGs to register, so prove ingestion: a run started with your own token writes on behalf of you, and the stored record’s createUser is you, not the platform.',
        },
      ],
      example: 'spi test dags, as me',
      mistake: {
        id: 'deployable-means-loaded',
        claim: "It's Deployable, so the data is there.",
      },
      next: 'Which commit does each service run?',
    },
    notes: [],
  },
  {
    id: 'S204',
    chapter: 'whose-image',
    title: 'Whose image is running',
    duration: 118,
    width: 1920,
    height: 1080,
    files: {
      video: 'fieldnote-S204/video.mp4',
      poster: 'fieldnote-S204/poster.jpg',
      captions: 'fieldnote-S204/captions.vtt',
      chapters: 'fieldnote-S204/chapters.vtt',
    },
    chapters: [
      { time: 12.14, claim: 0 },
      { time: 53.364, claim: 1 },
      { time: 75.048, mistake: 'refresh-is-automatic' },
    ],
    cutFrom: {
      claims: [
        {
          headline:
            'The image lock ties each service to one commit and one digest',
          text: 'At spi up the CLI asks GHCR which digest main-snapshot names for each of thirteen forks and records it in the image lock under the sha tag of the commit that built it; a tag can move, so the lock keeps the digest and its build date, and the pods run the locked digest.',
        },
        {
          headline:
            'A canonical image ages toward retention until a refresh moves it',
          text: 'Every image ages from the day it was built, and once it is old enough and main has built past it, GHCR retention can delete it, so spi info and spi status mark an old canonical, and only a refresh moves it.',
        },
      ],
      example: "Follow partition's tag home",
      mistake: {
        id: 'refresh-is-automatic',
        claim: "My environment picks up the fork's new main on its own.",
      },
      next: 'How do I prove a change before a pull request?',
    },
    notes: [],
  },
  {
    id: 'S205',
    chapter: 'prove-from-desk',
    title: 'Prove it from your desk',
    duration: 117.6,
    width: 1920,
    height: 1080,
    files: {
      video: 'fieldnote-S205/video.mp4',
      poster: 'fieldnote-S205/poster.jpg',
      captions: 'fieldnote-S205/captions.vtt',
      chapters: 'fieldnote-S205/chapters.vtt',
    },
    chapters: [
      { time: 13.498, claim: 0 },
      { time: 39.004, claim: 1 },
    ],
    cutFrom: {
      claims: [
        {
          headline: 'spi test runs the suite the deployed commit shipped',
          text: 'When spi up resolves a service, the lock also records the acceptance image built from the same commit; once the environment is Deployable, spi test pulls that image by digest and runs its suite against your services, and the verdict names the image.',
        },
        {
          headline: 'A local change reaches the environment as a pin',
          text: 'spi service pin --source builds the JAR from your checkout and the image in the environment’s own registry, pins the service to the image’s digest, and waits until a pod runs it; spi test --source then runs the checkout’s suite, labeled matched when the checkout is at the pin’s commit with a clean tree and unmatched otherwise, and spi service reset puts the canonical back.',
        },
      ],
      example: null,
      next: 'What happens to my change after I open a pull request?',
    },
    notes: [],
  },
  {
    id: 'S206',
    chapter: 'ship-it',
    title: 'Ship it through the line',
    duration: 161.3,
    width: 1920,
    height: 1080,
    files: {
      video: 'fieldnote-S206/video.mp4',
      poster: 'fieldnote-S206/poster.jpg',
      captions: 'fieldnote-S206/captions.vtt',
      chapters: 'fieldnote-S206/chapters.vtt',
    },
    chapters: [
      { time: 12.966, claim: 0 },
      { time: 43.226, example: true },
      { time: 113.81, mistake: 'acceptance-needs-a-release' },
    ],
    cutFrom: {
      claims: [
        {
          headline:
            "A pull request's checks, the lane among them, and a code owner's approval",
          text: 'Two required checks gate a merge into main, CodeQL and Validation Summary, and Validation Summary speaks for the build, the image and the lane; a code owner approves after the last push, a new push dismisses that approval, and every review thread is resolved.',
        },
      ],
      example: 'one fix, from pull request to main',
      mistake: {
        id: 'acceptance-needs-a-release',
        claim: 'The stack only ever runs released versions of a fork.',
      },
      next: 'What does the line ask of me when upstream moves?',
    },
    notes: [],
  },
  {
    id: 'S207',
    chapter: 'changes-to-you',
    title: 'Changes that come to you',
    duration: 189.1,
    width: 1920,
    height: 1080,
    files: {
      video: 'fieldnote-S207/video.mp4',
      poster: 'fieldnote-S207/poster.jpg',
      captions: 'fieldnote-S207/captions.vtt',
      chapters: 'fieldnote-S207/chapters.vtt',
    },
    chapters: [
      { time: 13.85, claim: 0 },
      { time: 85.866, claim: 1 },
      { time: 118.386, claim: 2 },
      { time: 147.938, mistake: 'template-sync-overwrites' },
    ],
    cutFrom: {
      claims: [
        {
          headline: "Sync, cascade and the tracking issue's labels",
          text: 'Once a day sync opens a pull request into fork_upstream and a tracking issue, both labeled human-required; after a person merges it, the cascade starts within seconds, the issue goes cascade-active and then validated, and the cascade opens a pull request to main that gets the full lane and that a person merges. When the cascade cannot finish, the issue goes cascade-blocked and a new human-required issue says what stopped it.',
        },
        {
          headline: 'Upstream-owned files change only with the port label',
          text: 'A file that comes from fork_upstream is upstream-owned; when your pull request to main changes one, Check Paths fails and the Validation Summary fails with it, unless the pull request carries the port label and Check Paths is re-run, when it names each file as a declared port.',
        },
        {
          headline:
            'Template sync proposes a pull request; nothing lands until a person merges',
          text: 'Once a day template sync proposes the template’s changes as one pull request to main labeled template-sync, updated in place if the template moves again, with the template’s whole copy of each changed file on its branch; nothing reaches main until a person merges it.',
        },
      ],
      example: null,
      mistake: {
        id: 'template-sync-overwrites',
        claim:
          'Template sync will overwrite the workflow change I made in my fork.',
      },
      next: 'How is fork_upstream generated?',
    },
    notes: [
      'The end card’s Next is P304, The filter, a deep dive that asks “How is fork_upstream generated?” and has no page yet; this page’s Next leads on to How it comes to life.',
    ],
  },
  {
    id: '02',
    chapter: 'bring-up',
    title: 'How it comes to life',
    duration: 170,
    width: 1920,
    height: 1080,
    files: {
      video: 'fieldnote-02/video.mp4',
      poster: 'fieldnote-02/poster.jpg',
      captions: 'fieldnote-02/captions.vtt',
      chapters: 'fieldnote-02/chapters.vtt',
    },
    chapters: [
      { time: 29.6, claim: 0 },
      { time: 46.3, claim: 1 },
      { time: 71.4, claim: 2 },
      { time: 83.9, example: true },
      { time: 116.6, mistake: 'suspended-means-frozen' },
    ],
    cutFrom: {
      claims: [
        {
          headline:
            'CLI creates; Flux assembles; controllers keep workloads healthy.',
          text: 'The CLI and Bicep create Azure and seed the cluster; Flux assembles the workloads; controllers keep them healthy. Flux and Kubernetes controllers continue after the CLI returns.',
        },
        {
          headline: 'CLI success is not API readiness.',
          text: 'A successful spi up does not establish API readiness. I follow workload health and initialization with spi status --watch, then verify the API path I need with an authenticated request.',
        },
        {
          headline: 'Teardown removes data but preserves identities and names.',
          text: 'spi down removes compute and data but keeps identities and the resource group, so a rebuild reuses the same names.',
        },
      ],
      example: 'Before the lookup can answer',
      mistake: {
        id: 'suspended-means-frozen',
        claim: 'GitOps is suspended, so nothing changes.',
      },
      next: 'Where does shared code hand the lookup to the Azure provider?',
    },
    notes: [
      'The end card asks where shared code hands the lookup to the Azure provider, which Fieldnote 103 answers before this lesson; the next lesson, 04, asks “Who owns that provider code, and how does it survive upstream deleting it?”',
    ],
  },
  {
    id: '04',
    chapter: 'fork-shape',
    title: 'The shape of the fork',
    duration: 176,
    width: 1920,
    height: 1080,
    files: {
      video: 'fieldnote-04/video.mp4',
      poster: 'fieldnote-04/poster.jpg',
      captions: 'fieldnote-04/captions.vtt',
      chapters: 'fieldnote-04/chapters.vtt',
    },
    chapters: [
      { time: 26.9, claim: 0 },
      { time: 48.1, claim: 1 },
      { time: 68.4, claim: 2 },
      { time: 90.4, example: true },
      { time: 122.6, mistake: 'fork-is-a-snapshot' },
    ],
    cutFrom: {
      claims: [
        'The fork owns provider/partition-azure, its Azure tests, its descriptor, and the engineering files the template delivers. Everything else is upstream’s, regenerated daily.',
        'The fork has three branches with three jobs: fork_upstream is generated input, fork_integration is the workspace, main is the protected result. Upstream is outside all three.',
        'fork_upstream is generated with the Azure paths absent by construction, so an upstream deletion has nothing to delete on the fork side.',
      ],
      example: 'The cache fallback fix, at rest',
      mistake: {
        id: 'fork-is-a-snapshot',
        claim: 'A fork is a copy we took once and patch as we go.',
      },
      next: 'What happens to a provider change, and to upstream’s change, between midnight and an image digest?',
    },
    notes: [],
  },
  {
    id: '05',
    chapter: 'fork-day',
    title: 'A day in the fork',
    duration: 195,
    width: 1920,
    height: 1080,
    files: {
      video: 'fieldnote-05/video.mp4',
      poster: 'fieldnote-05/poster.jpg',
      captions: 'fieldnote-05/captions.vtt',
      chapters: 'fieldnote-05/chapters.vtt',
    },
    chapters: [
      { time: 35.6, claim: 0 },
      { time: 67.2, claim: 1 },
      { time: 86.5, claim: 2 },
      { time: 113.2, example: true },
      { time: 140.1, mistake: 'release-rebuilds-image' },
    ],
    cutFrom: {
      claims: [
        'A sync is a generated tree plus one PR and one tracking issue; upstream is never merged in as text, and the generated commit lands through a reviewed sync PR. The cascade merges main first, then fork_upstream, into the workspace.',
        'The labels on the tracking issue are the state: cascade-active, cascade-blocked, cascade-failed, validated. A blocked cascade is run again after a provider change on fork_integration; removing human-required is how a failed one retries.',
        'The integration PR and the version PR are different PRs. Validation runs on PRs and on pushes to main and fork_integration, pushes a digest for every eligible commit, and the stack is borrowed for it before any release exists.',
      ],
      example: 'The cache fallback fix meets the upstream change',
      mistake: {
        id: 'release-rebuilds-image',
        claim: 'A release builds a fresh image for the version tag.',
      },
      next: 'How does a candidate image reach a running stack, what proves it, and how is the temporary test deployment restored?',
    },
    notes: [],
  },
  {
    id: '06',
    chapter: 'handshake',
    title: 'The handshake',
    duration: 180,
    width: 1920,
    height: 1080,
    files: {
      video: 'fieldnote-06/video.mp4',
      poster: 'fieldnote-06/poster.jpg',
      captions: 'fieldnote-06/captions.vtt',
      chapters: 'fieldnote-06/chapters.vtt',
    },
    chapters: [
      {
        time: 32.5,
        claim: 0,
      },
      {
        time: 57.1,
        claim: 1,
      },
      {
        time: 80.3,
        claim: 2,
      },
      {
        time: 102.6,
        example: true,
      },
      {
        time: 131.5,
        mistake: 'validation-summary-means-deployed',
      },
    ],
    cutFrom: {
      claims: [
        {
          headline: 'Writing the lock starts the deploy.',
          text: 'Writing the lock starts the deploy: Flux reconciles osdu-image-lock and the pod restarts on the pinned digest, and the run checks the pod before trusting any test result. Between runs the lock holds the canonical image.',
        },
        {
          headline: 'A green restore is a claim about this run.',
          text: 'The run only restores what it still owns, so a green restore is a claim about this run, not about the environment.',
        },
        {
          headline: 'The stack publishes facts; the fork declares needs.',
          text: 'The stack publishes facts and the fork declares needs in its descriptor. Five repository settings, plus trust onboarding on the stack side, are all that connect them.',
        },
      ],
      example: 'Candidate B borrows the partition slot in the stack',
      mistake: {
        id: 'validation-summary-means-deployed',
        claim:
          'Validation Summary is green, so the change ran in a real environment.',
      },
      next: 'Which reasonable assumptions will cost me an afternoon?',
    },
    notes: [],
  },
  {
    id: '07',
    chapter: 'not-true',
    title: 'Things that are not true',
    duration: 205,
    width: 1920,
    height: 1080,
    files: {
      video: 'fieldnote-07/video.mp4',
      poster: 'fieldnote-07/poster.jpg',
      captions: 'fieldnote-07/captions.vtt',
      chapters: 'fieldnote-07/chapters.vtt',
    },
    chapters: [
      {
        time: 25.9,
        theme: 'readiness',
      },
      {
        time: 49.6,
        theme: 'gitops',
      },
      {
        time: 70,
        theme: 'identity',
      },
      {
        time: 91.1,
        theme: 'network',
      },
      {
        time: 112.6,
        theme: 'estate',
      },
      {
        time: 129.9,
        theme: 'fork',
      },
      {
        time: 152.8,
        theme: 'seam',
      },
    ],
    cutFrom: {
      claims: [
        'When something looks wrong, I know which owner to ask and which command shows its view of the world.',
        'Provisioning, convergence, readiness, and proof are different signals, and I check the one I actually need.',
      ],
      themes: [
        {
          theme: 'readiness',
          mistake: {
            id: 'smoke-proves-api',
            claim: 'The smoke test passed, so the API works.',
          },
        },
        {
          theme: 'gitops',
          mistake: {
            id: 'reapply-retries',
            claim: 'Re-applying the manifest will retry it.',
          },
        },
        {
          theme: 'identity',
          mistake: {
            id: 'role-assignment-missing',
            claim: 'The role assignment is missing.',
          },
        },
        {
          theme: 'network',
          mistake: {
            id: 'certificate-means-encrypted',
            claim: 'There is a certificate, so the connection is encrypted.',
          },
        },
        {
          theme: 'estate',
          mistake: {
            id: 'teardown-green-means-deleted',
            claim: 'The teardown job was green, so it was deleted.',
          },
        },
        {
          theme: 'fork',
          mistake: {
            id: 'template-sync-overwrites',
            claim:
              'Template sync will overwrite the workflow change I made in my fork.',
          },
        },
        {
          theme: 'seam',
          mistake: {
            id: 'restore-always-restores',
            claim: 'The restore step puts the previous image back.',
          },
        },
      ],
    },
    notes: [
      {
        chapter: 5,
        text: 'Template sync’s pull request carries the template’s whole copy of each file it changed, so a local edit to that file shows in its diff as a change to review, and nothing lands on main until a person merges. The recording calls the kept change a review comment.',
      },
    ],
  },
  {
    id: '11',
    chapter: 'core-dags',
    title: 'On behalf of you',
    duration: 245,
    width: 1920,
    height: 1080,
    files: {
      video: 'fieldnote-11/video.mp4',
      poster: 'fieldnote-11/poster.jpg',
      captions: 'fieldnote-11/captions.vtt',
      chapters: 'fieldnote-11/chapters.vtt',
    },
    chapters: [
      { time: 51.2, claim: 0 },
      { time: 83.8, claim: 1 },
      { time: 110.3, claim: 2 },
      { time: 150.8, example: true },
      { time: 183.1, mistake: 'run-succeeded-means-stored' },
    ],
    cutFrom: {
      claims: [
        {
          headline:
            'A DAG reaches Airflow from a reviewed catalog, hash by hash.',
          text: 'A reviewed catalog selects two DAG families and four IDs; init containers verify full commits and per-file SHA-256 hashes before the scheduler and processor receive their files.',
        },
        {
          headline:
            'Registration comes later, and it does not gate Deployable.',
          text: 'After Airflow and initialization, the separate layer-6 Job registers system workflows and unpauses declared DAGs, but its success does not gate Deployable.',
        },
        {
          headline: 'Each task writes on behalf of the caller.',
          text: 'Workflow derives the caller from their token; a LocalExecutor task inside the scheduler calls Storage with the OSDU identity plus on-behalf-of, and read-back must show that caller as createUser.',
        },
      ],
      example: 'Proof: spi test dags, as me',
      mistake: {
        id: 'run-succeeded-means-stored',
        claim: 'The run finished, so every record is stored.',
      },
      next: 'How do you prove a service from your desk?',
    },
    notes: [
      'The end card asks “How do you prove a service from your desk?”, which S205 answers earlier on the service path; this lesson is the last page, so its pager returns to the start.',
    ],
  },
];

export function isLocalVideoFile(path) {
  return path.startsWith('video/');
}

export function videoUrl(path) {
  if (!path) return null;
  if (/^[a-z][a-z\d+.-]*:/i.test(path) || isLocalVideoFile(path)) return path;
  return new URL(path.replace(/^\/+/, ''), videoBase).href;
}

// A lesson cut replaced by a curriculum episode keeps its published id.
export const retiredFieldnotes = {
  '00': '101',
  '01': '102',
  '03': '103',
  '08': 'S204',
  '09': 'S202',
  10: 'S203',
  12: 'S205',
};

export const fieldnoteById = (id) => {
  const current = Object.hasOwn(retiredFieldnotes, id)
    ? retiredFieldnotes[id]
    : id;
  return fieldnotes.find((entry) => entry.id === current) || null;
};

export const fieldnoteFor = (chapter) =>
  fieldnotes.find((entry) => entry.chapter === chapter) || null;
