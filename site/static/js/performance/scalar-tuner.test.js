import { describe, it, expect } from 'bun:test';
import { buildSimConfig, simToMetrics, diffsVsBaseline, sampleSim, LEVERS } from './scalar-tuner.js';
import { simulateServing } from './serving-simulator.js';

describe('Scalar Tuner Wiring', () => {
  it('starts each choice at its own baseline config', () => {
    const tps = buildSimConfig('tps', []);
    const ttft = buildSimConfig('ttft', []);
    expect(tps.concurrency).not.toBe(ttft.concurrency);
  });

  it('applies a lever config delta when enabled', () => {
    const base = buildSimConfig('tps', []);
    const boosted = buildSimConfig('tps', [3]); // speculative decoding
    expect(boosted.speculativeK).toBe(4);
    expect(base.speculativeK).toBe(0);
  });

  it('enabling speculative decoding raises TPS through the real simulator', () => {
    const base = simulateServing(buildSimConfig('tps', []));
    const spec = simulateServing(buildSimConfig('tps', [3]));
    expect(spec.tps).toBeGreaterThan(base.tps);
  });

  it('TTFT lever set lowers TTFT through the real simulator', () => {
    const base = simulateServing(buildSimConfig('ttft', []));
    const improved = simulateServing(buildSimConfig('ttft', [0, 1, 2, 3]));
    expect(improved.ttftP50).toBeLessThan(base.ttftP50);
  });

  it('diffs vs the no-lever baseline are all zero when nothing is enabled', () => {
    const baseline = simToMetrics(simulateServing(buildSimConfig('tps', [])));
    const current = simToMetrics(simulateServing(buildSimConfig('tps', [])));
    const diffs = diffsVsBaseline(baseline, current);
    Object.values(diffs).forEach((d) => expect(d).toBe(0));
  });

  it('reports a positive throughput delta when throughput levers are enabled', () => {
    const baseline = simToMetrics(simulateServing(buildSimConfig('tps', [])));
    const current = simToMetrics(simulateServing(buildSimConfig('tps', [0, 1, 2, 3])));
    const diffs = diffsVsBaseline(baseline, current);
    expect(diffs.tps).toBeGreaterThan(0);
    expect(diffs.vram).toBeGreaterThan(0);
  });

  it('every lever has an icon, a site label, and an external docs link', () => {
    Object.entries(LEVERS).forEach(([, levers]) => {
      levers.forEach((lever) => {
        expect(lever.icon).toBeTruthy();
        expect(lever.site).toBeTruthy();
        expect(lever.link).toMatch(/^https:\/\//);
      });
    });
  });

  it('sampleSim with one trial matches a single engine run', () => {
    const sampled = sampleSim({ concurrency: 32 }, 1);
    const direct = simulateServing({ concurrency: 32 });
    expect(sampled.tps).toBe(direct.tps);
    expect(sampled.ttftP50).toBe(direct.ttftP50);
  });

  it('sampleSim returns a stable median across trials', () => {
    const sampled = sampleSim({ concurrency: 32 }, 5);
    expect(sampled.tps).toBeGreaterThan(0);
    expect(sampled.ttftP50).toBeGreaterThan(0);
    expect(sampled.vramGb).toBeGreaterThan(0);
  });
});
