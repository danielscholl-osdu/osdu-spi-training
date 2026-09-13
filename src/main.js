import { chapters } from './content/chapters.js';
import { componentDetails } from './content/component-details.js';
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
  hasClaims,
  claimStrip,
  guidePreview,
  detailSourceLinks,
  resolveExamplePresentation,
  resolveLessonSelection,
  selectExampleVariant,
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

const movable = [
  'chapter-listen',
  'chapter-guides',
  'chapter-outcomes',
  'next-link',
  'scope-note',
  'source-details',
].map((id) => {
  const element = document.getElementById(id);
  const marker = document.createComment(id);
  element.before(marker);
  return { element, marker };
});
let lessonState = {
  claim: 0,
  hop: -1,
  policy: 'learn',
  exampleOpen: false,
  variant: 'normal',
};

function applyExamplePresentation(chapter, tracing) {
  const presentation = resolveExamplePresentation(
    chapter.example,
    lessonState.variant,
  );
  const strip = document.getElementById('example-strip');
  strip
    .querySelectorAll('[data-example-variant]')
    .forEach((button) =>
      button.setAttribute(
        'aria-pressed',
        String(button.dataset.exampleVariant === presentation.selectedVariant),
      ),
    );
  presentation.hops.forEach((hop, index) => {
    const link = strip.querySelector(`[data-hop="${index}"]`);
    if (!link) return;
    link.title = hop.copy;
    link.setAttribute('aria-label', `${index + 1}. ${hop.label}: ${hop.copy}`);
    const copy = link.querySelector('[data-hop-copy]');
    if (copy) copy.textContent = hop.copy;
  });
  const note = strip.querySelector('[data-example-note]');
  if (note) note.textContent = presentation.note;
  const exampleCrossing = strip.querySelector('[data-example-crossing]');
  if (exampleCrossing) exampleCrossing.textContent = presentation.crossing;
  document
    .getElementById('diagram')
    .querySelectorAll('[data-trace-status]')
    .forEach((status) => {
      const index = presentation.hops.findIndex(
        (hop) => hop.detail === status.dataset.traceStatus,
      );
      const hop = presentation.hops[index];
      const visible =
        tracing && index >= 0 && index <= lessonState.hop && hop?.mapStatus;
      status.hidden = !visible;
      status.textContent = visible ? hop.mapStatus : '';
      if (visible && hop.state) status.dataset.traceState = hop.state;
      else delete status.dataset.traceState;
    });
  return presentation;
}

function applyPolicy() {
  const route = parseRoute(location.hash);
  const chapter = chapters[route.chapter];
  if (!hasClaims(chapter)) return;
  const claim = chapter.outcomes[lessonState.claim];
  const tracing = lessonState.hop >= 0;
  const presentation = applyExamplePresentation(chapter, tracing);
  const focus = new Set(
    tracing
      ? presentation.hops.slice(0, lessonState.hop + 1).map((hop) => hop.detail)
      : claim.focus || [],
  );
  const scopes = new Set(
    tracing ? presentation.scopes || [] : claim.scopes || [],
  );
  const diagram = document.getElementById('diagram');
  diagram.dataset.policy = lessonState.policy;
  diagram
    .querySelectorAll('.path-emphasis')
    .forEach((node) => node.classList.remove('path-emphasis'));
  diagram.querySelectorAll('.node').forEach((node) => {
    const active = focus.has(node.dataset.detail);
    node.classList.toggle('is-focus', active);
    node.classList.toggle('is-receded', !active);
    node.classList.toggle('is-path', tracing && active);
    node.classList.toggle('is-traced', tracing && active);
  });
  diagram
    .querySelectorAll('[data-detail]')
    .forEach((node) =>
      node.classList.toggle(
        'is-evidence',
        !tracing && node.dataset.detail === claim.evidence,
      ),
    );
  diagram
    .querySelectorAll('[data-scope]')
    .forEach((scope) =>
      scope.classList.toggle('is-focus-scope', scopes.has(scope.dataset.scope)),
    );
  document
    .querySelectorAll('[data-claim]')
    .forEach((button) =>
      button.setAttribute(
        'aria-pressed',
        String(!tracing && Number(button.dataset.claim) === lessonState.claim),
      ),
    );
  document
    .querySelectorAll('#map-policy [data-policy]')
    .forEach((button) =>
      button.setAttribute(
        'aria-pressed',
        String(button.dataset.policy === lessonState.policy),
      ),
    );
  document.querySelectorAll('[data-hop]').forEach((link) => {
    const index = Number(link.dataset.hop);
    link.parentElement.classList.toggle(
      'is-done',
      tracing && index < lessonState.hop,
    );
    link.parentElement.classList.toggle(
      'is-current',
      tracing && index === lessonState.hop,
    );
    if (tracing && index === lessonState.hop)
      link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
  const crossing = diagram.querySelector(
    '.boundary-crossing span, [data-trace-crossing]',
  );
  const crossingLabel = tracing ? presentation.crossing : claim.crossing;
  if (crossing && typeof crossingLabel === 'string')
    crossing.textContent = crossingLabel;
}

let detailOpener = null;
let pendingOpener = null;
function expandInspector(expanded, { focus = true } = {}) {
  inspector.classList.toggle('is-expanded', expanded);
  inspector.inert = !expanded;
  inspector.setAttribute('aria-hidden', String(!expanded));
  document
    .getElementById('detail-toggle')
    .setAttribute('aria-expanded', String(expanded));
  if (expanded) {
    // Keep the overlay near the visible part of a tall map without scrolling
    // the page, and inside the workspace, which clips overflow.
    const workspace = inspector.parentElement.getBoundingClientRect();
    inspector.style.setProperty('--drawer-max', `${workspace.height}px`);
    const top = Math.min(
      Math.max(0, 84 - workspace.top),
      Math.max(0, workspace.height - inspector.offsetHeight),
    );
    inspector.style.setProperty('--drawer-top', `${top}px`);
    if (focus)
      document.getElementById('detail-title').focus({ preventScroll: true });
  }
}
function closeInspector(restoreFocus = true) {
  const wasOpen = inspector.classList.contains('is-expanded');
  expandInspector(false);
  const opener = detailOpener?.isConnected ? detailOpener : lastSelectedElement;
  if (wasOpen && restoreFocus) opener?.focus({ preventScroll: true });
  const route = parseRoute(location.hash);
  if (route.detail) {
    history.replaceState(null, '', routeHref(route.chapter, route.step));
    previousRoute = { ...route, detail: null, claim: null, hop: null };
  }
  document
    .querySelectorAll('[data-detail]')
    .forEach((button) => button.setAttribute('aria-pressed', 'false'));
  document
    .querySelectorAll('.selected-scope')
    .forEach((scope) => scope.classList.remove('selected-scope'));
  delete document.getElementById('diagram').dataset.selected;
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
    element?.querySelector('b')?.textContent ||
    element?.querySelector('span')?.textContent ||
    detail?.title ||
    id;
  document.getElementById('detail-what').textContent =
    element?.querySelector('small')?.textContent || '';
  const body = detail?.body || '';
  const first = body.match(/^.*?[.!?](?=\s|$)/s)?.[0] || body;
  document.getElementById('detail-copy').textContent =
    `${detail?.title || ''} ${first}`;
  const rest = body.slice(first.length).trim();
  const more = document.getElementById('detail-more');
  more.hidden = !rest;
  more.open = false;
  document.getElementById('detail-more-copy').textContent = rest;
  document.getElementById('artifact-label').textContent =
    detail?.artifact?.label || '';
  document.getElementById('artifact-code').textContent =
    detail?.artifact?.code || '';
  document.getElementById('detail-artifact').hidden = !detail;
  const sourceMarkup = detailSourceLinks(detail);
  const link = document.getElementById('detail-source');
  link.hidden = !sourceMarkup;
  link.innerHTML = sourceMarkup;
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
    return n === learnOrder.length - 1 ? 'start' : learnOrder[n + 1];
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
  const structured = hasClaims(scene);
  movable.forEach(({ element, marker }) => marker.after(element));
  document.getElementById('lesson-next')?.remove();
  lessonState = {
    claim: 0,
    hop: -1,
    policy: 'learn',
    exampleOpen: false,
    variant: scene.example?.defaultVariant || 'normal',
  };
  document.body.classList.toggle('has-claims', structured);
  delete document.getElementById('diagram').dataset.policy;
  document.getElementById('chapter-claims').innerHTML = claimStrip(key);
  document.getElementById('lesson-optional').hidden = !structured;
  document.getElementById('map-policy').hidden = !structured;
  document.getElementById('map-hint').hidden = structured;
  if (structured) {
    document
      .getElementById('optional-listen')
      .append(document.getElementById('chapter-listen'));
    document
      .getElementById('optional-guides')
      .append(document.getElementById('chapter-guides'));
    document
      .getElementById('optional-sources')
      .append(
        document.getElementById('source-details'),
        document.getElementById('scope-note'),
      );
    document
      .getElementById('chapter-mistake')
      .after(document.getElementById('chapter-outcomes'));
    const nextBlock = document.createElement('div');
    nextBlock.id = 'lesson-next';
    nextBlock.className = 'lesson-next';
    nextBlock.innerHTML = `<span>${chapters[nextChapter(key)].question}</span>`;
    nextBlock.append(document.getElementById('next-link'));
    document.getElementById('chapter-outcomes').after(nextBlock);
  }
  document.getElementById('chapter-navigation').innerHTML =
    chapterNavigation(key);
  const kicker =
    scene.group === 'learn'
      ? `${String(learnOrder.indexOf(key) + 1).padStart(2, '0')} · ${scene.title}`
      : scene.title;
  document.getElementById('chapter-kicker').textContent = structured
    ? `Lesson ${positionLabel(key)}`
    : kicker;
  document.getElementById('rail-current').textContent = kicker;
  setRailOpen(false);
  document.getElementById('premise').textContent = scene.premise || '';
  document.getElementById('premise').hidden = structured || !scene.premise;
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
  document.getElementById('source-details').open = structured;
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
    expandInspector(false);
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
    if (chapterChanged && previousRoute) focusChapter();
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
        hasClaims(scene)
          ? guidePreview(guide)
          : suppliedPosters.some((poster) => poster.id === guide)
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
  const buttons = [...document.querySelectorAll('#diagram [data-detail]')];
  const element = buttons.find(
    (button) => button.dataset.detail === route.detail,
  );
  if (element) {
    selectDetail(element.dataset.detail, element);
  } else {
    expandInspector(false);
    buttons.forEach((button) => button.setAttribute('aria-pressed', 'false'));
    document
      .querySelectorAll('.selected-scope')
      .forEach((scope) => scope.classList.remove('selected-scope'));
    delete document.getElementById('diagram').dataset.selected;
  }
  const strip = document.getElementById('example-strip');
  const structured = hasClaims(scene);
  const selection = structured ? resolveLessonSelection(scene, route) : null;
  const requestedOpener = pendingOpener;
  const openerHop = requestedOpener?.dataset.hop;
  const openerWasLookCloser = requestedOpener?.hasAttribute('data-look-closer');
  if (!hasClaims(scene) || mapChanged) {
    strip.innerHTML = exampleStrip(
      route.chapter,
      {
        ...route,
        detail: element?.dataset.detail || null,
      },
      lessonState.variant,
    );
    strip.hidden = !strip.innerHTML;
  }
  if (structured) {
    lessonState.claim = selection.claim;
    lessonState.hop = selection.hop;
    lessonState.exampleOpen = selection.exampleOpen;
    strip.querySelector('details').open = selection.exampleOpen;
    applyPolicy();
  }
  if (element) {
    if (requestedOpener?.isConnected) {
      detailOpener = requestedOpener;
    } else if (openerHop !== undefined) {
      detailOpener =
        strip.querySelector(`[data-hop="${openerHop}"]`) || element;
    } else if (openerWasLookCloser) {
      detailOpener =
        document.querySelector('#diagram [data-look-closer]') || element;
    } else if (selection?.hop >= 0) {
      detailOpener =
        strip.querySelector(`[data-hop="${selection.hop}"]`) || element;
    } else {
      const evidence = document.querySelector(
        `#chapter-claims [data-evidence="${selection?.claim}"]`,
      );
      const evidenceRoute = evidence
        ? parseRoute(evidence.getAttribute('href'))
        : null;
      detailOpener =
        evidenceRoute?.detail === route.detail &&
        evidenceRoute.step === route.step
          ? evidence
          : element;
    }
  }
  pendingOpener = null;
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
  }
  jumpRequested = false;
  if (chapterChanged) {
    if (previousRoute) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      focusChapter();
    }
  }
  // A chapter change keeps focus on the headline; the drawer opens beside it.
  if (element)
    expandInspector(true, { focus: !(chapterChanged && previousRoute) });
  previousRoute = route;
}

// The rail is re-rendered on every chapter change, which drops keyboard focus
// to the body. Move it to the new chapter's headline so Tab continues from
// the content rather than restarting at the rail.
function focusChapter() {
  document.getElementById('headline').focus({ preventScroll: true });
}
document.getElementById('skip-link').addEventListener('click', (event) => {
  event.preventDefault();
  focusChapter();
});

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
function isModifiedClick(event) {
  return (
    event.button ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}

document.addEventListener('click', (event) => {
  // A modified click opens a new tab or window; leave the lesson state alone.
  if (isModifiedClick(event)) return;
  const variant = event.target.closest('[data-example-variant]');
  if (variant) {
    const route = parseRoute(location.hash);
    const example = chapters[route.chapter].example;
    lessonState = selectExampleVariant(
      lessonState,
      variant.dataset.exampleVariant,
      example.hops.length,
    );
    applyPolicy();
    return;
  }
  const hop = event.target.closest('[data-hop]');
  if (hop) {
    lessonState.hop = Number(hop.dataset.hop);
    lessonState.policy = 'learn';
    lessonState.exampleOpen = true;
  }
  const lookCloser = event.target.closest('a[data-look-closer]');
  if (lookCloser) {
    pendingOpener = lookCloser;
    if (lookCloser.hash === location.hash) {
      event.preventDefault();
      render();
    }
  }
  const link = event.target.closest('a[data-map-jump]');
  if (link) {
    if (!hop && hasClaims(chapters[parseRoute(location.hash).chapter]))
      lessonState.hop = -1;
    jumpRequested = true;
    pendingOpener = link;
    if (link.hash === location.hash) {
      event.preventDefault();
      render();
    }
  }
});

document.getElementById('chapter-claims').addEventListener('click', (event) => {
  const evidence = event.target.closest('[data-evidence]');
  const button = event.target.closest('[data-claim]');
  if (!evidence && !button) return;
  if (evidence && isModifiedClick(event)) return;
  event.preventDefault();
  const index = Number(evidence?.dataset.evidence ?? button.dataset.claim);
  const repeat =
    index === lessonState.claim &&
    lessonState.hop < 0 &&
    !inspector.classList.contains('is-expanded');
  lessonState.claim = index;
  lessonState.hop = -1;
  lessonState.policy = 'learn';
  if (evidence || repeat) {
    const route = parseRoute(location.hash);
    const claim = chapters[route.chapter].outcomes[index];
    const id = claim.evidence;
    const step = claim.evidenceStep || claim.step || route.step;
    pendingOpener = evidence || button;
    const href = routeHref(route.chapter, step, id, { claim: index });
    if (location.hash === href) render();
    else location.hash = href;
    return;
  }
  closeInspector(false);
  const route = parseRoute(location.hash);
  const claim = chapters[route.chapter].outcomes[index];
  if (claim.step) {
    const href = routeHref(route.chapter, claim.step);
    if (location.hash === href) render();
    else location.hash = href;
    return;
  }
  applyPolicy();
});
document.getElementById('map-policy').addEventListener('click', (event) => {
  const button = event.target.closest('[data-policy]');
  if (!button) return;
  lessonState.policy = button.dataset.policy;
  if (lessonState.policy === 'explore') lessonState.hop = -1;
  applyPolicy();
});

document.getElementById('diagram').addEventListener('click', (event) => {
  const button = event.target.closest('button[data-detail]');
  if (!button) return;
  lessonState.hop = -1;
  pendingOpener = button;
  const route = parseRoute(location.hash);
  const selection = hasClaims(chapters[route.chapter])
    ? { claim: lessonState.claim }
    : {};
  const href = routeHref(
    route.chapter,
    route.step,
    button.dataset.detail,
    selection,
  );
  if (location.hash === href) render();
  else location.hash = href;
});
document
  .getElementById('detail-toggle')
  .addEventListener('click', () => closeInspector());

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
    closeInspector();
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
