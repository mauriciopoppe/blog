import React from 'react'
import { connect } from 'react-redux'
import { Flex } from 'rebass'
import styled from 'styled-components'
import cs from 'classnames'
import titleCase from 'title-case'
import defined from 'defined'

import Directory from './components/Directory/'

const Root = styled.div`
  margin: 0px auto;
  & .dirs {
    height: 800px;
    transition: height 200ms;
  }

  & .dirs.collapsed {
    height: 0;
  }
`

const Breadcrumb = styled.nav`
  cursor: pointer;
  margin-bottom: 0 !important;
  padding: 20px 0;
  background-color: white;
`

const Directories = styled(Flex)`
  overflow: auto;
`

const BreadcrumbToken = styled.span`
  padding: .5em .75em;
`

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      root: window.location.pathname === '/',
      collapsed: window.location.pathname !== '/'
    }
  }

  toggleCollapse () {
    this.setState(state => ({
      collapsed: !state.collapsed
    }))
  }

  componentDidMount () {
    const self = this
    const rect = this.wrapper.getBoundingClientRect()
    const oTop = rect.top - window.scrollY
    let position = ''
    self.root.style.top = 0
    self.root.style.left = rect.left
    const onScroll = function onScroll (e) {
      let newPosition = ''
      if (window.scrollY > oTop) {
        newPosition = 'fixed'
      }
      if (newPosition !== position) {
        position = newPosition
        self.root.style.position = newPosition
      }
    }
    window.addEventListener('scroll', onScroll, false)
  }

  render () {
    const { nodes, initialNodes } = this.props
    const { selectNode } = this.props
    const urlPrefix = nodes.reduce((arr, cur) => {
      arr.push(arr.length ? `${arr[arr.length - 1]}/${cur.path}` : '')
      return arr
    }, [])
    const dirs = nodes
      .map((node, i) => (
        node.children.length && <Directory
          selectNode={selectNode}
          urlPrefix={urlPrefix[i]}
          items={node.children}
          activeItem={nodes[i + 1]}
        />
      ))
      .filter(Boolean)

    return (
      <Root>
        <div style={{ height: 80, position: 'relative' }} ref={el => { this.wrapper = el }}>
          <div
            style={{ background: 'white', zIndex: 1, width: '100%' }}
            ref={el => { this.root = el }}
          >
            <div className='container'>
              {!this.state.root && <Breadcrumb
                onClick={this.toggleCollapse.bind(this)}
                className='breadcrumb'
                ariaLabel='breadcumbs'
              >
                <ul className='is-large'>
                  {initialNodes.map((node, i) => (
                    <li key={i}>
                      <BreadcrumbToken> {node.title || titleCase(node.path)} </BreadcrumbToken>
                    </li>
                  ))}
                </ul>
              </Breadcrumb>}
              <Directories className={cs('dirs', {
                collapsed: this.state.collapsed
              })}>
                { dirs }
              </Directories>
            </div>
          </div>
        </div>
      </Root>
    )
  }
}

const mapStateToProps = (state) => ({
  nodes: state.currentPath.nodes,
  initialNodes: state.initialPath.nodes
})

const mapDispatchToProps = (dispatch) => ({
  selectNode: (node) => dispatch({
    type: 'SELECT_NODE',
    payload: node
  })
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
