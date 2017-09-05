import Tree from './components/Tree/'

export function render (config) {
  Tree({
    ...config,
    data: window.__RENDER_TREE__,
    duration: 500,
    initialDelay: 1000,
    delayEach: false,
    target: config.target
  })
}
