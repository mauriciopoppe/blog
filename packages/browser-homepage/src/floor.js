import primitivePlane from 'primitive-plane'
import { mat4 } from 'gl-matrix'

const hoc = regl => {
  class Floor {
    constructor (props) {
      Object.assign(this, props)
      this.plane = primitivePlane(
        10,
        10,
        10,
        10,
        { quads: true }
      )
      this.draw = regl({
        vert: `
          uniform mat4 projection, view, model;
          attribute vec3 position;

          void main () {
            gl_Position = projection * view * model * vec4(position, 1);
          }
        `,
        frag: `
          void main () {
            gl_FragColor = vec4(1, 0, 0, 1);
          }
        `,
        uniforms: {
          model: function () {
            return mat4.fromRotation([],
              -Math.PI / 2,
              [1, 0, 0]
            )
          },
          view: regl.prop('view'),
          projection: regl.prop('projection')
        },
        attributes: {
          position: this.plane.positions
        },
        elements: this.plane.cells,

        primitive: 'lines'
      })
    }
  }

  return Floor
}

export default hoc
