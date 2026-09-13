import { node, escapeHtml } from './node.js';
import { creationMoments } from '../content/creation-moments.js';
import { routeHref } from '../router.js';

function scope(id, title, subtitle) {
  return `<button class="scope-button" type="button" data-detail="${id}" aria-pressed="false" aria-controls="inspector"><b>${title}</b><small>${subtitle}</small><span class="node-open" aria-hidden="true">Inspect ↗</span></button>`;
}

function placeholder(title, copy, removed = false) {
  return `<div class="map-placeholder ${removed ? 'removed-placeholder' : ''}"><span aria-hidden="true">${removed ? '−' : '+'}</span><b>${title}</b><p>${copy}</p></div>`;
}

export function architectureMap(stage = null, path = 'developer') {
  const building = stage !== null;
  const moment = building ? creationMoments[stage] : null;
  const removed = stage === 5;
  const created = !building || (stage > 0 && !removed);
  const prepared = !building || (stage >= 2 && !removed);
  const workloads = !building || (stage >= 3 && !removed);
  const commands = moment
    ? moment.commands
    : ['spi up --env <name>', 'spi status --watch'];
  const state = moment ? moment.state : 'One development and test environment';
  const environmentSubtitle = building ? `Your environment · ${state}` : state;
  const request = !building && path === 'request';
  const empty = stage === 0;
  return `<div class="architecture-map ${empty ? 'is-planned' : ''} ${removed ? 'is-removed' : ''} ${request ? 'is-request' : ''}" data-map-stage="${stage ?? 'overview'}">
    <div class="outside-stack">
      <section class="workstation" aria-label="Your workstation, outside the stack">
        <div class="location-heading"><span aria-hidden="true">⌘</span><b>Your workstation</b><small>Outside the stack</small></div>
        <div class="workstation-content">
          ${node('workstation', 'spi CLI', moment ? moment.commandLabel : 'Create, inspect, and operate')}
          <div class="command-lines">${commands.map((command) => `<code>${escapeHtml(command)}</code>`).join('')}</div>
        </div>
        ${stage === 0 ? '<a class="small-link" href="https://github.com/Azure/osdu-spi-stack/blob/main/docs/install.md" target="_blank" rel="noopener noreferrer">Installation guide ↗</a>' : ''}
        ${stage === 4 ? `<div class="join-actions">${node('connect', 'Connect to a shared stack', 'Use the owner’s cluster coordinates')}${node('readiness', 'Observe readiness', 'Health · initialization · API response')}${node('caller', 'Get an API caller', 'spi token · app-only bearer')}</div>` : ''}
        ${!building ? node('client', 'OSDU API client', 'Bearer + data-partition-id', request ? 'path-emphasis' : '') : ''}
      </section>
      ${workloads ? `<section class="external-inputs" aria-label="Sources outside the deployed stack"><span class="group-label">Outside the deployed stack</span>${node('config-source', 'osdu-spi-stack Git', 'Workload configuration → Flux')}${node('image-source', 'GitLab / GHCR', 'Community / fork images')}</section>` : ''}
    </div>
    <div class="boundary-crossing"><span>${moment ? moment.action : request ? 'Authenticated OSDU request' : 'CLI provisions Azure and prepares AKS'}</span><span aria-hidden="true">↓</span></div>
    <section class="azure-boundary" aria-label="Azure cloud boundary">
      <header class="azure-heading"><b>Azure</b><span>Cloud boundary</span></header>
      <section class="stack-boundary ${empty ? 'planned-boundary' : ''}" data-scope="environment" aria-label="Stack environment boundary">
        <header class="stack-heading">${scope('environment', empty ? 'The planned stack' : removed ? 'The remaining footprint' : 'The deployed stack', environmentSubtitle)}<span class="boundary-label">${empty ? 'Planned' : removed ? 'Retained' : 'Stack boundary'}</span></header>
        <div class="map-resource-grid">
          <section class="aks-boundary ${empty ? 'planned-boundary' : ''}" data-scope="aks" aria-label="AKS cluster boundary">
            ${scope('aks', 'AKS Automatic', 'Kubernetes boundary')}
            <div class="cluster-content">
              ${
                workloads
                  ? `<div class="controllers">${node('flux', 'Flux', 'Reconcile workloads', '', 'flux-system')}${node('operators', 'Operators', 'ECK · CNPG · certificates', '', 'foundation')}</div>
                ${node('gateway', 'Istio gateway', 'Routes OSDU API requests', request ? 'path-emphasis' : '', 'aks-istio-ingress')}
                <div class="inside-arrow" aria-hidden="true">↓</div>
                <section data-scope="service-boundary" class="service-boundary ${request ? 'path-emphasis' : ''}"><div class="group-label">osdu · OSDU service workloads</div><div class="service-code">${node('service', 'Shared OSDU code', 'Partition · entitlements · storage', 'shared-code')}${node('provider', 'Azure SPI provider', 'Cloud-specific operations', 'fork-code')}</div><small>Both are packaged inside the service.</small></section>
                ${node('middleware', 'Platform middleware', 'Elasticsearch · Redis · PostgreSQL', '', 'platform')}
                ${node('initialization', 'Initialize OSDU', 'Partitions · entitlements · schema load', '', 'osdu')}`
                  : removed
                    ? placeholder(
                        'Cluster removed',
                        'Workloads, volumes, and seed Secrets are gone.',
                        true,
                      )
                    : prepared
                      ? `${node('bootstrap', 'Bootstrap inputs', 'Namespaces · configuration · identity bindings', '', 'CLI-owned inputs')}${placeholder('Ready for workload configuration', 'Flux will assemble the operators, middleware, and OSDU services.')}`
                      : placeholder(
                          created ? 'Cluster created' : 'No cluster yet',
                          created
                            ? 'Azure compute exists. OSDU workloads come later.'
                            : 'AKS will be created here.',
                        )
              }
            </div>
          </section>
          <section data-scope="resources" class="managed-resources" aria-label="Azure services outside AKS">
            <header><b>Azure resources</b><small>Outside AKS</small></header>
            ${
              created
                ? `<div class="resource-family"><span class="group-label">Per partition · opendes</span><div class="partition-resources">${node('cosmos', 'Cosmos DB SQL', 'Records and metadata')}${node('partition-storage', 'Storage', 'Blobs and tables')}${node('events', 'Service Bus', 'Records-changed events')}</div></div>
              <div class="resource-family"><span class="group-label">Shared by the environment</span><div class="shared-resources">${node('shared-data', 'Gremlin + common Storage', 'Entitlements graph and shared data')}${node('identity', 'Managed identities', 'Workload and test callers')}${node('vault', 'Key Vault', 'Configuration and credentials')}${node('registry', 'Container Registry', 'Provisioned; not this flow’s image source')}</div></div>`
                : removed
                  ? `${node('retained', 'Managed identities + resource group', 'Client IDs · spi-name-suffix · retained tags', 'retained', 'Still exists')}${placeholder('Data resources removed', 'OSDU data must be rebuilt or restored separately.', true)}`
                  : placeholder(
                      'No data resources yet',
                      'These are provisioned after AKS supplies its OIDC issuer.',
                    )
            }
          </section>
        </div>
        <p class="map-caption">${removed ? 'Identity and naming persist. Compute and application data are deleted.' : empty ? 'Dashed outlines mark resources that do not exist yet.' : 'Stack = AKS + its workloads + the Azure resources around it'}</p>
      </section>
    </section>
  </div>`;
}

export function architectureOverview(route) {
  const path = route?.step === 'request' ? 'request' : 'developer';
  return `<div class="diagram-toolbar"><span>Trace a path</span><nav class="segmented" aria-label="Architecture path"><a href="${routeHref('running-stack', 'developer')}" data-route-key="developer" ${path === 'developer' ? 'aria-current="true"' : ''}>Developer</a><a href="${routeHref('running-stack', 'request')}" data-route-key="request" ${path === 'request' ? 'aria-current="true"' : ''}>API request</a></nav></div>
    ${architectureMap(null, path)}
    <div class="route-strip"><b>${path === 'request' ? 'Request path' : 'Control path'}</b><span>${path === 'request' ? 'Client → gateway → OSDU service + provider → required backends' : 'CLI + Bicep → Azure resources and cluster inputs → Flux workloads'}</span></div>
    <p class="diagram-note">Profiles change Kubernetes workloads; bare and minimal still provision the Azure infrastructure. This is a logical map, not a network or resource-group diagram.</p>`;
}

export function creationWalkthrough(route) {
  const index = Math.max(
    0,
    creationMoments.findIndex((moment) => moment.id === route?.step),
  );
  const moment = creationMoments[index];
  const inspectionSelection = ['provision', 'bootstrap'].includes(moment.id)
    ? { claim: 0 }
    : {};
  return `<div class="creation-intro"><span>Illustrated lifecycle</span><a href="${routeHref('bring-up', 'inspect', 'connect')}" class="small-link">Already have a stack? Connect to it →</a></div>
    <nav class="creation-steps" aria-label="Lifecycle moments">${creationMoments.map((item, i) => `<a href="${routeHref('bring-up', item.id)}" data-route-key="${item.id}" ${i === index ? 'aria-current="step"' : ''}><span>${String(i + 1).padStart(2, '0')}</span><b>${item.name}</b></a>`).join('')}</nav>
    <div class="creation-story"><div><span class="group-label">${moment.owner}</span><h3>${moment.title}</h3><p>${moment.copy}</p><a class="small-link look-closer" href="${routeHref('bring-up', moment.id, moment.detail, inspectionSelection)}" data-look-closer>Look closer ↗</a></div><div class="timing"><b>${moment.time}</b><small>${moment.timeKind}</small></div></div>
    ${architectureMap(index)}
    <div class="creation-controls">${index ? `<a href="${routeHref('bring-up', creationMoments[index - 1].id)}" data-route-key="previous">← Previous</a>` : '<span></span>'}<span>${index + 1} / ${creationMoments.length}</span><a href="${routeHref('bring-up', creationMoments[(index + 1) % creationMoments.length].id)}" data-route-key="next">${index === creationMoments.length - 1 ? 'Return to the empty footprint ↺' : 'Continue →'}</a></div>`;
}
