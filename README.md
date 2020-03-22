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

To update the JS code go to packages/* and run

```text
npm start
```

NOTE: scss livereload is not working so a hard refresh is needed every time the css is compiled

### New article

- should have the extension .md
- the breadcrumb component should be rerendered `npm run build:sitemap`

### Prod like server

```bash
brew install mkcert
# Generate the certs
mkcert localhost 127.0.0.1 ::1
# Install the certs into the system
mkcert -install
```

## Tech

- Hugo (static pages)
- React + Redux

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
