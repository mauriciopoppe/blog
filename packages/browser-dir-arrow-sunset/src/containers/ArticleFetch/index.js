import React from 'react'
import { connect } from 'react-redux'
import { Motion, spring } from 'react-motion'

class ArticleFetch extends React.Component {
  constructor (props) {
    super(props)
    console.log('article fetched')
    this.state = { text: null }
  }

  componentDidMount () {
    this.fetchConditionally(this.props.article)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.article !== this.props.article) {
      this.fetchConditionally(nextProps.article)
    }
  }

  fetchConditionally (article) {
    if (article.isLeaf) {
      this.doFetch(article)
    } else {
      this.setState({ text: null })
    }
  }

  doFetch (article) {
    // remove extension
    const url = article.fullPath
    const last = url.lastIndexOf('.')

    this.props.selectArticle(article)
    window.fetch(`notes/${url.substring(0, last)}/`)
      .then(res => res.text())
      .then(text => this.setState({
        text
      }, this.afterRender.bind(this)))
  }

  afterRender () {
    this.props.afterArticleRender(this.props.article)
  }

  render () {
    const { children } = this.props
    const { text } = this.state

    const motion = <Motion
      defaultStyle={{opacity: text ? 0 : 1}}
      style={{opacity: spring(text ? 1 : 0)}}>
      {interpolatingStyle => <div style={interpolatingStyle}>
        {text && children(text)}
      </div>}
    </Motion>

    return (
      <div className='content is-medium'>
        {motion}
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  afterArticleRender: (article) => dispatch({
    type: 'ARTICLE_RENDER',
    payload: article
  }),
  selectArticle: (article) => dispatch({
    type: 'SELECT_ARTICLE',
    payload: article
  })
})

export default connect(
  null,
  mapDispatchToProps
)(ArticleFetch)
