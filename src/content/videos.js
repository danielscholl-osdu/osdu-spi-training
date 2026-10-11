// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// Fieldnotes: one short narrated video per lesson. A file path with no scheme
// resolves against videoBase, the media repository on Pages; a path under
// video/ is served from this site's public/ directory. A chapter names a claim
// index, the example, or a myth id. `cutFrom` records the lesson as it stood
// when the episode was cut ({ claims: [{ headline, text }] or the plain
// sentences, example, mistake: { id, claim }, next }); the content tests
// compare it with chapters.js and myths.js. A note is a string for the whole
// video or { chapter, text } for one chapter.
export const videoBase =
  'https://danielscholl-osdu.github.io/osdu-spi-training-media/';

export const fieldnotes = [
  {
    id: '00',
    chapter: 'start',
    title: 'How Microsoft engineers Azure OSDU',
    card: 'How the machinery is engineered',
    duration: 71,
    width: 720,
    height: 1280,
    files: {
      video: 'video/how-microsoft-engineers-azure-osdu.mp4',
      poster: 'video/how-microsoft-engineers-azure-osdu.jpg',
      captions: 'video/how-microsoft-engineers-azure-osdu.vtt',
      chapters: null,
    },
    chapters: [],
    cutFrom: null,
    origin:
      'Generated with NotebookLM as a video overview from the introduction source, Azure SPI: An Introduction',
    summary:
      'Provider ownership moving to Microsoft, the service forks, the candidate image, and a temporary test deployment in a live stack, drawn in one minute.',
    notes: [
      'The narration calls the Azure logic proprietary. The service forks are public repositories under the Apache 2.0 license; what changed is ownership, not visibility.',
      'The narration says the community stripped out all cloud-specific code. Upstream plans that removal (community ADR 61); as of September 2026 the Azure directory is still there.',
      'Restore is conditional: the run puts the environment back only while it still owns its pin, and a lost runner can leave work for a person.',
    ],
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
