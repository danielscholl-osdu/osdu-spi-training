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
import { episodes, frameVideo } from '../src/content/audio.js';
import { diagramRenderers } from '../src/components/diagrams.js';
import { architectureMap } from '../src/components/architecture.js';
import { infographics } from '../src/components/infographics.js';
import { pageRenderers } from '../src/components/pages.js';
import { parseRoute, routeHref, chapterSteps } from '../src/router.js';
import { forkMoments } from '../src/content/fork-moments.js';
import { zoomLevels, spiMeanings } from '../src/content/concepts.js';
import { mythThemes } from '../src/content/myths.js';
import { zoomLadder, spiNamesFigure } from '../src/components/infographics.js';

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
      nativeGuides.some((guide) => guide.id === route.guide) ||
        suppliedPosters.some((poster) => poster.id === route.guide),
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
    const steps = chapterSteps(id);
    const flatten = (value, name) => {
      if (!value) return [];
      if (Array.isArray(value)) return value;
      for (const step of Object.keys(value))
        assert.ok(
          steps.includes(step),
          `${id}: ${name} keyed by unknown step ${step}`,
        );
      return Object.values(value).flat();
    };
    for (const guide of flatten(chapter.guides, 'guides'))
      assert.ok(
        suppliedPosters.some((entry) => entry.id === guide) ||
          nativeGuides.some((entry) => entry.id === guide),
        `${id}: unknown field guide ${guide}`,
      );
    const example = chapter.example;
    assert.ok(
      example?.title && example.code && example.hops?.length >= 3,
      `${id}: running example`,
    );
    for (const hop of example.hops) {
      const step = hop.step || example.step || steps[0] || '';
      const markup = diagramRenderers[chapter.diagram](
        parseRoute(`#${id}${step ? `/${step}` : ''}`),
      );
      assert.ok(
        markup.includes(`data-detail="${hop.detail}"`),
        `${id}: example hop ${hop.detail} is not on the map at ${step || 'default'}`,
      );
      assert.ok(
        componentDetails[hop.detail],
        `${id}: example hop ${hop.detail} has no explanation`,
      );
    }
    const mistakes = flatten(chapter.mistakes, 'mistakes');
    assert.ok(mistakes.length, `${id}: no easy mistake beside the map`);
    for (const mistake of mistakes)
      assert.ok(
        myths.some((myth) => myth.id === mistake),
        `${id}: unknown easy mistake ${mistake}`,
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
  const base = { guide: null, episode: null, time: null };
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
    episode: null,
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
  assert.equal(
    new Set(episodes.map((episode) => episode.id)).size,
    episodes.length,
  );
  for (const audio of episodes) {
    assert.ok(audio.duration > 0);
    assert.match(audio.file, /^audio\/.+\.m4a$/);
    if (audio.notebook)
      assert.equal(new URL(audio.notebook).protocol, 'https:');
    const publicFile = new URL(`../public/${audio.file}`, import.meta.url);
    assert.ok(existsSync(publicFile), `missing ${fileURLToPath(publicFile)}`);
    let previous = -1;
    for (const marker of audio.markers) {
      assert.ok(marker.time > previous, `${marker.title}: out of order`);
      assert.ok(marker.end > marker.time && marker.end <= audio.duration);
      for (const field of ['title', 'copy', 'routeLabel'])
        assert.ok(marker[field]?.trim(), `${marker.title}: ${field}`);
      verifyRoute(marker.route, `${audio.id}: ${marker.title}`);
      previous = marker.time;
    }
    assert.ok(
      audio.transcript.length > audio.duration / 60,
      `${audio.id}: transcript`,
    );
    let last = -1;
    for (const segment of audio.transcript) {
      assert.ok(segment.start >= last && segment.start < audio.duration);
      assert.ok(segment.text.trim());
      last = segment.start;
    }
  }
  for (const [id, chapter] of Object.entries(chapters)) {
    for (const cue of chapter.listen || []) {
      const episode = episodes.find((entry) => entry.id === cue.episode);
      assert.ok(episode, `${id}: unknown episode ${cue.episode}`);
      assert.ok(
        episode.markers.some((marker) => marker.time === cue.time),
        `${id}: cue ${cue.label} does not start on a marker`,
      );
    }
  }
  assert.equal(
    episodes[0].id,
    'orientation',
    'the orientation frames the rest',
  );
  const home = pageRenderers.home(parseRoute('#start'));
  assert.ok(
    home.includes('data-listen-episode="brief"') &&
      home.includes('data-listen-stop="112"'),
    'home carries the two-minute brief as its cue',
  );
  assert.ok(home.includes('data-frame-video'), 'home carries the video');
  for (const file of [
    frameVideo.file,
    frameVideo.poster,
    frameVideo.captions,
  ]) {
    const publicFile = new URL(`../public/${file}`, import.meta.url);
    assert.ok(existsSync(publicFile), `missing ${fileURLToPath(publicFile)}`);
  }
  assert.ok(frameVideo.duration > 0 && frameVideo.notes.length);
  assert.ok(home.includes('data-listen-now'), 'home cue has a live note line');
  assert.ok(
    home.indexOf('class="path-cards"') < home.indexOf('class="home-frame"'),
    'the path comes before the media on the start page',
  );
  assert.ok(!home.includes('Not quite'));
  assert.ok(
    !pageRenderers.myths(parseRoute('#not-true')).includes('Not quite'),
  );
  const guides = pageRenderers.guides(parseRoute('#field-guides'));
  assert.ok(
    guides.indexOf('class="guide-set"') < guides.indexOf('class="poster-set"'),
    'built guides come before the supplied posters',
  );
  for (const entry of [...nativeGuides, ...suppliedPosters])
    assert.ok(
      guides.includes(`?guide=${entry.id}"`),
      `guide index links ${entry.id}`,
    );
  const listen = pageRenderers.listen(parseRoute('#listen?episode=branches'));
  const branches = episodes.find((episode) => episode.id === 'branches');
  assert.ok(listen.includes(branches.title));
  assert.equal(
    listen.split('data-marker-start').length - 1,
    episodes.find((episode) => episode.id === 'branches').markers.length,
  );
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
    } else if (source.repo === 'osdu-spi-partition')
      assert.match(
        source.href,
        /^https:\/\/github.com\/Azure\/osdu-spi-partition(\/blob\/main\/|$)/,
      );
    else
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

test('learn views state a question, what they build on, their scope, and outcomes', () => {
  const learn = Object.entries(chapters).filter(
    ([, chapter]) => chapter.group === 'learn',
  );
  for (const [id, chapter] of learn) {
    assert.ok(chapter.question?.trim(), `${id}: question`);
    assert.ok(chapter.builds?.trim(), `${id}: builds`);
    assert.ok(chapter.outcomes?.length >= 2, `${id}: outcomes`);
    assert.ok(chapter.where?.trim(), `${id}: where`);
  }
  for (const level of zoomLevels) {
    verifyRoute(level.href, `zoom level ${level.id}`);
    for (const key of level.chapters)
      assert.equal(chapters[key]?.group, 'learn', `${level.id}: ${key}`);
  }
  for (const meaning of spiMeanings)
    verifyRoute(meaning.href, `SPI meaning ${meaning.id}`);
  const familiarMarkup = infographics.familiar();
  assert.ok(!familiarMarkup.includes('On the map'));
  assert.ok(familiarMarkup.includes('data-map-jump'));
  assert.equal(familiarMarkup.split('<details').length, 8);
  const ladder = zoomLadder();
  assert.ok(ladder.includes('zoom-source'));
  assert.ok(ladder.includes('zoom-siblings'));
  assert.ok(
    ladder.indexOf('id="zoom-cluster"') > ladder.indexOf('zoom-siblings'),
  );
  assert.deepEqual(
    spiMeanings.map((meaning) => meaning.id),
    ['stack', 'interface', 'engineering'],
  );
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
  const hrefs = [...markup.matchAll(/href="(#[^"]+)" data-map-jump/g)].map(
    (m) => m[1],
  );
  assert.ok(hrefs.length >= 7);
  for (const href of hrefs) verifyRoute(href, 'familiar guide');
});

test('the fork moments and the retired engineering route keep resolving', () => {
  for (const moment of forkMoments) {
    assert.ok(componentDetails[moment.detail], moment.id);
    assert.ok(moment.active.length, `${moment.id}: no active lane`);
    const markup = diagramRenderers.forkDay(
      parseRoute(`#fork-day/${moment.id}`),
    );
    assert.ok(markup.includes(`data-detail="${moment.detail}"`), moment.id);
    verifyDetails(markup, `fork-day/${moment.id}`);
  }
  const retired = {
    '#engineering-system?detail=delivery': ['handshake', '', 'delivery'],
    '#engineering-system?detail=repo': ['fork-shape', '', 'main-branch'],
    '#engineering-system?detail=image': ['fork-day', 'prove', 'candidate'],
    '#engineering-system?detail=stack-source': [
      'running-stack',
      'developer',
      'config-source',
    ],
    '#fork-day/review?detail=release-pr': [
      'fork-day',
      'review',
      'integration-pr',
    ],
    '#fork-day/template?detail=template-pr': [
      'fork-day',
      'sync',
      'template-pr',
    ],
  };
  for (const [href, [chapter, step, detail]] of Object.entries(retired)) {
    const route = parseRoute(href);
    assert.deepEqual(
      [route.chapter, route.step, route.detail],
      [chapter, step, detail],
    );
    const markup = diagramRenderers[chapters[chapter].diagram](route);
    assert.ok(markup.includes(`data-detail="${detail}"`), href);
  }
  for (const [id, chapter] of Object.entries(chapters))
    if (chapter.group === 'learn') assert.ok(chapter.book, `${id}: book`);
  const home = pageRenderers.home(parseRoute('#start'));
  assert.ok(home.includes('round-trip'));
  for (const key of ['fork-shape', 'fork-day', 'handshake'])
    assert.ok(home.includes(`href="#${key}`), `home links ${key}`);
});

test('structured claims resolve their focus, evidence, and scopes on every scene', () => {
  for (const [key, chapter] of mapChapters) {
    const claims = (chapter.outcomes || []).filter(
      (claim) => typeof claim !== 'string',
    );
    if (!claims.length) continue;
    assert.ok(chapter.goal, `${key}: goal`);
    for (const step of chapterSteps(key).length ? chapterSteps(key) : [null]) {
      const markup = diagramRenderers[chapter.diagram]({ chapter: key, step });
      const details = new Set(
        [...markup.matchAll(/data-detail="([^"]+)"/g)].map((match) => match[1]),
      );
      const scopes = new Set(
        [...markup.matchAll(/data-scope="([^"]+)"/g)].map((match) => match[1]),
      );
      claims.forEach((claim, index) => {
        assert.ok(
          Array.isArray(claim.focus) && Array.isArray(claim.scopes),
          `${key}: claim ${index} focus and scopes are arrays`,
        );
        assert.equal(
          typeof claim.crossing,
          'string',
          `${key}: claim ${index} crossing label`,
        );
        assert.ok(claim.text && claim.why, `${key}: claim copy`);
        for (const id of [...claim.focus, claim.evidence])
          assert.ok(details.has(id), `${key}/${step}: claim detail ${id}`);
        for (const id of claim.scopes)
          assert.ok(scopes.has(id), `${key}/${step}: claim scope ${id}`);
      });
    }
  }
});
