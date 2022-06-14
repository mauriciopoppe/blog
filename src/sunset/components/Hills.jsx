import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSpring, animated } from 'react-spring'
import { area, line, curveLinear } from 'd3-shape'
import { randomBetween, isMobile } from './utils'

import { t } from '../../main'
import { Tree } from './Tree.jsx'

function generateData(props) {
  const { x, y, z, total } = props
  const subhills = isMobile() ? 5 : 10
  const step = window.innerWidth / subhills
  const seed = [...Array(subhills + 4).keys()].map((i) => i - 1)
  const data = seed.map((sx) => {
    // controls at which height a hill should start
    const yBaselineBottom = props.height * 0.1
    // controls the height from the bottom baseline and above
    const yHeightFromBottom = (1 - z / total) * props.height * 0.3
    const yBaselineHeight = yBaselineBottom + yHeightFromBottom

    // controls how much each hill moves up or down as noise
    const k = 100
    const yDiffRandom = randomBetween(-k, k)
    return {
      x: x(sx * step + step * randomBetween(-0.3, 0.3)),
      y: y(Math.max(yBaselineHeight + yDiffRandom, 0))
    }
  })
  return data
}

function Hill(props) {
  const { x, y, z, height, total } = props
  const [pathData] = useState(() => generateData(props))

  const [mouseProps, set] = useSpring(() => ({
    xy: [0, 0]
  }))

  const d = useMemo(
    () =>
      area()
        .x((d) => d.x)
        .y0((d) => d.y)
        .y1((d) => y(0))
        .curve(curveLinear)(pathData),
    [y, pathData]
  )

  const ld = useMemo(
    () =>
      line()
        .x((d) => d.x)
        .y((d) => d.y)
        .curve(curveLinear)(pathData),
    [pathData]
  )

  useEffect(() => {
    let lastX = 0,
      lastY = 0
    const mouseListener = ({ clientX: x, clientY: y }) => {
      const mouseXT = (x / window.innerWidth - 0.5) * 2
      const mouseYT = (y / window.innerHeight - 0.5) * 2
      const newX = (mouseXT * 100 * z) / total
      lastX = newX
      // console.log('mousext', mouseXT)
      set({ xy: [newX, lastY] })
    }

    const scrollListener = (e) => {
      const scrollT =
        (document.documentElement.scrollTop - (document.documentElement.scrollHeight - window.innerHeight - height)) /
        height
      const newY = ((z * 500) / total) * (1 - Math.max(0, scrollT))
      lastY = newY
      set({ xy: [lastX, newY] })
    }

    document.addEventListener('mousemove', mouseListener)
    document.addEventListener('scroll', scrollListener)
    return () => {
      document.removeEventListener('mousemove', mouseListener)
      document.removeEventListener('scroll', scrollListener)
    }
  }, [height, set, total, z])

  return (
    <animated.g transform={mouseProps.xy.interpolate((x, y) => `translate(${x} ${y})`)}>
      <animated.path d={d} {...props.pathStyle} />
    </animated.g>
  )
}

export function Hills({ n, ...props }) {
  return (
    <>
      {[...Array(n).keys()].map((i) => {
        const startK = 0.25
        const k = startK + ((n - i) / n) * (1 - startK)
        return <Hill key={i} z={i} total={n} pathStyle={{ fill: t(k) }} {...props} />
      })}
    </>
  )
}
