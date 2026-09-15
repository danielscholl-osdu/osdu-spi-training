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
          text: 'Open the published partition provider source in a browser.',
          sources: ['partitionProvider'],
        },
      ],
      time: {
        active: 'About 5 minutes',
        wait: 'No automated waiting.',
        cleanup: 'Less than 1 minute.',
      },
      effects:
        'This reads published source only; it creates or changes no resources.',
      steps: [
        {
          click: 'Open PartitionServiceImpl from the source link.',
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
          text: 'Install the SPI CLI on the workstation.',
          sources: ['install'],
        },
      ],
      time: {
        active: 'About 5 minutes',
        wait: 'No automated waiting.',
        cleanup: 'Less than 1 minute.',
      },
      effects:
        'This reads local CLI help only; it creates no GitHub or Azure resources.',
      steps: [
        {
          command: 'spi --help',
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
          text: 'Complete the CLI installation and deployment prerequisites.',
          sources: ['install', 'lifecycle'],
        },
      ],
      time: {
        active: 'About 10 minutes',
        wait: 'Automated provisioning continues separately.',
        cleanup: 'Active cleanup takes about 5 minutes.',
      },
      effects:
        'This route creates billable Azure resources for your environment before the steps finish.',
      steps: [
        {
          command: 'spi up --env <name>',
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
            expect: 'The CLI begins removal of the environment.',
            sources: ['lifecycle'],
          },
        ],
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
