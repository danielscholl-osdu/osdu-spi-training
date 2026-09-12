import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { chapters } from '../src/content/chapters.js';
import { componentDetails } from '../src/content/component-details.js';
import { creationMoments } from '../src/content/creation-moments.js';
import { sources } from '../src/content/sources.js';
import { diagramRenderers } from '../src/components/diagrams.js';
import { architectureMap } from '../src/components/architecture.js';
import { parseRoute, routeHref } from '../src/router.js';

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

test('chapters connect to renderers, explanations, and named sources', () => {
  for (const [id, chapter] of Object.entries(chapters)) {
    for (const field of [
      'title',
      'subtitle',
      'headline',
      'intro',
      'figure',
      'scope',
    ]) {
      assert.ok(chapter[field]?.trim(), `${id} is missing ${field}`);
    }
    assert.equal(typeof diagramRenderers[chapter.diagram], 'function');
    assert.ok(Object.hasOwn(componentDetails, chapter.selected));
    assert.ok(chapter.sources.length);
    for (const key of chapter.sources)
      assert.ok(sources[key], `${id}: missing source ${key}`);
    verifyDetails(diagramRenderers[chapter.diagram](parseRoute(`#${id}`)), id);
  }
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
  for (const moment of creationMoments) {
    assert.deepEqual(
      parseRoute(routeHref('bring-up', moment.id, moment.detail)),
      {
        chapter: 'bring-up',
        step: moment.id,
        detail: moment.detail,
      },
    );
  }
  assert.deepEqual(parseRoute('#running-stack/request?detail=events'), {
    chapter: 'running-stack',
    step: 'request',
    detail: 'events',
  });
  assert.deepEqual(parseRoute('#bring-up'), {
    chapter: 'bring-up',
    step: 'start',
    detail: null,
  });
  for (const hash of [
    '',
    '#unknown',
    '#__proto__/inspect',
    '#running-stack/unknown',
  ]) {
    assert.deepEqual(parseRoute(hash), {
      chapter: 'running-stack',
      step: 'developer',
      detail: null,
    });
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
