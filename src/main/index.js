import './sass/main.scss'
import './sass/mobile.scss'

export * from './font-face-observer'
export * from './lazy-load'
// eslint-disable-next-line
export * from './sidebar'
// eslint-disable-next-line
export * from './sitemap'
// eslint-disable-next-line
export * from './heart'
export * from './equation-preview'
export * from './footnotes-preview'

// if (module.hot) {
//   module.hot.accept('./print.js', function () {
//     console.log('Accepting the updated printMe module!')
//     document.body.removeChild(element)
//     element = component() // Re-render the "component" to update the click handler
//     document.body.appendChild(element)
//   })
// }
