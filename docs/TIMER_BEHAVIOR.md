# Timer Behavior and Timeline

## Countdown behavior

In **Count Down** mode, the timer counts down toward the next event that is not marked **Skip for Countdown**.

For example:

- Presentation: 0 min
- 1st Bell: 9 min, skipped
- Q&A: 10 min

The main display counts down toward Q&A. At 9 minutes the bell rings and the message changes, but the countdown continues toward 10 minutes.

## Session End automatically defines overtime

There is no separate Overtime switch.

The event marked **Session End** is the scheduled end of the session. When elapsed time reaches it, the timer automatically enters overtime.

For example, if Session End is 15 minutes:

- 14:59 → `00:01`
- 15:00 → `+00:00`
- 16:00 → `+01:00`
- 18:00 → `+03:00`
- 20:00 → `+05:00`

From Session End onward, the title, message, and main timer use the overtime warning style automatically.

Later events do not reset overtime. An OT Alert at 18 minutes can ring and change the title/message, while the main timer still shows `+03:00` because overtime is measured from the 15-minute Session End.

## Count Up mode

In **Count Up** mode, the main display always shows total elapsed time from timer start.

Before Session End, the secondary display can show remaining time until the next countdown target.

After Session End, the secondary display changes to overtime measured from Session End.

Elapsed time never resets when events change.

## Timeline

The timeline is generated automatically from Schedule.

- Normal countdown-target events are displayed as major markers.
- Events marked **Skip for Countdown** are displayed more lightly.
- The timeline ends at the event marked **Session End**.
- Events scheduled after Session End still function, but are not plotted beyond the timeline maximum.

## Optional timeline control

Timeline control can be enabled in **Schedule**. When enabled, the timeline can be used to move the timer position.

## Keyboard shortcuts

- `Space` — Start / Pause
- `R` — Reset
- `F` — Fullscreen
