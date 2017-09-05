import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import logger from 'redux-logger'

import App from './App'
import { reducer, initialState } from './reducers/'

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(
    applyMiddleware(logger)
  )
)

export function render (opts = {}) {
  const target = opts.target
  if (!target) {
    console.warn('skipping execution of render()')
    return
  }

  ReactDOM.render(
    <Provider store={store}>
      <App {...opts} />
    </Provider>,
    target
  )
}

