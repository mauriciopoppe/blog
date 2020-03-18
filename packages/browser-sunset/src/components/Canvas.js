import React, { useEffect, useState } from 'react'
import { interpolateMagma, scaleLinear } from 'd3-scale'

import { Hill } from './Hill'

const x = scaleLinear()
  .domain([0, window.innerWidth])
  .range([0, window.innerWidth])
const y = scaleLinear()
  .domain([0, 500])
  .range([500, 0])

function getScrollPosition() {
  return { x: window.pageXOffset, y: window.pageYOffset };
}

export function useScrollPosition() {
  const [position, setScrollPosition] = useState(getScrollPosition());

  useEffect(() => {
    let requestRunning;
    function handleScroll() {
      requestRunning = window.requestAnimationFrame(() => {
        setScrollPosition(getScrollPosition());
        cancelAnimationFrame(requestRunning);
      });
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return position;
}

export function Canvas () {
  const scrollPosition = useScrollPosition()
  const style = { width: '100%', height: '100%' }
  const n = 5
  return (
    <div style={style}>
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'block',
          left: 0,
          top: 0
        }}
        preserveAspectRatio='none'
      >
        {[...Array(n).keys()].map(i => (
          <Hill
            key={i}
            order={i}
            x={x}
            y={y}
            depth={i}
            total={n}
            scrollPosition={scrollPosition}
            fill={interpolateMagma(1 - (0.3 + (i / n) * 0.5))}
          />
        ))}
      </svg>
    </div>
  )
}
