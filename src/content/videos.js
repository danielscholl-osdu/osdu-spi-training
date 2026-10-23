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
    notes: [],
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
    notes: [],
  },
  {
    id: '08',
    chapter: 'whose-image',
    title: 'Whose image is running?',
    duration: 211,
    width: 1920,
    height: 1080,
    files: {
      video: 'fieldnote-08/video.mp4',
      poster: 'fieldnote-08/poster.jpg',
      captions: 'fieldnote-08/captions.vtt',
      chapters: 'fieldnote-08/chapters.vtt',
    },
    chapters: [
      { time: 46.9, claim: 0 },
      { time: 76.6, claim: 1 },
      { time: 99.5, claim: 2 },
      { time: 131.8, example: true },
      { time: 160.2, mistake: 'refresh-is-automatic' },
    ],
    cutFrom: {
      claims: [
        {
          headline: "Each service runs its Azure fork's main image from GHCR.",
          text: 'At spi up the CLI asks GHCR which digest main-snapshot names for each of thirteen forks and records it under the sha tag of the commit that built it; schema’s loader comes from the same commit as schema.',
        },
        {
          headline: 'The lock ties each tag to one fork commit and one digest.',
          text: 'osdu-image-lock records each service’s repository, sha tag, digest, and build date; the tag names a commit on the fork’s main, and the pods run the digest.',
        },
        {
          headline:
            'A canonical image ages toward retention until a refresh moves it.',
          text: 'Nothing moves a canonical on its own: spi info and spi status mark one built more than 21 days ago, and the fork’s weekly retention can delete a sha image over 30 days old once main has built past it.',
        },
      ],
      example: "Follow partition's tag home",
      mistake: {
        id: 'refresh-is-automatic',
        claim: "My environment picks up the fork's new main on its own.",
      },
      next: 'Who does the stack think you are, and what may you do?',
    },
    notes: [],
  },
  {
    id: '09',
    chapter: 'who-is-asking',
    title: 'Who is asking',
    duration: 202,
    width: 1920,
    height: 1080,
    files: {
      video: 'fieldnote-09/video.mp4',
      poster: 'fieldnote-09/poster.jpg',
      captions: 'fieldnote-09/captions.vtt',
      chapters: 'fieldnote-09/chapters.vtt',
    },
    chapters: [
      { time: 42.5, claim: 0 },
      { time: 74.4, claim: 1 },
      { time: 99.2, claim: 2 },
      { time: 124.1, example: true },
      { time: 149.6, mistake: 'users-add-accumulates' },
    ],
    cutFrom: {
      claims: [
        {
          headline: 'Your own token passes the mesh, and entitlements decides.',
          text: 'spi token --me prints your own Azure token; the mesh accepts its issuer and writes your unique_name as x-user-id, and entitlements refuses you with 401 until you are a member.',
        },
        {
          headline: 'spi users stores the id the mesh writes, and proves it.',
          text: 'spi users add --me applies the mesh’s own claim order to your token and stores that id; the deploy identity writes your groups, then the command calls entitlements with your token for up to a minute.',
        },
        {
          headline: 'Only editor, admin and ops can run ingestion as you.',
          text: 'A role is one of four presets of groups; editor, admin and ops carry users.datalake.impersonation, which lets the stack’s OSDU identity act for you through Workflow, and viewer does not.',
        },
      ],
      example: 'From 401 to 200',
      mistake: {
        id: 'users-add-accumulates',
        claim: 'Running spi users add again adds to the role I hold.',
      },
      next: 'When is a new environment ready, open for deploys, and holding data?',
    },
    notes: [],
  },
  {
    id: '10',
    chapter: 'ready-not-loaded',
    title: 'Ready is not loaded',
    duration: 227,
    width: 1920,
    height: 1080,
    files: {
      video: 'fieldnote-10/video.mp4',
      poster: 'fieldnote-10/poster.jpg',
      captions: 'fieldnote-10/captions.vtt',
      chapters: 'fieldnote-10/chapters.vtt',
    },
    chapters: [
      { time: 47.9, claim: 0 },
      { time: 85.6, claim: 1 },
      { time: 114.4, claim: 2 },
      { time: 142.0, example: true },
      { time: 173.3, mistake: 'deployable-means-loaded' },
    ],
    cutFrom: {
      claims: [
        {
          headline:
            'Deployable is Ready, with maintenance off and bootstrap finished.',
          text: 'spi status answers two questions: Ready means every gating Flux layer has converged, and Deployable adds maintenance off, a deploy record present, and the members Job finished in every partition.',
        },
        {
          headline: 'A Deployable environment holds schemas and no records.',
          text: 'Bring-up registers the schemas through a Flux Job behind a gating layer and writes no records; reference data is loaded by nothing until you run spi load.',
        },
        {
          headline:
            'Loaded means Storage accepted the records, not that search finds them.',
          text: 'spi load creates one Job per partition that checks every kind against Schema and writes in batches of 500, skipping duplicates; complete means Storage accepted the records, and the indexer may still be working.',
        },
      ],
      example: 'From Ready to 80,103 records',
      mistake: {
        id: 'deployable-means-loaded',
        claim: "It's Deployable, so the data is there.",
      },
      next: 'How does a DAG reach the stack, who does each task act as, and how do you know it stored anything?',
    },
    notes: [],
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
    notes: [],
  },
  {
    id: '12',
    chapter: 'prove-from-desk',
    title: 'Prove it from your desk',
    duration: 223,
    width: 1920,
    height: 1080,
    files: {
      video: 'fieldnote-12/video.mp4',
      poster: 'fieldnote-12/poster.jpg',
      captions: 'fieldnote-12/captions.vtt',
      chapters: 'fieldnote-12/chapters.vtt',
    },
    chapters: [
      { time: 44.5, claim: 0 },
      { time: 74.8, claim: 1 },
      { time: 107.0, claim: 2 },
      { time: 134.7, example: true },
      { time: 161.2, mistake: 'passed-means-checked' },
    ],
    cutFrom: {
      claims: [
        {
          headline: 'spi test runs the suite the deployed commit shipped.',
          text: 'When a canonical is resolved, the lock also records the digest of the acceptance image built from the same commit; spi test runs that image by digest with the descriptor, resolver, and verdict script fetched from the fork at that commit.',
        },
        {
          headline:
            'A pass counts tests, and the report shows what they prove.',
          text: 'The verdict is the commit’s own script: a zero exit, at least one test not skipped, and no failures; --report counts the passing tests with empty bodies, and --review grades what each test proves against the service’s own API docs.',
        },
        {
          headline: 'A change on your desk reaches the stack as a local pin.',
          text: 'spi service pin --source builds the JAR on your machine and the image in the environment’s own registry, pins it by digest, and waits for the rollout; spi test --source then runs your checkout’s suite, labeled matched when its commit and a clean tree equal the pin.',
        },
      ],
      example: 'spi test partition, paired',
      mistake: {
        id: 'passed-means-checked',
        claim: 'The suite passed, so every test checked something.',
      },
      next: null,
    },
    notes: [],
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
export const retiredFieldnotes = { '00': '101', '01': '102', '03': '103' };

export const fieldnoteById = (id) => {
  const current = Object.hasOwn(retiredFieldnotes, id)
    ? retiredFieldnotes[id]
    : id;
  return fieldnotes.find((entry) => entry.id === current) || null;
};

export const fieldnoteFor = (chapter) =>
  fieldnotes.find((entry) => entry.chapter === chapter) || null;
