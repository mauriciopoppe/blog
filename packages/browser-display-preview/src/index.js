import React from 'react'
import ReactDOM from 'react-dom'

import ArticleFetch from './containers/ArticleFetch'

const App = ({ item }) => (
  <div>
    { item && <ArticleFetch item={item}>
      {(article) => {
        return <div dangerouslySetInnerHTML={{__html: article}} />
      }}
    </ArticleFetch>}
    { !item && <div> error! </div> }
  </div>
)

const root = document.querySelector('#browser-display-preview')

let last
function render (item) {
  console.log(item)
  if (item !== last) {
    last = item
    root.classList[item ? 'add' : 'remove']('active')
    ReactDOM.render(<App item={item} />, root)
  }
}

window.BrowserDisplayPreview = render
