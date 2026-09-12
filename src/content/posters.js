// Supplied posters are reference artifacts and stay as given; `notes` records
// where their wording differs from the source documentation.
export const suppliedPosters = [
  {
    id: 'blueprint',
    title: 'OSDU SPI Stack: The Blueprint for Azure-Native Energy Data',
    origin: 'Generated poster supplied with the training material',
    image: 'posters/blueprint.jpg',
    width: 2000,
    height: 1116,
    summary:
      'Four phases in one sweep: the automation engine (spi up, Bicep, Flux), the four owners, identity without secrets, and the bootstrap that makes an empty OSDU useful.',
    takeaways: [
      'Three moving parts: a Python CLI, Bicep templates, and a Flux-applied tree of Kubernetes manifests.',
      'Four owners: CLI and Bicep own Azure; Flux owns workloads; controllers own health; you own decisions.',
      'Local key and SAS authentication is disabled by construction on Cosmos DB and Service Bus.',
      'One local Helm chart, osdu-spi-service, bakes Safeguards compliance into every OSDU service.',
    ],
    notes: [
      '“From days to 50 minutes” rounds an observation: prior centralus smoke runs put fresh provisioning at roughly 45–50 minutes, and API readiness can follow the CLI exit.',
      'The poster’s labels contain generated spelling errors (“Portions”, “Configblop”, “Owne KBs”). The correct names are partitions, ConfigMap, and Kubernetes workloads.',
      'The three-profile table is right that profiles change what Flux deploys; every profile still provisions the full Azure estate.',
    ],
    explore: [
      { label: 'The four owners on the map', href: '#running-stack' },
      { label: 'Follow spi up', href: '#bring-up/provision' },
      {
        label: 'Workload identity',
        href: '#running-stack/developer?detail=identity',
      },
    ],
    sources: ['architecture', 'entra', 'helmChart', 'schemaLoad'],
  },
  {
    id: 'contribution-chain',
    title: 'The Contribution Chain',
    origin:
      'Fork tiers for the partition service, supplied with the training material',
    image: 'posters/contribution-chain.jpg',
    width: 2000,
    height: 1467,
    summary:
      'Code flows down from the OSDU community by sync and climbs back up by pull request. Three tiers of one service, and where a given change belongs.',
    takeaways: [
      'Every change has one home tier: make it once there, and syncs carry it everywhere below.',
      'Microsoft works in the filter tier: sync regenerates fork_upstream, cascade merges into fork_integration, a reviewed release PR lands on main.',
      'A customer mirror copies Azure main byte for byte; SYNC_MODE=mirror means the filter never runs.',
      'Change only the fork-owned lanes. Everything else is regenerated every sync, so a local edit becomes a permanent conflict.',
    ],
    notes: [
      'This poster matches the fork-tiers documentation; use it as the map for “where does my change go?”.',
    ],
    explore: [
      { label: 'The SPI boundary', href: '#spi-boundary' },
      {
        label: 'How changes arrive',
        href: '#engineering-system?detail=upstream',
      },
      { label: 'The service fork', href: '#engineering-system?detail=repo' },
    ],
    sources: ['forkTiers', 'branches', 'ownership'],
  },
];

// Infographics rendered by src/components/infographics.js.
export const nativeGuides = [
  {
    id: 'familiar',
    title: 'Where the familiar things live',
    summary:
      'Seven OSDU concepts you already use, and the place in the stack each one turns into. Start here before learning anything new.',
    appearsIn: { label: 'What is a stack?', href: '#running-stack' },
    sources: ['architecture', 'identity'],
  },
  {
    id: 'owners',
    title: 'Four owners, four boundaries',
    summary:
      'Most of the design exists to keep these boundaries clean. Knowing which owner you are looking at tells you which tool can change what you see.',
    appearsIn: { label: 'How it comes to life', href: '#bring-up/provision' },
    sources: ['architecture', 'lifecycle'],
  },
  {
    id: 'timeline',
    title: 'One spi up, on the clock',
    summary:
      'Observed component times overlap, so they do not add up to a total. The CLI exits while Flux is still working.',
    appearsIn: { label: 'How it comes to life', href: '#bring-up/reconcile' },
    sources: ['lifecycle', 'schemaLoad'],
  },
  {
    id: 'milestones',
    title: 'Five milestones, not one',
    summary:
      'An operator who conflates these will misdiagnose. Each has its own signal and its own command.',
    appearsIn: { label: 'Use the stack', href: '#bring-up/inspect' },
    sources: ['lifecycle'],
  },
  {
    id: 'profiles',
    title: 'Three profiles, one Azure estate',
    summary:
      'Profiles select Kubernetes workloads. Every profile provisions the same cluster and PaaS services.',
    appearsIn: { label: 'What is a stack?', href: '#running-stack' },
    sources: ['architecture', 'profiles'],
  },
  {
    id: 'identity',
    title: 'Identity is two different problems',
    summary:
      'A pod obtaining an Azure token and a gateway identifying an OSDU caller are separate paths. One succeeding proves nothing about the other.',
    appearsIn: { label: 'The SPI boundary', href: '#spi-boundary' },
    sources: ['identity', 'entra'],
  },
];
