import React from 'react'
import { connect } from 'react-redux'
import { Flex } from 'rebass'
import styled from 'styled-components'
import cs from 'classnames'
import titleCase from 'title-case'
import { interpolateMagma } from 'd3-scale'

import Directory from './components/Directory/'

const Root = styled.div`
  margin: 0px auto;
  & .dirs {
    max-height: 500px;
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

const Floating = styled.div`
  background: white;
  z-index: 1;
  width: 100%;
`

const ScrollIndicator = styled.div`
  height: 5px;
  position: relative;
  background-image: linear-gradient(
    to right,
    ${() => interpolateMagma(0.25)},
    ${() => interpolateMagma(0.75)}
  );
`

const Indicator = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  background: white;
  right: 0;
  top: 0;
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
      // breadcrum positioning
      let newPosition = ''
      if (window.scrollY > oTop) {
        newPosition = 'fixed'
      }
      if (newPosition !== position) {
        position = newPosition
        self.root.style.position = newPosition
      }

      // breadcrumb indicator
      const width = 1 - window.scrollY / (document.body.clientHeight - window.innerHeight)
      self.indicator.style.width = `${width * 100}%`
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
        <div
          style={{ height: 80, zIndex: 1, position: 'relative' }}
          ref={el => { this.wrapper = el }}
        >
          <Floating innerRef={el => { this.root = el }}>

            <ScrollIndicator>
              <Indicator innerRef={el => { this.indicator = el }} />
            </ScrollIndicator>

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

          </Floating>
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
