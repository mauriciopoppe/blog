import bunny from 'bunny'

const hoc = regl => {
  class Bunny {
    constructor (props) {
      Object.assign(this, props)
      this.positions = regl.buffer(bunny.positions)
      this.cells = regl.buffer(bunny.cells)
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
            const c = this.center
            return [
              1, 0, 0, 0,
              0, 1, 0, 0,
              0, 0, 1, 0,
              -c[0], -c[1], -c[2], 1
            ]
          },
          view: regl.prop('view'),
          projection: regl.prop('projection')
        },

        attributes: {
          position: bunny.positions
        },

        elements: bunny.cells
      })
    }
  }

  return Bunny
}

export default hoc
