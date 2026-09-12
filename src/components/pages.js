import { escapeHtml } from './node.js';
import { chapters, chapterGroups } from '../content/chapters.js';
import { myths, mythThemes } from '../content/myths.js';
import { suppliedPosters, nativeGuides } from '../content/posters.js';
import { sources } from '../content/sources.js';
import { episodes, episodeById } from '../content/audio.js';
import {
  infographics,
  ownerLegend,
  zoomLadder,
  spiNamesFigure,
  roundTripFigure,
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

function sourceLinks(keys) {
  return `<p class="guide-sources">Sources: ${keys
    .map(
      (key) =>
        `<a href="${sources[key].href}" target="_blank" rel="noopener noreferrer">${sources[key].label} ↗</a>`,
    )
    .join(' · ')}</p>`;
}

export function posterInline(id) {
  const poster = suppliedPosters.find((entry) => entry.id === id);
  if (!poster) return '';
  return `<figure class="field-guide is-compact is-poster" id="guide-${id}" data-guide="${id}">
    <figcaption><span class="guide-kicker">Poster</span><h3>${poster.title}</h3><p>${poster.summary}</p></figcaption>
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

function mythCard(myth, compact = false) {
  const source = sources[myth.source];
  return `<article class="myth" id="myth-${myth.id}">
    <p class="myth-claim">“${myth.claim}”</p>
    <p class="myth-reality"><b>Not quite.</b> ${myth.reality}</p>
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
        `<li class="path-book-${chapter.book.toLowerCase().replace(/\s+/g, '-')}"><a href="${routeHref(key)}"><span class="path-number">${String(index + 1).padStart(2, '0')}</span><small>${chapter.book}</small><b>${chapter.title}</b><em>${escapeHtml(chapter.question)}</em><p><span>You leave able to say</span>${escapeHtml(chapter.outcomes[0])}</p></a></li>`,
    )
    .join('')}</ol>`;
}

function homePage() {
  const learnCount = Object.values(chapters).filter(
    (chapter) => chapter.group === 'learn',
  ).length;
  const words = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
  ];
  return `<section class="home-start" aria-label="Where to begin">
      <div class="home-start-copy"><span class="guide-kicker">Where to begin</span><h2>Follow one OSDU request down to its Azure provider. Then follow a fix to that provider back into a running stack.</h2><p>${words[learnCount]} views, each answering one question, each ending with what you can now say. The running example is real: a partition lookup, and the cache fallback that keeps it answering.</p></div>
      <div class="home-start-actions"><a class="home-cta" href="${routeHref('running-stack')}">Start with 01 · What is a stack? →</a><a class="home-cta-alt" href="${routeHref('running-stack', 'request')}">Or trace one API request through it first</a></div>
      ${listenChips('start', {
        kicker: 'Hear the frame first',
        lead: 'Two and a half minutes from the orientation conversation: the request this site follows, and the three things SPI means here. It keeps playing while you read this page, and stops when the section ends.',
      })}
    </section>
    <section class="home-path" aria-label="The learning path">
      <div class="section-heading"><span class="guide-kicker">The path</span><h2>${words[learnCount]} views, in order</h2><p>Each builds on the one before. Take them in order the first time; after that, any of them stands alone.</p></div>
      ${pathCards()}
    </section>
    <section class="home-loop" id="guide-round-trip" aria-label="The round trip">
      <div class="section-heading"><span class="guide-kicker">The shape of the site</span><h2>Down the stack, out to the fork, back in through the lock</h2><p>The stack is a place: a resource group with a cluster and data services in it. The fork is a schedule: branches that are regenerated, integrated, and released. They touch at one object, the image lock, and that is where the running example crosses from one to the other.</p></div>
      ${roundTripFigure()}
    </section>
    <section class="home-doors" aria-label="Two reasons to be here">
      <div class="section-heading"><span class="guide-kicker">Two reasons to be here</span><h2>The stack stands alone. The engineering system does not.</h2></div>
      <div class="doors">
        <a class="door" href="${routeHref('running-stack')}"><span class="door-kicker">Just bring up OSDU on Azure</span><b>Views 01 and 02 are enough.</b><p>spi up builds the environment and pins every service image by digest. Each service runs the community image unless that service has been promoted to its fork, a choice recorded on the resource group. You never touch a fork.</p><span class="way-cta">Start at 01 →</span></a>
        <a class="door door-fork" href="${routeHref('spi-boundary')}"><span class="door-kicker">Maintain or mirror a service fork</span><b>Views 03 to 06, and you will need a stack.</b><p>The fork owns the Azure provider and the workflows around it. To prove a change it borrows a slot in a running stack, so the stack comes first even when the fork is your job.</p><span class="way-cta">Start at 03 →</span></a>
      </div>
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
      <a class="way way-listen" href="${routeHref('listen')}"><span class="way-icon" aria-hidden="true">▶</span><b>Listen</b><p>Three generated conversations, about ${Math.round(episodes.reduce((sum, episode) => sum + episode.duration, 0) / 3600)} hours in all, that keep playing while you explore. Every marker opens the matching view, and the fork views carry short cues into them.</p><span class="way-cta">Open the player →</span></a>
      <a class="way way-read" href="${routeHref('field-guides')}"><span class="way-icon" aria-hidden="true">≋</span><b>Field guides</b><p>The infographics from the views, together with the supplied posters, on one page you can print.</p><span class="way-cta">See the field guides →</span></a>
    </section>
    <section class="home-sources" aria-label="Documentation sets">
      <div class="section-heading"><span class="guide-kicker">Documentation</span><h2>Where the depth lives</h2><p>Three repositories, matching the three meanings above.</p></div>
      <div class="source-cards">
        <a href="${sources.architecture.href}" target="_blank" rel="noopener noreferrer"><b>osdu-spi-stack</b><p>Azure infrastructure, workload configuration, the spi CLI. Nine design guides and a register of decision records.</p><span>Architecture ↗</span></a>
        <a href="${sources.ownership.href}" target="_blank" rel="noopener noreferrer"><b>osdu-spi-partition</b><p>The reference service fork: shared code, the Azure provider behind the interface, and the acceptance descriptor.</p><span>Why Azure source belongs to the fork ↗</span></a>
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

export function chapterOutcomes(key) {
  const chapter = chapters[key];
  if (!chapter.outcomes) return '';
  const learn = Object.keys(chapters).filter(
    (id) => chapters[id].group === 'learn',
  );
  const next = learn[learn.indexOf(key) + 1];
  return `<section class="outcomes" aria-label="What you can now say">
    <div class="outcomes-head"><span class="guide-kicker">Carry forward</span><h2>What you can now say</h2></div>
    <ol>${chapter.outcomes.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ol>
    ${next ? `<p class="outcomes-next"><b>Next, ${chapters[next].title}</b> asks: ${escapeHtml(chapters[next].question)} <span>${escapeHtml(chapters[next].builds)}</span></p>` : ''}
  </section>`;
}

export function chapterScope(key) {
  const chapter = chapters[key];
  if (!chapter.where) return '';
  return `<p class="view-scope"><span>In this view</span>${escapeHtml(chapter.where)} <a href="#start?guide=ladder">See the six places →</a></p>`;
}

// The running example, drawn as hops above the map. Each hop selects a
// component on the map; the current hop and the ones before it are marked.
export function exampleStrip(key, route) {
  const example = chapters[key].example;
  if (!example) return '';
  const current = example.hops.findIndex(
    (hop) =>
      hop.detail === route.detail &&
      (!hop.step || hop.step === route.step) &&
      (!example.step || example.step === route.step),
  );
  return `<div class="example-head"><span class="guide-kicker">Running example</span><b>${escapeHtml(example.title)}</b><code>${escapeHtml(example.code)}</code></div>
    <ol class="journey" aria-label="${escapeHtml(example.title)}">${example.hops
      .map((hop, index) => {
        const state =
          index === current ? 'is-current' : index < current ? 'is-done' : '';
        return `<li class="${state}"><a href="${routeHref(key, hop.step || example.step || route.step, hop.detail)}" data-map-jump ${index === current ? 'aria-current="true"' : ''}><span>${index + 1}</span><b>${escapeHtml(hop.label)}</b><small>${escapeHtml(hop.copy)}</small></a></li>`;
      })
      .join('')}</ol>
    <p class="example-note">${escapeHtml(example.note)}</p>`;
}

// One entry from the myths, directly under the map. A link back into the same
// view says that the page will move; links to other views navigate as usual.
export function mythCallout(id, chapterKey) {
  const myth = myths.find((entry) => entry.id === id);
  if (!myth) return '';
  const source = sources[myth.source];
  const sameView = parseRoute(myth.route).chapter === chapterKey;
  return `<aside class="easy-mistake" aria-label="Easy mistake">
    <div class="easy-mistake-head"><span class="guide-kicker">Easy mistake</span><a href="${routeHref('not-true')}">All ${myths.length}, by theme →</a></div>
    <p class="myth-claim">“${myth.claim}”</p>
    <p class="myth-reality"><b>Not quite.</b> ${myth.reality}</p>
    <code class="myth-check">${escapeHtml(myth.check)}</code>
    <p class="myth-links"><a href="${myth.route}" ${sameView ? 'data-map-jump' : ''}>${sameView ? 'Show it on the map ↑' : `${myth.routeLabel} →`}</a><a href="${source.href}" target="_blank" rel="noopener noreferrer">${source.label} ↗</a></p>
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
  return `<div class="listen-chips" aria-label="${escapeHtml(kicker)}"><span class="guide-kicker">${escapeHtml(kicker)}</span>${lead ? `<p class="listen-lead">${lead}</p>` : ''}<div class="listen-chip-row">${chips}<a class="small-link" href="#listen">All three episodes →</a></div><p class="listen-now" data-listen-now aria-live="polite" hidden></p></div>`;
}

function guidesPage() {
  return `<section class="poster-set" aria-label="Supplied posters">
      <div class="section-heading"><span class="guide-kicker">Posters</span><h2>${suppliedPosters.length} posters, one idea each</h2><p>Four supplied with the training material, two adopted from the source repositories, three built for this site. Open one at full size, or follow its links into the map. Each caption records where the poster and the documentation differ.</p></div>
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
    </section>
    <section class="guide-set" aria-label="Field guides built for this site">
      <div class="section-heading"><span class="guide-kicker">Built for this site</span><h2>${nativeGuides.length} field guides</h2><p>Smaller, one idea each, built in HTML. Each also appears beside the view it explains. Print this page for the full set.</p></div>
      ${ownerLegend()}
      ${nativeGuides.map((guide) => guideFigure(guide.id)).join('')}
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
