/**
 * Avatar Mini Bar Player (Preact + HTM)
 *
 * Body-mounted responsive singleton mini player:
 * - Mobile (< 640px): Floating bottom dock fixed directly to browser viewport.
 * - Desktop (>= 640px): Viewport-clamped anchored popover with instant positioning.
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

let activeAvatarEl = null
let openMobileCallback = null
let closeMobileCallback = null

function calculateDesktopPosition(avatarEl, popupEl) {
  if (!avatarEl) return { top: 0, left: 0 }
  const rect = avatarEl.getBoundingClientRect()
  const popupWidth = popupEl ? popupEl.offsetWidth : 280
  const popupHeight = popupEl ? popupEl.offsetHeight : 160

  let left = rect.left + rect.width / 2 - popupWidth / 2
  left = Math.max(16, Math.min(window.innerWidth - popupWidth - 16, left))
  const top = rect.top - popupHeight - 8

  return { top, left }
}

export function MiniPlayer() {
  const [storeState, setStoreState] = useState(playerStore.getState())
  const [isHovered, setIsHovered] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 640 : false)
  const [desktopPos, setDesktopPos] = useState({ top: 0, left: 0 })
  const hoverTimeoutRef = useRef(null)
  const popupRef = useRef(null)

  openMobileCallback = () => setIsMobileOpen(true)
  closeMobileCallback = () => {
    setIsMobileOpen(false)
    if (playerStore.getState().isPlaying) {
      playerStore.stop()
    }
  }

  // Subscribe to store updates
  useEffect(() => {
    const unsubscribe = playerStore.subscribe((state) => {
      setStoreState(state)
    })
    return unsubscribe
  }, [])

  // Position & Viewport tracking
  const updateLayout = () => {
    const mobile = window.innerWidth < 640
    setIsMobile(mobile)

    if (!mobile && activeAvatarEl) {
      const pos = calculateDesktopPosition(activeAvatarEl, popupRef.current)
      setDesktopPos(pos)
    }
  }

  useEffect(() => {
    updateLayout()
    window.addEventListener('resize', updateLayout, { passive: true })
    window.addEventListener('scroll', updateLayout, { passive: true })

    const handleAvatarEnter = () => {
      if (window.innerWidth >= 640) {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current)
          hoverTimeoutRef.current = null
        }
        if (activeAvatarEl) {
          const pos = calculateDesktopPosition(activeAvatarEl, popupRef.current)
          setDesktopPos(pos)
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

    window.addEventListener('avatar-player-enter', handleAvatarEnter)
    window.addEventListener('avatar-player-leave', handleAvatarLeave)

    return () => {
      window.removeEventListener('resize', updateLayout)
      window.removeEventListener('scroll', updateLayout)
      window.removeEventListener('avatar-player-enter', handleAvatarEnter)
      window.removeEventListener('avatar-player-leave', handleAvatarLeave)
    }
  }, [])

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

  const { song, metadata, phrase, isPlaying, isContinuous, isMetronome, progress, currentBar, currentBeat } = storeState

  // Visibility logic: on mobile follows isMobileOpen; on desktop follows isHovered
  const isVisible = isMobile ? isMobileOpen : isHovered

  // Position styling
  let containerStyles = {}
  let layoutClasses = ''

  if (isMobile) {
    layoutClasses = `
      tw-fixed tw-bottom-4 tw-left-4 tw-right-4 tw-z-[99999] tw-max-w-sm tw-mx-auto
      ${isVisible ? 'tw-translate-y-0 tw-opacity-100 tw-pointer-events-auto' : 'tw-translate-y-8 tw-opacity-0 tw-pointer-events-none'}
    `
  } else {
    layoutClasses = `
      tw-fixed tw-z-[99999] tw-w-max tw-max-w-[calc(100vw-32px)]
      ${isVisible ? 'tw-translate-y-0 tw-scale-100 tw-opacity-100 tw-pointer-events-auto' : 'tw-translate-y-2 tw-scale-[0.96] tw-opacity-0 tw-pointer-events-none'}
    `
    containerStyles = {
      top: `${desktopPos.top}px`,
      left: `${desktopPos.left}px`
    }
  }

  const popupClasses = `
    avatar-mini-player tw-text-xs tw-backdrop-blur-md tw-border tw-border-[var(--ring-border)]
    tw-rounded-xl tw-p-2.5 tw-shadow-deep tw-box-border tw-select-none
    ${layoutClasses}
  `

  return html`
    <div
      ref=${popupRef}
      class=${popupClasses}
      style=${{
        background: 'color-mix(in srgb, var(--grey-darker) 94%, transparent)',
        transition: 'opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        ...containerStyles
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
            onClick=${playerStore.songs.length > 1 ? () => playerStore.cycleSong(activeAvatarEl) : null}
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
            onClick=${() => playerStore.prevVerse(activeAvatarEl)}
          >
            ⏮
          </button>
          <button
            type="button"
            class="tw-rounded-lg tw-px-4 tw-py-1.5 tw-font-bold tw-leading-none tw-shadow-subtle hover:tw-shadow-raised tw-flex tw-items-center tw-justify-center tw-text-sm ${isPlaying ? 'btn-active' : ''}"
            title=${isPlaying ? 'Pause (⏸)' : 'Play (▶)'}
            onClick=${() => playerStore.togglePlay(activeAvatarEl)}
          >
            ${isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <button
            type="button"
            class="tw-rounded-lg tw-px-3 tw-py-1 tw-font-bold tw-leading-none tw-shadow-subtle hover:tw-shadow-raised tw-flex tw-items-center tw-justify-center tw-gap-1"
            title="Next verse (⏭)"
            onClick=${() => playerStore.nextVerse(activeAvatarEl)}
          >
            ⏭
          </button>
        </div>
      </div>
    </div>
  `
}

let isGlobalMounted = false

export function mountMiniPlayer(avatarEl) {
  if (!avatarEl) return

  // Mount directly to document.body root to guarantee true viewport-relative fixed positioning
  if (!isGlobalMounted && typeof document !== 'undefined') {
    isGlobalMounted = true
    let rootContainer = document.getElementById('avatar-mini-player-root')
    if (!rootContainer) {
      rootContainer = document.createElement('div')
      rootContainer.id = 'avatar-mini-player-root'
      document.body.appendChild(rootContainer)
    }
    render(html`<${MiniPlayer} />`, rootContainer)
  }

  if (avatarEl.dataset.miniPlayerHooked === 'true') return
  avatarEl.dataset.miniPlayerHooked = 'true'

  avatarEl.addEventListener('mouseenter', () => {
    activeAvatarEl = avatarEl
    if (window.innerWidth >= 640) {
      window.dispatchEvent(new CustomEvent('avatar-player-enter'))
    }
  })

  avatarEl.addEventListener('mouseleave', () => {
    if (window.innerWidth >= 640) {
      window.dispatchEvent(new CustomEvent('avatar-player-leave'))
    }
  })

  avatarEl.addEventListener('click', (e) => {
    if (e.target.closest('.avatar-mini-player')) return
    activeAvatarEl = avatarEl
    if (window.innerWidth < 640 && openMobileCallback) {
      openMobileCallback()
    }
    playerStore.togglePlay(avatarEl)
  })
}
