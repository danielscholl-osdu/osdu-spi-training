import { chapters } from './content/chapters.js';
import { componentDetails } from './content/component-details.js';
import { creationMoments } from './content/creation-moments.js';
import { sources } from './content/sources.js';
import { suppliedPosters } from './content/posters.js';
import { diagramRenderers } from './components/diagrams.js';
import {
  pageRenderers,
  chapterNavigation,
  guideFigure,
  posterInline,
  chapterOutcomes,
  chapterScope,
  mythCallout,
  exampleStrip,
} from './components/pages.js';
import { createPlayer } from './components/player.js';
import { parseRoute, routeHref } from './router.js';

const order = Object.keys(chapters);
const learnOrder = order.filter((key) => chapters[key].group === 'learn');
let previousRoute = null;
let lastSelectedElement = null;
const inspector = document.getElementById('inspector');
const player = createPlayer(
  document.getElementById('deep-dive'),
  document.getElementById('audio-dock'),
);

function expandInspector(expanded) {
  inspector.classList.toggle('is-expanded', expanded);
  document
    .getElementById('detail-toggle')
    .setAttribute('aria-expanded', String(expanded));
  document.getElementById('detail-toggle').textContent = expanded
    ? 'Close explanation ↓'
    : 'Read explanation ↑';
}

export function selectDetail(id, element = null) {
  const detail = Object.hasOwn(componentDetails, id)
    ? componentDetails[id]
    : null;
  document
    .querySelectorAll('[data-detail]')
    .forEach((button) =>
      button.setAttribute('aria-pressed', String(button === element)),
    );
  document
    .querySelectorAll('[data-scope]')
    .forEach((scope) =>
      scope.classList.toggle(
        'selected-scope',
        Boolean(element) && scope.dataset.scope === id,
      ),
    );
  document.getElementById('detail-label').textContent =
    detail?.label || 'Explanation unavailable';
  document.getElementById('detail-title').textContent =
    detail?.title || 'This component needs an explanation.';
  document.getElementById('detail-copy').textContent =
    detail?.body ||
    'The rest of this chapter is still available. Choose another component to continue exploring.';
  document.getElementById('artifact-label').textContent =
    detail?.artifact?.label || '';
  document.getElementById('artifact-code').textContent =
    detail?.artifact?.code || '';
  document.getElementById('detail-artifact').hidden = !detail;
  const source = detail && sources[detail.source];
  const link = document.getElementById('detail-source');
  link.hidden = !source;
  if (source) {
    link.href = source.href;
    link.textContent = `${source.label} ↗`;
  }
  lastSelectedElement = element;
}

function nextChapter(key) {
  const scene = chapters[key];
  if (key === 'start') return learnOrder[0];
  if (scene.group === 'learn') {
    const n = learnOrder.indexOf(key);
    return n === learnOrder.length - 1 ? 'listen' : learnOrder[n + 1];
  }
  return key === 'listen' ? 'field-guides' : 'start';
}

function positionLabel(key) {
  const scene = chapters[key];
  if (scene.group === 'learn')
    return `${learnOrder.indexOf(key) + 1} of ${learnOrder.length} · The Azure SPI Stack`;
  return scene.group === 'supplement' ? 'Supplement' : 'OSDU Fieldnotes';
}

function renderChapterFrame(route, scene) {
  const key = route.chapter;
  document.getElementById('chapter-navigation').innerHTML =
    chapterNavigation(key);
  const kicker =
    scene.group === 'learn'
      ? `${String(learnOrder.indexOf(key) + 1).padStart(2, '0')} · ${scene.title}`
      : scene.title;
  document.getElementById('chapter-kicker').textContent = kicker;
  document.getElementById('rail-current').textContent = kicker;
  setRailOpen(false);
  document.getElementById('premise').textContent = scene.premise || '';
  document.getElementById('premise').hidden = !scene.premise;
  document.getElementById('headline').innerHTML = scene.headline;
  document.getElementById('introduction').textContent = scene.intro;
  document.getElementById('scope-note').textContent = scene.scope || '';
  document.getElementById('scope-note').hidden = !scene.scope;
  document.getElementById('sources').innerHTML = scene.sources
    .map(
      (sourceKey) =>
        `<a href="${sources[sourceKey].href}" target="_blank" rel="noopener noreferrer">${sources[sourceKey].label} ↗</a>`,
    )
    .join('');
  document.getElementById('source-details').open = false;
  document.getElementById('chapter-position').textContent = positionLabel(key);
  const next = nextChapter(key);
  const link = document.getElementById('next-link');
  link.href = routeHref(next);
  link.textContent =
    next === 'start'
      ? 'Back to the start ↺'
      : `Next: ${chapters[next].title} →`;
  document.getElementById('view-scope').innerHTML = chapterScope(key);
  document.getElementById('chapter-outcomes').innerHTML = chapterOutcomes(key);
  document.body.dataset.page = scene.kind === 'page' ? scene.page : 'map';
}

function forStep(value, route) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value[route.step] || []].flat();
}

function render() {
  const route = parseRoute(location.hash);
  const scene = chapters[route.chapter];
  const chapterChanged = previousRoute?.chapter !== route.chapter;
  const mapChanged = chapterChanged || previousRoute?.step !== route.step;
  const focusedKey = document.activeElement?.dataset.routeKey;
  document.title = `${scene.title} · OSDU Fieldnotes`;
  if (chapterChanged) renderChapterFrame(route, scene);

  if (scene.kind === 'page') {
    document.getElementById('exploration').hidden = true;
    document.getElementById('chapter-guides').innerHTML = '';
    document.getElementById('chapter-mistake').innerHTML = '';
    document.getElementById('example-strip').hidden = true;
    const page = document.getElementById('page');
    page.hidden = false;
    if (chapterChanged) {
      page.innerHTML = pageRenderers[scene.page](route);
      if (scene.page === 'listen' && route.time !== null)
        player.seekTo(route.time, false);
      player.reflect();
    }
    if (route.guide) {
      document
        .getElementById(`guide-${route.guide}`)
        ?.scrollIntoView({ block: 'start' });
    } else if (chapterChanged && previousRoute) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    previousRoute = route;
    return;
  }

  document.getElementById('page').hidden = true;
  document.getElementById('page').innerHTML = '';
  document.getElementById('exploration').hidden = false;
  if (chapterChanged) {
    document.getElementById('figure-title').textContent = scene.figure;
  }
  if (mapChanged) {
    document.getElementById('chapter-guides').innerHTML = forStep(
      scene.guides,
      route,
    )
      .map((guide) =>
        suppliedPosters.some((poster) => poster.id === guide)
          ? posterInline(guide)
          : guideFigure(guide, { compact: true }),
      )
      .join('');
    document.getElementById('chapter-mistake').innerHTML = forStep(
      scene.mistakes,
      route,
    )
      .map((id) => mythCallout(id, route.chapter))
      .join('');
  }
  if (mapChanged) {
    document.getElementById('diagram').innerHTML =
      diagramRenderers[scene.diagram](route);
    if (focusedKey && !chapterChanged) {
      [...document.querySelectorAll('[data-route-key]')]
        .find((element) => element.dataset.routeKey === focusedKey)
        ?.focus({ preventScroll: true });
    }
  }
  const defaultDetail =
    route.chapter === 'bring-up'
      ? creationMoments.find((moment) => moment.id === route.step).detail
      : route.chapter === 'running-stack' && route.step === 'request'
        ? 'client'
        : scene.selected;
  const buttons = [...document.querySelectorAll('[data-detail]')];
  const element =
    buttons.find((button) => button.dataset.detail === route.detail) ||
    buttons.find((button) => button.dataset.detail === defaultDetail);
  selectDetail(element?.dataset.detail || defaultDetail, element);
  const strip = document.getElementById('example-strip');
  strip.innerHTML = exampleStrip(route.chapter, {
    ...route,
    detail: element?.dataset.detail || defaultDetail,
  });
  strip.hidden = !strip.innerHTML;
  const traced = new Set(
    [...strip.querySelectorAll('.is-done a, .is-current a')].map(
      (link) => parseRoute(link.getAttribute('href')).detail,
    ),
  );
  buttons.forEach((button) =>
    button.classList.toggle('is-traced', traced.has(button.dataset.detail)),
  );
  // Only a link that says it moves the page (data-map-jump) scrolls the map
  // into view. Every other same-view change updates the selection in place.
  if (jumpRequested && element) {
    element.scrollIntoView({ block: 'center' });
    element.focus({ preventScroll: true });
    expandInspector(true);
  }
  jumpRequested = false;
  if (chapterChanged) {
    expandInspector(false);
    if (previousRoute) window.scrollTo({ top: 0, behavior: 'instant' });
  }
  previousRoute = route;
}

let jumpRequested = false;
document.addEventListener('click', (event) => {
  if (event.target.closest('a[data-map-jump]')) jumpRequested = true;
});

document.getElementById('diagram').addEventListener('click', (event) => {
  const button = event.target.closest('button[data-detail]');
  if (!button) return;
  const route = parseRoute(location.hash);
  const href = routeHref(route.chapter, route.step, button.dataset.detail);
  if (location.hash === href) selectDetail(button.dataset.detail, button);
  else location.hash = href;
  expandInspector(true);
});
document
  .getElementById('detail-toggle')
  .addEventListener('click', () =>
    expandInspector(!inspector.classList.contains('is-expanded')),
  );

const lightbox = document.getElementById('lightbox');
document.addEventListener('click', (event) => {
  const opener = event.target.closest('[data-lightbox]');
  if (!opener) return;
  const image = document.getElementById('lightbox-image');
  image.src = opener.dataset.lightbox;
  image.alt = opener.dataset.lightboxTitle;
  document.getElementById('lightbox-title').textContent =
    opener.dataset.lightboxTitle;
  lightbox.showModal();
});
document
  .getElementById('lightbox-close')
  .addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && inspector.classList.contains('is-expanded')) {
    expandInspector(false);
    lastSelectedElement?.focus({ preventScroll: true });
  }
});
function setRailOpen(open) {
  document.querySelector('.rail').dataset.open = String(open);
  document
    .getElementById('rail-toggle')
    .setAttribute('aria-expanded', String(open));
}
document.getElementById('rail-toggle').addEventListener('click', () => {
  const rail = document.querySelector('.rail');
  setRailOpen(rail.dataset.open !== 'true');
});

window.addEventListener('hashchange', render);
render();
