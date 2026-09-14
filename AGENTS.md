# Hack 06 project

- This directory is the active hackathon workspace. Edit deliverable sources in
  `app/`, not the preserved `pitch hack 06.html` or generated `exports/` / `dist/`.
- The current deck is `app/decks/mobile-intelligence/`: slide content in
  `index.html`, styling in `styles.css`, navigation in `main.js`.
- Preserve the MAI visual direction and existing slide content unless the user
  asks to change them. `MAI-visual-reference.md` holds the design reference.
- Keep deck resources local and use `/assets/...` references. HTML exports must
  work directly from disk with images, fonts and navigation included.
- Register new deliverables in `app/deliverables.js`. Keep IDs unique and use
  lowercase letters, digits and hyphens.
- `npm run dev` serves a live preview at http://127.0.0.1:5173. Reuse an existing
  running server instead of starting another one.
- `npm run export` creates self-contained HTML snapshots. The original HTML is
  retained only as a migration backup; future changes belong in the project.
- Use `npm test` and `npm run build` for project checks, plus targeted browser
  rendering for layout changes. Do not add unrelated frameworks or rewrite the
  deck's established styling during routine edits.

## Authorized GitHub synchronization

- Remote: `https://github.com/ranjithquest/hack06.git`; branch: `main`. The user
  authorized syncing requested project changes and GitHub deployment. Commit
  reviewed changes and push `origin main`; each push runs the Pages workflow.
  Do not create a watcher that commits every file change.
- The owner explicitly made the repository public on 2026-09-14. Preserve that
  chosen visibility; never change repository visibility or broad account
  settings as an automatic deployment workaround.
- Pages is enabled with GitHub Actions as its source (`build_type: "workflow"`)
  and HTTPS enforced. The earlier private-repository plan restriction no longer
  applies. The site path is `https://ranjithquest.github.io/hack06/`.
- Use `npm test` and `npm run build` before publishing. The build includes
  self-contained deck downloads in `dist/exports/`. Verify the Actions deployment
  result and its actual site URL; never report a queued/failed job as deployed.
- On this machine, the saved personal GitHub account is `ranjithquest`; another
  account may be globally active. Scope authentication to the process:
  `GH_TOKEN="$(gh auth token --hostname github.com --user ranjithquest)"`,
  then `export GH_TOKEN`. Never print the token or switch global authentication.
  For HTTPS Git use
  `git -c credential.helper= -c 'credential.helper=!gh auth git-credential' push origin main`
  under that same environment. Never put tokens in remote URLs or Git config.
- Review `git status` and stage explicit paths, not `git add .`. Keep local
  conversations, raw research, reference presentations, private notes, `.env`,
  credentials, agent state, the original HTML backup, and the migration utility
  out of Git. Include newly required assets with their source/license notices.
- Preserve concurrent user edits. Never reset, force-push, overwrite slides, or
  stop the running preview as part of synchronization.
- Include these commit trailers:
  `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>` and
  `Copilot-Session: ccbc53ee-b25b-4e3e-9701-b40634618378`.
