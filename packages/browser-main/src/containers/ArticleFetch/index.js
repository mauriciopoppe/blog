import React from 'react'
import { connect } from 'react-redux'

class ArticleFetch extends React.Component {
  constructor (props) {
    super(props)
    console.log('article fetched')
    this.state = { text: '' }
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
    return (
      <div> {text !== '' && children(text)} </div>
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
