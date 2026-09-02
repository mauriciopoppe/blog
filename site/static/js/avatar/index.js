/**
 * Avatar interactive bundle: 3D parallax tilt + acoustic guitar mini player (Preact).
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

import { avatarTiltMain } from './avatar-tilt.js'
import { mountMiniPlayer } from './mini-player.js'
import { draggableAvatarMain } from './draggable-avatar.js'

function initAvatar() {
  avatarTiltMain()
  draggableAvatarMain()

  const avatars = document.querySelectorAll('.js-avatar-scene, .profile-avatar-scene')
  avatars.forEach((avatar) => {
    mountMiniPlayer(avatar)
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAvatar)
} else {
  initAvatar()
}

export { avatarTiltMain, mountMiniPlayer }
