// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// Generated from rebuilding-osdu-for-real-azure-infrastructure.vtt (mlx-whisper large-v3-turbo; Cosmos DB corrected). Timestamps are seconds into the recording.
export const transcript = [
  {
    start: 0.0,
    text: "This is the brief on onboarding to the Azure SPI system. So this field note breaks down a massive shift in OSDU, the open subsurface data universe for energy data, and reveals exactly how Microsoft rebuilt its SPI, or software provider interfaces, so engineers can seamlessly integrate community code with real-world Azure infrastructure. First, we've got the great code base split. You know, the community stopped keeping everyone's cloud-specific code",
  },
  {
    start: 29.9,
    text: "in one giant repository. Now they just maintain the shared core, and Microsoft completely owns the Azure-specific code. It's kind of like a car, right? The community builds the universal chassis, but Microsoft is solely on the hook for building the custom Azure engine that drops into it. Now, that split necessitates a daily sync system. Second, because that community chassis is constantly updating, the Azure code lives in service forks that pull in new shared code every single day. So how do you keep the community",
  },
  {
    start: 58.9,
    text: "from accidentally deleting the Azure code during these syncs? Well, the system generates branches daily that deliberately exclude the Azure provider, creating structural protection so nobody has to constantly rescue deleted files. And naturally, that sync system requires the actual testing stack. Finally, the proving ground. Look, a successful build doesn't mean the code actually works on Azure. Engineers use the stack to spin up a disposable, real Azure environment, using real services like Cosmos DB and Key Vault",
  },
  {
    start: 87.1,
    text: 'to run a borrow, prove, and restore testing cycle. You might ask, why not just use fake simulated services to save an hour of spin-up time? Well, because testing Azure code on non-Azure substitutes completely bypasses the very code the environment exists to prove. You absolutely have to use the real deal. Ultimately, Azure SPI is the critical bridge connecting fast-moving open-source innovation with hard, dependable cloud reality.',
  },
];
