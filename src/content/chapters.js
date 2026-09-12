export const chapters = {
  'running-stack': {
    title: 'What is a stack?',
    subtitle: 'Place familiar OSDU concepts',
    headline: 'AKS is one part<span>of the stack.</span>',
    intro:
      'Your OSDU APIs run inside Kubernetes. Their data partitions reach Azure resources outside the cluster. The stack brings both sides together.',
    premise: 'You know OSDU. Start with the environment around it.',
    figure: 'Follow the boundaries',
    selected: 'environment',
    diagram: 'overview',
    scope:
      'Development and test only. OSDU services share a managed identity and middleware credentials. This stack provides no backup, disaster recovery, or per-service Azure access isolation.',
    sources: ['architecture', 'identity', 'images'],
  },
  'bring-up': {
    title: 'How it comes to life',
    subtitle: 'Create, use, and remove',
    headline: 'One creation command.<span>Several kinds of work.</span>',
    intro:
      'Follow the same environment from an empty footprint to OSDU, then remove it. Each moment shows who acts and what changes.',
    figure: 'Follow the environment',
    selected: 'workstation',
    diagram: 'creation',
    scope:
      'Illustrated core profile · dev1 / opendes. Running spi up creates billable resources; spi down deletes compute and data. The ≈45–50 min provisioning observations were from centralus; the CLI defaults to westus3. Times vary, and overlapping phases must not be added.',
    sources: ['install', 'lifecycle', 'flux', 'identity'],
  },
  'spi-boundary': {
    title: 'The SPI boundary',
    subtitle: 'Find the code Azure owns',
    headline: 'Shared OSDU behavior.<span>Fork-owned Azure code.</span>',
    intro:
      'The partition and storage APIs stay familiar. Inside each service, a Service Provider Interface connects common behavior to its Azure implementation. The important change is who maintains that implementation.',
    figure: 'One service, two source owners',
    selected: 'azureimpl',
    diagram: 'spi',
    scope:
      'ADR-038 anticipates upstream removing its Azure implementations. The fork seeds Azure source once and keeps it outside the generated shared-code branch.',
    sources: ['ownership', 'concepts', 'engineering'],
  },
  'engineering-system': {
    title: 'How changes arrive',
    subtitle: 'Follow a change to its owner',
    headline: 'Provider code belongs<span>in its service fork.</span>',
    intro:
      'Shared automation comes from osdu-spi. Runtime infrastructure and configuration come from osdu-spi-stack. A service fork builds an image that a running stack can test.',
    figure: 'Source → image → environment',
    selected: 'repo',
    diagram: 'engineering',
    scope:
      'One service fork per service; customer mirror forks form a further tier. Eligible onboarded runs can deploy-test. A skipped deploy gate is not live acceptance evidence.',
    sources: ['forkDeploy', 'proof', 'branches', 'forkTiers'],
  },
};
