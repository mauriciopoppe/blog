import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import logger from 'redux-logger'

import App from './containers/App/'
import reducer from './reducers/'
import renderArticle from './middlewares/render-article'

const store = createStore(reducer, composeWithDevTools(
  applyMiddleware(renderArticle, logger)
))

function render () {
  ReactDOM.render(
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>,
    document.querySelector('#root')
  )
}

render()
