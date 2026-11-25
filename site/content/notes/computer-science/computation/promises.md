---
title: "Implementing an A+ Conformant Promise Library in JavaScript the TDD Way"
summary: |
  Futures/promises refer to constructs used to synchronize program execution.
  Learning how they work under the hood by implementing them is a great fundamental skill to have.
  <br />
  <br />
  This article is about writing an A+ Promise implementation from scratch,
  following the A+ promise spec in JavaScript the TDD way.
image: /images/promises.png
tags: ["Promises", "JavaScript", "Futures", "Software Engineering"]
libraries: ["codapi"]
date: 2017-09-16T21:05:42Z
favorite: true
---

My objective is to write a Promises/A+ conformant implementation similar to [`then/promise`](https://github.com/then/promise/blob/master/src/core.js). Also, I'll do it the TDD way, where I'll write some tests first and then implement what's needed to make the tests pass (tests will be written on the [Jest](https://jestjs.io/) platform).

[This article](https://www.promisejs.org/implementing/) was one of the best references I found online. This implementation is heavily inspired by it. I'll also refer to the [A+ promise spec](https://promisesaplus.com/) when necessary.

### Promise state

A promise is an object/function that must be in one of these states: `PENDING`, `FULFILLED`, or `REJECTED`. Initially, the promise is in a `PENDING` state.

A promise can transition from a `PENDING` state to either a `FULFILLED` state with a fulfillment `value` or to a `REJECTED` state with a rejection `reason`.

To make the transition, the Promise constructor receives a function called `executor`. The executor is called immediately with two functions, `fulfill` and `reject`, that when called, perform the state transition:

- `fulfill(value)` - from `PENDING` to `FULFILLED` with `value`. The `value` is now a property of the promise.
- `reject(reason)` - from `PENDING` to `REJECTED` with `reason`. The `reason` is now a property of the promise.

```javascript
it('receives a executor function when constructed which is called immediately', () => {
  // mock function with spies
  const executor = jest.fn()
  const promise = new APromise(executor)
  // mock function should be called immediately
  expect(executor.mock.calls.length).toBe(1)
  // arguments should be functions
  expect(typeof executor.mock.calls[0][0]).toBe('function')
  expect(typeof executor.mock.calls[0][1]).toBe('function')
})

it('is in a PENDING state', () => {
  const promise = new APromise(function executor(fulfill, reject) { /* ... */ })
  // for the sake of simplicity the state is public
  expect(promise.state).toBe('PENDING')
})

it('transitions to the FULFILLED state with a `value`', () => {
  const value = ':)'
  const promise = new APromise((fulfill, reject) => {
    fulfill(value)
  })
  expect(promise.state).toBe('FULFILLED')
})

it('transitions to the REJECTED state with a `reason`', () => {
  const reason = 'I failed :('
  const promise = new APromise((fulfill, reject) => {
    reject(reason)
  })
  expect(promise.state).toBe('REJECTED')
})
```

The initial implementation is straightforward:

{{< snippet lang="javascript" >}}
// possible states
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

class APromise {
  constructor(executor) {
    // initial state
    this.state = PENDING
    // the fulfillment value or rejection reason is mapped internally to `value`
    // initially the promise doesn't have a value

    // call the executor immediately
    doResolve(this, executor)
  }
}

// fulfill with `value`
function fulfill(promise, value) {
  promise.state = FULFILLED
  promise.value = value
}

// reject with `reason`
function reject(promise, reason) {
  promise.state = REJECTED
  promise.value = reason
}

// creates the fulfill/reject functions that are arguments of the executor
function doResolve(promise, executor) {
  function wrapFulfill(value) {
    fulfill(promise, value)
  }

  function wrapReject(reason) {
    reject(promise, reason)
  }

  executor(wrapFulfill, wrapReject)
}
{{< /snippet >}}

### Observing state changes

To observe changes in the state of the promise (and the fulfillment value or rejection reason), we use the `then` method. The method receives two parameters, an `onFulfilled` function and an `onRejected` function. The rules to invoke these functions are the following:

- When the promise is in a `FULFILLED` state, the `onFulfilled` function will be called with the promise's fulfillment `value`, e.g., `onFulfilled(value)`.
- When the promise is in a `REJECTED` state, the `onRejected` function will be called with the promise's rejection `reason`, e.g., `onRejected(reason)`.

From now on, these functions will be referred to as promise `handlers`.

```javascript
it('should have a .then method', () => {
  const promise = new APromise(() => {})
  expect(typeof promise.then).toBe('function')
})

it('should call the onFulfilled method when a promise is in a FULFILLED state', () => {
  const value = ':)'
  const onFulfilled = jest.fn()
  const promise = new APromise((fulfill, reject) => {
    fulfill(value)
  })
    .then(onFulfilled)
  expect(onFulfilled.mock.calls.length).toBe(1)
  expect(onFulfilled.mock.calls[0][0]).toBe(value)
})

it('transitions to the REJECTED state with a `reason`', () => {
  const reason = 'I failed :('
  const onRejected = jest.fn()
  const promise = new APromise((fulfill, reject) => {
    reject(reason)
  })
    .then(null, onRejected)
  expect(onRejected.mock.calls.length).toBe(1)
  expect(onRejected.mock.calls[0][0]).toBe(reason)
})
```

Let's add the `.then` function to the class prototype. Note that it'll call either the `onFulfilled` or `onRejected` function based on the state of the promise:

{{< snippet lang="javascript" line="3-5,9-12" >}}
class APromise {
  // ...
  then(onFulfilled, onRejected) {
    handleResolved(this, onFulfilled, onRejected)
  }
  // ...
}

function handleResolved(promise, onFulfilled, onRejected) {
  const cb = promise.state === FULFILLED ? onFulfilled : onRejected
  cb(promise.value)
}
{{< /snippet >}}

### One-way transition

Once the transition to either `FULFILLED` or `REJECTED` occurs, the promise must not transition to any other state.

```javascript
const value = ':)'
const reason = 'I failed :('

it('when a promise is fulfilled it should not be rejected with another value', () => {
  const onFulfilled = jest.fn()
  const onRejected = jest.fn()

  const promise = new APromise((resolve, reject) => {
    resolve(value)
    reject(reason)
  })
  promise.then(onFulfilled, onRejected)

  expect(onFulfilled.mock.calls.length).toBe(1)
  expect(onFulfilled.mock.calls[0][0]).toBe(value)
  expect(onRejected.mock.calls.length).toBe(0)
  expect(promise.state === 'FULFILLED')
})

it('when a promise is rejected it should not be fulfilled with another value', () => {
  const onFulfilled = jest.fn()
  const onRejected = jest.fn()

  const promise = new APromise((resolve, reject) => {
    reject(reason)
    resolve(value)
  })
  promise.then(onFulfilled, onRejected)

  expect(onRejected.mock.calls.length).toBe(1)
  expect(onRejected.mock.calls[0][0]).toBe(reason)
  expect(onFulfilled.mock.calls.length).toBe(0)
  expect(promise.state === 'REJECTED')
})
```

In our current implementation, the function that calls the executor should make sure that either `fulfill` or `reject` is called only once. Subsequent calls should be ignored:

{{< snippet lang="javascript" line="2,5,6,11,12" >}}
function doResolve(promise, executor) {
  let called = false

  function wrapFulfill(value) {
    if (called) { return }
    called = true
    fulfill(promise, value)
  }

  function wrapReject(reason) {
    if (called) { return }
    called = true
    reject(promise, reason)
  }

  executor(wrapFulfill, wrapReject)
}
{{< /snippet >}}

### Handling executor errors

If the execution of the `executor` fails, the promise should transition to the `REJECTED` state with the failure reason.

```javascript
describe('handling executor errors', () => {
  it('when the executor fails the promise should transition to the REJECTED state', () => {
    const reason = new Error('I failed :(')
    const onRejected = jest.fn()
    const promise = new APromise((resolve, reject) => {
      throw reason
    })
    promise.then(null, onRejected)
    expect(onRejected.mock.calls.length).toBe(1)
    expect(onRejected.mock.calls[0][0]).toBe(reason)
    expect(promise.state === 'REJECTED')
  })
})
```

The function that calls the executor should wrap it in a try/catch block and transition to `REJECTED` if the catch block is executed:

{{< snippet lang="javascript" line="3-7" >}}
function doResolve(promise, executor) {
  // ...
  try {
    executor(wrapFulfill, wrapReject)
  } catch (err) {
    wrapReject(err)
  }
}
{{< /snippet >}}

### Async executor

If the resolver's `fulfill`/`reject` are executed asynchronously, our `.then` method will fail because its handlers are executed immediately.

```javascript
it('should queue callbacks when the promise is not fulfilled immediately', done => {
  const value = ':)'
  const promise = new APromise((fulfill, reject) => {
    setTimeout(fulfill, 1, value)
  })

  const onFulfilled = jest.fn()

  promise.then(onFulfilled)
  setTimeout(() => {
    // should have been called once
    expect(onFulfilled.mock.calls.length).toBe(1)
    expect(onFulfilled.mock.calls[0][0]).toBe(value)
    promise.then(onFulfilled)
  }, 5)

  // should not be called immediately
  expect(onFulfilled.mock.calls.length).toBe(0)

  setTimeout(function () {
    // should have been called twice
    expect(onFulfilled.mock.calls.length).toBe(2)
    expect(onFulfilled.mock.calls[1][0]).toBe(value)
    done()
  }, 10)
})

it('should queue callbacks when the promise is not rejected immediately', done => {
  const reason = 'I failed :('
  const promise = new APromise((fulfill, reject) => {
    setTimeout(reject, 1, reason)
  })

  const onRejected = jest.fn()

  promise.then(null, onRejected)
  setTimeout(() => {
    // should have been called once
    expect(onRejected.mock.calls.length).toBe(1)
    expect(onRejected.mock.calls[0][0]).toBe(reason)
    promise.then(null, onRejected)
  }, 5)

  // should not be called immediately
  expect(onRejected.mock.calls.length).toBe(0)

  setTimeout(function () {
    // should have been called twice
    expect(onRejected.mock.calls.length).toBe(2)
    expect(onRejected.mock.calls[1][0]).toBe(reason)
    done()
  }, 10)
})
```

Let's add a queue to the promise. Its purpose is to store handlers that will be called once the promise state changes from `PENDING` to something else. At the same time, our `.then` method should check the promise state to decide whether to call the handler immediately or to store it. Let's move this logic to a new helper function, `handle`:

{{< snippet lang="javascript" line="4-5,10,14-25,27-30" >}}
class APromise {
  constructor(executor) {
    this.state = PENDING
    // .then handler queue
    this.queue = []
    doResolve(this, executor)
  }

  then(onFulfilled, onRejected) {
    handle(this, { onFulfilled, onRejected })
  }
}

// checks the state of the promise to either:
// - queue it for later use if the promise is PENDING
// - call the handler if the promise is not PENDING
function handle(promise, handler) {
  if (promise.state === PENDING) {
    // queue if PENDING
    promise.queue.push(handler)
  } else {
    // execute immediately
    handleResolved(promise, handler)
  }
}

function handleResolved(promise, handler) {
  const cb = promise.state === FULFILLED ? handler.onFulfilled : handler.onRejected
  cb(promise.value)
}
{{< /snippet >}}

Also, the `fulfill` and `reject` methods should be updated so that they invoke all the handlers stored in the promise when called. This is implemented in a new function, `finale`, called after the state and the value have been updated.

{{< snippet lang="javascript" line="4,10,13-19" >}}
function fulfill(promise, value) {
  promise.state = FULFILLED
  promise.value = value
  finale(promise)
}

function reject(promise, reason) {
  promise.state = REJECTED
  promise.value = reason
  finale(promise)
}

// invoke all the handlers stored in the promise
function finale(promise) {
  const length = promise.queue.length
  for (let i = 0; i < length; i += 1) {
    handle(promise, promise.queue[i])
  }
}
{{< /snippet >}}

### Chaining promises

Our `.then` methods should return a new promise. Note that in the example below, `p.then` returns a promise `q`. The handler `qOnFulfilled` is stored on `q`, and the handler `rOnFulfilled` is stored in `r`.

```javascript
it('.then should return a new promise', () => {
  expect(function() {
    const qOnFulfilled = jest.fn()
    const rOnFulfilled = jest.fn()
    const p = new APromise(fulfill => fulfill())
    const q = p.then(qOnFulfilled)
    const r = q.then(rOnFulfilled)
  }).not.toThrow()
})
```

The implementation is again straightforward. However, as we'll see, the new promise transitions to a different state in a different way than by using an executor. The new promise uses the handlers to make the transition as follows:

- if the `onFulfilled` or `onRejected` function is called:
  - if there are **no errors** executing it, the promise will transition to the `FULFILLED` state with the returned value as the fulfillment `value`.
  - if there is an **error** executing it, the promise will transition to the `REJECTED` state with the error as the rejection `reason`.

Let's make the `.then` method return a promise first:

{{< snippet lang="javascript" line="4,5,7" >}}
class APromise {
  // ...
  then(onFulfilled, onRejected) {
    // empty executor
    const promise = new APromise(() => {})
    handle(this, { onFulfilled, onRejected })
    return promise
  }
}
{{< /snippet >}}

And then write the test to handle the new promise resolution:

```javascript
it('if .then\'s onFulfilled is called without errors it should transition to FULFILLED', () => {
  const value = ':)'
  const f1 = jest.fn()
  new APromise(fulfill => fulfill())
    .then(() => value)
    .then(f1)
  expect(f1.mock.calls.length).toBe(1)
  expect(f1.mock.calls[0][0]).toBe(value)
})

it('if .then\'s onRejected is called without errors it should transition to FULFILLED', () => {
  const value = ':)'
  const f1 = jest.fn()
  new APromise((fulfill, reject) => reject())
    .then(null, () => value)
    .then(f1)
  expect(f1.mock.calls.length).toBe(1)
  expect(f1.mock.calls[0][0]).toBe(value)
})

it('if .then\'s onFulfilled is called and has an error it should transition to REJECTED', () => {
  const reason = new Error('I failed :(')
  const f1 = jest.fn()
  new APromise(fulfill => fulfill())
    .then(() => { throw reason })
    .then(null, f1)
  expect(f1.mock.calls.length).toBe(1)
  expect(f1.mock.calls[0][0]).toBe(reason)
})

it('if .then\'s onRejected is called and has an error it should transition to REJECTED', () => {
  const reason = new Error('I failed :(')
  const f1 = jest.fn()
  new APromise((fulfill, reject) => reject())
    .then(null, () => { throw reason })
    .then(null, f1)
  expect(f1.mock.calls.length).toBe(1)
  expect(f1.mock.calls[0][0]).toBe(reason)
})
```

For the implementation, we first have to store the new promise in the handler queue as well. That way, if the observed promise is resolved, the elements in the queue know which promise they need to resolve.

{{< snippet lang="javascript" line="5-6,13-19" >}}
class APromise {
  // ...
  then(onFulfilled, onRejected) {
    const promise = new APromise(() => {})
    // store the promise as well
    handle(this, { promise, onFulfilled, onRejected })
    return promise
  }
}

function handleResolved(promise, handler) {
  const cb = promise.state === FULFILLED ? handler.onFulfilled : handler.onRejected
  // execute the handler and transition according to the rules
  try {
    const value = cb(promise.value)
    fulfill(handler.promise, value)
  } catch (err) {
    reject(handler.promise, err)
  }
}
{{< /snippet >}}

### Async handlers

Next, let's consider the case where a handler returns a promise. In this case, the promise that's part of the handler (not the returned promise) should adopt the state and fulfillment value or rejection reason of the returned promise.

```javascript
it('if a handler returns a promise, the previous promise should ' +
    'adopt the state of the returned promise', () => {
  const value = ':)'
  const f1 = jest.fn()
  new APromise(fulfill => fulfill())
    .then(() => new APromise(resolve => resolve(value)))
    .then(f1)
  expect(f1.mock.calls.length).toBe(1)
  expect(f1.mock.calls[0][0]).toBe(value)
})

it('if a handler returns a promise resolved in the future, ' +
    'the previous promise should adopt its value', done => {
  const value = ':)'
  const f1 = jest.fn()
  new APromise(fulfill => setTimeout(fulfill, 0))
    .then(() => new APromise(resolve => setTimeout(resolve, 0, value)))
    .then(f1)
  setTimeout(() => {
    expect(f1.mock.calls.length).toBe(1)
    expect(f1.mock.calls[0][0]).toBe(value)
    done()
  }, 10)
})
```

Let's imagine the following scenario:

```javascript
const executor = fulfill => setTimeout(fulfill, 0, 'p')
const p = new APromise(executor)

const qOnFulfilled = value =>
  new APromise(fulfill => fulfill(value + 'q'))
const q = p.then(qOnFulfilled)

const rOnFulfilled = value => (
  // value should be 'pq'
)
const r = q.then(rOnFulfilled)
```

In our current implementation, the tuple `{ q, qOnFulfilled }` is stored in the handlers of `p`, and we are sure that `qOnFulfilled` is called before storing the tuple `{ r, rOnFulfilled }` in `q`. We could take advantage of this fact and detect when a handler returns a promise to store observers in the returned promise instead, e.g., store `{ r, onFulfilled }` on the promise returned by `qOnFulfilled`.

Note that we're using a `while` loop because a nested promise might itself have another promise as its resolution value.

{{< snippet lang="javascript" line="2-5" >}}
function handle(promise, handler) {
  // take the state of the innermost promise
  while (promise.value instanceof APromise) {
    promise = promise.value
  }

  if (promise.state === PENDING) {
    // queue if PENDING
    promise.queue.push(handler)
  } else {
    // execute immediately
    handleResolved(promise, handler)
  }
}
{{< /snippet >}}

### Additional cases

#### Invalid handlers

If the handler that was supposed to be a function is not a function, our implementation will fail.

```javascript
it('works with invalid handlers (fulfill)', () => {
  const value = ':)'
  const f1 = jest.fn()

  const p = new APromise(fulfill => fulfill(value))
  const q = p.then(null)
  q.then(f1)

  expect(f1.mock.calls.length).toBe(1)
  expect(f1.mock.calls[0][0]).toBe(value)
})

it('works with invalid handlers (reject)', () => {
  const reason = 'I failed :('
  const r1 = jest.fn()

  const p = new APromise((fulfill, reject) => reject(reason))
  const q = p.then(null, null)
  q.then(null, r1)

  expect(r1.mock.calls.length).toBe(1)
  expect(r1.mock.calls[0][0]).toBe(reason)
})
```

Let's imagine the following scenario:

```javascript
const p = new APromise(fulfill => fulfill('p'))
const qOnFulfilled = null
const q = p.then(qOnFulfilled)
```

In this case, `q` should be resolved right away with the resolution value of `p`.

{{< snippet lang="javascript" line="4-11" >}}
function handleResolved(promise, handler) {
  const cb = promise.state === FULFILLED ? handler.onFulfilled : handler.onRejected
  // resolve immediately if the handler is not a function
  if (typeof cb !== 'function') {
    if (promise.state === FULFILLED) {
      fulfill(handler.promise, promise.value)
    } else {
      reject(handler.promise, promise.value)
    }
    return
  }
  try {
    const ret = cb(promise.value)
    fulfill(handler.promise, ret)
  } catch (err) {
    reject(handler.promise, err)
  }
}
{{< /snippet >}}

#### Execute the handlers after the event loop

Requirement [2.2.4](https://promisesaplus.com/#point-34): As pointed out in [3.1](https://promisesaplus.com/#point-67), the handlers are called with a fresh stack. Also, this makes the promise resolution consistent by ensuring that the observers are called in the future, even if the executor/handlers are synchronous.

```javascript
it('the promise observers are called after the event loop', done => {
  const value = ':)'
  const f1 = jest.fn()
  let resolved = false

  const p = new APromise(fulfill => {
    fulfill(value)  // should not execute f1 immediately
    resolved = true
  }).then(f1)

  expect(f1.mock.calls.length).toBe(0)

  setTimeout(function () {
    expect(f1.mock.calls.length).toBe(1)
    expect(f1.mock.calls[0][0]).toBe(value)
    expect(resolved).toBe(true)
    done()
  }, 10)
})
```

We can use any function that allows us to call a function after the event loop. This includes `setTimeout`, `setImmediate`, and `requestAnimationFrame`.

{{< snippet lang="javascript" line="2,4" >}}
function handleResolved(promise, handler) {
  setImmediate(() => {
    // ...
  })
}
{{< /snippet >}}

NOTE: Most of the unit tests must be changed to be async as well.

#### Reject with a resolved promise as a reason

Requirement [2.2.7.2](https://promisesaplus.com/#point-42)

```javascript
it('rejects with a resolved promise', done => {
  const value = ':)'
  const reason = new APromise(fulfill => fulfill(value))

  const r1 = jest.fn()
  const p = new APromise(fulfill => fulfill())
    .then(() => { throw reason })
    .then(null, r1)

  expect(r1.mock.calls.length).toBe(0)

  setTimeout(function () {
    expect(r1.mock.calls.length).toBe(1)
    expect(r1.mock.calls[0][0]).toBe(reason)
    done()
  }, 10)
})
```

Only adopt the state of the nested promise if the promise is not in a `REJECTED` state.

{{< snippet lang="javascript" line="3" >}}
function handle(promise, handler) {
  // take the state of the returned promise
  while (promise.state !== REJECTED && promise.value instanceof APromise) {
    promise = promise.value
  }
  if (promise.state === PENDING) {
    // queue if PENDING
    promise.queue.push(handler)
  } else {
    // execute handler (after the event loop)
    handleResolved(promise, handler)
  }
}
{{< /snippet >}}

#### A promise shouldn't be resolved with itself

Requirement [2.3.1](https://promisesaplus.com/#point-48)

```javascript
it('should throw when attempted to be resolved with itself', done => {
  const r1 = jest.fn()
  const p = new APromise(fulfill => fulfill())
  const q = p.then(() => q)
  q.then(null, r1)

  setTimeout(function () {
    expect(r1.mock.calls.length).toBe(1)
    expect(r1.mock.calls[0][0] instanceof TypeError).toBe(true)
    done()
  }, 10)
})
```

On the `fulfill` method, let's check that the fulfillment value is not equal to the promise itself. If so, then throw a `TypeError` as mentioned in [2.3.1](https://promisesaplus.com/#point-48).

{{< snippet lang="javascript" line="2-5" >}}
function fulfill(promise, value) {
  if (value === promise) {
    return reject(promise, new TypeError())
  }
  promise.state = FULFILLED
  promise.value = value
  finale(promise)
}
{{< /snippet >}}

#### Thenables

Related requirement [2.3.3.3](https://promisesaplus.com/#point-56): The handler's returned value may be a `thenable`, an object/function that has a `then` property that is accessible and is a function. The `then` function is like an executor; it receives `fulfill` and `reject` callbacks that should be used to transition the state of the thenable.

```javascript
it('should work with thenables', done => {
  const value = ':)'
  const thenable = {
    then: fulfill => fulfill(value)
  }
  const f1 = jest.fn()
  new APromise(fulfill => fulfill(value))
    .then(() => thenable)
    .then(f1)

  setTimeout(function () {
    expect(f1.mock.calls.length).toBe(1)
    expect(f1.mock.calls[0][0]).toBe(value)
    done()
  }, 10)
})
```

Let's modify the `fulfill` method and add the check for thenables. Note that accessing a property is not always a safe operation (e.g., the property might be defined using a [`getter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) that fails), which is why we should wrap it in a try/catch.

Also, note that by requirement [2.3.3.3](https://promisesaplus.com/#point-56), the thenable's `then` should be called with the thenable as `this`.

{{< snippet lang="javascript" line="5-24" >}}
function fulfill(promise, value) {
  if (value === promise) {
    return reject(promise, new TypeError())
  }
  if (value && (typeof value === 'object' || typeof value === 'function')) {
    let then
    try {
      then = value.then
    } catch (err) {
      return reject(promise, err)
    }

    // promise
    if (then === promise.then && promise instanceof APromise) {
      promise.state = FULFILLED
      promise.value = value
      return finale(promise)
    }

    // thenable
    if (typeof then === 'function') {
      return doResolve(promise, then.bind(value))
    }
  }

  // primitive
  promise.state = FULFILLED
  promise.value = value
  finale(promise)
}
{{< /snippet >}}


### The end

That was it! What I learned from implementing it on my own was that a promise can be a rejection error. Previously, I thought that promises would never be something that an observer would receive. I thought that all promises were unwrapped before being sent to the observer.

This is the final version of the `APromise` implementation (collapsed below) followed by a runnable test suite. Click **Run** to execute the tests directly in your browser.

<details class="tw-my-4 tw-rounded tw-border tw-border-gray-600/40 tw-p-3">
<summary class="tw-cursor-pointer tw-font-semibold">Full <code>APromise</code> implementation</summary>

```javascript
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

// Browser-compatible fallback for Node's setImmediate
const defer = typeof setImmediate === 'function'
  ? setImmediate
  : fn => setTimeout(fn, 0)

class APromise {
  constructor(executor) {
    this.state = PENDING
    this.queue = []
    doResolve(this, executor)
  }

  then(onFulfilled, onRejected) {
    const promise = new APromise(() => {})
    handle(this, { promise, onFulfilled, onRejected })
    return promise
  }
}

function fulfill(promise, value) {
  if (value === promise) {
    return reject(promise, new TypeError('A promise cannot be resolved with itself'))
  }
  if (value && (typeof value === 'object' || typeof value === 'function')) {
    let then
    try {
      then = value.then
    } catch (err) {
      return reject(promise, err)
    }

    // promise
    if (then === promise.then && value instanceof APromise) {
      promise.state = FULFILLED
      promise.value = value
      return finale(promise)
    }

    // thenable
    if (typeof then === 'function') {
      return doResolve(promise, then.bind(value))
    }
  }

  // primitive
  promise.state = FULFILLED
  promise.value = value
  finale(promise)
}

function reject(promise, reason) {
  promise.state = REJECTED
  promise.value = reason
  finale(promise)
}

function finale(promise) {
  const length = promise.queue.length
  for (let i = 0; i < length; i += 1) {
    handle(promise, promise.queue[i])
  }
}

function handle(promise, handler) {
  while (promise.state !== REJECTED && promise.value instanceof APromise) {
    promise = promise.value
  }
  if (promise.state === PENDING) {
    promise.queue.push(handler)
  } else {
    handleResolved(promise, handler)
  }
}

function handleResolved(promise, handler) {
  defer(() => {
    const cb = promise.state === FULFILLED ? handler.onFulfilled : handler.onRejected
    if (typeof cb !== 'function') {
      if (promise.state === FULFILLED) {
        fulfill(handler.promise, promise.value)
      } else {
        reject(handler.promise, promise.value)
      }
      return
    }
    try {
      const ret = cb(promise.value)
      fulfill(handler.promise, ret)
    } catch (err) {
      reject(handler.promise, err)
    }
  })
}

function doResolve(promise, executor) {
  let called = false

  function wrapFulfill(value) {
    if (called) { return }
    called = true
    fulfill(promise, value)
  }

  function wrapReject(reason) {
    if (called) { return }
    called = true
    reject(promise, reason)
  }

  try {
    executor(wrapFulfill, wrapReject)
  } catch (err) {
    wrapReject(err)
  }
}
```

<codapi-snippet id="apromise-impl" editor="off" hidden></codapi-snippet>

</details>

```javascript
// Minimal async test helper
let passed = 0, failed = 0
async function test(name, fn) {
  try { await fn(); passed++; console.log(`PASS: ${name}`) }
  catch (err) { failed++; console.log(`FAIL: ${name} -> ${err.message}`) }
}
function assertEqual(actual, expected) {
  if (actual !== expected) throw new Error(`expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)
}

// 1. State transition & chaining:
//    An async fulfillment propagates through chained .then() handlers.
await test('fulfills asynchronously and chains transformed values', () => new Promise((resolve, reject) => {
  new APromise(fulfill => setTimeout(() => fulfill(21), 5))
    .then(x => x * 2)
    .then(val => { assertEqual(val, 42); resolve() }, reject)
}))

// 2. One-way state transition (Spec 2.1.2 / 2.1.3):
//    Once fulfilled or rejected, subsequent calls to fulfill/reject are ignored.
await test('one-way transition ignores subsequent reject after fulfill', () => new Promise((resolve, reject) => {
  new APromise((fulfill, rej) => {
    fulfill('first')
    rej('second')
  }).then(val => { assertEqual(val, 'first'); resolve() }, reject)
}))

// 3. Executor error handling:
//    Synchronous throws inside the executor transition the promise to REJECTED.
await test('catches synchronous errors thrown in the executor', () => new Promise((resolve, reject) => {
  new APromise(() => { throw new Error('boom') })
    .then(reject, err => { assertEqual(err.message, 'boom'); resolve() })
}))

// 4. Async handlers / promise adoption (Spec 2.3.2):
//    When a handler returns another APromise, the outer promise adopts its state and value.
await test('adopts the state and value of a nested async promise', () => new Promise((resolve, reject) => {
  new APromise(fulfill => setTimeout(() => fulfill('p'), 5))
    .then(v => new APromise(fulfill => setTimeout(() => fulfill(v + 'q'), 5)))
    .then(val => { assertEqual(val, 'pq'); resolve() }, reject)
}))

// 5. Invalid handlers (Spec 2.2.1 / 2.2.7.3):
//    Non-function handlers are ignored and the value passes through to the next .then().
await test('passes through values when handlers are not functions', () => new Promise((resolve, reject) => {
  new APromise(fulfill => fulfill('ok'))
    .then(null)
    .then(val => { assertEqual(val, 'ok'); resolve() }, reject)
}))

// 6. Event-loop deferral (Spec 2.2.4):
//    Handlers must run asynchronously on a fresh stack, even when fulfilled synchronously.
await test('invokes handlers after the current turn of the event loop', () => new Promise((resolve, reject) => {
  const order = []
  new APromise(fulfill => fulfill('done')).then(() => {
    order.push('handler')
    assertEqual(order.join(','), 'sync,handler')
    resolve()
  }, reject)
  order.push('sync')
}))

// 7. Rejecting with a resolved promise (Spec 2.2.7.2):
//    A rejected promise passes the rejection reason as-is, even if the reason is itself a promise.
await test('rejects with a resolved promise without unwrapping it', () => new Promise((resolve, reject) => {
  const reason = new APromise(fulfill => fulfill(':)'))
  new APromise(fulfill => fulfill())
    .then(() => { throw reason })
    .then(reject, err => { assertEqual(err, reason); resolve() })
}))

// 8. Self-resolution guard (Spec 2.3.1):
//    Resolving a promise with itself must reject with a TypeError.
await test('rejects with TypeError when resolved with itself', () => new Promise((resolve, reject) => {
  const p = new APromise(fulfill => fulfill())
  const q = p.then(() => q)
  q.then(reject, err => { assertEqual(err instanceof TypeError, true); resolve() })
}))

// 9. Thenable assimilation (Spec 2.3.3):
//    Any object with a callable .then() method is assimilated as a promise.
await test('assimilates foreign thenables', () => new Promise((resolve, reject) => {
  const thenable = { then(fulfill) { fulfill('from thenable') } }
  new APromise(fulfill => fulfill())
    .then(() => thenable)
    .then(val => { assertEqual(val, 'from thenable'); resolve() }, reject)
}))

console.log(`\n${passed} passed, ${failed} failed`)
```

<codapi-snippet engine="browser" sandbox="javascript" editor="off" depends-on="apromise-impl"></codapi-snippet>

#### Running the A+ Promise compliance tests

This implementation passed all the 872 tests, cool!

>  872 passing (14s)


<div class="tw-my-5 tw-mx-auto">
  <div class="github-widget" data-repo="mauriciopoppe/implementing-promises-from-scratch"></div>
  <script src="https://cdn.rawgit.com/hustcc/GitHub-Repo-Widget.js/cf58d16b/GithubRepoWidget.min.js"></script>
</div>

#### Improvements

- Add a task queue so that the execution of multiple handlers happens in a *batch* (it's not actually a batch; the way the event loop works is that multiple calls to an API like `setTimeout` will add multiple tasks to the task queue as well. However, if we send them in a *batch*, all the handlers will be executed in a row in the next event loop).
- Add missing methods: `Promise.all`, `Promise.race`, and the like.
- Performance improvements: The creator of Bluebird has a [detailed document](https://github.com/petkaantonov/bluebird/wiki/Optimization-killers) with some optimization tips.
- Async stack traces: See [`q`](https://github.com/kriskowal/q#long-stack-traces).
