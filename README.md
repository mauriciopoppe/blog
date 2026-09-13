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
│   │   ├── partials     # Fragments included in the base layouts
│   │   └── shortcodes   # Custom shortcodes (see hugo for more info)
│   └── static           # Static content
└── src
    ├── main             # Shared browser runtime and site styles
    │   └── css          # The styles of the app
    └── tools            # Bun/Node CLI tools and data importers
```

Standalone browser modules live in `site/static/js`. They are loaded directly
with native `<script type="module">` tags and do not go through Webpack.

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
- `site/layouts/baseof.html` has a global function that
  checks if a theme is defined in local storage, if so then it sets
  that value in the `html` dataset activating the css variables.

*How to write classnames using a theme?*

Example: `hover:light:tw-bg-primary`, for more info
read the https://github.com/L-Blondy/tw-colors and the
generated css file.

### Choosing a code location

- Put shared site browser code in `src/main`. It is bundled by Webpack and can
  import npm packages and CSS.
- Put a self-contained browser app in `site/static/js`. Load it with a native
  module script and use URL imports for external ESM dependencies.
- Put Bun/Node command-line workflows, publishing helpers, and data importers
  in `src/tools`. These run during development or publishing and are never
  loaded by the browser.

The Webpack bundle is still responsible for `src/main`. Its entrypoint metadata
is written to `site/data/webpackAssets.json` and consumed by
`site/layouts/_partials/webpack-script.html`.

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

- create the shared site bundle with webpack, read `webpack.common.js`, write the output to `dist/`
- build the static files, write the output to `dist/`

Manual steps in Netlify (setup done only once)

- Configure the DNS redirects
- Configure the site root directory to `dist/`

2015 - Present
