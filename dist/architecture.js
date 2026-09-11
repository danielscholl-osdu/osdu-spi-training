// A conceptual environment map, shared by the overview and creation walkthrough.
const architectureDetails = {
 environment:['THE STACK BOUNDARY','The stack is this whole deployed environment.','A stack combines Azure infrastructure, the Kubernetes runtime, OSDU workloads, and their dependencies. The outlined dev1 environment includes AKS and the Azure resources beside it. It is a logical boundary, not a single resource-group boundary; AKS also creates managed resources. Your workstation and the source repository sit outside it.'],
 workstation:['ON YOUR MACHINE','The spi CLI is your control point.','You install SPI Stack tooling on your workstation and use your Azure identity to create and inspect an environment. The CLI orchestrates Bicep deployments and Kubernetes bootstrap. It runs outside the deployed stack; a running environment does not need your terminal to stay open.'],
 aks:['INSIDE AZURE','AKS provides the Kubernetes runtime.','Azure Kubernetes Service hosts the OSDU services, their in-cluster middleware, and the controllers that reconcile them. Cosmos DB, Storage, Service Bus, and Key Vault are Azure services outside this Kubernetes boundary. AKS Automatic also supplies managed cluster capabilities such as Istio.'],
 flux:['INSIDE AKS','Flux keeps the declared workloads in place.','Flux controllers run in AKS and reconcile the Kubernetes configuration from osdu-spi-stack. They assemble workloads in dependency order; they do not provision the Azure data services. After spi up verifies the requested Git revision, Git fetching is suspended by default, while reconciliation of that revision continues.'],
 clouddata:['IN AZURE · OUTSIDE AKS','These backends are Azure-managed resources.','Cosmos DB holds service data, Storage supplies blob and table storage, and Service Bus carries events. They are provisioned alongside AKS. The Azure provider inside each service connects to the backends it needs; the grouping here does not mean every service uses every backend.'],
 cloudsupport:['IN AZURE · OUTSIDE AKS','Configuration, identity, and images support the runtime.','Key Vault holds runtime configuration and credentials. Azure managed identities support access to Azure services through Workload Identity. The stack also provisions an Azure Container Registry. These are Azure resources, not pods inside the cluster; an existing Entra tenant and your Azure subscription are prerequisites.'],
 localsetup:['BEFORE AN ENVIRONMENT EXISTS','First, prepare the machine that will create it.','Install the SPI CLI and required deployment tools using the installation guide. Sign in to Azure, check the active subscription, and ensure your identity can deploy the resources and create role assignments. spi check checks local tool prerequisites; it does not prove all deployment permissions.'],
 emptycluster:['AZURE RESOURCES EXIST','A cluster alone is not an OSDU stack ready to use.','The CLI first provisions AKS and then the Azure data and support resources. At this point there is somewhere to run Kubernetes workloads, but application configuration and OSDU initialization still have to happen.'],
 clusterinputs:['CLI BOOTSTRAP','Connect the cloud resources to their future workloads.','The CLI creates namespaces, seed Secrets, service accounts, identity bindings, and configuration. It supplies the environment-specific inputs the workload definitions need. Next it activates the Azure Flux extension.'],
 rollout:['WORKLOAD ROLLOUT','Flux now assembles the applications.','Flux fetches the requested stack configuration and reconciles its dependency graph: operators and middleware support the OSDU services and initialization jobs. This overlaps the final CLI work, including Key Vault values and Git-source verification. A successful CLI exit can precede application readiness.'],
 verify:['FROM DEPLOYED TO USABLE','Observe readiness, then try the API you need.','Use spi status --watch to follow workload health and initialization, and spi info to discover endpoints. Then make an authenticated OSDU API request. CLI success, healthy workloads, and a successful API response are distinct signals. This view shows an illustrative assembled environment, not a live readiness result.']
};
const creationMoments = [
 {name:'Start locally',owner:'YOU · ON YOUR WORKSTATION',title:'A prepared workstation. No stack yet.',copy:'Install the CLI and deployment tools, sign in to Azure, and choose a subscription where you have deployment access.',commands:['spi --version','az login','az account show','spi check'],commandLabel:'After installing the tools',action:'Prepare access',detail:'localsetup',note:'The subscription already exists. The outlined environment is the place we will create the stack.',state:'Planned environment',stepLabel:'Before spi up'},
 {name:'Create Azure',owner:'SPI CLI + BICEP',title:'Give the environment its cloud resources.',copy:'One spi up invocation provisions AKS, then the Azure data services, identities, and supporting resources.',commands:['spi up --env dev1'],commandLabel:'Run once to create the environment',action:'Provision Azure',detail:'emptycluster',note:'Compute and data resources now exist. OSDU workloads have not been assembled yet.',state:'Infrastructure created',stepLabel:'During spi up'},
 {name:'Prepare AKS',owner:'SPI CLI · KUBERNETES BOOTSTRAP',title:'Give the cluster its environment-specific inputs.',copy:'The same invocation prepares namespaces, configuration, credentials, and identity bindings so workloads can use the Azure resources.',commands:['spi up --env dev1'],commandLabel:'Still the same invocation',action:'Bootstrap AKS',detail:'clusterinputs',note:'Configuration connects the environment to its future workloads. This is preparation, not API readiness.',state:'Cluster prepared',stepLabel:'During spi up'},
 {name:'Assemble OSDU',owner:'FLUX · INSIDE AKS',title:'The declared configuration becomes running workloads.',copy:'The CLI activates Flux. Its controllers reconcile operators, middleware, OSDU services, and initialization in dependency order.',commands:['spi up --env dev1'],commandLabel:'Flux starts while the CLI is still working',action:'Activate Flux',detail:'rollout',note:'Flux reconciliation overlaps the final CLI work and can continue after spi up returns.',state:'Workloads rolling out',stepLabel:'During and after spi up'},
 {name:'See it running',owner:'YOU · INSPECT AND USE',title:'Follow readiness. Discover the API endpoint.',copy:'Watch workload health and initialization, discover the endpoints, then make an authenticated request to the OSDU API you need.',commands:['spi status --watch','spi info'],commandLabel:'After spi up returns',action:'Inspect the stack',detail:'verify',note:'An assembled example is shown. A successful authenticated API request is the final check for the path you need.',state:'Assembled example',stepLabel:'After spi up'}
];
let creationMoment = 0;
let architecturePath = 'manage';
function mapScopeButton(id,name,note,extra='') {return `<button type="button" class="map-scope-button ${extra}" data-detail="${id}" aria-pressed="false"><span>${name}</span><small>${note}</small><span class="scope-open" aria-hidden="true">↗</span></button>`;}
function architectureMap(stage=null,path='manage') {
 const building=stage!==null, moment=building?creationMoments[stage]:null;
 const provisioned=!building||stage>=1, prepared=!building||stage>=2, populated=!building||stage>=3;
 const request=!building&&path==='request';
 const command=building?moment.commands:['spi up --env dev1','spi status --watch','spi info'];
 const commands=command.map(c=>`<code>${c}</code>`).join('');
 const status=building?moment.state:'Development & test environment';
 const empty=building&&stage===0;
 const flux=populated?node('flux','Flux','Reconciles the workload configuration','','CONTROLLER'):'';
 const gateway=populated?node('gateway','Istio gateway','OSDU API entry point',request?'path-node':''):'';
 const service=populated?`<div class="map-service ${request?'request-highlight':''}"><div class="map-service-title">OSDU service workload</div>${node('service','Shared OSDU code','Common service behavior','primary')}${node('provider','Azure SPI provider','Cloud-specific implementation','azure')}<span class="map-inside-note">Packaged together in the service</span></div>`:'';
 const middleware=populated?node('middleware','Platform middleware','Elasticsearch · Redis · other dependencies'):'';
 const pending=`<div class="map-pending"><span class="pending-symbol" aria-hidden="true">${provisioned?'▧':'＋'}</span><b>${provisioned?'A runtime, ready to be configured':'No cluster yet'}</b><span>${provisioned?'The application workloads come next.':'AKS will be created here.'}</span></div>`;
 const bootstrap=prepared&&!populated?`<div class="map-bootstrap">${node('clusterinputs','Bootstrap inputs','Namespaces · configuration · identities','','PREPARED BY THE CLI')}<div class="map-pending"><span class="pending-symbol" aria-hidden="true">▧</span><b>Ready for workload configuration</b><span>OSDU services come next.</span></div></div>`:'';
 return `<div class="architecture-map ${building?'build-map':''} ${empty?'uncreated':''} ${request?'request-map':'manage-map'}" data-map-stage="${building?stage:'overview'}">
  <aside class="map-workstation"><div class="map-location"><span class="location-icon" aria-hidden="true">⌘</span><div><b>Your workstation</b><small>Outside the deployed stack</small></div></div>
   <div class="map-terminal ${!request?'route-emphasis':''}">${node('workstation','spi CLI','Create · configure · inspect','','DEVELOPER TOOL')}<div class="map-command-label">${building?moment.commandLabel:'Your environment control point'}</div><div class="map-commands">${commands}</div></div>
   ${building&&stage===0?'<a class="map-install" href="https://github.com/Azure/osdu-spi-stack/blob/main/docs/install.md" target="_blank" rel="noopener noreferrer">Install the CLI and tools ↗</a>':''}
   ${!building||stage===4?`<div class="map-client ${request?'route-emphasis':''}">${node('client','OSDU API client','Your application or API tool',request?'path-node':'')}</div>`:''}
   ${populated?'<div class="map-git"><span aria-hidden="true">⑂</span><div><b>Source repository</b><small>osdu-spi-stack<br>Workload configuration → Flux</small></div></div>':''}
  </aside>
  <div class="map-crossing ${empty?'inactive-crossing':''}"><span>${building?moment.action:request?'Call the API':'Create & inspect'}</span><i aria-hidden="true">→</i></div>
  <div class="map-azure"><div class="map-azure-label"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 16 11 3h5l-5 9 8 8H3l2-4Z" fill="currentColor"/><path d="m14 3 7 17h-6l3-2-6-6Z" fill="currentColor" opacity=".6"/></svg><b>Azure</b><span>Cloud boundary</span></div>
   <section class="map-stack ${empty?'stack-planned':''}" aria-label="Deployed stack boundary">
    <div class="map-stack-heading">${mapScopeButton('environment',empty?'The planned stack':'The deployed stack','dev1 · '+status)}<span class="map-boundary-tag">${empty?'PLANNED BOUNDARY':'STACK BOUNDARY'}</span></div>
    <div class="map-resource-grid">
     <section class="map-aks ${!provisioned?'map-not-created':''}" aria-label="AKS cluster boundary">${mapScopeButton('aks','AKS Automatic','Kubernetes boundary')}
      <div class="map-workloads">${flux}${gateway}${populated?'<div class="map-down-arrow" aria-hidden="true">↓</div>':''}${service}${middleware}${!prepared?pending:bootstrap}</div>
     </section>
     <div class="map-backend-link ${!populated?'waiting-link':''}"><i aria-hidden="true">→</i><span>Azure access</span></div>
     <section class="map-managed ${!provisioned?'map-not-created':''}" aria-label="Azure resources outside AKS"><div class="map-managed-heading"><b>Azure resources</b><span>Outside AKS</span></div>
      ${provisioned?`<div class="map-backends">${node('clouddata','Cosmos DB','Service data')}${node('clouddata','Storage · Service Bus','Storage and events')}${node('cloudsupport','Key Vault · identities','Configuration and Azure access')}${node('cloudsupport','Container Registry','Container images')}</div>`:'<div class="map-pending"><span class="pending-symbol" aria-hidden="true">＋</span><b>No resources yet</b><span>Managed backends will sit alongside AKS.</span></div>'}
     </section>
    </div>
    <div class="map-boundary-caption">${empty?'Planned footprint · no environment has been created':'One environment = the cluster + its workloads + the Azure resources around it'}</div>
   </section>
  </div>
 </div>`;
}
function architectureRoute(path) {
 return path==='request'?`<span class="route-label">REQUEST PATH</span><span>API client</span><i>→</i><span>Istio gateway</span><i>→</i><span>OSDU service + Azure provider</span><i>→</i><span>Required backends</span>`:`<span class="route-label">CONTROL PATH</span><span>Your CLI</span><i>→</i><span>Azure provisioning & cluster bootstrap</span><i>→</i><span>Flux workload reconciliation</span>`;
}
function architectureOverview(){return `<div class="map-toolbar"><span>Follow a path through the same environment</span><div role="group" aria-label="Architecture path"><button type="button" data-path="manage" aria-pressed="${architecturePath==='manage'}">Developer</button><button type="button" data-path="request" aria-pressed="${architecturePath==='request'}">API request</button></div></div><div id="architecture-content">${architectureMap(null,architecturePath)}</div><div id="architecture-route" class="map-route">${architectureRoute(architecturePath)}</div><p class="context-caption">A logical architecture, not a network or resource-group map. Examples shown; dependencies vary by service.</p>`;}
function creationWalkthrough(){return `<div class="creation-header"><span>FOLLOW THE ASSEMBLY</span><small>Illustrated sequence · nothing runs in Azure</small></div><div class="creation-steps" role="group" aria-label="Stack creation moments">${creationMoments.map((s,i)=>`<button type="button" data-stage="${i}" aria-pressed="${i===creationMoment}"><span>${String(i+1).padStart(2,'0')}</span><b>${s.name}</b></button>`).join('')}</div><div id="creation-story"></div><div id="architecture-content"></div><div class="creation-controls"><button type="button" id="creation-previous" data-stage-back>← Previous</button><span id="creation-position"></span><button type="button" id="creation-next" data-stage-next>Continue →</button></div><p class="context-caption">Example: the default core profile and an environment named dev1. Running spi up creates billable Azure resources.</p>`;}
function setCreationMoment(index){
 creationMoment=Math.max(0,Math.min(index,creationMoments.length-1));const s=creationMoments[creationMoment];
 document.querySelectorAll('[data-stage]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.stage)===creationMoment)));
 document.getElementById('creation-story').innerHTML=`<div class="creation-story"><div><span class="creation-owner">${s.owner}</span><h3>${s.title}</h3><p>${s.copy}</p></div><span class="creation-timing">${s.stepLabel}</span></div>`;
 document.getElementById('architecture-content').innerHTML=architectureMap(creationMoment);
 document.getElementById('creation-position').textContent=`${creationMoment+1} / ${creationMoments.length} · ${s.note}`;
 document.getElementById('creation-previous').disabled=creationMoment===0;
 document.getElementById('creation-next').textContent=creationMoment===creationMoments.length-1?'Replay from the start ↺':'Continue →';
 selectDetail(s.detail);
}
function setArchitecturePath(path){architecturePath=path;document.querySelectorAll('[data-path]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.path===path)));document.getElementById('architecture-content').innerHTML=architectureMap(null,path);document.getElementById('architecture-route').innerHTML=architectureRoute(path);selectDetail(path==='request'?'client':'workstation');}
function handleArchitectureClick(target){
 if(target.hasAttribute('data-path'))setArchitecturePath(target.dataset.path);
 else if(target.hasAttribute('data-stage'))setCreationMoment(Number(target.dataset.stage));
 else if(target.hasAttribute('data-stage-back'))setCreationMoment(creationMoment-1);
 else if(target.hasAttribute('data-stage-next'))setCreationMoment(creationMoment===creationMoments.length-1?0:creationMoment+1);
}
