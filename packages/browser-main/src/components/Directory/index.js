import React from 'react'
import titleCase from 'title-case'
import { Flex, Box } from 'rebass'
import styled from 'styled-components'
import cn from 'classnames'

const Column = styled(Flex)`
  max-height: 800px;
  min-width: 300px;
  overflow-y: auto;
  margin: 20px 5px;
`

const Card = styled.div`
  &.active {
    background: #eee;
  }
`

const Nav = ({ items, activeItem, urlPrefix, selectNode }) => {
  const url = node => `${urlPrefix}/${node.path}`
  const renderItem = (node, i) => {
    if (node.isLeaf) return leaf(node, i)
    return nonLeaf(node, i)
  }

  const leaf = (node, i) => (
    <a key={i} href={url(node)}>
      {nonLeaf(node, i)}
    </a>
  )

  const nonLeaf = (node, i) => (
    <Card className={cn('card', {
      active: activeItem === node
    })}
      style={{cursor: 'pointer'}}
      onClick={() => selectNode(url(node))}
    >
      <div className='card-content'>
        <div className='title is-6'>
          {node.title || titleCase(node.path)}
        </div>
        <div className='content'>
          {node.path}
        </div>
      </div>
    </Card>
  )
  return (
    <Column column>
      <Box m={5}>
        {items.map(renderItem)}
      </Box>
    </Column>
  )
}

export default Nav
