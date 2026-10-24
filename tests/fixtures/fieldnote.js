// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { chapters } from '../../src/content/chapters.js';
import { myths } from '../../src/content/myths.js';

// A lesson cut of the running-stack page for the renderer contract, its
// cut-from record taken from the lesson as it stands.
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
      next: chapters['spi-boundary'].question,
    },
    notes: [],
  };
}

// Synthetic media and times exercise the contract, not publication evidence.
export function coreDagsFieldnote() {
  return {
    id: '11',
    chapter: 'core-dags',
    title: 'On behalf of you',
    duration: 100,
    width: 1920,
    height: 1080,
    files: {
      video: 'fixture-core-dags/video.mp4',
      captions: 'fixture-core-dags/captions.vtt',
      chapters: 'fixture-core-dags/chapters.vtt',
    },
    chapters: [
      { time: 10, claim: 0 },
      { time: 25, claim: 1 },
      { time: 40, claim: 2 },
      { time: 60, example: true },
      { time: 80, mistake: 'run-succeeded-means-stored' },
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
      next: null,
    },
    notes: [],
  };
}
