# Presentation Timer

## Download and run

No installation is required.

### Windows

1. Download and extract the ZIP.
2. Double-click:

```text
START Presentation Timer.bat
```

The timer opens in your default browser.

You can also open:

```text
00_START_HERE.html
```

### macOS / Linux

Extract the ZIP and open:

```text
00_START_HERE.html
```

or:

```text
index.html
```

---

A browser-based visual presentation timer for talks, Q&A sessions, breaks, and other timed sessions.

This version focuses on a simple runtime view and a visual Edit Mode for building reusable timing templates.

## Features

- Visual timeline editor
- Reusable templates
- Up to 10 templates
- Maximum 5 template buttons per row on desktop
- Count Down / Count Up modes
- Session End and overtime handling
- Alert Bell and Event markers
- Overtime Alert relative to Session End
- Manual Ring button
- Adjustable bell volume
- Fullscreen presentation mode
- Template switching in fullscreen
- English / Japanese interface
- Built-in default templates are localized with the selected language
- Numeric global timer font size
- Dark and light-oriented themes
- Settings saved in the browser with localStorage
- Save / Load settings as JSON
- No server required

## Default templates

### 10 min Talk

- 0:00 — Presentation
- 9:00 — Bell 1 / 1 minute remaining
- 10:00 — Q&A
- 15:00 — Session End
- +3:00 — Overtime Alert

### 30 min Talk

- 0:00 — Presentation
- 25:00 — Bell 1 / 5 minutes remaining
- 29:00 — Bell 2 / 1 minute remaining
- 30:00 — Q&A
- 40:00 — Session End
- +3:00 — Overtime Alert

### Coffee Break

- 0:00 — Coffee Break
- 10:00 — Coffee Break End
- Overtime Alert disabled

## Quick start

1. Open `index.html` in a modern browser.
2. Select a template.
3. Press **Start**.
4. Use **Reset** to return to the beginning.
5. Use **Ring** for a manual bell.
6. Use **Fullscreen** for presentation use.

No installation or build step is required.

## Editing templates

Press **Edit** below the template buttons.

In Edit Mode you can:

- drag Alert Bell and Event markers
- edit marker time, bell count, title, and message in the Schedule table
- move the Session End boundary
- configure an Overtime Alert relative to Session End
- preview bell sounds
- change Count Up / Count Down
- change snap interval
- change manual bell count and bell volume

Press **Save** to leave Edit Mode.

Changes are automatically stored in the browser while editing.

For more detail, see [docs/USER_GUIDE.md](docs/USER_GUIDE.md).

## General Settings

Open **Settings** to configure global options.

Current global options include:

- Theme
- Language
- Timer Font Size (px)
- Save Settings
- Load Settings
- Restore Defaults
- Clear Local Data

The default timer font size is **300 px**.

The font-size setting applies to all templates and is also used by the Edit Mode preview.

## Fullscreen behavior

Fullscreen is intended for live presentation use.

- Template buttons remain visible and selectable.
- Template management controls are hidden.
- The Fullscreen button changes to Exit Fullscreen.
- Template switching remains available.
- Fullscreen cannot be entered while Edit Mode is active.
- The timer keeps the configured Timer Font Size in fullscreen.

## Browser storage

Settings and templates are stored locally in the browser.

This means:

- changes survive page reloads
- different browsers have separate settings
- clearing browser site data may remove saved templates

Use **Save Settings** if you want a backup file.

## GitHub Pages

This repository is designed so that `index.html` is at the repository root.

That means it can be published directly with GitHub Pages without a build step.

See [docs/GITHUB_PAGES.md](docs/GITHUB_PAGES.md).

## Project structure

```text
presentation-timer/
├─ index.html
├─ style.css
├─ app.js
├─ README.md
├─ .gitignore
└─ docs/
   ├─ USER_GUIDE.md
   ├─ TEMPLATE_GUIDE.md
   ├─ GITHUB_PAGES.md
   └─ CHANGELOG.md
```

## Notes

- The application is fully client-side.
- No external server is required for normal use.
- Audio playback may require the first user interaction before a browser allows sound.
- Fullscreen behavior can vary slightly by browser.

## Version

Current packaged version: **v48**

v48 is a documentation / GitHub packaging release based on the v47 application. The timer behavior and visual design are unchanged from v47.
