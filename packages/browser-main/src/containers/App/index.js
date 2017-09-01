import React from 'react'
import { connect } from 'react-redux'
import { Flex } from 'rebass'
import styled from 'styled-components'
import cs from 'classnames'
import titleCase from 'title-case'
import defined from 'defined'

import Directory from 'Components/Directory/'

const Root = styled.div`
  & .dirs {
    height: 800px;
    transition: height 200ms;
  }

  & .dirs.collapsed {
    height: 0;
  }
`

const Breadcrumb = styled.nav`
`

const Directories = styled(Flex)`
  overflow: auto;
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
      <section>
        <Root className='container content'>
          {!this.state.root && <Breadcrumb
            onClick={this.toggleCollapse.bind(this)}
            className='breadcrumb'
            ariaLabel='breadcumbs'
          >
            <ul className='is-large'>
              {initialNodes.map((node, i) => (
                <li key={i}>
                  <a href='javascript:;'>
                    {node.title || titleCase(node.path)}
                  </a>
                </li>
              ))}
            </ul>
          </Breadcrumb>}
          <Directories className={cs('dirs', {
            collapsed: this.state.collapsed
          })}>
            { dirs }
          </Directories>
        </Root>
      </section>
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
