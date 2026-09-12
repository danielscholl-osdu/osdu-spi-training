import { node } from './node.js';
import { architectureOverview, creationWalkthrough } from './architecture.js';
import { routeHref } from '../router.js';

function spiBoundaryDiagram() {
  return `<div class="zoom-crumb" aria-label="Zoomed in from the map"><a href="#running-stack">The stack</a><span>›</span><a href="#running-stack/developer?detail=aks">AKS</a><span>›</span><a href="#running-stack/developer?detail=service">osdu namespace</a><span>›</span><b>one service · partition</b></div>
  <div class="spi-flow">
    <div class="spi-lane spi-shared">
      <div class="spi-lane-head"><h3>Shared OSDU code</h3><p>Received through upstream sync</p></div>
      ${node('client', 'OSDU API', 'The contract your client already uses')}
      <div class="spi-step" aria-hidden="true">↓ the request reaches the service</div>
      ${node('core', 'Common service logic', 'Validation, entitlements checks, business rules', 'shared-code')}
      <div class="spi-step" aria-hidden="true">↓ calls the interface, never Azure directly</div>
    </div>
    ${node('contract', 'The Service Provider Interface', 'Common code calls it; the Azure provider implements it. This is the seam.', 'spi-seam', 'The contract between the two')}
    <div class="spi-lane spi-fork">
      <div class="spi-lane-head"><h3>Fork-owned Azure code</h3><p>Maintained in the service repository</p></div>
      <div class="spi-step" aria-hidden="true">↓ implements the interface</div>
      ${node('azureimpl', 'Azure implementation', 'provider/partition-azure', 'fork-code')}
      <div class="spi-step" aria-hidden="true">↓ resolves the partition’s backends</div>
      ${node('azureclients', 'Azure clients', 'Identity-based access, no stored keys')}
      <div class="spi-step" aria-hidden="true">↓ Workload Identity token</div>
      <a class="spi-terminal" href="#running-stack/developer?detail=cosmos"><small>Back on the map · per partition · opendes</small><b>Cosmos DB SQL · Storage · Service Bus</b><span>See them in 01 →</span></a>
    </div>
  </div>
  <div class="ownership-legend"><span><i class="shared-swatch"></i>Shared OSDU source</span><span><i class="fork-swatch"></i>Fork-owned Azure source</span><span>Both ship in one image; the seam is a Java interface, not a network hop.</span></div>
  <div class="source-boundary-note"><b>Why the ownership matters</b><p>Upstream plans to remove its Azure implementations. The fork keeps provider and Azure test source outside fork_upstream, so a later upstream deletion cannot remove the fork’s implementation. How that code travels is the next view.</p></div>`;
}

function engineeringDiagram() {
  const journey = [
    ['repo', 'Service fork', 'Azure code changes here'],
    ['image', 'GHCR digest', 'Built and published'],
    ['delivery', 'osdu-image-lock', 'Pinned into a stack'],
    ['running', 'Running pod', 'Flux reconciles the lock'],
    ['proof', 'Acceptance result', 'Prove, then restore'],
  ];
  return `<div class="zoom-crumb" aria-label="Zoomed out from the service"><a href="#spi-boundary">One service</a><span>›</span><b>where its code comes from</b><span>›</span><a href="#running-stack">a stack that runs it</a></div>
  <ol class="journey" aria-label="Follow a candidate change">${journey
    .map(
      ([id, title, copy], i) =>
        `<li><a href="${routeHref('engineering-system', null, id)}"><span>${i + 1}</span><b>${title}</b><small>${copy}</small></a></li>`,
    )
    .join('')}</ol>
  <div class="engineering-grid"><section class="engineering-source"><div class="group-label"><span class="lane-number">A</span>Source lives in forks</div>${node('upstream', 'OSDU community', 'Shared code and interfaces')}<div class="labelled-arrow">Filtered sync ↓</div>${node('repo', 'Service forks', 'One per service · osdu-spi-partition is the reference', 'fork-code')}<div class="labelled-arrow">Build and publish ↓</div>${node('image', 'GHCR service image', 'Identified by digest')}</section><section class="engineering-system"><div class="group-label"><span class="lane-number">B</span>Shared machinery</div>${node('engineering', 'osdu-spi', 'Sync · cascade · build · validate')}<p class="relationship-label">Supplies workflows to each service fork</p>${node('stack-source', 'osdu-spi-stack', 'Azure infrastructure + workload configuration')}<p class="relationship-label">Provisions and operates the environment</p></section><section class="engineering-runtime"><div class="group-label"><span class="lane-number">C</span>A stack runs it</div>${node('running', 'Shared Azure stack', 'Several service forks can use one environment', 'shared-code')}${node('delivery', 'Image-lock handoff', 'Pin → reconcile → verify')}${node('proof', 'Borrow, prove, restore', 'Run declared suites; reset only while this run owns the pin')}</section></div>`;
}

export const diagramRenderers = {
  overview: architectureOverview,
  creation: creationWalkthrough,
  spi: spiBoundaryDiagram,
  engineering: engineeringDiagram,
};
