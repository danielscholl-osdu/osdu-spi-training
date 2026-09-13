import { escapeHtml } from './node.js';
import { chapters, chapterGroups } from '../content/chapters.js';
import { myths, mythThemes } from '../content/myths.js';
import { suppliedPosters, nativeGuides } from '../content/posters.js';
import { sources } from '../content/sources.js';
import { episodes, episodeById, frameVideo } from '../content/audio.js';
import {
  infographics,
  ownerLegend,
  zoomLadder,
  spiNamesFigure,
  roundTripFigure,
  partitionLookupFigure,
} from './infographics.js';
import { routeHref, parseRoute } from '../router.js';

export function formatTime(seconds) {
  const whole = Math.max(0, Math.floor(seconds));
  const h = Math.floor(whole / 3600);
  const m = Math.floor((whole % 3600) / 60);
  const s = whole % 60;
  return h
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`;
}

function sourceAnchor(key) {
  const source = sources[key];
  if (!source) throw new Error(`Unknown source key: ${key}`);
  return `<a href="${source.href}" target="_blank" rel="noopener noreferrer">${source.label} ↗</a>`;
}

function sourceLinks(keys) {
  return `<p class="guide-sources">Sources: ${keys
    .map(sourceAnchor)
    .join(' · ')}</p>`;
}

function tryItAction(step) {
  const action = step.command
    ? `<pre class="try-it-command"><code>${escapeHtml(step.command)}</code></pre>`
    : `<p class="try-it-click"><b>Click:</b> ${escapeHtml(step.click)}</p>`;
  return `${action}<p class="try-it-expect"><b>Look for:</b> ${escapeHtml(step.expect)}</p>${step.sources?.length ? sourceLinks(step.sources) : ''}`;
}

function tryItVariant(variant, index, count) {
  const testedLabels = {
    cli: 'CLI release',
    stack: 'Stack ref',
    template: 'Template commit',
    shell: 'Shell',
    os: 'Operating system',
    date: 'Walked on',
  };
  return `<section class="try-it-variant" aria-labelledby="try-it-variant-${index}">
    <header>
      ${count > 1 ? `<span class="guide-kicker">Route ${index + 1}</span>` : ''}
      <h3 id="try-it-variant-${index}">${escapeHtml(variant.label)}</h3>
      <p class="try-it-result">${escapeHtml(variant.result)}</p>
    </header>
    <div class="try-it-access">
      <p><b>Access:</b> ${escapeHtml(variant.access)}</p>
      ${variant.accessNote ? `<p>${escapeHtml(variant.accessNote)}</p>` : ''}
    </div>
    <section class="try-it-prerequisites">
      <h4>Prerequisites</h4>
      <ul>${variant.prerequisites
        .map(
          (item) =>
            `<li><span>${escapeHtml(item.text)}</span>${sourceLinks(item.sources)}</li>`,
        )
        .join('')}</ul>
    </section>
    <section class="try-it-effects">
      <h4>What this changes</h4>
      <p>${escapeHtml(variant.effects)}</p>
    </section>
    <dl class="try-it-time">
      <div><dt>Active effort</dt><dd>${escapeHtml(variant.time.active)}</dd></div>
      <div><dt>Automated wait</dt><dd>${escapeHtml(variant.time.wait)}</dd></div>
      <div><dt>Clean-up effort</dt><dd>${escapeHtml(variant.time.cleanup)}</dd></div>
    </dl>
    <section class="try-it-steps">
      <h4>Steps</h4>
      <ol>${variant.steps.map((step) => `<li>${tryItAction(step)}</li>`).join('')}</ol>
    </section>
    <section class="try-it-alternate">
      <h4>Common alternate result</h4>
      <p><b>If you see:</b> ${escapeHtml(variant.alternate.observation)}</p>
      <p><b>Then:</b> ${escapeHtml(variant.alternate.next)}</p>
    </section>
    <section class="try-it-cleanup">
      <h4>Clean up</h4>
      <ol>${variant.cleanup.steps.map((step) => `<li>${tryItAction(step)}</li>`).join('')}</ol>
      <p><b>What remains:</b> ${escapeHtml(variant.cleanup.remains)}</p>
    </section>
    <section class="try-it-tested">
      <h4>Tested with</h4>
      <dl>${Object.entries(testedLabels)
        .map(
          ([key, label]) =>
            `<div><dt>${label}</dt><dd>${escapeHtml(variant.tested[key])}</dd></div>`,
        )
        .join('')}</dl>
    </section>
    ${sourceLinks(variant.sources)}
  </section>`;
}

export function tryItBand(chapter) {
  if (!chapter.tryIt) return '';
  const { activity, summary, variants, connection } = chapter.tryIt;
  return `<section class="try-it" aria-label="Try it: ${escapeHtml(activity)}">
    <details>
      <summary><span>${escapeHtml(summary)}</span></summary>
      <div class="try-it-body">
        <p class="try-it-safety">You run this activity in your own account. This site executes nothing and reports no live environment state.</p>
        <div class="try-it-variants">${variants
          .map((variant, index) =>
            tryItVariant(variant, index, variants.length),
          )
          .join('')}</div>
        ${connection ? `<section class="try-it-connection"><h3>Using an existing environment</h3><p>${escapeHtml(connection.text)}</p>${sourceLinks(connection.sources)}</section>` : ''}
      </div>
    </details>
  </section>`;
}

export function detailSourceLinks(detail) {
  const keys = [
    ...new Set([detail?.source, ...(detail?.goDeeper || [])].filter(Boolean)),
  ];
  return keys.map(sourceAnchor).join('');
}

// A supplied poster beside a lesson opens in the lightbox with its notes; the
// notes travel hidden in the figure so the dialog can show them without a
// chapter change.
export function posterInline(id) {
  const poster = suppliedPosters.find((entry) => entry.id === id);
  if (!poster) return '';
  return `<figure class="field-guide is-compact is-poster" id="guide-${id}" data-guide="${id}">
    <figcaption><span class="guide-kicker">Poster</span><h3>${poster.title}</h3><p>${poster.summary}</p></figcaption>
    ${poster.inline ? `<p class="poster-inline-note">${escapeHtml(poster.inline)}</p>` : ''}
    <button type="button" class="poster-inline" data-lightbox="${poster.image}" data-lightbox-title="${escapeHtml(poster.title)}" data-lightbox-notes="poster-notes-${id}" aria-haspopup="dialog" aria-controls="lightbox"><img src="${poster.image}" width="${poster.width}" height="${poster.height}" alt="${escapeHtml(poster.title)}" loading="lazy" /><span aria-hidden="true">Open with its notes ⤢</span></button>
    <div id="poster-notes-${id}" class="poster-lightbox-notes" hidden>
      <p class="poster-origin">${poster.origin}</p>
      ${poster.inline ? `<p class="poster-inline-note">${escapeHtml(poster.inline)}</p>` : ''}
      <h4>Take from it</h4>
      <ul>${poster.takeaways.map((item) => `<li>${item}</li>`).join('')}</ul>
      <h4>Read it with these checks</h4>
      <ul class="poster-notes">${poster.notes.map((item) => `<li>${item}</li>`).join('')}</ul>
    </div>
    <div class="guide-foot">${sourceLinks(poster.sources)}<a class="small-link" href="${routeHref('field-guides')}?guide=${id}">All field guides →</a></div>
  </figure>`;
}

export function guideFigure(id, { heading = 'h3', compact = false } = {}) {
  const guide = nativeGuides.find((entry) => entry.id === id);
  if (!guide) return '';
  return `<figure class="field-guide ${compact ? 'is-compact' : ''}" id="guide-${id}" data-guide="${id}">
    <figcaption><span class="guide-kicker">Field guide</span><${heading}>${guide.title}</${heading}><p>${guide.summary}</p></figcaption>
    <div class="guide-body">${infographics[id]()}</div>
    <div class="guide-foot">${sourceLinks(guide.sources)}${compact ? `<a class="small-link" href="${routeHref('field-guides')}?guide=${id}">All field guides →</a>` : `<a class="small-link" href="${guide.appearsIn.href}">Explore: ${guide.appearsIn.label} →</a>`}</div>
  </figure>`;
}

export function partitionComparison(key) {
  const comparison = chapters[key]?.comparison;
  if (!comparison) return '';
  return `<details class="partition-comparison">
    <summary><b>${escapeHtml(comparison.title)}</b><span aria-hidden="true">+</span></summary>
    <div class="partition-comparison-body">
      ${partitionLookupFigure(comparison)}
      <section class="partition-comparison-notes" aria-label="Comparison limits">
        <h3>What this comparison does not claim</h3>
        <ul>${comparison.limitations.map((note) => `<li>${escapeHtml(note)}</li>`).join('')}</ul>
      </section>
      <div class="partition-comparison-sources">
        <section><h3>${escapeHtml(comparison.community.label)} sources</h3>${sourceLinks(comparison.community.sources)}</section>
        <section><h3>${escapeHtml(comparison.azure.label)} sources</h3>${sourceLinks(comparison.azure.sources)}</section>
      </div>
    </div>
  </details>`;
}

function mythCard(myth, compact = false) {
  const source = sources[myth.source];
  return `<article class="myth" id="myth-${myth.id}">
    <p class="myth-claim">“${myth.claim}”</p>
    <p class="myth-reality">${myth.reality}</p>
    ${compact ? '' : `<code class="myth-check">${escapeHtml(myth.check)}</code>`}
    <p class="myth-links"><a href="${myth.route}">${myth.routeLabel} →</a><a href="${source.href}" target="_blank" rel="noopener noreferrer">${source.label} ↗</a></p>
  </article>`;
}

// The video plays only inside the Start page's modal (see main.js). It pauses
// the audio dock and the dock pauses it.
export function frameVideoPlayer() {
  return `<video controls preload="metadata" playsinline poster="${frameVideo.poster}" width="${frameVideo.width}" height="${frameVideo.height}" aria-label="${escapeHtml(frameVideo.title)}" data-frame-video>
      <source src="${frameVideo.file}" type="video/mp4" />
      <track kind="captions" src="${frameVideo.captions}" srclang="en" label="English" default />
    </video>
    <details class="frame-notes"><summary>Source checks</summary><ul>${frameVideo.notes.map((note) => `<li>${escapeHtml(note)}</li>`).join('')}</ul></details>`;
}

function briefChip() {
  const [cue] = chapters.start.listen;
  return `<div class="home-listen"><button type="button" class="home-media-button" data-seek="${cue.time}" data-listen-episode="${cue.episode}" data-listen-end="${cue.end}" data-listen-stop="${cue.end}"><span class="play-glyph" aria-hidden="true">▶</span><span><b>Listen · ${Math.round((cue.end - cue.time) / 60)} min</b><small>${escapeHtml(cue.label)}</small></span></button><p class="listen-now" data-listen-now aria-live="polite" hidden></p></div>`;
}

function lessonIndex() {
  const learnOrder = Object.keys(chapters).filter(
    (key) => chapters[key].group === 'learn',
  );
  return chapters.start.index
    .map(
      (group, groupIndex) =>
        `<section class="lesson-group" aria-labelledby="lesson-group-${groupIndex}"><h3 id="lesson-group-${groupIndex}">${escapeHtml(group.label)}</h3><ol class="lesson-index">${Object.entries(
          group.lessons,
        )
          .map(([key, title]) => {
            const number = learnOrder.indexOf(key) + 1;
            const first = number === 1;
            return `<li${first ? ' class="is-first"' : ''}><a href="${routeHref(key)}"><span class="lesson-number">${String(number).padStart(2, '0')}</span><b>${escapeHtml(title)}</b>${first ? '<span class="lesson-begin">Start here →</span>' : ''}</a></li>`;
          })
          .join('')}</ol></section>`,
    )
    .join('');
}

function homePage() {
  const start = chapters.start;
  const moreSources = [
    'architecture',
    'engineering',
    'designs',
    'decisions',
    'cimplArchitecture',
    'communityPartitionProvider',
  ];
  return `<div class="home-promise">
      <p>${escapeHtml(start.reference)}</p>
      <p class="home-checked">Source-checked ${escapeHtml(start.checked)}</p>
    </div>
    <section class="home-introduction" aria-labelledby="home-introduction-title">
      <h2 id="home-introduction-title">Introduction</h2>
      <div class="home-media">
        <button type="button" class="home-watch home-media-button" data-video-open aria-haspopup="dialog" aria-controls="video-dialog"><img src="${frameVideo.poster}" alt="" width="36" height="64" loading="lazy" /><span><b>Watch · ${Math.round(frameVideo.duration / 60)} min</b><small>${escapeHtml(frameVideo.title)}</small></span></button>
        ${briefChip()}
      </div>
    </section>
    <section class="home-lessons" aria-labelledby="home-lessons-title">
      <h2 id="home-lessons-title">Lessons</h2>
      <div class="lesson-groups">${lessonIndex()}</div>
    </section>
    <section class="home-names" aria-labelledby="home-names-title">
      <h2 id="home-names-title">SPI means three things here</h2>
      ${spiNamesFigure()}
    </section>
    <details class="home-sources">
      <summary>Go deeper: design guides, decision records, and the community reference</summary>
      <p class="home-more-sources">${moreSources.map(sourceAnchor).join('')}</p>
    </details>`;
}

function mythsPage() {
  return mythThemes
    .map((theme) => {
      const entries = myths.filter((myth) => myth.theme === theme.id);
      return `<section class="myth-theme" aria-label="${theme.title}">
        <div class="myth-theme-head"><h2>${theme.title}</h2><a href="${theme.built.href}">Built in ${theme.built.label} →</a></div>
        <div class="myth-grid is-full">${entries.map((myth) => mythCard(myth)).join('')}</div>
      </section>`;
    })
    .join('');
}

export function isLifecycleLesson(chapter) {
  return chapter?.lesson === 'lifecycle';
}

export function hasClaims(chapter) {
  return chapter.outcomes?.some((claim) => typeof claim !== 'string') || false;
}

function evidenceClaimIndexForRoute(chapter, route) {
  const claims = chapter.outcomes || [];
  return claims.findIndex(
    (claim) =>
      typeof claim !== 'string' &&
      claim.evidence === route.detail &&
      (claim.evidenceStep || claim.step || route.step) === route.step,
  );
}

function claimMatchesStep(claim, route) {
  return (
    typeof claim !== 'string' &&
    (!claim.steps || claim.steps.includes(route.step))
  );
}

export function claimIndexForRoute(chapter, route) {
  const claims = chapter.outcomes || [];
  const evidence = evidenceClaimIndexForRoute(chapter, route);
  if (evidence >= 0) return evidence;
  const compatible = claims.findIndex((claim) =>
    claimMatchesStep(claim, route),
  );
  return compatible >= 0 ? compatible : 0;
}

export function hopIndexForRoute(chapter, route) {
  const example = chapter.example;
  if (!example || !route.detail) return -1;
  return example.hops.findIndex(
    (hop) =>
      hop.detail === route.detail &&
      (hop.step || example.step || route.step) === route.step,
  );
}

export function resolveLessonSelection(chapter, route) {
  const claims = chapter.outcomes || [];
  const fallbackClaim = claimIndexForRoute(chapter, route);
  if (
    route.claim !== null &&
    claims[route.claim] &&
    claimMatchesStep(claims[route.claim], route)
  )
    return { claim: route.claim, hop: -1, exampleOpen: false };

  const explicitHop = chapter.example?.hops[route.hop];
  if (
    route.hop !== null &&
    explicitHop?.detail === route.detail &&
    (explicitHop.step || chapter.example.step || route.step) === route.step
  )
    return { claim: fallbackClaim, hop: route.hop, exampleOpen: true };

  const evidenceClaim = evidenceClaimIndexForRoute(chapter, route);
  if (evidenceClaim >= 0)
    return { claim: evidenceClaim, hop: -1, exampleOpen: false };

  const hop = hopIndexForRoute(chapter, route);
  return {
    claim: fallbackClaim,
    hop,
    exampleOpen: hop >= 0,
  };
}

export function claimStrip(key) {
  const chapter = chapters[key];
  if (isLifecycleLesson(chapter) && hasClaims(chapter))
    return `<section class="lesson-claims is-statements" aria-label="Key ideas"><ul class="claim-statements">${chapter.outcomes
      .map(
        (claim) =>
          `<li><b>${escapeHtml(claim.headline)}</b><span>${escapeHtml(claim.why)}</span></li>`,
      )
      .join('')}</ul></section>`;
  if (!hasClaims(chapter)) return '';
  return `<section class="claims" aria-label="Lesson claims">
    <p class="guide-kicker">Select an idea to highlight it on the map.</p>
    <ol class="claim-list">${chapter.outcomes
      .map((claim, index) => {
        const c = typeof claim === 'string' ? { text: claim } : claim;
        return `<li class="claim-item" data-claim-item="${index}"><button type="button" class="claim" data-claim="${index}" aria-pressed="${index === 0}"><b>${escapeHtml(c.headline || c.text)}</b><span class="claim-count">${index + 1} / ${chapter.outcomes.length}</span></button>${c.evidence ? `<a class="claim-evidence" data-evidence="${index}" href="${routeHref(key, c.evidenceStep || c.step || '', c.evidence, { claim: index })}">How we know →</a>` : ''}</li>`;
      })
      .join('')}</ol>
  </section>`;
}

export function claimContext(key, index) {
  const chapter = chapters[key];
  if (!hasClaims(chapter)) return '';
  const claim = chapter.outcomes[index];
  if (!claim || typeof claim === 'string') return '';
  return `<p>${escapeHtml(claim.text)}</p><small>${escapeHtml(claim.why)}</small>`;
}

export function guidePreview(id) {
  if (suppliedPosters.some((poster) => poster.id === id))
    return posterInline(id);
  const guide = nativeGuides.find((entry) => entry.id === id);
  if (!guide) return '';
  return `<div class="guide-preview"><h3>${guide.title}</h3><p>${guide.summary.split(/(?<=[.!?])\s/)[0]}</p><details><summary>Open here</summary>${guideFigure(id, { compact: true })}</details></div>`;
}

export function chapterOutcomes(key) {
  const chapter = chapters[key];
  if (!chapter.outcomes) return '';
  const learn = Object.keys(chapters).filter(
    (id) => chapters[id].group === 'learn',
  );
  const next = learn[learn.indexOf(key) + 1];
  return `<section class="outcomes" aria-label="What you can now say">
    <div class="outcomes-head"><h2>What you can now say</h2></div>
    <ol>${chapter.outcomes.map((line) => `<li>${escapeHtml(typeof line === 'string' ? line : line.text)}</li>`).join('')}</ol>
    ${
      key === 'handshake'
        ? `<div class="outcomes-close"><p><b>That is the round trip.</b> A request went down to its Azure provider, a change to that provider went out through the fork, and a candidate image came back in through the lock. From here, choose:</p><ul><li><a href="${routeHref('not-true')}">07 · ${chapters['not-true'].title} →</a><span>The assumptions the documentation contradicts, with a command for each.</span></li><li><a href="${routeHref('listen')}">Listen →</a><span>The recordings, cued from the views you have seen.</span></li><li><a href="${routeHref('field-guides')}">Field guides →</a><span>The diagrams from the views on one printable page.</span></li></ul></div>`
        : next && !hasClaims(chapter)
          ? `<p class="outcomes-next"><b>Next, ${chapters[next].title}</b> asks: ${escapeHtml(chapters[next].question)} <span>${escapeHtml(chapters[next].builds)}</span></p>`
          : ''
    }
  </section>`;
}

export function chapterScope(key) {
  const chapter = chapters[key];
  if (chapter.group === 'learn' && hasClaims(chapter)) return '';
  if (chapter.group === 'learn')
    return `<p class="view-scope">${escapeHtml(chapter.builds)} ${escapeHtml(chapter.where)}</p>`;
  if (!chapter.where) return '';
  return `<p class="view-question"><span>This view answers</span>${escapeHtml(chapter.question || '')}${chapter.builds ? ` <em>${escapeHtml(chapter.builds)}</em>` : ''}</p>
  <p class="view-scope"><span>In this view</span>${escapeHtml(chapter.where)} <a href="#field-guides?guide=ladder">See the six places →</a></p>`;
}

// The running example is optional depth after the lesson exit. Each hop can
// deliberately return to its component on the map.
export function resolveExamplePresentation(example, variant) {
  const variants = example?.variants || null;
  const selectedVariant =
    variants &&
    (Object.hasOwn(variants, variant) ? variant : example.defaultVariant);
  const selected = selectedVariant ? variants[selectedVariant] : null;
  return {
    ...example,
    selectedVariant,
    crossing: selected?.crossing || example?.crossing || '',
    note: selected?.note || example?.note || '',
    hops:
      example?.hops.map((hop) => ({
        ...hop,
        ...(selected?.overrides?.[hop.detail] || {}),
      })) || [],
  };
}

export function selectExampleVariant(state, variant, hopCount) {
  return {
    ...state,
    variant,
    hop: state.hop < 0 ? hopCount - 1 : state.hop,
    policy: 'learn',
    exampleOpen: true,
  };
}

export function exampleStrip(key, route, variant) {
  const example = chapters[key].example;
  if (!example) return '';
  const presentation = resolveExamplePresentation(example, variant);
  const structured = hasClaims(chapters[key]);
  const current = hopIndexForRoute(chapters[key], route);
  const variantControls = example.variants
    ? `<div class="example-variant-row"><span>Trace condition</span><div class="example-variants" role="group" aria-label="Trace condition">${Object.entries(
        example.variants,
      )
        .map(
          ([id, option]) =>
            `<button type="button" data-example-variant="${id}" aria-pressed="${presentation.selectedVariant === id}">${escapeHtml(option.label)}</button>`,
        )
        .join('')}</div></div>`
    : '';
  return `<details class="example-disclosure"><summary>Example: ${escapeHtml(example.title)}</summary>
    <div class="example-head"><code>${escapeHtml(example.code)}</code></div>
    ${variantControls}
    <p class="example-crossing" data-example-crossing>${escapeHtml(presentation.crossing)}</p>
    <ol class="journey" aria-label="${escapeHtml(example.title)}">${presentation.hops.map((hop, index) => `<li class="${index === current ? 'is-current' : index < current ? 'is-done' : ''}"><a href="${routeHref(key, hop.step || example.step || route.step, hop.detail, structured ? { hop: index } : {})}" data-map-jump data-hop="${index}" ${index === current ? 'aria-current="true"' : ''} title="${escapeHtml(hop.copy)}" aria-label="${escapeHtml(`${index + 1}. ${hop.label}: ${hop.copy}`)}"><span>${index + 1}</span><b>${escapeHtml(hop.label)}</b><small data-hop-copy="${hop.detail}">${escapeHtml(hop.copy)}</small></a></li>`).join('')}</ol>
    <p class="example-note"><span class="example-provider-path">${escapeHtml(example.providerPath || '')}</span> <span data-example-note>${escapeHtml(presentation.note)}</span></p></details>`;
}

// One entry from the myths, directly under the map. A link back into the same
// view says that the page will move; a guide rendered beside this lesson opens
// in place; links to other views navigate as usual.
export function mythCallout(id, chapterKey) {
  const myth = myths.find((entry) => entry.id === id);
  if (!myth) return '';
  const source = sources[myth.source];
  const guideHere = myth.guideHere?.[chapterKey];
  const target = myth.here?.[chapterKey] || myth.route;
  const route = parseRoute(target);
  const sameView = route.chapter === chapterKey;
  const chapter = chapters[chapterKey];
  const claim = (chapter.outcomes || []).findIndex(
    (entry) =>
      claimMatchesStep(entry, route) && entry.focus?.includes(route.detail),
  );
  const href =
    sameView && claim >= 0 && hopIndexForRoute(chapter, route) >= 0
      ? routeHref(route.chapter, route.step, route.detail, { claim })
      : target;
  return `<aside class="easy-mistake" aria-label="Easy mistake">
    <div class="easy-mistake-head"><span class="guide-kicker">Easy mistake</span></div>
    <p class="myth-claim">“${myth.claim}”</p>
    <p class="myth-reality">${myth.reality}</p>
    <code class="myth-check">${escapeHtml(myth.check)}</code>
    <p class="myth-links">${guideHere ? `<button type="button" class="myth-guide" data-guide-open="${guideHere}">${myth.routeLabel} ↓</button>` : `<a href="${href}" ${sameView ? 'data-map-jump' : ''}>${sameView ? 'Show it on the map ↑' : `${myth.routeLabel} →`}</a>`}<a href="${source.href}" target="_blank" rel="noopener noreferrer">${source.label} ↗</a></p>
  </aside>`;
}

function listenPage(route) {
  const episode = episodeById(route?.episode);
  const startAt = route?.time ?? null;
  const tabs = episodes
    .map(
      (entry) =>
        `<a class="episode-tab" href="#listen?episode=${entry.id}" ${entry === episode ? 'aria-current="page"' : ''}><b>${entry.short}</b><small>${entry.book} · ${Math.round(entry.duration / 60)} min</small></a>`,
    )
    .join('');
  return `<nav class="episode-tabs" aria-label="Episodes">${tabs}</nav>
    <p class="listen-episode-summary"><b>${episode.title}.</b> ${episode.summary}</p>
    <section class="listen-hero">
      <div class="listen-controls" id="listen-controls">
        <button type="button" class="listen-play" data-player="toggle" data-episode="${episode.id}" aria-label="Play ${episode.title}"><span class="play-glyph" aria-hidden="true">▶</span><span data-player="label">Play</span></button>
        <div class="listen-meta"><b data-player="episode">${episode.title}</b><span><span data-player="current">${formatTime(startAt || 0)}</span> / <span data-player="total">${formatTime(episode.duration)}</span></span></div>
        <label class="listen-speed">Speed <select data-player="rate"><option value="0.8">0.8×</option><option value="1" selected>1×</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option><option value="2">2×</option></select></label>
      </div>
      <input type="range" class="listen-seek" data-player="seek" min="0" max="${Math.floor(episode.duration)}" value="${startAt || 0}" step="1" aria-label="Seek" />
      <p class="listen-origin">${episode.origin}${episode.notebook ? ` · <a href="${episode.notebook}" target="_blank" rel="noopener noreferrer">Open the notebook ↗</a>` : ''} · <a href="${episode.file}" download>Download audio ↗</a></p>
    </section>
    <section class="listen-markers" aria-label="Chapter markers">
      <div class="section-heading"><span class="guide-kicker">Markers</span><h2>Where the conversation goes, and where to look</h2><p>Each marker seeks the audio. The link beside it opens the matching view without stopping playback. A source check says where the narration and the documentation part ways.</p></div>
      <ol class="marker-list">${episode.markers
        .map(
          (
            marker,
          ) => `<li data-marker-start="${marker.time}" data-marker-end="${marker.end}" data-episode="${episode.id}">
            <button type="button" data-seek="${marker.time}" data-episode="${episode.id}"><span class="marker-time">${formatTime(marker.time)}</span><b>${marker.title}</b></button>
            <p>${marker.copy}</p>
            ${marker.note ? `<p class="marker-note"><b>Source check.</b> ${marker.note}</p>` : ''}
            <a class="small-link" href="${marker.route}">${marker.routeLabel} →</a>
          </li>`,
        )
        .join('')}</ol>
    </section>
    <section class="listen-transcript" aria-label="Transcript">
      <div class="section-heading"><span class="guide-kicker">Transcript</span><h2>Read along</h2><p>Machine transcription; timestamps seek the audio. Read it with the marker notes in mind.</p></div>
      <details class="transcript-details"><summary>Show the transcript <span aria-hidden="true">+</span></summary>
      <div class="transcript" id="transcript">${episode.transcript
        .map(
          (segment) =>
            `<p data-start="${segment.start}"><button type="button" data-seek="${segment.start}" data-episode="${episode.id}" aria-label="Play from ${formatTime(segment.start)}">${formatTime(segment.start)}</button>${escapeHtml(segment.text)}</p>`,
        )
        .join('')}</div></details>
    </section>`;
}

// Short cues into the recordings, beside a map. Playing one never leaves the
// view; the dock appears and keeps playing while the reader explores.
// A cue plays its section and stops at the end of it. The chip carries the
// cue and its length; while it plays, the line under the chips names the
// section, its recording, and its source check, so a correction is read
// where the claim is heard.
export function listenChips(
  key,
  { kicker = 'Hear it explained', lead = '' } = {},
) {
  const cues = chapters[key].listen;
  if (!cues?.length) return '';
  const chips = cues
    .map((cue) => {
      const episode = episodeById(cue.episode);
      const marker = episode.markers.find((entry) => entry.time === cue.time);
      const end = cue.end ?? marker?.end ?? cue.time + 60;
      return `<button type="button" class="listen-chip" data-seek="${cue.time}" data-listen-episode="${episode.id}" data-listen-end="${end}" data-listen-stop="${end}"><span class="play-glyph" aria-hidden="true">▶</span><b>${escapeHtml(cue.label)}</b><small>${Math.max(1, Math.round((end - cue.time) / 60))} min</small></button>`;
    })
    .join('');
  return `<div class="listen-chips" aria-label="${escapeHtml(kicker)}"><span class="guide-kicker">${escapeHtml(kicker)}</span>${lead ? `<p class="listen-lead">${lead}</p>` : ''}<div class="listen-chip-row">${chips}<a class="small-link" href="#listen">All episodes →</a></div><p class="listen-now" data-listen-now aria-live="polite" hidden></p></div>`;
}

// Two maps of the whole course, each linking the lessons it draws.
export const courseMaps = [
  {
    id: 'round-trip',
    title: 'Down the stack, out to the fork, back in through the lock',
    summary:
      'The stack is a resource group with a cluster and data services in it. The fork is a repository whose branches are regenerated, integrated, and released by scheduled workflows. They meet at one object, the image lock, and that is where the running example crosses from one to the other.',
    render: () => roundTripFigure(),
  },
  {
    id: 'ladder',
    title: 'Six places, from the outside in',
    summary:
      'Everything in this site sits at one of these places. The resource group holds the Azure data services and the cluster side by side; the cluster holds namespaces, and a namespace holds services. The sixth place is not inside any of them: it is the source a service is built from, and lessons 04 to 06 are about it.',
    render: () => `${zoomLadder()}${ownerLegend()}`,
  },
];

// A short index by what the reader is trying to do. The course maps and native
// guides come first on the page; the supplied posters follow as references.
const guideIndex = [
  {
    need: 'See the whole course',
    ids: ['round-trip', 'ladder'],
  },
  {
    need: 'Bring up a stack',
    ids: [
      'owners',
      'timeline',
      'milestones',
      'inside-the-cluster',
      'profiles',
      'credentials',
    ],
  },
  {
    need: 'Identity and one request',
    ids: ['identity', 'familiar', 'one-request', 'backing-environment'],
  },
  {
    need: 'Provider code and the fork',
    ids: [
      'contribution-chain',
      'clocks',
      'labels',
      'permanent-fork',
      'continuous-forking',
    ],
  },
  {
    need: 'Prove a change in a stack',
    ids: ['borrow-prove-restore', 'blueprint'],
  },
];

function guideIndexNav() {
  const byId = (id) =>
    courseMaps.find((map) => map.id === id) ||
    nativeGuides.find((guide) => guide.id === id) ||
    suppliedPosters.find((poster) => poster.id === id);
  return `<nav class="guide-index" aria-label="Field guides by need">${guideIndex
    .map(
      (group) =>
        `<div><b>${group.need}</b><ul>${group.ids
          .map((id) => {
            const entry = byId(id);
            const poster = suppliedPosters.some((item) => item.id === id);
            return `<li><a href="${routeHref('field-guides')}?guide=${id}">${escapeHtml(entry.title)}</a>${poster ? '<small>poster</small>' : ''}</li>`;
          })
          .join('')}</ul></div>`,
    )
    .join('')}</nav>`;
}

function guidesPage() {
  return `${guideIndexNav()}
    <section class="course-maps" aria-label="Maps of the course">
      ${courseMaps
        .map(
          (
            map,
          ) => `<figure class="field-guide course-map" id="guide-${map.id}" data-guide="${map.id}">
        <figcaption><h2>${map.title}</h2><p>${map.summary}</p></figcaption>
        <div class="guide-body">${map.render()}</div>
      </figure>`,
        )
        .join('')}
    </section>
    <section class="guide-set" aria-label="Field guides built for this site">
      <div class="section-heading"><span class="guide-kicker">Built for this site</span><h2>${nativeGuides.length} field guides</h2><p>One idea each, built in HTML from the source documentation. Each also appears beside the view it explains. Print this page for the full set.</p></div>
      ${ownerLegend()}
      ${nativeGuides.map((guide) => guideFigure(guide.id)).join('')}
    </section>
    <section class="poster-set" aria-label="Supplied posters">
      <div class="section-heading"><span class="guide-kicker">Supplied references</span><h2>${suppliedPosters.length} posters</h2><p>Four supplied with the training material, two adopted from the source repositories, three built for this site. They are kept as given, including generated labels and misspellings. Each caption records where the poster and the documentation differ; the field guides above are the corrected version.</p></div>
      ${suppliedPosters
        .map(
          (poster) => `<article class="poster" id="guide-${poster.id}">
            <button type="button" class="poster-image" data-lightbox="${poster.image}" data-lightbox-title="${escapeHtml(poster.title)}" aria-label="Open ${escapeHtml(poster.title)} at full size"><img src="${poster.image}" width="${poster.width}" height="${poster.height}" alt="${escapeHtml(poster.title)}" loading="lazy" /><span aria-hidden="true">View large ⤢</span></button>
            <div class="poster-text">
              <span class="guide-kicker">${poster.origin}</span>
              <h3>${poster.title}</h3>
              <p>${poster.summary}</p>
              <h4>Take from it</h4>
              <ul>${poster.takeaways.map((item) => `<li>${item}</li>`).join('')}</ul>
              <h4>Read it with these checks</h4>
              <ul class="poster-notes">${poster.notes.map((item) => `<li>${item}</li>`).join('')}</ul>
              <p class="poster-explore">${poster.explore.map((link) => `<a href="${link.href}">${link.label} →</a>`).join('')}</p>
              ${sourceLinks(poster.sources)}
            </div>
          </article>`,
        )
        .join('')}
    </section>`;
}

export const pageRenderers = {
  home: homePage,
  myths: mythsPage,
  listen: listenPage,
  guides: guidesPage,
};

export function chapterNavigation(current) {
  const start = chapters.start;
  const groups = chapterGroups
    .filter((group) => group.numbered)
    .map((group) => {
      let number = 0;
      let book = null;
      const links = Object.entries(chapters)
        .filter(([, chapter]) => chapter.group === group.id)
        .map(([key, chapter]) => {
          number += 1;
          const kicker =
            group.numbered && chapter.book && chapter.book !== book
              ? `<span class="rail-book">${chapter.book}</span>`
              : '';
          book = chapter.book ?? book;
          return `${kicker}<a href="${routeHref(key)}" class="chapter-link" ${key === current ? 'aria-current="page"' : ''}>${group.numbered ? `<span class="number">${String(number).padStart(2, '0')}</span>` : '<span class="number" aria-hidden="true">·</span>'}<span>${chapter.title}<small>${chapter.subtitle}</small></span></a>`;
        })
        .join('');
      return `<div class="rail-group"><span class="rail-group-label">${group.label}</span>${links}</div>`;
    })
    .join('');
  return `<a href="${routeHref('start')}" class="chapter-link start-link" ${current === 'start' ? 'aria-current="page"' : ''}><span class="number" aria-hidden="true">⌂</span><span>${start.title}<small>${start.subtitle}</small></span></a>${groups}`;
}
