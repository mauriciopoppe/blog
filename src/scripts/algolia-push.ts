/*
 * Builds the Algolia index from Hugo content and pushes it.
 *
 * The search UI sorts results by popularity. View counts used to come from a
 * local Google Analytics export, but that file is gone for good. The
 * popularity order is now a curated, in-repo list (POPULARITY_ORDER, most
 * popular first). Each record carries a `rank` field (lower = more popular)
 * that the search overlay sorts by; notes not listed rank after all listed
 * ones. Edit POPULARITY_ORDER whenever the ranking should change.
 *
 * Usage:
 *   ALGOLIA_WRITE_KEY=... bun run generate:algolia:send
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { algoliasearch } from 'algoliasearch'

const ROOT_DIR = path.resolve(__dirname, '../..')
const CONFIG = path.resolve(ROOT_DIR, 'site/config/_default/config.yaml')
const OUTPUT = path.resolve(ROOT_DIR, 'dist/sitemap.json')
const INDEX_NAME = 'MY_INDEX'
const APP_ID = '82T3453LSW'
const WRITE_KEY = process.env.ALGOLIA_WRITE_KEY

// Curated popularity order, most popular first. Paths are relative to
// site/content (e.g. "notes/computer-graphics/quaternions"). Notes that aren't
// listed here rank after all listed ones in the search overlay.
const POPULARITY_ORDER: string[] = [
  'notes/computer-graphics/transformation-matrix',
  'notes/performance-fundamentals',
  'notes/queuing-theory-for-systems-engineers',
  'notes/benchmarking-and-capacity-planning',
  'notes/computer-graphics/quaternions',
  'notes/computer-graphics/view-transform',
  'notes/computer-graphics/projection-transform',
  'notes/computer-graphics/combining-transformations',
  'notes/pareto-frontier-in-inference-serving',
  'notes/computer-graphics/screen-space',
  'notes/computer-graphics/culling-clipping',
  'notes/computer-science/computation/promises',
  'notes/computer-science/data-structures/graphs/introduction',
  'notes/mathematics/calculus/introduction',
  'notes/mathematics/numeral-systems/complex-numbers',
  'notes/computer-science/system-design/kafka',
  'notes/computer-science/system-design/cassandra',
  'notes/computer-science/system-design/kubernetes',
  'notes/mathematics/numeral-systems/quaternions',
  'notes/mathematics/geometry/projective-space',
  'notes/computer-graphics/ray-tracing',
  'notes/computer-graphics/rendering',
  'notes/computer-graphics/rotation',
  'notes/computer-graphics/coordinate-systems',
  'notes/computer-graphics/orthographic-projection',
  'notes/computer-graphics/perspective-projection',
  'notes/computer-graphics/first-person-camera',
  'notes/computer-graphics/surface-shading',
  'notes/computer-graphics/euler-angles',
  'notes/computer-graphics/normals',
  'notes/computer-graphics/translation',
  'notes/computer-graphics/scale',
  'notes/computer-graphics/shearing',
  'notes/mathematics/geometry/vector-spaces',
  'notes/mathematics/linear-algebra/eigenvalues-and-eigenvectors',
  'notes/mathematics/calculus/derivative',
  'notes/mathematics/calculus/integral',
  'notes/software-engineer-interview-preparation',
  'notes/computer-science/system-design/back-of-the-envelope-calculations',
  'notes/computer-science/system-design/partitioning',
  'notes/computer-science/system-design/non-functional-requirements',
  'notes/computer-science/data-structures/memtable-sstable',
  'notes/computer-science/data-structures/data-structures-for-massive-datasets',
  'notes/computer-science/artificial-intelligence/machine-learning/introduction',
  'notes/mathematics/probability/bayesian-networks',
  'notes/mathematics/number-theory/modular-arithmetic',
  'notes/mathematics/number-theory/euclidean-algorithm',
  'notes/mathematics/number-theory/divisibility',
  'notes/mathematics/number-theory/primality-test',
  'notes/mathematics/number-theory/erathostenes-sieve',
  'notes/mathematics/number-theory/integer-factorization',
  'notes/mathematics/number-theory/binary-exponentiation',
  'notes/mathematics/number-theory/chinese-remainder-theorem',
  'notes/mathematics/geometry/triangle',
  'notes/mathematics/geometry/affine-spaces',
  'notes/mathematics/geometry/geometric-tests',
  'notes/mathematics/calculus/taylor-theorem-infinite-series',
  'notes/mathematics/number-theory/eulers-phi',
  'notes/mathematics/number-theory/extended-euclidean-algorithm',
  'notes/mathematics/number-theory/discrete-logarithm',
  'notes/mathematics/number-theory/divisor-function',
  'notes/mathematics/number-theory/prime-factors-factorial',
  'notes/mathematics/number-theory/special-factorial-modulo-m',
  'notes/computer-science/data-structures/graphs/traversal',
  'notes/computer-science/data-structures/graphs/components',
  'notes/computer-science/data-structures/graphs/topological-sorting',
  'notes/computer-science/data-structures/graphs/tree/introduction',
  'notes/computer-science/data-structures/graphs/tree/spanning-tree',
  'notes/computer-science/data-structures/graphs/special/eulerian-graphs',
  'notes/computer-science/data-structures/graphs/special/hamiltonian_graphs',
  'notes/computer-science/data-structures/graphs/cut-edges',
  'notes/computer-science/data-structures/graphs/cut-vertices',
  'notes/computer-science/data-structures/graphs/single-source-shortest-path',
  'notes/computer-science/artificial-intelligence/machine-learning/hyperparameter-tuning',
  'notes/computer-science/artificial-intelligence/machine-learning/expectation-maximization',
  'notes/computer-science/operating-systems/bin/gcc',
  'notes/computer-science/operating-systems/bin/make',
  'notes/computer-science/operating-systems/bin/cmake',
  'notes/computer-science/programming-languages/cpp-refresher',
  'notes/home-server-setup',
  'notes/tmux-to-zellij',
  'notes/backing-track-for-open-mic',
  'notes/return-of-the-builder',
  'notes/productivity-skills',
  'notes/learning-french',
  'notes/learning-japanese',
  'notes/documenting-my-life',
  'notes/bachata'
]

interface AlgoliaRecord {
  objectID: string
  uri: string
  title: string
  rank?: number
  [key: string]: unknown
}

function enrich(records: AlgoliaRecord[]) {
  const rankByUri = new Map<string, number>(
    POPULARITY_ORDER.map((uri, index) => [uri, index + 1])
  )
  for (const record of records) {
    const uri = (record.uri || '').replace(/^content\//, '')
    record.rank = rankByUri.get(uri) ?? 10000
  }
}

async function main() {
  if (!WRITE_KEY) {
    console.error('ALGOLIA_WRITE_KEY is required')
    process.exit(1)
  }

  // Build the raw index from Hugo content (no -s flag, local file only).
  execSync(`hugo-algolia -i "site/content/**" --config ${CONFIG} -o ${OUTPUT}`, { stdio: 'inherit', cwd: ROOT_DIR })

  const records = JSON.parse(fs.readFileSync(OUTPUT, 'utf8')) as AlgoliaRecord[]
  enrich(records)

  const client = algoliasearch(APP_ID, WRITE_KEY)
  const task = await client.replaceAllObjects({
    indexName: INDEX_NAME,
    objects: records
  })
  await client.waitForTask({ indexName: INDEX_NAME, taskID: task.moveOperationResponse.taskID })
  console.log(`Pushed ${records.length} records to ${INDEX_NAME}`)

  // Make the index rank notes by the curated popularity order. Algolia applies
  // customRanking as the last ranking criterion: with an empty query it decides
  // the order (our popularity list), and for typed queries it breaks ties
  // between equally relevant results. This keeps the ordering on the Algolia
  // side instead of a client-side sort.
  const settingsTask = await client.setSettings({
    indexName: INDEX_NAME,
    indexSettings: { customRanking: ['asc(rank)'] }
  })
  await client.waitForTask({ indexName: INDEX_NAME, taskID: settingsTask.taskID })
  console.log(`Configured ranking for ${INDEX_NAME}`)
}

main()
