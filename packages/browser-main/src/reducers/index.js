export const initialState = {
  tree: window.__RENDER_TREE__,
  path: [],
  article: null
}

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case 'SELECT_ARTICLE':
      return {
        ...state,
        article: action.payload
      }
    default:
      return state
  }
}
