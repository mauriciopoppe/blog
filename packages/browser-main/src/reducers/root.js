import { traverse } from './initial-state'

export function reducer (state = {}, action) {
  switch (action.type) {
    case 'SELECT_NODE':
      return {
        ...state,
        currentPath: traverse(state.root, action.payload)
      }
    default:
      return state
  }
}
