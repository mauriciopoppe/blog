import React, { useState, useRef, Fragment } from 'react'
import { createRoot } from 'react-dom/client'
import { liteClient as algoliasearch } from 'algoliasearch/lite'
import { InstantSearch, Configure, useSearchBox, useInstantSearch } from 'react-instantsearch'

const searchClient = algoliasearch('82T3453LSW', '2129992aa273c61676bd92495bb91728')

function getAbsURL(hit) {
  return hit.uri.replace('content', '')
}

function isNote(hit) {
  const uri = hit.uri || ''
  if (uri.indexOf('sandbox') >= 0) return false
  if (uri.indexOf('content/notes') !== 0) return false
  if (uri === 'content/notes') return false
  if (hit.draft === true) return false
  return true
}

// Pick a material symbol that echoes the article's series, matching the icon
// choices on the index.html favorites grid.
function hitIcon(uri) {
  const path = uri || ''
  if (path.includes('computer-graphics')) return '3d_rotation'
  if (path.includes('performance') || path.includes('queuing') || path.includes('benchmark')) return 'speed'
  if (path.includes('mathematics')) return 'function'
  if (path.includes('computer-science')) return 'computer'
  return 'article'
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
    <div className="tw-shrink-0 tw-flex tw-items-center tw-gap-3 tw-px-4 tw-py-4 tw-border-b tw-border-white/[0.06]">
      <form onSubmit={onSubmit} className="tw-flex-1 tw-min-w-0">
        <input
          name="search"
          className="tw-w-full tw-text-2xl md:tw-text-3xl tw-rounded-md tw-bg-neutral-800 tw-text-neutral-100 tw-p-2 tw-border tw-border-transparent focus:tw-border-primary focus:tw-outline-none"
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
      <span className="tw-cursor-pointer tw-text-3xl material-symbols-outlined tw-shrink-0" onClick={props.onClose}>
        close
      </span>
    </div>
  )
}

function Hit({ hit }) {
  // prod notes only, no drafts
  if (!isNote(hit)) {
    return null
  }

  // Algolia wraps matched substrings in <em> tags inside _highlightResult.
  // The value is HTML-escaped by Algolia except for those tags, so we render
  // it as HTML instead of letting the raw tags leak through as text.
  const highlightedTitle =
    hit._highlightResult && hit._highlightResult.title && hit._highlightResult.title.value

  // One row of the results grid, same shape as the index.html Favorites grid:
  // (icon + title, description) pairs aligned across the whole list.
  return (
    <Fragment>
      <a
        className="tw-flex tw-items-center tw-gap-1.5 tw-no-underline tw-text-primary hover:tw-brightness-110 tw-min-w-0"
        href={getAbsURL(hit)}
      >
        <span className="material-symbols-outlined tw-shrink-0 tw-text-base">{hitIcon(hit.uri)}</span>
        <span className="tw-truncate tw-leading-snug">
          {highlightedTitle ? (
            <span className="ais-Highlight" dangerouslySetInnerHTML={{ __html: highlightedTitle }} />
          ) : (
            <span>{hit.title}</span>
          )}
        </span>
      </a>
      {hit.summary && (
        <div className="tw-text-neutral-400 tw-text-xs tw-truncate tw-leading-snug">{hit.summary}</div>
      )}
    </Fragment>
  )
}

function SortedHits() {
  const { results } = useInstantSearch()
  // The index is configured with customRanking ['asc(rank)'], so Algolia
  // returns hits in our curated popularity order (empty query) or by relevance
  // with popularity as tiebreaker (typed query). We only filter to real notes.
  const hits = results.hits.filter(isNote)

  return (
    <div className="tw-grid tw-gap-y-1 tw-text-sm tw-leading-tight md:tw-grid-cols-[12em_auto]">
      {hits.map((hit) => (
        <Hit key={hit.objectID} hit={hit} />
      ))}
    </div>
  )
}

function App(props) {
  return (
    <InstantSearch searchClient={searchClient} indexName="MY_INDEX">
      <Configure hitsPerPage={200} />
      <SearchBox onClose={props.toggleSearch} />
      <div className="tw-flex-1 tw-overflow-y-auto tw-px-4 tw-py-3">
        <SortedHits />
      </div>
    </InstantSearch>
  )
}

export function algoliaMain() {
  let appInitialized = false

  const searchWrapper = document.querySelector('#algolia-search-wrapper')
  const searchOverlay = document.querySelector('#algolia-search-overlay')
  const root = document.querySelector('#algolia-search')

  const setBodyScrollLock = (locked) => {
    document.documentElement.style.overflow = locked ? 'hidden' : ''
    document.body.style.overflow = locked ? 'hidden' : ''
  }

  const toggleSearch = () => {
    if (root && !appInitialized) {
      root.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          toggleSearch()
        }
      })
      searchOverlay.addEventListener('click', toggleSearch)
      createRoot(root).render(<App toggleSearch={toggleSitemapSearch} />)
    }
    // Display the overlay.
    searchWrapper.classList.toggle('tw-hidden')
    const isOpen = !searchWrapper.classList.contains('tw-hidden')
    // Lock the page behind the overlay so only the results list scrolls.
    setBodyScrollLock(isOpen)

    // Autofocus the input.
    if (isOpen) {
      setTimeout(() => {
        const input = root && root.querySelector('input')
        if (input) input.focus()
      }, 1)
    }
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
