import { chapters } from './content/chapters.js';
import { creationMoments } from './content/creation-moments.js';

export function parseRoute(hash) {
  const [path = '', query = ''] = hash.replace(/^#/, '').split('?');
  const [requestedChapter, requestedStep] = path.split('/');
  const chapter = Object.hasOwn(chapters, requestedChapter)
    ? requestedChapter
    : 'start';
  const steps =
    chapter === 'bring-up'
      ? creationMoments.map((moment) => moment.id)
      : chapter === 'running-stack'
        ? ['developer', 'request']
        : [];
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
