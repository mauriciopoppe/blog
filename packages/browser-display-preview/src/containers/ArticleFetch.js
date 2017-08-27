import React from 'react'

class ArticleFetcher extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      item: props.item,
      article: ''
    }
  }

  componentDidMount () {
    this.doFetch()
  }

  componentWillReceiveProps (nextProps, prevProps) {
    this.doFetch()
  }

  doFetch () {
    const item = this.props.item
    if (item) {
      // remove extension
      const url = item.data.fullPath
      const last = url.lastIndexOf('.')

      window.fetch(`notes/${url.substring(0, last)}/`)
        .then(res => res.text())
        .then(text => this.setState({ article: text }))
    }
  }

  render () {
    const { children } = this.props
    return (
      <div> {children(this.state.article)} </div>
    )
  }
}

export default ArticleFetcher
