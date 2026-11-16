# Soon family

A phone-first family tree. Plain HTML, CSS and JavaScript, no build step.

## Run it
Open `index.html`, or serve the folder (`start-server.bat`, `python server.py`, or any static server). The offline/install (PWA) features only work over http/https.

## What it does
- **Family**: pick yourself ("This is me") and see everyone relative to you: parents, partner, brothers and sisters, children.
- **Kinship**: English and Chinese terms with pinyin (哥哥, 姨妈, 表哥, 外公…). Set a custom "what to call them" on any profile to override.
- **People**: search, filter by branch, sort by tree order, age or name.
- **Tree**: drawn as a real tree, with the founders at the root and one coloured limb per branch of the family. Pan, pinch-zoom, tap +N buds to grow a branch, show one branch, print.
- **Birthdays**: upcoming list and calendar (.ics) export. Birthdays of `01/01/yyyy` count as "year only" and are skipped.
- **Quiz**: a side feature, guess how people are related to you.
- **Edit**: add child or spouse, edit, remove (with Undo). The founding couple cannot be removed.
- **Photos**: on by default (Photos toggle in the top bar). Photos live in `Family pics/`. Faces are centred using the focus points in `photos.js`; fix any photo in Edit by dragging it and using the zoom slider.
- Light, dark or auto theme.

## Your data
Everything is stored only in this browser (`localStorage`). Edits are not shared between devices. Use **Menu → Back up** to export a JSON file and **Restore** to import it. Children are assumed to be listed oldest first.

## Files
- `photos.js`: face position for each photo in `Family pics`
- `core.js`: data, tree logic, kinship, editing (no DOM)
- `app.js`: interface
- `styles.css`, `index.html`, `manifest.webmanifest`, `sw.js`, `icon.svg`

## Tests
`node tests/core.test.js`, or open `test-runner.html` over http.
