import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import logger from 'redux-logger'

import App from './containers/App/'
import { reducer, initialState } from './reducers/'
import renderArticle from './middlewares/render-article'

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(
    applyMiddleware(renderArticle, logger)
  )
)

export function render (opts = {}) {
  const root = document.querySelector('#root')
  if (!root) {
    console.warn('skipping execution of render()')
    return
  }

  ReactDOM.render(
    <Provider store={store}>
      <App {...opts} />
    </Provider>,
    document.querySelector('#root')
  )
}

export function profileAnimation () {
  const footer = document.querySelector('footer')
  const root = document.querySelector('#profile-animation')

  if (!root) {
    console.warn('skipping execution of profileAnimation()')
    return
  }

  function execute () {
    console.log('executing profile-animation script!')
    root.classList.add('is-visible')

    import('./containers/Sunset')
      .then(module => {
        setTimeout(() => {
          const Sunset = module.default
          ReactDOM.render(
            <Sunset />,
            root
          )
        }, 1000)
      })
  }

  function insideViewport (footer) {
    const rect = footer.getBoundingClientRect()
    return rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight + rect.height &&
      rect.left <= window.innerWidth + rect.width
  }

  window.addEventListener('scroll', function eventListener () {
    if (insideViewport(footer)) {
      execute()
      window.removeEventListener('scroll', eventListener)
    }
  }, false)
}
