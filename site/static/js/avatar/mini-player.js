/**
 * Avatar Mini Bar Player (Preact + HTM)
 *
 * Positioned using pure CSS:
 * - Mobile (< 640px): Floating bottom dock fixed directly to browser viewport.
 * - Desktop (>= 640px): CSS absolute positioned popover anchored to avatar container.
 *
 * Eliminates JavaScript scroll event listeners to guarantee 60/120fps zero-lag scroll tracking.
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

import { html, render, useState, useEffect, useRef } from 'https://esm.sh/htm/preact/standalone'
import { playerStore } from './audio-engine.js'

function formatLcdBar(barNum) {
  const numStr = String(barNum || 1)
  if (numStr.length === 1) {
    return html`<span class="tw-text-white/25">00</span>${numStr}`
  }
  if (numStr.length === 2) {
    return html`<span class="tw-text-white/25">0</span>${numStr}`
  }
  return numStr
}

export function MiniPlayer({ avatarEl }) {
  const [storeState, setStoreState] = useState(playerStore.getState())
  const [isHovered, setIsHovered] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const usesMobilePlayer = () => typeof window !== 'undefined' &&
    (window.innerWidth < 640 || (avatarEl?.dataset.mobilePlayer === 'true' && window.matchMedia('(pointer: coarse)').matches))
  const [isMobile, setIsMobile] = useState(usesMobilePlayer)
  const [isAvatarDetached, setIsAvatarDetached] = useState(avatarEl?.dataset.avatarDetached === 'true')
  const hoverTimeoutRef = useRef(null)
  const songSelectRef = useRef(null)
  const shell = avatarEl?.parentElement
  const stackingContainer = avatarEl?.closest('[data-avatar-stacking-container]') || shell?.parentElement
  const originalShellZIndex = useRef(shell?.style.zIndex || '')
  const originalContainerZIndex = useRef(stackingContainer?.style.zIndex || '')

  const raiseAvatarShell = () => {
    if (avatarEl?.dataset.avatarDetached === 'true') return
    if (shell) shell.style.zIndex = '10000'
    if (stackingContainer) stackingContainer.style.zIndex = '10000'
  }

  const restoreAvatarShell = () => {
    if (avatarEl?.dataset.avatarDetached === 'true') return
    if (shell) shell.style.zIndex = originalShellZIndex.current
    if (stackingContainer) stackingContainer.style.zIndex = originalContainerZIndex.current
  }

  // Subscribe to global store updates
  useEffect(() => {
    const unsubscribe = playerStore.subscribe((state) => {
      setStoreState(state)
    })
    return unsubscribe
  }, [])

  // Viewport resize tracking
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(usesMobilePlayer())
    }
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Hook avatar element events
  useEffect(() => {
    if (!avatarEl) return

    const handlePositionChange = () => setIsAvatarDetached(avatarEl.dataset.avatarDetached === 'true')

    const handleAvatarEnter = () => {
      if (!usesMobilePlayer()) {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current)
          hoverTimeoutRef.current = null
        }
        raiseAvatarShell()
        setIsHovered(true)
      }
    }

    const handleAvatarLeave = () => {
      if (!usesMobilePlayer()) {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current)
        }
        hoverTimeoutRef.current = setTimeout(() => {
          setIsHovered(false)
          restoreAvatarShell()
        }, 250)
      }
    }

    const handleAvatarClick = (e) => {
      if (e.target.closest('.avatar-mini-player')) return
      if (avatarEl.dataset.avatarDragged === 'true') {
        delete avatarEl.dataset.avatarDragged
        return
      }
      if (usesMobilePlayer()) {
        setIsMobileOpen(true)
      }
      playerStore.togglePlay()
    }

    avatarEl.addEventListener('pointerenter', handleAvatarEnter)
    avatarEl.addEventListener('pointerleave', handleAvatarLeave)
    avatarEl.addEventListener('click', handleAvatarClick)
    avatarEl.addEventListener('avatar-position-change', handlePositionChange)

    return () => {
      avatarEl.removeEventListener('pointerenter', handleAvatarEnter)
      avatarEl.removeEventListener('pointerleave', handleAvatarLeave)
      avatarEl.removeEventListener('click', handleAvatarClick)
      avatarEl.removeEventListener('avatar-position-change', handlePositionChange)
    }
  }, [avatarEl])

  const onPlayerEnter = () => {
    if (!isMobile) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
        hoverTimeoutRef.current = null
      }
      raiseAvatarShell()
      setIsHovered(true)
    }
  }

  const onPlayerLeave = () => {
    if (!isMobile) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(false)
        restoreAvatarShell()
      }, 250)
    }
  }

  const handleCloseMobile = (e) => {
    if (e) e.stopPropagation()
    setIsMobileOpen(false)
    if (storeState.isPlaying) {
      playerStore.stop()
    }
  }

  const handleRestoreAvatar = (e) => {
    e.stopPropagation()
    avatarEl.dispatchEvent(new CustomEvent('avatar-restore-request'))
  }

  const { song, metadata, phrase, isPlaying, isContinuous, isMetronome, progress, currentBar, currentBeat } = storeState
  const displayedProgress = isPlaying ? progress : 0
  const songTitle = song.nameJapanese && song.name.includes(song.nameJapanese)
    ? song.name
    : [song.name, song.nameJapanese].filter(Boolean).join(' · ')
  const shouldMarqueeSongTitle = songTitle.length > 30
  const openSongPicker = (event) => {
    if (event.target.closest('a, select, button')) return
    const picker = songSelectRef.current
    if (!picker) return
    try {
      picker.showPicker?.()
    } catch (error) {
      picker.focus()
    }
  }

  // Visibility logic: on mobile follows isMobileOpen; on desktop follows isHovered
  const isVisible = isMobile ? isMobileOpen : isHovered

  // Position and layout classes
  let layoutClasses = ''
  let dynamicStyles = {}

  if (isMobile) {
    layoutClasses = 'tw-fixed tw-bottom-4 tw-left-4 tw-right-4 tw-z-[99999] tw-max-w-sm tw-mx-auto'
    dynamicStyles = {
      transform: `translateY(${isVisible ? '0' : '32px'})`,
      opacity: isVisible ? 1 : 0,
      pointerEvents: isVisible ? 'auto' : 'none',
      transition: 'opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
    }
  } else {
    layoutClasses = 'tw-absolute tw-bottom-[calc(100%+10px)] tw-left-1/2 tw-z-[9999] tw-w-max tw-max-w-[calc(100vw-32px)]'
    dynamicStyles = {
      transform: `translateX(-50%) translateY(${isVisible ? '0' : '8px'}) scale(${isVisible ? '1' : '0.96'})`,
      transformOrigin: 'bottom center',
      opacity: isVisible ? 1 : 0,
      pointerEvents: isVisible ? 'auto' : 'none',
      transition: 'opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
    }
  }

  const popupClasses = `
    avatar-mini-player tw-text-xs tw-backdrop-blur-md tw-border tw-border-[var(--ring-border)]
    tw-rounded-xl tw-p-2.5 tw-shadow-deep tw-box-border tw-select-none
    ${layoutClasses}
  `

  return html`
    <div
      class=${popupClasses}
      style=${{
        background: 'color-mix(in srgb, var(--grey-darker) 94%, transparent)',
        ...dynamicStyles
      }}
      onMouseEnter=${onPlayerEnter}
      onMouseLeave=${onPlayerLeave}
    >
      <style>
        .avatar-mini-player button {
          border: 1px solid var(--ring-border, rgba(255, 255, 255, 0.12));
          background: var(--grey-dark, #27272a);
          color: var(--grey-lighter, #e4e4e7);
          transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }
        .avatar-mini-player button:hover {
          border-color: rgb(var(--primary)) !important;
          color: rgb(var(--primary)) !important;
          background: rgba(var(--primary), 0.16) !important;
          box-shadow: var(--elevation-raised, 0 2px 8px rgba(0, 0, 0, 0.4)), 0 0 10px rgba(var(--primary), 0.3) !important;
        }
        .avatar-mini-player button.btn-active {
          background: rgba(var(--primary), 0.2) !important;
          border-color: rgb(var(--primary)) !important;
          color: rgb(var(--primary)) !important;
          box-shadow: 0 0 10px rgba(var(--primary), 0.35) !important;
        }
        .avatar-mini-player .mini-player-icon-control {
          border: 0 !important;
          background: transparent !important;
          box-shadow: none !important;
          padding: 0;
        }
        .mini-player-song-title-window {
          display: block;
          max-width: 100%;
          overflow: hidden;
          white-space: nowrap;
        }
        .mini-player-song-marquee-track {
          display: inline-flex;
          width: max-content;
          animation: mini-player-song-marquee 12s linear infinite;
        }
        @keyframes mini-player-song-marquee {
          0%, 12% { transform: translateX(0); }
          45%, 55% { transform: translateX(-40%); }
          88%, 100% { transform: translateX(0); }
        }
      </style>

      <div class="mini-player-body tw-flex tw-flex-col tw-gap-2">
        <!-- Header: Song Info & Current Section -->
        <div class="mini-player-header tw-flex tw-items-center tw-justify-between tw-gap-2 tw-border-b tw-border-white/10 tw-pb-1.5">
          <div
            class="tw-flex tw-items-center tw-gap-2 tw-min-w-0 tw-flex-1"
          >
            <div class="mini-player-meta tw-relative tw-flex tw-flex-col tw-min-w-0 tw-leading-tight tw-cursor-pointer" title="Choose song" onClick=${openSongPicker}>
              <span class="mini-player-song-name tw-flex tw-items-center tw-gap-1 tw-min-w-0 tw-text-left tw-text-[var(--grey-lighter)] tw-font-bold">
                <span class="tw-shrink-0 tw-text-base tw-leading-none">${song.icon}</span>
                <span class="mini-player-song-title-window tw-text-left">
                <span class=${shouldMarqueeSongTitle ? 'mini-player-song-marquee-track' : 'tw-inline-block'}>
                  <span>
                    ${song.songUrl ? html`<a class="hover:tw-underline" href=${song.songUrl} target="_blank" rel="noreferrer" onClick=${(event) => event.stopPropagation()}>${songTitle}</a>` : songTitle}
                  </span>
                </span>
                </span>
              </span>
              <div class="tw-flex tw-items-center tw-gap-1 tw-min-w-0 tw-overflow-hidden tw-text-[0.68rem] tw-mt-0.5">
                <span class="mini-player-artist tw-text-primary tw-font-medium tw-truncate">
                  ${song.artistUrl ? html`<a class="hover:tw-underline" href=${song.artistUrl} target="_blank" rel="noreferrer" onClick=${(event) => event.stopPropagation()}>${song.artist}</a>` : song.artist}${song.singer ? ` / ${song.singer}` : ''}
                </span>
                ${song.credit ? html`<span class="tw-text-[0.62rem] tw-text-[var(--grey-light)] tw-truncate">MIDI by <a class="tw-text-primary hover:tw-underline" href=${song.creditUrl} target="_blank" rel="noreferrer" onClick=${(event) => event.stopPropagation()}>${song.credit}</a></span>` : null}
                <span class="tw-text-white/30">•</span>
                <span class="mini-player-verse-title tw-text-[var(--grey-light)] tw-font-semibold tw-truncate">
                  ${phrase ? phrase.title : 'Loading...'}
                </span>
                ${playerStore.songs.length > 1 ? html`
                  <label class="tw-sr-only" for="avatar-song-select">Select song</label>
                  <select
                    id="avatar-song-select"
                    ref=${songSelectRef}
                    class="mini-player-icon-control tw-w-4 tw-h-4 tw-shrink-0 tw-rounded-none tw-p-0 tw-text-[0px] hover:tw-text-primary focus:tw-outline-none"
                    aria-label="Select song"
                    value=${song.id}
                    onChange=${(event) => playerStore.selectSong(event.currentTarget.value)}
                  >
                    ${playerStore.songs.map((option) => html`<option value=${option.id}>${option.name} · ${option.artist}</option>`)}
                  </select>
                  <button
                    type="button"
                    class="mini-player-icon-control tw-w-4 tw-h-4 tw-shrink-0 tw-rounded-none tw-flex tw-items-center tw-justify-center tw-text-[0.72rem] hover:tw-text-primary"
                    title="Choose a random song"
                    aria-label="Choose a random song"
                    onClick=${() => playerStore.selectRandomSong()}
                  >
                    <span class="material-symbols-outlined tw-text-sm" aria-hidden="true">shuffle</span>
                  </button>
                ` : null}
              </div>
            </div>
          </div>

          ${!isMobile && isAvatarDetached ? html`
            <button
              type="button"
              class="tw-w-6 tw-h-6 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-[11px] tw-text-[var(--grey-light)] tw-shrink-0 tw-shadow-subtle hover:tw-shadow-raised"
              title="Return avatar to original position"
              onClick=${handleRestoreAvatar}
            >↩</button>
          ` : null}

          ${isMobile ? html`
            <button
              type="button"
              class="tw-w-6 tw-h-6 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-[11px] tw-text-[var(--grey-light)] tw-shrink-0 tw-ml-1"
              title="Close & Stop Playback"
              onClick=${handleCloseMobile}
            >
              ✕
            </button>
          ` : null}
        </div>

        <!-- Borderless Flat LCD Transport Panel (Passive Surface) -->
        <div class="mini-player-lcd tw-w-fit tw-mx-auto tw-flex tw-items-center tw-justify-center tw-gap-1 tw-bg-[var(--grey-dark)] tw-rounded-lg tw-px-2 tw-py-1">
          <!-- Column 1: BAR . BEAT -->
          <div class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-pr-1 tw-border-r tw-border-white/10 tw-min-w-[44px]">
            <div class="tw-font-mono tw-text-sm tw-font-bold tw-tracking-tight tw-leading-none tw-text-[var(--grey-lighter)]">
              ${formatLcdBar(currentBar)}<span class="tw-text-white/30">.</span><span class="tw-text-primary">${currentBeat || 1}</span>
            </div>
            <div class="tw-flex tw-justify-between tw-w-full tw-text-[7.5px] tw-font-bold tw-text-[var(--grey-light)] tw-tracking-wider tw-mt-0.5 tw-uppercase tw-leading-none">
              <span>BAR</span>
              <span>BEAT</span>
            </div>
          </div>

          <!-- Column 2: TEMPO -->
          <div class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-px-1 tw-border-r tw-border-white/10">
            <div class="tw-font-mono tw-text-sm tw-font-bold tw-leading-none tw-text-[var(--grey-lighter)]">
              ${song.bpm}
            </div>
            <div class="tw-text-[7.5px] tw-font-bold tw-text-[var(--grey-light)] tw-tracking-wider tw-mt-0.5 tw-uppercase tw-leading-none">
              TEMPO
            </div>
          </div>

          <!-- Column 3: TIME SIGNATURE & KEY -->
          <div class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-px-1 tw-border-r tw-border-white/10">
            <div class="tw-text-[0.72rem] tw-font-bold tw-leading-none tw-text-[var(--grey-lighter)]">
              ${(metadata && metadata.timeSignature) || song.timeSignature || '6/8'}
            </div>
            <div class="tw-text-[0.65rem] tw-font-medium tw-text-primary tw-leading-none tw-mt-0.5">
              ${(metadata && metadata.key) || song.key || 'Bmin'}
            </div>
          </div>

          <!-- Column 4: QUICK TOGGLES -->
          <div class="tw-flex tw-items-center tw-justify-center tw-gap-1 tw-pl-0.5">
            <button
              type="button"
              class="tw-w-7 tw-h-7 tw-text-sm tw-rounded-md tw-flex tw-items-center tw-justify-center tw-leading-none tw-shadow-subtle hover:tw-shadow-raised ${isMetronome ? 'btn-active' : ''}"
              title="Toggle Metronome (⏱)"
              onClick=${() => playerStore.toggleMetronome()}
            >
              ⏱
            </button>
            <button
              type="button"
              class="tw-w-7 tw-h-7 tw-text-sm tw-rounded-md tw-flex tw-items-center tw-justify-center tw-leading-none tw-shadow-subtle hover:tw-shadow-raised ${isContinuous ? 'btn-active' : ''}"
              title="Continuous Auto Loop"
              onClick=${() => playerStore.toggleLoop()}
            >
              <span class="material-symbols-outlined tw-text-sm" aria-hidden="true">autoplay</span>
            </button>
          </div>

        </div>

        <!-- Progress Bar Track -->
        <div class="mini-player-track tw-w-full tw-h-[2.5px] tw-bg-white/15 tw-rounded-full tw-overflow-hidden tw-relative">
          <div
            class="mini-player-progress-bar tw-h-full tw-bg-primary tw-shadow-[0_0_10px_rgba(var(--primary),0.9)] tw-rounded-full"
            style="width: ${(displayedProgress * 100).toFixed(1)}%;"
          ></div>
        </div>

        <!-- Primary Transport Controls -->
        <div class="mini-player-controls tw-flex tw-items-center tw-justify-center tw-gap-2">
          <button
            type="button"
            class="tw-w-7 tw-h-7 tw-rounded-md tw-text-sm tw-flex tw-items-center tw-justify-center tw-leading-none tw-shadow-subtle hover:tw-shadow-raised"
            title="Previous verse (⏮)"
            onClick=${() => playerStore.prevVerse()}
          >
            ⏮
          </button>
          <button
            type="button"
            class="tw-h-7 tw-rounded-lg tw-px-4 tw-font-bold tw-leading-none tw-shadow-subtle hover:tw-shadow-raised tw-flex tw-items-center tw-justify-center tw-text-sm ${isPlaying ? 'btn-active' : ''}"
            title=${isPlaying ? 'Stop (⏹)' : 'Play (▶)'}
            onClick=${() => playerStore.togglePlay()}
          >
            ${isPlaying ? '⏹ Stop' : '▶ Play'}
          </button>
          <button
            type="button"
            class="tw-w-7 tw-h-7 tw-rounded-md tw-text-sm tw-flex tw-items-center tw-justify-center tw-leading-none tw-shadow-subtle hover:tw-shadow-raised"
            title="Next verse (⏭)"
            onClick=${() => playerStore.nextVerse()}
          >
            ⏭
          </button>
        </div>
      </div>
    </div>
  `
}

export function mountMiniPlayer(avatarEl) {
  if (!avatarEl) return
  if (avatarEl.dataset.miniPlayerHooked === 'true') return
  avatarEl.dataset.miniPlayerHooked = 'true'

  // Ensure avatar parent container is relatively positioned
  const parent = avatarEl.parentElement || avatarEl
  const useMobilePortal = avatarEl.dataset.mobilePlayer === 'true' &&
    window.matchMedia('(pointer: coarse)').matches
  if (!useMobilePortal) parent.classList.add('tw-relative')

  let mountContainer = useMobilePortal
    ? document.querySelector('.avatar-mini-player-mount[data-mobile-portal="true"]')
    : parent.querySelector('.avatar-mini-player-mount')
  if (!mountContainer) {
    mountContainer = document.createElement('div')
    mountContainer.className = 'avatar-mini-player-mount'
    if (useMobilePortal) {
      mountContainer.dataset.mobilePortal = 'true'
      document.body.appendChild(mountContainer)
    } else {
      parent.appendChild(mountContainer)
    }
  }

  render(html`<${MiniPlayer} avatarEl=${avatarEl} />`, mountContainer)
}
