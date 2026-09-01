/**
 * Interactive 3D Vector Decomposition & Quaternion Sandwich Explorer
 *
 * Implements:
 * - 3D vector decomposition (parallel projection + perpendicular rejection)
 * - KaTeX telemetry for v, v_parallel, v_perp, and rotated v' = q v q*
 * - Presets for Perpendicular, Arbitrary, and Axial vectors
 * - Angle scrubbing slider and animation playback controls
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

import { html, render, useState, useEffect, useRef } from '../ui/preact.js';
import { WidgetFrame } from '../ui/WidgetFrame.js';
import { SegmentedGroup } from '../ui/SegmentedGroup.js';
import { RangeSlider } from '../ui/RangeSlider.js';
import { UI } from '../ui/tokens.js';
import { QuaternionDecompEngine } from './quaternion-decomp-engine.js';

function renderMath(tex, isDisplay = false) {
  if (typeof window !== 'undefined' && window.katex && typeof window.katex.renderToString === 'function') {
    try {
      return window.katex.renderToString(tex, {
        displayMode: isDisplay,
        throwOnError: false,
      });
    } catch {
      return tex;
    }
  }
  return tex;
}

function renderTextWithMath(str) {
  if (!str) return '';
  return str
    .replace(/\$\$([^$]+)\$\$/g, (_, tex) => renderMath(tex, true))
    .replace(/\$([^$]+)\$/g, (_, tex) => renderMath(tex, false));
}

const DECOMP_PRESETS = {
  perpendicular: {
    title: 'Perpendicular Vector (v ⊥ n̂)',
    vector: [1.4, 0, 0],
    description:
      'When vector $\\mathbf{v}$ lies entirely in orthogonal plane $\\mathcal{P} \\perp \\hat{\\mathbf{n}}$, parallel component $\\mathbf{v}_\\parallel = \\mathbf{0}$ and dot product $\\hat{\\mathbf{n}} \\cdot \\mathbf{v} = 0$. One-sided rotor $qp = [0, \\cos\\theta \\mathbf{v} + \\sin\\theta(\\hat{\\mathbf{n}}\\times\\mathbf{v})]$ performs a direct 2D planar rotation with **zero scalar leakage**.',
  },
  arbitrary: {
    title: 'General Arbitrary 3D Vector',
    vector: [1.2, 0.9, 0],
    description:
      'When $\\mathbf{v}$ is inclined, non-zero projection $\\mathbf{v}_\\parallel = (\\mathbf{v}\\cdot\\hat{\\mathbf{n}})\\hat{\\mathbf{n}}$ causes one-sided $qp$ to leak scalar terms ($-\\lambda \\hat{\\mathbf{n}}\\cdot\\mathbf{v}$). The sandwich product $p^\\prime = q p q^*$ cancels this leakage: $\\mathbf{v}_\\parallel$ stays untouched while $\\mathbf{v}_\\perp$ rotates by $\\theta$.',
  },
  axial: {
    title: 'Axial Vector (v ∥ n̂)',
    vector: [0, 1.4, 0],
    description:
      'When $\\mathbf{v}$ aligns with rotation axis $\\hat{\\mathbf{n}}$, perpendicular component $\\mathbf{v}_\\perp = \\mathbf{0}$. The sandwich product evaluates to $q \\mathbf{v} q^* = \\mathbf{v}$, demonstrating that vectors along the rotation axis remain completely invariant.',
  },
};

const PRESET_OPTIONS = [
  { label: 'Perpendicular (v ⊥ n̂)', value: 'perpendicular' },
  { label: 'Arbitrary 3D', value: 'arbitrary' },
  { label: 'Axial (v ∥ n̂)', value: 'axial' },
];

export function QuaternionDecompExplorer() {
  const canvasContainerRef = useRef(null);
  const engineRef = useRef(null);

  const [preset, setPreset] = useState('arbitrary');
  const [angleRad, setAngleRad] = useState(0);
  const [angleDeg, setAngleDeg] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const engine = new QuaternionDecompEngine(container);
    engineRef.current = engine;

    const unsubscribe = engine.subscribe((state) => {
      setAngleRad(state.angleRad);
      setAngleDeg(state.angleDeg);
      setIsPlaying(state.isPlaying);
    });

    const initialPreset = DECOMP_PRESETS[preset] || DECOMP_PRESETS.arbitrary;
    engine.setVector(initialPreset.vector);
    engine.emitState();

    return () => {
      unsubscribe?.();
      engine.dispose?.();
    };
  }, []);

  const handlePresetChange = (newPreset) => {
    setPreset(newPreset);
    const p = DECOMP_PRESETS[newPreset] || DECOMP_PRESETS.arbitrary;
    if (engineRef.current) {
      engineRef.current.setVector(p.vector);
    }
  };

  const handleAngleChange = (val) => {
    if (engineRef.current) {
      engineRef.current.pause();
      engineRef.current.setAngle(val);
    }
  };

  const handlePlayToggle = () => {
    if (engineRef.current) {
      engineRef.current.togglePlay();
    }
  };

  const handleReset = () => {
    if (engineRef.current) {
      engineRef.current.pause();
      engineRef.current.setAngle(0);
    }
  };

  const currentDesc = (DECOMP_PRESETS[preset] || DECOMP_PRESETS.arbitrary).description;

  return html`
    <${WidgetFrame}
      title="3D Vector Decomposition & Sandwich Rotation"
      descriptor="Interactive Three.js Visualizer">
      <div class="tw-grid tw-grid-cols-[330px_1fr] tw-gap-2.5 tw-p-2.5 tw-font-serif max-[860px]:tw-grid-cols-1">
        <!-- Left Column: Controls -->
        <div class="tw-flex tw-flex-col tw-gap-2.5">
          <!-- Card 1: Vector Configuration -->
          <div class="tw-bg-[var(--grey-dark)] tw-rounded-lg tw-p-3 tw-flex tw-flex-col tw-gap-2">
            <div class="tw-font-sans tw-text-[0.75rem] tw-font-semibold tw-tracking-wide tw-text-[var(--grey-light)]">Vector Configuration</div>
            <${SegmentedGroup}
              options=${PRESET_OPTIONS}
              value=${preset}
              onChange=${handlePresetChange} />
            <div
              class="tw-text-xs tw-leading-relaxed tw-text-[var(--grey-light)]"
              dangerouslySetInnerHTML=${{ __html: renderTextWithMath(currentDesc) }} />
          </div>

          <!-- Card 2: Angle Scrubbing (θ) -->
          <div class="tw-bg-[var(--grey-dark)] tw-rounded-lg tw-p-3 tw-flex tw-flex-col tw-gap-2">
            <div class="tw-font-sans tw-text-[0.75rem] tw-font-semibold tw-tracking-wide tw-text-[var(--grey-light)]">Angle Scrubbing (θ)</div>
            <div class="tw-flex tw-gap-1.5 tw-items-center">
              <button type="button" class=${UI.btn.ctrl} onClick=${handlePlayToggle}>
                ${isPlaying ? '❚❚ Pause' : '▶ Play'}
              </button>
              <button type="button" class=${UI.btn.ctrl} onClick=${handleReset}>
                Reset
              </button>
            </div>
            <${RangeSlider}
              id="decomp-angle-slider"
              label="θ"
              valueText="${angleDeg.toFixed(1)}°"
              min=${0}
              max=${6.28318}
              step=${0.01}
              value=${angleRad}
              onChange=${handleAngleChange} />
          </div>
        </div>

        <!-- Right Column: 3D Canvas -->
        <div class="tw-relative tw-bg-[var(--grey-darker)] tw-border tw-border-[var(--ring-border)] tw-rounded-[10px] tw-min-h-[380px] tw-overflow-hidden">
          <div class="tw-w-full tw-h-full tw-min-h-[380px]" ref=${canvasContainerRef}></div>
          <div class="tw-absolute tw-bottom-2.5 tw-left-2.5 tw-bg-[var(--grey-dark)] tw-px-2.5 tw-py-1.5 tw-rounded-md tw-text-xs tw-text-[var(--grey-light)] tw-pointer-events-none tw-flex tw-flex-col tw-gap-1 [&_.katex]:!tw-text-[1.05em]">
            <div class="tw-flex tw-items-center tw-gap-x-3.5 tw-leading-tight">
              <span class="tw-inline-flex tw-items-center tw-gap-1.5">
                <span class="tw-inline-block tw-w-2 tw-h-2 tw-rounded-full" style="background: rgb(var(--primary));"></span>
                <span dangerouslySetInnerHTML=${{ __html: renderTextWithMath('$\\mathbf{v}$ (Original)') }} />
              </span>
              <span class="tw-inline-flex tw-items-center tw-gap-1.5">
                <span class="tw-inline-block tw-w-2 tw-h-2 tw-rounded-full" style="background: #fbbf24;"></span>
                <span dangerouslySetInnerHTML=${{ __html: renderTextWithMath('$\\mathbf{v}_\\parallel$ (Parallel)') }} />
              </span>
              <span class="tw-inline-flex tw-items-center tw-gap-1.5">
                <span class="tw-inline-block tw-w-2 tw-h-2 tw-rounded-full" style="background: #dadada;"></span>
                <span dangerouslySetInnerHTML=${{ __html: renderTextWithMath('$\\mathbf{v}_\\perp$ (Perp)') }} />
              </span>
            </div>
            <div class="tw-flex tw-items-center tw-gap-x-3.5 tw-leading-tight">
              <span class="tw-inline-flex tw-items-center tw-gap-1.5">
                <span class="tw-inline-block tw-w-2 tw-h-2 tw-rounded-full" style="background: #34d399;"></span>
                <span dangerouslySetInnerHTML=${{ __html: renderTextWithMath('$\\mathbf{v}^\\prime$ (Rotated)') }} />
              </span>
              <span class="tw-inline-flex tw-items-center tw-gap-1.5">
                <span class="tw-inline-block tw-w-2 tw-h-2 tw-rounded-full" style="background: #fbbf24;"></span>
                <span dangerouslySetInnerHTML=${{ __html: renderTextWithMath('Axis $\\hat{\\mathbf{n}}$') }} />
              </span>
            </div>
          </div>
        </div>
      </div>
    <//>
  `;
}

export function initQuaternionDecompExplorer(containerId = 'quaternion-decomp-explorer') {
  const root = document.getElementById(containerId);
  if (!root) return;
  render(html`<${QuaternionDecompExplorer} />`, root);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initQuaternionDecompExplorer());
  } else {
    initQuaternionDecompExplorer();
  }
}
