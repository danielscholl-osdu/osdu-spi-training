import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { chapters, chapterGroups } from '../src/content/chapters.js';
import { componentDetails } from '../src/content/component-details.js';
import { creationMoments } from '../src/content/creation-moments.js';
import { sources } from '../src/content/sources.js';
import { myths } from '../src/content/myths.js';
import { suppliedPosters, nativeGuides } from '../src/content/posters.js';
import { audio } from '../src/content/audio.js';
import { transcript } from '../src/content/transcript.js';
import { diagramRenderers } from '../src/components/diagrams.js';
import { architectureMap } from '../src/components/architecture.js';
import { infographics } from '../src/components/infographics.js';
import { parseRoute, routeHref } from '../src/router.js';
import { zoomLevels, spiMeanings } from '../src/content/concepts.js';
import { mythThemes } from '../src/content/myths.js';
import {
  zoomLadder,
  zoomStrip,
  spiNamesFigure,
} from '../src/components/infographics.js';

const mapChapters = Object.entries(chapters).filter(
  ([, chapter]) => chapter.kind === 'map',
);
const pageChapters = Object.entries(chapters).filter(
  ([, chapter]) => chapter.kind === 'page',
);

function verifyDetails(markup, context) {
  const ids = [...markup.matchAll(/data-detail="([^"]+)"/g)].map(
    (match) => match[1],
  );
  assert.ok(ids.length, `${context} has no explorable components`);
  assert.equal(
    new Set(ids).size,
    ids.length,
    `${context} has ambiguous component IDs`,
  );
  for (const id of ids)
    assert.ok(Object.hasOwn(componentDetails, id), `${context}: missing ${id}`);
}

function verifyRoute(href, context) {
  assert.match(href, /^#/, `${context}: ${href} is not a site route`);
  const route = parseRoute(href);
  assert.equal(
    route.chapter,
    href.slice(1).split(/[/?#]/)[0],
    `${context}: ${href} falls back to the start page`,
  );
  if (route.detail) {
    const scene = chapters[route.chapter];
    assert.equal(scene.kind, 'map', `${context}: ${href} selects on a page`);
    const markup = diagramRenderers[scene.diagram](route);
    const momentDefault = creationMoments.find(
      (moment) => moment.id === route.step,
    )?.detail;
    assert.ok(
      markup.includes(`data-detail="${route.detail}"`) ||
        route.detail === momentDefault,
      `${context}: ${href} names a component that is not on that map`,
    );
  }
  if (route.guide)
    assert.ok(
      nativeGuides.some((guide) => guide.id === route.guide),
      `${context}: ${href} names an unknown field guide`,
    );
}

test('chapters connect to renderers, explanations, and named sources', () => {
  for (const [id, chapter] of Object.entries(chapters)) {
    for (const field of ['title', 'subtitle', 'headline', 'intro'])
      assert.ok(chapter[field]?.trim(), `${id} is missing ${field}`);
    assert.ok(chapter.sources.length);
    for (const key of chapter.sources)
      assert.ok(sources[key], `${id}: missing source ${key}`);
    assert.ok(
      chapter.group === 'start' ||
        chapterGroups.some((group) => group.id === chapter.group),
      `${id}: unknown group`,
    );
  }
  for (const [id, chapter] of mapChapters) {
    for (const field of ['figure', 'scope'])
      assert.ok(chapter[field]?.trim(), `${id} is missing ${field}`);
    assert.equal(typeof diagramRenderers[chapter.diagram], 'function');
    assert.ok(Object.hasOwn(componentDetails, chapter.selected));
    verifyDetails(diagramRenderers[chapter.diagram](parseRoute(`#${id}`)), id);
    const guides = Array.isArray(chapter.guides)
      ? chapter.guides
      : Object.values(chapter.guides || {}).flat();
    if (!Array.isArray(chapter.guides))
      for (const step of Object.keys(chapter.guides || {}))
        assert.ok(
          creationMoments.some((moment) => moment.id === step),
          `${id}: guides keyed by unknown step ${step}`,
        );
    for (const guide of guides)
      assert.ok(
        suppliedPosters.some((entry) => entry.id === guide) ||
          nativeGuides.some((entry) => entry.id === guide),
        `${id}: unknown field guide ${guide}`,
      );
  }
  for (const [id, chapter] of pageChapters)
    assert.ok(chapter.page, `${id}: page chapter names no renderer`);
});

test('every explanation names an artifact and a source', () => {
  for (const [id, detail] of Object.entries(componentDetails)) {
    for (const field of ['label', 'title', 'body'])
      assert.ok(detail[field]?.trim(), `${id}: ${field}`);
    assert.ok(detail.artifact?.label?.trim(), `${id}: artifact label`);
    assert.ok(detail.artifact?.code?.trim(), `${id}: artifact`);
    assert.ok(sources[detail.source], `${id}: source`);
  }
});

test('every lifecycle state and request path has unambiguous component selections', () => {
  for (const path of ['developer', 'request'])
    verifyDetails(architectureMap(null, path), path);
  assert.equal(
    new Set(creationMoments.map((moment) => moment.id)).size,
    creationMoments.length,
  );
  for (const [index, moment] of creationMoments.entries()) {
    assert.ok(componentDetails[moment.detail], moment.id);
    assert.ok(moment.commands.length, `${moment.id}: commands`);
    verifyDetails(architectureMap(index), moment.name);
  }
});

test('deep links recover chapter, lifecycle moment, and component without module state', () => {
  const base = { guide: null, time: null };
  for (const moment of creationMoments) {
    assert.deepEqual(
      parseRoute(routeHref('bring-up', moment.id, moment.detail)),
      { chapter: 'bring-up', step: moment.id, detail: moment.detail, ...base },
    );
  }
  assert.deepEqual(parseRoute('#running-stack/request?detail=events'), {
    chapter: 'running-stack',
    step: 'request',
    detail: 'events',
    ...base,
  });
  assert.deepEqual(parseRoute('#bring-up'), {
    chapter: 'bring-up',
    step: 'start',
    detail: null,
    ...base,
  });
  assert.deepEqual(parseRoute('#listen?t=1234'), {
    chapter: 'listen',
    step: '',
    detail: null,
    guide: null,
    time: 1234,
  });
  assert.equal(parseRoute('#listen?t=-5').time, null);
  assert.equal(parseRoute('#listen?t=soon').time, null);
  assert.equal(parseRoute('#field-guides?guide=profiles').guide, 'profiles');
  for (const hash of ['', '#unknown', '#__proto__/inspect', '#start/unknown']) {
    assert.deepEqual(parseRoute(hash), {
      chapter: 'start',
      step: '',
      detail: null,
      ...base,
    });
  }
});

test('field checks name a source, a command, and a place on the site', () => {
  assert.equal(new Set(myths.map((myth) => myth.id)).size, myths.length);
  for (const myth of myths) {
    for (const field of ['claim', 'reality', 'check', 'routeLabel'])
      assert.ok(myth[field]?.trim(), `${myth.id}: ${field}`);
    assert.ok(sources[myth.source], `${myth.id}: source`);
    verifyRoute(myth.route, myth.id);
  }
});

test('audio markers are ordered, inside the recording, and point at real views', () => {
  assert.ok(audio.duration > 0);
  assert.match(audio.file, /^audio\/.+\.m4a$/);
  assert.equal(new URL(audio.notebook).protocol, 'https:');
  const publicFile = new URL(`../public/${audio.file}`, import.meta.url);
  assert.ok(existsSync(publicFile), `missing ${fileURLToPath(publicFile)}`);
  let previous = -1;
  for (const marker of audio.markers) {
    assert.ok(marker.time > previous, `${marker.title}: out of order`);
    assert.ok(marker.end > marker.time && marker.end <= audio.duration);
    for (const field of ['title', 'copy', 'routeLabel'])
      assert.ok(marker[field]?.trim(), `${marker.title}: ${field}`);
    verifyRoute(marker.route, marker.title);
    previous = marker.time;
  }
  assert.ok(transcript.length > 50, 'transcript is present');
  let last = -1;
  for (const segment of transcript) {
    assert.ok(segment.start >= last && segment.start < audio.duration);
    assert.ok(segment.text.trim());
    last = segment.start;
  }
});

test('posters and field guides resolve their images, renderers, sources, and links', () => {
  for (const poster of suppliedPosters) {
    const file = new URL(`../public/${poster.image}`, import.meta.url);
    assert.ok(existsSync(file), `${poster.id}: missing ${fileURLToPath(file)}`);
    assert.ok(poster.width > 0 && poster.height > 0, poster.id);
    assert.ok(poster.takeaways.length && poster.notes.length, poster.id);
    for (const key of poster.sources) assert.ok(sources[key], poster.id);
    for (const link of poster.explore) verifyRoute(link.href, poster.id);
  }
  for (const guide of nativeGuides) {
    assert.equal(typeof infographics[guide.id], 'function', guide.id);
    const markup = infographics[guide.id]();
    assert.ok(markup.trim().length > 200, `${guide.id}: renders nothing`);
    for (const key of guide.sources) assert.ok(sources[key], guide.id);
    verifyRoute(guide.appearsIn.href, guide.id);
  }
});

test('source links use readable documentation and match a sibling checkout when present', () => {
  for (const [key, source] of Object.entries(sources)) {
    const url = new URL(source.href);
    assert.equal(url.protocol, 'https:');
    assert.ok(source.label && source.repo && source.path, key);
    if (source.repo === 'osdu-spi') {
      assert.equal(url.hostname, 'azure.github.io', key);
      assert.ok(url.pathname.startsWith('/osdu-spi/'), key);
    } else
      assert.match(
        source.href,
        /^https:\/\/github.com\/Azure\/osdu-spi-stack\/blob\/main\//,
      );
    const checkout = new URL(`../../${source.repo}/`, import.meta.url);
    if (existsSync(checkout)) {
      const target = new URL(source.path, checkout);
      assert.ok(existsSync(target), `${key}: missing ${fileURLToPath(target)}`);
    }
  }
});

test('learn views state a question, what they build on, outcomes, and zoom levels', () => {
  const learn = Object.entries(chapters).filter(
    ([, chapter]) => chapter.group === 'learn',
  );
  for (const [id, chapter] of learn) {
    assert.ok(chapter.question?.trim(), `${id}: question`);
    assert.ok(chapter.builds?.trim(), `${id}: builds`);
    assert.ok(chapter.outcomes?.length >= 2, `${id}: outcomes`);
    assert.ok(chapter.zoom?.length, `${id}: zoom levels`);
    for (const level of chapter.zoom)
      assert.ok(
        zoomLevels.some((entry) => entry.id === level),
        `${id}: unknown zoom level ${level}`,
      );
  }
  for (const level of zoomLevels) {
    verifyRoute(level.href, `zoom level ${level.id}`);
    for (const key of level.chapters)
      assert.equal(chapters[key]?.group, 'learn', `${level.id}: ${key}`);
    assert.ok(
      level.chapters.some((key) => chapters[key].zoom.includes(level.id)),
      `${level.id}: no listed chapter works at this level`,
    );
  }
  for (const meaning of spiMeanings)
    verifyRoute(meaning.href, `SPI meaning ${meaning.id}`);
  assert.ok(zoomLadder().includes('zoom-source'));
  assert.match(zoomStrip(['service'], 'spi-boundary'), /is-active/);
  assert.ok(spiNamesFigure().split('<article').length === 4);
});

test('field checks are grouped by a theme that points back to a learn view', () => {
  for (const myth of myths)
    assert.ok(
      mythThemes.some((theme) => theme.id === myth.theme),
      `${myth.id}: unknown theme ${myth.theme}`,
    );
  for (const theme of mythThemes) {
    assert.ok(
      myths.some((myth) => myth.theme === theme.id),
      theme.id,
    );
    verifyRoute(theme.built.href, `theme ${theme.id}`);
  }
});

test('the familiar-things guide links every row to a component on the map', () => {
  const markup = infographics.familiar();
  const hrefs = [...markup.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(hrefs.length >= 7);
  for (const href of hrefs) verifyRoute(href, 'familiar guide');
});
