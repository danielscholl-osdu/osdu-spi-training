# The Start video: narration

## 1. Three parts

Azure SPI connects three things: the stack that runs OSDU, the Azure provider inside each service, and the workflows that keep that provider current. This site explains how those parts fit together, from creating an environment to building and testing a service change.

## 2. Inside one service

Start inside one service. Shared OSDU code handles the request. Where it needs a database, a queue, or a storage account, it calls a provider through the Service Provider Interface, SPI. The provider implements the cloud-specific behavior behind that interface, and the Azure provider ships in the same image as the shared code, with no network hop between them.

## 3. The fork keeps the provider

That provider is Microsoft's to maintain, and the community plans to remove the Azure code from its repositories. So each OSDU service gets a public service fork, one repository per service, that owns its Azure provider, its Azure tests, and its build configuration. Every day a workflow generates a branch from the upstream tip with the whole provider tree absent, Azure included, and the fork's own provider joins it on the integration branch. Upstream's planned removal deletes nothing on the fork side.

## 4. A candidate is tested in a running stack

A change in the fork becomes a candidate image, addressed by digest. A passing build is not evidence that the provider works on Azure. The template includes a workflow for testing a candidate in a running stack: it writes the digest into the environment's image lock, waits until the pod runs that digest, runs the suites the service declares, and writes the captured canonical image back while it still owns the pin; a lost run can leave that work for a person. The partition fork has not adopted it yet, so the lessons illustrate that part of the process.

## 5. The stack, and what you can then do

The stack itself is a development and test environment in one resource group: AKS beside Cosmos DB, Storage, Service Bus, and Key Vault. spi up creates the Azure resources and starts Flux, which continues assembling workloads after the command returns. It is shared and disposable, and it is not production.

Two repositories carry this: osdu-spi-stack builds the environment, and osdu-spi supplies every fork's workflows. After the lessons you can locate a change in a fork, follow it into an image, and say what a test in the running stack proves. The lessons follow one example: a partition lookup for opendes, through the stack, into the provider, and around the fork.
