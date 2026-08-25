/**
 * QueuingEngine: Standalone discrete-event queuing simulation engine.
 * Pure ES6 module with zero DOM / Canvas dependencies, designed for high precision and unit testing.
 */

export class QueuingEngine {
  constructor(options = {}) {
    this.lambda = typeof options.lambda === 'number' ? options.lambda : 3.0;
    this.cores = typeof options.cores === 'number' ? options.cores : 2;
    this.mu = typeof options.mu === 'number' ? options.mu : 2.0;
    this.windowDuration = typeof options.windowDuration === 'number' ? options.windowDuration : 5.0;
    this.rng = options.rng || Math.random;

    this.reset();
  }

  reset() {
    this.currentTime = 0;
    this.sweepTime = 0;
    this.windowCycle = 0;
    this.requestIdCounter = 0;

    this.queue = [];
    this.completedJobs = [];
    this.nextArrival = this.expRandom(this.lambda);

    this.workers = [];
    for (let i = 0; i < this.cores; i++) {
      this.workers.push({
        id: i + 1,
        isBusy: false,
        busyUntil: 0,
        currentReqId: null,
        currentDuration: 0,
        blocks: []
      });
    }

    this.peakQueue = 0;
    this.cumulativeBusySec = 0;
    this.cumulativeCapacitySec = 0;
    this.smoothedOperatingRho = (this.lambda / (this.cores * this.mu)) * 100;
  }

  expRandom(rate) {
    if (rate <= 0) return 999999;
    return -Math.log(1.0 - Math.max(1e-7, Math.min(0.9999999, this.rng()))) / rate;
  }

  sampleServiceDuration(muRate) {
    return Math.max(0.08, this.expRandom(muRate));
  }

  setParameters({ lambda, cores, mu }) {
    if (typeof lambda === 'number' && lambda >= 0) this.lambda = lambda;
    if (typeof mu === 'number' && mu > 0) this.mu = mu;
    if (typeof cores === 'number' && cores > 0 && cores !== this.cores) {
      this.setCores(cores);
    }
  }

  setCores(targetCores) {
    const nextCores = Math.max(1, Math.min(16, targetCores));
    if (nextCores > this.workers.length) {
      for (let i = this.workers.length; i < nextCores; i++) {
        this.workers.push({
          id: i + 1,
          isBusy: false,
          busyUntil: 0,
          currentReqId: null,
          currentDuration: 0,
          blocks: []
        });
      }
    } else if (nextCores < this.workers.length) {
      this.workers = this.workers.slice(0, nextCores);
    }
    this.cores = nextCores;
  }

  step(dt) {
    if (dt <= 0) return;

    this.currentTime += dt;
    this.sweepTime += dt;

    // Track active worker busy counts & integrate physical capacity
    const currentBusyCount = this.workers.filter(w => w.isBusy).length;
    const currentCoreCount = Math.max(1, this.workers.length);
    this.cumulativeCapacitySec += currentCoreCount * dt;
    this.cumulativeBusySec += currentBusyCount * dt;

    // Continuous rolling time-average of physical worker core utilization (tau = 2.5s window)
    const instantRho = (currentBusyCount / currentCoreCount) * 100;
    const alpha = Math.min(1.0, dt / 2.5);
    this.smoothedOperatingRho = this.smoothedOperatingRho * (1.0 - alpha) + instantRho * alpha;

    // Handle 5-second Gantt micro-window boundary wrap
    if (this.sweepTime >= this.windowDuration) {
      this.sweepTime -= this.windowDuration;
      this.windowCycle++;
      this.nextArrival = Math.max(0, this.nextArrival - this.windowDuration);

      this.workers.forEach(w => {
        const carryOver = w.isBusy && w.busyUntil > this.windowDuration;
        const rem = carryOver ? w.busyUntil - this.windowDuration : 0;
        w.blocks = [];
        if (carryOver && rem > 0) {
          w.busyUntil = rem;
          w.blocks.push({
            start: 0,
            end: rem,
            duration: w.currentDuration || rem,
            reqId: w.currentReqId,
            isBusy: true
          });
        } else {
          w.isBusy = false;
          w.busyUntil = 0;
          w.currentReqId = null;
          w.currentDuration = 0;
        }
      });
    }

    // Process Poisson Arrivals
    while (this.sweepTime >= this.nextArrival) {
      this.requestIdCounter++;
      const serviceDuration = this.sampleServiceDuration(this.mu);
      this.queue.push({
        id: this.requestIdCounter,
        arrivalTime: this.nextArrival,
        serviceDuration: serviceDuration
      });
      this.nextArrival += this.expRandom(this.lambda);
    }

    if (this.queue.length > this.peakQueue) {
      this.peakQueue = this.queue.length;
    }

    // Dispatch Workers from FIFO Queue
    this.workers.forEach(w => {
      // Free worker if prior task completed
      if (w.isBusy && this.sweepTime >= w.busyUntil) {
        w.isBusy = false;
        w.currentReqId = null;
        w.currentDuration = 0;
      }

      if (!w.isBusy && this.queue.length > 0) {
        const job = this.queue.shift();
        const startExec = this.sweepTime;
        const endExec = startExec + job.serviceDuration;
        const waitTime = Math.max(0, startExec - job.arrivalTime);

        w.isBusy = true;
        w.busyUntil = endExec;
        w.currentReqId = job.id;
        w.currentDuration = job.serviceDuration;

        w.blocks.push({
          start: startExec,
          end: Math.min(this.windowDuration, endExec),
          duration: job.serviceDuration,
          reqId: job.id,
          isBusy: true
        });

        this.completedJobs.push({
          id: job.id,
          arrivalTime: job.arrivalTime,
          startExec: startExec,
          endExec: endExec,
          waitTime: waitTime,
          serviceDuration: job.serviceDuration,
          totalLatency: waitTime + job.serviceDuration
        });
      }
    });

    if (this.completedJobs.length > 50) {
      this.completedJobs = this.completedJobs.slice(-50);
    }
  }

  getMetrics() {
    const totalCap = this.cores * this.mu;
    const rawLoad = totalCap > 0 ? (this.lambda / totalCap) * 100 : 100;
    const theoRho = Math.min(100.0, rawLoad);
    const theoHeadroom = Math.max(0, 100.0 - theoRho);

    // Cumulative time-integrated physical utilization over the entire simulation run
    const cumRho = this.cumulativeCapacitySec > 0 
      ? (this.cumulativeBusySec / this.cumulativeCapacitySec) * 100 
      : theoRho;

    // Rolling time-averaged utilization (smoothly reacts to traffic bursts and idle periods over time)
    const rollingRho = this.currentTime > 0.2 ? this.smoothedOperatingRho : theoRho;
    const measuredRho = Math.min(100.0, Math.max(0.0, rollingRho));
    const headroom = Math.max(0.0, 100.0 - measuredRho);

    // Percentiles from recent job completions
    let p50 = 1.0 / this.mu;
    let p90 = (1.0 / this.mu) * 1.8;
    let meanLatency = 1.0 / this.mu;
    let meanWait = 0;

    if (this.completedJobs.length > 0) {
      const sorted = this.completedJobs.map(j => j.totalLatency).sort((a, b) => a - b);
      p50 = sorted[Math.floor((sorted.length - 1) * 0.5)];
      p90 = sorted[Math.floor((sorted.length - 1) * 0.9)];
      meanLatency = this.completedJobs.reduce((sum, j) => sum + j.totalLatency, 0) / this.completedJobs.length;
      meanWait = this.completedJobs.reduce((sum, j) => sum + j.waitTime, 0) / this.completedJobs.length;
    }

    return {
      lambda: this.lambda,
      cores: this.cores,
      mu: this.mu,
      capacity: totalCap,
      rawLoad: rawLoad,
      theoreticalRho: theoRho,
      theoreticalHeadroom: theoHeadroom,
      measuredRho: measuredRho,
      headroom: headroom,
      cumulativeRho: Math.min(100.0, Math.max(0, cumRho)),
      queueLength: this.queue.length,
      peakQueue: this.peakQueue,
      p50: p50,
      p90: p90,
      meanLatency: meanLatency,
      meanWait: meanWait
    };
  }
}
