# REO Current

REO Current is a property-preservation and field-services news publication built
with Next.js, TypeScript, Tailwind CSS, and Payload CMS. The public website and
CMS run inside the same Next.js application, while local content is stored in
SQLite.

## Technology

- Next.js 16 App Router with React 19
- TypeScript
- Tailwind CSS 3
- Payload CMS 3
- Payload Lexical rich-text editor
- SQLite for local development
- Sharp for uploaded-image processing

## Quick start

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

The development command intentionally uses Webpack for reliable Payload CMS
Fast Refresh:

```text
Website:   http://localhost:3000
CMS:       http://localhost:3000/admin
```

To populate a new local database with demonstration content and a development
administrator, run:

```bash
npm run seed
```

Development login:

```text
Email:    admin@reocurrent.com
Password: changeme123
```

Change this password after the first login. The seed command clears existing
Posts, Categories, Tags, Authors, and Newsletters before recreating the demo
content, so do not run it against content you need to retain.

## Environment variables

Create a local `.env` file containing:

```dotenv
PAYLOAD_SECRET=replace-with-a-long-random-secret
DATABASE_URI=file:./reo-cms.db
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`PAYLOAD_SECRET` must be changed for production. The frontend falls back to
`http://localhost:3000` when `NEXT_PUBLIC_SITE_URL` is not provided.
If an older local `.env` uses `NEXT_PUBLIC_SERVER_URL`, rename that key to
`NEXT_PUBLIC_SITE_URL`.

Local environment files, SQLite databases, generated media, dependencies, and
Next.js build output are excluded from Git.

## Architecture

```text
┌──────────────────────────── one Next.js app ────────────────────────────┐
│                                                                         │
│  app/(frontend)/     Public website and metadata                        │
│          │                                                              │
│          ▼                                                              │
│  lib/data.ts         Payload Local API queries and UI data mapping      │
│          │                                                              │
│          ▼                                                              │
│  Payload CMS  ───────────────────────────────►  SQLite / production DB  │
│          ▲                                                              │
│          │                                                              │
│  app/(payload)/      Admin panel and REST/GraphQL routes                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

The frontend reads Payload through its Local API rather than making HTTP calls
back to the same application. The frontend layout is dynamically rendered so
CMS-driven navigation and mega-menu posts remain current.

## CMS collections

Open `/admin` and use the **Content** group to manage:

| Collection | Purpose |
| --- | --- |
| **Posts** | Articles and blog posts, including body content, placement, SEO, author, category, tags, and images |
| **Categories** | Website sections and navigation order |
| **Tags** | Article topics and tag landing pages |
| **Authors** | Reporter profiles, biographies, beats, social links, and statistics |
| **Newsletters** | Newsletter names, descriptions, cadence, body content, and SEO fields |
| **Media** | Uploaded article and author images |
| **Users** | CMS administrators |

Reader comments are disabled and are not stored or displayed.

## Creating a post

In **CMS → Posts**, create a post and provide its title, excerpt, body, date,
category, author, and any optional tags or featured image.

### Slugs

Leave the slug blank when creating a post. It is generated automatically from
the title when the post is saved. An existing slug is not overwritten when the
title changes, preventing published URLs from changing unexpectedly.

### Rich text

Post and Newsletter Body fields use the Lexical editor with:

- A fixed formatting toolbar
- Headings, paragraphs, lists, links, uploads, quotes, and horizontal rules
- Table insertion from the editor's `+` menu
- The generic Relationship block removed

Published rich-text typography and the CMS editor preview use these sizes:

| Element | Size |
| --- | ---: |
| H1 | 42px |
| H2 | 24px |
| H3 | 20px |
| H4–H6 | 18px |
| Paragraph | 18px |

## Homepage placement

Each Post has three placement controls in the CMS sidebar:

- **Featured Post** places the post in the homepage center column and uses its
  title and link in the scrolling alert bar.
- **Homepage Side Column** assigns the post to the left column, right Latest
  column, or neither.
- **Homepage Order** controls side-column order; lower numbers appear first.

Only one post can be featured. Featuring a new post automatically clears the
previous featured selection. If no post is featured, the newest post is used as
a safe homepage fallback.

Homepage placement does not remove a post from its category. A placed post can
also appear in the lower homepage category preview and always remains available
on its full category page. The lower homepage category previews show the three
newest posts in each displayed category.

## Navigation mega menus

Desktop navigation items open category mega menus on hover or keyboard focus.
Each panel shows up to four newest CMS posts from that category, including the
featured image, title, date, and a link to view the full category. Mobile keeps
the horizontally scrollable category navigation without hover-only controls.

## SEO fields

Posts and Newsletters include an **SEO** group containing:

- **Meta Description** — limited to 160 characters
- **Focus Keyword**
- **Secondary Keywords** — entered as comma-separated phrases

Article pages use the Meta Description for search and social metadata, falling
back to the excerpt when it is blank. Focus and secondary keywords are emitted
as page keyword metadata and primarily serve as editorial guidance. Search
rankings still depend on content quality, intent match, crawlability, internal
links, performance, and authority; keyword fields alone do not improve ranking.

## Branding assets

Tracked branding images live in `public/images/`:

```text
public/images/reo-current-logo.png          Header logo
public/images/reo-current-footer-logo.png   Footer-only white logo
```

The primary orange is `#FD7402`. Navigation and post-title hover states use
blue `#0E489C`.

## Public routes

Important routes include:

```text
/                         Homepage
/article/[slug]           Article detail
/category/[slug]          Category archive
/tag/[slug]               Tag archive
/author/[slug]            Author profile and articles
/latest                   Latest articles
/search?q=...             Search results
/newsletters              Newsletter signup page
/about                    About
/contact                  Contact
/advertise                Advertising information
/privacy                  Privacy policy
/terms                    Terms of use
/admin                    Payload CMS
```

## Useful commands

```bash
npm run dev                 Start Next.js with Webpack
npm run build               Create a production build
npm run start               Run the production build
npm run seed                Reset and seed local CMS content
npm run generate:types      Regenerate payload-types.ts
npm run generate:importmap  Regenerate Payload's admin import map
```

Run `npm run generate:types` after changing collection fields. Regenerate the
import map after adding or removing Payload admin/editor components.

## Project structure

```text
app/(frontend)/       Public routes, root layout, metadata, and global styles
app/(payload)/        Payload admin, API routes, import map, and admin styles
collections/          Payload schemas
components/           Layout, cards, forms, sidebars, and reusable UI
fields/               Reusable slug and SEO field definitions
lib/data.ts           Payload queries and domain mapping
lib/types.ts          Frontend domain types
lib/mock-data.ts      Demo seed content and remaining static site furniture
public/images/        Header and footer branding assets
payload.config.ts     CMS, editor, database, and collection configuration
payload-types.ts      Generated Payload types
seed.ts               Destructive local demo-data seed script
reo-cms.db            Local SQLite database; ignored by Git
```

The remaining static site furniture in `lib/mock-data.ts` includes the Most
Read list and testimonial. The featured alert, navigation mega menus, center
feature, and both homepage side columns are CMS-driven.
