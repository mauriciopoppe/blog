/**
 * Returns a random number between a and b
 * @param a {number}
 * @param b {number}
 * @returns {number}
 */
export function randomBetween(a, b) {
  return a + Math.random() * (b - a)
}

export function isMobile() {
  const toMatch = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i]

  return toMatch.some((toMatchItem) => {
    return navigator.userAgent.match(toMatchItem)
  })
}

/**
 * Captures internal state of gtag custom events
 * @type {object}
 */
export const gtagEvents = {
  footerAnimation: {
    firedOnce: false
  }
}
