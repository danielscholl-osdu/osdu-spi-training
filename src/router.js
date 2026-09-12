import { chapters } from './content/chapters.js';
import { creationMoments } from './content/creation-moments.js';

export function parseRoute(hash) {
  const [path = '', query = ''] = hash.replace(/^#/, '').split('?');
  const [requestedChapter, requestedStep] = path.split('/');
  const chapter = Object.hasOwn(chapters, requestedChapter)
    ? requestedChapter
    : 'running-stack';
  const steps =
    chapter === 'bring-up'
      ? creationMoments.map((moment) => moment.id)
      : chapter === 'running-stack'
        ? ['developer', 'request']
        : [];
  const step = steps.includes(requestedStep) ? requestedStep : steps[0] || '';
  return { chapter, step, detail: new URLSearchParams(query).get('detail') };
}

export function routeHref(chapter, step = '', detail = null) {
  return `#${chapter}${step ? `/${step}` : ''}${detail ? `?detail=${encodeURIComponent(detail)}` : ''}`;
}
