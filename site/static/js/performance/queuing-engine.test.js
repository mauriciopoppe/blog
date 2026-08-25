import { describe, it, expect } from 'bun:test';
import { QueuingEngine } from './queuing-engine.js';

function createRng(seed = 42) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

describe('QueuingEngine Simulation Logic', () => {
  it('initializes with default parameters and idle state', () => {
    const engine = new QueuingEngine({ lambda: 3.0, cores: 2, mu: 2.0, rng: createRng(1) });
    expect(engine.lambda).toBe(3.0);
    expect(engine.cores).toBe(2);
    expect(engine.mu).toBe(2.0);
    expect(engine.workers.length).toBe(2);
    expect(engine.queue.length).toBe(0);

    const metrics = engine.getMetrics();
    expect(metrics.capacity).toBe(4.0);
    expect(metrics.theoreticalRho).toBe(75.0);
    expect(metrics.theoreticalHeadroom).toBe(25.0);
  });

  it('correctly tracks light traffic without queue buildup', () => {
    // Low arrival rate: 0.5 req/s on 2 cores with mu = 2.0 (capacity = 4.0 req/s)
    const engine = new QueuingEngine({ lambda: 0.5, cores: 2, mu: 2.0, rng: createRng(2) });

    // Step through 20 simulated seconds
    for (let i = 0; i < 200; i++) {
      engine.step(0.1);
    }

    const metrics = engine.getMetrics();
    expect(metrics.theoreticalRho).toBeCloseTo(12.5, 1);
    expect(metrics.queueLength).toBeLessThan(3);
    expect(metrics.measuredRho).toBeLessThan(45.0);
    expect(metrics.headroom).toBeGreaterThan(55.0);
    expect(metrics.cumulativeRho).toBeLessThan(30.0);
  });

  it('accurately maintains operating knee utilization around 75%', () => {
    // Knee rate: 3.0 req/s on 2 cores with mu = 2.0 (capacity = 4.0 req/s)
    const engine = new QueuingEngine({ lambda: 3.0, cores: 2, mu: 2.0, rng: createRng(3) });

    // Step through 50 simulated seconds
    for (let i = 0; i < 500; i++) {
      engine.step(0.1);
    }

    const metrics = engine.getMetrics();
    expect(metrics.theoreticalRho).toBe(75.0);
    expect(metrics.theoreticalHeadroom).toBe(25.0);
    expect(metrics.cumulativeRho).toBeGreaterThan(50.0);
    expect(metrics.cumulativeRho).toBeLessThan(95.0);
    expect(metrics.measuredRho).toBeGreaterThan(35.0);
    expect(metrics.measuredRho).toBeLessThanOrEqual(100.0);
  });

  it('tracks peak queue depth across simulation bursts', () => {
    const engine = new QueuingEngine({ lambda: 5.0, cores: 1, mu: 2.0 });
    for (let i = 0; i < 100; i++) engine.step(0.1);
    const metrics = engine.getMetrics();
    expect(metrics.peakQueue).toBeGreaterThan(0);
    expect(typeof metrics.peakQueue).toBe('number');
  });

  it('correctly calculates high load without false 100% saturation (5.6 req/s on 3 cores)', () => {
    // Morning ramp load: 5.6 req/s on 3 cores with mu = 2.0 (capacity = 6.0 req/s -> 93.3% load)
    const engine = new QueuingEngine({ lambda: 5.6, cores: 3, mu: 2.0 });

    for (let i = 0; i < 300; i++) {
      engine.step(0.1);
    }

    const metrics = engine.getMetrics();
    expect(metrics.capacity).toBe(6.0);
    expect(metrics.rawLoad).toBeCloseTo(93.33, 1);
    expect(metrics.theoreticalRho).toBeCloseTo(93.33, 1);
    expect(metrics.measuredRho).toBeGreaterThan(60.0);
    expect(metrics.measuredRho).toBeLessThanOrEqual(100.0);
  });

  it('correctly saturates to 100% utilization and 0% headroom when demand exceeds capacity', () => {
    // Overload: 6.0 req/s on 2 cores with mu = 2.0 (capacity = 4.0 req/s, load = 150%)
    const engine = new QueuingEngine({ lambda: 6.0, cores: 2, mu: 2.0 });

    // Step through 30 simulated seconds
    for (let i = 0; i < 300; i++) {
      engine.step(0.1);
    }

    const metrics = engine.getMetrics();
    expect(metrics.rawLoad).toBe(150.0);
    expect(metrics.theoreticalRho).toBe(100.0);
    expect(metrics.theoreticalHeadroom).toBe(0.0);
    expect(metrics.measuredRho).toBe(100.0);
    expect(metrics.headroom).toBe(0.0);
    expect(metrics.queueLength).toBeGreaterThan(5);
  });

  it('dynamically resizes worker core pool without corrupting state', () => {
    const engine = new QueuingEngine({ lambda: 4.0, cores: 2, mu: 2.0 });
    expect(engine.workers.length).toBe(2);

    engine.setParameters({ cores: 4 });
    expect(engine.cores).toBe(4);
    expect(engine.workers.length).toBe(4);

    engine.step(0.5);
    const metrics = engine.getMetrics();
    expect(metrics.capacity).toBe(8.0);
    expect(metrics.theoreticalRho).toBe(50.0);

    engine.setParameters({ cores: 1 });
    expect(engine.cores).toBe(1);
    expect(engine.workers.length).toBe(1);
  });

  it('resets state completely on reset()', () => {
    const engine = new QueuingEngine({ lambda: 3.0, cores: 2, mu: 2.0 });
    for (let i = 0; i < 100; i++) engine.step(0.1);

    expect(engine.currentTime).toBeGreaterThan(0);
    engine.reset();

    expect(engine.currentTime).toBe(0);
    expect(engine.sweepTime).toBe(0);
    expect(engine.queue.length).toBe(0);
    expect(engine.completedJobs.length).toBe(0);
    engine.workers.forEach(w => {
      expect(w.isBusy).toBe(false);
      expect(w.blocks.length).toBe(0);
    });
  });
});
