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
  },
  sigma_noise: {
    symbol: '\\vec{\\sigma}_{\\text{noise}}',
    name: 'Noise Tolerance Band Vector',
    category: 'LLM Inference',
    unit: '% per objective',
    summary: 'A vector of measurement noise thresholds defining the statistical indifference corridor for each serving objective.',
    formulas: [
      '\\forall i, \\quad f_i(\\mathbf{x}_A) \\le f_i(\\mathbf{x}_B) \\cdot (1 + \\sigma_{\\text{noise}, i})',
      '\\sigma_{\\text{noise}, i} \\approx C_{v, i} \\quad \\text{(Empirical Benchmark Variance)}'
    ],
    insight: 'In production GPU serving, benchmark noise (thermal throttling, network jitter, variable prompt lengths) creates false Pareto wins. Fluctuations within ±σ_noise are treated as statistical ties rather than meaningful improvements.'
  },
  delta_min: {
    symbol: '\\vec{\\delta}_{\\text{min}}',
    name: 'Minimum Improvement Threshold Vector',
    category: 'LLM Inference',
    unit: '% per objective',
    summary: 'A vector of minimum percentage improvements required in at least one objective to claim genuine engineering dominance.',
    formulas: [
      '\\exists j, \\quad f_j(\\mathbf{x}_A) \\le f_j(\\mathbf{x}_B) \\cdot (1 - \\delta_{\\text{min}, j})',
      '\\Delta f_j = \\frac{f_j(\\mathbf{x}) - f_j(\\mathbf{x}_0)}{f_j(\\mathbf{x}_0)} \\ge \\delta_{\\text{min}, j}'
    ],
    insight: 'Enforces a practical significance hurdle (e.g. ≥ 3% latency reduction or +5% throughput gain). Prevents micro-optimizations from polluting the frontier when they pass raw mathematical dominance without delivering real-world value.'
  }
}

export const GRAPHICS_TERMS: Record<string, MathTermDefinition> = {
  S: {
    symbol: '\\mathbf{S}',
    name: 'Scale Matrix',
    category: 'Computer Graphics' as any,
    summary: 'A diagonal 4×4 affine matrix scaling geometry along local coordinate axes by factors $(s_x, s_y, s_z)$ at the origin.',
    formulas: [
      '\\mathbf{S}(s_x, s_y, s_z) = \\begin{bmatrix} s_x & 0 & 0 & 0 \\\\ 0 & s_y & 0 & 0 \\\\ 0 & 0 & s_z & 0 \\\\ 0 & 0 & 0 & 1 \\end{bmatrix}'
    ],
    insight: 'Scaling must occur at the local origin before translation. If an object is translated away first, scaling expands its distance from the origin rather than resizing in place.'
  },
  R: {
    symbol: '\\mathbf{R}',
    name: 'Rotation Matrix',
    category: 'Computer Graphics' as any,
    summary: 'An orthonormal 4×4 matrix rotating 3D coordinates around a coordinate axis or arbitrary vector by angle $\\theta$.',
    formulas: [
      '\\mathbf{R}_y(\\theta) = \\begin{bmatrix} \\cos\\theta & 0 & \\sin\\theta & 0 \\\\ 0 & 1 & 0 & 0 \\\\ -\\sin\\theta & 0 & \\cos\\theta & 0 \\\\ 0 & 0 & 0 & 1 \\end{bmatrix}'
    ],
    insight: 'Rotation matrices are orthogonal: their inverse is simply their transpose ($\\mathbf{R}^{-1} = \\mathbf{R}^T$), preserving lengths and angles.'
  },
  T: {
    symbol: '\\mathbf{T}',
    name: 'Translation Matrix',
    category: 'Computer Graphics' as any,
    summary: 'An affine 4×4 matrix displacing 3D coordinates by position offset vector $(t_x, t_y, t_z)$.',
    formulas: [
      '\\mathbf{T}(t_x, t_y, t_z) = \\begin{bmatrix} 1 & 0 & 0 & t_x \\\\ 0 & 1 & 0 & t_y \\\\ 0 & 0 & 1 & t_z \\\\ 0 & 0 & 0 & 1 \\end{bmatrix}'
    ],
    insight: 'Translation requires 4D homogeneous coordinates ($w = 1$). It displaces points while leaving directional vectors ($w = 0$) invariant.'
  },
  TRS: {
    symbol: '\\mathbf{T} \\mathbf{R} \\mathbf{S}',
    name: 'Matrix Function Composition',
    category: 'Computer Graphics' as any,
    summary: 'Composing affine transformations acts identically to nested function application: $(\\mathbf{T} \\circ \\mathbf{R} \\circ \\mathbf{S})(\\mathbf{v}) = \\mathbf{T}(\\mathbf{R}(\\mathbf{S}(\\mathbf{v})))$.',
    formulas: [
      '\\mathbf{v}\' = \\mathbf{T} \\cdot \\mathbf{R} \\cdot \\mathbf{S} \\cdot \\mathbf{v} = \\mathbf{T}(\\mathbf{R}(\\mathbf{S}(\\mathbf{v})))'
    ],
    insight: 'Matrices evaluate right-to-left because matrix-vector multiplication is functional application: the innermost transformation applies first.'
  },
  TR: {
    symbol: '\\mathbf{T} \\mathbf{R}',
    name: 'Rotation Followed by Translation',
    category: 'Computer Graphics' as any,
    summary: 'Transforms a vector by rotating first in place around the origin, then displacing by translation vector $\\mathbf{T}$.',
    formulas: [
      '\\mathbf{T} \\mathbf{R} = \\begin{bmatrix} \\mathbf{R}_{3 \\times 3} & \\mathbf{T}_{3 \\times 1} \\\\ \\mathbf{0}_{1 \\times 3} & 1 \\end{bmatrix}',
      '\\mathbf{v}\' = \\mathbf{T} \\mathbf{R} \\mathbf{v} = \\mathbf{R} \\mathbf{v} + \\mathbf{T}_{3 \\times 1}'
    ],
    insight: 'Rotates coordinates at the local origin before translating into position, keeping the rotation centered on the object.'
  },
  RT: {
    symbol: '\\mathbf{R} \\mathbf{T}',
    name: 'Translation Followed by Rotation',
    category: 'Computer Graphics' as any,
    summary: 'Transforms a vector by translating first, then rotating around the global origin.',
    formulas: [
      '\\mathbf{R} \\mathbf{T} = \\begin{bmatrix} \\mathbf{R}_{3 \\times 3} & \\mathbf{R}_{3 \\times 3} \\mathbf{T}_{3 \\times 1} \\\\ \\mathbf{0}_{1 \\times 3} & 1 \\end{bmatrix}',
      '\\mathbf{v}\' = \\mathbf{R} \\mathbf{T} \\mathbf{v} = \\mathbf{R} \\mathbf{v} + \\mathbf{R}\\mathbf{T}_{3 \\times 1}'
    ],
    insight: 'Translating first displaces the object away from the origin; the subsequent rotation rotates both the geometry and its displacement vector in an orbit around $(0, 0, 0)$.'
  },
  M_proj: {
    symbol: '\\mathbf{M}_{\\text{proj}}',
    name: 'Projection Matrix',
    category: 'Computer Graphics' as any,
    summary: 'Transforms 3D view-space coordinates into homogeneous clip space for perspective or orthographic projection.',
    formulas: [
      '\\mathbf{v}_{\\text{clip}} = \\mathbf{M}_{\\text{proj}} \\mathbf{v}_{\\text{view}}',
      '\\mathbf{v}_{\\text{ndc}} = \\mathbf{v}_{\\text{clip}} / w_{\\text{clip}}'
    ],
    insight: 'Maps the 3D view frustum into the canonical unit cube. For perspective projection, z-depth is stored in the w-component to enable the perspective divide.'
  },
  M_view: {
    symbol: '\\mathbf{M}_{\\text{view} \\leftarrow \\text{world}}',
    name: 'View Transform Matrix',
    category: 'Computer Graphics' as any,
    summary: 'Transforms world-space coordinates into camera (view/eye) space using the camera orientation and position.',
    formulas: [
      '\\mathbf{v}_{\\text{view}} = \\mathbf{M}_{\\text{view} \\leftarrow \\text{world}} \\mathbf{v}_{\\text{world}} = \\mathbf{R}^T \\mathbf{T}^{-1} \\mathbf{v}_{\\text{world}}'
    ],
    insight: 'Moving the camera forward is mathematically equivalent to translating the entire 3D world backward by the inverse camera transform matrix.'
  },
  M_model: {
    symbol: '\\mathbf{M}_{\\text{world} \\leftarrow \\text{object}}',
    name: 'Model Transform Matrix',
    category: 'Computer Graphics' as any,
    summary: 'Transforms coordinates from local object space into the global world coordinate frame.',
    formulas: [
      '\\mathbf{v}_{\\text{world}} = \\mathbf{M}_{\\text{world} \\leftarrow \\text{object}} \\mathbf{v}_{\\text{object}}',
      '\\mathbf{M}_{\\text{world} \\leftarrow \\text{object}} = \\mathbf{T} \\mathbf{R} \\mathbf{S}'
    ],
    insight: 'Composed in TRS order: geometry is first scaled at the local origin, rotated in place, and finally translated into world coordinates.'
  },
  ndc: {
    symbol: '\\mathbf{v}_{\\text{ndc}}',
    name: 'Normalized Device Coordinates',
    category: 'Computer Graphics' as any,
    summary: 'The canonical coordinate volume spanning [-1, 1] in x, y, and z after perspective division by w.',
    formulas: [
      '\\mathbf{v}_{\\text{ndc}} = [x_{\\text{clip}}/w, y_{\\text{clip}}/w, z_{\\text{clip}}/w]^T'
    ],
    insight: 'Clipping occurs before the divide by w to avoid dividing by zero when primitives cross behind the near plane ($w \\leq 0$).'
  },
  quaternion: {
    symbol: '\\mathbf{q}',
    name: 'Unit Quaternion',
    category: 'Computer Graphics' as any,
    summary: 'A 4D hypercomplex number used to represent smooth 3D rotations without gimbal lock.',
    formulas: [
      '\\mathbf{q} = \\cos(\\theta/2) + \\mathbf{u} \\sin(\\theta/2) = [w, x, y, z]',
      '\\mathbf{v}\' = \\mathbf{q} \\mathbf{v} \\mathbf{q}^*'
    ],
    insight: 'Spherical Linear Interpolation (SLERP) on unit quaternions guarantees constant angular velocity along the shortest geodesic arc on the 4D hypersphere.'
  },
  homogeneous: {
    symbol: '(x, y, z, w)',
    name: 'Homogeneous Coordinates',
    category: 'Computer Graphics' as any,
    summary: 'A 4-component projective coordinate system enabling affine translations via 4x4 matrix multiplication.',
    formulas: [
      '\\mathbf{v} = (x, y, z, 1)^T \\implies \\mathbf{T} \\mathbf{v} = (x + t_x, y + t_y, z + t_z, 1)^T'
    ],
    insight: 'Points have w = 1 (affected by translations), while directional vectors have w = 0 (invariant under translation).'
  }
}

export const CALCULUS_TERMS: Record<string, MathTermDefinition> = {
  derivative: {
    symbol: 'f\'(x)',
    name: 'Derivative',
    category: 'Calculus' as any,
    summary: 'The instantaneous rate of change of a function with respect to its independent variable.',
    formulas: [
      'f\'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}',
      '\\frac{df}{dx} = \\frac{d}{dx} f(x)'
    ],
    insight: 'Geometrically represents the slope of the tangent line to the curve at point x, indicating local velocity and gradient.'
  },
  integral: {
    symbol: '\\int_a^b f(x) \\, dx',
    name: 'Definite Integral',
    category: 'Calculus' as any,
    summary: 'The continuous accumulation or signed area between the curve f(x) and the x-axis from x = a to x = b.',
    formulas: [
      '\\int_a^b f(x) \\, dx = F(b) - F(a) \\quad \\text{(FTC)}',
      '\\int f(x) \\, dx = F(x) + C'
    ],
    insight: 'Integration acts as the continuous sum of infinitely many infinitesimal slices of width dx, reversing differentiation.'
  },
  taylor: {
    symbol: 'T_n(x)',
    name: 'Taylor Polynomial',
    category: 'Calculus' as any,
    summary: 'An approximation of a differentiable function around a point a using a power series of its derivatives.',
    formulas: [
      'T_n(x) = \\sum_{k=0}^n \\frac{f^{(k)}(a)}{k!} (x - a)^k'
    ],
    insight: 'Provides fast, bounded polynomial approximations used in numerical physics, shader approximation, and mathematical libraries.'
  }
}

export type TermCategory = 'queuing' | 'systems' | 'llm' | 'graphics' | 'calculus'

export const CATEGORY_MAP: Record<TermCategory, Record<string, MathTermDefinition>> = {
  queuing: QUEUING_TERMS,
  systems: SYSTEMS_TERMS,
  llm: LLM_TERMS,
  graphics: GRAPHICS_TERMS,
  calculus: CALCULUS_TERMS
}

/**
 * Returns merged dictionary of terms for the specified active categories.
 */
export function getTermsForCategories(categories: TermCategory[] | 'all'): Record<string, MathTermDefinition> {
  if (categories === 'all') {
    return { ...SYSTEMS_TERMS, ...QUEUING_TERMS, ...LLM_TERMS, ...GRAPHICS_TERMS, ...CALCULUS_TERMS }
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
  const cleaned = raw.trim().replace(/\\text\{([^}]+)\}/g, '$1').replace(/[${\\}\s]/g, '')
  const noUnderscore = cleaned.replace(/_/g, '')

  if (activeTerms[cleaned]) return cleaned
  if (activeTerms[noUnderscore]) return noUnderscore

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
    NTTFT: 'NTTFT',
    sigma_noise: 'sigma_noise',
    sigmanoise: 'sigma_noise',
    sigmatextnoise: 'sigma_noise',
    vecsigma: 'sigma_noise',
    vecsigmanoise: 'sigma_noise',
    vecsigmatextnoise: 'sigma_noise',
    sigma: 'sigma_noise',
    σ: 'sigma_noise',
    σ_noise: 'sigma_noise',
    'vec(σ)': 'sigma_noise',
    delta_min: 'delta_min',
    deltamin: 'delta_min',
    deltatextmin: 'delta_min',
    vecdelta: 'delta_min',
    vecdeltamin: 'delta_min',
    vecdeltatextmin: 'delta_min',
    delta: 'delta_min',
    δ: 'delta_min',
    δ_min: 'delta_min',
    'vec(δ)': 'delta_min',
    m_proj: 'M_proj',
    M_proj: 'M_proj',
    Mproj: 'M_proj',
    m_view: 'M_view',
    M_view: 'M_view',
    Mview: 'M_view',
    m_model: 'M_model',
    M_model: 'M_model',
    Mmodel: 'M_model',
    ndc: 'ndc',
    quaternion: 'quaternion',
    q: 'quaternion',
    homogeneous: 'homogeneous',
    R: 'R',
    R_y: 'R',
    Ry: 'R',
    R_z: 'R',
    Rz: 'R',
    T: 'T',
    TRS: 'TRS',
    trs: 'TRS',
    TR: 'TR',
    tr: 'TR',
    RT: 'RT',
    rt: 'RT',
    derivative: 'derivative',
    integral: 'integral',
    taylor: 'taylor'
  }

  const alias = aliasMap[cleaned] || aliasMap[noUnderscore]
  if (alias && activeTerms[alias]) {
    return alias
  }

  if (activeTerms.M_model && cleaned.includes('world') && cleaned.includes('object')) {
    return 'M_model'
  }
  if (activeTerms.M_view && cleaned.includes('view') && cleaned.includes('world')) {
    return 'M_view'
  }

  return null
}
