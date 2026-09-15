// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// Generated from microsofts-architectural-divorce-from-osdu.vtt (mlx-whisper large-v3-turbo; misheard names such as osdu-spi, osdu-spi-stack, CIMPL, and partition-aws corrected). Timestamps are seconds into the recording.
export const transcript = [
  {
    start: 0.0,
    text: "You know, if you've ever tried to manage like a massive open source project, you probably have this utopian image in your head. Oh, absolutely. It's like this sprawling, idyllic community garden, right? Everyone brings their own seeds. Everyone shares the watering can. And at the end of the season, you all just enjoy this beautiful shared harvest together. Yeah, we definitely operate on that assumption early on. There's this inherent belief that, you know, a rising tide lifts all boats. Right. And that having hundreds of developers working in the exact same plot of dirt is just always a net positive for the ecosystem.",
  },
  {
    start: 34.6,
    text: "But then you step into the world of enterprise scale, multi-cloud architecture, and suddenly that peaceful community garden looks a lot more like a brutally overcrowded skyscraper. Yeah, that's a good way to put it. It's a building where every single tenant shares the exact same plumbing. And one person deciding to remodel their bathroom on the 40th floor ends up flooding 50 other apartments. Right. The sheer weight of collaboration can absolutely become a liability. Exactly. Because when you are dealing with petabytes of data across totally different cloud platforms, the pangled dependencies turn from, you know, a mild annoyance into a massive systemic risk.",
  },
  {
    start: 71.9,
    text: "Okay, let's unpack this. Welcome to today's deep dive. If you build software, manage teams, or honestly just love dissecting really complex systems, you are in for a fascinating ride today. We've got a really interesting one. We do. Our mission today is decoding a massive architectural shift in the world of subsurface and energy data software. We are looking at a document called Azure SPI, an introduction. Right. From the OSDU field notes from September 2026.",
  },
  {
    start: 100.3,
    text: "Exactly. So we're specifically focusing on Microsoft's Azure implementation. To set the stage a bit here, OSDU, which is the open subsurface data universe, is this colossal open source platform. It's massive. It really is. I mean, the energy sector deals with an unfathomable amount of data. You've got seismic readings, logs, geological models, all of it. Right. And OSDU is built with this grand sweeping ambition to be completely cloud agnostic. So the idea was that an energy company could run this massive data platform on literally any cloud provider.",
  },
  {
    start: 132.7,
    text: "Exactly. But recently, a tectonic shift forced Microsoft into taking total independent ownership of the Azure half of this ecosystem. They essentially got evicted from the shared community-ness. They did. Yeah. They really did. And even if you don't know the first thing about subsurface energy data, this transition is just an absolute masterclass in how massive tech ecosystems handle breakups. It's like a blueprint for code custody. Yeah. And it exposes the brutal reality of how you test colossal cloud infrastructure when you can no longer rely on a centralized community to carry the load for you.",
  },
  {
    start: 166.7,
    text: "So to really appreciate what Microsoft had to build in the aftermath, I think we have to look at the old model first. We do. We have to understand why they were handed their walking papers in the first place. Right. Historically, OSDU operated on this, what they called a provider model. Every microservice, whether it was storage, search, or entitlements, had its shared business logic. And sitting right next to that shared logic was the cloud-specific plumbing. Exactly. It was this giant monolith of interfaces. So in the community as GitLab repositories, you'd have a directory for the core logic, let's say partition-core.",
  },
  {
    start: 200.5,
    text: "And sitting right beside it in the exact same tree were the provider directories. So you had partition-azure, partition-aws, partition-gc for Google Cloud. One set of shared rules, but several totally different sets of plumbing. And the boundary between them was a service provider interface, an SPI. Okay. But, I mean, implementing a provider wasn't just tweaking a configuration file, right? No, not at all. You were writing real, highly complex code that had to compile against shared logic that other engineers were modifying every single day.",
  },
  {
    start: 232.8,
    text: "Which sounds incredibly messy. It was. That extreme coupling became totally unsustainable. There were three very specific, highly damaging costs to the community under that old model. Okay, let's go through those. First, there was the security bottleneck. A shared dependency in the core code simply could not be upgraded until every single cloud provider in software development kit, their SDK, was ready to move with it. So wait, if one provider was just dragging their feet on an update, they were essentially holding zero-day vulnerabilities open for everyone else.",
  },
  {
    start: 263.4,
    text: "Exactly. The community was basically held hostage by the slowest mover. Wow. And the financial drain was just as bad. Every time the core community made a minor change, they had to pay for provider-specific build and deploy lanes that they didn't even use. Oh, man. So the open source community was essentially subsidizing the automated testing of proprietary cloud code. Yeah, they were. I can see how that would cause a lot of friction. It caused a massive governance clash. I mean, you had community-governed work and provider-maintained work trying to share a single permission model in one repository.",
  },
  {
    start: 298.2,
    text: "Which just doesn't work at that scale. Right. They had completely different owners, vastly different security standards, totally conflicting release schedules. It was just a logistical nightmare. Which, of course, triggers the breakup. The community finally passes a formal resolution. Architecture, decision record 61. Right. ADR 61. It details the Venus release structure and repository strategy. And the community basically decides to wash their hands of the clouds entirely. They split the code base into two lines. You've got the Venus line, which is the community branch. This is purely the shared core code.",
  },
  {
    start: 332.3,
    text: 'And they test that on something called CIMPL. Yes. CIMPL is a generic cluster that runs on open source middleware like PostgreSQL and Keycloak. Got it. And then you have Mercury, the legacy line that gets pushed into maintenance mode. But the architectural divorce is absolute here. Oh, completely. All cloud provider code is completely evicted from the community repository moving forward. Wow. The community essentially says, look, we are keeping the core code. We will prove it on our generic environment.',
  },
  {
    start: 360.6,
    text: "And your proprietary cloud implementation is your problem now. So it's like a massive group project, right? Where one person's delay in formatting the bibliography tanks the whole team's grade. That is exactly what it's like. And they finally just said, you know what? Everyone write your own paper. Yes. Write your own paper. Build your own environment. But that leaves a massive question hanging in the air. If the community kicked out the cloud code, what exactly is Microsoft left holding?",
  },
  {
    start: 389.5,
    text: "Well, Microsoft is left holding an orphaned Azure implementation. The Azure directories literally no longer exist upstream. They're just gone. Gone. What Microsoft holds is what they alone maintain on their own schedule to their own security standards. And the stakes are incredibly high because Azure Data Manager for Energy ADME, which is Microsoft's fully managed commercial product, depends entirely on that code surviving this transition. Right. And they can't just take their code and go home because the community is still moving forward.",
  },
  {
    start: 421.2,
    text: "Yeah. The core logic of OSDU is constantly evolving. So if Microsoft stops tracking those upstream community changes. Then they don't have a working OSDU platform anymore. They just have a dead archive of proprietary code. Man, what a position to be in. They have to maintain a highly synchronized relationship with a code base that abandoned them. They have to continuously receive upstream changes while protecting a subtree of code that the upstream community will literally never acknowledge again. Which requires redefining how their entire engineering pipeline works.",
  },
  {
    start: 453.1,
    text: "And actually, to avoid getting lost in the jargon here, we need to clarify that there are three different things getting called SPI in this architecture. I get confusing fast. First, there's the interface itself. That's the actual code boundary inside the repository between the shared logic and the Azure implementation. The literal seam in the code. Right. Second, there's the engineering system, which is called osdu-spi. And this is the GitHub machinery Microsoft built to sync the code. Yes. And third, there's the stack, osdu-spi stack, which is the physical Azure environment where the code actually gets proven.",
  },
  {
    start: 487.1,
    text: "And that second piece, the engineering system, uses an incredibly sophisticated GitHub setup to handle this bizarre custody arrangement. Well, Microsoft created eight service forks. These are repositories for different functions, like osdu-spi partition or osdu-spi storage. But ownership isn't separated at the repository level. Okay. Okay. Ownership runs directly through the tree. Wait, let's slow down here. How does ownership run through a tree? Like, what does a developer actually see when they look at this repository?",
  },
  {
    start: 518.4,
    text: "So when a developer opens one of these service forks, they see a single directory structure. Some of those folders, like the core module or the shared build configuration, are upstream owned. Meaning they come from the community. Exactly. They're regenerated continuously from the community. But sitting right next to them, in the exact same view, at the exact same commit, are the fork owned directories. So the Azure provider code? Right. The Azure provider, the Azure specific tests. Synchronization from the community never touches those Azure files.",
  },
  {
    start: 548.8,
    text: "You have a single git commit containing code with two totally different providences. Here's where it gets really interesting. I was looking at the rules they set up for this. And there is one directive from the text that caught my eye. It says, a fork that is a snapshot fails here. What is needed is a fork that is a relationship. That's a huge point. But honestly, I have to push back a little. If they just need to keep their Azure code updated with the community core code, why not just do a standard code merge when there's time?",
  },
  {
    start: 577.3,
    text: 'Why not just have an engineer pull the community branch once a month, resolve the conflicts, and be done with it? Why do this daily sync? Because in an ecosystem of this size, convenience is a massive trap. Okay. How so? If you only synchronize monthly, that sync becomes colossal. If there is one tiny interface change in that monthly batch that subtly breaks the Azure provider, it is going to be buried underneath hundreds of other unrelated changes.',
  },
  {
    start: 605.8,
    text: 'Ah, I see. Finding the exact commit that broke your implementation becomes a needle in a haystack. So daily arrival forces the breakage to be small, isolated, and immediately identifiable. Okay. Daily syncs makes sense. But why not just use a standard git merge command every day? The architecture demands this strict rule. Generate. Do not merge. Right. Why go through the headache of generating these complex computing routines instead of just merging branches like everyone else does?',
  },
  {
    start: 634.2,
    text: "A standard git merge would actually destroy Microsoft's code base. Wait, really? Destroy it? Yes. Think about what a merge does. It reconciles the history of two branches, right? Right. Well, when the upstream community finalized ADR 61, they went into their repository and permanently deleted the legacy Azure directory to clean things up. Oh, wow. So if Microsoft did a normal git merge, git would see that the upstream branch deleted the Azure folder.",
  },
  {
    start: 662.7,
    text: "Exactly. And it would say, okay, the master branch deleted this. I need to mirror that and delete it here too. Precisely. A standard merge would faithfully carry that upstream deletion right into Microsoft's fork, wiping out their proprietary implementation completely. That's wow. By using a generated branch instead, Microsoft creates a history that has never contained the community's legacy Azure implementation. So how does that work in practice? They take the incoming community code, inject their own Azure code alongside it, and compute a brand new branch from scratch.",
  },
  {
    start: 694.0,
    text: "Correct. When the upstream community deletes their Azure files, the Microsoft fork looks at it and deletes absolutely nothing because mathematically those files were never linked in the git history. The protection isn't just a policy. It's structural. That is defensive architecture at its absolute finest. It's brilliant. So, okay, you've magically generated this hybrid code branch. It compiles. Yes. But compiling just means the syntax is right. In a system this huge, how on earth does Microsoft actually know this Frankencode isn't going to immediately crash when it hits real customer data?",
  },
  {
    start: 727.9,
    text: "Well, they had to test it. But the community pipelines used to know how to run Azure tests. And that testing knowledge left when the cloud code got kicked out. And remember, the community is now testing their Venus line on that CIMPL environment we mentioned earlier, which relies on open source generic tools. Right. They use RabbitMQ for messaging and MinIO for storage. Yeah. And Microsoft can't use any of that. Because proving an Azure provider works isn't just a simple unit test question. It requires a real Cosmos DB, a real Azure service bus, real Azure storage, real Key Vault, and real Entra ID for permissions.",
  },
  {
    start: 763.4,
    text: 'Exactly. Someone has to be able to spin up that massive, deeply integrated environment on demand, run the tests, and tear it all down. Which brings us to the stack, the osdu-spi-stack. It is a command line tool that basically takes a totally empty Azure subscription and turns it into a fully running OSDU platform. Yes. But it takes about 50 minutes to run, mostly because Azure is physically provisioning the hardware, setting up the networks, building the Kubernetes cluster from scratch. It takes time to spin up actual metal.',
  },
  {
    start: 791.4,
    text: "And reading that, my immediate reaction was, 50 minutes is an eternity in modern software deployment. It really is a long time. Why can't they just use local emulators? Yeah. Like, use fake, lightweight versions of Cosmos DB or service bus just to see if the code executes and save a ton of time. It is an incredibly tempting thought, especially for developers who, you know, they want instant feedback. But the strategy here offers a hard rebuttal to that exact instinct. Really? Wow. Because testing the Azure provider against local substitutes bypasses the very code the environment exists to prove.",
  },
  {
    start: 824.8,
    text: "Ah, because emulators aren't the real cloud. They aren't. An emulator like Azurite might mimic basic storage commands, but it doesn't replicate the complex identity layers, the network routing, or the proprietary behaviors of managed Azure services when they're actually under load. That makes a lot of sense. The whole purpose of the Azure provider is to seamlessly navigate those specific managed layers. If you fake the services, your test is answering the wrong question.",
  },
  {
    start: 852.9,
    text: "Right. The stack is Azure only by strict design, not by preference. It has to be raw, spinning metal. It's also vital to point out what the stack is not, too. It is completely disposable. It has no backup, no disaster recovery. All the OSDU services inside the stack share a single Azure identity, which means their permissions aren't isolated at all. It is emphatically not a production configuration. No, not at all. And it is definitely not ADME, Microsoft's commercial product.",
  },
  {
    start: 882.1,
    text: 'The stack is purely a crucible for testing. Exactly. ADME is the downstream commercial product that eventually consumes the stable releases that the stack manages to prove. The stack itself is just an incredibly hostile proving ground. So what does this all mean? We have these two completely separate worlds. We have the engineering system, which is churning out code and building container images in GitHub. Right. And we have the stack, which is this beast of a physical environment spinning up real databases in Azure.',
  },
  {
    start: 912.8,
    text: "How do these two totally independent automated systems safely interact with each other? They interact through a single highly controlled seam called the handshake. And the methodology behind it is fascinating. It's borrow, prove, restore. Borrow, prove, restore. Walk us through the mechanics of that. So when a GitHub fork has a candidate image ready, it doesn't just blindly push it to a server. It borrows a specific services slot in a standing shared stack environment. It carefully injects its candidate image into that slot, executes its API level acceptance tests against the live Azure infrastructure.",
  },
  {
    start: 949.2,
    text: 'And this is the crucial part. Right. It restores the environment back to exactly how it found it, regardless of whether the test passed, failed, or timed out. Wow. But how does the code actually know where to go? Because there is an absolute rule for this handshake in the text. No environment values live in the repository. Yes. They seem obsessed with keeping facts about the environment completely out of the code itself. Why the strict separation? Because of the dynamic nature of this stack.',
  },
  {
    start: 977.5,
    text: "It is rebuilt regularly. If you copy a value from the physical environment into the repository. Like an IP address or something. Right. An IP address, a connection string, or a tenant ID, it is, by definition, stale by construction. Oh, I like that phrase. It is like refusing to write down someone's temporary phone number in pen because you know they're getting a new phone tomorrow. That is a perfect analogy. You only ask for the number at the exact moment you need to make the call. Exactly. The environment dynamically publishes facts about itself.",
  },
  {
    start: 1006.9,
    text: "The fork declares what its tests need. And the engineering system only joins those two things together at the exact millisecond the run executes. This architecture relies on six overarching ideas. Six golden rules that make this massive machine function. And a few of them really challenge how we normally think about software. They do. The first one is about state. They make a huge deal about declared state versus observed state. But isn't a successful deployment command enough?",
  },
  {
    start: 1036.1,
    text: 'In cloud infrastructure. Yeah. Absolutely not. A command finishing and an environment actually being ready are two completely different events. Really? Oh, yeah. Just because your deployment tool returns an exit success does not mean your database is ready to accept traffic. Because the clocks are different. Exactly. Provisioning resources might take five minutes, while bringing up the actual workloads to route that data might take another ten. The Kubernetes pod might be running, but the database behind it is still initializing. The stack refuses to pretend those clocks are the same.',
  },
  {
    start: 1065.9,
    text: "A successful command exit is never treated as a readiness check. You can't just trust the green check mark on the deployment tool, which leads right into the next rule. Evidence has a scope. Right. This is about avoiding false confidence. Just because a continuous integration lane is marked green does not necessarily mean your code works. Why not? If it passed, it passed, right? Well, it might just mean the specific test lane was skipped because of a configuration flag. And a skipped lane still reports as green.",
  },
  {
    start: 1094.8,
    text: "Oh, wow. Or it might mean the test passed, but it was answering a much narrower question than the one you thought you were asking. You always have to interrogate which specific question a check actually answered before deciding what it proves. Green doesn't mean done. It just means the alarm didn't go off. That is incredibly sobering. And the final rule, which is honestly my favorite. Halt on the unknown. Make failure visible. Why is this one so critical? Because it is a master stroke in resilience engineering. Both the engineering system and the stack refuse to proceed on an assumption.",
  },
  {
    start: 1127.0,
    text: "Okay. The tempting alternative in software development is to code in a sensible default. For example, if the automated system can't classify a source path, a developer might write a rule that says just assume it's shared code. Right. Or if you can't find the fork specific image, just fall back to the default community image so the environment doesn't crash. But relying on defaults in an automated pipeline is a terrible idea, right? It is toxic to the system. Because a default fallback that is wrong looks exactly like a default fallback that is right.",
  },
  {
    start: 1158.7,
    text: "Wow. A fallback which cannot be distinguished from actual success is not resilience. It is a blindfold. A blindfold. Yeah. If the system encounters an unknown, it must halt immediately and make that failure highly visible to a human. A blindfold, not resilience. I feel like that concept applies to so much more than just software. So stepping back and looking at a day in the lab of an OSDU engineer, now it has completely transformed. It really has. You aren't just merging code into a happy community GitLab repository whenever you feel like it.",
  },
  {
    start: 1189.7,
    text: "You are managing integration conflicts daily in complex workspace branches. You're proving your code on your own personal 50-minute stack environment. Right. And you are operating under the constant heavy reality that Microsoft, not the open source community, is fully and completely on the hook for whether the Azure implementation survives. The shift in responsibility is absolute. The upstream community used to own the Azure implementation's fate. Now Microsoft owns it outright.",
  },
  {
    start: 1219.6,
    text: 'And honestly, whether you are managing databases, leading a development team, or just navigating complex collaborations in your own industry, the lessons here are universally applicable. Definitely. Understanding the critical difference between a successful command and actual readiness, or realizing that hidden fallbacks are just blindfolds, these are the fundamentals of operating in reality rather than operating on assumption. It really is a masterclass in seeing complex systems as they actually are. Which brings me back to our opening thought.',
  },
  {
    start: 1248.3,
    text: "We talked about that overcrowded skyscraper where everyone shared the plumbing, and the community finally forced Microsoft to rip their pipes out and build an identical skyscraper next door. Next door. Yeah. But it still somehow has to seamlessly mirror the water supply of the first one. Exactly. It's an incredible feat of engineering just to maintain the status quo. It really is. And it makes you wonder about the future. If a fork that is a relationship is the only viable way for a massive corporate giant to maintain proprietary integrations with a fast-moving open source core, are we looking at the end of traditional code branching as we know it?",
  },
  {
    start: 1283.0,
    text: "It's entirely possible. I mean, we used to think of APIs as interfaces just for software to talk to software. Right. But now we're seeing APIs defining the boundaries between entire repositories, between organizational jurisdictions. The branching isn't about human collaboration anymore. It's about structural defense. That is profound. Will the future of software engineering be less about humans writing logic and more about conducting delicate automated diplomacy between massive independent systems?",
  },
  {
    start: 1312.6,
    text: 'It certainly looks that way. Are developers going to become more like ambassadors than mechanics? This is something for you to think about as you look at your own projects. Until next time, keep digging deeper.',
  },
];
