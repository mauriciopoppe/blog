import React from "react"
import ReactDOM from "react-dom"

import { Canvas } from "./components/Canvas"

export function render(opts = {}) {
  ReactDOM.render(<Canvas />, opts.target)
}
