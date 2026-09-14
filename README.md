# Hack 06 workspace

A lightweight JavaScript/Vite workspace for hackathon deliverables. The original
`pitch hack 06.html` is preserved as a pre-migration snapshot; it is no longer the
editable source.

## Work with the live preview

```sh
npm install
npm run dev
```

Open http://127.0.0.1:5173 and choose **Open deck**. Keep that browser tab open.
Styles update in place; content and script edits refresh automatically while
retaining the active slide in the URL. No manual HTML-file refresh is needed.
The server is local to this machine. Keep its terminal running; restart with
`npm run dev` after stopping it or ending the CLI session.

Conversation is not automatically captured as project content. Requested changes
are made to the source files here, which updates the running preview.

## Source of truth

| Path | Purpose |
| --- | --- |
| `app/index.html`, `app/workspace/` | Workspace home and deck controls |
| `app/deliverables.js` | Registry of deliverables |
| `app/decks/mobile-intelligence/index.html` | Slide content |
| `app/decks/mobile-intelligence/styles.css` | Existing deck styling |
| `app/decks/mobile-intelligence/main.js` | Slide navigation |
| `app/shared/`, `assets/` | Shared styles, licensed fonts and artwork |
| `research/`, `deliverables/` | Local-only research and reference material, excluded from Git |
| `exports/` | Generated, self-contained HTML decks |

## Export a finished deck

Click **Export HTML** in the workspace or live deck. This downloads an HTML file
and saves the same export in `exports/`.

```sh
npm run export
npm run export -- mobile-intelligence
```

`exports/mobile-intelligence.html` contains its styles, JavaScript, images and
fonts. It opens directly in a browser without Node, a server, or an internet
connection. Workspace controls are excluded. Export again after later edits.

`npm run build` produces a static multi-page workspace in `dist/` and packages
every registered deck as a self-contained HTML file in `dist/exports/`. Use
`npm run preview` to view that build. Both local and published decks include
**Export HTML** at the top left and a **close (×) control** at the top right.
Closing the deck returns to the workspace. There is no live-preview indicator.
On the published deck, **Export HTML** downloads the packaged snapshot without a
server-side export endpoint.
Local **Export HTML** controls generate a fresh snapshot; the CLI export command
is always available. Asset source and license notices are included in `dist/licenses/`
and embedded in each HTML export's inert `asset-notices` template.

## GitHub publishing

The authorized repository is https://github.com/ranjithquest/hack06, branch
`main`. The owner explicitly made the repository public to enable GitHub Pages.
Preserve the owner's chosen visibility; do not change it automatically.

Each reviewed push to `main` runs `.github/workflows/pages.yml`: a clean
`npm ci`, tests, the complete static build, artifact upload, and GitHub Pages
deployment. Manual runs are also available in Actions. The workflow uses
read-only source access and grants Pages/OIDC write permissions only to the
deployment job.

```sh
npm test
npm run build
git status --short
# Stage only the reviewed source, required assets, and configuration files.
git add <reviewed-paths>
git commit
git push origin main
```

The GitHub Pages site path is `https://ranjithquest.github.io/hack06/`; deck routes
and downloadable HTML use relative links so that the `/hack06/` prefix is
preserved. A successful build alone does not mean the site is live: check the
deployment job and the URL it reports.

Pages is enabled with **Settings → Pages → Build and deployment → Source**
set to **GitHub Actions** (`build_type: "workflow"`), with HTTPS enforced.
The former private-repository plan restriction no longer applies to the
owner-public repository. If Pages settings are reset, restore the workflow
source and rerun Actions. Repository visibility, account plans, and site-access
policies remain owner decisions, not automatic deployment workarounds.

`conversation-history.md`, raw `research/`, reference `deliverables/`, the
unchanged `pitch hack 06.html` backup, `MAI-visual-reference.md`, and the one-time
`scripts/migrate-deck.mjs` utility remain local and are excluded from Git.
Never publish credentials, `.env` files, private notes, dependency folders, or
agent/session artifacts. Required artwork and font/icon notices are tracked;
see `assets/README.md`. Generated `dist/` and `exports/` remain ignored and are
published only as build artifacts. Do not use automatic commit/watch scripts.

## Add another deliverable

Create an HTML entry and its JavaScript/CSS under `app/decks/<id>/` for a deck,
or another folder under `app/` for a prototype or page. Register it in
`app/deliverables.js` with a unique lowercase, hyphenated ID, kind, title,
description, label and entry path relative to `app/`. It then appears in the
workspace and the static build. Entries with `kind: "deck"` also support HTML
export.

Use `/assets/...` for shared asset references and relative module/style imports.
Keep deck resources local for portable exports. Do not import the workspace
toolbar into deck code; Vite adds it to local and published workspace pages,
but keeps it out of standalone HTML exports.

## Checks

```sh
npm test
npm run build
```

The tests cover deliverable registration, preserved slide IDs and self-contained
HTML output. Layout changes should also be reviewed in the browser.
