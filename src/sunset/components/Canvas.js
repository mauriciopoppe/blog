import React, { useState } from 'react'
import { useMouseState, useWindowScroll } from 'beautiful-react-hooks'

import { Hills } from './Hills'
import { Stars } from './Stars'
import { gtagEvents } from './utils'

export function Canvas({ width, height, x, y }) {
  // const { clientX, clientY } = useMouseState()
  // /**
  //  * A number in the range [-1, -1]
  //  */
  // const mouseXT = (clientX / window.innerWidth - 0.5) * 2

  const [scrollY, setScrollY] = useState(window.scrollY)
  useWindowScroll((e) => setScrollY(window.scrollY))
  /**
   * Represents how much we've scrolled inside the footer as a number in the range [0, 1]
   *
   * - Compute where the scroll watcher should start = (scroll height - height)
   * - Subtract the current scroll from where the scroll watcher starts
   * - Normalize into a number number in the range [0, 1]
   *
   * @type {number}
   */
  const scrollT = (scrollY - (document.documentElement.scrollHeight - window.innerHeight - height)) / height

  // gtag custom event
  if (scrollT > 0.8 && !gtagEvents.footerAnimation.firedOnce) {
    // eslint-disable-next-line no-undef
    gtag('event', 'footer_animation')
    gtagEvents.footerAnimation.firedOnce = true
  }

  const childProps = { width, height, x, y, scrollT, mouseXT: 0 }
  return (
    <svg
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'block',
        opacity: scrollT,
        left: 0,
        top: 0
      }}
      preserveAspectRatio="none"
    >
      <Stars n={50} {...childProps} />
      <Hills n={10} {...childProps} />
    </svg>
  )
}
