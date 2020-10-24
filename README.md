# Blog

[![Netlify Status](https://api.netlify.com/api/v1/badges/255139b6-5e24-4e50-ae6a-1dcf7531befd/deploy-status)](https://app.netlify.com/sites/doctor-stella-56144/deploys)

## Installation

```sh
brew install hugo
npm i
```

## Development

```sh
npm start
```

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

## Production

```sh
npm run build
```

Steps (from `package.json`):

- build the sidebar html fragment with the `flatten-render-tree.js` script
- interpolate the application colors with the `palette-generator` script, also transform the JS colors to css vars using `bulma-css-vars`
- create the site scripts with webpack, read `webpack.common.js`, write the output to `dist/`
- build the static files, write the output to `dist/`

Manual steps in Netlify (setup done only once)

- Configure the DNS redirects
- Configure the site root directory to `dist/`

## Tech

- Hugo (static pages)
- Webpack (tooling)
- d3, React (browser)

## Upgrade notes

From mmark to goldmark:

- replace extension from `mmark` to `md`

```text
find . -depth -name "*.mmark" -exec sh -c 'mv "$1" "${1%.mmark}.md"' _ {} \;
```

- Perform some text replacements

```text
# inline math
find: \$\$([^\s].*?)\$\$
replace: \$$1\$

# block math
find: \$\$([\s\S]*?)\$\$
replace: <div>\n\$\$$1\$\$\n</div>

# block math to live template:
find: <div>\s+\$\$
replace: <div>\$\$

find: \$\$\s+</div>
replace: \$\$</div>
```
