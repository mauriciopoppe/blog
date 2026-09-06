import { html, render, useState } from '../ui/preact.js'
import { WidgetFrame } from '../ui/WidgetFrame.js'

const LAYERS = [
  {
    number: '01',
    title: 'Orchestration',
    shortTitle: 'Orchestration',
    description: 'Routes requests across single-node inference server replicas based on queue state, cache locality, and available capacity.',
    signal: 'Where requests go',
    color: 'rgb(var(--primary))'
  },
  {
    number: '02',
    title: 'Inference runtime',
    shortTitle: 'Runtime',
    description: 'Manages batching, memory for the KV cache, quantization, and decoding strategies for the workload.',
    signal: 'How work is grouped',
    color: '#fbbf24'
  },
  {
    number: '03',
    title: 'Host execution',
    shortTitle: 'Host',
    description: 'Coordinates CPU scheduling, NUMA placement, cgroups, container and device access, driver dispatch, and node-daemon contention.',
    signal: 'Node resources',
    color: '#34d399'
  },
  {
    number: '04',
    title: 'Kernel specialization',
    shortTitle: 'Kernels',
    description: 'Executes model operations using tiling, fusion, memory layouts, and hardware-specific code.',
    signal: 'Accelerator code',
    color: '#ffb74d'
  },
  {
    number: '05',
    title: 'Silicon',
    shortTitle: 'Hardware',
    description: 'Provides the compute units, memory hierarchy, bandwidth, and communication links used by the layers above.',
    signal: 'Hardware limits',
    color: 'rgb(var(--primary))'
  }
]

function StackDiagram({ activeStep, onHover }) {
  const cardY = (index) => 24 + index * 72
  const requestY = cardY(activeStep) + 30

  return html`
    <svg
      viewBox="0 0 560 418"
      role="img"
      aria-label=${`Request at ${LAYERS[activeStep].title}`}
      class="inference-stack-svg tw-w-full tw-h-auto tw-rounded-[10px] tw-bg-[var(--grey-darker)] tw-border tw-border-[var(--ring-border)]"
    >
      <style>
        .inference-stack-request { transition: transform 620ms cubic-bezier(.22, .8, .25, 1); }
        .inference-stack-card { transition: fill 180ms ease, stroke 180ms ease, opacity 180ms ease; }
      </style>
      <line x1="22" y1="22" x2="22" y2="384" stroke="rgba(255,255,255,0.15)" stroke-width="1.2" />
      <text x="22" y="14" text-anchor="middle" font-family="var(--family-sans, system-ui, sans-serif)" font-size="9" font-weight="700" fill="var(--grey-light)">REQ</text>
      <g class="inference-stack-request" style=${`transform: translateY(${requestY - 54}px);`}>
        <circle cx="22" cy="54" r="8" fill="rgb(var(--primary))" />
        <circle cx="22" cy="54" r="13" fill="none" stroke="rgba(var(--primary),0.35)" stroke-width="1" />
        <path d="M22 69 V78" stroke="rgb(var(--primary))" stroke-width="1.5" marker-end="url(#inference-stack-arrow)" />
      </g>
      <defs>
        <marker id="inference-stack-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0,0 L6,3.5 L0,7 Z" fill="rgb(var(--primary))" />
        </marker>
      </defs>
      ${LAYERS.map((layer, index) => {
        const y = cardY(index)
        const isActive = index === activeStep
        return html`
          <g
            key=${layer.number}
            class="inference-stack-card"
            opacity="1"
            tabindex="0"
            role="button"
            aria-label=${`Show ${layer.title}`}
            onMouseEnter=${() => onHover(index)}
            onFocus=${() => onHover(index)}
          >
            <rect
              x="42"
              y=${y}
              width="500"
              height="60"
              rx="9"
              fill=${isActive ? 'rgba(var(--primary),0.15)' : 'var(--grey-dark)'}
              stroke=${isActive ? 'rgba(var(--primary),0.55)' : 'rgba(255,255,255,0.12)'}
              stroke-width=${isActive ? '1.2' : '1'}
            />
            <rect x="42" y=${y} width="4" height="60" rx="2" fill=${layer.color} />
            <text x="62" y=${y + 36} font-family="var(--family-sans, system-ui, sans-serif)" font-size="15" font-weight="700" fill=${layer.color}>${layer.number}</text>
            <text x="108" y=${y + 27} font-family="var(--family-sans, system-ui, sans-serif)" font-size="17" font-weight="700" fill="var(--grey-lighter)">${layer.title}</text>
            <text x="108" y=${y + 47} font-family="var(--family-serif, system-ui, serif)" font-size="14" fill="var(--grey-light)">${layer.signal}</text>
            <rect x="394" y=${y + 17} width="128" height="26" rx="13" fill=${isActive ? 'rgba(var(--primary),0.18)' : 'rgba(255,255,255,0.05)'} stroke=${isActive ? 'rgba(var(--primary),0.4)' : 'rgba(255,255,255,0.12)'} stroke-width="1" />
            <circle cx="411" cy=${y + 30} r="4" fill=${layer.color} />
            <text x="422" y=${y + 34} font-family="var(--family-sans, system-ui, sans-serif)" font-size="12" font-weight="600" fill=${isActive ? 'rgb(var(--primary))' : 'var(--grey-light)'}>${layer.shortTitle}</text>
          </g>
        `
      })}
      <text x="280" y="396" text-anchor="middle" font-family="var(--family-serif, system-ui, serif)" font-size="13.5" fill="var(--grey-light)">Analytical layers, not a literal serial execution path.</text>
      <text x="280" y="411" text-anchor="middle" font-family="var(--family-serif, system-ui, serif)" font-size="13.5" fill="var(--grey-light)">Each layer contributes a different demand.</text>
    </svg>
  `
}

function InferenceStackExplorer() {
  const [activeStep, setActiveStep] = useState(0)
  const activeLayer = LAYERS[activeStep]

  return html`
    <${WidgetFrame}
      title="A request through the inference stack"
      descriptor="Hover over a layer to see what it does and where its work comes from"
      className="inference-stack-explorer"
    >
      <div class="tw-grid tw-grid-cols-[335px_minmax(0,1fr)] tw-gap-2.5 tw-p-2.5 tw-font-serif tw-text-[var(--grey-lighter)] max-[860px]:tw-grid-cols-1">
        <div class="tw-flex tw-flex-col tw-justify-start tw-gap-2">
          <div class="tw-bg-[var(--grey-dark)] tw-rounded-md tw-px-3 tw-py-3 tw-text-[0.9rem] tw-leading-snug tw-text-[var(--grey-light)] tw-min-h-[150px]">
            <div class="tw-flex tw-items-baseline tw-justify-between tw-gap-2">
              <div class="tw-font-sans tw-text-sm tw-font-semibold tw-text-[var(--grey-lighter)]">${activeLayer.title}</div>
              <div class="tw-font-sans tw-text-xs tw-font-semibold tw-text-primary">${activeLayer.number}</div>
            </div>
            <div class="tw-mt-0.5 tw-font-sans tw-text-[0.65rem] tw-font-medium tw-text-primary">${activeLayer.signal}</div>
            <div class="tw-mt-3">${activeLayer.description}</div>
          </div>
        </div>
        <div class="tw-min-w-0">
          <${StackDiagram} activeStep=${activeStep} onHover=${setActiveStep} />
        </div>
      </div>
    </${WidgetFrame}>
  `
}

const mount = document.getElementById('inference-stack-explorer')
if (mount) render(html`<${InferenceStackExplorer} />`, mount)
