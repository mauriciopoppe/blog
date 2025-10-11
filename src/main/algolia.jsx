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
  const { results } = useInstantSearch()
  const [inputValue, setInputValue] = useState(query)
  const inputRef = useRef(null)

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
    <div className="tw-flex tw-flex-row md:tw-justify-center tw-p-4 tw-w-full tw-fixed tw-top-0">
      <form onSubmit={onSubmit}>
        <input
          name="search"
          className="tw-text-3xl md:tw-w-full tw-rounded-md tw-bg-neutral-800 tw-text-neutral-100 tw-p-2"
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
      <span className="tw-mt-2 tw-text-3xl material-symbols-outlined" onClick={props.onClose}>
        close
      </span>
    </div>
  )
}

function Hit({ hit }) {
  // skip sandbox entries
  if (hit.uri.indexOf('sandbox') >= 0) {
    return null
  }

  function formatDate(date) {
    const options = {
      weekday: 'short', // "Mon"
      month: 'short',   // "Jan"
      day: 'numeric',   // "2"
      year: 'numeric'   // "2006"
    };
    return date.toLocaleDateString('en-US', options);
  }

  // This component reimplements the same view as note-preview.html but with JS.
  return (
    <div className="md:tw-w-3/5 tw-mx-auto">
      <a className="tw-block tw-my-4" href={getAbsURL(hit)}>
        <div className="tw-grid md:tw-grid-cols-[10em_auto] tw-place-content-start md:tw-gap-4 tw-leading-tight">
          <div>{formatDate(new Date(hit.date))}</div>
          <div>
            <h2>
              <Highlight attribute="title" hit={hit} />
            </h2>
            <div className="tw-text-xs">
              {hit.summary}
            </div>
          </div>
        </div>
      </a>
    </div>
  )
}

function App(props) {
  return (
    <InstantSearch searchClient={searchClient} indexName="MY_INDEX">
      <div className="tw-mt-20">
        <Hits hitComponent={Hit} />
      </div>
      <SearchBox onClose={props.toggleSearch} />
    </InstantSearch>
  )
}

export function algoliaMain() {
  let appInitialized = false

  const searchWrapper = document.querySelector('#algolia-search-wrapper')
  const searchOverlay = document.querySelector('#algolia-search-overlay')
  const root = document.querySelector('#algolia-search')

  const toggleSearch = () => {
    if (root && !appInitialized) {
      root.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          toggleSearch()
        }
      })
      searchOverlay.addEventListener('click', () => {
        searchWrapper.classList.add('tw-hidden')
      })
      createRoot(root).render(<App toggleSearch={toggleSitemapSearch} />)
    }
    // Display the overlay.
    searchWrapper.classList.toggle('tw-hidden')

    // Autofocus the input.
    setTimeout(() => {
      root.querySelector('input').focus()
    }, 1)
  }

  const toggleSitemapSearch = () => {
    toggleSearch()
    if (!appInitialized) {
      appInitialized = true
    }
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
