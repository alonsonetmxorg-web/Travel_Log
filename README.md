# 20 Days, Berlin to Mustang

A little website for while I'm in Nepal. One day unlocks every midnight (Berlin time).

## Put it online (GitHub Pages, free)

1. Go to https://github.com/new → name it e.g. `nepal-log` → **Create repository**.
2. Click **uploading an existing file**, drag in everything from this folder
   (`index.html`, `style.css`, `app.js`, `days.js`, `README.md`, the `assets` folder) → **Commit changes**.
3. Repo **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main`, folder `/ (root)` → **Save**.
4. After ~1 minute the site is live at `https://<your-username>.github.io/nepal-log/`. Send her that link.

## Fill in a day

1. Put files in `assets/photos/` and `assets/audio/` (e.g. `day03.jpg`, `day03.m4a`).
2. Open `days.js` and fill in that day's `{ }` — the example at the top shows every field.
3. Commit. The site updates in about a minute.

You can do this from your phone in the GitHub app or github.com while travelling.

## Settings

- **Start date** → `startDate` in `days.js` (Day 1 opens that day).
- **See everything yourself** → add `?preview` to the link: `.../nepal-log/?preview`. Don't send her that one.

## Good to know

- The lock is a gentle one: it's checked in her browser, so someone who opens the source code could peek. It's a surprise box, not a safe.
- A public repo means anyone with the link can see it. For a private repo, GitHub Pages needs a paid plan — or just keep the link between the two of you.
- Keep photos under ~1 MB (resize to ~1200 px wide) and voice notes as `.m4a`/`.mp3` so it loads fast on her phone.
