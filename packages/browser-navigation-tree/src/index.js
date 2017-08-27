import Tree from './components/Tree/'

const root = document.querySelector('#browser-navigation-tree')

window.BrowserNavigationTree = (config) => {
  Tree({
    ...config,
    data: window.__RENDER_TREE__,
    duration: 500,
    initialDelay: 1000,
    delayEach: false,
    target: root
  })
}
