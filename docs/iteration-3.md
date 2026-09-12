# Iteration 3: the concept flow

Iterations 1 and 2 put the material on screen. This iteration is about whether the concepts build on each other. A senior engineer arriving from OSDU should be able to say at every view what they are looking at, what it rests on, and what they can now claim. The learn views keep their maps and routes; what changed is the connective tissue around them.

## The diagnosis

- The word SPI was never disambiguated. The site used it for the interface inside a service, for the osdu-spi-stack environment, and for the osdu-spi engineering system, without saying so.
- The views did not share a spatial model. View 01 already showed Flux, operators, and initialization (view 02 ideas); view 03 zoomed into a service with no link back to the service node on the map; view 04 was a grid rather than a journey.
- The start page promised that every view ends with what you can now say, and none did.
- Placement: the ownership table and the owners guide said the same thing on view 01; both bring-up guides showed regardless of the moment on screen; the field checks were a flat wall of ten cards; the start page previewed three of them for no structural reason.

## What changed

| Area           | Change                                                                                                                                                                                                                                                                                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Mental map     | A six-level zoom ladder in `src/content/concepts.js`: subscription and resource group, Azure resources around the cluster, AKS, namespaces and workloads, one OSDU service, where the code comes from. The start page draws it as nested boxes with chapter tags. Every learn view shows it as a “You are here” strip with its levels lit.                         |
| The word       | A three-card figure on the start page: the Service Provider Interface (in the code), the SPI Stack (on Azure), osdu-spi (in GitHub), each with the repository it lives in and the view that explains it. The start intro expands the acronym.                                                                                                                      |
| Per-view frame | Each learn view now states the question it answers, what it builds on, and two or three outcomes. The outcomes render as a “Carry forward” block that also introduces the next view’s question. The start page’s path cards show the question and the first outcome instead of repeating the headline.                                                             |
| View 01        | New field guide, “Where the familiar things live”: seven OSDU concepts (a partition, entitlements, search, schemas, the services, an API call, credentials) mapped to the place each one becomes in the stack, colored by owner, each linking to its map component. The ownership table was removed; its “boundary to remember” column moved into the owner cards. |
| View 02        | Field guides are keyed by moment: owners at Create Azure and Prepare AKS, the timeline at Assemble OSDU, the milestones at Use the stack. Start locally and Remove the stack show none.                                                                                                                                                                            |
| View 03        | The diagram is now one request through one service, top to bottom: OSDU API, common logic, the interface as a full-width seam, the Azure implementation, the Azure clients, and a terminal that points back to the opendes resources on the map. A breadcrumb (The stack › AKS › osdu namespace › one service) shows the zoom.                                     |
| View 04        | A numbered five-stop journey (service fork, GHCR digest, osdu-image-lock, running pod, acceptance result) sits above the diagram, each stop selecting its component. The three lanes are lettered: source lives in forks, shared machinery, a stack runs it. A breadcrumb links back to view 03 and forward to view 01.                                            |
| View 05        | The ten field checks are grouped into five themes (readiness and proof, GitOps and reconciliation, identity and data access, the front door, the Azure estate), each heading linking to the view where the concept was built.                                                                                                                                      |
| Start page     | Order is now: the word, the ladder, the path, listen and field guides, documentation. The lifecycle spine and the three-myth preview were removed; the documentation cards match the three meanings.                                                                                                                                                               |

## Verification

`npm run check` passes: formatting, eleven content tests, and a production build. New tests cover: every learn view has a question, a build-on note, outcomes, and valid zoom levels; every ladder level and SPI meaning routes to a real view; every field check has a theme that points back to a learn view; every row of the familiar-things guide links a real map component; lifecycle guides are keyed by real moments. Headless renders were checked at 1440 and 390 pixels for the start page and all five learn views.

## Still out of scope

Quizzes, scores, and tracking remain out. The map in view 01 still shows the workloads that view 02 assembles; the strip and the familiar-things guide now tell the learner which parts to read first, but a filtered first render of the map is a possible next step.
