# Blog

[![Netlify Status](https://api.netlify.com/api/v1/badges/255139b6-5e24-4e50-ae6a-1dcf7531befd/deploy-status)](https://app.netlify.com/sites/doctor-stella-56144/deploys)

## Tech

- Hugo (static pages)
- Webpack (tooling)
- d3, React (browser)

## Development

### Code structure



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
