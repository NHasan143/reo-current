# REO Current

Property preservation & field services news publication. **Next.js (App Router)
+ TypeScript + Tailwind CSS** front-end, with a **Payload CMS** back-end running
**inside the same app** (no separate server). Content is stored in **SQLite** for
local development.

## Quick start

```bash
npm install
npm run seed     # one-time: creates the DB, an admin user, and demo content
npm run dev      # http://localhost:3000
```

- **Website:** http://localhost:3000
- **CMS admin:** http://localhost:3000/admin
- **Seed login:** `admin@reocurrent.com` / `changeme123` (change it in the admin)

Build for production:

```bash
npm run build && npm run start
```

## How it fits together

```
┌───────────────────────── one Next.js app ─────────────────────────┐
│                                                                    │
│  app/(frontend)/ …… the public website (server components)         │
│        │  reads content through lib/data.ts                        │
│        ▼                                                            │
│  Payload Local API  ───────────────►  SQLite (reo-cms.db)          │
│        ▲                                                            │
│        │  writes content                                           │
│  app/(payload)/  …… the /admin CMS panel + REST/GraphQL API        │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

The front-end never calls the CMS over HTTP — `lib/data.ts` uses Payload's
**Local API** (`getPayload`), which talks to the database directly in the same
Node process. That's why pages are fast and can be statically generated.

## Editing content

Everything is managed at **`/admin`** → **Content**:

| Collection   | What it holds                                             |
| ------------ | -------------------------------------------------------- |
| **Posts**    | Blog articles — title, rich-text body, category, author, tags, image, date |
| **Categories** | The nav sections (order controls nav order)            |
| **Tags**     | Article tags                                             |
| **Authors**  | Reporter profiles (bio, beats, socials, stats)           |
| **Newsletters** | The newsletter line-up on `/newsletters`              |
| **Media**    | Uploaded images                                          |

Create/edit a **Post**, hit **Save** — refresh the site and it's live. In
production you'd trigger a rebuild or use ISR/on-demand revalidation.

## Project structure

```
app/(frontend)/     # public website routes + root layout + globals.css
app/(payload)/      # Payload admin panel + REST/GraphQL API routes
collections/        # Payload collection schemas (Posts, Categories, …)
fields/             # reusable Payload fields (slug)
payload.config.ts   # Payload config (db, collections, editor)
components/          # React UI (layout, cards, sidebar, forms, ui)
lib/
  types.ts          # domain types the UI renders against
  data.ts           # data access layer — reads Payload via the Local API
  mock-data.ts      # seed content + remaining site "furniture"
seed.ts             # populates the CMS from mock-data (npm run seed)
reo-cms.db          # local SQLite database (git-ignored)
```

## Notes

- **Database:** SQLite locally (zero-config). For production, swap the adapter in
  `payload.config.ts` to Postgres (`@payloadcms/db-postgres`) or MongoDB and set
  `DATABASE_URI`.
- **Env:** see `.env` (`PAYLOAD_SECRET`, `DATABASE_URI`).
- After changing a collection schema, run `npm run generate:types` to refresh
  `payload-types.ts`.
- Site furniture still sourced from `lib/mock-data.ts` (alert bar, "Latest" wire,
  "Most Read", testimonial) can later move into a Payload global.
