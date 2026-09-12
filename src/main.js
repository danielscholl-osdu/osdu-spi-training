import { chapters } from './content/chapters.js';
import { componentDetails } from './content/component-details.js';
import { creationMoments } from './content/creation-moments.js';
import { sources } from './content/sources.js';
import { diagramRenderers, ownershipTable } from './components/diagrams.js';
import { parseRoute, routeHref } from './router.js';

const order = Object.keys(chapters);
let previousRoute = null;
let lastSelectedElement = null;
const inspector = document.getElementById('inspector');

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

function render() {
  const route = parseRoute(location.hash);
  const scene = chapters[route.chapter];
  const chapterChanged = previousRoute?.chapter !== route.chapter;
  const mapChanged = chapterChanged || previousRoute?.step !== route.step;
  const focusedKey = document.activeElement?.dataset.routeKey;
  const n = order.indexOf(route.chapter);
  document.title = `${scene.title} · OSDU Fieldnotes`;
  if (chapterChanged) {
    document.getElementById('chapter-navigation').innerHTML = order
      .map(
        (key, index) =>
          `<a href="${routeHref(key)}" class="chapter-link" ${key === route.chapter ? 'aria-current="page"' : ''}><span class="number">${String(index + 1).padStart(2, '0')}</span><span>${chapters[key].title}<small>${chapters[key].subtitle}</small></span></a>`,
      )
      .join('');
    document.getElementById('chapter-kicker').textContent =
      `${String(n + 1).padStart(2, '0')} · ${scene.title}`;
    document.getElementById('premise').textContent = scene.premise || '';
    document.getElementById('premise').hidden = !scene.premise;
    document.getElementById('headline').innerHTML = scene.headline;
    document.getElementById('introduction').textContent = scene.intro;
    document.getElementById('figure-title').textContent = scene.figure;
    document.getElementById('scope-note').textContent = scene.scope;
    document.getElementById('chapter-reference').innerHTML =
      route.chapter === 'running-stack' ? ownershipTable() : '';
    document.getElementById('sources').innerHTML = scene.sources
      .map(
        (key) =>
          `<a href="${sources[key].href}" target="_blank" rel="noopener noreferrer">${sources[key].label} ↗</a>`,
      )
      .join('');
    document.getElementById('source-details').open = false;
    document.getElementById('chapter-position').textContent =
      `${n + 1} of ${order.length} · Inside the Azure stack`;
    const next = document.getElementById('next-link');
    next.href = routeHref(order[(n + 1) % order.length]);
    next.textContent =
      n === order.length - 1
        ? 'Return to the stack ↗'
        : `Next: ${chapters[order[n + 1]].title} →`;
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
  if (chapterChanged) {
    expandInspector(false);
    if (previousRoute) window.scrollTo({ top: 0, behavior: 'instant' });
  }
  previousRoute = route;
}

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
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && inspector.classList.contains('is-expanded')) {
    expandInspector(false);
    lastSelectedElement?.focus({ preventScroll: true });
  }
});
window.addEventListener('hashchange', render);
render();
