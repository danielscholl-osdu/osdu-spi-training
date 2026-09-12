import { node } from './node.js';
import { architectureOverview, creationWalkthrough } from './architecture.js';

function spiBoundaryDiagram() {
  return `<div class="code-boundary"><div class="group-label">Inside one OSDU service</div><div class="code-columns"><section class="shared-owner"><h3>Shared OSDU code</h3><p>Received through upstream sync</p>${node('client', 'OSDU API', 'The client-facing contract')}${node('core', 'Common service logic', 'Core behavior and provider interfaces', 'shared-code')}</section><div class="code-connector" aria-hidden="true">→</div><section class="fork-owner"><h3>Fork-owned Azure code</h3><p>Maintained in the service repository</p>${node('azureimpl', 'Azure implementation', 'provider/partition-azure', 'fork-code')}${node('azureclients', 'Azure clients', 'Identity-capable backend access')}</section></div>${node('contract', 'The SPI contract', 'Common code calls the interface; the Azure provider implements it.', '', 'The agreement between the two')}</div><div class="ownership-legend"><span><i class="shared-swatch"></i>Shared OSDU source</span><span><i class="fork-swatch"></i>Fork-owned Azure source</span></div><div class="source-boundary-note"><b>Why the ownership matters</b><p>Upstream plans to remove its Azure implementations. The fork keeps provider and Azure test source outside fork_upstream, so a later upstream deletion cannot remove the fork’s implementation.</p></div>`;
}

function engineeringDiagram() {
  return `<div class="engineering-grid"><section class="engineering-source"><div class="group-label">Source ownership</div>${node('upstream', 'OSDU community', 'Shared code and interfaces')}<div class="labelled-arrow">Filtered sync ↓</div>${node('repo', 'Service forks', 'One per service · osdu-spi-partition is the reference', 'fork-code')}<div class="labelled-arrow">Build and publish ↓</div>${node('image', 'GHCR service image', 'Identified by digest')}</section><section class="engineering-system"><div class="group-label">Shared machinery</div>${node('engineering', 'osdu-spi', 'Sync · cascade · build · validate')}<p class="relationship-label">Supplies workflows to each service fork</p>${node('stack-source', 'osdu-spi-stack', 'Azure infrastructure + workload configuration')}<p class="relationship-label">Provisions and operates the environment</p></section><section class="engineering-runtime"><div class="group-label">Running environment</div>${node('running', 'Shared Azure stack', 'Several service forks can use one environment', 'shared-code')}${node('delivery', 'Image-lock handoff', 'Pin → reconcile → verify')}${node('proof', 'Borrow, prove, restore', 'Run declared suites; reset only while this run owns the pin')}</section></div><div class="route-strip"><b>Follow a candidate</b><span>Service fork → GHCR digest → osdu-image-lock → running workload → acceptance result</span></div>`;
}

export const diagramRenderers = {
  overview: architectureOverview,
  creation: creationWalkthrough,
  spi: spiBoundaryDiagram,
  engineering: engineeringDiagram,
};

export function ownershipTable() {
  return `<section class="ownership-reference"><h2>Who changes what?</h2><div class="table-scroll"><table><thead><tr><th scope="col">Owner</th><th scope="col">Changes</th><th scope="col">Boundary to remember</th></tr></thead><tbody><tr><th scope="row">CLI + Bicep</th><td>Azure resources, cluster bootstrap, seed credentials, Flux activation</td><td>Flux does not reconcile Azure infrastructure.</td></tr><tr><th scope="row">Flux</th><td>Workload manifests and Helm releases in dependency order</td><td>Continues from the cached Git revision when fetching is suspended.</td></tr><tr><th scope="row">Kubernetes controllers and operators</th><td>Pods, middleware clusters, certificates, trust bundles</td><td>Continue independently of Git polling.</td></tr><tr><th scope="row">You, the operator</th><td>Fetch revisions, refresh images, inspect failures, remove environments</td><td>A successful CLI exit is not an API-readiness check.</td></tr></tbody></table></div></section>`;
}
