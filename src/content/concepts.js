// The site's mental map: six places. The resource group holds the data services
// and the cluster side by side; the cluster nests namespaces and services. The
// sixth place, the source, feeds the service rather than containing anything.
// Every learn view names the levels it works at.
export const zoomLevels = [
  {
    id: 'subscription',
    owner: 'cli',
    name: 'Subscription and resource group',
    detail: 'One environment is one resource group, named by --env.',
    example: 'spi-stack-<name>',
    chapters: ['running-stack', 'bring-up'],
    href: '#running-stack/developer?detail=environment',
  },
  {
    id: 'resources',
    owner: 'cli',
    name: 'Azure data services beside the cluster',
    detail:
      'Cosmos DB, Storage, and Service Bus per partition; Gremlin, Key Vault, and identities shared. Reached from the cluster with Workload Identity.',
    example: 'opendes · shared',
    chapters: ['running-stack'],
    href: '#running-stack/developer?detail=cosmos',
  },
  {
    id: 'cluster',
    owner: 'cli',
    name: 'AKS Automatic',
    detail:
      'The Kubernetes boundary, beside the data services. Provisioned first; everything inside depends on its OIDC issuer.',
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
      'Not a place inside the stack: the repositories the service is built from. A service fork owns the provider; osdu-spi supplies the workflows; a run in the fork borrows a stack to prove a digest.',
    example: 'three repositories',
    chapters: ['fork-shape', 'fork-day', 'handshake'],
    href: '#fork-shape',
  },
];

// One acronym, three things, in the order the views meet them. The site says
// which one it means.
export const spiMeanings = [
  {
    id: 'stack',
    kicker: 'In your subscription',
    name: 'The Azure stack',
    copy: 'The Azure environment that runs the OSDU services: Bicep for the resources, the spi CLI to drive it, Flux for the workloads.',
    repo: {
      label: 'Azure/osdu-spi-stack',
      href: 'https://github.com/Azure/osdu-spi-stack',
    },
    href: '#running-stack',
    hrefLabel: '01 · What is a stack?',
    owner: 'cli',
  },
  {
    id: 'interface',
    kicker: 'In each service',
    name: 'The service interface',
    copy: 'Inside every OSDU service, partition for example, the seam where common code calls a cloud provider. The Azure implementation lives behind it.',
    repo: {
      label: 'Azure/osdu-spi-partition',
      href: 'https://github.com/Azure/osdu-spi-partition',
    },
    lives: 'provider/partition-azure/',
    href: '#spi-boundary',
    hrefLabel: '03 · The SPI boundary',
    owner: 'fork',
  },
  {
    id: 'engineering',
    kicker: 'In GitHub',
    name: 'The engineering system',
    copy: 'The template that gives every service fork its sync, cascade, build, and validation workflows, so the Azure code stays maintainable.',
    repo: {
      label: 'Azure/osdu-spi',
      href: 'https://github.com/Azure/osdu-spi',
    },
    href: '#fork-shape',
    hrefLabel: '04 · The shape of the fork',
    owner: 'you',
  },
];
