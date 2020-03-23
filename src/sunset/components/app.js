import React from 'react'
import ReactDOM from 'react-dom'

import { Canvas } from './Canvas'

export function render(opts = {}) {
  ReactDOM.render(<Canvas />, opts.target)
}
