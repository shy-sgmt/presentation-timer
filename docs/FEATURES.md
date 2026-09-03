# Features and Default Configuration

## Overview

Presentation Timer is a flexible presentation and session timer with customizable timed events, bell alerts, countdown/count-up behavior, automatic overtime after Session End, templates, themes, and English/Japanese support.

Users can create and arrange events such as first/second bells, Q&A, session end, overtime alerts, discussion periods, breaks, or other timed cues.

## Features

- Fully customizable timed events
- Add, delete, and reorder events
- `minutes.seconds` event-time input
- Custom bell count for every event
- Custom title and message for every event
- Skip selected events as countdown targets
- Set exactly one event as Session End
- **Automatic overtime from Session End — no separate Overtime checkbox required**
- Events after Session End can still trigger without extending the timeline
- Countdown / count-up modes
- Manual bell control
- 4 Hz bell cadence
- English / Japanese interface
- Light / Dark / High Contrast / Paper / Matrix / Tokyo Night / Cyberpunk / Solarized themes
- Dark theme by default
- Fullscreen mode
- Dynamic timeline progress bar
- Event markers and bell indicators
- Optional timeline dragging control
- Wake Lock support when available
- Browser-local settings storage
- Settings export/import using JSON files
- PWA installation and offline cache over HTTPS
- No external audio files required
- Downloadable standalone folder version

## Default templates

The application includes three default templates:

- **10 min Talk**
- **30 min Talk**
- **Coffee Break** (10 min)

### 10 min Talk

| Time | Bell | Skip for Countdown | Title | Message | Session End |
|---|---:|:---:|---|---|:---:|
| 0 min | 0 |  | Presentation | Presentation in progress |  |
| 9 min | 1 | ✓ | 1st Bell | 1 minute remaining |  |
| 10 min | 2 |  | Q&A | Q&A time |  |
| 15 min | 3 |  | Session End | Session ended | ✓ |
| 18 min | 4 | ✓ | OT Alert | 3 minutes overtime |  |

This represents 10 minutes of presentation time, Q&A beginning at 10 minutes, a scheduled session end at 15 minutes, and an additional OT Alert at 18 minutes.

At 15 minutes, overtime begins automatically. The 18-minute OT Alert does not create or control overtime; it is simply a later alert event.

### 30 min Talk

- 25 min — 1st Bell (5 minutes remaining)
- 29 min — 2nd Bell (1 minute remaining)
- 30 min — Q&A begins
- 40 min — Session End (10-minute Q&A)

Overtime begins automatically at 40 minutes.

### Coffee Break

The Coffee Break template is intentionally simple:

- 0 min — Coffee Break
- 10 min — Break End / Session End

It has no 1st Bell, 2nd Bell, or OT Alert events. If the break runs beyond 10 minutes, overtime is still computed automatically because the 10-minute event is Session End.

## Bell behavior

The timer synthesizes its bell sound directly in the browser using the Web Audio API. No MP3 or WAV file is required.

Bell cadence is fixed at 4 Hz. Setting bell count to `0` disables the bell for that event.

## Manual bell

The **Ring** button can be used at any time. The number of manual bell strikes can be configured separately in **Schedule**.


## Template and event workflow additions

- Saved templates can be duplicated, up to the 6-template limit.
- Bell volume is configurable, defaults to 100%, and is saved with each template.
- Each event row has a Preview button (▶) to audition its title, message, and bell.
- Switching templates while the timer is running requires confirmation and resets the timer only after approval.
