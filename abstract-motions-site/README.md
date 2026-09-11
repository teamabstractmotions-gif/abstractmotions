# Abstract Motions — website

Built from `Abstract_Motions_Web_Structure_02.pdf` (the site brief). This
README covers what's here, what was deliberately adapted from the brief and
why, and how to get it live on Netlify with a working CMS.

## What's here

```
index.html          Home — single static scrolling page (Section 4.1)
work.html            Work index — CMS-driven, honest empty state at launch
work-detail.html     Work detail — one template, driven by content/work.json
about.html            About — static
contact.html          Contact — Netlify Forms + honeypot
admin/                Decap CMS (not linked from the public nav)
content/work.json     The site's only content database — one JSON file
css/style.css         Design system
js/                   main.js (nav, hero, reveal, timecode), work.js,
                       work-detail.js, contact.js
netlify.toml          Redirects (pretty URLs) + security headers
robots.txt, sitemap.xml
images/logo.png        Your uploaded mark, background removed
```

## Two deliberate deviations from the brief, and why

**Plain HTML/CSS/JS instead of React + Vite/Next.js.** The brief prefers
React + TypeScript. This was built in a sandboxed environment with no
package-registry access, so it wasn't possible to install and verify a
React/Vite toolchain here — shipping untested framework code felt riskier
than shipping something plain that's fully working right now. A vanilla
build also has zero build step, which fits the brief's own "keep
dependencies minimal" principle. If you want it rebuilt as a proper
React + TypeScript + Vite project (for editing in Claude Code, Cursor, etc.),
that's a clean follow-up task — this HTML/CSS/JS structure maps over
directly, one page/component at a time.

**Work entries live in one `content/work.json` file, not one markdown file
per project.** The brief's CMS schema (Section 6) assumes a folder
collection — every project its own file — which normally needs a build
step (Next.js, or a prebuild script) to turn that folder into pages. With
no build step, the site can't get a directory listing from a static host
at runtime. So `admin/config.yml` uses a Decap **files** collection with a
single **list** field instead: same fields as the brief's schema, same
add/edit/reorder/delete experience in the CMS UI, but all entries save to
one JSON file the site can just `fetch()`. The only field this added is an
explicit **Slug**, since there's no filename for the site to derive a URL
from.

Everything else — routes, copy, the empty-state rule, `isSpecWork`
defaulting to `true`, the security headers — follows the brief directly.

## Deploy to Netlify

1. Push this folder to a Git repo (GitHub/GitLab/Bitbucket), or drag the
   folder straight into [app.netlify.com/drop](https://app.netlify.com/drop)
   for a quick first look.
2. In Netlify: **Add new site → Import an existing project**, point it at
   the repo. No build command is needed — publish directory is `.`
   (already set in `netlify.toml`).
3. Once it's live, add your real domain in **Domain settings** (HTTPS is
   automatic).

## Turn on the CMS (`/admin`)

`admin/config.yml` uses Netlify Identity + Git Gateway — the simpler
default for a Netlify-hosted site, per the brief's own note in Section 6.

1. Site settings → **Identity** → **Enable Identity**.
2. Identity → **Services** → **Git Gateway** → **Enable Git Gateway**.
3. Identity → **Invite users** → invite yourself (and anyone else who'll
   edit Work entries). You'll get an email to set a password.
4. Visit `yoursite.com/admin`, log in, and you'll see the **Work**
   collection with an empty entries list, ready to fill in.

If you'd rather authenticate via GitHub directly instead of Netlify
Identity, `admin/config.yml` has the swap commented in at the top.

## Before you launch

- **Contact page** (`contact.html`): swap the placeholder email/Instagram/
  LinkedIn/Facebook/TikTok links for your real ones.
- **`sitemap.xml`**: replace `abstractmotions.studio` with your real domain.
- **Netlify Forms spam filtering**: Site settings → Forms → enable Akismet
  spam filtering (this is a dashboard toggle, not something `netlify.toml`
  can set).
- **Work entries**: add real projects through `/admin` when you have them.
  `isSpecWork` defaults to `true` on purpose — only switch it off once a
  client relationship is actually confirmed, per the brief's "no fabricated
  clients" rule. Leave the cover image blank rather than uploading a
  stand-in; the site shows an honest "Cover pending" placeholder instead.
