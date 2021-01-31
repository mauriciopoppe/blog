import './sass/main.scss'
import './sass/mobile.scss'

export * from './font-face-observer'
export * from './lazy-load'
export * from './sidebar'
export * from './sitemap'
export * from './heart'
export * from './colors'
export * from './equation-preview'

// if (module.hot) {
//   module.hot.accept('./print.js', function () {
//     console.log('Accepting the updated printMe module!')
//     document.body.removeChild(element)
//     element = component() // Re-render the "component" to update the click handler
//     document.body.appendChild(element)
//   })
// }
