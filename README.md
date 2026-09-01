# Presentation Timer

A lightweight, offline-friendly presentation timer for talks, seminars, and conference sessions.

## Features

- Presentation and Q&A timing
- First bell, Q&A bell, overtime bell, and overtime alert
- Custom bell counts
- Manual bell control
- 4 Hz bell cadence
- Countdown / count-up modes
- English / Japanese interface
- Light / dark theme
- Fullscreen mode
- Timeline progress bar
- Optional timeline dragging control
- Visual warning near the end of the presentation and session
- Wake Lock support during timing (when supported by the browser)
- Local settings storage with a clear/reset button
- No external audio files required
- Works as a single HTML file

## Default settings

- Language: English
- Presentation: 10 min
- Q&A: 5 min
- 1st Bell: 9 min
- Overtime Alert: 3 min after overtime

## How to use

1. Open `index.html` in a modern browser.
2. Open **Settings** and adjust the timer if needed.
3. Press **Start** to begin.
4. Use **Reset** to return to the beginning.
5. Use **Fullscreen** for presentation-room use.
6. Use **Ring** for a manual bell.

### Keyboard shortcuts

- `Space` — Start / Pause
- `R` — Reset
- `F` — Fullscreen

## Bell behavior

The timer synthesizes a bell sound in the browser using the Web Audio API. No MP3 or WAV file is required.

Bell cadence is fixed at 4 Hz. Bell counts can be configured independently.

## Saved settings

When **Save settings** is enabled, timer preferences are stored in the browser using `localStorage`.

The data stays in the local browser and is not uploaded to a server.

Use **Clear saved settings** in Basic settings to remove the saved timer preferences and return to the default configuration.

## Offline use

This timer is designed to work without an internet connection after the HTML file is available locally.

You can download `index.html` and open it directly in Chrome, Edge, Firefox, or another modern browser.


## Privacy

This project does not require an account, backend server, analytics service, or cloud database.

Saved timer settings remain in the browser's local storage.

## License

This project is released under the **MIT License**.

You are free to use, copy, modify, merge, publish, distribute, sublicense, and reuse this project, including for personal, educational, academic, and commercial purposes, subject to the terms of the MIT License.

See [`LICENSE`](LICENSE) for details.

## Author

Shoya Sugimoto
