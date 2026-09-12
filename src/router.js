import { chapters } from './content/chapters.js';
import { creationMoments } from './content/creation-moments.js';
import { forkMoments } from './content/fork-moments.js';

// Route keys that were published and later split or renamed keep resolving.
export const chapterAliases = { 'engineering-system': 'handshake' };

export function chapterSteps(chapter) {
  if (chapter === 'bring-up') return creationMoments.map((moment) => moment.id);
  if (chapter === 'fork-day') return forkMoments.map((moment) => moment.id);
  if (chapter === 'running-stack') return ['developer', 'request'];
  return [];
}

export function parseRoute(hash) {
  const [path = '', query = ''] = hash.replace(/^#/, '').split('?');
  const [requestedChapter, requestedStep] = path.split('/');
  const resolved = chapterAliases[requestedChapter] || requestedChapter;
  const chapter = Object.hasOwn(chapters, resolved) ? resolved : 'start';
  const steps = chapterSteps(chapter);
  const step = steps.includes(requestedStep) ? requestedStep : steps[0] || '';
  const params = new URLSearchParams(query);
  const seconds = Number(params.get('t'));
  return {
    chapter,
    step,
    detail: params.get('detail'),
    guide: params.get('guide'),
    time:
      params.has('t') && Number.isFinite(seconds) && seconds >= 0
        ? seconds
        : null,
  };
}

export function routeHref(chapter, step = '', detail = null) {
  return `#${chapter}${step ? `/${step}` : ''}${detail ? `?detail=${encodeURIComponent(detail)}` : ''}`;
}
