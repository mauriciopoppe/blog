/*
 * Math and Systems Terms Dictionary (Grouped by Category)
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

export interface MathTermDefinition {
  symbol: string
  name: string
  category: 'Queuing Theory' | 'Latency Metric' | 'System Capacity' | 'LLM Inference' | 'Statistical Metric'
  unit?: string
  summary: string
  formulas?: string[]
  insight: string
}

export type TermCategory = 'queuing' | 'systems' | 'llm'

export const SYSTEMS_TERMS: Record<string, MathTermDefinition> = {
  lambda: {
    symbol: '\\lambda',
    name: 'Arrival Rate',
    category: 'System Capacity',
    unit: 'req/s',
    summary: 'The rate at which incoming requests arrive at the system per unit time.',
    formulas: [
      '\\lambda = \\frac{N}{\\Delta t}',
      'N = \\lambda \\cdot W \\quad \\text{(Little\'s Law)}',
      '\\rho = \\frac{\\lambda}{c \\cdot \\mu} \\quad \\text{(Utilization)}'
    ],
    insight: 'In open-loop systems (real internet users), arrivals occur independently of server responsiveness. When demand λ approaches cluster capacity c·μ, queue wait times explode.'
  },
  mu: {
    symbol: '\\mu',
    name: 'Service Rate',
    category: 'System Capacity',
    unit: 'req/s/core',
    summary: 'The maximum processing speed of a single worker core or thread when continuously busy.',
    formulas: [
      '\\mu = \\frac{1}{S}',
      '\\text{Cluster Capacity} = c \\cdot \\mu'
    ],
    insight: 'Service rate is determined by hardware performance and code execution efficiency. It represents the reciprocal of active service time S.'
  },
  rho: {
    symbol: '\\rho',
    name: 'Resource Utilization',
    category: 'Queuing Theory',
    unit: '% (or 0.0 – 1.0)',
    summary: 'The fraction of total processing capacity currently in active use across all available worker cores.',
    formulas: [
      '\\rho = \\frac{\\lambda}{c \\cdot \\mu} = \\frac{\\sum T_{\\text{busy}}}{c \\cdot \\Delta t}',
      '\\text{Headroom} = 1 - \\rho'
    ],
    insight: 'Due to stochastic request clumping, systems enter an exponential latency knee around ρ ≈ 75%. Sizing steady-state workloads above 80% leaves insufficient headroom to absorb traffic spikes.'
  },
  W: {
    symbol: 'W',
    name: 'Server Response Time',
    category: 'Latency Metric',
    unit: 'seconds / ms',
    summary: 'The total duration a request spends inside the server boundary from queue arrival until completion.',
    formulas: [
      'W = W_q + S',
      'W = \\frac{S}{1 - \\rho} = \\frac{1}{\\mu - \\lambda} \\quad (M/M/1)'
    ],
    insight: 'Total server time is the sum of queue wait time (W_q) and active computation (S). As utilization ρ approaches 100%, W is dominated almost entirely by queue wait time.'
  },
  S: {
    symbol: 'S',
    name: 'Service Time',
    category: 'Latency Metric',
    unit: 'seconds / ms',
    summary: 'The time a request actively executes on a worker core once it exits the waiting queue.',
    formulas: [
      'S = \\frac{1}{\\mu}',
      'W = W_q + S'
    ],
    insight: 'Service time represents the uncontended latency floor (observed when ρ → 0). Optimizing algorithms or hardware lowers S, directly increasing processing capacity μ.'
  },
  L: {
    symbol: 'L',
    name: 'In-Flight Requests (Concurrency)',
    category: 'System Capacity',
    unit: 'requests',
    summary: 'The average total number of requests currently inside the system (both waiting in queue and actively executing).',
    formulas: [
      'L = \\lambda \\cdot W \\quad \\text{(Little\'s Law)}',
      'L = \\frac{\\rho}{1 - \\rho} \\quad (M/M/1)'
    ],
    insight: 'Little\'s Law guarantees that concurrency is strictly the product of throughput and latency. If latency doubles at constant traffic, in-flight concurrency doubles.'
  },
  c: {
    symbol: 'c',
    name: 'Parallel Worker Count',
    category: 'System Capacity',
    unit: 'cores / servers',
    summary: 'The number of independent parallel servers, worker processes, or CPU cores processing requests from the queue.',
    formulas: [
      '\\text{Total Capacity} = c \\cdot \\mu',
      '\\rho = \\frac{\\lambda}{c \\cdot \\mu}'
    ],
    insight: 'Under a shared queue (M/M/c), pooling capacity across c workers reduces average queue wait time roughly by a factor of 1/c compared to isolated single-worker queues.'
  }
}

export const QUEUING_TERMS: Record<string, MathTermDefinition> = {
  ...SYSTEMS_TERMS,
  W_q: {
    symbol: 'W_q',
    name: 'Queue Wait Time',
    category: 'Queuing Theory',
    unit: 'seconds / ms',
    summary: 'The duration a request spends stalled in the FIFO queue waiting for a worker core to become free before execution begins.',
    formulas: [
      'W_q = \\frac{\\rho \\cdot S}{1 - \\rho} = \\frac{\\rho}{\\mu(1 - \\rho)} \\quad (M/M/1)',
      'W_q = \\frac{\\rho \\cdot S}{1 - \\rho} \\left(\\frac{1 + C_v^2}{2}\\right) \\quad (M/G/1 \\text{ P-K})',
      'W_q = \\frac{C(c, a) \\cdot S}{c(1 - \\rho)} \\quad (M/M/c \\text{ Erlang C})'
    ],
    insight: 'Queue wait is 100% idle latency overhead where zero useful compute is performed. It doubles between 50% → 75% utilization, and explodes 10x past 90% utilization.'
  },
  L_q: {
    symbol: 'L_q',
    name: 'Queue Depth (Queue Length)',
    category: 'Queuing Theory',
    unit: 'requests',
    summary: 'The average number of requests waiting in the queue buffer before worker dispatch.',
    formulas: [
      'L_q = \\lambda \\cdot W_q \\quad \\text{(Little\'s Law)}',
      'L_q = \\frac{\\rho^2}{1 - \\rho} \\quad (M/M/1)'
    ],
    insight: 'A non-zero queue depth signals that incoming bursts are arriving faster than instantaneous worker availability. Monitoring L_q provides early warning before full saturation.'
  },
  Cv: {
    symbol: 'C_v',
    name: 'Coefficient of Variation',
    category: 'Statistical Metric',
    unit: 'dimensionless',
    summary: 'The normalized measure of service time variance, defined as standard deviation divided by mean service time.',
    formulas: [
      'C_v = \\frac{\\sigma_S}{\\mu_S}',
      '\\text{P-K Multiplier} = \\frac{1 + C_v^2}{2}'
    ],
    insight: 'High variance (bimodal queries, long-tail payloads) creates Head-of-Line blocking. Deterministic execution (Cv = 0) cuts queue wait in half (0.5x), while high variance (Cv = 3) inflates queue wait 5x.'
  }
}

export const LLM_TERMS: Record<string, MathTermDefinition> = {
  TTFT: {
    symbol: '\\text{TTFT}',
    name: 'Time to First Token',
    category: 'LLM Inference',
    unit: 'ms',
    summary: 'The duration from when a user sends a prompt to when the server streams back the very first output token.',
    formulas: [
      '\\text{TTFT} = 2 \\cdot t_{\\text{net}} + t_{\\text{queue}} + t_{\\text{prefill}}',
      '\\text{Prefill FLOPs} \\approx 2 \\cdot P \\cdot \\text{ISL}'
    ],
    insight: 'Determined by the prompt prefill phase. Because the GPU computes all input tokens in parallel, prefill is heavily Compute-Bound, saturating tensor cores at near 100% duty cycle.'
  },
  TPOT: {
    symbol: '\\text{TPOT}',
    name: 'Time Per Output Token',
    category: 'LLM Inference',
    unit: 'ms/token',
    summary: 'The generation latency for each subsequent token during autoregressive decode (often perceived as streaming speed).',
    formulas: [
      '\\text{TPOT} = \\frac{\\text{Decode Phase Latency}}{\\text{Output Tokens}}',
      '\\text{Streaming Speed} = \\frac{1}{\\text{TPOT}} \\quad (\\text{tok/s/stream})'
    ],
    insight: 'Decode is Memory-Bandwidth-Bound. For every single generated token, the GPU must stream all parameter weights (~2 bytes per parameter in FP16) from HBM into SRAM.'
  },
  TPS: {
    symbol: '\\text{TPS}',
    name: 'Tokens Per Second',
    category: 'LLM Inference',
    unit: 'tok/s',
    summary: 'The aggregate output throughput generated across all concurrent client streams by the serving cluster.',
    formulas: [
      '\\text{TPS} = \\frac{\\sum \\text{Output Tokens}}{\\Delta t} = \\text{Batch Size} \\times \\frac{1}{\\text{TPOT}}'
    ],
    insight: 'Increasing batch size boosts TPS and GPU memory efficiency, but increases per-request TPOT and queue wait, representing the primary multi-objective Pareto trade-off.'
  },
  ITL: {
    symbol: '\\text{ITL}',
    name: 'Inter-Token Latency',
    category: 'LLM Inference',
    unit: 'ms',
    summary: 'The time delay between consecutive streamed tokens delivered to the client application.',
    formulas: [
      '\\text{ITL} \\approx \\text{TPOT} + t_{\\text{chunk}}'
    ],
    insight: 'High ITL variance causes perceptible stuttering in interactive chatbots and voice agents. Consistent ITL requires isolating chunked prefills from ongoing decode iterations.'
  },
  NTTFT: {
    symbol: '\\text{NTTFT}',
    name: 'Normalized TTFT',
    category: 'LLM Inference',
    unit: 'ms/input_token',
    summary: 'Time to First Token divided by the input prompt length (ISL), providing a normalized metric across variable prompt sizes.',
    formulas: [
      '\\text{NTTFT} = \\frac{\\text{TTFT}}{\\text{Input Sequence Length (ISL)}}'
    ],
    insight: 'Allows fair performance comparisons between short queries (e.g. 50 tokens) and long-context document summarization (e.g. 8,000 tokens).'
  }
}

export const CATEGORY_MAP: Record<TermCategory, Record<string, MathTermDefinition>> = {
  queuing: QUEUING_TERMS,
  systems: SYSTEMS_TERMS,
  llm: LLM_TERMS
}

/**
 * Returns merged dictionary of terms for the specified active categories.
 */
export function getTermsForCategories(categories: TermCategory[] | 'all'): Record<string, MathTermDefinition> {
  if (categories === 'all') {
    return { ...SYSTEMS_TERMS, ...QUEUING_TERMS, ...LLM_TERMS }
  }

  const merged: Record<string, MathTermDefinition> = {}
  for (const cat of categories) {
    if (CATEGORY_MAP[cat]) {
      Object.assign(merged, CATEGORY_MAP[cat])
    }
  }
  return merged
}

/**
 * Normalizes input symbol string or data-term attribute to dictionary key,
 * constrained to currently active term dictionary.
 */
export function normalizeTermKey(raw: string, activeTerms: Record<string, MathTermDefinition>): string | null {
  if (!raw) return null
  const cleaned = raw.trim().replace(/^\\text\{|\}$/g, '').replace(/[${\\}\s]/g, '')

  if (activeTerms[cleaned]) return cleaned

  const aliasMap: Record<string, string> = {
    λ: 'lambda',
    lambda: 'lambda',
    μ: 'mu',
    mu: 'mu',
    ρ: 'rho',
    rho: 'rho',
    W: 'W',
    wq: 'W_q',
    W_q: 'W_q',
    Wq: 'W_q',
    S: 'S',
    L: 'L',
    lq: 'L_q',
    L_q: 'L_q',
    Lq: 'L_q',
    c: 'c',
    cv: 'Cv',
    Cv: 'Cv',
    C_v: 'Cv',
    ttft: 'TTFT',
    TTFT: 'TTFT',
    tpot: 'TPOT',
    TPOT: 'TPOT',
    tps: 'TPS',
    TPS: 'TPS',
    itl: 'ITL',
    ITL: 'ITL',
    nttft: 'NTTFT',
    NTTFT: 'NTTFT'
  }

  const alias = aliasMap[cleaned]
  if (alias && activeTerms[alias]) {
    return alias
  }

  return null
}
