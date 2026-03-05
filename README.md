# Tag-Driven Status Pages with Checkly

A sample project demonstrating how to use **Checkly's monitoring-as-code (MaC)** workflow to automatically wire checks to status page services using a tag-based convention. Instead of manually linking each check to a status page card, you define tags on your checks, and a helper function resolves the correct status page service at deploy time.

## How It Works

The core idea is a tagging convention that connects checks to status page services:

1. **Define application tags** (`tags.ts`) — each tag represents a logical service/application (e.g., `app1`, `app2`).
2. **Auto-generate status page services** (`statuspage-services.ts`) — a `StatusPageService` is created for every application tag.
3. **Build the status page** (`statuspage.check.ts`) — all services are assembled into cards on a single `StatusPage`.
4. **Tag your checks** — checks use a namespaced tag format, e.g. `leanix:<app>` for LeanIX users, to declare which service they belong to.
5. **Wire incidents automatically** (`helper.ts`) — the `createTriggerConf()` helper parses the tag, looks up the matching `StatusPageService`, and returns an `IncidentTrigger` configuration.

When a check fails, Checkly triggers an incident on the correct status page service — all driven by the tag on the check.

### Tag Format

```
<namespace>:<app>
```

- **Namespace** (`leanix`) — an examples prefix that identifies these as status-page-relevant tags, filtering them from any other tags on the check.
- **App** (`app1`, `app2`, ...) — maps directly to a key in `appTags` and its corresponding `StatusPageService`.

## Project Structure

```
.
├── __checks__
│   ├── tags.ts                  # Central tag definitions
│   ├── statuspage-services.ts   # Auto-generates a StatusPageService per app tag
│   ├── statuspage.check.ts      # Assembles the status page with one card per service
│   ├── helper.ts                # createTriggerConf() — resolves tags to incident triggers
│   ├── api.check.ts             # Example API check tagged with leanix:app1
│   └── url.check.ts             # Example URL check tagged with leanix:app2
├── checkly.config.ts            # Checkly project configuration
├── playwright.config.ts         # Playwright configuration for browser checks
├── package.json
└── package-lock.json
```

## Adding a New Service

1. Add a new entry to `appTags` in `__checks__/tags.ts`:

   ```ts
   export const appTags = {
       app1: 'app1',
       app2: 'app2',
       app3: 'app3', // new
   }
   ```

2. Create a check and tag it:

   ```ts
   const tags = [`${leanixTag}:${appTags.app3}`]

   new ApiCheck('my-new-check', {
     name: 'My New Service Check',
     tags,
     triggerIncident: createTriggerConf({ severity: 'MAJOR', tags }),
     // ...
   })
   ```

That's it. The status page service and card are created automatically from the tag definition.

## Getting Started

### Prerequisites

- Node.js
- A [Checkly account](https://app.checklyhq.com/signup)

### Install

```bash
npm install
```

### Authenticate

```bash
npx checkly login
```

### Test

Run checks on demand:

```bash
npx checkly test
```

Run with recording to preview in the Checkly UI:

```bash
npx checkly test --record
```

### Deploy

Deploy checks, status page, and incident triggers to Checkly:

```bash
npx checkly deploy
```

## CLI Commands

| Command              | Action                                        |
|:---------------------|:----------------------------------------------|
| `npx checkly test`   | Dry run all the checks in your project        |
| `npx checkly deploy` | Deploy your checks to the Checkly cloud       |
| `npx checkly login`  | Log in to your Checkly account                |
| `npx checkly --help` | Show help for each command                    |

## Resources

- [Checkly CLI docs](https://www.checklyhq.com/docs/cli/)
- [Checkly Status Pages](https://www.checklyhq.com/docs/status-pages/)
- [Monitoring as Code](https://www.checklyhq.com/docs/cli/project-structure/)
- [Checkly Slack community](https://checklyhq.com/slack)
