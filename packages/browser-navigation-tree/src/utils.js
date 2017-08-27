export function transform () {
  const methods = ['rotate', 'translate', 'scale', 'matrix', 'skewX', 'skewY']
  const attr = methods.reduce((old, cur) => Object.assign(old, { [cur]: [] }), {})

  const obj = {
    parse (str) {
      methods.forEach(m => {
        const match = str.match(new RegExp(m + '\\((.*)\\)'))
        if (match) this[m](...match[1].split(','))
      })
      return obj
    },
    toString () {
      return methods.reduce((old, m) => {
        if (attr[m].length) return `${old} ${m}(${attr[m].join(',')})`
        return old
      }, '')
    }
  }

  methods.forEach(m => {
    Object.assign(obj, {
      [m]: (...args) => {
        if (!args.length) return attr[m]
        attr[m] = args
        return obj
      }
    })
  })

  return obj
}
