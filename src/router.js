// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { chapters } from './content/chapters.js';
import { creationMoments } from './content/creation-moments.js';
import { forkMoments } from './content/fork-moments.js';

// Route keys that were published and later split or renamed keep resolving.
// A retired chapter maps to a new chapter, and each of its components to the
// component that now carries the same meaning.
export const chapterAliases = { 'engineering-system': 'handshake' };
// Guide anchors that moved off a page keep resolving on the page that has them.
export const movedGuides = {
  start: { 'round-trip': 'field-guides', ladder: 'field-guides' },
};
// Posters retired from the Field guides page keep their links: each lands on
// the guide that carries the same subject.
export const retiredGuides = {
  blueprint: 'owners',
  'permanent-fork': 'round-trip',
  'continuous-forking': 'contribution-chain',
};
export const retiredDetails = {
  'engineering-system': {
    repo: ['fork-shape', null, 'main-branch'],
    'stack-source': ['bring-up', 'reconcile', 'config-source'],
    upstream: ['fork-shape', null, 'upstream'],
    engineering: ['fork-shape', null, 'engineering'],
    image: ['fork-day', 'prove', 'candidate'],
    delivery: ['handshake', null, 'delivery'],
    running: ['handshake', null, 'running'],
    proof: ['handshake', null, 'proof'],
  },
  // Lesson 01 draws the service closed and holds the source nodes for the
  // lifecycle; their published routes land where each is drawn now.
  'running-stack': {
    provider: ['spi-boundary', null, 'azureimpl'],
    'config-source': ['bring-up', 'reconcile', 'config-source'],
    'image-source': ['bring-up', 'reconcile', 'image-source'],
  },
  'bring-up': {
    provider: ['spi-boundary', null, 'azureimpl'],
  },
  'fork-day': {
    'release-pr': ['fork-day', 'review', 'integration-pr'],
    'template-pr': ['fork-day', null, 'template-pr'],
    'settings-apply': ['fork-day', null, 'settings-apply'],
    'dev1-slot': ['fork-day', 'prove', 'stack-slot'],
  },
};

export function chapterSteps(chapter) {
  if (chapter === 'bring-up') return creationMoments.map((moment) => moment.id);
  if (chapter === 'fork-day') return forkMoments.map((moment) => moment.id);
  if (chapter === 'running-stack') return ['developer', 'request'];
  return [];
}

function selectionIndex(value) {
  if (!/^(0|[1-9]\d*)$/.test(value || '')) return null;
  const index = Number(value);
  return Number.isSafeInteger(index) ? index : null;
}

export function parseRoute(hash) {
  const [path = '', query = ''] = hash.replace(/^#/, '').split('?');
  const [requestedChapter, requestedStepRaw] = path.split('/');
  const params = new URLSearchParams(query);
  let resolved = chapterAliases[requestedChapter] || requestedChapter;
  let requestedStep = requestedStepRaw;
  let detail = params.get('detail');
  const requestedGuide = params.get('guide');
  const guide =
    requestedGuide && Object.hasOwn(retiredGuides, requestedGuide)
      ? retiredGuides[requestedGuide]
      : requestedGuide;
  const from = movedGuides[requestedChapter || 'start'];
  if (
    Object.hasOwn(movedGuides, requestedChapter || 'start') &&
    Object.hasOwn(from, guide ?? '')
  )
    resolved = from[guide];
  const retired = retiredDetails[requestedChapter]?.[detail];
  if (retired) {
    [resolved, requestedStep, detail] = [
      retired[0],
      retired[1] ?? requestedStep,
      retired[2],
    ];
  }
  const chapter = Object.hasOwn(chapters, resolved) ? resolved : 'start';
  const steps = chapterSteps(chapter);
  const step = steps.includes(requestedStep) ? requestedStep : steps[0] || '';
  const seconds = Number(params.get('t'));
  let claim = selectionIndex(params.get('claim'));
  let hop = selectionIndex(params.get('hop'));
  if (claim !== null && hop !== null) {
    claim = null;
    hop = null;
  }
  return {
    chapter,
    step,
    detail,
    claim,
    hop,
    guide,
    episode: params.get('episode'),
    time:
      params.has('t') && Number.isFinite(seconds) && seconds >= 0
        ? seconds
        : null,
  };
}

export function routeHref(chapter, step = '', detail = null, selection = {}) {
  const params = new URLSearchParams();
  if (detail) params.set('detail', detail);
  const claim = selectionIndex(selection.claim?.toString());
  const hop = selectionIndex(selection.hop?.toString());
  if (claim === null || hop === null) {
    if (detail && claim !== null) params.set('claim', claim);
    if (hop !== null) params.set('hop', hop);
  }
  const query = params.toString();
  return `#${chapter}${step ? `/${step}` : ''}${query ? `?${query}` : ''}`;
}
