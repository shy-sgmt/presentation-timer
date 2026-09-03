# Event Settings

Each row in the **Schedule** table represents one timed event.

## Time (min.sec)

Specifies when the event occurs, measured from timer start.

The input uses a `minutes.seconds` format rather than decimal minutes.

Examples:

- `9` = 9 minutes
- `1.30` = 1 minute 30 seconds
- `10` = 10 minutes
- `15` = 15 minutes

The arrow controls change the value by one minute while preserving the seconds component.

## Bell count

Specifies how many times the bell rings when the event is reached.

- `0` = no bell
- `1` = one bell
- `2` = two bells
- `3` = three bells

Repeated bells use a fixed 4 Hz cadence.

## Skip for Countdown

When checked, the event still occurs normally but is ignored as a countdown target.

For example, in the default 10-minute template:

- 1st Bell occurs at 9 min
- Q&A occurs at 10 min
- 1st Bell has **Skip for Countdown** enabled

At 9 minutes the bell rings and the message changes to `1 minute remaining`, while the main countdown continues toward 10 minutes.

The default OT Alert also uses **Skip for Countdown**, so it can ring after Session End without creating a new countdown target.

## Title

Sets the main title displayed when the event becomes active.

Examples:

- Presentation
- 1st Bell
- 2nd Bell
- Q&A
- Discussion
- Session End
- OT Alert

The first event requires a title. For later events, leaving the title blank keeps the previous effective title.

## Message

Sets the message displayed below the title.

Examples:

- Presentation in progress
- 5 minutes remaining
- 1 minute remaining
- Q&A time
- Session ended
- 3 minutes overtime

A blank message displays no message for that event. Messages are not inherited.

## Session End

Marks the scheduled end of the session.

Exactly one event is used as **Session End**. It controls both:

1. the maximum time shown on the timeline, and
2. the moment when overtime begins automatically.

There is no separate **Overtime** checkbox. Once elapsed time reaches Session End, the timer automatically changes to overtime warning style and overtime is calculated from that point.

In the default 10-minute template:

- Session End = 15 min
- OT Alert = 18 min

The timeline ends at 15 minutes. The OT Alert at 18 minutes still works, but it does not extend the timeline or reset overtime.

A Session End event cannot simultaneously be used as a skipped countdown target.

## Events after Session End

Events may be scheduled after Session End. These are useful for alert-only events such as an OT Alert.

They can still:

- ring a bell
- update the title
- update the message

But overtime remains measured from Session End and the timeline remains capped at Session End.

## Adding events

Press **＋ Add Event** to add another event.

Example:

| Time | Bell | Title | Session End |
|---|---:|---|:---:|
| 0 | 0 | Introduction |  |
| 5 | 1 | Results |  |
| 10 | 1 | Discussion |  |
| 14 | 2 | 1 minute remaining |  |
| 15 | 3 | Session End | ✓ |

Events can represent any stage of a talk, seminar, meeting, examination, discussion, break, or conference session.

## Reordering and deleting events

Use the controls on the right side of each event row:

- `↑` — Move the event up
- `↓` — Move the event down
- `×` — Delete the event

Event timing itself is determined by the **Time (min.sec)** value.


## Preview Event

While editing a template, press **▶** on an event row to preview that event. The timer display temporarily shows the event title/message and plays its configured bell count. The normal display returns automatically.

## Bell volume

The **Bell volume** control in Schedule adjusts both automatic event bells and the manual Ring button. The default is **100%**, and the value is stored as part of the template.
