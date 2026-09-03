# Publishing with GitHub Pages

This project does not require a build process.

The important point is that `index.html` must be located at the repository root.

## Recommended repository structure

```text
presentation-timer/
├─ index.html
├─ style.css
├─ app.js
├─ README.md
├─ .gitignore
└─ docs/
```

Do not upload a ZIP containing another unnecessary outer folder if you want GitHub Pages to serve the page directly from the repository root.

## Method 1: GitHub website

1. Create a new GitHub repository, for example `presentation-timer`.
2. Open the repository.
3. Choose **Add file → Upload files**.
4. Upload the contents of this package:
   - `index.html`
   - `style.css`
   - `app.js`
   - `README.md`
   - `.gitignore`
   - `docs/`
5. Commit the files.
6. Open **Settings → Pages**.
7. Under **Build and deployment**, select:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/(root)**
8. Save.
9. Wait for GitHub Pages deployment to finish.

The site will normally be available at a URL similar to:

```text
https://YOUR-USERNAME.github.io/presentation-timer/
```

## Method 2: Git command line

From the project directory:

```bash
git init
git add .
git commit -m "Initial Presentation Timer release"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/presentation-timer.git
git push -u origin main
```

Then enable GitHub Pages from:

```text
Settings → Pages → Deploy from a branch → main → /(root)
```

## Updating the site

After editing files:

```bash
git add .
git commit -m "Update Presentation Timer"
git push
```

GitHub Pages will redeploy automatically.

## Common problem: 404 / page not found

Check that the repository actually contains:

```text
/index.html
```

and not only:

```text
/some-folder/index.html
```

when Pages is configured to publish from `/(root)`.

## Local testing

You can usually open `index.html` directly in a browser.

For a local HTTP server, Python can be used:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```
