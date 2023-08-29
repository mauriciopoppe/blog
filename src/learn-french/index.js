import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'

function App() {
  const pronouns = ['Je', 'Vous', 'Il', 'Elle', 'On', 'Nous', 'Ils', 'Elles']
  const randomPronounIndex = () => Math.floor(Math.random() * pronouns.length)
  const [pronounIndex, setPronounIndex] = useState(randomPronounIndex())
  return (
    <div className="container">
      <h1 className="title is-1 has-text-centered">Tools to learn french!</h1>
      <h2 className="title is-2">Pronoun Generator</h2>
      <button
        className="button is-primary is-small"
        onClick={() => {
          let nextIndex
          while (true) {
            nextIndex = randomPronounIndex()
            if (nextIndex !== pronounIndex) {
              break
            }
          }
          setPronounIndex(nextIndex)
        }}
      >
        Generate:
      </button>
      <code class="">{pronouns[pronounIndex]}</code>
    </div>
  )
}

// Render your React component instead
const root = createRoot(document.getElementById('app'))
root.render(<App />)
