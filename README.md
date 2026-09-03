# Presentation Timer

**▶ [Open Presentation Timer](https://shy-sgmt.github.io/presentation-timer/)**

A flexible presentation and session timer with customizable timed events, bell alerts, countdown behavior, overtime notifications, and English/Japanese support.

Users can freely create and arrange events such as first bells, Q&A, session end, overtime alerts, discussion periods, breaks, or any other timed cue.

## Features

- Fully customizable timed events
- Add, delete, and reorder events
- Set event time in minutes from timer start
- Set a custom bell count for each event
- Custom title and message for each event
- Skip selected events as countdown targets
- Mark selected events as overtime
- Set one event as the session end
- Events after the session end can still trigger without extending the timeline
- Countdown / count-up modes
- Manual bell control
- 4 Hz bell cadence
- English / Japanese interface
- Light / dark theme
- Fullscreen mode
- Dynamic timeline progress bar
- Event markers and bell indicators
- Optional timeline dragging control
- Wake Lock support during timing when supported by the browser
- Local settings storage
- Clear saved settings button
- No external audio files required
- Works as a single HTML file

## Default event settings

| Time | Bell | Skip for Countdown | Title | Message | Overtime | Session End |
|---|---:|:---:|---|---|:---:|:---:|
| 0 min | 0 |  | Presentation | Presentation in progress |  |  |
| 9 min | 1 | ✓ | 1st Bell | 1 minute remaining |  |  |
| 10 min | 2 |  | Q&A | Q&A time |  |  |
| 15 min | 3 |  | Overtime | Scheduled time is over | ✓ | ✓ |
| 18 min | 4 | ✓ | OT Alert | 3 minutes overtime | ✓ |  |

The default configuration represents:

- 10 minutes of presentation time
- A first bell at 9 minutes
- Q&A beginning at 10 minutes
- Scheduled session end at 15 minutes
- An additional overtime alert at 18 minutes

The 1st Bell and OT Alert are marked **Skip for Countdown**, so they act as alert events without becoming countdown targets.

## Event settings

Each row in the Event Settings table represents one timed event.

### Time (min)

Specifies when the event occurs, measured from the timer start.

Examples:

- `9` = 9 minutes after Start
- `10` = 10 minutes after Start
- `15` = 15 minutes after Start

### Bell count

Specifies how many times the bell rings when the event is reached.

Examples:

- `0` = no bell
- `1` = one bell
- `2` = two bells
- `3` = three bells

Repeated bells use a fixed 4 Hz cadence.

### Skip for Countdown

When checked, the event still occurs normally but is ignored as a countdown target.

For example, in the default configuration:

- 1st Bell occurs at 9 min
- Q&A occurs at 10 min
- 1st Bell has **Skip for Countdown** enabled

The countdown therefore continues toward Q&A.

At 9 minutes, the bell rings and the message changes to:

`1 minute remaining`

while the countdown continues toward 10 minutes.

The default OT Alert is also skipped for countdown purposes. It can still ring and change the title/message, but it does not become a new countdown destination.

This is useful for intermediate alerts and overtime warnings.

### Title

Sets the main title displayed when the event becomes active.

Examples:

- Presentation
- 1st Bell
- Q&A
- Discussion
- Overtime
- OT Alert

### Message

Sets the message displayed below the title.

Examples:

- Presentation in progress
- 1 minute remaining
- Q&A time
- Scheduled time is over
- 3 minutes overtime

### Overtime

When checked, the event is displayed using the overtime warning style.

The title, message, and main timer display become red.

This is useful for:

- Overtime
- OT Alert
- Final Warning

### Session End

Marks the scheduled end of the session.

The event selected as **Session End** determines the maximum time shown on the timeline.

In the default configuration:

- Session End = 15 min
- OT Alert = 18 min

The timeline therefore ends at **15 min**.

The OT Alert at 18 minutes still works, but it is not shown beyond the end of the timeline.

## Countdown behavior

In **Count Down** mode, the timer counts down toward the next event that is not marked **Skip for Countdown**.

For example:

- Presentation: 0 min
- 1st Bell: 9 min, skipped
- Q&A: 10 min

The main display counts down toward Q&A:

`10:00 → 09:59 → ... → 01:00`

At 9 minutes the first bell rings, but the timer continues:

`01:00 → 00:59 → ... → 00:00`

until Q&A begins.

### After Session End

Once the Session End is reached, countdown mode changes automatically to overtime count-up.

For example, if Session End is 15 minutes:

- 14:59 → `00:01`
- 15:00 → `+00:00`
- 16:00 → `+01:00`
- 18:00 → `+03:00`
- 20:00 → `+05:00`

The overtime count continues from Session End even if later alert events occur.

For example, the OT Alert at 18 minutes may ring and change the title/message, but the main timer continues showing the total overtime from the 15-minute Session End.

## Count-up mode

In **Count Up** mode, the main display shows the total elapsed time from the start of the session.

The secondary display shows the remaining time until the next countdown target when available.

For example:

- Main display: total elapsed time
- Secondary display: remaining time until Q&A or Session End

Elapsed time does not reset when events change.

## Timeline

The timeline is generated automatically from the event settings.

Normal countdown-target events are displayed as major timeline markers.

Events marked **Skip for Countdown** are displayed more lightly above the timeline.

This allows intermediate bells to remain visible without becoming major countdown divisions.

The timeline ends at the event marked **Session End**.

Events occurring after Session End continue to function but are not displayed beyond the timeline maximum.

## Adding events

Press **＋ Add Event** to add another event.

You can create any timing structure you need.

Example:

| Time | Bell | Title |
|---|---:|---|
| 0 | 0 | Introduction |
| 5 | 1 | Results |
| 10 | 1 | Discussion |
| 14 | 2 | 1 minute remaining |
| 15 | 3 | Session End |

Events are not limited to Presentation and Q&A.

They can represent any stage of a talk, seminar, meeting, examination, discussion, or conference session.

## Reordering and deleting events

Use the controls on the right side of each event row:

- `↑` — Move the event up
- `↓` — Move the event down
- `×` — Delete the event

Event timing itself is determined by the **Time (min)** value.

## How to use

1. Open `index.html` in a modern browser.
2. Open **Settings**.
3. Select Count Down or Count Up mode.
4. Add or edit events as needed.
5. Set event times and bell counts.
6. Enter titles and messages.
7. Use **Skip for Countdown** for alert-only events.
8. Use **Overtime** for warning-style events.
9. Select the scheduled final event as **Session End**.
10. Press **Start**.
11. Use **Reset** to return to the beginning.
12. Use **Fullscreen** for presentation-room use.
13. Use **Ring** for a manual bell.

## Keyboard shortcuts

- `Space` — Start / Pause
- `R` — Reset
- `F` — Fullscreen

## Bell behavior

The timer synthesizes its bell sound directly in the browser using the Web Audio API.

No MP3 or WAV file is required.

Bell cadence is fixed at 4 Hz.

The number of bell strikes can be configured independently for every event.

Setting the bell count to `0` disables the bell for that event.

## Manual bell

The **Ring** button can be used at any time to ring the bell manually.

The number of manual bell strikes can be configured separately.

## Saved settings

When **Save settings** is enabled, timer preferences and event settings are stored in the browser using `localStorage`.

Saved data remains in the local browser and is not uploaded to a server.

Use **Clear saved settings** to remove stored preferences and restore the default configuration.

## Offline use

The timer is designed to work without an internet connection after the HTML file is available locally.

You can save `index.html` and open it directly in Chrome, Edge, Firefox, or another modern browser.

No backend server, database, or external audio file is required.

## Privacy

This project does not require:

- an account
- a backend server
- analytics
- a cloud database

Timer settings are stored locally in the browser when saving is enabled.

## License

This project is released under the **MIT License**.

You are free to use, copy, modify, merge, publish, distribute, sublicense, and reuse this project, including for personal, educational, academic, and commercial purposes, subject to the terms of the MIT License.

See [`LICENSE`](LICENSE) for details.

## Author

Shoya Sugimoto
