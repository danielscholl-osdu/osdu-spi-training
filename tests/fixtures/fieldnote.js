// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { chapters } from '../../src/content/chapters.js';
import { myths } from '../../src/content/myths.js';

// A lesson 01 episode for the renderer contract. No lesson has a cut yet, so
// its cut-from record is taken from the lesson as it stands.
export function lessonFieldnote() {
  const lesson = chapters['running-stack'];
  const myth = myths.find((item) => item.id === 'stack-is-only-aks');
  return {
    id: '01',
    chapter: 'running-stack',
    title: 'Anatomy of a stack',
    duration: 170,
    width: 1920,
    height: 1080,
    files: {
      video: 'fieldnote-01/video.mp4',
      poster: 'fieldnote-01/poster.jpg',
      captions: 'fieldnote-01/captions.vtt',
      chapters: 'fieldnote-01/chapters.vtt',
    },
    chapters: [
      { time: 22, claim: 0 },
      { time: 55, claim: 1 },
      { time: 88, claim: 2 },
      { time: 118, example: true },
      { time: 140, mistake: 'stack-is-only-aks' },
    ],
    cutFrom: {
      claims: lesson.outcomes.map(({ headline, text }) => ({ headline, text })),
      example: lesson.example.title,
      mistake: { id: myth.id, claim: myth.claim },
      next: chapters['bring-up'].question,
    },
    notes: [],
  };
}
