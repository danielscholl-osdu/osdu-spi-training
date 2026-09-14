import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { chapters, chapterGroups } from '../src/content/chapters.js';
import { componentDetails } from '../src/content/component-details.js';
import { creationMoments } from '../src/content/creation-moments.js';
import { sources } from '../src/content/sources.js';
import { myths } from '../src/content/myths.js';
import { suppliedPosters, nativeGuides } from '../src/content/posters.js';
import {
  episodes,
  deepDives,
  defaultEpisode,
  frameVideo,
} from '../src/content/audio.js';
import { diagramRenderers } from '../src/components/diagrams.js';
import {
  architectureMap,
  creationWalkthrough,
} from '../src/components/architecture.js';
import { infographics } from '../src/components/infographics.js';
import { escapeHtml } from '../src/components/node.js';
import { resolveDetail } from '../src/components/evidence.js';
import {
  chapterOutcomes,
  chapterScope,
  chapterNavigation,
  claimIndexForRoute,
  claimContext,
  courseMaps,
  guideSections,
  claimStrip,
  detailSourceLinks,
  exampleStrip,
  frameVideoPlayer,
  guideFigure,
  hasClaims,
  isLifecycleLesson,
  hopIndexForRoute,
  mythCallout,
  pageRenderers,
  partitionComparison,
  resolveExamplePresentation,
  resolveLessonSelection,
  selectExampleVariant,
  tryItBand,
  guidePreview,
  listenChips,
  posterInline,
} from '../src/components/pages.js';
import {
  chapterAliases,
  chapterSteps,
  parseRoute,
  retiredDetails,
  routeHref,
  retiredGuides,
} from '../src/router.js';
import { forkMoments } from '../src/content/fork-moments.js';
import { zoomLevels, spiMeanings } from '../src/content/concepts.js';
import { mythThemes } from '../src/content/myths.js';
import {
  partitionLookupFigure,
  zoomLadder,
  spiNamesFigure,
} from '../src/components/infographics.js';
import { multipleVariantTryIt, singleVariantTryIt } from './fixtures/try-it.js';

const mapChapters = Object.entries(chapters).filter(
  ([, chapter]) => chapter.kind === 'map',
);
const pageChapters = Object.entries(chapters).filter(
  ([, chapter]) => chapter.kind === 'page',
);
const fullRevision = '[0-9a-f]{40}';
const partitionSourcePattern = new RegExp(
  `^https://github\\.com/Azure/osdu-spi-partition(?:/blob/(?:main|${fullRevision})/|/commit/${fullRevision}$|$)`,
);
const stackSourcePattern = new RegExp(
  `^https://github\\.com/Azure/osdu-spi-stack/blob/(?:main|${fullRevision})/`,
);
const communityPartitionSourcePattern = new RegExp(
  `^https://community\\.opengroup\\.org/osdu/platform/system/partition/-/blob/${fullRevision}/`,
);
const cimplStackSourcePattern = new RegExp(
  `^https://community\\.opengroup\\.org/osdu/platform/deployment-and-operations/cimpl-stack/-/blob/${fullRevision}/`,
);
// Sibling checkouts the content is reviewed against; a same-named directory
// for a community repository is not one of them.
const siblingRepos = new Set([
  'osdu-spi',
  'osdu-spi-stack',
  'osdu-spi-partition',
]);
const tryItAccess = new Set([
  'browser only',
  'workstation setup',
  'public GitHub repository',
  'Azure resources billed separately',
]);

function verifySourceRecord(key, source) {
  const url = new URL(source.href);
  assert.equal(url.protocol, 'https:');
  assert.ok(source.label && source.repo && source.path, key);
  if (source.repo === 'osdu-spi') {
    assert.equal(url.hostname, 'azure.github.io', key);
    assert.ok(url.pathname.startsWith('/osdu-spi/'), key);
  } else if (source.repo === 'osdu-spi-partition')
    assert.match(source.href, partitionSourcePattern);
  else if (source.repo === 'partition')
    assert.match(source.href, communityPartitionSourcePattern);
  else if (source.repo === 'cimpl-stack')
    assert.match(source.href, cimplStackSourcePattern);
  else assert.match(source.href, stackSourcePattern);
  if (!siblingRepos.has(source.repo)) return;
  const checkout = new URL(`../../${source.repo}/`, import.meta.url);
  if (existsSync(checkout)) {
    const target = new URL(source.path, checkout);
    assert.ok(existsSync(target), `${key}: missing ${fileURLToPath(target)}`);
  }
}

function verifyTryIt(tryIt, context) {
  const nonempty = (value, field) => {
    assert.equal(typeof value, 'string', `${context}: ${field}`);
    assert.ok(value.trim(), `${context}: ${field}`);
  };
  const sourceKeys = (keys, field, required = false) => {
    assert.ok(Array.isArray(keys), `${context}: ${field}`);
    if (required) assert.ok(keys.length, `${context}: ${field}`);
    for (const key of keys) {
      assert.ok(sources[key], `${context}: ${field} has unknown source ${key}`);
      verifySourceRecord(key, sources[key]);
    }
  };
  const action = (step, field) => {
    const hasCommand =
      typeof step.command === 'string' && Boolean(step.command.trim());
    const hasClick =
      typeof step.click === 'string' && Boolean(step.click.trim());
    assert.notEqual(hasCommand, hasClick, `${context}: ${field} action`);
    nonempty(step.expect, `${field}.expect`);
    if (step.sources) sourceKeys(step.sources, `${field}.sources`);
  };

  assert.ok(tryIt && typeof tryIt === 'object', `${context}: tryIt`);
  nonempty(tryIt.activity, 'activity');
  nonempty(tryIt.summary, 'summary');
  assert.ok(
    tryIt.summary.startsWith(`Try it: ${tryIt.activity}`) &&
      tryIt.summary.length <= 64,
    `${context}: summary is one short line naming the activity`,
  );
  if (tryIt.connection !== undefined) {
    nonempty(tryIt.connection.text, 'connection.text');
    sourceKeys(tryIt.connection.sources, 'connection.sources', true);
  }
  assert.ok(
    Array.isArray(tryIt.variants) && tryIt.variants.length,
    `${context}: variants`,
  );
  for (const [variantIndex, variant] of tryIt.variants.entries()) {
    const field = `variants[${variantIndex}]`;
    for (const key of ['label', 'result', 'effects'])
      nonempty(variant[key], `${field}.${key}`);
    assert.ok(tryItAccess.has(variant.access), `${context}: ${field}.access`);
    if (variant.accessNote !== undefined) {
      nonempty(variant.accessNote, `${field}.accessNote`);
      assert.match(
        variant.accessNote,
        /[.!?]$/,
        `${context}: ${field}.accessNote sentence`,
      );
    }
    assert.ok(
      Array.isArray(variant.prerequisites) && variant.prerequisites.length,
      `${context}: ${field}.prerequisites`,
    );
    for (const [index, prerequisite] of variant.prerequisites.entries()) {
      nonempty(prerequisite.text, `${field}.prerequisites[${index}].text`);
      sourceKeys(
        prerequisite.sources,
        `${field}.prerequisites[${index}].sources`,
        true,
      );
    }
    for (const key of ['active', 'wait', 'cleanup'])
      nonempty(variant.time?.[key], `${field}.time.${key}`);
    assert.ok(
      Array.isArray(variant.steps) && variant.steps.length,
      `${context}: ${field}.steps`,
    );
    for (const [index, step] of variant.steps.entries())
      action(step, `${field}.steps[${index}]`);
    nonempty(variant.alternate?.observation, `${field}.alternate.observation`);
    nonempty(variant.alternate?.next, `${field}.alternate.next`);
    assert.ok(
      Array.isArray(variant.cleanup?.steps) && variant.cleanup.steps.length,
      `${context}: ${field}.cleanup.steps`,
    );
    for (const [index, step] of variant.cleanup.steps.entries())
      action(step, `${field}.cleanup.steps[${index}]`);
    nonempty(variant.cleanup.remains, `${field}.cleanup.remains`);
    sourceKeys(variant.sources, `${field}.sources`, true);
    for (const key of ['cli', 'stack', 'template', 'shell', 'os', 'date'])
      nonempty(variant.tested?.[key], `${field}.tested.${key}`);
    assert.match(
      variant.tested.date,
      /^\d{4}-\d{2}-\d{2}$/,
      `${context}: ${field}.tested.date`,
    );
  }
}

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
      courseMaps.some((map) => map.id === route.guide) ||
        nativeGuides.some((guide) => guide.id === route.guide) ||
        suppliedPosters.some((poster) => poster.id === route.guide),
      `${context}: ${href} names an unknown field guide`,
    );
}

test('chapters connect to renderers, explanations, and named sources', () => {
  for (const [id, chapter] of Object.entries(chapters)) {
    for (const field of ['title', 'subtitle', 'headline'])
      assert.ok(chapter[field]?.trim(), `${id} is missing ${field}`);
    assert.ok(
      chapter.intro?.trim() || chapter.subhead?.trim(),
      `${id} opens with neither an intro nor a subhead`,
    );
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

test('evidence resolver applies chapter context without inferring ownership', () => {
  const details = {
    sample: {
      label: 'Fallback context',
      title: 'Base title.',
      body: 'First sentence. Second sentence.',
      artifact: { label: 'Base artifact', code: 'base' },
      source: 'architecture',
      goDeeper: ['lifecycle'],
      here: {
        lesson: {
          context: 'Lesson context',
          owner: 'Explicit owner',
          summary: 'Authored summary.',
          more: 'Authored detail.',
          artifact: { label: 'Lesson artifact', code: 'lesson' },
          source: 'ownership',
        },
        concise: {
          summary: 'Concise summary.',
          more: '',
        },
      },
    },
  };
  const original = structuredClone(details);

  const base = resolveDetail('sample', 'elsewhere', details);
  assert.equal(base.label, 'Fallback context');
  assert.equal(base.context, 'Fallback context');
  assert.equal(base.owner, null);
  assert.equal(base.summary, 'Base title. First sentence. Second sentence.');
  assert.equal(base.more, '');
  assert.deepEqual(base.goDeeper, ['lifecycle']);

  const lesson = resolveDetail('sample', 'lesson', details);
  assert.equal(lesson.context, 'Lesson context');
  assert.equal(lesson.owner, 'Explicit owner');
  assert.equal(lesson.summary, 'Authored summary.');
  assert.equal(lesson.more, 'Authored detail.');
  assert.deepEqual(lesson.artifact, {
    label: 'Lesson artifact',
    code: 'lesson',
  });
  assert.equal(lesson.source, 'ownership');

  const concise = resolveDetail('sample', 'concise', details);
  assert.equal(concise.more, '');
  assert.equal(resolveDetail('missing', 'lesson', details), null);
  assert.deepEqual(details, original);
});

test('lesson 01 claim evidence resolves all three claims in stack context', () => {
  const details = chapters['running-stack'].outcomes.map(({ evidence }) =>
    resolveDetail(evidence, 'running-stack'),
  );

  assert.deepEqual(
    details.map(({ owner }) => owner),
    [null, null, 'The partition service fork'],
  );
  assert.deepEqual(
    details.map(({ source }) => source),
    ['architecture', 'architecture', 'partitionPom'],
  );
  assert.match(details[0].summary, /resource group contains AKS/);
  assert.match(details[0].summary, /--env <name>.*whole environment/);
  assert.match(
    details[1].summary,
    /opendes.*Cosmos DB SQL account.*Storage account.*Service Bus namespace/,
  );
  assert.match(details[1].summary, /common Storage.*Gremlin.*service identity/);
  assert.match(
    details[2].summary,
    /partition-core.*provider\/partition-azure.*one executable/,
  );
  assert.match(details[2].summary, /POM.*Spring Boot.*Dockerfile.*entry point/);
});

test('lesson 02 claim evidence resolves all three claims without false owners', () => {
  const details = chapters['bring-up'].outcomes.map(({ evidence }) =>
    resolveDetail(evidence, 'bring-up'),
  );

  assert.deepEqual(
    details.map(({ owner }) => owner),
    [null, null, null],
  );
  assert.deepEqual(
    details.map(({ source }) => source),
    ['architecture', 'lifecycle', 'lifecycle'],
  );
  assert.match(details[0].summary, /Bicep.*spi-cluster-config/);
  assert.match(details[0].summary, /Flux.*controllers.*after the CLI exits/);
  assert.match(details[1].summary, /successful spi up does not prove/);
  assert.match(details[1].summary, /spi status --watch/);
  assert.match(
    details[1].summary,
    /authenticated lookup proves the exercised API path, not every API/,
  );
  assert.match(details[2].summary, /deletes the cluster and application data/);
  assert.match(
    details[2].summary,
    /reuse resource names and identity client IDs/,
  );
  assert.match(details[2].summary, /not the deleted application data/);
});

test('lesson 03 claim evidence resolves all three claims and cache-hop proof', () => {
  const details = chapters['spi-boundary'].outcomes.map(({ evidence }) =>
    resolveDetail(evidence, 'spi-boundary'),
  );

  assert.deepEqual(
    details.map(({ owner }) => owner),
    ['The partition service fork', 'The partition service fork', null],
  );
  assert.deepEqual(
    details.map(({ source }) => source),
    ['partitionProvider', 'partitionPom', 'ownership'],
  );
  assert.match(details[0].summary, /Redis inside AKS.*middleware credentials/);
  assert.match(details[0].summary, /cache miss or caught read exception/);
  assert.match(details[0].summary, /logged as a warning.*common Table Storage/);
  assert.match(details[0].summary, /reachable and contains opendes/);
  assert.match(details[0].summary, /Workload Identity/);
  assert.match(
    details[0].summary,
    /does not visit.*Cosmos DB.*blob Storage.*Service Bus/,
  );
  assert.match(details[1].summary, /depends on partition-core/);
  assert.match(details[1].summary, /Spring Boot repackage.*\/app\.jar/);
  assert.match(details[1].summary, /one process, not across a network/);
  assert.match(
    details[2].summary,
    /regenerates shared source separately from fork-owned Azure source/,
  );
  assert.match(details[2].summary, /removing.*upstream does not delete/);

  for (const id of ['redis', 'azureclients']) {
    const detail = resolveDetail(id, 'spi-boundary');
    assert.equal(detail.source, 'partitionProvider');
    assert.match(detail.summary, /miss or caught read exception/);
    assert.match(detail.summary, /reachable and contains opendes/);
  }
  assert.equal(
    details[2].title,
    componentDetails.upstream.title,
    'the upstream title remains shared with later lessons',
  );
  assert.deepEqual(details[2].artifact, componentDetails.upstream.artifact);
  assert.equal(resolveDetail('image', 'fork-shape').source, 'ghcr');
  assert.equal(
    resolveDetail('upstream', 'fork-shape').source,
    'synchronization',
  );
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
    for (const [chapterKey, override] of Object.entries(detail.here || {})) {
      assert.ok(chapters[chapterKey], `${id}: unknown chapter ${chapterKey}`);
      assert.ok(override.summary?.trim(), `${id}/${chapterKey}: summary`);
      if (override.owner !== undefined)
        assert.ok(override.owner.trim(), `${id}/${chapterKey}: owner`);
      if (override.source)
        assert.ok(sources[override.source], `${id}/${chapterKey}: source`);
      for (const source of override.goDeeper || [])
        assert.ok(
          sources[source],
          `${id}/${chapterKey}: Go deeper source ${source}`,
        );
    }
  }
  assert.equal(
    componentDetails.upstream.title,
    'The community repository contains shared code and providers for several clouds.',
  );
  assert.equal(componentDetails.upstream.source, 'synchronization');
  assert.match(componentDetails.upstream.artifact.code, /UPSTREAM_REPO_URL/);
});

test('readiness drawer distinguishes observed state from API proof', () => {
  const readiness = componentDetails.readiness;
  const drawerCopy = `${readiness.label} ${readiness.title} ${readiness.body}`;

  assert.equal(readiness.source, 'lifecycle');
  assert.match(readiness.artifact.code, /spi status --watch/);
  assert.match(readiness.artifact.code, /spi info --show-apis/);
  assert.match(readiness.body, /opendes lookup in your environment/);
  assert.match(
    readiness.body,
    /CLI verifies the requested Git artifact revision/,
  );
  assert.match(readiness.body, /Flux overlaps the final CLI work/);
  assert.match(readiness.body, /observes configured workload health/);
  assert.match(readiness.body, /discovers the endpoint/);
  assert.match(
    readiness.body,
    /authenticated lookup proves that exercised API path, not every API/,
  );
  assert.match(readiness.body, /Running phase is not necessarily Ready/);
  assert.match(readiness.body, /Job should be Complete rather than Running/);
  for (const phrase of ['first of five', 'the rest', 'later milestone'])
    assert.doesNotMatch(drawerCopy, new RegExp(phrase, 'i'));
});

test('Go deeper links put primary evidence before deduplicated depth', () => {
  const ordered = detailSourceLinks(componentDetails.azureimpl);
  const expected = [
    componentDetails.azureimpl.source,
    ...componentDetails.azureimpl.goDeeper,
  ].map((key) => sources[key].href);
  assert.deepEqual(
    [...ordered.matchAll(/href="([^"]+)"/g)].map((match) => match[1]),
    expected,
  );

  const fallback = detailSourceLinks(componentDetails.contract);
  assert.deepEqual(
    [...fallback.matchAll(/href="([^"]+)"/g)].map((match) => match[1]),
    [sources[componentDetails.contract.source].href],
  );
  const deduplicated = detailSourceLinks({
    source: 'partitionProvider',
    goDeeper: ['partitionProvider', 'ownership', 'partitionProvider'],
  });
  assert.deepEqual(
    [...deduplicated.matchAll(/href="([^"]+)"/g)].map((match) => match[1]),
    [sources.partitionProvider.href, sources.ownership.href],
  );
  assert.ok(
    detailSourceLinks({ source: 'architecture', goDeeper: [] }).includes(
      sources.architecture.href,
    ),
  );
  assert.equal(detailSourceLinks(null), '');
  assert.match(ordered, /target="_blank" rel="noopener noreferrer"/);
  assert.throws(
    () => detailSourceLinks({ source: 'missing-source' }),
    /Unknown source key: missing-source/,
  );
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
    const selection = ['provision', 'bootstrap'].includes(moment.id)
      ? { claim: 0 }
      : {};
    const href = routeHref('bring-up', moment.id, moment.detail, selection);
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
  const base = {
    claim: null,
    hop: null,
    guide: null,
    episode: null,
    time: null,
  };
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
    ...base,
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

test('every published chapter, step, alias, and retired detail resolves', () => {
  for (const [key, chapter] of Object.entries(chapters)) {
    const steps = chapterSteps(key);
    const bare = parseRoute(routeHref(key));
    assert.equal(bare.chapter, key, `${key}: chapter`);
    assert.equal(bare.step, steps[0] || '', `${key}: default step`);
    for (const step of steps) {
      const route = parseRoute(routeHref(key, step));
      assert.equal(route.chapter, key, `${key}/${step}: chapter`);
      assert.equal(route.step, step, `${key}/${step}: step`);
    }
    if (chapter.kind !== 'map') continue;
    for (const step of steps.length ? steps : ['']) {
      const route = parseRoute(routeHref(key, step));
      verifyDetails(
        diagramRenderers[chapter.diagram](route),
        `${key}/${step || 'default'}`,
      );
    }
  }

  for (const [alias, target] of Object.entries(chapterAliases))
    assert.equal(parseRoute(`#${alias}`).chapter, target, `${alias}: alias`);

  for (const [sourceChapter, details] of Object.entries(retiredDetails)) {
    for (const [sourceDetail, [chapter, step, detail]] of Object.entries(
      details,
    )) {
      const route = parseRoute(`#${sourceChapter}?detail=${sourceDetail}`);
      assert.deepEqual(
        [route.chapter, route.step, route.detail],
        [chapter, step || chapterSteps(chapter)[0] || '', detail],
        `${sourceChapter}: ${sourceDetail}`,
      );
      const target = chapters[chapter];
      assert.equal(target.kind, 'map', `${sourceDetail}: map target`);
      assert.match(
        diagramRenderers[target.diagram](route),
        new RegExp(`data-detail="${detail}"`),
        `${sourceDetail}: target component`,
      );
    }
  }
});

test('selection intent is additive and invalid qualifiers preserve legacy routes', () => {
  const cases = [
    {
      href: routeHref('spi-boundary', '', 'azureimpl', { claim: 0 }),
      expectedHref: '#spi-boundary?detail=azureimpl&claim=0',
      claim: 0,
      hop: null,
    },
    {
      href: routeHref('spi-boundary', '', 'azureimpl', { hop: 3 }),
      expectedHref: '#spi-boundary?detail=azureimpl&hop=3',
      claim: null,
      hop: 3,
    },
    {
      href: routeHref('running-stack', 'request', 'gateway'),
      expectedHref: '#running-stack/request?detail=gateway',
      claim: null,
      hop: null,
    },
    {
      href: '#spi-boundary?detail=azureimpl&claim=',
      expectedHref: '#spi-boundary?detail=azureimpl&claim=',
      claim: null,
      hop: null,
    },
    {
      href: '#spi-boundary?detail=azureimpl&hop=-1',
      expectedHref: '#spi-boundary?detail=azureimpl&hop=-1',
      claim: null,
      hop: null,
    },
    {
      href: '#spi-boundary?detail=azureimpl&claim=0&hop=3',
      expectedHref: '#spi-boundary?detail=azureimpl&claim=0&hop=3',
      claim: null,
      hop: null,
    },
    {
      href: routeHref('spi-boundary', '', 'azureimpl', {
        claim: 0,
        hop: 3,
      }),
      expectedHref: '#spi-boundary?detail=azureimpl',
      claim: null,
      hop: null,
    },
  ];

  for (const { href, expectedHref, claim, hop } of cases) {
    assert.equal(href, expectedHref);
    assert.deepEqual(
      { claim: parseRoute(href).claim, hop: parseRoute(href).hop },
      { claim, hop },
      href,
    );
  }

  const collisions = [
    ['running-stack', 'request', 'shared-data', 1, 4],
    ['running-stack', 'request', 'service', 2, 2],
    ['spi-boundary', '', 'azureimpl', 0, 3],
  ];
  for (const [key, step, detail, claim, hop] of collisions) {
    const chapter = chapters[key];
    assert.deepEqual(
      resolveLessonSelection(chapter, parseRoute(routeHref(key, step, detail))),
      { claim, hop: -1, exampleOpen: false },
      `${key}: legacy evidence`,
    );
    assert.deepEqual(
      resolveLessonSelection(
        chapter,
        parseRoute(routeHref(key, step, detail, { claim })),
      ),
      { claim, hop: -1, exampleOpen: false },
      `${key}: explicit evidence`,
    );
    assert.deepEqual(
      resolveLessonSelection(
        chapter,
        parseRoute(routeHref(key, step, detail, { hop })),
      ),
      { claim, hop, exampleOpen: true },
      `${key}: explicit trace`,
    );
  }

  const inspectionLinks = [
    [
      creationWalkthrough(parseRoute('#bring-up/provision')),
      '#bring-up/provision?detail=aks&claim=0',
    ],
    [
      creationWalkthrough(parseRoute('#bring-up/bootstrap')),
      '#bring-up/bootstrap?detail=bootstrap&claim=0',
    ],
    [infographics.familiar(), '#running-stack/request?detail=gateway&claim=2'],
    [
      mythCallout('certificate-means-encrypted', 'running-stack'),
      '#running-stack/request?detail=gateway&claim=0',
    ],
    [
      mythCallout('token-accepted-means-authorized', 'running-stack'),
      '#running-stack/request?detail=gateway&claim=0',
    ],
    [
      mythCallout('smoke-proves-api', 'bring-up'),
      '#bring-up/inspect?detail=caller&claim=1',
    ],
  ];
  for (const [markup, href] of inspectionLinks)
    assert.ok(markup.includes(`href="${href}"`), href);

  const structuredLessons = ['running-stack', 'bring-up', 'spi-boundary'];
  for (const key of structuredLessons) {
    const chapter = chapters[key];
    const claimsMarkup = claimStrip(key);
    for (const [claim, outcome] of chapter.outcomes.entries()) {
      const step = outcome.evidenceStep || outcome.step || '';
      const href = routeHref(key, step, outcome.evidence, { claim });
      if (!isLifecycleLesson(chapter))
        assert.ok(claimsMarkup.includes(`href="${href}"`), href);
      assert.deepEqual(
        resolveLessonSelection(chapter, parseRoute(href)),
        { claim, hop: -1, exampleOpen: false },
        href,
      );
    }

    const exampleMarkup = exampleStrip(
      key,
      parseRoute(routeHref(key, chapter.example.step || '')),
    );
    for (const [hop, entry] of chapter.example.hops.entries()) {
      const step = entry.step || chapter.example.step || '';
      const href = routeHref(key, step, entry.detail, { hop });
      assert.ok(exampleMarkup.includes(`href="${href}"`), href);
      assert.deepEqual(
        resolveLessonSelection(chapter, parseRoute(href)),
        {
          claim: claimIndexForRoute(chapter, parseRoute(href)),
          hop,
          exampleOpen: true,
        },
        href,
      );
    }
  }

  const fallbackCases = [
    [
      '#spi-boundary?detail=azureimpl&claim=99',
      { claim: 0, hop: -1, exampleOpen: false },
    ],
    [
      '#spi-boundary?detail=azureimpl&hop=99',
      { claim: 0, hop: -1, exampleOpen: false },
    ],
    [
      '#spi-boundary?detail=azureimpl&claim=nope',
      { claim: 0, hop: -1, exampleOpen: false },
    ],
    [
      '#spi-boundary?detail=azureimpl&claim=0&hop=3',
      { claim: 0, hop: -1, exampleOpen: false },
    ],
    [
      '#bring-up/provision?detail=aks&claim=2',
      { claim: 0, hop: 0, exampleOpen: true },
    ],
    [
      '#bring-up/bootstrap?detail=bootstrap&hop=0',
      { claim: 0, hop: 2, exampleOpen: true },
    ],
    [
      '#running-stack/request?detail=gateway',
      { claim: 0, hop: 1, exampleOpen: true },
    ],
  ];
  for (const [href, expected] of fallbackCases) {
    const route = parseRoute(href);
    assert.deepEqual(
      resolveLessonSelection(chapters[route.chapter], route),
      expected,
      href,
    );
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

test('readiness misconception separates possible convergence from API proof', () => {
  const readiness = myths.find((myth) => myth.id === 'finished-means-ready');
  const misconceptionCopy = `${readiness.reality} ${readiness.routeLabel}`;

  assert.equal(readiness.claim, 'The command finished, so it is ready.');
  assert.equal(readiness.check, 'spi status --watch');
  assert.equal(readiness.source, 'lifecycle');
  assert.equal(readiness.route, '#bring-up/inspect?detail=readiness');
  assert.equal(readiness.routeLabel, 'Readiness signals');
  assert.match(readiness.reality, /does not establish API readiness/);
  assert.match(
    readiness.reality,
    /Flux reconciliation and initialization Jobs may still be working/,
  );
  assert.match(readiness.reality, /does not make an API call/);
  assert.match(
    readiness.reality,
    /authenticated request verifies only the path exercised/,
  );
  assert.match(readiness.reality, /150-minute value is a deadline/);
  assert.match(readiness.reality, /not an expected wait/);
  for (const phrase of ['first of five', 'the rest', 'later milestone'])
    assert.doesNotMatch(misconceptionCopy, new RegExp(phrase, 'i'));
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
  assert.deepEqual(
    deepDives.map((episode) => episode.id),
    ['stack', 'branches'],
    'the page offers the two deep dives, stack first',
  );
  assert.equal(defaultEpisode.id, 'stack', 'the stack plays by default');
  for (const episode of deepDives) {
    const art = new URL(`../public/${episode.art}`, import.meta.url);
    assert.ok(existsSync(art), `${episode.id}: missing ${fileURLToPath(art)}`);
  }
  const listenPage = pageRenderers.listen(parseRoute('#listen'));
  assert.equal(
    listenPage.split('class="episode-card owner-').length - 1,
    2,
    'two episode cards',
  );
  assert.ok(
    !listenPage.includes('episode=orientation') &&
      !listenPage.includes('episode=brief'),
    'the orientation and the brief are not offered on the page',
  );
  assert.ok(
    pageRenderers
      .listen(parseRoute('#listen?episode=orientation'))
      .includes('Why Azure OSDU needs service forks'),
    'the published orientation route still plays',
  );
  assert.ok(
    !listenPage.includes('guide-kicker') && !listenPage.includes('Read along'),
    'plain Markers and Transcript headings',
  );
  const listenHero = new URL(
    `../public/${chapters.listen.hero.image}`,
    import.meta.url,
  );
  assert.ok(existsSync(listenHero), 'the headphones strip exists');
  const home = pageRenderers.home(parseRoute('#start'));
  assert.ok(
    home.includes('data-listen-episode="brief"') &&
      home.includes('data-listen-stop="112"'),
    'home carries the two-minute brief as its cue',
  );
  assert.ok(
    home.includes('data-video-open') && home.includes('aria-haspopup="dialog"'),
    'home opens the video in a dialog',
  );
  assert.ok(
    !home.includes('<video') && !home.includes('data-play-frame-video'),
    'the video is not embedded in the page',
  );
  const player = frameVideoPlayer();
  assert.ok(
    player.includes('data-frame-video') &&
      player.includes(`src="${frameVideo.captions}"`) &&
      frameVideo.notes.every((note) => player.includes(escapeHtml(note))),
    'the video dialog carries captions and the source-check notes',
  );
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
    !home.includes('href="#listen"') && !home.includes('All episodes'),
    'the introduction lists no episodes',
  );
  const learnKeys = Object.keys(chapters).filter(
    (key) => chapters[key].group === 'learn',
  );
  assert.deepEqual(
    chapters.start.index.map((group) => group.label),
    ['The stack', 'Provider code and engineering'],
  );
  assert.deepEqual(
    chapters.start.index.flatMap((group) => Object.keys(group.lessons)),
    learnKeys,
    'the lesson index lists every lesson once, in order',
  );
  assert.deepEqual(Object.keys(chapters.start.index[0].lessons), [
    'running-stack',
    'bring-up',
  ]);
  for (const group of chapters.start.index)
    assert.ok(home.includes(`>${group.label}</h3>`), group.label);
  for (const key of learnKeys)
    assert.equal(
      home.split(`href="${routeHref(key)}"`).length - 1,
      1,
      `home links ${key} once`,
    );
  assert.match(
    home,
    new RegExp(
      `<li class="is-first"><a href="${routeHref(learnKeys[0])}"><span class="lesson-number">01</span>`,
    ),
    '01 carries the starting emphasis',
  );
  assert.ok(
    home.indexOf('data-video-open') < home.indexOf('class="lesson-index"'),
    'the introduction comes before the lesson index',
  );
  for (const retired of [
    'class="doors"',
    'home-frame',
    'path-cards',
    'round-trip',
    'zoom-ladder',
    routeHref('running-stack', 'request'),
    'guide-kicker',
  ])
    assert.ok(!home.includes(retired), `home no longer carries ${retired}`);
  assert.ok(
    !spiNamesFigure().includes('href="#'),
    'the SPI meanings carry no lesson link each',
  );
  assert.equal(
    spiNamesFigure().split('class="spi-name-repo"').length - 1,
    3,
    'each SPI meaning links its repository',
  );
  assert.equal(
    home.split('class="home-sources"').length - 1,
    1,
    'one source area',
  );
  assert.ok(!home.includes('source-cards'), 'the source cards are gone');
  assert.equal(
    home.split('class="deeper-card').length - 1,
    chapters.start.deeper.length,
    'Go deeper renders one card per entry',
  );
  for (const entry of chapters.start.deeper)
    assert.ok(
      sources[entry.source] && entry.title && entry.note && entry.kicker,
      `Go deeper entry ${entry.source} is complete`,
    );
  assert.ok(
    home.indexOf('home-introduction') < home.indexOf('class="home-names"') &&
      home.indexOf('class="home-names"') <
        home.indexOf('class="home-lessons"') &&
      home.indexOf('class="home-lessons"') <
        home.indexOf('class="home-sources"'),
    'Start runs introduction, three meanings, lessons, then go deeper',
  );
  assert.ok(
    !home.includes('<details class="home-sources"'),
    'sources are not collapsed',
  );
  const heroFile = new URL(
    `../public/${chapters.start.hero.image}`,
    import.meta.url,
  );
  assert.ok(existsSync(heroFile), `missing ${fileURLToPath(heroFile)}`);
  assert.ok(chapters.start.hero.alt.length > 20, 'the hero image has alt text');
  const html = readFileSync(
    new URL('../src/index.html', import.meta.url),
    'utf8',
  );
  const masthead = html.slice(
    html.indexOf('<header class="masthead">'),
    html.indexOf('</header>'),
  );
  assert.ok(!masthead.includes('Explore'), 'the masthead has no Explore link');
  assert.equal(
    masthead.split('class="masthead-label"').length,
    3,
    'each masthead link labels its icon',
  );
  const intro = html.slice(
    html.indexOf('<div class="intro">'),
    html.indexOf('id="view-scope"'),
  );
  assert.ok(
    intro.indexOf('id="headline"') < intro.indexOf('id="subhead"') &&
      intro.indexOf('id="subhead"') < intro.indexOf('id="hero-image"') &&
      intro.indexOf('id="hero-image"') < intro.indexOf('id="introduction"'),
    'headline, subhead, machinery strip, then the paragraph',
  );
  assert.ok(
    chapters.start.hero.width <= 700 && chapters.start.hero.height >= 300,
    'the strip is cropped to the gears',
  );
  assert.ok(
    !masthead.includes('<details') &&
      masthead.includes('class="masthead-link" href="#listen"') &&
      masthead.includes('class="masthead-link" href="#field-guides"') &&
      masthead.split('class="masthead-icon"').length === 3,
    'Audio deep dives and Visual field guides are two icon links',
  );
  assert.match(html, /<dialog\s+id="video-dialog"/);
  const nav = chapterNavigation('running-stack');
  assert.ok(
    !nav.includes('href="#listen"') && !nav.includes('href="#field-guides"'),
    'the rail carries chapters, not resources',
  );
  const base = readFileSync(
    new URL('../src/styles/base.css', import.meta.url),
    'utf8',
  );
  assert.match(
    base,
    /body\[data-page='home'\] \.rail \{\s*display: none;/,
    'the home rail rule',
  );
  assert.match(
    base,
    /body\[data-page='listen'\] \.rail,\s*body\[data-page='guides'\] \.rail \{\s*display: none;/,
    'the supplement pages have no rail',
  );
  assert.ok(
    !home.includes('Optional'),
    'the introduction is not labeled optional',
  );
  assert.match(chapters.start.intro, /Service Provider Interface \(SPI\)/);
  assert.equal(
    chapters.start.intro.split('<p>').length,
    4,
    'the opening is three short paragraphs',
  );
  assert.ok(
    !chapters.start.intro.includes('three things') &&
      !chapters.start.intro.includes('all three'),
    'the naming convention belongs to the cards',
  );
  assert.ok(
    chapters.start.intro.includes(
      'target="_blank" rel="noopener noreferrer">Community Implementation (CIMPL)</a>',
    ),
    'the intro links CIMPL to the community project',
  );
  assert.ok(
    !chapters.start.intro.includes('OSDU on Azure'),
    'no OSDU on Azure',
  );
  assert.ok(chapters.start.subhead.length > 20, 'the start page has a subhead');
  assert.ok(
    !chapters.start.headline.endsWith('.'),
    'the start headline is a title, not a sentence',
  );
  assert.ok(
    home.includes('start/watch.webp'),
    'the Watch card uses the gear badge',
  );
  assert.ok(
    home.includes('How the machinery is engineered'),
    'the Watch card is captioned after the headline',
  );
  assert.ok(!home.includes('Source-checked'), 'no review-date line');
  assert.ok(!home.includes('Not quite'));
  assert.ok(
    !pageRenderers.myths(parseRoute('#not-true')).includes('Not quite'),
  );
  const guides = pageRenderers.guides(parseRoute('#field-guides'));
  const sectioned = guideSections.flatMap((section) => section.ids);
  assert.deepEqual(
    [...sectioned].sort(),
    [...courseMaps, ...nativeGuides, ...suppliedPosters]
      .map((entry) => entry.id)
      .sort(),
    'every map, guide, and poster sits in exactly one section',
  );
  assert.equal(guideSections[0].ids[0], 'round-trip', 'the maps come first');
  assert.ok(
    guides.indexOf('id="guide-familiar"') <
      guides.indexOf('id="guide-identity"') &&
      guides.indexOf('id="guide-identity"') <
        guides.indexOf('id="guide-contribution-chain"') &&
      guides.indexOf('id="guide-contribution-chain"') <
        guides.indexOf('id="guide-borrow-prove-restore"'),
    'sections follow the lesson order',
  );
  for (const entry of [...courseMaps, ...nativeGuides, ...suppliedPosters])
    assert.ok(
      guides.includes(`id="guide-${entry.id}"`),
      `the page renders ${entry.id}`,
    );
  assert.ok(!guides.includes('guide-index'), 'no second index on the page');
  assert.ok(
    !guides.includes('Print this page') && !guides.includes('built in HTML'),
    'no method copy on the page',
  );
  assert.equal(suppliedPosters.length, 6, 'the generated posters are retired');
  for (const [old, replacement] of Object.entries(retiredGuides)) {
    const route = parseRoute(`#field-guides?guide=${old}`);
    assert.deepEqual(
      [route.chapter, route.guide],
      ['field-guides', replacement],
      `${old} still lands on a guide`,
    );
  }
  assert.ok(
    existsSync(
      new URL(
        `../public/${chapters['field-guides'].hero.image}`,
        import.meta.url,
      ),
    ),
    'the drafting strip exists',
  );
  for (const key of Object.keys(chapters))
    for (const [, href] of chapterScope(key).matchAll(/href="([^"]+)"/g))
      verifyRoute(href, `${key} scope`);
  for (const id of ['round-trip', 'ladder']) {
    assert.ok(guides.includes(`id="guide-${id}"`), `field guides render ${id}`);
    for (const href of [`#field-guides?guide=${id}`, `#start?guide=${id}`]) {
      const route = parseRoute(href);
      assert.deepEqual(
        [route.chapter, route.guide],
        ['field-guides', id],
        `${href} lands on the Field guides page`,
      );
    }
  }
  assert.ok(guides.includes('class="round-trip"'));
  assert.ok(guides.includes('class="zoom-ladder"'));
  assert.equal(parseRoute('#start?guide=profiles').chapter, 'start');
  assert.equal(
    parseRoute('#__proto__?guide=constructor').chapter,
    'start',
    'moved guide lookup ignores inherited keys',
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

test('readiness signals guide compares five proof scopes without ordering them', () => {
  const guide = nativeGuides.find((entry) => entry.id === 'milestones');
  const body = infographics.milestones();
  const compact = guideFigure('milestones', { compact: true });
  const full = guideFigure('milestones');
  const renderedCopy = `${guide.title} ${guide.summary} ${body}`;

  assert.equal(guide.appearsIn.href, '#bring-up/inspect');
  assert.deepEqual(guide.sources, ['lifecycle']);
  assert.match(guide.summary, /separate signals, not deployment steps/);
  assert.match(
    guide.summary,
    /verifies the requested Git artifact revision before exit/,
  );
  assert.match(guide.summary, /Flux overlaps the final CLI work/);
  assert.match(body, /<ul role="list" class="guide-milestones">/);
  assert.equal(body.match(/<li class="owner-/g)?.length, 5);
  assert.doesNotMatch(body, /<ol|milestone-number|Only the fifth/);
  assert.match(body, /orchestration completed without a fatal error/);
  assert.match(body, /Flux has the requested revision to reconcile/);
  assert.match(body, /status\.artifact\.revision/);
  assert.match(body, /configured health checks/);
  assert.match(body, /bootstrap and schema loading finished/);
  assert.match(body, /particular request path you exercised is usable/);
  assert.match(body, /without making an authenticated request/);
  assert.match(body, /request proves only the exercised API path/);
  assert.match(body, /Running phase is not necessarily Ready/);
  assert.match(body, /Job should be Complete rather than Running/);
  for (const markup of [compact, full]) {
    assert.match(markup, /Readiness signals and what they prove/);
    assert.match(markup, /<ul role="list" class="guide-milestones">/);
  }
  for (const phrase of ['first of five', 'the rest', 'later milestone'])
    assert.doesNotMatch(renderedCopy, new RegExp(phrase, 'i'));
});

test('source links use readable documentation and match a sibling checkout when present', () => {
  for (const [key, source] of Object.entries(sources))
    verifySourceRecord(key, source);
});

test('tryIt fixtures and authored recipes satisfy the content contract', () => {
  verifyTryIt(singleVariantTryIt, 'single variant fixture');
  verifyTryIt(multipleVariantTryIt, 'multiple variant fixture');
  for (const [key, chapter] of Object.entries(chapters))
    if (chapter.tryIt) verifyTryIt(chapter.tryIt, key);
});

test('tryIt validation rejects focused invalid clones', () => {
  const missingSummary = structuredClone(singleVariantTryIt);
  delete missingSummary.summary;
  assert.throws(
    () => verifyTryIt(missingSummary, 'missing summary'),
    /summary/,
  );

  const longSummary = structuredClone(singleVariantTryIt);
  longSummary.summary = `Try it: ${'a very long label '.repeat(6)}`;
  assert.throws(() => verifyTryIt(longSummary, 'long summary'), /summary/);

  const invalidConnection = structuredClone(multipleVariantTryIt);
  invalidConnection.connection.sources = ['unknown'];
  assert.throws(
    () => verifyTryIt(invalidConnection, 'invalid connection'),
    /unknown source/,
  );

  const invalidAccess = structuredClone(singleVariantTryIt);
  invalidAccess.variants[0].access = 'free';
  assert.throws(() => verifyTryIt(invalidAccess, 'invalid access'), /access/);

  const malformedStep = structuredClone(singleVariantTryIt);
  malformedStep.variants[0].steps[0].command = 'spi --help';
  assert.throws(() => verifyTryIt(malformedStep, 'malformed step'), /action/);

  const missingRemains = structuredClone(singleVariantTryIt);
  missingRemains.variants[0].cleanup.remains = '';
  assert.throws(
    () => verifyTryIt(missingRemains, 'missing remains'),
    /cleanup\.remains/,
  );

  const unknownSource = structuredClone(singleVariantTryIt);
  unknownSource.variants[0].prerequisites[0].sources = ['unknown'];
  assert.throws(
    () => verifyTryIt(unknownSource, 'unknown source'),
    /unknown source/,
  );
});

test('tryIt renderer returns an inert, escaped native disclosure', () => {
  assert.equal(tryItBand({}), '');

  const single = tryItBand({ tryIt: singleVariantTryIt });
  const multiple = tryItBand({ tryIt: multipleVariantTryIt });
  assert.match(
    single,
    /<summary><span>Try it: trace the partition lookup · browser only<\/span><\/summary>/,
  );
  assert.doesNotMatch(single, /<summary>.*About 5 minutes.*<\/summary>/s);
  for (const text of [
    'Read the provider path',
    'Prerequisites',
    'What this changes',
    'Active effort',
    'Automated wait',
    'Clean-up effort',
    'Steps',
    'Common alternate result',
    'Clean up',
    'What remains',
    'Tested with',
    'Sources:',
    'executes nothing and reports no live environment state',
  ])
    assert.ok(single.includes(text), text);
  assert.match(
    multiple,
    /<summary><span>Try it: compare environment routes · Azure charges apply<\/span><\/summary>/,
  );
  for (const variant of multipleVariantTryIt.variants)
    assert.ok(
      multiple.includes(escapeHtml(variant.time.active)),
      `${variant.label}: timing stays inside the band`,
    );
  assert.match(
    multiple,
    /<h3>Using an existing environment<\/h3><p>Already have an environment\? Connect to it with spi connect --resource-group &lt;resource-group&gt;/,
  );
  assert.doesNotMatch(single, /Using an existing environment/);
  assert.match(multiple, /An Azure subscription and permissions/);
  assert.match(multiple, /<code>spi up --env &lt;name&gt;<\/code>/);

  for (const markup of [single, multiple]) {
    assert.match(markup, /<details>/);
    assert.doesNotMatch(markup, /<details[^>]*\sopen(?:\s|>)/);
    assert.doesNotMatch(
      markup,
      /data-(?:detail|map-jump|evidence)|<(?:button|input|form)\b|\son[a-z]+=/,
    );
  }

  const referenced = new Set();
  for (const variant of multipleVariantTryIt.variants) {
    for (const item of variant.prerequisites)
      item.sources.forEach((key) => referenced.add(key));
    for (const step of [...variant.steps, ...variant.cleanup.steps])
      step.sources?.forEach((key) => referenced.add(key));
    variant.sources.forEach((key) => referenced.add(key));
  }
  const renderedHrefs = [...multiple.matchAll(/href="([^"]+)"/g)].map(
    ([, href]) => href,
  );
  assert.deepEqual(
    new Set(renderedHrefs),
    new Set([...referenced].map((key) => sources[key].href)),
  );

  const escapedFixture = structuredClone(singleVariantTryIt);
  escapedFixture.activity = 'inspect <script>';
  escapedFixture.variants[0].result = 'Keep <name> & source text literal.';
  delete escapedFixture.variants[0].steps[0].click;
  escapedFixture.variants[0].steps[0].command = 'printf "<name>&"';
  const escaped = tryItBand({ tryIt: escapedFixture });
  assert.match(escaped, /inspect &lt;script&gt;/);
  assert.match(escaped, /Keep &lt;name&gt; &amp; source text literal/);
  assert.match(escaped, /printf &quot;&lt;name&gt;&amp;&quot;/);
  assert.doesNotMatch(escaped, /<script>|<name>/);

  const unknownSource = structuredClone(singleVariantTryIt);
  unknownSource.variants[0].sources = ['unknown'];
  assert.throws(
    () => tryItBand({ tryIt: unknownSource }),
    /Unknown source key: unknown/,
  );
});

test('comparison source URLs require approved repositories and immutable revisions', () => {
  assert.match(sources.partitionCacheFix.href, partitionSourcePattern);
  const pinnedSources = [
    ['architecture', stackSourcePattern],
    ['partitionProvider', partitionSourcePattern],
    ['partitionPom', partitionSourcePattern],
    ['partitionRedis', partitionSourcePattern],
    ['partitionTableStore', partitionSourcePattern],
    ['communityPartitionInterface', communityPartitionSourcePattern],
    ['communityPartitionProvider', communityPartitionSourcePattern],
    ['communityPartitionCache', communityPartitionSourcePattern],
    ['communityPartitionRepository', communityPartitionSourcePattern],
    ['communityPartitionPom', communityPartitionSourcePattern],
    ['cimplArchitecture', cimplStackSourcePattern],
    ['cimplPartitionSecrets', cimplStackSourcePattern],
  ];

  for (const [key, pattern] of pinnedSources) {
    const source = sources[key];
    assert.match(source.href, pattern, key);
    assert.ok(source.href.endsWith(`/${source.path}`), key);
    assert.ok(source.href.includes(`/blob/${source.revision}/`), key);
    assert.match(source.label, new RegExp(source.revision.slice(0, 7)), key);
  }

  assert.doesNotMatch(
    'https://community.opengroup.org/osdu/platform/system/partition/-/blob/main/partition-core/pom.xml',
    communityPartitionSourcePattern,
  );
  assert.doesNotMatch(
    'https://community.opengroup.org/osdu/platform/deployment-and-operations/cimpl-stack/-/blob/fe56aa1b/docs/architecture.md',
    cimplStackSourcePattern,
  );
  assert.doesNotMatch(
    'https://github.com/other/osdu-spi-partition/blob/3a5690da3147d022ca9a2402858cd7b96e4688cf/pom.xml',
    partitionSourcePattern,
  );
});

test('learn views retain authored lesson metadata and omit repeated scaffolding', () => {
  const learn = Object.entries(chapters).filter(
    ([, chapter]) => chapter.group === 'learn',
  );
  for (const [id, chapter] of learn) {
    assert.ok(chapter.question?.trim(), `${id}: question`);
    assert.ok(chapter.builds?.trim(), `${id}: builds`);
    assert.ok(chapter.outcomes?.length >= 2, `${id}: outcomes`);
    assert.ok(chapter.where?.trim(), `${id}: where`);
    const scope = chapterScope(id);
    const outcomes = chapterOutcomes(id);
    for (const label of [
      'This lesson answers',
      'This view answers',
      'By the end',
      'In this view',
    ])
      assert.doesNotMatch(scope, new RegExp(label), `${id}: ${label}`);
    assert.ok(!scope.includes(chapter.question), `${id}: visible question`);
    if (chapter.goal)
      assert.ok(!scope.includes(chapter.goal), `${id}: visible goal`);
    if (hasClaims(chapter)) assert.equal(scope, '', `${id}: structured scope`);
    else {
      assert.ok(scope.includes(chapter.builds), `${id}: prerequisite`);
      assert.ok(scope.includes(chapter.where), `${id}: location`);
    }
    assert.equal(
      outcomes.match(/<h2>What you can now say<\/h2>/g)?.length,
      1,
      `${id}: outcome heading`,
    );
    assert.doesNotMatch(outcomes, /Carry forward/, `${id}: outcome kicker`);

    const mistakeIds = Array.isArray(chapter.mistakes)
      ? chapter.mistakes
      : Object.values(chapter.mistakes || {});
    for (const mistakeId of new Set(mistakeIds)) {
      const myth = myths.find(({ id: mythId }) => mythId === mistakeId);
      const callout = mythCallout(mistakeId, id);
      assert.doesNotMatch(callout, /All \d+, by theme/, `${id}: collection`);
      assert.ok(callout.includes(myth.reality), `${id}: correction`);
      assert.ok(callout.includes(sources[myth.source].href), `${id}: source`);
    }
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
  const roundTrip = pageRenderers.guides(
    parseRoute('#field-guides?guide=round-trip'),
  );
  for (const key of ['fork-shape', 'fork-day', 'handshake']) {
    assert.ok(home.includes(`href="#${key}"`), `home links ${key}`);
    assert.ok(roundTrip.includes(`href="#${key}`), `round trip links ${key}`);
  }
});

test('lesson workspace keeps claims and context between its header and map', () => {
  const html = readFileSync(
    new URL('../src/index.html', import.meta.url),
    'utf8',
  );
  const exploration = html.indexOf('id="exploration"');
  const header = html.indexOf('<header class="visual-header">', exploration);
  const headerEnd = html.indexOf('</header>', header);
  const claims = html.indexOf('id="chapter-claims"');
  const context = html.indexOf('id="claim-context"');
  const workspace = html.indexOf('class="visual-workspace"', exploration);

  assert.ok(
    exploration < header &&
      header < headerEnd &&
      headerEnd < claims &&
      claims < context &&
      context < workspace,
    'title row, claim controls, selected explanation, then map workspace',
  );
  for (const id of ['chapter-claims', 'claim-context'])
    assert.equal(
      [...html.matchAll(new RegExp(`id="${id}"`, 'g'))].length,
      1,
      `${id} occurs once`,
    );
  assert.match(
    html.slice(context, workspace),
    /aria-live="polite"[\s\S]*hidden/,
  );
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
    const outcomesMarkup = chapterOutcomes(key);
    const lifecycle = isLifecycleLesson(chapter);
    if (lifecycle)
      assert.doesNotMatch(
        claimsMarkup,
        /<button|data-claim|data-evidence|aria-pressed|Select an idea/,
        `${key}: lifecycle claims are statements, not controls`,
      );
    else
      assert.match(
        claimsMarkup,
        /Select an idea to highlight it on the map\./,
        `${key}: learner-facing claim instruction`,
      );
    assert.doesNotMatch(claimsMarkup, /claims, one map/);
    claims.forEach((claim, index) => {
      const contextMarkup = claimContext(key, index);
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
      if (key === 'running-stack')
        assert.ok(
          claim.headline.split(/\s+/).length < 12,
          `${claim.headline}: fewer than twelve words`,
        );
      assert.ok(
        outcomesMarkup.includes(escapeHtml(claim.text)),
        `${key}: claim ${index} is carried forward`,
      );
      if (lifecycle) {
        assert.ok(
          claimsMarkup.includes(escapeHtml(claim.headline)) &&
            claimsMarkup.includes(escapeHtml(claim.why)),
          `${key}: claim ${index} statement shows its headline and reason`,
        );
      } else {
        assert.ok(
          contextMarkup.includes(escapeHtml(claim.text)),
          `${key}: claim ${index} sentence is beside the map`,
        );
        assert.ok(
          contextMarkup.includes(escapeHtml(claim.why)),
          `${key}: claim ${index} reason is beside the map`,
        );
        assert.ok(
          !claimsMarkup.includes(escapeHtml(claim.why)),
          `${key}: claim ${index} reason is absent from compact controls`,
        );
        assert.ok(
          claimsMarkup.includes(
            routeHref(
              key,
              claim.evidenceStep || claim.step || null,
              claim.evidence,
              { claim: index },
            ),
          ),
          `${key}: claim ${index} evidence destination`,
        );
      }
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

test('claim context escapes authored copy and excludes unstructured lessons', () => {
  assert.equal(claimContext('fork-shape', 0), '');
  assert.match(claimContext('running-stack', 0), /spi up --env &lt;name&gt;/);
  assert.doesNotMatch(claimContext('running-stack', 0), /<name>/);
});

test('lesson 01 editorial copy introduces its example and complete command', () => {
  const chapter = chapters['running-stack'];
  const misconception = myths.find((myth) => myth.id === 'stack-is-only-aks');
  const callout = mythCallout(misconception.id, 'running-stack');
  const overview = architectureMap();
  const lifecycle = architectureMap(1);

  assert.match(chapters.start.intro, /Community Implementation \(CIMPL\)/);
  assert.equal(
    chapter.intro,
    "The stack is one development and test environment in an Azure resource group. OSDU services run in AKS; Azure data services sit alongside it. Some resources belong to a partition such as opendes, while others are shared. CIMPL runs supporting middleware in Kubernetes. Azure SPI uses Azure data services alongside AKS, while Elasticsearch, Redis, and Airflow's database remain in the cluster.",
  );
  assert.equal(chapter.figure, 'The deployed stack');
  assert.equal(
    chapter.outcomes[1].headline,
    'Partition resources and shared resources.',
  );
  assert.equal(
    chapter.outcomes[1].why,
    'In this stack, opendes owns a Cosmos DB SQL account, Storage account, and Service Bus namespace; common Storage, the entitlements Gremlin database, Key Vault, and the service identity are shared.',
  );
  assert.equal(
    chapter.outcomes[2].why,
    'Each service image includes its Azure provider.',
  );
  assert.equal(chapter.example.title, 'a partition lookup');
  assert.match(
    chapter.example.note,
    /^The map uses opendes as its example partition\./,
  );
  assert.match(
    chapter.example.providerPath,
    /cache, then Azure Table Storage in common Storage/,
  );
  assert.match(
    chapter.example.providerPath,
    /does not visit the partition’s Cosmos, blob Storage, or Service Bus/,
  );
  assert.equal(
    chapter.outcomes[0].why,
    'spi up --env <name> creates AKS and its Azure resources together.',
  );
  assert.match(claimContext('running-stack', 0), /spi up --env &lt;name&gt;/);
  assert.match(overview, /One development and test environment/);
  assert.doesNotMatch(overview, /Your environment ·/);
  assert.match(lifecycle, /Your environment · Azure resources created/);
  for (const label of [
    'Outside the stack',
    'Outside AKS',
    'Per partition · opendes',
  ])
    assert.match(overview, new RegExp(label));
  assert.equal(chapter.mistakes.developer, misconception.id);
  assert.equal(misconception.source, 'architecture');
  assert.equal(misconception.reality.match(/[.!?](?:\s|$)/g)?.length, 2);
  assert.match(callout, /Cosmos DB, Storage, and Service Bus/);
  assert.doesNotMatch(callout, /partition lookup|Table Storage/);
  assert.match(
    callout,
    /href="#running-stack\/developer\?detail=environment" data-map-jump/,
  );
  assert.ok(chapter.sources.includes('architecture'));
  assert.ok(chapter.sources.includes('cimplArchitecture'));
  assert.ok(chapter.sources.includes('images'));
  assert.ok(chapter.guides.includes('profiles'));
  assert.equal(chapters['bring-up'].mistakes.start, 'profiles-save-money');
  assert.equal(chapters['bring-up'].mistakes.provision, 'profiles-save-money');
});

test('lesson 02 preserves its outcomes as three moment-aware claims', () => {
  const chapter = chapters['bring-up'];
  const expectedOutcomes = [
    'The CLI and Bicep create Azure and seed the cluster; Flux assembles the workloads; controllers keep them healthy. Flux and Kubernetes controllers continue after the CLI returns.',
    'A successful spi up does not establish API readiness. I follow workload health and initialization with spi status --watch, then verify the API path I need with an authenticated request.',
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

test('lesson 02 editorial copy states the continuing rollout', () => {
  const chapter = chapters['bring-up'];

  assert.equal(
    chapter.headline.replace(/<[^>]+>/g, ' ').trim(),
    'spi up creates the environment. Flux continues the rollout.',
  );
  assert.match(
    chapter.outcomes[0].text,
    /Flux and Kubernetes controllers continue after the CLI returns/,
  );
});

test('lesson 02 readiness signals separate orchestration from API proof', () => {
  const readiness = chapters['bring-up'].outcomes[1];
  const visibleCopy = `${readiness.text} ${readiness.why}`;
  const explanation = resolveDetail('readiness', 'bring-up').summary;

  assert.equal(readiness.headline, 'CLI success is not API readiness.');
  assert.match(readiness.text, /spi up does not establish API readiness/);
  assert.match(readiness.text, /spi status --watch/);
  assert.match(readiness.text, /authenticated request/);
  assert.equal(
    readiness.why,
    'Flux and initialization can continue after spi up returns. Watch spi status --watch, then verify the API operation you need.',
  );
  assert.match(explanation, /requested Git artifact revision before it exits/);
  assert.match(explanation, /Flux overlaps its final work/);
  assert.match(explanation, /Ready Kustomizations and HelmReleases/);
  assert.match(explanation, /Complete initialization Jobs/);
  assert.match(
    explanation,
    /only a successful authenticated lookup proves the exercised API path/,
  );
  assert.match(explanation, /makes no API request/);
  for (const phrase of ['first of five', 'the rest', 'later milestone'])
    assert.doesNotMatch(visibleCopy, new RegExp(phrase, 'i'));
});

test('lesson 02 claim rendering and example routes preserve lesson 01 behavior', () => {
  const chapter = chapters['bring-up'];
  const strip = claimStrip('bring-up');
  const outcomes = chapterOutcomes('bring-up');
  const expectedEvidence = [
    '#bring-up/reconcile?detail=flux&claim=0',
    '#bring-up/inspect?detail=readiness&claim=1',
    '#bring-up/remove?detail=retained&claim=2',
  ];
  assert.ok(isLifecycleLesson(chapter), 'lesson 02 is the lifecycle lesson');
  assert.deepEqual(
    Object.entries(chapters)
      .filter(([, entry]) => isLifecycleLesson(entry))
      .map(([key]) => key),
    ['bring-up'],
  );
  assert.doesNotMatch(strip, /<button|data-claim|data-evidence|aria-pressed/);
  for (const [index, claim] of chapter.outcomes.entries()) {
    assert.ok(strip.includes(claim.headline), `claim ${index} headline`);
    assert.ok(strip.includes(claim.why), `claim ${index} statement reason`);
    assert.ok(outcomes.includes(claim.text), `claim ${index} full outcome`);
    assert.deepEqual(
      resolveLessonSelection(chapter, parseRoute(expectedEvidence[index])),
      { claim: index, hop: -1, exampleOpen: false },
      `claim ${index} published evidence route still resolves`,
    );
    verifyRoute(expectedEvidence[index], `claim ${index} evidence route`);
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
        `href="${routeHref('bring-up', hop.step, hop.detail, { hop: index })}"`,
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
    lessonOneClaims.includes(
      'href="#running-stack?detail=environment&claim=0"',
    ),
    'timeless claim evidence keeps its chapter-only route',
  );
  assert.ok(
    lessonOneExample.includes(
      'href="#running-stack/request?detail=gateway&hop=1"',
    ),
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

test('lesson 02 is operated by its lifecycle stages', () => {
  const chapter = chapters['bring-up'];
  assert.equal(
    chapter.question,
    'How is the stack created, and when is it usable?',
  );
  assert.doesNotMatch(chapter.intro, /Each moment shows who acts/);
  const byId = Object.fromEntries(
    creationMoments.map((moment) => [moment.id, moment]),
  );
  assert.equal(
    byId.bootstrap.title,
    'Prepare cluster configuration and identity.',
  );
  assert.match(
    byId.inspect.copy,
    /get a token for an authenticated readiness check/,
  );
  assert.doesNotMatch(byId.inspect.copy, /app-only caller|shared environment/);
  assert.equal(byId.start.time, 'Before provisioning');
  assert.equal(byId.start.timeKind, undefined);
  for (const id of ['provision', 'bootstrap', 'reconcile', 'inspect', 'remove'])
    assert.ok(byId[id].timeKind, `${id}: timing keeps its label`);

  for (const [index, moment] of creationMoments.entries()) {
    const markup = creationWalkthrough(
      parseRoute(routeHref('bring-up', moment.id)),
    );
    const next = creationMoments[index + 1];
    assert.doesNotMatch(markup, /Previous|Already have a stack|Connect to it/);
    assert.equal(
      [...markup.matchAll(/data-stage-link/g)].length,
      creationMoments.length + (next ? 1 : 0),
      `${moment.id}: stage links`,
    );
    assert.match(
      markup,
      /<div class="creation-story" id="creation-story">.*<h3 id="creation-story-title" tabindex="-1">/s,
    );
    if (next)
      assert.ok(
        markup.includes(
          `<a href="${routeHref('bring-up', next.id)}" data-route-key="next" data-stage-link data-stage-continue>Continue to ${next.name} →</a>`,
        ),
        `${moment.id}: Continue names ${next.name}`,
      );
    else assert.doesNotMatch(markup, /creation-controls|Continue to/);
    assert.equal(
      markup.includes('<small></small>'),
      false,
      `${moment.id}: no empty timing label`,
    );
  }

  for (const [step, id, detail] of [
    ['bootstrap', 'delete-secret-rotates', 'vault'],
    ['reconcile', 'suspended-means-frozen', 'flux'],
  ]) {
    const href = `#bring-up/${step}?detail=${detail}`;
    const callout = mythCallout(id, 'bring-up');
    assert.ok(
      callout.includes(`href="${href}" data-map-jump`),
      `${id}: stays on the lifecycle map`,
    );
    assert.equal(chapter.mistakes[step], id);
    verifyRoute(href, `${id} in lesson 02`);
    const myth = myths.find((entry) => entry.id === id);
    assert.match(myth.route, /^#running-stack/, `${id}: collection route kept`);
    assert.ok(
      mythCallout(id, 'running-stack').includes(`href="${myth.route}"`),
      `${id}: other lessons keep the collection route`,
    );
  }

  const tryIt = chapter.tryIt;
  assert.equal(
    tryIt.summary,
    'Try it: bring up an environment · Azure charges apply',
  );
  assert.deepEqual(
    tryIt.variants.map((variant) => variant.access),
    ['Azure resources billed separately', 'browser only'],
  );
  assert.match(tryIt.connection.text, /spi connect --resource-group/);
  const band = tryItBand(chapter);
  assert.ok(
    band.indexOf('Run it in your subscription') <
      band.indexOf('Read a run without Azure'),
  );
  assert.match(
    band,
    /<summary><span>Try it: bring up an environment · Azure charges apply<\/span><\/summary>/,
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
  const contexts = chapter.outcomes
    .map((_, index) => claimContext('spi-boundary', index))
    .join('');
  for (const fact of [
    'partition-core calls IPartitionService.getPartition',
    'partition-core-plus checks its configured VmCache',
    'reads PostgreSQL on a miss',
    'Redis inside AKS with middleware credentials',
    'Workload Identity for the common Table Storage read',
    'same service process',
    'not a network hop',
    'provider/partition-azure stays fork-owned',
  ])
    assert.ok(contexts.includes(fact), `claim context includes ${fact}`);
  assert.doesNotMatch(claims, /<small>/);

  const outcomes = chapterOutcomes('spi-boundary');
  for (const claim of chapter.outcomes)
    assert.ok(
      outcomes.includes(escapeHtml(claim.text)),
      `carry forward repeats: ${claim.headline}`,
    );
});

test('lesson 03 states its prerequisite and place in its lead', () => {
  const chapter = chapters['spi-boundary'];
  assert.match(chapter.intro, /^Builds on the partition lookup from 01/);
  assert.match(chapter.intro, /one service inside the osdu namespace/);
  assert.match(chapter.intro, /partition in your environment/);
  assert.match(chapter.intro, /Service Provider Interface \(SPI\)/);
  assert.match(
    chapter.intro,
    /community partition-core-plus implementation.*fork-owned Azure implementation/,
  );
  assert.equal(chapterScope('spi-boundary'), '');
  assert.equal(chapterScope('running-stack'), '');
});

test('lesson 03 editorial copy stays at the provider boundary', () => {
  const chapter = chapters['spi-boundary'];
  const requiredCopy = [
    chapter.question,
    chapter.goal,
    ...chapter.outcomes.flatMap(({ headline, text, why }) => [
      headline,
      text,
      why,
    ]),
    diagramRenderers.spi(),
  ].join(' ');

  assert.equal(
    chapter.question,
    'Where does shared code hand the lookup to the Azure provider?',
  );
  assert.equal(
    chapter.goal,
    'Trace the lookup from shared code into the Azure provider, and explain what happens when the cache fails.',
  );
  assert.equal(
    chapter.outcomes[2].text,
    'The fork maintains the Azure provider separately from generated shared code.',
  );
  assert.equal(
    chapter.outcomes[2].why,
    'Shared code is regenerated from the community repository, while provider/partition-azure stays fork-owned, so removal of upstream’s Azure copy does not delete the fork’s provider.',
  );
  assert.match(requiredCopy, /come from the community repository/);
  assert.doesNotMatch(
    requiredCopy,
    /\bfork_upstream\b|\bfork_integration\b|\bmain\b/,
  );
});

test('partition comparison record renders one closed, bounded two-lane disclosure', () => {
  const entries = Object.entries(chapters).filter(([, chapter]) =>
    Boolean(chapter.comparison),
  );
  assert.deepEqual(
    entries.map(([key]) => key),
    ['spi-boundary'],
  );

  const comparison = entries[0][1].comparison;
  assert.equal(
    comparison.operation,
    'GET /api/partition/v1/partitions/opendes',
  );
  assert.equal(
    comparison.community.revision,
    'Partition 5aa406b9 · CIMPL Stack fe56aa1b',
  );
  assert.equal(
    comparison.azure.revision,
    'osdu-spi-partition 3a5690d · SPI Stack dc2c956',
  );
  assert.deepEqual(comparison.community.sources, [
    'communityPartitionInterface',
    'communityPartitionProvider',
    'communityPartitionCache',
    'communityPartitionRepository',
    'communityPartitionPom',
    'cimplArchitecture',
    'cimplPartitionSecrets',
  ]);
  assert.deepEqual(comparison.azure.sources, [
    'communityPartitionInterface',
    'partitionProvider',
    'partitionRedis',
    'partitionTableStore',
    'partitionPom',
    'architecture',
  ]);

  const markup = partitionComparison('spi-boundary');
  assert.match(markup, /^<details class="partition-comparison">/);
  assert.doesNotMatch(markup, /<details[^>]*\bopen\b/);
  assert.match(markup, /<summary><b>Compare the partition lookup<\/b>/);
  assert.equal(markup.match(/class="partition-lookup-lane /g)?.length, 2);
  for (const label of [
    'Inside the community service process',
    'PostgreSQL',
    'inside the CIMPL Kubernetes cluster',
    'Inside the Azure service process',
    'Redis',
    'inside AKS',
    'Common Table Storage',
    'outside AKS',
  ])
    assert.ok(markup.includes(label), label);

  const orderedLabels = [
    'partition-core-plus',
    'Configured VmCache',
    'OsmPartitionPropertyRepository + PostgreSQL driver',
    'PostgreSQL',
    'provider/partition-azure',
    'Redis',
    'Common Table Storage',
  ];
  let previous = -1;
  for (const label of orderedLabels) {
    const position = markup.indexOf(label, previous + 1);
    assert.ok(position > previous, `${label}: lookup order`);
    previous = position;
  }
  for (const phrase of [
    'cache server does not forward',
    'reachable and opendes exists',
    'does not visit the partition’s Cosmos DB, Blob Storage, or Service Bus',
    'two separately built service images',
    'does not claim a default CIMPL deployment contains that partition',
    'Returned properties can differ',
    'do not identify the implementation',
    'do not prove a deployed image digest or acceptance-test result',
  ])
    assert.ok(markup.includes(phrase), phrase);
  for (const key of [
    ...comparison.community.sources,
    ...comparison.azure.sources,
  ])
    assert.ok(markup.includes(`href="${sources[key].href}"`), key);

  assert.equal(partitionComparison('running-stack'), '');
  assert.doesNotMatch(
    markup,
    /data-detail|data-guide|data-map-jump|data-listen|<button|href="#/,
  );
  assert.doesNotMatch(markup, /\sid="/);
  const escaped = structuredClone(comparison);
  escaped.community.label = '<Community>';
  assert.match(partitionLookupFigure(escaped), /&lt;Community&gt;/);
  assert.deepEqual(
    chapters['spi-boundary'].example.hops.map(({ detail }) => detail),
    ['client', 'core', 'contract', 'azureimpl', 'redis', 'azureclients'],
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

test('all map lesson examples use one closed disclosure and preserve routes', () => {
  const exampleLessons = mapChapters.filter(([, chapter]) => chapter.example);
  assert.deepEqual(
    exampleLessons.map(([key]) => key),
    [
      'running-stack',
      'bring-up',
      'spi-boundary',
      'fork-shape',
      'fork-day',
      'handshake',
    ],
  );
  for (const [key, chapter] of exampleLessons) {
    const steps = chapterSteps(key).length ? chapterSteps(key) : [''];
    for (const step of steps) {
      const href = routeHref(key, step);
      const markup = exampleStrip(key, parseRoute(href));
      assert.match(markup, /^<details class="example-disclosure">/, href);
      assert.doesNotMatch(markup, /^<details[^>]*\bopen\b/, href);
      assert.ok(
        markup.includes(
          `<summary>Example: ${escapeHtml(chapter.example.title)}</summary>`,
        ),
        href,
      );
      assert.ok(
        markup.indexOf('</summary>') <
          markup.indexOf(escapeHtml(chapter.example.code)),
        `${href}: command follows summary`,
      );
      assert.equal(
        (markup.match(/data-hop="/g) || []).length,
        chapter.example.hops.length,
        href,
      );
      assert.ok(markup.includes('data-map-jump'), href);
      for (const [index, hop] of chapter.example.hops.entries()) {
        const options = hasClaims(chapter) ? { hop: index } : {};
        const hopHref = routeHref(
          key,
          hop.step || chapter.example.step || step,
          hop.detail,
          options,
        );
        assert.ok(
          markup.includes(`href="${hopHref}"`),
          `${href}: hop ${index}`,
        );
        const hopRoute = parseRoute(hopHref);
        if (hasClaims(chapter))
          assert.equal(
            resolveLessonSelection(chapter, hopRoute).exampleOpen,
            true,
            hopHref,
          );
        else assert.equal(hopIndexForRoute(chapter, hopRoute), index, hopHref);
        assert.match(
          exampleStrip(key, hopRoute),
          new RegExp(
            `<li class="is-current"><a href="${hopHref.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`,
          ),
          `${hopHref}: current hop`,
        );
      }
      const presentation = resolveExamplePresentation(chapter.example);
      if (presentation.crossing)
        assert.ok(markup.includes(escapeHtml(presentation.crossing)), href);
      if (presentation.providerPath)
        assert.ok(markup.includes(escapeHtml(presentation.providerPath)), href);
      assert.ok(markup.includes(escapeHtml(presentation.note)), href);
    }
    const markup = exampleStrip(key, parseRoute(routeHref(key)));
    assert.equal(
      (markup.match(/data-example-variant=/g) || []).length,
      key === 'spi-boundary' ? 2 : 0,
      key,
    );
  }
  assert.match(
    exampleStrip('running-stack', parseRoute('#running-stack')),
    /^<details class="example-disclosure"><summary>Example: a partition lookup<\/summary>/,
  );
});

test('lesson 02 claim statements keep their reasons to two short sentences', () => {
  for (const claim of chapters['bring-up'].outcomes) {
    const sentences = claim.why.split(/(?<=[.!?])\s+/);
    assert.ok(sentences.length <= 2, `${claim.headline}: ${sentences.length}`);
    assert.ok(
      claim.why.length <= 160,
      `${claim.headline}: ${claim.why.length}`,
    );
  }
  const stages = creationMoments
    .map((moment) => JSON.stringify(moment))
    .join(' ');
  assert.match(stages, /45–50 min/);
  assert.match(stages, /overlaps/);
  assert.match(stages, /45 min deletion deadline/);
});

test('listen chips carry the cue and its length; the recording is named while it plays', () => {
  const chips = listenChips('bring-up');
  for (const cue of chapters['bring-up'].listen) {
    const episode = episodes.find((entry) => entry.id === cue.episode);
    const chip = chips.match(
      new RegExp(
        `<button[^>]*data-seek="${cue.time}" data-listen-episode="${episode.id}"[^>]*>(.*?)</button>`,
        's',
      ),
    );
    assert.ok(chip, cue.label);
    assert.ok(chip[1].includes(`<b>${escapeHtml(cue.label)}</b>`), cue.label);
    assert.match(chip[1], /<small>\d+ min<\/small>/, cue.label);
    assert.ok(!chip[1].includes(episode.short), `${cue.label}: recording name`);
    assert.ok(
      !chip[1].includes('source check'),
      `${cue.label}: source-check count`,
    );
  }
  assert.ok(chips.includes('data-listen-now'));
  const player = readFileSync(
    fileURLToPath(new URL('../src/components/player.js', import.meta.url)),
    'utf8',
  );
  assert.match(player, /class="listen-from">\$\{episode\.short\}/);
});

test('a supplied poster beside a lesson opens in the lightbox with its notes', () => {
  const frame = readFileSync(
    fileURLToPath(new URL('../src/index.html', import.meta.url)),
    'utf8',
  );
  assert.match(frame, /<dialog id="lightbox"/);
  assert.match(frame, /id="lightbox-notes"/);
  assert.match(frame, /id="lightbox-status"/);
  assert.match(frame, /id="lightbox-zoom"/);
  for (const poster of suppliedPosters) {
    const markup = posterInline(poster.id);
    assert.ok(
      markup.includes(
        `<button type="button" class="poster-inline" data-lightbox="${poster.image}"`,
      ),
      `${poster.id}: lightbox opener`,
    );
    assert.ok(
      markup.includes(`data-lightbox-notes="poster-notes-${poster.id}"`),
      `${poster.id}: names its notes`,
    );
    assert.ok(
      markup.includes(
        `<div id="poster-notes-${poster.id}" class="poster-lightbox-notes" hidden>`,
      ),
      `${poster.id}: notes travel with the figure`,
    );
    for (const note of [...poster.notes, ...poster.takeaways])
      assert.ok(markup.includes(note), `${poster.id}: ${note.slice(0, 40)}`);
    assert.ok(
      markup.includes(
        `href="#field-guides?guide=${poster.id}">All field guides →</a>`,
      ),
      `${poster.id}: the Field guides page stays reachable`,
    );
    assert.ok(
      !markup.includes(`<a class="poster-inline"`),
      `${poster.id}: no navigation on the image`,
    );
    assert.equal(guidePreview(poster.id), markup);
  }
  const guides = pageRenderers.guides(parseRoute('#field-guides'));
  for (const poster of suppliedPosters) {
    assert.ok(guides.includes(`id="guide-${poster.id}"`), poster.id);
    assert.ok(guides.includes(`data-lightbox="${poster.image}"`), poster.id);
  }
  // The checks under a poster travel into the lightbox, where the image
  // would otherwise stand alone without them.
  for (const poster of suppliedPosters) {
    assert.ok(
      guides.includes(`data-lightbox-notes="poster-checks-${poster.id}"`),
      `${poster.id}: names its checks for the lightbox`,
    );
    const checks = guides.slice(
      guides.indexOf(`<div id="poster-checks-${poster.id}"`),
    );
    for (const note of poster.notes)
      assert.ok(checks.includes(note), `${poster.id}: ${note.slice(0, 40)}`);
    assert.ok(
      guides.includes(`aria-label="Enlarge ${poster.title}"`),
      `${poster.id}: the button says what it does`,
    );
  }
});

test('marker notes and summaries stand on their own', () => {
  for (const episode of episodes)
    for (const marker of episode.markers) {
      assert.ok(
        !/^Source check/i.test(marker.note || ''),
        `${episode.id} ${marker.time}: the renderer adds the Source check label`,
      );
      assert.ok(
        !/^Source check/i.test(marker.copy),
        `${episode.id} ${marker.time}: copy is the summary, not a correction`,
      );
    }
  assert.doesNotMatch(
    chapters.listen.subhead,
    /marker opens/,
    'markers seek; the link beside a marker navigates',
  );
});

test('the round-trip map pins a digest, not a tag', () => {
  const map = pageRenderers.guides(parseRoute('#field-guides'));
  const digest = map.slice(map.indexOf('A candidate digest'));
  assert.match(digest.slice(0, 200), /@sha256:/);
  assert.doesNotMatch(digest.slice(0, 200), /:sha-\*/);
});

test('the profiles easy mistake opens its guide beside lesson 02', () => {
  const myth = myths.find((entry) => entry.id === 'profiles-save-money');
  assert.equal(myth.guideHere['bring-up'], 'profiles');
  const chapter = chapters['bring-up'];
  for (const [step, id] of Object.entries(chapter.mistakes)) {
    if (id !== 'profiles-save-money') continue;
    assert.ok(
      chapter.guides[step].includes('profiles'),
      `${step}: guide beside the stage`,
    );
  }
  const callout = mythCallout('profiles-save-money', 'bring-up');
  assert.ok(
    callout.includes(
      '<button type="button" class="myth-guide" data-guide-open="profiles">Three profiles, one estate ↓</button>',
    ),
  );
  assert.ok(
    !callout.includes('href="#field-guides'),
    'no exit to the Field guides page',
  );
  assert.ok(
    mythCallout('profiles-save-money', 'running-stack').includes(
      `href="${myth.route}"`,
    ),
    'other lessons keep the collection route',
  );
  for (const [id, entry] of Object.entries(myths)) {
    for (const [chapterKey, guide] of Object.entries(entry.guideHere || {})) {
      assert.ok(
        nativeGuides.some((item) => item.id === guide),
        `${id}: ${guide}`,
      );
      const guides = Object.values(chapters[chapterKey].guides || {}).flat();
      assert.ok(
        guides.includes(guide),
        `${id}: ${guide} is rendered in ${chapterKey}`,
      );
    }
  }
  assert.match(
    guidePreview('profiles'),
    /<details><summary>Open here<\/summary><figure class="field-guide is-compact" id="guide-profiles"/,
  );
});

test('no decorative kicker or method sentence survives in content or renderers', () => {
  const root = new URL('../src/', import.meta.url);
  const files = [
    'content/chapters.js',
    'content/concepts.js',
    'content/audio.js',
    'content/myths.js',
    'content/posters.js',
    'content/component-details.js',
    'content/creation-moments.js',
    'content/fork-moments.js',
    'components/pages.js',
    'components/diagrams.js',
    'components/infographics.js',
    'components/architecture.js',
    'index.html',
  ];
  const text = files
    .map((file) => readFileSync(fileURLToPath(new URL(file, root)), 'utf8'))
    .join('\n');
  for (const phrase of [
    'The word',
    'Carry forward',
    'Each moment shows',
    'reference this site keeps',
    'assumptions that cost',
    'the borrowed slot',
    'that digest',
    'the fix,',
    'the split',
    'Six views in order',
    'The shape of the site',
    'The mental map',
  ])
    assert.ok(!text.includes(phrase), phrase);
  assert.equal((text.match(/Go deeper in the documentation/g) || []).length, 1);
});

test('field guide groups open in place and keep every sheet', () => {
  const guides = pageRenderers.guides(parseRoute('#field-guides'));
  const groups = guides.split('<details class="guide-set').slice(1);
  assert.equal(groups.length, guideSections.length);
  for (const [i, section] of guideSections.entries()) {
    assert.match(
      groups[i],
      new RegExp(`^ owner-\\w+" id="guide-set-${i}">`),
      `${section.title} starts closed and names its owner`,
    );
    for (const id of section.ids)
      assert.ok(
        groups[i].includes(`id="guide-${id}"`),
        `${section.title}: ${id}`,
      );
  }
  for (const poster of suppliedPosters) {
    const article = guides.slice(guides.indexOf(`id="guide-${poster.id}"`));
    assert.ok(article.includes('<details class="poster-more">'), poster.id);
    for (const item of poster.takeaways)
      assert.ok(article.includes(item), `${poster.id}: ${item.slice(0, 40)}`);
  }
});
