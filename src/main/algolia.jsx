import React, { useState, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { liteClient as algoliasearch } from 'algoliasearch/lite'
import { InstantSearch, Hits, Highlight, useSearchBox, useInstantSearch } from 'react-instantsearch'

const searchClient = algoliasearch('82T3453LSW', '2129992aa273c61676bd92495bb91728')

function getAbsURL(hit) {
  return hit.uri.replace('content', '')
}

function SearchBox(props) {
  const { query, refine } = useSearchBox(props)
  const { status, results } = useInstantSearch()
  const [inputValue, setInputValue] = useState(query)
  const inputRef = useRef(null)

  const isSearchStalled = status === 'stalled'

  function setQuery(newQuery) {
    setInputValue(newQuery)
    refine(newQuery)
  }

  // OnSubmit move to the first result.
  function onSubmit(event) {
    event.preventDefault()
    event.stopPropagation()
    if (results.hits.length > 0) {
      window.location.href = getAbsURL(results.hits[0])
    }
  }

  return (
    <div className="tw-flex tw-justify-center tw-p-4 tw-w-full tw-fixed tw-top-0 tw-bg-black/90">
      <form onSubmit={onSubmit}>
        <input
          className="tw-text-3xl tw-w-full tw-max-w-2xl tw-rounded-md tw-bg-neutral-800 tw-text-neutral-100 tw-p-2"
          ref={inputRef}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          placeholder="Search for a note"
          spellCheck={false}
          maxLength={512}
          type="search"
          value={inputValue}
          onChange={(event) => {
            setQuery(event.currentTarget.value)
          }}
          autoFocus
        />
      </form>
      <span hidden={!isSearchStalled}>Searching…</span>
    </div>
  )
}

function Hit({ hit }) {
  let figure = null

  // skip sandbox entries
  if (hit.uri.indexOf('sandbox') >= 0) {
    return null
  }

  if (hit.image) {
    figure = (
      <figure className="tw-w-full tw-text-right md:tw-basis-1/3">
        <img src={hit.image} alt={hit.title} className="tw-aspect-auto tw-max-h-72 md:tw-max-h-none" />
        {hit.imageAlt ? (
          <figcaption>
            <i className="tw-text-sm">{hit.imageAlt}</i>
          </figcaption>
        ) : null}
      </figure>
    )
  }

  return (
    <a href={getAbsURL(hit)}>
      <div className="tw-group/related tw-container tw-mx-auto tw-py-4 md:tw-p-4 tw-rounded-md hover:tw-bg-neutral-800/70 hover:light:tw-bg-primary/70">
        <h2 className="tw-group/title tw-text-3xl tw-mb-4 md:tw-text-5xl">
          <Highlight attribute="title" hit={hit} />
        </h2>
        <div className="tw-flex tw-flex-col md:tw-flex-row md:tw-space-x-4">
          {figure}
          <div className="tw-w-full tw-flex tw-flex-col md:tw-basis-2/3">
            <div>{hit.summary}</div>
          </div>
        </div>
      </div>
    </a>
  )
}

function App() {
  return (
    <InstantSearch searchClient={searchClient} indexName="MY_INDEX">
      <div className="tw-mt-20">
        <Hits hitComponent={Hit} />
      </div>
      <SearchBox />
    </InstantSearch>
  )
}

export function algoliaMain() {
  let appInitialized = false

  const searchWrapper = document.querySelector('#algolia-search-wrapper')
  const searchOverlay = document.querySelector('#algolia-search-overlay')
  const root = document.querySelector('#algolia-search')

  const toggleSearch = () => {
    if (root) {
      root.addEventListener('keydown', (event) => {
        if (event.key == 'Escape') {
          toggleSearch()
        }
      })
      searchOverlay.addEventListener('click', () => {
        searchWrapper.classList.add('tw-hidden')
      })
      createRoot(root).render(<App />)
    }
    // Display the overlay.
    searchWrapper.classList.toggle('tw-hidden')

    // Autofocus the input.
    setTimeout(() => {
      root.querySelector('input').focus()
    }, 1)
  }

  const toggleSitemapSearch = () => {
    if (!appInitialized) {
      appInitialized = true
    }
    toggleSearch()
  }

  window.addEventListener('keydown', function (event) {
    if (event.metaKey && event.key === 'k') {
      toggleSitemapSearch()
    }
  })

  const searchTrigger = document.querySelector('#sitemap-search-trigger')
  if (searchTrigger) {
    searchTrigger.addEventListener('click', toggleSitemapSearch)
  }
}
