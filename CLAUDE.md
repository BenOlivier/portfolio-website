# Portfolio Website

Ben Olivier's product design portfolio — a multi-page site with interactive 3D experiences.

## Commands

- `npm run dev` — Start dev server (auto-detects available port from 8080)
- `npm run build` — Production build to `dist/`

## Tech Stack

Webpack 5, Three.js, GSAP, vanilla JS with Web Components, CSS (no preprocessor), Netlify forms for contact page.

## Project Structure

```
src/
  html/       7 pages: index, about, work, meta, litho, customuse, contact
  css/        One CSS file per page/component
  js/         Entry point: app.js — routes by body class
    components/   Web Components: <header-component>, <footer-component>
  three/      Three.js scenes
    scenes/homepage/   3D hero on index page
    scenes/litho/      Interactive 3D on litho page
    utils/             Shared 3D utilities (resources, sizes, time, events)
static/       Copied verbatim to dist/ (images, models, icons, PDFs)
bundler/      Webpack configs (common, dev, prod)
```

## Key Conventions

- **Page routing**: `app.js` conditionally loads Three.js scenes based on body class (`.index` → homepage scene, `.litho` → litho scene)
- **CSS**: One file per page/component, imported in `app.js`
- **Web Components**: Header and footer are custom elements shared across all pages
- **HTML**: Each page is a separate Webpack HtmlWebpackPlugin entry
- **ESLint**: Google style, Allman braces, 120-char line limit
- **Assets**: Static files in `static/`, bundled assets imported in JS/CSS
