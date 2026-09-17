// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export const singleVariantTryIt = {
  activity: 'trace the partition lookup',
  summary: 'Try it: trace the partition lookup · browser only',
  variants: [
    {
      label: 'Read the provider path',
      result:
        'Locate the cache fallback and identify where opendes configuration is read.',
      access: 'browser only',
      prerequisites: [
        {
          kind: 'browser',
          label: 'A browser',
          text: 'Open the published partition provider source in a browser.',
          sources: ['partitionProvider'],
        },
      ],
      time: {
        active: 'About 5 minutes',
        wait: 'No automated waiting.',
        cleanup: 'Less than 1 minute.',
        minutes: { active: 5, wait: 0, cleanup: 1 },
      },
      footprint: [
        {
          place: 'workstation',
          state: 'untouched',
          note: 'Nothing installed.',
        },
        { place: 'github', state: 'reads', note: 'Published source only.' },
        { place: 'azure', state: 'untouched', note: 'No sign-in.' },
      ],
      effects:
        'This reads published source only; it creates or changes no resources.',
      steps: [
        {
          click: 'Open PartitionServiceImpl from the source link.',
          touch: { kind: 'reads', note: 'reads published source' },
          expect:
            'The provider class shows the cache read before Azure Table Storage.',
          sources: ['partitionProvider'],
        },
      ],
      alternate: {
        observation:
          'The link opens the repository without the provider class.',
        next: 'Follow the documented provider path from the repository root.',
      },
      cleanup: {
        steps: [
          {
            click: 'Close the source tab.',
            touch: { kind: 'reads', note: 'nothing to remove' },
            expect: 'The browser tab closes; there are no resources to remove.',
          },
        ],
        remains: 'No resources or account changes remain.',
      },
      sources: ['partitionProvider'],
      tested: {
        cli: 'Not applicable: this route uses no CLI.',
        stack: 'Not applicable: this route uses no deployed stack.',
        template: 'Not applicable: this route creates no repository.',
        shell: 'Not applicable: this route uses a browser.',
        os: 'Not applicable: this browser route is operating-system independent.',
        date: '2026-09-13',
      },
    },
  ],
};

export const multipleVariantTryIt = {
  activity: 'compare environment routes',
  summary: 'Try it: compare environment routes · Azure charges apply',
  variants: [
    {
      label: 'Without Azure',
      result:
        'Confirm the available CLI entry points without creating an environment.',
      access: 'workstation setup',
      prerequisites: [
        {
          kind: 'tool',
          label: 'The SPI CLI',
          text: 'Install the SPI CLI on the workstation.',
          sources: ['install'],
        },
        {
          kind: 'tool',
          label: 'curl',
          shell: 'posix',
          text: 'Fetches the release.',
          sources: ['install'],
        },
      ],
      time: {
        active: 'About 5 minutes',
        wait: 'No automated waiting.',
        cleanup: 'Less than 1 minute.',
        minutes: { active: 5, wait: 0, cleanup: 1 },
      },
      footprint: [
        { place: 'workstation', state: 'reads', note: 'Local CLI help only.' },
        {
          place: 'github',
          state: 'untouched',
          note: 'Nothing read or written.',
        },
        { place: 'azure', state: 'untouched', note: 'No sign-in.' },
      ],
      effects:
        'This reads local CLI help only; it creates no GitHub or Azure resources.',
      steps: [
        {
          command: 'spi --help',
          touch: { kind: 'reads', note: 'prints help' },
          expect: 'The terminal lists the installed CLI commands.',
          sources: ['install'],
        },
      ],
      alternate: {
        observation: 'The shell reports that spi is not found.',
        next: 'Stop and revisit the linked installation instructions.',
      },
      cleanup: {
        steps: [
          {
            click: 'Close the terminal window.',
            touch: { kind: 'reads', note: 'nothing to remove' },
            expect: 'The local help session ends.',
          },
        ],
        remains: 'The installed CLI remains on the workstation.',
      },
      sources: ['install'],
      tested: {
        cli: 'Not applicable: this synthetic fixture was not walked.',
        stack: 'Not applicable: this route uses no deployed stack.',
        template: 'Not applicable: this route creates no repository.',
        shell: 'zsh',
        os: 'macOS',
        date: '2026-09-13',
      },
    },
    {
      label: 'With Azure',
      result:
        'Observe the command that would create your environment in Azure.',
      access: 'Azure resources billed separately',
      accessNote:
        'An Azure subscription and permissions to create resources are required.',
      prerequisites: [
        {
          kind: 'access',
          label: 'An Azure role that can create resources',
          text: 'Complete the CLI installation and deployment prerequisites.',
          sources: ['install', 'lifecycle'],
        },
      ],
      time: {
        active: 'About 10 minutes',
        wait: 'Automated provisioning continues separately.',
        cleanup: 'Active cleanup takes about 5 minutes.',
        minutes: { active: 10, wait: 45, cleanup: 5 },
      },
      footprint: [
        { place: 'workstation', state: 'changes', note: 'Keeps your sign-in.' },
        {
          place: 'github',
          state: 'reads',
          note: 'Flux reads the stack branch.',
        },
        { place: 'azure', state: 'bills', note: 'Creates the environment.' },
      ],
      effects:
        'This route creates billable Azure resources for your environment before the steps finish.',
      steps: [
        {
          command: 'spi up --env <name>',
          touch: { kind: 'creates', note: 'creates and bills the environment' },
          expect: 'The CLI begins the documented environment lifecycle.',
          sources: ['lifecycle'],
        },
      ],
      alternate: {
        observation: 'Azure rejects the request before provisioning starts.',
        next: 'Stop and check the subscription permissions in the runbook.',
      },
      cleanup: {
        steps: [
          {
            command: 'spi down --env <name>',
            touch: { kind: 'removes', note: 'deletes the environment' },
            expect: 'The CLI begins removal of the environment.',
            sources: ['lifecycle'],
          },
        ],
        ledger: {
          columns: ['spi down'],
          rows: [
            { item: 'Cluster', after: ['removed'] },
            { item: 'Deployment identity', after: ['kept'] },
          ],
        },
        remains:
          'The deployment identity and any resources documented as retained remain afterwards.',
      },
      sources: ['install', 'lifecycle'],
      tested: {
        cli: 'Not applicable: this synthetic fixture was not walked.',
        stack:
          'Not applicable: this synthetic fixture has no tested stack ref.',
        template:
          'Not applicable: this synthetic fixture has no tested template commit.',
        shell: 'zsh',
        os: 'macOS',
        date: '2026-09-13',
      },
    },
  ],
  connection: {
    text: 'Already have an environment? Connect to it with spi connect --resource-group <resource-group> --cluster <cluster-name>.',
    sources: ['lifecycle'],
  },
};
