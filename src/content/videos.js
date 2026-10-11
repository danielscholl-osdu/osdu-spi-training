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
