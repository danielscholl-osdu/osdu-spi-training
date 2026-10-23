// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { node } from './node.js';
import { arrow, forkLegend, zone } from './working-stack.js';

// Fieldnote 104's page: one fork's owners, the six stations, and the lane.
export function theLineDiagram() {
  return `<div class="work-map">
    ${zone(
      'line-fork',
      'The partition fork · Azure/osdu-spi-partition',
      `${node('line-own', 'The fork’s own paths', 'Azure provider · Azure tests · files that describe the fork', 'fork-code')}
      ${node('line-template', 'Workflows', 'From the Azure/osdu-spi template · the same in every fork')}
      ${node('line-community', 'Community code', 'Regenerated from upstream every day')}`,
      'work-outside',
    )}
    ${zone(
      'line-stations',
      'Six stations · the same in every fork',
      `${node('line-upstream', 'Upstream', 'The community’s repository, where shared code changes')}
      ${arrow('↓ every day at 00:00 UTC')}
      ${node('line-sync', 'Sync', 'Proposes upstream’s changes to the fork')}
      ${arrow('↓ once the proposal is merged')}
      ${node('line-cascade', 'Cascade', 'Builds them with the fork’s own code')}
      ${arrow('↓ a pull request into main')}
      ${node('line-main', 'Main', 'The fork’s protected branch · a fork’s own change joins here')}
      ${arrow('↓ when a version is ready')}
      ${node('line-release', 'Release', 'Tags an image that is already there · rebuilds nothing')}`,
      'work-outside',
    )}
    ${zone(
      'line-lane',
      'The lane · beside Cascade and Main',
      `${node('line-image', 'An image per eligible commit', 'Pushed to GHCR under the commit’s sha tag')}
      ${arrow('↓ before any release exists')}
      ${node('line-lane', 'The lane', 'The image takes a turn in a running stack, and the service’s tests check it')}
      ${node('line-stack', 'A running stack', 'Runs main’s image by default')}`,
    )}
  </div>${forkLegend}`;
}

// Fieldnote 105's page: the line, the product it carries, and where a person acts.
export function twoKindsDiagram() {
  return `<div class="work-map">
    ${zone(
      'kinds-line',
      'The line · carries every service',
      `${node('kinds-template', 'Template and workflows', 'Azure/osdu-spi · every fork runs the same workflows')}
      ${node('kinds-stack', 'Shared stack', 'Azure/osdu-spi-stack · where each new image takes its turn')}
      ${node('kinds-automation', 'Automation', 'Opens the sync, cascade, release, dependency, and template pull requests')}
      ${node('kinds-platform-work', 'Platform work', 'Changes what carries every service · the platform path')}`,
    )}
    ${zone(
      'kinds-product',
      'The product · rides the line',
      `${node('kinds-service', 'partition', 'Service code · tests · what it promises its callers')}
      ${node('kinds-provider', 'Azure provider', 'provider/partition-azure/ · the fork’s own', 'fork-code')}
      ${node('kinds-service-work', 'Service work', 'Changes what a service does · the service path')}`,
    )}
    ${zone(
      'kinds-person',
      'Where a person acts',
      `${node('kinds-sync-merge', 'Sync', 'A person merges it')}
      ${node('kinds-main-approval', 'Main', 'A code owner approves after the last push, with the required checks green')}
      ${node('kinds-release-call', 'Release', 'A person decides it’s ready')}
      ${node('kinds-copilot', 'Copilot review', 'Reviews where supported · never the approval', 'artifact')}
      ${node('kinds-issue', 'An issue for a person', 'Opened when the line cannot go on alone')}`,
    )}
  </div>${forkLegend}`;
}
