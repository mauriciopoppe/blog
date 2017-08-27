import React from 'react'
import { withRouter, Route } from 'react-router-dom'
import { connect } from 'react-redux'

import Folders from 'Components/Folders/'
import ArticleFetch from 'Containers/ArticleFetch/'

function getChildByPath (children, path) {
  for (let i = 0; i < children.length; i += 1) {
    const child = children[i]
    if (child.path === path) return child
  }
}

function traverseByPath (node, path) {
  // initial index
  const nodes = [node]
  const indexes = []
  const tokens = path.split('/').filter(Boolean)
  let currentNode
  while (tokens.length) {
    if (!node.children) break
    currentNode = getChildByPath(node.children, tokens[0])
    if (!currentNode) break
    nodes.push(currentNode)
    indexes.push(node.children.indexOf(currentNode))
    node = currentNode
    tokens.shift()
  }
  return { nodes, currentNode, indexes }
}

class App extends React.Component {
  render () {
    const { tree, location } = this.props
    const { nodes, currentNode, indexes } = traverseByPath(tree, location.pathname)

    const folders = nodes
      .map((node, i) => (
        <div key={i} style={{margin: 30}}>
          <Folders
            tree={tree}
            node={node}
            level={i}
            indexes={indexes}
          />
        </div>
      ))

    const content = <div>
      { folders }
      <ArticleFetch
        article={currentNode}
      >
        {(article) => {
          return <div dangerouslySetInnerHTML={{__html: article}} />
        }}
      </ArticleFetch>
    </div>

    return (
      <div>
        <Route path='/*' children={() => (
          <div>{content}</div>
        )} />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  tree: state.tree,
  path: state.path
})

export default withRouter(connect(
  mapStateToProps
)(App))
