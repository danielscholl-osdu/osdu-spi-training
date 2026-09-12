import { escapeHtml } from './node.js';
import { chapters, chapterGroups } from '../content/chapters.js';
import { myths } from '../content/myths.js';
import { suppliedPosters, nativeGuides } from '../content/posters.js';
import { sources } from '../content/sources.js';
import { audio } from '../content/audio.js';
import { transcript } from '../content/transcript.js';
import { infographics, spineGuide, ownerLegend } from './infographics.js';
import { routeHref } from '../router.js';

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

function homePage() {
  const learn = Object.entries(chapters).filter(
    ([, chapter]) => chapter.group === 'learn',
  );
  return `<section class="home-spine" aria-label="From an empty subscription to an OSDU API">
      <div class="section-heading"><span class="guide-kicker">The whole picture</span><h2>From an empty subscription to an OSDU API</h2><p>Five places to stand. Each one is a view in this site.</p></div>
      ${spineGuide()}
      ${ownerLegend()}
    </section>
    <section class="home-ways" aria-label="Three ways in">
      <a class="way way-listen" href="${routeHref('listen')}"><span class="way-icon" aria-hidden="true">▶</span><b>Listen</b><p>A ${formatTime(audio.duration).replace(/^(\d+):(\d+):\d+$/, '$1 h $2 min')} deep dive that keeps playing while you explore.</p><span class="way-cta">Open the player →</span></a>
      <a class="way way-explore" href="${routeHref('running-stack')}"><span class="way-icon" aria-hidden="true">⌘</span><b>Explore</b><p>One architecture map, selectable component by component, through the whole lifecycle.</p><span class="way-cta">Start at the stack →</span></a>
      <a class="way way-read" href="${routeHref('field-guides')}"><span class="way-icon" aria-hidden="true">≋</span><b>Read</b><p>Field guides you can pin up, with the design guides and decision records behind them.</p><span class="way-cta">See the field guides →</span></a>
    </section>
    <section class="home-path" aria-label="The learning path">
      <div class="section-heading"><span class="guide-kicker">The path</span><h2>Five views, in order or not</h2><p>Each view ends with what you can now say, and where the documentation goes deeper.</p></div>
      <ol class="path-cards">${learn
        .map(
          ([key, chapter], index) =>
            `<li><a href="${routeHref(key)}"><span class="path-number">${String(index + 1).padStart(2, '0')}</span><b>${chapter.title}</b><small>${chapter.subtitle}</small><p>${chapter.headline.replace(/<span>/, ' ').replace(/<\/span>/, '')}</p></a></li>`,
        )
        .join('')}</ol>
    </section>
    <section class="home-myths" aria-label="Three things that are not true">
      <div class="section-heading"><span class="guide-kicker">Field checks</span><h2>Three things that are not true</h2><p>Plausible assumptions the documentation contradicts. There are ${myths.length}.</p></div>
      <div class="myth-grid">${myths
        .slice(0, 3)
        .map((myth) => mythCard(myth, true))
        .join('')}</div>
      <a class="small-link" href="${routeHref('not-true')}">Read all ${myths.length} →</a>
    </section>
    <section class="home-sources" aria-label="Documentation sets">
      <div class="section-heading"><span class="guide-kicker">Documentation</span><h2>Where the depth lives</h2></div>
      <div class="source-cards">
        <a href="${sources.architecture.href}" target="_blank" rel="noopener noreferrer"><b>osdu-spi-stack</b><p>Azure infrastructure, workload configuration, the spi CLI. Nine design guides and a register of decision records.</p><span>Architecture ↗</span></a>
        <a href="${sources.engineering.href}" target="_blank" rel="noopener noreferrer"><b>osdu-spi</b><p>The engineering system behind every service fork: sync, cascade, build, validation, and fork tiers.</p><span>Architecture overview ↗</span></a>
        <a href="${sources.forkDeploy.href}" target="_blank" rel="noopener noreferrer"><b>Fork deployment</b><p>How a service fork borrows a shared environment, proves a candidate image, and restores the pin.</p><span>Deployment contract ↗</span></a>
      </div>
    </section>`;
}

function mythsPage() {
  return `<div class="myth-grid is-full">${myths.map((myth) => mythCard(myth)).join('')}</div>`;
}

function listenPage(route) {
  const startAt = route?.time ?? null;
  return `<section class="listen-hero">
      <div class="listen-controls" id="listen-controls">
        <button type="button" class="listen-play" data-player="toggle" aria-label="Play the deep dive"><span class="play-glyph" aria-hidden="true">▶</span><span data-player="label">Play</span></button>
        <div class="listen-meta"><b>${audio.title}</b><span><span data-player="current">${formatTime(startAt || 0)}</span> / ${formatTime(audio.duration)}</span></div>
        <label class="listen-speed">Speed <select data-player="rate"><option value="0.8">0.8×</option><option value="1" selected>1×</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option><option value="2">2×</option></select></label>
      </div>
      <input type="range" class="listen-seek" data-player="seek" min="0" max="${Math.floor(audio.duration)}" value="${startAt || 0}" step="1" aria-label="Seek" />
      <p class="listen-origin">Generated with NotebookLM from the SPI Stack guide · <a href="${audio.notebook}" target="_blank" rel="noopener noreferrer">Open the notebook ↗</a> · <a href="${audio.file}" download>Download audio ↗</a></p>
    </section>
    <section class="listen-markers" aria-label="Chapter markers">
      <div class="section-heading"><span class="guide-kicker">Markers</span><h2>Where the conversation goes, and where to look</h2><p>Each marker seeks the audio. The link beside it opens the matching view without stopping playback.</p></div>
      <ol class="marker-list">${audio.markers
        .map(
          (
            marker,
          ) => `<li data-marker-start="${marker.time}" data-marker-end="${marker.end}">
            <button type="button" data-seek="${marker.time}"><span class="marker-time">${formatTime(marker.time)}</span><b>${marker.title}</b></button>
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
      <div class="transcript" id="transcript">${transcript
        .map(
          (segment) =>
            `<p data-start="${segment.start}"><button type="button" data-seek="${segment.start}" aria-label="Play from ${formatTime(segment.start)}">${formatTime(segment.start)}</button>${escapeHtml(segment.text)}</p>`,
        )
        .join('')}</div></details>
    </section>`;
}

function guidesPage() {
  return `<section class="poster-set" aria-label="Supplied posters">
      <div class="section-heading"><span class="guide-kicker">Supplied posters</span><h2>Two reference posters</h2><p>Open one at full size, or follow its links into the map.</p></div>
      ${suppliedPosters
        .map(
          (poster) => `<article class="poster" id="poster-${poster.id}">
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
      <div class="section-heading"><span class="guide-kicker">Built for this site</span><h2>${nativeGuides.length} field guides</h2><p>Each also appears beside the view it explains. Print this page for a set of posters.</p></div>
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
      const links = Object.entries(chapters)
        .filter(([, chapter]) => chapter.group === group.id)
        .map(([key, chapter]) => {
          number += 1;
          return `<a href="${routeHref(key)}" class="chapter-link" ${key === current ? 'aria-current="page"' : ''}>${group.numbered ? `<span class="number">${String(number).padStart(2, '0')}</span>` : '<span class="number" aria-hidden="true">·</span>'}<span>${chapter.title}<small>${chapter.subtitle}</small></span></a>`;
        })
        .join('');
      return `<div class="rail-group"><span class="rail-group-label">${group.label}</span>${links}</div>`;
    })
    .join('');
  return `<a href="${routeHref('start')}" class="chapter-link start-link" ${current === 'start' ? 'aria-current="page"' : ''}><span class="number" aria-hidden="true">⌂</span><span>${start.title}<small>${start.subtitle}</small></span></a>${groups}`;
}
