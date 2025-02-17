# Blog

[![Netlify Status](https://api.netlify.com/api/v1/badges/255139b6-5e24-4e50-ae6a-1dcf7531befd/deploy-status)](https://app.netlify.com/sites/doctor-stella-56144/deploys)

## Tech

- Hugo (static site generator)
- Webpack (build tool for JS scripts)
- d3, React (client side script libraries)
- Bun (js runtime)

## Development

### Code structure

Generated with `tree --gitignore -L 3 -I dist/ -d .`

```
.
├── site
│   ├── config
│   │   ├── _default     # Hugo config
│   │   └── development  # Hugo config overrides for development
│   ├── content
│   │   ├── notes        # Blogposts
│   │   └── sandbox      # Sandbox pages
│   ├── layouts
│   │   ├── _default     # Base layouts
│   │   ├── partials     # Fragments included in the base layouts
│   │   └── shortcodes   # Custom shortcodes (see hugo for more info)
│   └── static           # Static content
└── src
    ├── jukebox          # The easter egg page
    ├── main             # Animations, controls sidebars, header, footer
    │   └── css          # The styles of the app
    ├── sunset           # Footer animation
    ├── util             # Shared utilities
    └── voronoi          # Main page and header animation
```

The graph showing how partials are used:

<img src="https://docs.google.com/drawings/d/e/2PACX-1vTti70eH65cmY6otoiXu8f96McpHtIVEvQnLW3hiLFkBjv1NpNyg27yCVL3A0-GgNwa_qk9QIiqszNT/pub?w=1411&amp;h=703">

[Edit the diagram above](https://docs.google.com/drawings/d/1tg2ZI5fDStfcnnmrBU2YYk24eVCSSb9jhGhyRSLeHjg/edit)

### Themes

I use tailwind with two themes, the flow is as follows:

- `src/main/css/themes/` defines CSS variables on each theme.
- `src/main/css/main.css` imports the theme files, this file
  is referenced from `src/main/index.ts`.
- `tailwind.config.js` uses the module tw-colors as a tailwind
  plugin to create light/dark CSS rules based on special
  prefixed classes.
- `site/layout/_default/baseof.html` has a global function that
  checks if a theme is defined in local storage, if so then it sets
  that value in the `html` dataset activating the css variables.

*How to write classnames using a theme?*

Example: `hover:light:tw-bg-primary`, for more info
read the https://github.com/L-Blondy/tw-colors and the
generated css file.

### Bundled scripts

Build strategy: create multiple webpack library outputs, export metadata about the generated
assets through the AssetsPlugin to `site/data/webpackAssets.json`, later when a page
is rendered have hugo read the json file and decide the urls to use in the script tag.

To create a new global script:

- create an entrypoint e.g. `src/<app>/index.js`
- add it to `webpack.config.common.js`
- create the partial that injects the script, create `site/layouts/partials/scripts/<app>.html`
  similar to other files in the same directory
- use it in the desired page through `{{ partial "scripts/learn-french.html" . }}`
- restart the server

How does it work?

- webpack.config.common.js is configured to emit metadata about the entrypoints
  to site/data/webpackAssets.json
- when the partial `site/layouts/partials/webpack-script.html` is used it'll
  create a `<script>` tag with a src url equal taken from `webpackAssets.json` (mapped
  using the `id` sent to `webpack-script.html`)
- NOTE: in production the behavior is to embed the contents of the script directly
  instead of through a `<script src="">` tag.

## Local development

Install dependencies

```sh
brew install hugo
bun i
```

Start web server

```sh
bun start
```

Sandbox pages:
- http://localhost:3000/sandbox/sunset
- http://localhost:3000/sandbox/jukebox

### Prod like server

```bash
brew install mkcert
# Generate the certs
mkcert localhost 127.0.0.1 ::1
# Install the certs into the system
mkcert -install
```

Server:

```bash
bun run build
bun run serve:prod
```

### Building for prod

```sh
bun run build
```

Steps (from `package.json`):

- build the sidebar html fragment with the `sitemap-tree-generator.js` script
- create the site scripts with webpack, read `webpack.common.js`, write the output to `dist/`
- build the static files, write the output to `dist/`

Manual steps in Netlify (setup done only once)

- Configure the DNS redirects
- Configure the site root directory to `dist/`

2015 - Present
