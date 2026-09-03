# Saving, Standalone Use, PWA, and Privacy

## Browser auto-save

When browser auto-save is enabled, timer preferences, templates, and event settings are stored in the browser using `localStorage`.

This storage is local to that browser/profile and is not uploaded to a server.

Use **Restore Defaults** to restore the application's default templates and settings. Theme and language selections are preserved when restoring defaults.

## Save Settings

Use **Save Settings** to export the timer configuration as a JSON file.

The exported settings can include the application's templates and their event configurations, count mode, timeline control, manual bell count, theme, and language.

Depending on browser support, the app attempts to use an available save destination picker, a share sheet, or a normal file download.

## Load Settings

Use **Load Settings** to select a previously exported JSON settings file and restore the saved configuration.

This makes it possible to move settings between browsers or computers without relying on `localStorage`.

## Standalone / downloaded use

Download and extract the entire project folder.

On Windows, double-click:

**`START Presentation Timer.bat`**

On macOS or other systems, double-click:

**`00_START_HERE.html`**

Keep the folder structure intact. The application uses separate HTML, CSS, and JavaScript files, so moving only `index.html` will break the standalone version.

The timer itself, themes, templates, schedule, bells, and browser-local settings are designed to work from the downloaded folder.

Some browser-restricted features may behave differently when opened through `file://`. In particular, PWA installation, Service Worker caching, Wake Lock, and some file-save APIs work more reliably when the application is served over HTTPS.

## PWA / offline web app

When served over HTTPS, such as through GitHub Pages, the application registers a Service Worker and can cache its application files for offline use.

On supported browsers, **Settings > General > Install App** appears when installation is available. Other browsers may provide **Install app** or **Add to Home Screen** in their own browser menu.

The same project can therefore be used as:

- a normal GitHub Pages website
- an installable PWA
- a downloaded standalone folder

## Privacy

This project does not require:

- an account
- a backend server
- analytics
- a cloud database

Browser-saved settings remain local to the browser. Exported JSON settings files are saved or shared only through actions initiated by the user.


### Clear Local Data

Use **Clear Local Data** in **General** to remove all Presentation Timer settings stored in the current browser, including the saved theme and templates. After clearing, the app reloads with the built-in defaults and **Dark** theme. **Restore Defaults** is different: it restores timer defaults while preserving the current theme and language.
