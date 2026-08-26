import { describe, it, expect, beforeEach } from 'bun:test';
import { CoffeeShopEngine } from './coffee-shop-engine.js';

describe('Bookstore & Lounge Little\'s Law Engine (L = λ · W)', () => {
  let engine;

  beforeEach(() => {
    engine = new CoffeeShopEngine({
      lambda: 2.0,         // 2 visitors per second
      durationW: 4.0,      // 4 seconds stay per visitor
      seed: 42
    });
  });

  it('initializes in an idle state with zero visitors', () => {
    const metrics = engine.getMetrics();
    expect(metrics.liveCount).toBe(0);
    expect(metrics.lambda).toBe(2.0);
    expect(metrics.durationW).toBe(4.0);
    expect(metrics.theoreticalL).toBe(8.0);
  });

  it('spawns visitors with individual duration countdowns and progresses them', () => {
    engine.forceArrival();
    expect(engine.getVisitors().length).toBe(1);

    const v = engine.getVisitors()[0];
    expect(v.progress).toBe(0);
    expect(v.targetDuration).toBe(4.0);

    // Advance 2.0s (50% progress)
    for (let i = 0; i < 200; i++) engine.update(0.01);
    expect(v.progress).toBeCloseTo(0.5, 1);

    // Advance 2.5s more (past 100% duration) -> visitor departs
    for (let i = 0; i < 250; i++) engine.update(0.01);
    expect(engine.getMetrics().completedCount).toBeGreaterThanOrEqual(1);
  });

  it('converges in-shop visitors strictly to Little\'s Law (L = lambda * W)', () => {
    // Run for 30s steady state
    const snapshots = [];
    for (let t = 0; t < 3000; t++) {
      engine.update(0.01);
      if (t > 800 && t % 10 === 0) {
        snapshots.push(engine.getMetrics().liveCount);
      }
    }
    const avgInFlight = snapshots.reduce((a, b) => a + b, 0) / snapshots.length;
    const metrics = engine.getMetrics();
    const expectedL = metrics.lambda * metrics.durationW; // 2.0 * 4.0 = 8.0
    
    // In steady state, live snapshot count tightly converges to lambda * W
    expect(avgInFlight).toBeGreaterThan(0.75 * expectedL);
    expect(avgInFlight).toBeLessThan(1.25 * expectedL);
  });

  it('dynamically scales duration W when slider moves', () => {
    engine.setDurationW(6.0);
    expect(engine.getMetrics().durationW).toBe(6.0);
    expect(engine.getMetrics().theoreticalL).toBe(12.0);
  });

  it('resets completely to initial state', () => {
    engine.forceArrival();
    engine.update(0.5);
    expect(engine.getMetrics().liveCount).toBeGreaterThan(0);

    engine.reset();
    expect(engine.getMetrics().liveCount).toBe(0);
    expect(engine.getMetrics().completedCount).toBe(0);
  });
});
