import { describe, expect, it } from 'bun:test';
import {
  VarianceQueueEngine,
  SERVICE_A_SEC,
  SERVICE_B_SHORT_SEC,
  SERVICE_B_LONG_SEC
} from './variance-queue-engine.js';

describe('VarianceQueueEngine', () => {
  it('gives both lanes the same arrival stream', () => {
    const engine = new VarianceQueueEngine({ lambda: 80, seed: 42 });
    engine.step(0.25);

    expect(engine.arrivals.length).toBeGreaterThan(0);
    expect(engine.lanes[0].windowArrivalIds).toEqual(engine.lanes[1].windowArrivalIds);
  });

  it('keeps the mean service time equal while changing variance', () => {
    const engine = new VarianceQueueEngine({ lambda: 80, seed: 42 });
    engine.step(100);
    const fixedSamples = engine.lanes[0].serviceSamples.slice(0, 10);
    const variableSamples = engine.lanes[1].serviceSamples.slice(0, 10);
    const fixedMean = engine.lanes[0].serviceSampleTotalSec / engine.lanes[0].serviceSampleCount;
    const variableMean = engine.lanes[1].serviceSampleTotalSec / engine.lanes[1].serviceSampleCount;

    expect(fixedMean).toBeCloseTo(SERVICE_A_SEC, 3);
    expect(variableMean).toBeCloseTo(SERVICE_A_SEC, 2);
    expect(fixedSamples).toEqual(Array(10).fill(SERVICE_A_SEC));
    expect(variableSamples).toContain(SERVICE_B_SHORT_SEC);
    expect(variableSamples).toContain(SERVICE_B_LONG_SEC);
  });

  it('builds a queue behind the first long service B job', () => {
    const engine = new VarianceQueueEngine({ lambda: 80, seed: 42 });
    engine.step(0.09);
    const state = engine.getLaneState(engine.lanes[1]);

    expect(state.active.serviceTime).toBe(SERVICE_B_LONG_SEC);
    expect(state.queueLength).toBeGreaterThan(0);
    expect(state.queueLength).toBeGreaterThan(engine.getLaneState(engine.lanes[0]).queueLength);
  });

  it('continues accumulating arrivals and wait statistics', () => {
    const engine = new VarianceQueueEngine({ lambda: 80, seed: 42 });
    engine.step(5);
    const metrics = engine.getMetrics();

    expect(metrics.timeMs).toBe(5000);
    expect(metrics.arrivals).toBeGreaterThan(100);
    expect(metrics.lanes[0].completedCount).toBeGreaterThan(0);
    expect(metrics.lanes[1].completedCount).toBeGreaterThan(0);
    expect(metrics.lanes[1].meanWaitMs).toBeGreaterThan(metrics.lanes[0].meanWaitMs);
  });

  it('keeps workload history bounded while advancing through many windows', () => {
    const engine = new VarianceQueueEngine({ lambda: 80, seed: 42 });
    engine.step(1000);

    expect(engine.lanes[0].pendingJobs.length).toBeLessThan(250);
    expect(engine.lanes[1].pendingJobs.length).toBeLessThan(250);
    expect(engine.lanes[0].timelineJobs.length).toBeLessThan(250);
    expect(engine.lanes[1].timelineJobs.length).toBeLessThan(250);
    expect(engine.lanes[0].serviceSamples).toHaveLength(10);
    expect(engine.lanes[1].serviceSamples).toHaveLength(10);
  });

  it('calculates the queueing-theory comparison for the selected load', () => {
    const engine = new VarianceQueueEngine({ lambda: 80, seed: 42 });
    const metrics = engine.getMetrics();

    expect(metrics.lanes[0].theoryWaitMs).toBeCloseTo(20, 0);
    expect(metrics.lanes[1].theoryWaitMs).toBeCloseTo(166, 0);

    const unstable = new VarianceQueueEngine({ lambda: 100, seed: 42 });
    expect(unstable.getMetrics().lanes[0].theoryWaitMs).toBe(Infinity);
    expect(unstable.getMetrics().lanes[1].theoryWaitMs).toBe(Infinity);
  });

  it('resets the continuous simulation', () => {
    const engine = new VarianceQueueEngine({ lambda: 80, seed: 42 });
    engine.step(2);
    engine.reset();

    expect(engine.simTime).toBe(0);
    expect(engine.generatedThroughSec).toBe(1);
    expect(engine.arrivals.length).toBeGreaterThan(0);
    expect(engine.getMetrics().arrivals).toBe(0);
    expect(engine.lanes.every((lane) => lane.queue.length === 0 && lane.completedCount === 0)).toBe(true);
  });
});
