// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// Fieldnotes: one short narrated video per lesson. A file path with no scheme
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
    id: '00',
    chapter: 'start',
    title: 'Three parts',
    card: 'How the machinery is engineered',
    duration: 185,
    width: 1920,
    height: 1080,
    files: {
      video: 'fieldnote-00/video.mp4',
      poster: 'fieldnote-00/poster.jpg',
      captions: 'fieldnote-00/captions.vtt',
      chapters: null,
    },
    chapters: [],
    cutFrom: null,
    summary:
      'The stack, the Azure provider inside each service, and the workflows that keep it current: one service, its fork, a candidate tested in a running stack, and what the lessons let you do.',
    notes: [],
  },
  {
    id: '01',
    chapter: 'running-stack',
    title: 'Anatomy of a stack',
    duration: 138,
    width: 1920,
    height: 1080,
    files: {
      video: 'fieldnote-01/video.mp4',
      poster: 'fieldnote-01/poster.jpg',
      captions: 'fieldnote-01/captions.vtt',
      chapters: 'fieldnote-01/chapters.vtt',
    },
    chapters: [
      { time: 20.8, claim: 0 },
      { time: 35.3, claim: 1 },
      { time: 58.5, claim: 2 },
      { time: 72.4, example: true },
      { time: 97.1, mistake: 'stack-is-only-aks' },
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
      next: 'How is the stack created, and when is it usable?',
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
      { time: 71.6, claim: 2 },
      { time: 84.1, example: true },
      { time: 116.8, mistake: 'suspended-means-frozen' },
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
    notes: [],
  },
  {
    id: '03',
    chapter: 'spi-boundary',
    title: 'The SPI boundary',
    duration: 194,
    width: 1920,
    height: 1080,
    files: {
      video: 'fieldnote-03/video.mp4',
      poster: 'fieldnote-03/poster.jpg',
      captions: 'fieldnote-03/captions.vtt',
      chapters: 'fieldnote-03/chapters.vtt',
    },
    chapters: [
      { time: 33.5, claim: 0 },
      { time: 57.4, claim: 1 },
      { time: 79.9, claim: 2 },
      { time: 100.9, example: true },
      { time: 137.9, mistake: 'token-accepted-means-authorized' },
    ],
    cutFrom: {
      claims: [
        {
          headline: 'Common code calls Azure through a provider interface.',
          text: 'Common service code calls a provider interface. The Azure implementation behind it checks Redis inside AKS with middleware credentials, then reads common Table Storage outside AKS with Workload Identity on a miss. The table read still happens when the cache throws.',
        },
        {
          headline: 'The interface and implementation ship in one image.',
          text: 'The interface and its implementation ship in one image. There is no network hop between them.',
        },
        {
          headline: 'The fork keeps Azure source outside the generated tree.',
          text: 'The fork maintains the Azure provider separately from generated shared code.',
        },
      ],
      example: 'Follow the same lookup through the provider',
      mistake: {
        id: 'token-accepted-means-authorized',
        claim: 'The token was accepted, so the call is authorized.',
      },
      next: 'Who owns that provider code, and how does it survive upstream deleting it?',
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
];

export function isLocalVideoFile(path) {
  return path.startsWith('video/');
}

export function videoUrl(path) {
  if (!path) return null;
  if (/^[a-z][a-z\d+.-]*:/i.test(path) || isLocalVideoFile(path)) return path;
  return new URL(path.replace(/^\/+/, ''), videoBase).href;
}

export const fieldnoteById = (id) =>
  fieldnotes.find((entry) => entry.id === id) || null;

export const fieldnoteFor = (chapter) =>
  fieldnotes.find((entry) => entry.chapter === chapter) || null;
