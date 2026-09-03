# User Guide

## 1. Runtime view

The normal runtime view is designed for actual presentations.

The main elements are:

1. Template selector
2. Fullscreen button
3. Current title
4. Current message
5. Large timer
6. Runtime timeline
7. Start / Reset / Ring controls

### Start

Starts or resumes the timer.

### Reset

Returns the active template to 0:00.

### Ring

Plays the manual bell using the currently configured Manual Bell Count and Bell Volume.

## 2. Template selection

Built-in templates are shown at the top.

On desktop, up to five template buttons are placed on one row. Additional templates wrap to a second centered row.

The application supports up to 10 templates.

Built-in templates cannot be deleted. User-created templates can be deleted.

## 3. Edit Mode

Press **Edit** to enter Edit Mode.

While editing:

- runtime Start / Reset / Ring controls are hidden
- Fullscreen cannot be activated
- the visual editing timeline appears
- the Schedule table appears
- template changes are saved automatically

Press **Save** to return to runtime mode.

### Visual timeline

The edit timeline contains:

- Start at 0:00
- Alert Bell markers
- Event markers
- Session End boundary
- Overtime editing area after Session End

Normal Alert Bell and Event markers cannot be placed after Session End.

### Session End

Session End is represented by the right boundary of the main session region.

It is not a normal Event tool.

Dragging Session End changes the duration of the session.

### Overtime Alert

Overtime Alert is relative to Session End.

For example:

- Session End: 15:00
- Overtime Alert: +3:00
- actual alert time: 18:00

If Session End moves, the overtime alert moves with it because the offset remains +3:00.

## 4. Schedule table

The Schedule table is the precise editing interface for markers.

Typical editable fields include:

- Time
- Bell
- Title
- Message
- Preview
- Delete

The GUI timeline and Schedule table represent the same underlying data.

## 5. Count modes

### Count Down

The main timer displays remaining time.

After Session End, the display changes to overtime, for example:

```text
+00:20
+01:35
```

### Count Up

The main timer displays elapsed time.

After Session End, overtime is shown separately.

## 6. General Settings

Open **Settings** in the upper-right area.

### Theme

Select the visual theme.

### Language

Choose English or Japanese.

The built-in default templates are also localized when the language changes.

User-created template text is not automatically translated.

### Timer Font Size (px)

Enter the timer size numerically.

Default:

```text
300
```

The value is global and applies to every template.

The same setting is used in:

- normal runtime view
- fullscreen view
- Edit Mode preview

### Save Settings

Exports your current application settings as a JSON file.

### Load Settings

Loads a previously saved settings JSON file.

### Restore Defaults

Restores built-in timer/template settings.

### Clear Local Data

Clears saved browser data for this timer.

## 7. Fullscreen

Press **Fullscreen** before starting or during runtime mode.

Fullscreen keeps:

- template selection
- current title
- message
- timer
- timeline
- Start / Reset / Ring
- Exit Fullscreen

Template-management actions such as Edit, Add, Duplicate, and Delete are hidden.

You can still switch templates while fullscreen is active.

## 8. Audio

Browsers may block sound until the page has received a user interaction.

If the bell does not play immediately:

1. click or tap somewhere in the app
2. press Ring
3. confirm that Bell Volume is above 0

## 9. Local data

The timer uses browser localStorage.

Your templates are therefore stored on the current browser/device.

For important configurations, use **Save Settings** to keep a backup.
