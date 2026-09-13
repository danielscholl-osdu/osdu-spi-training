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
import {
  architectureMap,
  creationWalkthrough,
} from '../src/components/architecture.js';
import { infographics } from '../src/components/infographics.js';
import { escapeHtml } from '../src/components/node.js';
import {
  chapterOutcomes,
  chapterScope,
  claimIndexForRoute,
  claimStrip,
  detailSourceLinks,
  exampleStrip,
  hopIndexForRoute,
  pageRenderers,
  resolveExamplePresentation,
  selectExampleVariant,
} from '../src/components/pages.js';
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
const partitionSourcePattern =
  /^https:\/\/github.com\/Azure\/osdu-spi-partition(?:\/blob\/main\/|\/commit\/[0-9a-f]{40}$|$)/;

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
    assert.ok(
      markup.includes(`data-detail="${route.detail}"`),
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
    for (const source of detail.goDeeper || [])
      assert.ok(sources[source], `${id}: Go deeper source ${source}`);
  }
});

test('Go deeper links preserve evidence order and single-source fallback', () => {
  const ordered = detailSourceLinks(componentDetails.azureimpl);
  const expected = componentDetails.azureimpl.goDeeper.map(
    (key) => sources[key].href,
  );
  assert.deepEqual(
    [...ordered.matchAll(/href="([^"]+)"/g)].map((match) => match[1]),
    expected,
  );

  const fallback = detailSourceLinks(componentDetails.contract);
  assert.deepEqual(
    [...fallback.matchAll(/href="([^"]+)"/g)].map((match) => match[1]),
    [sources[componentDetails.contract.source].href],
  );
  assert.match(ordered, /target="_blank" rel="noopener noreferrer"/);
  assert.throws(
    () =>
      detailSourceLinks({
        source: 'partitionProvider',
        goDeeper: ['missing-source'],
      }),
    /Unknown source key: missing-source/,
  );
});

test('every lifecycle state and request path has unambiguous component selections', () => {
  const momentIds = [
    'start',
    'provision',
    'bootstrap',
    'reconcile',
    'inspect',
    'remove',
  ];
  for (const path of ['developer', 'request'])
    verifyDetails(architectureMap(null, path), path);
  assert.equal(
    new Set(creationMoments.map((moment) => moment.id)).size,
    creationMoments.length,
  );
  assert.deepEqual(
    creationMoments.map((moment) => moment.id),
    momentIds,
  );
  for (const [index, moment] of creationMoments.entries()) {
    assert.ok(componentDetails[moment.detail], moment.id);
    assert.ok(moment.commands.length, `${moment.id}: commands`);
    const markup = architectureMap(index);
    verifyDetails(markup, moment.name);
    assert.equal(
      markup.match(new RegExp(`data-detail="${moment.detail}"`, 'g'))?.length,
      1,
      `${moment.id}: default detail must have exactly one map target`,
    );
  }
});

test('look closer links resolve to every lifecycle moment target', () => {
  const markup = creationWalkthrough(parseRoute('#bring-up'));
  assert.equal(
    [...markup.matchAll(/data-look-closer/g)].length,
    1,
    'the current moment has one Look closer link',
  );
  for (const moment of creationMoments) {
    const href = routeHref('bring-up', moment.id, moment.detail);
    const momentMarkup = creationWalkthrough(
      parseRoute(routeHref('bring-up', moment.id)),
    );
    assert.ok(
      momentMarkup.includes(`href="${href}" data-look-closer`),
      `${moment.id}: missing Look closer route`,
    );
    verifyRoute(href, `${moment.id} Look closer`);
    for (const sequenceMoment of creationMoments)
      assert.ok(
        momentMarkup.includes(
          `href="${routeHref('bring-up', sequenceMoment.id)}"`,
        ),
        `${moment.id}: sequence omits ${sequenceMoment.id}`,
      );
  }
});

test('SPI boundary map exposes one runtime seam and its source owners', () => {
  const markup = diagramRenderers.spi();
  const details = [...markup.matchAll(/data-detail="([^"]+)"/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(details, [
    'client',
    'image',
    'core',
    'contract',
    'azureimpl',
    'redis',
    'azureclients',
    'upstream',
    'engineering',
  ]);
  for (const scope of [
    'spi-image',
    'spi-shared',
    'spi-provider',
    'spi-cache',
    'spi-tables',
    'spi-sources',
  ])
    assert.match(markup, new RegExp(`data-scope="${scope}"`));
  assert.match(markup, /partition-core/);
  assert.match(markup, /IPartitionService\.getPartition/);
  assert.match(markup, /provider\/partition-azure/);
  assert.match(markup, /no network hop/);
  assert.deepEqual(
    [...markup.matchAll(/data-trace-status="([^"]+)"/g)].map(
      (match) => match[1],
    ),
    ['redis', 'azureclients'],
  );

  const runtime = markup.slice(
    markup.indexOf('<div class="spi-runtime">'),
    markup.indexOf('<section class="spi-source-boundary"'),
  );
  const imageEnd = runtime.indexOf('</section>');
  const redisStart = runtime.indexOf('data-scope="spi-cache"');
  const tablesStart = runtime.indexOf('data-scope="spi-tables"');
  assert.ok(imageEnd < redisStart && redisStart < tablesStart);
  const redisLane = runtime.slice(redisStart, tablesStart);
  const tableLane = runtime.slice(tablesStart);
  assert.match(redisLane, /Redis cache · inside AKS · middleware credentials/);
  assert.match(redisLane, /Outside the service image/);
  assert.doesNotMatch(redisLane, /Workload Identity/);
  assert.match(
    tableLane,
    /Common Table Storage · outside AKS · Workload Identity/,
  );
  assert.match(tableLane, /Outside the service image/);
  assert.doesNotMatch(tableLane, /middleware credentials/);
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
      assert.match(source.href, partitionSourcePattern);
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

test('partition source links accept pinned commits but reject unrelated URLs', () => {
  assert.match(sources.partitionCacheFix.href, partitionSourcePattern);
  for (const href of [
    'https://github.com/Azure/osdu-spi-partition/commit/fc2dfbf',
    'https://github.com/Azure/osdu-spi-stack/commit/fc2dfbf6f1a3038a804441aba615bf5ebadb3332',
    'https://example.com/Azure/osdu-spi-partition/commit/fc2dfbf6f1a3038a804441aba615bf5ebadb3332',
  ])
    assert.doesNotMatch(href, partitionSourcePattern);
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
    assert.ok(
      claims.length >= 2 && claims.length <= 4,
      `${key}: a lesson carries two to four claims`,
    );
    assert.ok(chapter.goal, `${key}: goal`);
    const chapterSceneSteps = chapterSteps(key).length
      ? chapterSteps(key)
      : [null];
    const scene = (step) => {
      const markup = diagramRenderers[chapter.diagram]({ chapter: key, step });
      return {
        details: new Set(
          [...markup.matchAll(/data-detail="([^"]+)"/g)].map(
            (match) => match[1],
          ),
        ),
        scopes: new Set(
          [...markup.matchAll(/data-scope="([^"]+)"/g)].map(
            (match) => match[1],
          ),
        ),
      };
    };
    for (const step of chapterSceneSteps)
      for (const id of chapter.example.scopes || [])
        assert.ok(
          scene(step).scopes.has(id),
          `${key}/${step}: example scope ${id}`,
        );
    const claimsMarkup = claimStrip(key);
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
      assert.ok(
        typeof claim.headline === 'string' &&
          claim.headline.length < claim.text.length &&
          claim.headline.length <= 80,
        `${key}: claim ${index} headline is shorter than its sentence`,
      );
      assert.ok(
        claimsMarkup.includes(
          routeHref(
            key,
            claim.evidenceStep || claim.step || null,
            claim.evidence,
          ),
        ),
        `${key}: claim ${index} evidence destination`,
      );
      if (claim.steps) {
        assert.ok(claim.step, `${key}: claim ${index} entry step`);
        assert.ok(
          claim.steps.includes(claim.step),
          `${key}: claim ${index} coverage includes its entry`,
        );
        for (const step of [...claim.steps, claim.evidenceStep || claim.step])
          assert.ok(
            chapterSceneSteps.includes(step),
            `${key}: claim ${index} uses unknown step ${step}`,
          );
        const foundFocus = new Set();
        for (const step of claim.steps) {
          const { details, scopes } = scene(step);
          const availableFocus = claim.focus.filter((id) => details.has(id));
          assert.ok(
            availableFocus.length,
            `${key}/${step}: claim ${index} has no available focus`,
          );
          availableFocus.forEach((id) => foundFocus.add(id));
          for (const id of claim.scopes)
            assert.ok(scopes.has(id), `${key}/${step}: claim scope ${id}`);
        }
        for (const id of claim.focus)
          assert.ok(
            foundFocus.has(id),
            `${key}: claim ${index} focus ${id} is absent from its coverage`,
          );
        const evidenceScene = scene(claim.evidenceStep || claim.step);
        assert.ok(
          evidenceScene.details.has(claim.evidence),
          `${key}: claim ${index} evidence ${claim.evidence}`,
        );
        return;
      }
      for (const step of chapterSceneSteps) {
        const { details, scopes } = scene(step);
        for (const id of [...claim.focus, claim.evidence])
          assert.ok(details.has(id), `${key}/${step}: claim detail ${id}`);
        for (const id of claim.scopes)
          assert.ok(scopes.has(id), `${key}/${step}: claim scope ${id}`);
      }
    });
  }
});

test('lesson 02 preserves its outcomes as three moment-aware claims', () => {
  const chapter = chapters['bring-up'];
  const expectedOutcomes = [
    'The CLI and Bicep create Azure and seed the cluster; Flux assembles the workloads; controllers keep them healthy. Different owners, different clocks.',
    'A successful spi up exit is the first of five milestones, not readiness. spi status --watch is how I follow the rest.',
    'spi down removes compute and data but keeps identities and the resource group, so a rebuild reuses the same names.',
  ];
  assert.equal(chapter.outcomes.length, 3);
  assert.deepEqual(
    chapter.outcomes.map((claim) => claim.text),
    expectedOutcomes,
  );
  assert.deepEqual(
    chapter.outcomes.map((claim) => claim.step),
    ['provision', 'inspect', 'remove'],
  );
  assert.deepEqual(
    chapter.outcomes.map((claim) => claim.evidenceStep),
    ['reconcile', 'inspect', 'remove'],
  );
  for (const claim of chapter.outcomes) {
    const words = claim.headline
      .replace(/<[^>]+>/g, ' ')
      .trim()
      .split(/\s+/);
    assert.ok(words.length < 12, `${claim.headline}: fewer than twelve words`);
    for (const field of ['headline', 'text', 'why', 'evidence', 'crossing'])
      assert.ok(claim[field]?.trim(), `lesson 02 claim: ${field}`);
  }
  assert.deepEqual(Object.keys(chapter.mistakes), [
    'start',
    'provision',
    'bootstrap',
    'reconcile',
    'inspect',
    'remove',
  ]);
  assert.match(chapter.example.note, /cache/);
  assert.match(chapter.example.note, /Azure Table Storage/);
  assert.match(
    chapter.example.note,
    /does not visit.*Cosmos DB.*blob Storage.*Service Bus/,
  );
});

test('lesson 02 claim rendering and example routes preserve lesson 01 behavior', () => {
  const chapter = chapters['bring-up'];
  const strip = claimStrip('bring-up');
  const outcomes = chapterOutcomes('bring-up');
  const expectedEvidence = [
    '#bring-up/reconcile?detail=flux',
    '#bring-up/inspect?detail=readiness',
    '#bring-up/remove?detail=retained',
  ];
  for (const [index, claim] of chapter.outcomes.entries()) {
    assert.ok(strip.includes(claim.headline), `claim ${index} headline`);
    assert.ok(strip.includes(claim.why), `claim ${index} reason`);
    assert.ok(outcomes.includes(claim.text), `claim ${index} full outcome`);
    assert.ok(
      strip.includes(`href="${expectedEvidence[index]}"`),
      `claim ${index} evidence route`,
    );
  }

  const momentClaims = {
    start: 0,
    provision: 0,
    bootstrap: 0,
    reconcile: 0,
    inspect: 1,
    remove: 2,
  };
  for (const [step, index] of Object.entries(momentClaims))
    assert.equal(
      claimIndexForRoute(chapter, parseRoute(`#bring-up/${step}`)),
      index,
      `${step}: compatible claim`,
    );
  assert.equal(
    claimIndexForRoute(chapter, parseRoute('#bring-up/reconcile?detail=flux')),
    0,
  );

  const exampleMarkup = exampleStrip('bring-up', parseRoute('#bring-up/start'));
  assert.ok(exampleMarkup.startsWith('<details'));
  assert.ok(!exampleMarkup.startsWith('<details open'));
  for (const [index, hop] of chapter.example.hops.entries()) {
    const route = parseRoute(routeHref('bring-up', hop.step, hop.detail));
    assert.equal(hopIndexForRoute(chapter, route), index);
    assert.ok(
      exampleMarkup.includes(
        `href="${routeHref('bring-up', hop.step, hop.detail)}"`,
      ),
    );
  }
  assert.equal(
    hopIndexForRoute(chapter, parseRoute('#bring-up/inspect?detail=service')),
    -1,
    'a hop only restores at its own moment',
  );

  const lessonOne = chapters['running-stack'];
  const lessonOneClaims = claimStrip('running-stack');
  const lessonOneExample = exampleStrip(
    'running-stack',
    parseRoute('#running-stack/request?detail=gateway'),
  );
  assert.ok(
    lessonOneClaims.includes('href="#running-stack?detail=environment"'),
    'timeless claim evidence keeps its chapter-only route',
  );
  assert.ok(
    lessonOneExample.includes('href="#running-stack/request?detail=gateway"'),
  );
  assert.equal(
    hopIndexForRoute(
      lessonOne,
      parseRoute('#running-stack/request?detail=gateway'),
    ),
    1,
  );
  assert.match(
    lessonOneExample,
    /The provider checks its cache, then Azure Table Storage/,
  );
});

test('lesson 03 claims keep the provider seam understandable without evidence', () => {
  const chapter = chapters['spi-boundary'];
  assert.equal(
    chapter.headline.replace(/<[^>]+>/g, ' ').trim(),
    'The provider lives inside the service.',
  );
  assert.equal(chapter.outcomes.length, 3);
  assert.deepEqual(
    chapter.outcomes.map(({ headline, focus, evidence, scopes }) => ({
      headline,
      focus,
      evidence,
      scopes,
    })),
    [
      {
        headline: 'Common code calls Azure through a provider interface.',
        focus: ['core', 'contract', 'azureimpl', 'redis', 'azureclients'],
        evidence: 'azureimpl',
        scopes: ['spi-shared', 'spi-provider', 'spi-cache', 'spi-tables'],
      },
      {
        headline: 'The interface and implementation ship in one image.',
        focus: ['contract', 'azureimpl', 'image'],
        evidence: 'image',
        scopes: ['spi-image'],
      },
      {
        headline: 'The fork keeps Azure source outside the generated tree.',
        focus: ['upstream', 'azureimpl', 'engineering'],
        evidence: 'upstream',
        scopes: ['spi-provider', 'spi-sources'],
      },
    ],
  );
  for (const claim of chapter.outcomes)
    assert.ok(
      claim.headline.split(/\s+/).length < 12,
      `${claim.headline}: fewer than twelve words`,
    );

  const claims = claimStrip('spi-boundary');
  for (const fact of [
    'partition-core calls IPartitionService.getPartition',
    'Redis inside AKS with middleware credentials',
    'Workload Identity for the common Table Storage read',
    'same service process',
    'not a network hop',
    'provider/&lt;svc&gt;-azure stays fork-owned',
  ])
    assert.ok(claims.includes(fact), `claim surface includes ${fact}`);

  const outcomes = chapterOutcomes('spi-boundary');
  for (const claim of chapter.outcomes)
    assert.ok(
      outcomes.includes(escapeHtml(claim.text)),
      `carry forward repeats: ${claim.headline}`,
    );
});

test('lesson 03 states its own prerequisite and place without changing orientation', () => {
  const chapter = chapters['spi-boundary'];
  assert.match(chapter.intro, /^Builds on the partition lookup from 01/);
  assert.match(chapter.intro, /one service inside the osdu namespace/);
  assert.match(chapter.intro, /partition in dev1/);
  assert.match(chapter.intro, /Service Provider Interface \(SPI\)/);
  const orientation = chapterScope('spi-boundary');
  assert.match(orientation, /This lesson answers/);
  assert.match(orientation, /By the end/);
  assert.ok(orientation.includes(chapter.goal));
  assert.ok(!orientation.includes(chapter.builds));
  assert.ok(!orientation.includes(chapter.where));
  assert.ok(
    !chapterScope('running-stack').includes(chapters['running-stack'].builds),
  );
});

test('example variants present two states of one canonical six-hop trace', () => {
  const example = chapters['spi-boundary'].example;
  const canonical = structuredClone(example.hops);
  const normal = resolveExamplePresentation(example);
  const cacheDown = resolveExamplePresentation(example, 'cache-down');

  assert.equal(normal.selectedVariant, 'normal');
  assert.deepEqual(
    normal.hops.map(({ detail }) => detail),
    ['client', 'core', 'contract', 'azureimpl', 'redis', 'azureclients'],
  );
  assert.deepEqual(
    cacheDown.hops.map(({ detail }) => detail),
    normal.hops.map(({ detail }) => detail),
  );
  for (const presentation of [normal, cacheDown]) {
    const hops = Object.fromEntries(
      presentation.hops.map((hop) => [hop.detail, hop]),
    );
    assert.match(hops.redis.copy, /inside AKS/i);
    assert.match(hops.azureclients.copy, /outside AKS|Workload Identity/i);
  }
  assert.equal(normal.hops[4].state, 'normal');
  assert.equal(normal.hops[5].state, 'normal');
  assert.equal(cacheDown.hops[4].state, 'handled-failure');
  assert.equal(cacheDown.hops[5].state, 'fallback');
  assert.deepEqual(example.hops, canonical);

  const route = parseRoute('#spi-boundary');
  const normalMarkup = exampleStrip('spi-boundary', route);
  const cacheDownMarkup = exampleStrip('spi-boundary', route, 'cache-down');
  for (const markup of [normalMarkup, cacheDownMarkup]) {
    assert.equal((markup.match(/<ol class="journey"/g) || []).length, 1);
    assert.equal((markup.match(/data-hop="/g) || []).length, 6);
    assert.equal((markup.match(/data-example-variant=/g) || []).length, 2);
  }
  const links = (markup) =>
    [...markup.matchAll(/<a href="([^"]+)" data-map-jump data-hop/g)].map(
      (match) => match[1],
    );
  assert.deepEqual(links(cacheDownMarkup), links(normalMarkup));
  assert.match(normalMarkup, /healthy cache miss/i);
  assert.match(cacheDownMarkup, /read throws.*treated as a miss/i);
  assert.match(cacheDownMarkup, /Table Storage answers anyway/i);
});

test('example compatibility keeps provider paths in content and controls optional', () => {
  for (const key of ['running-stack', 'spi-boundary']) {
    const example = chapters[key].example;
    assert.match(example.providerPath, /Azure Table Storage in common Storage/);
    assert.match(
      example.providerPath,
      /does not visit the partition’s Cosmos, blob Storage, or Service Bus/,
    );
  }

  const lessonOne = exampleStrip(
    'running-stack',
    parseRoute('#running-stack/request'),
  );
  assert.ok(!lessonOne.includes('data-example-variant'));
  assert.match(lessonOne, /The answer describes where opendes lives/);
  assert.match(lessonOne, /does not visit the partition’s Cosmos/);
});

test('lesson trace state keeps variants local and preserves an active hop', () => {
  const example = chapters['spi-boundary'].example;
  const hopCount = example.hops.length;
  const redisHop = example.hops.findIndex(({ detail }) => detail === 'redis');
  const tableHop = example.hops.findIndex(
    ({ detail }) => detail === 'azureclients',
  );
  const initial = {
    claim: 0,
    hop: -1,
    policy: 'learn',
    exampleOpen: false,
    variant: 'normal',
  };
  const cacheDown = selectExampleVariant(initial, 'cache-down', hopCount);
  assert.deepEqual(cacheDown, {
    ...initial,
    hop: tableHop,
    exampleOpen: true,
    variant: 'cache-down',
  });
  const atRedis = { ...cacheDown, hop: redisHop };
  assert.deepEqual(selectExampleVariant(atRedis, 'normal', hopCount), {
    ...atRedis,
    variant: 'normal',
  });
  assert.deepEqual(initial, {
    claim: 0,
    hop: -1,
    policy: 'learn',
    exampleOpen: false,
    variant: 'normal',
  });
});

test('lesson 03 evidence deep links stay step-less and map to claims', () => {
  const chapter = chapters['spi-boundary'];
  for (const detail of ['redis', 'azureclients'])
    verifyRoute(`#spi-boundary?detail=${detail}`, `lesson 03 ${detail}`);
  for (const [detail, claim] of [
    ['azureimpl', 0],
    ['image', 1],
    ['upstream', 2],
  ]) {
    const route = parseRoute(`#spi-boundary?detail=${detail}`);
    assert.equal(route.step, '');
    assert.equal(
      chapter.outcomes.findIndex((entry) => entry.evidence === route.detail),
      claim,
    );
  }
  assert.equal(
    parseRoute('#running-stack/request?detail=provider').step,
    'request',
  );

  const stack = episodes.find((episode) => episode.id === 'stack');
  const outboundIdentity = stack.markers.find((marker) => marker.time === 2035);
  assert.match(
    outboundIdentity.note,
    /Workload Identity replaces stored keys for Azure data services, not every credential/,
  );
  assert.match(
    outboundIdentity.note,
    /Redis remains in the platform namespace.*middleware password.*Kubernetes Secrets.*Key Vault/,
  );
  assert.match(
    outboundIdentity.note,
    /common Table Storage read uses Azure identity/,
  );
});

test('example renderers preserve structured and unconverted lessons', () => {
  const fixtures = [
    ['running-stack', '#running-stack/request', true],
    ['spi-boundary', '#spi-boundary', true],
    ['bring-up', '#bring-up/provision', true],
    ['fork-shape', '#fork-shape', false],
  ];
  for (const [key, href, structured] of fixtures) {
    const markup = exampleStrip(key, parseRoute(href));
    assert.ok(markup.includes('class="journey"'), key);
    assert.equal(markup.includes('example-disclosure'), structured, key);
    assert.equal(
      (markup.match(/data-example-variant=/g) || []).length,
      key === 'spi-boundary' ? 2 : 0,
      key,
    );
  }
});
