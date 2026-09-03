# Template Guide

## Built-in templates

The application includes three protected default templates.

### 10 min Talk

Typical structure:

| Time | Type | Meaning |
|---|---|---|
| 0:00 | Event | Presentation starts |
| 9:00 | Alert Bell | 1 minute remaining |
| 10:00 | Event | Q&A starts |
| 15:00 | Session End | Session ends |
| +3:00 | Overtime Alert | 3 minutes overtime |

### 30 min Talk

| Time | Type | Meaning |
|---|---|---|
| 0:00 | Event | Presentation starts |
| 25:00 | Alert Bell | 5 minutes remaining |
| 29:00 | Alert Bell | 1 minute remaining |
| 30:00 | Event | Q&A starts |
| 40:00 | Session End | Session ends |
| +3:00 | Overtime Alert | 3 minutes overtime |

### Coffee Break

| Time | Type | Meaning |
|---|---|---|
| 0:00 | Event | Coffee Break |
| 10:00 | Session End | Break ends |

Overtime Alert is disabled by default.

## Adding templates

Use **Add** to create a new template based on the current state.

The application supports a maximum of 10 templates.

## Duplicating templates

Use **Duplicate** when you want to create a variant of an existing template.

This is useful for:

- 10 min → 12 min talk
- conference-specific bell timing
- chairperson presets
- separate presentation and discussion formats

## Deleting templates

Only user-created templates can be deleted.

Built-in default templates are protected.

## Template switching during editing

While Edit Mode is active, switching templates automatically saves the current template first.

No confirmation dialog is required.

## Template switching during fullscreen

Template selection remains available in fullscreen.

Switching to another template resets the timer for the newly selected template.

## Localization

The built-in templates follow the selected interface language.

Examples in Japanese include:

- Presentation → 発表
- 1st Bell → ベル1
- 2nd Bell → ベル2
- Q&A → 質疑応答
- Session End → セッション終了
- Coffee Break → 休憩

Custom template text is left unchanged.
