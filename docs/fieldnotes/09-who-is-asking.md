# Fieldnote 09 · Who is asking

**Status: published, then replaced by S202.** Season 2, _Working the stack_. Cut from osdu-spi-stack ADR-039 (`docs/decisions/039-people-join-entitlements-through-the-cli.md`), ADR-032 and ADR-044's impersonation rule, PRs #299 and #302, `src/spi/users.py`, `src/spi/identity.py` and `src/spi/token.py`, read at `main` 870f729 (identical to the v0.32.0 tag 3d3106d outside `ops/`), and the 22 October take on spi 0.32.0. The lesson it proposes is `who-is-asking` in the _Working the stack_ book.

**Who is watching:** an engineer with a Ready core environment (Fieldnote 02) who has so far called the APIs with `spi token`. **What they should believe after it:** their own Azure token gets through the mesh and is then refused by entitlements until they are a member; `spi users add --me` stores the id the mesh writes for them and proves it with their own token; and the role they pick decides whether Workflow may act for them.

**Money shot:** the same `curl`, the same person, `HTTP 401` and then `HTTP 200`, with one command between them.

**Form: mixed, footage-led.** Five short casts from the take carry the story in order: refused, added as viewer, admitted, refused again as a viewer by the ingestion smoke, promoted to editor. Boards carry the mechanism the terminal cannot show: the mesh's claim projection, the groups, and who writes them.

**Length:** about 3 minutes 40 seconds (estimate below).

## Angles considered

- **Four oh one to two hundred** (chosen). Footage-led, about 3 minutes 40, following the take's order. Best for engineers who will add themselves on their own environment.
- **Three askers.** Who acts at each layer: the deployer's Azure roles (`spi check`, ADR-035, PR #244), the seeded identities `spi token` mints, and the person `spi users` adds. Boards only, about 3 minutes: the take recorded no `spi check` and no permission refusal, so the deployer third would be drawn. Dropped as the frame; the seeded identities stay in claim 1.
- **Roles as a table.** The four presets and their groups, read row by row. Clear, but it reads as a reference card, not an episode. Kept as the board under claim 3.

## The look

The series sheet, ink and fonts. Owners: the `spi` CLI (`spi users`, `spi token`), Flux (the mesh's authentication policy and identity filter, as lesson 07's identity myth draws it), OSDU services in neutral ink (Entitlements, Workflow), and you. No orange: no fork code changes. Group names set in code type, never in an owner color.

**New devices for the series:** a split-flap status code that flips from `401` to `200`; a badge that carries the projected id (`x-user-id: <you>`) from the service's sidecar into entitlements; group chips that attach to and detach from a person card as a role changes.

## The sound

- Series bookend beds under the prequel and postquel.
- The under-narration bed under the cold open (c1), the traced example (n6) and the recall (n8), ducked 10 dB under every line with the 2 kHz cut. No bed under n3 to n5 or n7, where command output is read.
- Effects, three in all: a dull thump on `HTTP 401` (c1), a click on the flip to `HTTP 200` (c1 and n6), a soft pop as a group chip detaches (n7).
- -16 LUFS integrated; 1 to 4 kHz of the bed at least 7 dB under the voice, measured with `film aqa`.

## Lines and boards

Times are approximate; the narration sets them.

| Line | Beat · chapter                                                                        | Narration                                                                                                                                                                                                                                                                                                                                                                                                                                            | Board                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Form         | Sound                             |
| ---- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------------------------- |
| c1   | Cold open                                                                             | My own token, against the entitlements A P I. Four oh one. One command later, the same call: two hundred. Nothing changed in the token. Something changed in who the stack thinks I am.                                                                                                                                                                                                                                                              | Footage: s09-before, cropped to its last two lines: `Signed in as <you> (unique_name) for https://management.azure.com`, then `HTTP 401`. Cut to s09-after, the same two lines ending `HTTP 200`. Between them, one line from s09-add-viewer, `spi users add --me --role viewer`, slides past. The status code is drawn as a split-flap over the footage's own line on "two hundred".                                                                                                                                                                         | take         | bed in, ducked; thump, then click |
| n0   | Prequel                                                                               | Fieldnote nine. Who is asking.                                                                                                                                                                                                                                                                                                                                                                                                                       | The notebook push-in; the gears turn one tooth as `FIELDNOTE 09 · WHO IS ASKING` sets.                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | bookend      | series bed                        |
| n1   | Question                                                                              | Who does the stack think you are, and what may you do?                                                                                                                                                                                                                                                                                                                                                                                               | Kinetic type on the spoken times, then the question lifts into the left third.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | drawn        |                                   |
| n2   | Standfirst                                                                            | Your own Azure token gets you through the mesh. S P I users puts you in entitlements groups, and the role you choose decides what you may do, including whether Workflow may act for you.                                                                                                                                                                                                                                                            | Three boxes draw left to right on their words: you (with a token), the mesh (Flux chip, the sidecar in front of Entitlements), Entitlements (neutral). A role card with four tabs, `viewer · editor · admin · ops`, sets beneath on "the role you choose".                                                                                                                                                                                                                                                                                                    | drawn        |                                   |
| n3   | Claim 1 · **Your own token passes the mesh, and entitlements decides.**               | S P I token, dash dash me, prints your own Azure token. The mesh accepts its issuer, and the sidecar in front of each service writes your unique name as the caller. Then entitlements looks you up. Bring-up seeded three identities, the workload, the deploy identity and the member, and nobody else. So you get four oh one. Plain S P I token mints the deploy identity instead, which is why it always worked: every call was the platform's. | A token card leaves "you" and reaches the service's sidecar; a badge `x-user-id: <you>` stamps onto it on "writes your unique name" (the v1 claim order drawn small beneath: `unique_name`, else `appid`, else `upn`). It reaches Entitlements, which shows three seeded identity chips (`workload`, `deploy`, `member`) and no `<you>`. A `401` sets. On "Plain S P I token", a second token card in the CLI color, labeled `deploy identity · users.datalake.ops`, passes straight through.                                                                 | drawn        |                                   |
| n4   | Claim 2 · **spi users stores the id the mesh writes, and proves it.**                 | S P I users add, dash dash me, reads your token and applies the mesh's own claim order, so it stores the id entitlements will see. The deploy identity writes the groups, because it sits in ops. Then the command calls entitlements with your token, and keeps trying for up to a minute. Here, it answered, and the same curl returned two hundred.                                                                                               | Footage: s09-add-viewer, its lines in order with the take's clock: `Member: <you> (unique_name, from your az token)`, `Role: viewer`, `opendes added users`, `opendes added users.datalake.viewers`, `verified your token calls OSDU APIs`. The 15 s wait before the member line is cut and labeled `15 s`. Board beside it: a hand labeled `deploy identity` writes two chips onto the person card; then a check mark rides your token into Entitlements. Then s09-after's `HTTP 200`.                                                                       | board + take | click on `200`                    |
| n5   | Claim 3 · **Only editor, admin and ops can run ingestion as you.**                    | A role is a preset of groups. Viewer is users and datalake viewers. Editor, admin and ops each add impersonation, which lets the stack's O S D U identity act for you through Workflow. As a viewer, the ingestion smoke refused before any run started: impersonation missing. As an editor, it can run as you.                                                                                                                                     | The role card's four tabs open into four columns of group chips, from ADR-039: viewer `users`, `users.datalake.viewers`; editor adds `users.datalake.editors`, `users.datalake.impersonation`; admin `users.datalake.admins`, `users.datalake.ops`, impersonation; ops `users.data.root`, `users.datalake.ops`, impersonation. The impersonation chip lights in three columns. Footage: s11-dags-viewer's refusal, `DAG smoke not run (impersonation_missing): opendes: <you> is not in users.datalake.impersonation.` Its 27 s preflight is cut and labeled. | board + take |                                   |
| n6   | Example · **Example: From 401 to 200**                                                | Follow your own call. Your token passes the mesh, and the sidecar writes your unique name. Entitlements finds no group, and refuses. S P I users add puts you in users and a role's groups, written by the deploy identity, and checks with your token. Entitlements finds you now. Same token, same call, two hundred.                                                                                                                              | A dot traces five hops with the example's labels: `Your token`, `Mesh`, `Entitlements: 401`, `spi users add`, `Entitlements: 200`. The badge `x-user-id: <you>` rides the dot. At the fourth hop the person card gains its chips. The last hop flips the split-flap to `200`.                                                                                                                                                                                                                                                                                 | drawn        | bed under, ducked; click on `200` |
| n7   | Easy mistake · **Easy mistake: Running spi users add again adds to the role I hold.** | An easy mistake: running S P I users add again adds to the role I hold. It replaces it. Here, viewer became editor. Users stayed. Editors and impersonation were added, and datalake viewers was removed. Going back to viewer removes impersonation too, and ingestion as you stops. Check with S P I users list.                                                                                                                                   | The myth writes itself in quotes with the CLI chip and an `spi` tool chip. Footage: s09-add-editor, its lines in order: `Role: viewer -> editor`, `opendes already users`, `opendes added users.datalake.editors`, `opendes added users.datalake.impersonation`, `opendes removed users.datalake.viewers`. The person card mirrors each line: one chip stays, two attach, one detaches. On "Going back to viewer", the card is drawn reverting, labeled _illustrative_, and the impersonation chip detaches.                                                  | board + take | pop on each detach                |
| n8   | Recall                                                                                | So now you can say: your own token passes the mesh, and entitlements decides. S P I users stores the id the mesh writes, and proves it. And only editor, admin and ops can run ingestion as you.                                                                                                                                                                                                                                                     | The three headlines stack up on a notebook spread, set from the claims.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | drawn        | bed under, ducked                 |
| n9   | Next                                                                                  | Next: when is a new environment ready, open for deploys, and holding data?                                                                                                                                                                                                                                                                                                                                                                           | Postquel: the Next card on the notebook's empty left page, then the pull-back with "Fieldnotes · Azure SPI".                                                                                                                                                                                                                                                                                                                                                                                                                                                  | bookend      | series bed                        |

**Runtime estimate:** about 440 words at 150 a minute is 2 minutes 55 seconds, plus the bookends and board hand-offs, about 3 minutes 40 seconds. If the voiced total lands above 4 minutes, cut n3's last sentence ("Plain S P I token…") first; n6 carries the contrast.

## The take

Five casts from the 22 October session on the throwaway core environment, spi 0.32.0, recorded in this order after maintenance was cleared. The partition is `opendes`.

| Order | Cast              | Command                                                                                                                                                                 | Ended (UTC) | Length | Used in |
| ----- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------ | ------- |
| 1     | `s09-before`      | `curl -sS -o /dev/null -w 'HTTP %{http_code}\n' -H "Authorization: Bearer $(spi token --me)" -H 'data-partition-id: opendes' https://<name>/api/entitlements/v2/groups` | 23:25:35    | 7.0 s  | c1      |
| 2     | `s09-add-viewer`  | `spi users add --me --role viewer`                                                                                                                                      | 23:25:51    | 16.7 s | c1, n4  |
| 3     | `s09-after`       | the same `curl` as 1                                                                                                                                                    | 23:25:56    | 4.9 s  | c1, n4  |
| 4     | `s11-dags-viewer` | `spi test dags --as me`                                                                                                                                                 | 23:26:25    | 28.7 s | n5      |
| 5     | `s09-add-editor`  | `spi users add --me --role editor`                                                                                                                                      | 23:26:43    | 17.9 s | n7      |

- **What the take showed:** `HTTP 401` with the person's own token; `spi users add --me --role viewer` added `users` and `users.datalake.viewers` and verified (`18 groups`); the same call then returned `HTTP 200`, 21 seconds after the 401; `spi test dags --as me` as a viewer stopped with `impersonation_missing` before submitting anything; `--role editor` printed `viewer -> editor`, kept `users`, added `users.datalake.editors` and `users.datalake.impersonation`, removed `users.datalake.viewers`, and verified (`26 groups`).
- **The command line is not shown.** The `curl` carries the environment's hostname; boards show it as `GET /api/entitlements/v2/groups` with `data-partition-id: opendes`.
- **Masked on screen:** the person's id (`<you>`) in every cast, the context line `Cluster context: spi-stack-<name>`, and the hostname. No token is printed in any cast; none may be added.

## Keep it true

- A person's v1 `az` token passes the mesh because the v1 issuer rule accepts the management audience (ADR-016). The identity filter on each service's sidecar writes `x-user-id` from `unique_name` for that token. Never say the mesh "looks you up" or "authorizes" you.
- Bring-up's members Job seeds exactly three identities: workload, deploy and member. No person is seeded, and `spi up` enrolls no people.
- `spi token` with no flag mints the deploy identity (in `users.datalake.ops`); `--member` and `--no-access` mint the other two; `--me` prints the person's own token. Never call `spi token` "your token".
- `spi users add --me` stores the id the filter projects (`identity.projected_user_id`), and verifies by calling the entitlements group listing in the first partition written, for up to 60 seconds. It verifies entitlements only, in that partition; it says nothing about data ACLs.
- An id for someone else (`spi users add <id>`) is stored as typed and verified by nothing.
- The four presets are ADR-039's and `ROLE_PRESETS` in `users.py`. The default role, with no `--role`, is `admin`. Say "editor, admin and ops carry impersonation; viewer does not".
- A role is set, not accumulated: `add` with another role removes the other presets' groups, then adds this one's; `users` stays.
- Membership lives only in entitlements: a reset or a new partition drops it, and each person runs `spi users add --me` again.
- Do not explain the group counts (`18`, `26`); they include groups reached through nesting, which this episode does not draw.
- The take's `curl` printed only the status code. Do not show or imply a response body.

## Spoken forms

Adds to the series table.

| Written                        | Spoken                        |
| ------------------------------ | ----------------------------- |
| `spi token --me`               | S P I token, dash dash me     |
| `spi users add --me`           | S P I users add, dash dash me |
| `spi users list`               | S P I users list              |
| `unique_name`                  | unique name                   |
| `users.datalake.viewers`       | datalake viewers              |
| `users.datalake.impersonation` | impersonation                 |
| `users.datalake.ops`           | ops                           |
| 200                            | two hundred                   |
| `curl`                         | curl                          |

## Chapters

n3, n4, n5, n6 and n7, titled with the bold text above. The cold open and the question sit before the first chapter.

## Review the cut

- c1, n4, n5 and n7 are the take's own frames, cropped and zoomed, not retyped; the waits are cut and labeled with their measured lengths.
- No frame shows a token, a hostname, an email, or the environment name.
- The n7 revert to viewer is labeled _illustrative_.
- The mesh is never drawn granting a role; Entitlements is the only box that says yes or no.
- The bed is under c1, n6 and n8 only, and measures at least 7 dB under the voice in 1 to 4 kHz.
- Chapter marks fall on n3 to n7 and read exactly as titled.
- Each claim board and terminal crop reads at 405 px wide.

## Cut-downs

- **30 s, 16:9:** c1 then n4's footage, ending on `HTTP 200`. For the `spi users` section of the stack's docs.
- **Roles:** n5 and n7 together, about 50 s, for people choosing a role.

## Proposed lesson

`who-is-asking`, in the _Working the stack_ book. Map lesson at the namespaces-and-workloads rung: the mesh in front of the `osdu` services, the Entitlements service, and the CLI on the workstation.

- **Title:** Who is asking
- **Subhead:** Your own token passes the mesh, spi users puts you in entitlements groups, and the role you choose decides what you may do.
- **Question:** Who does the stack think you are, and what may you do?
- **Builds on:** the environment from lesson 02 and the mesh's token check from lesson 07's identity theme.
- **Outcomes (headlines):**
  1. Your own token passes the mesh, and entitlements decides.
  2. spi users stores the id the mesh writes, and proves it.
  3. Only editor, admin and ops can run ingestion as you.
- **Example:** _From 401 to 200_, `spi users add --me --role viewer`. Hops: your token (`spi token --me`, a v1 token for the management audience) → mesh (the sidecar writes `x-user-id` from `unique_name`) → Entitlements (no group: 401) → `spi users add` (the deploy identity writes `users` and the role's groups, then verifies with your token) → Entitlements (200).
- **Easy mistake:** `users-add-accumulates`, owner `cli`, theme `identity`. Claim: "Running spi users add again adds to the role I hold." Reality: a role is one of four presets and is set, not accumulated; a second `add` with another role removes the other presets' groups and adds this one's, and a return to viewer removes impersonation, so ingestion as yourself stops. Correction: "spi users add sets your role; it replaces the one you held." Check: `spi users list`. Source: a new key for ADR-039.

## Unverified

- That the take's 401 came from Entitlements rather than the mesh. The `curl` printed only the status code. It is inferred: ADR-039 says a person's token passes the mesh and gets entitlements' 401, and the same token shape was admitted (`verified … 18 groups`, then `HTTP 200`) with nothing about the mesh changed in between. The narration states it as ADR-039 does; the board does not show a response body.
- "Ingestion as you stops" after a return to viewer is shown by the take only in the other direction (viewer refused, before editor). The revert itself is from `users.py` and ADR-039, and its board is labeled _illustrative_.

## Choices for Daniel

- **`s11-dags-viewer` in this episode.** Recommended: use it here as claim 3's proof; Fieldnote 11 lists `spi users add --me --role editor` as its precondition and does not use the refusal.
- **`spi check` and the deployer's roles.** Recommended: leave them out; they belong to bringing an environment up, the take recorded no permission refusal, and the episode stays with people calling a running stack.
