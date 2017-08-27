const renderArticle = store => next => action => {
  // execute mathjax on the article
  window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub])
  next(action)
}

export default renderArticle
