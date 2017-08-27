import React from 'react'
import { withRouter, NavLink, Link } from 'react-router-dom'

function computePath (node, level, indexes) {
  const path = []
  for (let i = 0; i <= level; i += 1) {
    path.push(node.path || '')
    node = node.children[indexes[i]]
  }
  return path
}

const Folders = ({ tree, node, level, indexes, match }) => {
  const path = computePath(tree, level, indexes)
  const prefix = `${path.join('/')}/`
  return (
    <div>
      <button> {node.path} </button>
      { level > 0 && <Link to={path.slice(0, -1).join('/') + '/'}>..</Link> }
      {node.children.map((child, i) => {
        return (
          <div key={i}>
            <NavLink
              activeClassName='active'
              to={`${prefix}${child.path}/`}
            >
              {child.path}
            </NavLink>
          </div>
        )
      })}
    </div>
  )
}

export default withRouter(Folders)
