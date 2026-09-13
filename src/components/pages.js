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
  const { activity, variants } = chapter.tryIt;
  const summary =
    variants.length === 1
      ? `${variants[0].access} · ${variants[0].time.active}`
      : variants
          .map(
            (variant) =>
              `${variant.label}: ${variant.access} · ${variant.time.active}`,
          )
          .join(' · ');
  return `<section class="try-it" aria-label="Try it: ${escapeHtml(activity)}">
    <details>
      <summary><span>Try it: ${escapeHtml(activity)}</span><small> · ${escapeHtml(summary)}</small></summary>
      <div class="try-it-body">
        <p class="try-it-safety">You run this activity in your own account. This site executes nothing and reports no live environment state.</p>
        <div class="try-it-variants">${variants
          .map((variant, index) =>
            tryItVariant(variant, index, variants.length),
          )
          .join('')}</div>
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

export function posterInline(id) {
  const poster = suppliedPosters.find((entry) => entry.id === id);
  if (!poster) return '';
  return `<figure class="field-guide is-compact is-poster" id="guide-${id}" data-guide="${id}">
    <figcaption><span class="guide-kicker">Poster</span><h3>${poster.title}</h3><p>${poster.summary}</p></figcaption>
    ${poster.inline ? `<p class="poster-inline-note">${escapeHtml(poster.inline)}</p>` : ''}
    <a class="poster-inline" href="${routeHref('field-guides')}?guide=${id}"><img src="${poster.image}" width="${poster.width}" height="${poster.height}" alt="${escapeHtml(poster.title)}" loading="lazy" /><span>Read the poster with its notes →</span></a>
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

function pathCards() {
  const learn = Object.entries(chapters).filter(
    ([, chapter]) => chapter.group === 'learn',
  );
  return `<ol class="path-cards">${learn
    .map(
      ([key, chapter], index) =>
        `<li class="path-book-${chapter.book.toLowerCase().replace(/\s+/g, '-')}"><a href="${routeHref(key)}"><span class="path-number">${String(index + 1).padStart(2, '0')}</span><small>${chapter.book}</small><b>${chapter.title}</b><em>${escapeHtml(chapter.question)}</em></a></li>`,
    )
    .join('')}</ol>`;
}

// The introduction at three depths: the two-minute brief as the page's cue,
// a one-minute video in its own element, and a link to the full orientation.
// The video pauses the audio dock and the dock pauses it.
function frameSection() {
  const conversation = episodeById('orientation');
  return `<section class="home-frame" aria-label="The introduction, three minutes">
      <div class="home-frame-copy">
        <span class="guide-kicker">The introduction · three minutes</span>
        <h2>Who maintains the Azure provider now, and where a change to it is proved.</h2>
        <p>The one-minute video draws the split, the service forks, the candidate image, and the borrowed slot in a live stack. The two-minute brief, playable from the top of this page, tells the same story while you read. Both are generated from the introduction source; the source checks under the video say where its narration overreaches.</p>
        <p class="home-frame-more"><a href="#listen?episode=${conversation.id}">${escapeHtml(conversation.short)} →</a><span>${escapeHtml(conversation.title)}: the full conversation, ${Math.round(conversation.duration / 60)} minutes, cued from the views as you go.</span></p>
      </div>
      <figure class="home-frame-video">
        <video controls preload="metadata" playsinline poster="${frameVideo.poster}" width="${frameVideo.width}" height="${frameVideo.height}" aria-label="${escapeHtml(frameVideo.title)}" data-frame-video>
          <source src="${frameVideo.file}" type="video/mp4" />
          <track kind="captions" src="${frameVideo.captions}" srclang="en" label="English" default />
        </video>
        <figcaption><span class="guide-kicker">Watch · one minute</span><b>${escapeHtml(frameVideo.title)}</b><p>${escapeHtml(frameVideo.summary)}</p><details class="frame-notes"><summary>Source checks (${frameVideo.notes.length})</summary><ul>${frameVideo.notes.map((note) => `<li>${escapeHtml(note)}</li>`).join('')}</ul></details></figcaption>
      </figure>
    </section>`;
}

function homePage() {
  const start = chapters.start;
  return `<p class="home-checked">Checked against the published docs and source, ${escapeHtml(start.checked)}. Each view links the pages and code it draws on.</p>
    <section class="home-start" aria-label="Where to begin">
      <div class="home-start-copy">
        <span class="guide-kicker">Start</span>
        <p>Six views in order, then the assumptions that cost an afternoon. The running example is a partition lookup for opendes and the cache fallback that keeps it answering; it starts real and turns illustrative at 04.</p>
        <div class="doors">
          <a class="door" href="${routeHref('running-stack')}"><span class="door-kicker">Just bring up OSDU on Azure</span><b>Start at 01 · What is a stack? →</b><p>Views 01 and 02. spi up builds the environment and records every service image in the lock; you never touch a fork.</p></a>
          <a class="door door-fork" href="${routeHref('spi-boundary')}"><span class="door-kicker">Maintain or mirror a service fork</span><b>Start at 03 · The SPI boundary →</b><p>Views 03 to 06. The fork proves a change by borrowing a slot in a running stack, so you need one.</p></a>
        </div>
        <a class="home-cta-alt" href="${routeHref('running-stack', 'request')}">Or trace one API request through the stack first</a>
      </div>
      <div class="home-start-media">
        <span class="guide-kicker">The introduction · three minutes</span>
        <button type="button" class="home-watch" data-play-frame-video><img src="${frameVideo.poster}" alt="" width="44" height="78" loading="lazy" /><span><b>Watch · one minute</b><small>${escapeHtml(frameVideo.title)}</small></span></button>
        ${listenChips('start', { kicker: 'Listen · two minutes' })}
      </div>
    </section>
    <section class="home-path" aria-label="The learning path">
      <div class="section-heading"><span class="guide-kicker">The path</span><h2>Six views, in order, then the checks</h2><p>Each view builds on the one before; 07 collects the assumptions the documentation contradicts. Take them in order the first time. After that, any of them stands alone.</p></div>
      ${pathCards()}
    </section>
    ${frameSection()}
    <section class="home-loop" id="guide-round-trip" aria-label="The round trip">
      <div class="section-heading"><span class="guide-kicker">The shape of the site</span><h2>Down the stack, out to the fork, back in through the lock</h2><p>The stack is a resource group with a cluster and data services in it. The fork is a repository whose branches are regenerated, integrated, and released by scheduled workflows. They meet at one object, the image lock, and that is where the running example crosses from one to the other.</p></div>
      ${roundTripFigure()}
    </section>
    <section class="home-names" aria-label="One word, three things">
      <div class="section-heading"><span class="guide-kicker">The word</span><h2>SPI means three things here</h2><p>They are related, and the site says which one it means. In the order the views meet them: the environment, the interface, the engineering system.</p></div>
      ${spiNamesFigure()}
    </section>
    <section class="home-zoom" id="guide-ladder" aria-label="From the subscription to the source">
      <div class="section-heading"><span class="guide-kicker">The mental map</span><h2>Six places, from the outside in</h2><p>Everything in this site sits at one of these places. The resource group holds the Azure data services and the cluster side by side; the cluster holds namespaces, and a namespace holds services. The sixth place is not inside any of them: it is the source a service is built from, and views 04 to 06 are about it.</p></div>
      ${zoomLadder()}
      ${ownerLegend()}
    </section>
    <section class="home-ways" aria-label="Alongside the path">
      <a class="way way-listen" href="${routeHref('listen')}"><span class="way-icon" aria-hidden="true">▶</span><b>Listen</b><p>Four generated recordings, from a two-minute brief to hour-long discussions. Playback continues while you explore, every marker opens the matching view, and the map views carry short cues.</p><span class="way-cta">Open the player →</span></a>
      <a class="way way-read" href="${routeHref('field-guides')}"><span class="way-icon" aria-hidden="true">≋</span><b>Field guides</b><p>The infographics from the views and the supplied posters, indexed by what you are trying to do, on one page you can print.</p><span class="way-cta">See the field guides →</span></a>
    </section>
    <section class="home-sources" aria-label="Source documentation">
      <div class="section-heading"><span class="guide-kicker">Documentation</span><h2>Source documentation</h2><p>Three repositories. The stack and the engineering system are two of the three meanings of SPI; the interface lives inside each service fork, and the partition fork is the reference.</p></div>
      <div class="source-cards">
        <a href="${sources.architecture.href}" target="_blank" rel="noopener noreferrer"><b>osdu-spi-stack</b><p>Azure infrastructure, workload configuration, the spi CLI. Nine design guides and a register of decision records.</p><span>Architecture ↗</span></a>
        <a href="${sources.partitionRepo.href}" target="_blank" rel="noopener noreferrer"><b>osdu-spi-partition</b><p>The reference service fork: shared code regenerated from upstream, the Azure provider behind the interface, and the acceptance descriptor it has not written yet.</p><span>Repository ↗</span></a>
        <a href="${sources.engineering.href}" target="_blank" rel="noopener noreferrer"><b>osdu-spi</b><p>The engineering system behind every service fork: sync, cascade, build, validation, and fork tiers.</p><span>Architecture overview ↗</span></a>
      </div>
    </section>`;
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
  if (!hasClaims(chapter)) return '';
  return `<section class="claims" aria-label="Lesson claims">
    <p class="guide-kicker">Select an idea to highlight it on the map.</p>
    <ol class="claim-list">${chapter.outcomes
      .map((claim, index) => {
        const c = typeof claim === 'string' ? { text: claim } : claim;
        return `<li class="claim-item" data-claim-item="${index}"><button type="button" class="claim" data-claim="${index}" aria-pressed="${index === 0}"><b>${escapeHtml(c.headline || c.text)}</b><small>${escapeHtml(c.why || '')}</small><span class="claim-count">${index + 1} / ${chapter.outcomes.length}</span></button>${c.evidence ? `<a class="claim-evidence" data-evidence="${index}" href="${routeHref(key, c.evidenceStep || c.step || '', c.evidence, { claim: index })}">How we know →</a>` : ''}</li>`;
      })
      .join('')}</ol>
  </section>`;
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
    <div class="outcomes-head"><span class="guide-kicker">Carry forward</span><h2>What you can now say</h2></div>
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
  if (hasClaims(chapter))
    return `<div class="lesson-orientation"><div><span class="guide-kicker">This lesson answers</span><p>${escapeHtml(chapter.question)}</p></div><div><span class="guide-kicker">By the end</span><p>${escapeHtml(chapter.goal)}</p></div></div>`;
  if (!chapter.where) return '';
  return `<p class="view-question"><span>This view answers</span>${escapeHtml(chapter.question || '')}${chapter.builds ? ` <em>${escapeHtml(chapter.builds)}</em>` : ''}</p>
  <p class="view-scope"><span>In this view</span>${escapeHtml(chapter.where)} <a href="#start?guide=ladder">See the six places →</a></p>`;
}

// The running example, drawn as hops above the map. Each hop selects a
// component on the map; the current hop and the ones before it are marked.
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
  if (hasClaims(chapters[key])) {
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
    return `<details class="example-disclosure"><summary>Running example: ${escapeHtml(example.title)} → <code>${escapeHtml(example.code)}</code></summary>
    ${variantControls}
    <p class="example-crossing" data-example-crossing>${escapeHtml(presentation.crossing)}</p>
    <ol class="journey" aria-label="${escapeHtml(example.title)}">${presentation.hops.map((hop, index) => `<li><a href="${routeHref(key, hop.step || example.step || route.step, hop.detail, { hop: index })}" data-map-jump data-hop="${index}" title="${escapeHtml(hop.copy)}" aria-label="${escapeHtml(`${index + 1}. ${hop.label}: ${hop.copy}`)}"><span>${index + 1}</span><b>${escapeHtml(hop.label)}</b><small data-hop-copy="${hop.detail}">${escapeHtml(hop.copy)}</small></a></li>`).join('')}</ol>
    <p class="example-note"><span class="example-provider-path">${escapeHtml(example.providerPath || '')}</span> <span data-example-note>${escapeHtml(presentation.note)}</span></p></details>`;
  }
  const current = hopIndexForRoute(chapters[key], route);
  return `<div class="example-head"><span class="guide-kicker">Running example</span><b>${escapeHtml(example.title)}</b><code>${escapeHtml(example.code)}</code></div>
    <ol class="journey" aria-label="${escapeHtml(example.title)}">${example.hops
      .map((hop, index) => {
        const state =
          index === current ? 'is-current' : index < current ? 'is-done' : '';
        return `<li class="${state}"><a href="${routeHref(key, hop.step || example.step || route.step, hop.detail)}" data-map-jump ${index === current ? 'aria-current="true"' : ''}><span>${index + 1}</span><b>${escapeHtml(hop.label)}</b><small>${escapeHtml(hop.copy)}</small></a></li>`;
      })
      .join('')}</ol>
    <p class="example-note">${escapeHtml(example.providerPath || '')} ${escapeHtml(example.note)}</p>`;
}

// One entry from the myths, directly under the map. A link back into the same
// view says that the page will move; links to other views navigate as usual.
export function mythCallout(id, chapterKey) {
  const myth = myths.find((entry) => entry.id === id);
  if (!myth) return '';
  const source = sources[myth.source];
  const route = parseRoute(myth.route);
  const sameView = route.chapter === chapterKey;
  const chapter = chapters[chapterKey];
  const claim = (chapter.outcomes || []).findIndex(
    (entry) =>
      claimMatchesStep(entry, route) && entry.focus?.includes(route.detail),
  );
  const href =
    sameView && claim >= 0 && hopIndexForRoute(chapter, route) >= 0
      ? routeHref(route.chapter, route.step, route.detail, { claim })
      : myth.route;
  return `<aside class="easy-mistake" aria-label="Easy mistake">
    <div class="easy-mistake-head"><span class="guide-kicker">Easy mistake</span><a href="${routeHref('not-true')}">All ${myths.length}, by theme →</a></div>
    <p class="myth-claim">“${myth.claim}”</p>
    <p class="myth-reality">${myth.reality}</p>
    <code class="myth-check">${escapeHtml(myth.check)}</code>
    <p class="myth-links"><a href="${href}" ${sameView ? 'data-map-jump' : ''}>${sameView ? 'Show it on the map ↑' : `${myth.routeLabel} →`}</a><a href="${source.href}" target="_blank" rel="noopener noreferrer">${source.label} ↗</a></p>
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
// A cue plays its section and stops at the end of it. While it plays, the
// line under the chips names the section and shows its source check, so a
// correction is read where the claim is heard.
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
      const checks = episode.markers.filter(
        (entry) => entry.note && entry.time >= cue.time && entry.time < end,
      ).length;
      return `<button type="button" class="listen-chip" data-seek="${cue.time}" data-listen-episode="${episode.id}" data-listen-end="${end}" data-listen-stop="${end}"><span class="play-glyph" aria-hidden="true">▶</span><b>${escapeHtml(cue.label)}</b><small>${episode.short} · ${formatTime(cue.time)} · ${Math.max(1, Math.round((end - cue.time) / 60))} min${checks ? ` · <i class="chip-check">${checks} source check${checks > 1 ? 's' : ''}</i>` : ''}</small></button>`;
    })
    .join('');
  return `<div class="listen-chips" aria-label="${escapeHtml(kicker)}"><span class="guide-kicker">${escapeHtml(kicker)}</span>${lead ? `<p class="listen-lead">${lead}</p>` : ''}<div class="listen-chip-row">${chips}<a class="small-link" href="#listen">All episodes →</a></div><p class="listen-now" data-listen-now aria-live="polite" hidden></p></div>`;
}

// A short index by what the reader is trying to do. Native guides come first
// on the page; the supplied posters follow as references.
const guideIndex = [
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
