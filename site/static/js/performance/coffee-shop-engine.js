/**
 * CoffeeShopEngine (Bookstore & Reading Lounge Model)
 * Pure Little's Law Flow Simulation (L = λ · W)
 * 
 * Mechanics:
 * - Visitors enter the Bookstore & Reading Lounge at rate λ (Poisson process).
 * - Each visitor finds a spot (reading table, bookshelf, lounge chair) and spends duration W inside.
 * - Each visitor displays an individual countdown progress ring/bar indicating their remaining visit time.
 * - When their time W elapses, the visitor walks to the exit door and departs.
 * - In steady state, the number of people inside the store strictly satisfies Little's Law: L = λ · W.
 */

// Grid of reading desks & lounge spots inside the bookstore
export const LOUNGE_SPOTS = [
  // Top Row (Bookshelves & Desks)
  { x: 0.20, y: 0.32 }, { x: 0.32, y: 0.32 }, { x: 0.44, y: 0.32 }, { x: 0.56, y: 0.32 }, { x: 0.68, y: 0.32 }, { x: 0.80, y: 0.32 },
  // Middle Row (Reading Tables)
  { x: 0.20, y: 0.50 }, { x: 0.32, y: 0.50 }, { x: 0.44, y: 0.50 }, { x: 0.56, y: 0.50 }, { x: 0.68, y: 0.50 }, { x: 0.80, y: 0.50 },
  // Bottom Row (Cozy Armchairs)
  { x: 0.20, y: 0.68 }, { x: 0.32, y: 0.68 }, { x: 0.44, y: 0.68 }, { x: 0.56, y: 0.68 }, { x: 0.68, y: 0.68 }, { x: 0.80, y: 0.68 },
  // Overflow Row
  { x: 0.26, y: 0.41 }, { x: 0.38, y: 0.41 }, { x: 0.50, y: 0.41 }, { x: 0.62, y: 0.41 }, { x: 0.74, y: 0.41 },
  { x: 0.26, y: 0.59 }, { x: 0.38, y: 0.59 }, { x: 0.50, y: 0.59 }, { x: 0.62, y: 0.59 }, { x: 0.74, y: 0.59 }
];

export class CoffeeShopEngine {
  constructor(options = {}) {
    this.lambda = options.lambda ?? 1.5;         // arrivals per second
    this.durationW = options.durationW ?? 4.0;   // seconds stay per visitor
    this.seed = options.seed ?? null;
    this.seedState = this.seed ?? 12345;

    this.visitors = [];
    this.completedCount = 0;
    this.totalArrivals = 0;
    this.totalWaitTimeCompleted = 0;
    this.simTime = 0;
    this.nextArrivalCountdown = this._sampleInterArrivalTime();
    this.nextVisitorId = 1;
  }

  _random() {
    if (this.seed !== null) {
      this.seedState = (this.seedState * 1664525 + 1013904223) % 4294967296;
      return this.seedState / 4294967296;
    }
    return Math.random();
  }

  _sampleInterArrivalTime() {
    if (this.lambda <= 0) return Infinity;
    const u = Math.max(1e-6, this._random());
    return -Math.log(u) / this.lambda;
  }

  setLambda(newLambda) {
    this.lambda = Math.max(0.1, newLambda);
  }

  setDurationW(newW) {
    const oldW = this.durationW;
    this.durationW = Math.max(0.5, newW);
    // Dynamically adjust active visitors' target duration proportionally
    if (oldW > 0) {
      for (const v of this.visitors) {
        v.targetDuration = (v.targetDuration / oldW) * this.durationW;
      }
    }
  }

  forceArrival() {
    this._spawnVisitor();
  }

  reset() {
    this.visitors = [];
    this.completedCount = 0;
    this.totalArrivals = 0;
    this.totalWaitTimeCompleted = 0;
    this.simTime = 0;
    this.seedState = this.seed ?? 12345;
    this.nextArrivalCountdown = this._sampleInterArrivalTime();
    this.nextVisitorId = 1;
  }

  _spawnVisitor() {
    this.totalArrivals++;
    const spotIndex = (this.totalArrivals - 1) % LOUNGE_SPOTS.length;
    const targetSpot = LOUNGE_SPOTS[spotIndex];

    const visitor = {
      id: this.nextVisitorId++,
      arrivalTime: this.simTime,
      targetDuration: this.durationW,
      timeInShop: 0,
      progress: 0,
      state: 'WALKING_IN', // WALKING_IN -> READING -> WALKING_OUT -> DEPARTED
      x: 0.05,
      y: 0.50,
      targetX: targetSpot.x + (this._random() - 0.5) * 0.03,
      targetY: targetSpot.y + (this._random() - 0.5) * 0.03,
      colorVariant: (this.totalArrivals % 5)
    };
    this.visitors.push(visitor);
  }

  update(dt) {
    this.simTime += dt;

    // 1. Process Arrivals
    this.nextArrivalCountdown -= dt;
    while (this.nextArrivalCountdown <= 0) {
      this._spawnVisitor();
      this.nextArrivalCountdown += this._sampleInterArrivalTime();
    }

    // 2. Advance existing visitors
    for (let i = this.visitors.length - 1; i >= 0; i--) {
      const v = this.visitors[i];
      v.timeInShop += dt;
      v.progress = Math.min(1.0, v.timeInShop / v.targetDuration);

      if (v.progress < 0.15) {
        // Walking from entrance (0.05, 0.50) to assigned reading spot
        const walkP = v.progress / 0.15;
        v.x = 0.05 + (v.targetX - 0.05) * walkP;
        v.y = 0.50 + (v.targetY - 0.50) * walkP;
        v.state = 'WALKING_IN';
      } else if (v.progress < 0.85) {
        // Relaxing / Reading at spot
        v.x = v.targetX;
        v.y = v.targetY;
        v.state = 'READING';
      } else if (v.progress < 1.0) {
        // Walking from reading spot to exit door (0.95, 0.50)
        const walkOutP = (v.progress - 0.85) / 0.15;
        v.x = v.targetX + (0.95 - v.targetX) * walkOutP;
        v.y = v.targetY + (0.50 - v.targetY) * walkOutP;
        v.state = 'WALKING_OUT';
      } else {
        // Departed
        this.completedCount++;
        this.totalWaitTimeCompleted += v.timeInShop;
        this.visitors.splice(i, 1);
      }
    }
  }

  getVisitors() {
    return this.visitors;
  }

  // Alias for simulator compatibility
  getCustomers() {
    return this.visitors;
  }

  getMetrics() {
    const liveCount = this.visitors.length;
    const theoreticalL = this.lambda * this.durationW;

    const empiricalAvgW = this.completedCount > 0 
      ? this.totalWaitTimeCompleted / this.completedCount 
      : this.durationW;

    return {
      liveCount,
      theoreticalL,
      completedCount: this.completedCount,
      totalArrivals: this.totalArrivals,
      empiricalAvgW,
      simTime: this.simTime,
      lambda: this.lambda,
      durationW: this.durationW
    };
  }
}
