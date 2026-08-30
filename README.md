# Princess Reyes Valenzuela — Portfolio Website

A simple, static portfolio website built with plain HTML, CSS, and JavaScript
(no frameworks, no build tools) to help Princess attract remote Executive
Assistant, Bookkeeping, and Customer Service work.

## How to view it

No installation needed. Just open `index.html` in a web browser:

- Double-click `index.html`, **or**
- Right-click it → "Open with" → your browser

That's it — everything (styles, scripts, fonts) loads automatically.

> Tip: if you want live-reload while editing, you can use a simple tool like
> the "Live Server" extension in VS Code, but it's optional.

## Folder structure

```
princess-portfolio/
├── index.html                  → all page content and structure
├── style.css                   → all visual styling
├── script.js                   → mobile menu, form validation, animations
├── README.md                   → this file
└── assets/
    ├── images/                 → empty; add a headshot here later if wanted
    └── documents/
        └── Princess_Valenzuela_Resume.pdf   → powers the "Download Resume" button
```

## Making common edits

**Update text content**
Open `index.html` in a text editor and find the section you want to change —
each section is clearly marked with a comment like
`<!-- ============ ABOUT ============ -->`. Edit the text between the HTML
tags directly; you don't need to touch `style.css` or `script.js` for
content changes.

**Update the resume file**
Replace `assets/documents/Princess_Valenzuela_Resume.pdf` with a new PDF
that has the **exact same filename**. If you use a different filename,
update the `href` on the "Download Resume" button in `index.html`
(search for `assets/documents/`).

**Add a photo**
Drop an image into `assets/images/`, then in `index.html` replace the
`.ledger-stamp` block inside the hero section with an `<img>` tag pointing
to it, e.g.:
```html
<img src="assets/images/your-photo.jpg" alt="Princess Reyes Valenzuela" />
```

**Change colors or fonts**
Open `style.css` and look at the `:root { ... }` block at the very top —
all colors and fonts are defined there as variables, so changing one line
updates the whole site.

**Update the contact email**
It appears in two places: the `mailto:` link in `index.html` (Contact
section) and the `CONTACT_EMAIL` variable near the top of `setupContactForm()`
in `script.js`.

## About the contact form

This is a static site — there's no server, so the form can't send email by
itself. When someone submits it, the script validates the fields and then
opens their email app with a pre-filled message addressed to Princess's
email. If you later want messages to send without opening an email app,
you'd connect the form to a free service like Formspree, or a real backend
— that's a separate step beyond plain HTML/CSS/JS.

## Publishing it online (optional, when ready)

Free options that work well for a static site like this:
- **GitHub Pages** — free, good if you're comfortable with Git
- **Netlify** or **Vercel** — drag-and-drop the folder, get a live link in minutes

Any of these will host `index.html`, `style.css`, `script.js`, and the
`assets/` folder exactly as they are — no changes needed.
