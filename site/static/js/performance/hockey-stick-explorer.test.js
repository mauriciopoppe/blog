import { describe, test, expect } from 'bun:test';
import { calculateQueueMetrics } from './hockey-stick-explorer.js';

describe('Hockey Stick Explorer Metric Calculations', () => {
  test('calculates idle state correctly (rho = 0, S = 10ms)', () => {
    const metrics = calculateQueueMetrics(0.0, 10);
    expect(metrics.multiplier).toBe('1.0');
    expect(metrics.waitTimeMs).toBe(0);
    expect(metrics.totalResponseTimeMs).toBe(10);
    expect(metrics.rhoPct).toBe('0');
  });

  test('calculates 50% safe zone correctly (rho = 0.5, S = 10ms)', () => {
    const metrics = calculateQueueMetrics(0.5, 10);
    expect(metrics.multiplier).toBe('2.0');
    expect(metrics.waitTimeMs).toBe(10);
    expect(metrics.totalResponseTimeMs).toBe(20);
    expect(metrics.lambdaReqSec).toBe(50);
  });

  test('calculates 75% knee correctly (rho = 0.75, S = 10ms)', () => {
    const metrics = calculateQueueMetrics(0.75, 10);
    expect(metrics.multiplier).toBe('4.0');
    expect(metrics.waitTimeMs).toBe(30);
    expect(metrics.totalResponseTimeMs).toBe(40);
    expect(metrics.lambdaReqSec).toBe(75);
  });

  test('calculates 90% saturation cliff correctly (rho = 0.90, S = 10ms)', () => {
    const metrics = calculateQueueMetrics(0.90, 10);
    expect(metrics.multiplier).toBe('10.0');
    expect(metrics.waitTimeMs).toBe(90);
    expect(metrics.totalResponseTimeMs).toBe(100);
    expect(metrics.lambdaReqSec).toBe(90);
  });

  test('scales dynamically when service time S changes (rho = 0.80, S = 25ms)', () => {
    const metrics = calculateQueueMetrics(0.80, 25);
    expect(metrics.multiplier).toBe('5.0');
    expect(metrics.waitTimeMs).toBe(100);
    expect(metrics.totalResponseTimeMs).toBe(125);
    expect(metrics.lambdaReqSec).toBe(32);
  });
});
