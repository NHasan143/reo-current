# REO Current

Next.js front-end backed by Payload CMS. Property Preservation & Field Services news.

## Agent skills

The agent tooling itself (`.claude/`, `.agents/`, `.scratch/`, `docs/`, `skills-lock.json`)
is gitignored — it is local to each machine and absent from a fresh clone. The
conventions below are the parts worth keeping, so they live here rather than in a
file that may not exist. Where a local `docs/agents/*.md` is present it has the
long form; treat it as optional detail, not a prerequisite.

### Issue tracker

Issues and specs (a spec may also be called a PRD) live as local markdown files
under `.scratch/` — never committed.

- One feature per directory: `.scratch/<feature-slug>/`
- Spec: `.scratch/<feature-slug>/spec.md`
- Issues: one file per ticket at `.scratch/<feature-slug>/issues/<NN>-<slug>.md`,
  numbered from `01` — never a single combined tickets file
- Triage state: a `Status:` line near the top of each issue file
- Conversation history appends to the bottom under a `## Comments` heading

"Publish to the issue tracker" means create a file under `.scratch/<feature-slug>/`.
"Fetch the relevant ticket" means read the referenced path; the user normally passes
the path or issue number.

### Triage labels

Five canonical roles, recorded as the value of the `Status:` line:

`needs-triage` · `needs-info` · `ready-for-agent` · `ready-for-human` · `wontfix`

### Domain docs

Single-context repo. Before exploring, read `CONTEXT.md` at the root and any ADRs
under `docs/adr/` touching the area you're working in. Neither exists yet, and both
are gitignored — if they are absent, proceed silently. Don't flag their absence or
suggest creating them upfront; `/domain-modeling` creates them lazily when terms or
decisions actually get resolved.

When naming a domain concept, use the term as defined in `CONTEXT.md` rather than a
synonym. If your output contradicts an existing ADR, surface the conflict explicitly
instead of silently overriding it.
