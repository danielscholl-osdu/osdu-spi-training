# OSDU Fieldnotes: learning prototype

A local, static prototype for senior engineers who know OSDU and are new to the Azure SPI stack and fork engineering system.

## Experience

Four short views follow the learner's existing knowledge:

1. What is a stack: place the workstation outside Azure and explore the nested stack and AKS boundaries. Switch between developer and API request paths.
2. How it comes to life: step through the same map from a prepared workstation to Azure provisioning, cluster bootstrap, Flux reconciliation, and readiness inspection.
3. The SPI boundary: distinguish shared behavior from provider implementation.
4. How changes arrive: connect the stack, service repositories, and engineering system.

The same architecture map anchors the first two views. The stack includes AKS and its Azure dependencies; the Azure SPI provider is nested inside the OSDU service. The creation walkthrough starts with an empty planned footprint and reveals resources as they are assembled. Its five moments are explanatory stages, not measured progress or an exact serial execution trace. Flux rollout overlaps the final CLI work.

The diagrams reveal detail when a component or boundary is selected. There are no quizzes, scored activities, required steps, or completion tracking. The aim is voluntary exploration and useful explanations. Documentation is a secondary reference.

## Preview

Serve `dist` with any static web server. For example, from this folder:

```sh
python3 -m http.server 8875 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:8875. No application build or package installation is required. Google Fonts is optional; local font fallbacks are provided.

## Prototype scope

The diagrams are conceptual, not live environment status. Runtime and engineering claims are drawn from the local `osdu-spi-stack` architecture and identity guides, and `osdu-spi` concepts, ownership, and deploy-lane documentation. Linked source pages provide details. The diagrams do not imply every service uses every shown backend.

Before expanding the content, review whether the sequence feels natural, the first view gives an immediate reason to explore, component details reward curiosity, and the visual density suits an experienced engineer. The next iteration should follow that feedback rather than add more course machinery.

This workspace is separate from the service and engineering-system source repositories. Nothing is published or connected to Azure.
