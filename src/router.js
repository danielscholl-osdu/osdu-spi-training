import { chapters } from './content/chapters.js';
import { creationMoments } from './content/creation-moments.js';
import { forkMoments } from './content/fork-moments.js';

// Route keys that were published and later split or renamed keep resolving.
// A retired chapter maps to a new chapter, and each of its components to the
// component that now carries the same meaning.
export const chapterAliases = { 'engineering-system': 'handshake' };
export const retiredDetails = {
  'engineering-system': {
    repo: ['fork-shape', null, 'main-branch'],
    'stack-source': ['running-stack', 'developer', 'config-source'],
    upstream: ['fork-shape', null, 'upstream'],
    engineering: ['fork-shape', null, 'engineering'],
    image: ['fork-day', 'prove', 'candidate'],
    delivery: ['handshake', null, 'delivery'],
    running: ['handshake', null, 'running'],
    proof: ['handshake', null, 'proof'],
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
    guide: params.get('guide'),
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
  if (detail && (claim === null || hop === null)) {
    if (claim !== null) params.set('claim', claim);
    if (hop !== null) params.set('hop', hop);
  }
  const query = params.toString();
  return `#${chapter}${step ? `/${step}` : ''}${query ? `?${query}` : ''}`;
}
