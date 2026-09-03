# Presentation Timer

**▶ [Open Presentation Timer](https://shy-sgmt.github.io/presentation-timer/)**

A flexible presentation and session timer with customizable events, bell alerts, countdown/count-up behavior, automatic overtime after Session End, templates, themes, and English/Japanese support.

## Quick start

### Use in your browser
Open the link above. No installation is required.

### Install as an app (PWA)
On supported browsers, open the web version and use **Settings > General > Install App** when the option appears. The installed version can work offline after the app files have been cached.

### Downloaded / standalone version
Download and extract the entire ZIP. Keep the folder structure intact.

**Windows:** double-click **`START Presentation Timer.bat`**  
**macOS / other systems:** double-click **`00_START_HERE.html`**

Do not move only `index.html`; the CSS and JavaScript files are required.

## Main features

- Customizable timed events, titles, messages, and bell counts
- Add, delete, and reorder events
- Skip alert-only events as countdown targets
- Set one event as **Session End**
- **Overtime starts automatically when Session End is reached**
- Events after Session End can still ring bells and update the title/message
- Count Down / Count Up modes
- Templates: **10 min Talk / 30 min Talk / Coffee Break** by default
- Themes: Light / Dark / High Contrast / Paper / Matrix / Tokyo Night / Cyberpunk / Solarized
- **Dark is the default theme**
- English / Japanese interface
- Dynamic timeline and optional timeline control
- Fullscreen, manual bell, keyboard shortcuts, and Wake Lock support
- Browser-local auto-save
- Settings export/import using JSON files
- PWA installation and offline cache when served over HTTPS

## Settings

On wider screens, Settings are shown as three columns:

**General | Templates | Schedule**

On smaller screens they automatically stack to fit the display.

- **General** — theme, language, browser auto-save, settings file save/load, app installation, restore/clear local data
- **Templates** — edit, save, add, or delete timer templates (up to 6)
- **Schedule** — count mode, timeline control, manual bell count, and timed events

## Default templates

### 10 min Talk
The original 10-minute talk timing is retained:

- 9 min — 1st Bell (1 minute remaining)
- 10 min — Q&A begins
- 15 min — Session End
- 18 min — OT Alert

### 30 min Talk

- 25 min — 1st Bell (5 minutes remaining)
- 29 min — 2nd Bell (1 minute remaining)
- 30 min — Q&A begins
- 40 min — Session End (10-minute Q&A)

### Coffee Break
A simple 10-minute break:

- 0 min — Coffee Break starts
- 10 min — Break End

There are no 1st Bell or overtime-alert events in the Coffee Break template.

## Automatic overtime

There is no separate **Overtime** checkbox in Schedule.

The event marked **Session End** defines the scheduled end of the session. As soon as the timer reaches that time, overtime is determined automatically:

- Count Down switches to `+00:00`, `+00:01`, ...
- Count Up continues showing elapsed time and shows overtime as the secondary value
- The title, message, and main timer use the overtime warning style automatically

Later events such as an OT Alert can still ring or change the message, but overtime always remains measured from Session End.

### Useful editing and safety tools

- **Duplicate Template** — copy any saved template and then edit the copy. Up to 6 templates can be stored.
- **Bell Volume** — adjust the synthesized bell level for each template.
- **Preview Event** — use the ▶ button in an event row to preview its title, message, and bell before saving the template.
- **Safe template switching** — if the timer is running, switching to another template asks for confirmation before resetting the timer.

## Documentation

Detailed behavior and configuration are separated into the `docs/` folder:

- [Features and defaults](docs/FEATURES.md)
- [Event settings](docs/EVENT_SETTINGS.md)
- [Timer behavior and timeline](docs/TIMER_BEHAVIOR.md)
- [Saving, standalone use, PWA, and privacy](docs/SAVING_AND_OFFLINE.md)

## Project structure

```text
presentation-timer/
├─ START Presentation Timer.bat
├─ 00_START_HERE.html
├─ README.md
├─ LICENSE
├─ index.html
├─ manifest.webmanifest
├─ service-worker.js
├─ css/
│  ├─ main.css
│  └─ themes.css
├─ js/
│  ├─ app.js
│  └─ pwa.js
├─ icons/
│  ├─ icon-192.png
│  └─ icon-512.png
└─ docs/
   ├─ FEATURES.md
   ├─ EVENT_SETTINGS.md
   ├─ TIMER_BEHAVIOR.md
   └─ SAVING_AND_OFFLINE.md
```

## Restore Defaults vs Clear Local Data

**Restore Defaults** restores the built-in timer templates and settings while preserving the current theme and language.

**Clear Local Data** removes Presentation Timer data stored in the current browser, including saved theme and templates, then reloads the built-in defaults with **Dark** theme.

## License

Released under the **MIT License**. See [LICENSE](LICENSE).

## Author

Shoya Sugimoto
