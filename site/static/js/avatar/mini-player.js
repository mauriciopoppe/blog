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
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 640 : false)
  const [isAvatarDetached, setIsAvatarDetached] = useState(avatarEl?.dataset.avatarDetached === 'true')
  const hoverTimeoutRef = useRef(null)

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
      setIsMobile(window.innerWidth < 640)
    }
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Hook avatar element events
  useEffect(() => {
    if (!avatarEl) return

    const handlePositionChange = () => setIsAvatarDetached(avatarEl.dataset.avatarDetached === 'true')

    const handleAvatarEnter = () => {
      if (window.innerWidth >= 640) {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current)
          hoverTimeoutRef.current = null
        }
        setIsHovered(true)
      }
    }

    const handleAvatarLeave = () => {
      if (window.innerWidth >= 640) {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current)
        }
        hoverTimeoutRef.current = setTimeout(() => {
          setIsHovered(false)
        }, 250)
      }
    }

    const handleAvatarClick = (e) => {
      if (e.target.closest('.avatar-mini-player')) return
      if (avatarEl.dataset.avatarDragged === 'true') {
        delete avatarEl.dataset.avatarDragged
        return
      }
      if (window.innerWidth < 640) {
        setIsMobileOpen(true)
      }
      playerStore.togglePlay(avatarEl)
    }

    avatarEl.addEventListener('mouseenter', handleAvatarEnter)
    avatarEl.addEventListener('mouseleave', handleAvatarLeave)
    avatarEl.addEventListener('click', handleAvatarClick)
    avatarEl.addEventListener('avatar-position-change', handlePositionChange)

    return () => {
      avatarEl.removeEventListener('mouseenter', handleAvatarEnter)
      avatarEl.removeEventListener('mouseleave', handleAvatarLeave)
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
      </style>

      <div class="mini-player-body tw-flex tw-flex-col tw-gap-2">
        <!-- Header: Song Info & Current Section -->
        <div class="mini-player-header tw-flex tw-items-center tw-justify-between tw-gap-2 tw-border-b tw-border-white/10 tw-pb-1.5">
          <div
            class="tw-flex tw-items-center tw-gap-2 tw-min-w-0 tw-flex-1 ${playerStore.songs.length > 1 ? 'tw-cursor-pointer hover:tw-opacity-90 tw-transition-opacity' : ''}"
            title=${playerStore.songs.length > 1 ? 'Click to switch song' : ''}
            onClick=${playerStore.songs.length > 1 ? () => playerStore.cycleSong(avatarEl) : null}
          >
            <span class="mini-player-icon tw-text-base tw-leading-none tw-shrink-0">${song.icon}</span>
            <div class="mini-player-meta tw-flex tw-flex-col tw-min-w-0 tw-leading-tight">
              <span class="mini-player-song-name tw-text-[var(--grey-lighter)] tw-font-bold tw-truncate">${song.name}</span>
              <div class="tw-flex tw-items-center tw-gap-1 tw-text-[0.68rem] tw-mt-0.5">
                <span class="mini-player-artist tw-text-primary tw-font-medium tw-truncate">
                  ${song.artist}${playerStore.songs.length > 1 ? ' ▾' : ''}
                </span>
                <span class="tw-text-white/30">•</span>
                <span class="mini-player-verse-title tw-text-[var(--grey-light)] tw-font-semibold tw-truncate">
                  ${phrase ? phrase.title : 'Loading...'}
                </span>
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
        <div class="mini-player-lcd tw-flex tw-items-stretch tw-justify-between tw-bg-[var(--grey-dark)] tw-rounded-lg tw-px-2 tw-py-1">
          <!-- Column 1: BAR . BEAT -->
          <div class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-pr-2 tw-border-r tw-border-white/10 tw-min-w-[52px]">
            <div class="tw-font-mono tw-text-sm tw-font-bold tw-tracking-tight tw-leading-none tw-text-[var(--grey-lighter)]">
              ${formatLcdBar(currentBar)}<span class="tw-text-white/30">.</span><span class="tw-text-primary">${currentBeat || 1}</span>
            </div>
            <div class="tw-flex tw-justify-between tw-w-full tw-text-[7.5px] tw-font-bold tw-text-[var(--grey-light)] tw-tracking-wider tw-mt-0.5 tw-uppercase tw-leading-none">
              <span>BAR</span>
              <span>BEAT</span>
            </div>
          </div>

          <!-- Column 2: TEMPO -->
          <div class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-px-2 tw-border-r tw-border-white/10">
            <div class="tw-font-mono tw-text-sm tw-font-bold tw-leading-none tw-text-[var(--grey-lighter)]">
              ${song.bpm}
            </div>
            <div class="tw-text-[7.5px] tw-font-bold tw-text-[var(--grey-light)] tw-tracking-wider tw-mt-0.5 tw-uppercase tw-leading-none">
              TEMPO
            </div>
          </div>

          <!-- Column 3: TIME SIGNATURE & KEY -->
          <div class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-px-2 tw-border-r tw-border-white/10">
            <div class="tw-text-[0.72rem] tw-font-bold tw-leading-none tw-text-[var(--grey-lighter)]">
              ${(metadata && metadata.timeSignature) || song.timeSignature || '6/8'}
            </div>
            <div class="tw-text-[0.65rem] tw-font-medium tw-text-primary tw-leading-none tw-mt-0.5">
              ${(metadata && metadata.key) || song.key || 'Bmin'}
            </div>
          </div>

          <!-- Column 4: Side Quick Toggles (Metro & Auto - Icon Buttons) -->
          <div class="tw-flex tw-items-center tw-justify-center tw-gap-1.5 tw-pl-2.5">
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
              title="Continuous Auto Loop (🔁)"
              onClick=${() => playerStore.toggleLoop()}
            >
              🔁
            </button>
          </div>
        </div>

        <!-- Progress Bar Track -->
        <div class="mini-player-track tw-w-full tw-h-[2.5px] tw-bg-white/15 tw-rounded-full tw-overflow-hidden tw-relative">
          <div
            class="mini-player-progress-bar tw-h-full tw-bg-primary tw-shadow-[0_0_10px_rgba(var(--primary),0.9)] tw-rounded-full tw-transition-all tw-duration-75"
            style="width: ${(progress * 100).toFixed(1)}%;"
          ></div>
        </div>

        <!-- Primary Transport Controls -->
        <div class="mini-player-controls tw-flex tw-items-center tw-justify-center tw-gap-2">
          <button
            type="button"
            class="tw-rounded-lg tw-px-3 tw-py-1 tw-font-bold tw-leading-none tw-shadow-subtle hover:tw-shadow-raised tw-flex tw-items-center tw-justify-center tw-gap-1"
            title="Previous verse (⏮)"
            onClick=${() => playerStore.prevVerse(avatarEl)}
          >
            ⏮
          </button>
          <button
            type="button"
            class="tw-rounded-lg tw-px-4 tw-py-1.5 tw-font-bold tw-leading-none tw-shadow-subtle hover:tw-shadow-raised tw-flex tw-items-center tw-justify-center tw-text-sm ${isPlaying ? 'btn-active' : ''}"
            title=${isPlaying ? 'Pause (⏸)' : 'Play (▶)'}
            onClick=${() => playerStore.togglePlay(avatarEl)}
          >
            ${isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <button
            type="button"
            class="tw-rounded-lg tw-px-3 tw-py-1 tw-font-bold tw-leading-none tw-shadow-subtle hover:tw-shadow-raised tw-flex tw-items-center tw-justify-center tw-gap-1"
            title="Next verse (⏭)"
            onClick=${() => playerStore.nextVerse(avatarEl)}
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
  parent.classList.add('tw-relative')

  let mountContainer = parent.querySelector('.avatar-mini-player-mount')
  if (!mountContainer) {
    mountContainer = document.createElement('div')
    mountContainer.className = 'avatar-mini-player-mount'
    parent.appendChild(mountContainer)
  }

  render(html`<${MiniPlayer} avatarEl=${avatarEl} />`, mountContainer)
}
