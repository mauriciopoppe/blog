export function between(lo: number, hi: number) {
  if (lo > hi) {
    const t = lo
    lo = hi
    hi = t
  }
  return lo + Math.random() * (hi - lo)
}

export function shake(obj: any, k = 5) {
  return function () {
    const rotationFactor = (between(-k, k) * Math.PI) / 180
    obj.rotation.z = rotationFactor
    obj.rotation.x = rotationFactor
    obj.rotation.y = rotationFactor
  }
}
