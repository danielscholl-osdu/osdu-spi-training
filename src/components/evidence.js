// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { componentDetails } from '../content/component-details.js';

export function resolveDetail(id, chapterKey, details = componentDetails) {
  if (!Object.hasOwn(details, id)) return null;

  const record = details[id];
  const override =
    chapterKey &&
    record.here &&
    Object.hasOwn(record.here, chapterKey) &&
    record.here[chapterKey];
  const { here: _here, ...base } = record;
  const resolved = override ? { ...base, ...override } : base;

  return {
    ...resolved,
    artifact: resolved.artifact ? { ...resolved.artifact } : null,
    goDeeper: resolved.goDeeper ? [...resolved.goDeeper] : [],
    context: resolved.context || resolved.label || 'Explanation unavailable',
    owner: resolved.owner || null,
    summary:
      resolved.summary ||
      [resolved.title, resolved.body].filter(Boolean).join(' '),
    more: resolved.more || '',
  };
}
