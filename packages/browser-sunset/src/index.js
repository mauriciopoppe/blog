import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

export function render (opts = {}) {
  ReactDOM.render(
    <App />,
    opts.target
  )
}
