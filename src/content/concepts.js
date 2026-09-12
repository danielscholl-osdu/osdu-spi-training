// The site's mental map: six nested places, from the subscription down to the
// source a service is built from. Every learn view names the levels it works at.
export const zoomLevels = [
  {
    id: 'subscription',
    owner: 'cli',
    name: 'Subscription and resource group',
    detail: 'One environment is one resource group. --env dev1 names it.',
    example: 'spi-stack-dev1',
    chapters: ['running-stack', 'bring-up'],
    href: '#running-stack/developer?detail=environment',
  },
  {
    id: 'resources',
    owner: 'cli',
    name: 'Azure resources around the cluster',
    detail:
      'Cosmos DB, Storage, and Service Bus per partition; Gremlin, Key Vault, and identities shared.',
    example: 'opendes · shared',
    chapters: ['running-stack'],
    href: '#running-stack/developer?detail=cosmos',
  },
  {
    id: 'cluster',
    owner: 'cli',
    name: 'AKS Automatic',
    detail:
      'The Kubernetes boundary. Provisioned first; everything inside depends on its OIDC issuer.',
    example: 'one cluster',
    chapters: ['running-stack', 'bring-up'],
    href: '#running-stack/developer?detail=aks',
  },
  {
    id: 'workloads',
    owner: 'flux',
    name: 'Namespaces and workloads',
    detail:
      'foundation, platform, and osdu, assembled by Flux in dependency order.',
    example: 'foundation · platform · osdu',
    chapters: ['running-stack', 'bring-up'],
    href: '#bring-up/reconcile',
  },
  {
    id: 'service',
    owner: 'fork',
    name: 'One OSDU service',
    detail: 'Shared OSDU code and its Azure provider, packaged in one image.',
    example: 'partition',
    chapters: ['spi-boundary'],
    href: '#spi-boundary',
  },
  {
    id: 'source',
    owner: 'fork',
    name: 'Where the code comes from',
    detail:
      'A service fork owns the provider; osdu-spi supplies the workflows; osdu-spi-stack runs the environment.',
    example: 'three repositories',
    chapters: ['engineering-system'],
    href: '#engineering-system',
  },
];

// One acronym, three things. The site says which one it means.
export const spiMeanings = [
  {
    id: 'interface',
    kicker: 'In the code',
    name: 'The Service Provider Interface',
    copy: 'Inside every OSDU service, the seam where common code calls a cloud provider. The Azure implementation lives behind it.',
    lives: 'provider/partition-azure/',
    href: '#spi-boundary',
    hrefLabel: '03 · The SPI boundary',
    owner: 'fork',
  },
  {
    id: 'stack',
    kicker: 'On Azure',
    name: 'The SPI Stack',
    copy: 'The Azure environment that runs those services: Bicep for the resources, the spi CLI to drive it, Flux for the workloads.',
    lives: 'Azure/osdu-spi-stack',
    href: '#running-stack',
    hrefLabel: '01 · What is a stack?',
    owner: 'cli',
  },
  {
    id: 'engineering',
    kicker: 'In GitHub',
    name: 'osdu-spi, the engineering system',
    copy: 'The template that gives every service fork its sync, cascade, build, and validation workflows, so the Azure code stays maintainable.',
    lives: 'Azure/osdu-spi',
    href: '#engineering-system',
    hrefLabel: '04 · How changes arrive',
    owner: 'you',
  },
];
