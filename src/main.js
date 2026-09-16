// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { chapters } from './content/chapters.js';
import { sources } from './content/sources.js';
import { suppliedPosters } from './content/posters.js';
import { diagramRenderers } from './components/diagrams.js';
import { resolveDetail } from './components/evidence.js';
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
  isLifecycleLesson,
  isStepLesson,
  claimStrip,
  claimStatements,
  claimContext,
  guidePreview,
  guidesPreview,
  detailSourceLinks,
  hopIndexForRoute,
  partitionComparison,
  resolveExamplePresentation,
  resolveLessonSelection,
  selectExampleVariant,
  tryItBand,
  frameVideoPlayer,
  shelfRow,
  sourcesPreview,
} from './components/pages.js';
import { frameVideo } from './content/audio.js';
import { badge } from './components/badges.js';
import { escapeHtml } from './components/node.js';
import { createPlayer } from './components/player.js';
import { creationMoments } from './content/creation-moments.js';
import { parseRoute, routeHref } from './router.js';
import { applyTryItShell, detectTryItShell } from './try-it-shell.js';

// Kept only in memory for this page visit, across lesson navigation.
let tryItShell = detectTryItShell(navigator);

const order = Object.keys(chapters);
const learnOrder = order.filter((key) => chapters[key].group === 'learn');
let previousRoute = null;
let previousHash = null;
let lastSelectedElement = null;
const inspector = document.getElementById('inspector');
const mastheadLinks = document.querySelectorAll('.masthead-nav a');
const masthead = document.querySelector('.masthead');
function syncMastheadHeight() {
  document.documentElement.style.setProperty(
    '--masthead-height',
    `${masthead.offsetHeight}px`,
  );
}
syncMastheadHeight();
new ResizeObserver(syncMastheadHeight).observe(masthead);
const player = createPlayer(
  document.getElementById('deep-dive'),
  document.getElementById('audio-dock'),
);

const movable = [
  'chapter-claims',
  'chapter-listen',
  'chapter-guides',
  'chapter-outcomes',
  'chapter-try-it',
  'example-strip',
  'next-link',
  'scope-note',
  'source-details',
  'lesson-optional',
].map((id) => {
  const element = document.getElementById(id);
  const marker = document.createComment(id);
  element.before(marker);
  return { element, marker };
});
let lessonState = {
  claim: 0,
  hop: -1,
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

function applyFocus() {
  const route = parseRoute(location.hash);
  const chapter = chapters[route.chapter];
  if (!hasClaims(chapter)) return;
  const claim = chapter.outcomes[lessonState.claim];
  const stepped = isStepLesson(chapter);
  const tracing = lessonState.hop >= 0 && !stepped;
  const presentation = applyExamplePresentation(chapter, tracing);
  const step = stepped ? presentation.hops[lessonState.hop] || null : null;
  // A lifecycle lesson is driven by its stage: nothing recedes, and the
  // stage's own evidence component carries the Inspect affordance. A step
  // lesson recedes only once a step is selected.
  const stage = isLifecycleLesson(chapter)
    ? creationMoments.find((moment) => moment.id === route.step)
    : null;
  const staged = Boolean(stage) && !tracing;
  const settled = staged || (stepped && !step);
  const focus = new Set(
    step
      ? [step.detail]
      : tracing
        ? presentation.hops
            .slice(0, lessonState.hop + 1)
            .map((hop) => hop.detail)
        : stepped
          ? []
          : claim.focus || [],
  );
  const scopes = new Set(
    tracing
      ? presentation.scopes || []
      : settled || stepped
        ? []
        : claim.scopes || [],
  );
  const evidenceId = step
    ? step.detail
    : staged
      ? stage.detail
      : stepped
        ? null
        : claim.evidence;
  const diagram = document.getElementById('diagram');
  diagram.dataset.focus = '';
  diagram
    .querySelectorAll('.path-emphasis')
    .forEach((node) => node.classList.remove('path-emphasis'));
  diagram.querySelectorAll('.node').forEach((node) => {
    const active = focus.has(node.dataset.detail);
    node.classList.toggle('is-focus', !settled && active);
    node.classList.toggle('is-receded', !settled && !active);
    node.classList.toggle('is-path', tracing && active);
    node.classList.toggle('is-traced', tracing && active);
  });
  diagram
    .querySelectorAll('[data-detail]')
    .forEach((node) =>
      node.classList.toggle(
        'is-evidence',
        !tracing && node.dataset.detail === evidenceId,
      ),
    );
  diagram
    .querySelectorAll('[data-scope]')
    .forEach((scope) =>
      scope.classList.toggle('is-focus-scope', scopes.has(scope.dataset.scope)),
    );
  // The seam's state panel follows the selected component when there is one,
  // otherwise the selected step; with neither it shows the canonical image.
  if (stepped) {
    const stateId = diagram.dataset.selected || step?.detail || null;
    const states = [...diagram.querySelectorAll('.seam-state')];
    const current = states.filter((state) =>
      state.dataset.for.split(' ').includes(stateId),
    );
    states.forEach((state) =>
      state.classList.toggle(
        'is-current',
        current.length ? current.includes(state) : state === states[0],
      ),
    );
  }
  document
    .querySelectorAll('[data-claim]')
    .forEach((button) =>
      button.setAttribute(
        'aria-pressed',
        String(!tracing && Number(button.dataset.claim) === lessonState.claim),
      ),
    );
  document
    .querySelectorAll('[data-step]')
    .forEach((button) =>
      button.setAttribute(
        'aria-pressed',
        String(Number(button.dataset.step) === lessonState.hop),
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
  const crossingLabel = tracing
    ? presentation.crossing
    : staged
      ? stage.action
      : stepped
        ? null
        : claim.crossing;
  if (crossing && typeof crossingLabel === 'string')
    crossing.textContent = crossingLabel;
  const context = document.getElementById('claim-context');
  if (step) {
    const line = document.createElement('p');
    line.textContent = step.copy;
    context.replaceChildren(line);
  } else if (tracing) {
    const hop = presentation.hops[lessonState.hop];
    const sentence = document.createElement('p');
    const reason = document.createElement('small');
    sentence.textContent = hop?.label || '';
    reason.textContent = hop?.copy || '';
    context.replaceChildren(sentence, reason);
  } else {
    context.innerHTML =
      staged || stepped ? '' : claimContext(route.chapter, lessonState.claim);
  }
  context.hidden = !context.textContent.trim();
}

let detailOpener = null;
let pendingOpener = null;
function positionInspector() {
  if (window.matchMedia('(max-width: 760px)').matches) return;
  const workspace = inspector.parentElement.getBoundingClientRect();
  const masthead = document.querySelector('.masthead').getBoundingClientRect();
  const topInset = Math.max(12, masthead.bottom + 16);
  const bottomInset = 16;
  const width = Math.min(400, workspace.width * 0.92);
  const maxHeight = Math.min(
    760,
    Math.max(0, window.innerHeight - topInset - bottomInset),
  );
  inspector.style.setProperty(
    '--drawer-right',
    `${Math.max(0, window.innerWidth - workspace.right)}px`,
  );
  inspector.style.setProperty('--drawer-width', `${width}px`);
  inspector.style.setProperty('--drawer-max', `${maxHeight}px`);
  const highestTop = Math.max(
    topInset,
    window.innerHeight - bottomInset - inspector.offsetHeight,
  );
  const top = Math.min(Math.max(workspace.top, topInset), highestTop);
  inspector.style.setProperty('--drawer-top', `${top}px`);
}

function expandInspector(expanded, { focus = true } = {}) {
  inspector.classList.toggle('is-expanded', expanded);
  inspector.inert = !expanded;
  inspector.setAttribute('aria-hidden', String(!expanded));
  document
    .getElementById('detail-toggle')
    .setAttribute('aria-expanded', String(expanded));
  if (expanded) {
    inspector.scrollTop = 0;
    positionInspector();
    if (focus)
      document.getElementById('detail-title').focus({ preventScroll: true });
  }
}
window.addEventListener('resize', () => {
  if (inspector.classList.contains('is-expanded')) positionInspector();
});
function closeInspector(restoreFocus = true) {
  const wasOpen = inspector.classList.contains('is-expanded');
  expandInspector(false);
  const opener = detailOpener?.isConnected ? detailOpener : lastSelectedElement;
  if (wasOpen && restoreFocus) opener?.focus({ preventScroll: true });
  const route = parseRoute(location.hash);
  if (route.detail) {
    // A step lesson keeps its selected step in the route once its evidence closes.
    const hop = isStepLesson(chapters[route.chapter]) ? route.hop : null;
    history.replaceState(
      null,
      '',
      routeHref(route.chapter, route.step, null, { hop }),
    );
    previousRoute = { ...route, detail: null, claim: null, hop };
    previousHash = location.hash;
  }
}

// A closed drawer keeps its selection; a new claim, stage, or lesson clears it.
function clearMapSelection() {
  document
    .querySelectorAll('[data-detail]')
    .forEach((button) => button.setAttribute('aria-pressed', 'false'));
  document
    .querySelectorAll('.selected-scope')
    .forEach((scope) => scope.classList.remove('selected-scope'));
  delete document.getElementById('diagram').dataset.selected;
}

export function selectDetail(id, chapterKey, element = null) {
  const detail = resolveDetail(id, chapterKey);
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
    detail?.context || 'Explanation unavailable';
  const owner = document.getElementById('detail-owner');
  const ownerName = document.getElementById('detail-owner-name');
  if (owner) owner.hidden = !detail?.owner;
  if (ownerName) ownerName.textContent = detail?.owner || '';
  document.getElementById('detail-title').textContent =
    element?.querySelector('b')?.textContent ||
    element?.querySelector('span')?.textContent ||
    detail?.title ||
    id;
  document.getElementById('detail-what').textContent =
    element?.querySelector('small')?.textContent || '';
  document.getElementById('detail-copy').textContent = detail?.summary || '';
  const more = document.getElementById('detail-more');
  more.hidden = !detail?.more;
  more.open = false;
  document.getElementById('detail-more-copy').textContent = detail?.more || '';
  document.getElementById('artifact-label').textContent =
    detail?.artifact?.label || '';
  document.getElementById('artifact-code').textContent =
    detail?.artifact?.code || '';
  document.getElementById('detail-artifact').hidden = !detail?.artifact;
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
  const structured = scene.kind === 'map' && hasClaims(scene);
  const shelf = scene.group === 'learn';
  movable.forEach(({ element, marker }) => marker.after(element));
  const tryIt = document.getElementById('chapter-try-it');
  tryIt.innerHTML = scene.group === 'learn' ? tryItBand(scene, tryItShell) : '';
  tryIt.hidden = !tryIt.innerHTML;
  lessonState = {
    claim: 0,
    hop: -1,
    exampleOpen: false,
    variant: scene.example?.defaultVariant || 'normal',
  };
  document.body.classList.toggle('has-claims', structured);
  document.body.classList.toggle('is-lifecycle', isLifecycleLesson(scene));
  delete document.getElementById('diagram').dataset.focus;
  const claims = document.getElementById('chapter-claims');
  claims.innerHTML = claimStrip(key);
  if (isLifecycleLesson(scene))
    document.querySelector('#exploration .visual-workspace').after(claims);
  const statements = document.getElementById('chapter-statements');
  statements.innerHTML = isStepLesson(scene) ? claimStatements(key) : '';
  statements.hidden = !statements.innerHTML;
  const comparison = partitionComparison(key);
  const comparisonSlot = document.getElementById('chapter-comparison');
  comparisonSlot.innerHTML = comparison;
  comparisonSlot.hidden = !comparison;
  const lessonOptional = document.getElementById('lesson-optional');
  lessonOptional.hidden = true;
  document.getElementById('map-hint').hidden = structured;
  const context = document.getElementById('claim-context');
  context.innerHTML = '';
  context.hidden = !structured;
  document.querySelector('.below-figure').hidden = shelf;
  if (shelf) {
    document
      .getElementById('optional-example')
      .append(document.getElementById('example-strip'));
    document
      .getElementById('optional-listen')
      .append(document.getElementById('chapter-listen'));
    document
      .getElementById('optional-guides')
      .append(document.getElementById('chapter-guides'));
    document
      .getElementById('optional-sources')
      .querySelector('.shelf-row')
      .append(document.getElementById('source-details'));
    document
      .getElementById('structured-caption')
      .append(document.getElementById('scope-note'));
    document
      .getElementById('chapter-mistake')
      .after(document.getElementById('chapter-outcomes'));
  }
  if (scene.kind === 'map' && scene.group === 'learn') {
    document.getElementById('chapter-outcomes').after(tryIt);
    tryIt.after(lessonOptional);
  } else if (scene.tryIt && nextChapter(key) === 'start') {
    document.getElementById('chapter-outcomes').after(tryIt);
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
  document.getElementById('chapter-kicker').hidden =
    scene.page === 'home' || scene.group === 'supplement';
  const hero = document.getElementById('hero-image');
  if (scene.hero) {
    hero.src = scene.hero.image;
    hero.width = scene.hero.width;
    hero.height = scene.hero.height;
    hero.alt = scene.hero.alt;
  }
  hero.hidden = !scene.hero;
  mastheadLinks.forEach((link) => {
    if (link.hash === `#${key}`) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  document.getElementById('rail-current').textContent = kicker;
  setRailOpen(false);
  document.getElementById('premise').textContent = scene.premise || '';
  document.getElementById('premise').hidden = structured || !scene.premise;
  document.getElementById('headline').innerHTML = scene.headline;
  document.getElementById('introduction').innerHTML = scene.intro.startsWith(
    '<p',
  )
    ? scene.intro
    : `<p>${scene.intro}</p>`;
  document.getElementById('introduction').hidden = !scene.intro;
  const subhead = document.getElementById('subhead');
  subhead.textContent = scene.subhead || '';
  subhead.hidden = !scene.subhead;
  document.getElementById('scope-note').textContent = scene.scope || '';
  document.getElementById('scope-note').hidden = !scene.scope;
  document.getElementById('structured-caption').hidden =
    !shelf || scene.kind !== 'map' || !scene.scope;
  document.getElementById('sources').innerHTML = scene.sources
    .map(
      (sourceKey) =>
        `<a href="${sources[sourceKey].href}" target="_blank" rel="noopener noreferrer">${sources[sourceKey].label} ↗</a>`,
    )
    .join('');
  const sourceDetails = document.getElementById('source-details');
  sourceDetails.open = false;
  sourceDetails.hidden =
    !scene.sources.length ||
    scene.page === 'home' ||
    scene.group === 'supplement';
  document.getElementById('source-label').textContent = shelf
    ? 'Sources'
    : 'Go deeper in the documentation';
  const sourcePreview = document.getElementById('source-preview');
  sourcePreview.textContent = shelf ? sourcesPreview(scene.sources) : '';
  sourcePreview.hidden = !shelf;
  const sourceBadge = document.getElementById('source-badge');
  if (!sourceBadge.innerHTML)
    sourceBadge.innerHTML = badge('notebook', 'shelf-badge');
  sourceBadge.hidden = !shelf;
  document.getElementById('shelf-row-sources').hidden = sourceDetails.hidden;
  document.getElementById('chapter-position').textContent = positionLabel(key);
  const next = nextChapter(key);
  const link = document.getElementById('next-link');
  link.href = routeHref(next);
  const nextIndex = learnOrder.indexOf(next);
  link.innerHTML =
    next === 'start'
      ? '<b>Back to the start ↺</b>'
      : nextIndex >= 0
        ? `<small class="pager-kicker">Next lesson · ${nextIndex + 1} of ${learnOrder.length}</small><b>${escapeHtml(chapters[next].title)} →</b><span class="pager-question">${escapeHtml(chapters[next].question)}</span>`
        : `<b>Next: ${escapeHtml(chapters[next].title)} →</b>`;
  const prev = document.getElementById('prev-link');
  const learnIndex = learnOrder.indexOf(key);
  const previous =
    learnIndex > 0
      ? learnOrder[learnIndex - 1]
      : learnIndex === 0
        ? 'start'
        : null;
  prev.hidden = !previous;
  if (previous) {
    prev.href = routeHref(previous);
    prev.textContent = `← ${previous === 'start' ? 'Start' : chapters[previous].title}`;
  }
  document.getElementById('view-scope').innerHTML = chapterScope(key);
  const chapterListen = document.getElementById('chapter-listen');
  chapterListen.innerHTML = listenChips(key, { shelf });
  chapterListen.hidden = !chapterListen.innerHTML;
  document.getElementById('chapter-outcomes').innerHTML = chapterOutcomes(key);
  document.body.dataset.page = scene.kind === 'page' ? scene.page : 'map';
}

function forStep(value, route) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value[route.step] || []].flat();
}

function updateLessonOptional(scene) {
  const optional = document.getElementById('lesson-optional');
  if (scene.group !== 'learn') {
    optional.hidden = true;
    return;
  }
  const rows = [
    document.querySelector('#optional-example [data-shelf-row]'),
    document.querySelector('#optional-listen [data-shelf-row]'),
    document.querySelector('#optional-guides [data-shelf-row]'),
    document.querySelector('#optional-sources [data-shelf-row]'),
  ].filter(Boolean);
  optional.hidden = !rows.some((row) => !row.hidden);
}

// A field-guide section shows one sheet under its cards; null hides them all.
function showSheet(body, id) {
  body.querySelectorAll('[data-sheet-open]').forEach((card) => {
    const shown = card.dataset.sheetOpen === id;
    card.setAttribute('aria-expanded', String(shown));
    card.classList.toggle('is-shown', shown);
  });
  body.querySelectorAll('[data-sheet]').forEach((sheet) => {
    sheet.hidden = sheet.dataset.sheet !== id;
  });
}

function openContainingDetails(target) {
  const details = [];
  for (let node = target; node; node = node.parentElement) {
    if (node.tagName === 'DETAILS') details.push(node);
    if (node.dataset?.sheet) showSheet(node.parentElement, node.dataset.sheet);
  }
  details.reverse().forEach((item) => {
    item.open = true;
  });
}

function openShelfRowIds() {
  return [...document.querySelectorAll('#lesson-optional [data-shelf-row]')]
    .filter((row) => row.querySelector(':scope > details')?.open)
    .map((row) => row.id);
}

function closeShelfRows() {
  document
    .querySelectorAll('#lesson-optional [data-shelf-row] > details')
    .forEach((details) => {
      details.open = false;
    });
}

// Leaving a chapter remembers where the reader was, so browser Back lands on
// the marker or guide they left from instead of the top of the page.
const scrollMemory = new Map();
let historyPop = false;
let directHashNavigation = false;
history.scrollRestoration = 'manual';
document.addEventListener(
  'click',
  (event) => {
    if (!isModifiedClick(event) && event.target.closest('a[href^="#"]'))
      directHashNavigation = true;
  },
  { capture: true },
);
window.addEventListener('popstate', () => {
  historyPop = !directHashNavigation;
  directHashNavigation = false;
});
function settleChapterScroll() {
  const remembered = historyPop ? scrollMemory.get(location.hash) : undefined;
  if (remembered)
    remembered.shelfRows.forEach((id) => {
      document.querySelector(`#${id} > details`)?.setAttribute('open', '');
    });
  window.scrollTo({ top: remembered?.top ?? 0, behavior: 'instant' });
  return Boolean(remembered);
}

// The dock is the player on every page but Audio deep dives; there it shows
// only while the full player is scrolled out of view.
let playerWatch = null;
function watchListenPlayer() {
  const audio = document.getElementById('deep-dive');
  if (playerWatch) {
    window.removeEventListener('scroll', playerWatch);
    window.removeEventListener('resize', playerWatch);
    audio.removeEventListener('timeupdate', playerWatch);
    playerWatch = null;
  }
  const dock = document.getElementById('audio-dock');
  const controls = document.getElementById('listen-controls');
  if (!controls) {
    dock.dataset.covered = 'false';
    return;
  }
  playerWatch = () => {
    const box = controls.getBoundingClientRect();
    const covered = String(box.bottom > 0 && box.top < window.innerHeight);
    if (dock.dataset.covered === covered) return;
    dock.dataset.covered = covered;
    player.reflect();
  };
  window.addEventListener('scroll', playerWatch, { passive: true });
  window.addEventListener('resize', playerWatch);
  audio.addEventListener('timeupdate', playerWatch);
  playerWatch();
}

function render() {
  const route = parseRoute(location.hash);
  const scene = chapters[route.chapter];
  const chapterChanged = previousRoute?.chapter !== route.chapter;
  const routeChanged = previousHash !== null && previousHash !== location.hash;
  if (routeChanged)
    scrollMemory.set(previousHash, {
      top: window.scrollY,
      shelfRows: openShelfRowIds(),
    });
  const freshNavigation = routeChanged && !historyPop;
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
    updateLessonOptional(scene);
    // A timestamp in the hash seeks whether or not the page re-rendered;
    // a bare #listen leaves the current position alone.
    if (
      scene.page === 'listen' &&
      route.time !== null &&
      (chapterChanged || episodeChanged || previousRoute?.time !== route.time)
    )
      player.seekTo(route.time, false);
    let guideTarget = null;
    if (route.guide) {
      const target = document.getElementById(`guide-${route.guide}`);
      openContainingDetails(target);
      guideTarget = target;
    }
    const restored = historyPop && settleChapterScroll();
    if (!restored && guideTarget)
      guideTarget.scrollIntoView({ block: 'start' });
    else if (!restored && chapterChanged && previousRoute) {
      settleChapterScroll();
    }
    if (chapterChanged && previousRoute) focusChapter();
    historyPop = false;
    watchListenPlayer();
    previousRoute = route;
    previousHash = location.hash;
    directHashNavigation = false;
    return;
  }
  watchListenPlayer();

  document.getElementById('page').hidden = true;
  document.getElementById('page').innerHTML = '';
  document.getElementById('exploration').hidden = false;
  const structured = scene.kind === 'map' && hasClaims(scene);
  const shelf = scene.kind === 'map' && scene.group === 'learn';
  let guideTarget = null;
  if (chapterChanged) {
    document.getElementById('figure-title').textContent = scene.figure;
  }
  if (mapChanged) {
    const guideIds = forStep(scene.guides, route);
    const guides = guideIds
      .map((guide) =>
        shelf
          ? guidePreview(guide, { shelf: true })
          : suppliedPosters.some((poster) => poster.id === guide)
            ? posterInline(guide)
            : guideFigure(guide, { compact: true }),
      )
      .join('');
    const chapterGuides = document.getElementById('chapter-guides');
    chapterGuides.innerHTML = shelf
      ? shelfRow({
          id: 'guides',
          label: 'Field guides',
          preview: guidesPreview(guideIds),
          body: guides,
          badge: 'sheet',
        })
      : guides;
    chapterGuides.hidden = !chapterGuides.innerHTML;
    document.getElementById('chapter-mistake').innerHTML = forStep(
      scene.mistakes,
      route,
    )
      .map((id) => mythCallout(id, route.chapter))
      .join('');
  }
  if (route.guide && (mapChanged || previousRoute?.guide !== route.guide)) {
    guideTarget = document.getElementById(`guide-${route.guide}`);
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
    selectDetail(element.dataset.detail, route.chapter, element);
  } else {
    expandInspector(false);
    clearMapSelection();
  }
  const strip = document.getElementById('example-strip');
  const selection = structured ? resolveLessonSelection(scene, route) : null;
  const legacyHop = structured ? -1 : hopIndexForRoute(scene, route);
  const requestedOpener = pendingOpener;
  const openerHop = requestedOpener?.dataset.hop;
  const openerWasLookCloser = requestedOpener?.hasAttribute('data-look-closer');
  const stripWasOpen =
    !chapterChanged && Boolean(strip.querySelector('details')?.open);
  if (!hasClaims(scene) || mapChanged) {
    strip.innerHTML = exampleStrip(
      route.chapter,
      {
        ...route,
        detail: element?.dataset.detail || null,
      },
      lessonState.variant,
      { shelf },
    );
    strip.hidden = !strip.innerHTML;
  }
  updateLessonOptional(scene);
  if (freshNavigation && chapterChanged) closeShelfRows();
  if (structured) {
    lessonState.claim = selection.claim;
    lessonState.hop = selection.hop;
    lessonState.exampleOpen = selection.exampleOpen;
    const disclosure = strip.querySelector('details');
    if (disclosure) disclosure.open = selection.exampleOpen;
    applyFocus();
  } else if (scene.example) {
    lessonState.hop = legacyHop;
    lessonState.exampleOpen = legacyHop >= 0 || stripWasOpen;
    strip.querySelector('details').open = lessonState.exampleOpen;
  }
  if (guideTarget) openContainingDetails(guideTarget);
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
  if (stageRequested && !chapterChanged) revealStage(stageRequested);
  stageRequested = null;
  const restored = historyPop && settleChapterScroll();
  if (!restored) {
    if (guideTarget) guideTarget.scrollIntoView({ block: 'start' });
    else if (chapterChanged && previousRoute) {
      if (!guideTarget) settleChapterScroll();
    }
  }
  if (chapterChanged && previousRoute) focusChapter();
  historyPop = false;
  // A chapter change keeps focus on the headline; the drawer opens beside it.
  if (element)
    expandInspector(true, { focus: !(chapterChanged && previousRoute) });
  previousRoute = route;
  previousHash = location.hash;
  directHashNavigation = false;
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

document
  .getElementById('chapter-try-it')
  .addEventListener('change', (event) => {
    const input = event.target.closest('[data-try-it-shell]');
    if (!input) return;
    tryItShell = input.value;
    applyTryItShell(event.currentTarget, tryItShell);
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
let stageRequested = null;
// A stage control leaves the new stage's explanation readable below the sticky
// stage bar; Continue also moves focus to it, since the control scrolled away.
function revealStage(kind) {
  const story = document.getElementById('creation-story');
  const bar = document.querySelector('.creation-steps');
  if (!story || !bar) return;
  const heading = document.getElementById('creation-story-title');
  const clear =
    Math.max(0, masthead.getBoundingClientRect().bottom) + bar.offsetHeight;
  const top = story.getBoundingClientRect().top;
  if (
    top < clear ||
    heading.getBoundingClientRect().bottom > window.innerHeight
  )
    window.scrollBy({ top: top - clear, behavior: 'instant' });
  if (kind === 'continue') heading.focus({ preventScroll: true });
}
function isModifiedClick(event) {
  return (
    event.button ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}
function navigateToHash(href) {
  directHashNavigation = true;
  location.hash = href;
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
    applyFocus();
    return;
  }
  const hop = event.target.closest('[data-hop]');
  if (hop) {
    lessonState.hop = Number(hop.dataset.hop);
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
  const stageLink = event.target.closest('a[data-stage-link]');
  if (stageLink) {
    stageRequested = stageLink.hasAttribute('data-stage-continue')
      ? 'continue'
      : 'stage';
    if (stageLink.hash === location.hash) {
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
  // A step is a local control: it moves the state panel, the focus, and its
  // line in place. Only its How we know link opens the drawer.
  const stepEvidence = event.target.closest('[data-step-evidence]');
  const step = event.target.closest('[data-step]');
  if (step || stepEvidence) {
    if (stepEvidence && isModifiedClick(event)) return;
    event.preventDefault();
    const route = parseRoute(location.hash);
    const index = Number(
      stepEvidence?.dataset.stepEvidence ?? step.dataset.step,
    );
    lessonState.hop = index;
    if (stepEvidence) {
      pendingOpener = stepEvidence;
      const href = stepEvidence.getAttribute('href');
      if (location.hash === href) render();
      else navigateToHash(href);
      return;
    }
    closeInspector(false);
    clearMapSelection();
    const href = routeHref(route.chapter, route.step, null, { hop: index });
    if (location.hash === href) render();
    else navigateToHash(href);
    return;
  }
  const evidence = event.target.closest('[data-evidence]');
  const button = event.target.closest('[data-claim]');
  if (!evidence && !button) return;
  if (evidence && isModifiedClick(event)) return;
  event.preventDefault();
  const index = Number(evidence?.dataset.evidence ?? button.dataset.claim);
  const previousClaim = lessonState.claim;
  const route = parseRoute(location.hash);
  const claim = chapters[route.chapter].outcomes[index];
  lessonState.claim = index;
  lessonState.hop = -1;
  if (evidence) {
    const id = claim.evidence;
    const step = claim.evidenceStep || claim.step || '';
    pendingOpener = evidence;
    const href = routeHref(route.chapter, step, id, { claim: index });
    if (location.hash === href) render();
    else navigateToHash(href);
    return;
  }
  closeInspector(false);
  clearMapSelection();
  const currentStepIsCompatible =
    !claim.steps || claim.steps.includes(route.step);
  if (claim.step && (index !== previousClaim || !currentStepIsCompatible)) {
    const href = routeHref(route.chapter, claim.step);
    if (location.hash === href) render();
    else navigateToHash(href);
    return;
  }
  applyFocus();
});

document.getElementById('diagram').addEventListener('click', (event) => {
  const button = event.target.closest('button[data-detail]');
  if (!button) return;
  const route = parseRoute(location.hash);
  const scene = chapters[route.chapter];
  // A step lesson keeps its step while a component is inspected; elsewhere a
  // component click drops the trace.
  if (!isStepLesson(scene)) lessonState.hop = -1;
  pendingOpener = button;
  const selection = isStepLesson(scene)
    ? { hop: lessonState.hop }
    : hasClaims(scene)
      ? { claim: lessonState.claim }
      : {};
  const href = routeHref(
    route.chapter,
    route.step,
    button.dataset.detail,
    selection,
  );
  if (location.hash === href) render();
  else navigateToHash(href);
});
document
  .getElementById('detail-toggle')
  .addEventListener('click', () => closeInspector());

// Watch opens the video over the page. Closing pauses it and returns focus to
// Watch at the same scroll position, unless the reader navigated meanwhile.
const videoDialog = document.getElementById('video-dialog');
let videoReturn = null;
document.addEventListener('click', (event) => {
  const opener = event.target.closest('[data-video-open]');
  if (!opener) return;
  videoReturn = { opener, hash: location.hash, top: window.scrollY };
  const body = document.getElementById('video-dialog-body');
  if (!body.firstElementChild) {
    document.getElementById('video-dialog-title').textContent =
      frameVideo.title;
    body.innerHTML = frameVideoPlayer();
  }
  videoDialog.showModal();
  videoDialog
    .querySelector('video')
    .play()
    .catch(() => {});
});
// Synchronous: the dialog's queued close event can lag in a background tab.
function closeVideo() {
  if (!videoDialog.open) return;
  videoDialog.querySelector('video').pause();
  videoDialog.close();
  const target = videoReturn;
  videoReturn = null;
  if (!target || location.hash !== target.hash) return;
  target.opener.focus({ preventScroll: true });
  if (window.scrollY !== target.top)
    window.scrollTo({ top: target.top, behavior: 'instant' });
}
videoDialog.addEventListener('keydown', (event) => {
  if (event.key !== 'Tab') return;
  const stops = [...videoDialog.querySelectorAll('button, video, summary')];
  const edge = event.shiftKey ? stops[0] : stops.at(-1);
  if (
    document.activeElement !== edge &&
    videoDialog.contains(document.activeElement)
  )
    return;
  event.preventDefault();
  (event.shiftKey ? stops.at(-1) : stops[0]).focus();
});
videoDialog.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeVideo();
});
document
  .getElementById('video-dialog-close')
  .addEventListener('click', closeVideo);
videoDialog.addEventListener('click', (event) => {
  if (event.target === videoDialog) closeVideo();
});
window.addEventListener('hashchange', closeVideo);

const lightbox = document.getElementById('lightbox');
let lightboxOpener = null;

document.addEventListener('click', (event) => {
  const opener = event.target.closest('[data-lightbox]');
  if (!opener) return;
  lightboxOpener = opener;
  const image = document.getElementById('lightbox-image');
  image.src = opener.dataset.lightbox;
  image.alt = opener.dataset.lightboxTitle;
  document.getElementById('lightbox-title').textContent =
    opener.dataset.lightboxTitle;
  const notes = document.getElementById('lightbox-notes');
  const source = opener.dataset.lightboxNotes
    ? document.getElementById(opener.dataset.lightboxNotes)
    : null;
  notes.innerHTML = source ? source.innerHTML : '';
  notes.hidden = !source;
  // The poster's origin and status read before the image, not after it.
  const status = document.getElementById('lightbox-status');
  const origin = notes.querySelector('.poster-origin');
  status.textContent = origin?.textContent ?? '';
  status.hidden = !origin;
  origin?.remove();
  document.querySelector('.lightbox-scroll').scrollTop = 0;
  setLightboxZoom(false);
  lightbox.showModal();
});

// The enlarged poster fits the dialog until Zoom in is pressed; zoomed, it
// pans sideways, which is what a phone needs to read the small type.
function setLightboxZoom(zoomed) {
  const button = document.getElementById('lightbox-zoom');
  lightbox.classList.toggle('is-zoomed', zoomed);
  button.setAttribute('aria-pressed', String(zoomed));
  button.textContent = zoomed ? 'Fit to screen' : 'Zoom in';
}
document.getElementById('lightbox-zoom').addEventListener('click', () => {
  setLightboxZoom(!lightbox.classList.contains('is-zoomed'));
});

document.addEventListener('click', (event) => {
  const card = event.target.closest('[data-sheet-open]');
  if (!card) return;
  const body = card.closest('.guide-set-body');
  if (!body) return;
  const id =
    card.getAttribute('aria-expanded') === 'true'
      ? null
      : card.dataset.sheetOpen;
  showSheet(body, id);
  if (id)
    document
      .getElementById(`guide-${id}`)
      ?.scrollIntoView({ block: 'nearest' });
});

// An easy mistake can open a field guide rendered beside the lesson in place
// of leaving for the Field guides page.
document.addEventListener('click', (event) => {
  const opener = event.target.closest('[data-guide-open]');
  if (!opener) return;
  const figure = document.getElementById(`guide-${opener.dataset.guideOpen}`);
  if (!figure) return;
  openContainingDetails(figure);
  figure.scrollIntoView({ block: 'start' });
  figure.tabIndex = -1;
  figure.focus({ preventScroll: true });
});
document
  .getElementById('lightbox-close')
  .addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox.addEventListener('close', () => {
  lightboxOpener?.focus({ preventScroll: true });
  lightboxOpener = null;
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (inspector.classList.contains('is-expanded')) {
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
