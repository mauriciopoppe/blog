export class Vector {
  constructor (x, y) {
    this.set(x, y)
  }

  set (x, y) {
    this.x = x
    this.y = y
  }

  add (x, y) { return new Vector(this.x + x, this.y + y) }

  norm () {
    const { x, y } = this
    const d = Math.sqrt(x * x + y * y)
    return this.scale(1 / d)
  }

  neg (v) { return new Vector(-this.x, -this.y) }

  addVector (v) { return this.add(v.x, v.y) }

  scale (k) { return new Vector(this.x * k, this.y * k) }
}

let id = 0
export class Entity {
  constructor (m, x, y) {
    this.id = id++
    this.m = m
    this.a = new Vector(0, 0)
    this.v = new Vector(0, 0)
    this.p = new Vector(x, y)
    this.f = new Vector(0, 0)
  }

  addForce (v) { this.f = this.f.addVector(v) }

  reset () { this.f.set(0, 0) }

  getAngle () {
    // based on the velocity
    let angle
    angle = Math.atan(this.v.y / this.v.x)

    // if (y > 0) angle = Math.cos(y)
    // else angle = -Math.cos(y)
    // console.log(this.v.norm(), angle)
    return angle * 180 / Math.PI
  }
}

export class Simulation {
  constructor () {
    this.globalForce = new Vector(0, 0)
    this.entities = []
  }

  addEntity (e) { this.entities.push(e) }

  removeEntity (e) {
    this.entities.splice(this.entities.indexOf(e), 1)
  }

  addGlobalForce (v) { this.globalForce = this.globalForce.addVector(v) }

  run (t) {
    this.entities.forEach(e => {
      let accumulatedForce = e.f.addVector(this.globalForce)

      // a = f * 1/m
      const acc = accumulatedForce.scale(1 / e.m)
      // v' = v + at
      e.v = e.v.scale(Math.pow(0.9, t)).addVector(acc.scale(t))
      // d' = d + vt + 0.5at^2
      e.p = e.p.addVector(e.v.scale(t))

      e.reset()
    })
  }
}
