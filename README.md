# Presentation Timer

**▶ [Open Presentation Timer](https://shy-sgmt.github.io/presentation-timer/)**

A flexible presentation and session timer with fully customizable timed events, bell alerts, countdown targets, overtime notifications, and English/Japanese support.

Instead of using only fixed Presentation and Q&A periods, users can create and arrange their own events such as first bells, Q&A, session end, overtime alerts, discussion periods, breaks, or any other timed cue.

## Features

* Fully customizable timed events
* Add, delete, and reorder events
* Set event time in minutes from timer start
* Set a custom bell count for each event
* Custom title and message for each event
* Skip selected events as countdown targets
* Mark selected events as overtime
* Set a specific event as the session end
* Events after the session end can still trigger without extending the timeline
* Countdown / count-up modes
* Manual bell control
* 4 Hz bell cadence
* English / Japanese interface
* Light / dark theme
* Fullscreen mode
* Dynamic timeline progress bar
* Event markers and bell indicators on the timeline
* Optional timeline dragging control
* Wake Lock support during timing when supported by the browser
* Local settings storage
* Clear saved settings button
* No external audio files required
* Works as a single HTML file

## Default event settings

| Time   | Bell | Skip for Countdown | Title        | Message                  | Overtime | Session End |
| ------ | ---: | :----------------: | ------------ | ------------------------ | :------: | :---------: |
| 0 min  |    0 |                    | Presentation | Presentation in progress |          |             |
| 9 min  |    1 |          ✓         | 1st Bell     | 1 minute remaining       |          |             |
| 10 min |    2 |                    | Q&A          | Q&A time                 |          |             |
| 15 min |    3 |                    | Overtime     | Scheduled time is over   |     ✓    |      ✓      |
| 18 min |    4 |                    | OT Alert     | 3 minutes overtime       |     ✓    |             |

The default configuration therefore represents:

* 10 minutes of presentation time
* A first bell at 9 minutes
* Q&A beginning at 10 minutes
* Scheduled session end at 15 minutes
* An additional overtime alert at 18 minutes

The first bell is marked **Skip for Countdown**, so the main countdown continues toward the Q&A start at 10 minutes instead of changing its target at the 9-minute bell.

## Event settings

Each row in the Event Settings table represents one timed event.

### Time (min)

Specifies when the event occurs, measured from the timer start.

For example:

* `9` = 9 minutes after Start
* `10` = 10 minutes after Start
* `15` = 15 minutes after Start

### Bell count

Specifies how many times the bell rings when the event is reached.

Examples:

* `0` = no bell
* `1` = one bell
* `2` = two bells
* `3` = three bells

Repeated bells use a fixed 4 Hz cadence.

### Skip for Countdown

When checked, the event still occurs normally, but it is ignored as a countdown target.

For example, with the default settings:

* 1st Bell occurs at 9 min
* 1st Bell has **Skip for Countdown** enabled
* Q&A occurs at 10 min

The countdown therefore continues toward Q&A.

At 9 minutes, the bell rings and the message changes to **1 minute remaining**, while the countdown remains based on the 10-minute Q&A event.

This is useful for intermediate alerts that should not divide the main countdown.

### Title

Sets the main title displayed when the event becomes active.

Examples:

* Presentation
* 1st Bell
* Q&A
* Discussion
* Overtime
* Break

### Message

Sets the message displayed below the title.

Examples:

* Presentation in progress
* 1 minute remaining
* Q&A time
* Please finish your discussion
* Scheduled time is over

### Overtime

When checked, the event is treated as an overtime state.

The title, message, and main timer display change to the overtime warning style.

This can be used for events such as:

* Overtime
* OT Alert
* Final Warning

### Session End

Marks the event as the scheduled end of the session.

The selected Session End determines the maximum time displayed on the timeline.

For example, in the default configuration:

* Overtime = 15 min → **Session End**
* OT Alert = 18 min

The timeline therefore ends at **15 min**.

The 18-minute OT Alert still works and its bell can still ring, but it is not shown beyond the end of the timeline.

This keeps overtime alerts separate from the scheduled session duration.

## Adding events

Press **＋ Add Event** to add another event row.

You can create any timing structure you need.

For example:

| Time | Bell | Title              |
| ---- | ---: | ------------------ |
| 0    |    0 | Introduction       |
| 5    |    1 | Results            |
| 10   |    1 | Discussion         |
| 14   |    2 | 1 minute remaining |
| 15   |    3 | Session End        |

Events do not have to be limited to Presentation and Q&A.

They can represent any stage of a talk, seminar, meeting, examination, discussion, or conference session.

## Reordering and deleting events

Use the controls at the right side of each event row:

* `↑` — Move the event up
* `↓` — Move the event down
* `×` — Delete the event

This allows the event list to be arranged freely.

Event timing itself is determined by the **Time (min)** value.

## Countdown mode

In **Count Down** mode, the main timer shows the remaining time until the next event that is not marked **Skip for Countdown**.

For example:

* Presentation starts at 0 min
* 1st Bell at 9 min → Skip for Countdown
* Q&A at 10 min

The timer counts:

`10:00 → 09:59 → ... → 01:00`

At 9 minutes the first bell rings, but the countdown continues:

`01:00 → 00:59 → ... → 00:00`

until Q&A begins.

The secondary display shows elapsed time.

## Count-up mode

In **Count Up** mode, the main display shows the total elapsed time from the beginning of the session.

The secondary display shows the remaining time until the next countdown target when one is available.

This makes it possible to monitor both:

* total elapsed time
* time remaining until the next major event

at the same time.

## Timeline

The timeline is generated automatically from the event settings.

Regular countdown-target events are shown as timeline markers with their times and titles.

Events marked **Skip for Countdown** are displayed more lightly above the timeline so intermediate bells remain visible without becoming major countdown divisions.

The timeline ends at the event marked **Session End**.

Events occurring after Session End continue to function but are not displayed beyond the timeline maximum.

## How to use

1. Open `index.html` in a modern browser.
2. Open **Settings**.
3. Select countdown or count-up mode.
4. Add or edit events as needed.
5. Set bell counts, titles, and messages.
6. Use **Skip for Countdown** for intermediate alerts.
7. Use **Overtime** for events that should display in the warning style.
8. Select the scheduled final event as **Session End**.
9. Press **Start**.
10. Use **Reset** to return to the beginning.
11. Use **Fullscreen** for presentation-room use.
12. Use **Ring** for a manual bell.

## Keyboard shortcuts

* `Space` — Start / Pause
* `R` — Reset
* `F` — Fullscreen

## Bell behavior

The timer synthesizes its bell sound directly in the browser using the Web Audio API.

No MP3 or WAV file is required.

Bell cadence is fixed at 4 Hz, and the number of bell strikes can be configured independently for every event.

Setting the bell count to `0` disables the bell for that event.

## Manual bell

The **Ring** button can be used at any time to ring the bell manually.

The number of manual bell strikes can be configured separately from automatic event bells.

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

* an account
* a backend server
* analytics
* a cloud database

Timer settings are stored locally in the browser when saving is enabled.

## License

This project is released under the **MIT License**.

You are free to use, copy, modify, merge, publish, distribute, sublicense, and reuse this project, including for personal, educational, academic, and commercial purposes, subject to the terms of the MIT License.

See [`LICENSE`](LICENSE) for details.

## Author

Shoya Sugimoto
