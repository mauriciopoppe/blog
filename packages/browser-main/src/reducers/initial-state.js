function getChildByPath (children, path) {
  for (let i = 0; i < children.length; i += 1) {
    const child = children[i]
    if (child.path === path) return child
  }
}

export function traverse (node, path) {
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

const root = window.__RENDER_TREE__
const path = traverse(root, window.location.pathname)

export const initialState = {
  root,
  initialPath: {...path},
  currentPath: {...path}
}
