if (!process.env.ALGOLIA_WRITE_KEY || process.env.ALGOLIA_WRITE_KEY === '') {
  throw new Error('ALGOLIA_WRITE_KEY must be defined')
}
