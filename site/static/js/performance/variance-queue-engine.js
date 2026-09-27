/**
 * Shared-arrival M/G/1 comparison for explaining service-time variance.
 *
 * Both lanes receive the same Poisson arrival stream. Service A uses a fixed
 * 10ms duration. Service B samples a 90%/10% mixture of 1ms and 91ms jobs,
 * preserving the same expected 10ms mean while making long jobs visible.
 * The engine precomputes one fixed timeline window at a time. The UI can then
 * sweep across that window without changing the work shown on the canvas.
 */

const DEFAULT_TIMELINE_WINDOW_SEC = 1.0;
const SERVICE_A_SEC = 0.010;
const SERVICE_B_SHORT_SEC = 0.001;
const SERVICE_B_LONG_SEC = 0.091;

function createRng(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export class VarianceQueueEngine {
  constructor(options = {}) {
    this.lambda = options.lambda ?? 80;
    this.timelineWindowSec = DEFAULT_TIMELINE_WINDOW_SEC;
    this.seed = options.seed ?? 42;
    this.reset();
  }

  sampleInterarrival() {
    if (this.lambda <= 0) return Infinity;
    return -Math.log(Math.max(1e-7, 1 - this.rng())) / this.lambda;
  }

  reset() {
    this.rng = createRng(this.seed);
    this.serviceBRng = createRng(this.seed + 1);
    this.simTime = 0;
    this.nextRequestId = 1;
    this.nextArrivalTime = this.sampleInterarrival();
    this.serviceBIndex = 0;
    this.generatedThroughSec = 0;
    this.arrivals = [];
    this.arrivalCount = 0;
    this.arrivedCount = 0;
    this.lastCountedArrivalTime = 0;
    this.lanes = [
      this.buildLane('A'),
      this.buildLane('B')
    ];
    this.prepareNextWindow();
  }

  buildLane(id) {
    return {
      id,
      nextAvailableTime: 0,
      pendingJobs: [],
      queue: [],
      active: null,
      windowArrivalIds: [],
      timelineJobs: [],
      serviceSamples: [],
      serviceSampleCount: 0,
      serviceSampleTotalSec: 0,
      completedCount: 0,
      totalWaitSec: 0,
      queueDepthCache: null
    };
  }

  sampleServiceTime(laneId) {
    if (laneId === 'A') return SERVICE_A_SEC;
    const serviceTime = this.serviceBIndex === 0 || this.serviceBRng() < 0.1
      ? SERVICE_B_LONG_SEC
      : SERVICE_B_SHORT_SEC;
    this.serviceBIndex += 1;
    return serviceTime;
  }

  scheduleArrival(time) {
    const arrival = {
      id: this.nextRequestId++,
      arrivalTime: time
    };
    this.arrivals.push(arrival);

    for (const lane of this.lanes) {
      lane.windowArrivalIds.push(arrival.id);
      const serviceTime = this.sampleServiceTime(lane.id);
      const startTime = Math.max(time, lane.nextAvailableTime);
      const job = {
        id: arrival.id,
        arrivalTime: time,
        startTime,
        endTime: startTime + serviceTime,
        serviceTime,
        waitTime: startTime - time
      };
      lane.nextAvailableTime = job.endTime;
      lane.pendingJobs.push(job);
      if (lane.serviceSamples.length < 10) lane.serviceSamples.push(job.serviceTime);
      lane.serviceSampleCount += 1;
      lane.serviceSampleTotalSec += job.serviceTime;
    }
    this.arrivalCount += 1;
  }

  countArrivalsThrough(time) {
    const newArrivals = this.arrivals.filter((arrival) => (
      arrival.arrivalTime > this.lastCountedArrivalTime && arrival.arrivalTime <= time
    ));
    this.arrivedCount += newArrivals.length;
    this.lastCountedArrivalTime = time;
  }

  settleCompletedJobs(time) {
    for (const lane of this.lanes) {
      const remainingJobs = [];
      for (const job of lane.pendingJobs) {
        if (job.endTime <= time) {
          lane.completedCount += 1;
          lane.totalWaitSec += job.waitTime;
        } else {
          remainingJobs.push(job);
        }
      }
      lane.pendingJobs = remainingJobs;
    }
  }

  refreshTimeline(windowStart, windowEnd) {
    for (const lane of this.lanes) {
      lane.timelineJobs = lane.pendingJobs.filter((job) => (
        job.endTime >= windowStart && job.startTime <= windowEnd
      ));
      lane.queueDepthCache = null;
    }
  }

  prepareNextWindow() {
    const windowStart = this.generatedThroughSec;
    const windowEnd = windowStart + this.timelineWindowSec;
    this.arrivals = [];
    for (const lane of this.lanes) lane.windowArrivalIds = [];
    while (this.nextArrivalTime < windowEnd) {
      this.scheduleArrival(this.nextArrivalTime);
      this.nextArrivalTime += this.sampleInterarrival();
    }
    this.generatedThroughSec = windowEnd;
    this.refreshTimeline(windowStart, windowEnd);
  }

  getLaneState(lane) {
    const completedCount = lane.completedCount;
    const active = lane.pendingJobs.find((job) => (
      job.startTime <= this.simTime && job.endTime > this.simTime
    )) || null;
    const queued = lane.pendingJobs.filter((job) => (
      job.arrivalTime <= this.simTime && job.startTime > this.simTime
    ));

    lane.active = active;
    lane.queue = queued;

    return {
      active,
      queued,
      completedCount,
      queueLength: queued.length,
      meanWaitMs: completedCount > 0 ? (lane.totalWaitSec / completedCount) * 1000 : 0,
      theoryWaitMs: this.getTheoryWaitMs(lane.id)
    };
  }

  getTheoryWaitMs(laneId) {
    const meanServiceSec = SERVICE_A_SEC;
    const secondMomentSec = laneId === 'A'
      ? SERVICE_A_SEC ** 2
      : 0.9 * SERVICE_B_SHORT_SEC ** 2 + 0.1 * SERVICE_B_LONG_SEC ** 2;
    const utilization = this.lambda * meanServiceSec;
    if (utilization >= 1) return Infinity;
    return (this.lambda * secondMomentSec / (2 * (1 - utilization))) * 1000;
  }

  getQueueDepthSeries(lane, windowStart, windowEnd, pointCount = 48) {
    const cacheKey = `${windowStart}:${windowEnd}:${pointCount}`;
    if (lane.queueDepthCache?.key === cacheKey) return lane.queueDepthCache.values;

    const values = [];
    for (let index = 0; index < pointCount; index += 1) {
      const time = windowStart + ((windowEnd - windowStart) * index) / (pointCount - 1);
      const queueDepth = lane.timelineJobs.reduce((depth, job) => (
        job.arrivalTime <= time && job.startTime > time ? depth + 1 : depth
      ), 0);
      values.push(queueDepth);
    }
    lane.queueDepthCache = { key: cacheKey, values };
    return values;
  }

  step(dt) {
    if (dt <= 0) return;
    const targetTime = this.simTime + dt;
    while (targetTime >= this.generatedThroughSec) {
      this.simTime = this.generatedThroughSec;
      this.countArrivalsThrough(this.simTime);
      this.settleCompletedJobs(this.simTime);
      this.prepareNextWindow();
    }
    this.simTime = targetTime;
    this.countArrivalsThrough(this.simTime);
    this.settleCompletedJobs(this.simTime);
  }

  getMetrics() {
    return {
      timeMs: this.simTime * 1000,
      arrivals: this.arrivedCount,
      totalArrivals: this.arrivalCount,
      lanes: this.lanes.map((lane) => ({
        id: lane.id,
        ...this.getLaneState(lane)
      }))
    };
  }
}

export {
  SERVICE_A_SEC,
  SERVICE_B_SHORT_SEC,
  SERVICE_B_LONG_SEC,
  DEFAULT_TIMELINE_WINDOW_SEC
};
