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
    origin:
      'Scripted from the Start narration and narrated with an Azure AI Speech voice; the notebook bookends generated with Gemini image models',
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
    origin:
      'Scripted from lesson 01 and narrated with an Azure AI Speech voice; illustrations generated with Gemini image models',
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
    origin:
      'Scripted from lesson 03 and narrated with an Azure AI Speech voice; source excerpts from the partition fork’s main branch; illustrations generated with Gemini image models',
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
    origin:
      'Scripted from lesson 06 and narrated with an Azure AI Speech voice; the run is illustrative; illustrations generated with Gemini image models',
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
