# Henrique — Resume + Portfolio (React + Vite + Tailwind)

Frontend-only SPA for GitHub Pages. Portfolio items are Markdown files under `public/content/portfolio`.

## Dev

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Add a portfolio item

1. Edit `public/content/portfolio/index.json` and add:
```json
{ "slug": "new-project", "title": "New Project", "summary": "One-liner", "tags": ["Unreal","C++"], "year": 2025 }
```
2. Create `public/content/portfolio/new-project.md` with frontmatter + Markdown body.

## Deploy (GitHub Pages)

Push to `main`. The included workflow builds and deploys to GitHub Pages with correct asset base.
