# Blog

[![Netlify Status](https://api.netlify.com/api/v1/badges/255139b6-5e24-4e50-ae6a-1dcf7531befd/deploy-status)](https://app.netlify.com/sites/doctor-stella-56144/deploys)

## Tech

- Hugo (static pages)
- Webpack (tooling)
- d3, React (browser)

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
    │   ├── sass         # The styles of the app
    │   ├── theme-dark   # The definition of the dark theme
    │   └── theme-light  # The definition of the light theme
    ├── sunset           # Footer animation
    ├── util             # Shared utilities
    └── voronoi          # Main page and header animation
```

### Themes

I use bulma and bulma-css-vars with two themes, the flow is as follows:

- layout:
  - `src/main/colors.js` defines anything related with colors
  - `src/main/theme-dark` has bulma-css-vars config to generated the dark theme
  - `src/main/theme-light` has bulma-css-vars config to generated the light theme
- `node src/util/bulma-css-vars-generator.js` runs bulma-css-vars with 
  the two configurations, then some replacements are done in the generated
  code
  - in `src/main/sass/bulma-generated/generated-bulma-vars-${theme}.sass`
    I make the css variables scoped to `html[data-theme=${theme}]`
- Finally `site/layout/_default/baseof.html` has a global function that
  checks if a theme is defined in local storage, if so then it sets
  that value in the `html` dataset activating the css variables.

Drawbacks:

- Changes to `src/main/colors.js` in the theme colors require running `npm start` again,
  the reason is that the CSS variables are generated with these JS values.

### Installation

```sh
brew install hugo
npm i
```

### Local development

```sh
npm start
```

Sandbox pages:
- http://localhost:3000/sandbox/sunset
- http://localhost:3000/sandbox/jukbox

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
npm run build
npm run serve:prod
```

### Building for prod

```sh
npm run build
```

Steps (from `package.json`):

- build the sidebar html fragment with the `sitemap-tree-generator.js` script
- interpolate the application colors with the `palette-generator` script, also transform the JS colors to css vars using `bulma-css-vars`
- create the site scripts with webpack, read `webpack.common.js`, write the output to `dist/`
- build the static files, write the output to `dist/`

Manual steps in Netlify (setup done only once)

- Configure the DNS redirects
- Configure the site root directory to `dist/`

2015 - Present
