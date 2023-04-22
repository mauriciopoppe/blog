import React from 'react'
import { animated } from 'react-spring'

function genBody() {
  return `
      M -2.5 5
      h 5
      V 20
      h -5
      z`
}

function genTree() {
  return `M   0  0
        C   0 10  18 40   0 40
        S          0 10   0  0
        Z`
}

export const Tree = React.memo((props) => {
  const { px, py } = props
  // const [counter, setCounter] = useState(0)
  // const [shootingStarProps, set] = useSpring(() => ({
  //   cx: 0,
  //   cy: 0
  // }))
  //
  // useEffect(() => {
  //   setTimeout(() => {
  //     set({ cx: x(Math.random() * width), cy: y(Math.random() * height), r: 0 })
  //     setCounter(counter + 1)
  //   }, 3000)
  // }, [set, width, height, counter])

  return (
    <g transform={`translate(${px} ${py})`}>
      <animated.path {...props.pathStyle} stroke={'var(--primary)'} d={genBody()} />
      <animated.path {...props.pathStyle} transform={'translate(0 -30)'} stroke={'var(--primary)'} d={genTree()} />
    </g>
  )
})
