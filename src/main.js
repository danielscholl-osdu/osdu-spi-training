import { chapters } from './content/chapters.js';
import { componentDetails } from './content/component-details.js';
import { creationMoments } from './content/creation-moments.js';
import { forkMoments } from './content/fork-moments.js';
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
  listenChips,
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

// On wide screens the sticky inspector can be pushed above the fold when the
// selected control sits near the bottom of a tall map. Nudge the page so the
// top of the explanation, where the state repeats, is visible while the
// control stays on screen.
function revealInspector(element) {
  if (getComputedStyle(inspector).position !== 'sticky') return;
  const top = inspector.getBoundingClientRect().top - 84;
  const slack =
    window.innerHeight - 24 - element.getBoundingClientRect().bottom;
  if (top < 0 && slack > 0)
    window.scrollBy({ top: Math.max(top, -slack), behavior: 'instant' });
}

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
  document.getElementById('diagram').dataset.selected = id;
  // The seam's state panel can sit above the fold; repeat its lock and pod
  // for the selected step where the explanation opens.
  const state = document.querySelector(`.seam-state[data-for~="${id}"]`);
  const compact = document.getElementById('detail-state');
  compact.hidden = !state;
  compact.innerHTML = state
    ? [...state.querySelectorAll('.state-obj')]
        .map((object) => object.outerHTML)
        .join('')
    : '';
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
    return `${learnOrder.indexOf(key) + 1} of ${learnOrder.length} · ${scene.book}`;
  return scene.group === 'supplement'
    ? 'Supplement'
    : 'OSDU Azure SPI Fieldnotes';
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
  document.getElementById('chapter-listen').innerHTML = listenChips(key);
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
  document.title = `${scene.title} · OSDU Azure SPI Fieldnotes`;
  if (chapterChanged) renderChapterFrame(route, scene);

  if (scene.kind === 'page') {
    document.getElementById('exploration').hidden = true;
    document.getElementById('chapter-listen').innerHTML = '';
    document.getElementById('chapter-guides').innerHTML = '';
    document.getElementById('chapter-mistake').innerHTML = '';
    document.getElementById('example-strip').hidden = true;
    const page = document.getElementById('page');
    page.hidden = false;
    const episodeChanged =
      scene.page === 'listen' && previousRoute?.episode !== route.episode;
    if (chapterChanged || episodeChanged) {
      if (scene.page === 'listen' && route.episode)
        player.select(route.episode);
      page.innerHTML = pageRenderers[scene.page](
        scene.page === 'listen'
          ? { ...route, episode: player.episode.id }
          : route,
      );
      player.reflect();
    }
    // A timestamp in the hash seeks whether or not the page re-rendered;
    // a bare #listen leaves the current position alone.
    if (
      scene.page === 'listen' &&
      route.time !== null &&
      (chapterChanged || episodeChanged || previousRoute?.time !== route.time)
    )
      player.seekTo(route.time, false);
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
      : route.chapter === 'fork-day'
        ? forkMoments.find((moment) => moment.id === route.step).detail
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
    revealInspector(element);
  }
  jumpRequested = false;
  if (chapterChanged) {
    expandInspector(false);
    if (previousRoute) window.scrollTo({ top: 0, behavior: 'instant' });
  }
  previousRoute = route;
}

// The what-if switch in 04 swaps each affected cell's text and accessible
// name together, so the table and its screen-reader reading agree.
document.addEventListener('change', (event) => {
  const toggle = event.target.closest('.what-if-switch');
  if (!toggle) return;
  const map = toggle.closest('.tree-map');
  map.dataset.whatIf = String(toggle.checked);
  map.querySelectorAll('.has-after').forEach((cell) => {
    const after = toggle.checked;
    cell.querySelector('span').textContent = after
      ? cell.dataset.after
      : cell.dataset.now;
    cell.setAttribute(
      'aria-label',
      after ? cell.dataset.afterLabel : cell.dataset.nowLabel,
    );
  });
});

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
  revealInspector(button);
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
