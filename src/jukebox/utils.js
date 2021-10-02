export function between(lo, hi) {
  return lo + Math.random() * (hi - lo)
}

export function shake(obj, k = 5) {
  return function () {
    const rotationFactor = between(-k, k) * Math.PI / 180
    obj.rotation.z = rotationFactor
    obj.rotation.x = rotationFactor
    obj.rotation.y = rotationFactor
  }
}
