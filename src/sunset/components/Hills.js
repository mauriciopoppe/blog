import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSpring, animated } from 'react-spring'
import { area, line, curveLinear, curveBasis } from 'd3-shape'
import { randomBetween, isMobile } from './utils'

import { t } from '../../main'
import { Tree } from './Tree'

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
  const { x, y, z, mouseXT, total } = props
  const [pathData] = useState(() => generateData(props))

  const { xy } = useSpring({
    xy: [
      // to the left and right
      (mouseXT * 100 * z) / total,
      // up an down based on the scroll, front layers will move more (inverse depth)
      ((z * 500) / total) * (1 - Math.max(0, props.scrollT))
    ]
  })

  const d = useMemo(
    () =>
      area()
        .x((d) => d.x)
        .y0((d) => d.y)
        .y1((d) => y(0))
        .curve(curveLinear)(pathData),
    [y, pathData]
  )

  const l = useMemo(
    () =>
      line()
        .x((d) => d.x)
        .y((d) => d.y)
        .curve(curveLinear),
    []
  )

  const pathRef = useRef(null)
  const lineRef = useRef(null)
  // const [pathLocations, setPathLocations] = useState([])
  // post render effect to get the path node
  // useEffect(() => {
  //   /** @type SVGPathElement */
  //   const path = lineRef.current
  //   const length = path.getTotalLength()
  //   const locations = []
  //   for (let i = 1; i <= 10; i += 1) {
  //     const t = i / 10
  //     const svgPoint = path.getPointAtLength(length * t)
  //     locations.push(svgPoint)
  //   }
  //   setPathLocations(locations)
  // }, [])

  return (
    <animated.g transform={xy.interpolate((x, y) => `translate(${x} ${y})`)}>
      <animated.path ref={pathRef} d={d} {...props.pathStyle} />
      {/*<animated.path ref={lineRef} d={l(pathData)} style={{ display: 'none' }} />*/}
      {/*{z === total - 2 &&*/}
      {/*  pathLocations.map((pathLocation, i) => <Tree key={i} px={pathLocation.x} py={pathLocation.y} />)}*/}
    </animated.g>
  )
}

export function Hills({ n, ...props }) {
  return (
    <>
      {[...Array(n).keys()].map((i) => {
        const alpha = 0.5
        const k = 0 + (i / n) * 0.75
        return <Hill key={i} z={i} total={n} pathStyle={{ fill: t(k) }} {...props} />
      })}
    </>
  )
}
