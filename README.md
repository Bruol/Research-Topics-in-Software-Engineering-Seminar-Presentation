# RTSE SICA Presentation

Vite + React slide deck for presenting "A Self-Improving Coding Agent" with the visual language adapted from the existing `presentation-standalone` template.

## Commands

Install dependencies:

```bash
bun install
```

Start the Vite development server:

```bash
bun dev
```

Preview the production build:

```bash
bun start
```

Build the static presentation bundle:

```bash
bun run build
```

Export the presentation as a PDF slide deck with Chromium:

```bash
bun run export:pdf
```

The generated PDF is written to `exports/sica-rtse-slides.pdf`.

## Notes

- Built with Bun, Vite, React, and Tailwind CSS v4.
- Uses Playwright Chromium for PDF export.
- Fonts and image assets are copied into `src/assets/` so the deck builds as a self-contained app.
