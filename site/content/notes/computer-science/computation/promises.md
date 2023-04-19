---
title: "Implementing an A+ conformat Promise library in JavaScript the TDD way"
description: |
  Future/promises refer to constructs used to synchronize program execution.
  Learning how it works under the hood by implementing it is a great fundamental skill to know.
  <br />
  <br />
  This article is about writing an A+ Promise implementation from scratch
  following the A+ promise spec in JavaScript the TDD way.
image: /images/promises.png
tags: ["Promises", "JavaScript", "Futures", "Software Engineering"]
date: 2017-09-16T21:05:42Z
---

My objective is to write a Promises/A+ conformant implementation similar to [`then/promise`](https://github.com/then/promise/blob/master/src/core.js), also, I'll do it the TDD way where I'll write the some tests first and then implement what's needed to make the tests pass (tests will be written on the platform [Jest](https://facebook.github.io/jest/))

[This article](https://www.promisejs.org/implementing/) was one of the best references I found online, this implementation is heavily inspired by it. I'll also refer to the [A+ promise spec](https://promisesaplus.com/) when necessary.

### Promise state

A promise is an object/function that must be in one of these states: `PENDING`, `FULFILLED`, `REJECTED`, initially the promise is in a `PENDING` state.

A promise can transition from a `PENDING` state to either a `FULFILLED` state with a fulfillment `value` or to a `REJECTED` state with a rejection `reason`.

To make the transition the Promise constructor receives a function called `executor`, the executor is called immediately with two functions `fulfill` and `reject` that when called perform the state transition:

- `fulfill(value)` - from `PENDING` to `FULFILLED` with `value`, the `value` is now a property of the promise.
- `reject(reason)` - from `PENDING` to `REJECTED` with `reason`, the `reason` is now a property of the promise.

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

The initial implementation is straightforward

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

{{< repl external="true" id="@mauriciopoppe/Implementing-Promises-from-Scratch-1" >}}

### Observing state changes

To observe changes in the state of the promise (and the fulfillment value or rejection reason) we use the `then` method, the method receives 2 parameters, an `onFulfilled` function and an `onRejected` function, the rules to invoke these functions are the following:

- when the promise is in a `FULFILLED` state the `onFulfilled` function will be called with the promise's fulfillment `value` e.g. `onFulfilled(value)`
- when the promise is in a `REJECTED` state the `onRejected` function will be called with the promise's rejection `reason` e.g. `onRejected(reason)`

From now on these functions will be referred as promise `handlers`.

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

Let's add the `.then` function to the class prototype, note that it'll call either the `onFulfilled` or `onRejected` function based on the state of the promise

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

{{< repl external="true" id="@mauriciopoppe/Implementing-Promises-from-Scratch-2" >}}

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

In our current implementation, the function that calls the executor should make sure that either `fulfill` or `reject` is called once, subsequent calls should be ignored

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

{{< repl external="true" id="@mauriciopoppe/Implementing-Promises-from-Scratch-3" >}}

### Handling executor errors

If the execution of the `executor` fails the promise should transition to the `REJECTED` state with the failure reason

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

The function that calls the executor should wrap it in a try/catch block and transition to `REJECTED` if the catch block is executed

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

{{< repl external="true" id="@mauriciopoppe/Implementing-Promises-from-Scratch-4" >}}

### Async executor

If the resolver's `fulfill`/`reject` are executed asynchronously our `.then` method will fail because its handlers are executed immediately.

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

Let's add a queue to the promise, its purpose is to store handlers that will be called once the promise state changes from `PENDING` to something else, at the same time our `.then` method should check the promise state to decide whether to call the handler immediately or to store the handler, let's move this logic to a new helper function `handle`

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

Also the `fulfill`, `reject` methods should be updated so that they invoke all the handlers stored in the promise when called, this is implemented in a new function `finale` called after the state and the value have been updated.

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

{{< repl external="true" id="@mauriciopoppe/Implementing-Promises-from-Scratch-5" >}}

### Chaining promises

Our `.then` methods should return a new promise. Note that in the example below `p.then` returns a promise `q`, the handler `qOnFulfilled` is stored on `q`, also the handler `rOnFulfilled` is stored in `r`.

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

The implementation is again straightforward, however as we'll see the new promise transitions to a different state in a different way than using a executor, the new promise uses the handlers to make the transition as follows:

- if the `onFulfilled` or `onRejected` function is called
  - if there are **no errors** executing it, the promise will transition to the `FULFILLED` state with the returned value as the fulfillment `value`
  - if there is an **error** executing it, the promise will transition to the `REJECTED` state with the error as the rejection `reason`

Let's make the `.then` method return a promise first

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

And then write the test to handle the new promise resolution

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

For the implementation, we first have to store the new promise in the handler queue as well, that way if the observed promise is resolved the elements in the queue know which promise they need to resolve.

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

{{< repl external="true" id="@mauriciopoppe/Implementing-Promises-from-Scratch-6" >}}

### Async handlers

Next let's consider the case where a handler returns a promise, in this case, the promise that's part of the handler (not the returned promise) should adopt the state and fulfillment value or rejection reason of the returned promise.

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

Let's imagine the following scenario

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

In our current implementation the tuple `{ q, qOnFulfilled }` is stored in the handlers of `p` and we are sure that `qOnFulfilled` is called before storing the tuple `{ r, rOnFulfilled }` in `q`, we could take advantage of this fact and detect when a handler returns a promise to store observers in the returned promise instead e.g. store `{ r, onFulfilled }` on the promise returned by `qOnFulfilled`.

Note that we're using a `while` because a nested promise might itself have another promise as the resolution value.

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

{{< repl external="true" id="@mauriciopoppe/Implementing-Promises-from-Scratch-7" >}}

### Additional cases

#### Invalid handlers

If the handler that was supposed to be a function is not a function our implementation will fail

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

Let's imagine the following scenario

```javascript
const p = new APromise(fulfill => fulfill('p'))
const qOnFulfilled = null
const q = p.then(qOnFulfilled)
```

In this case, `q` should be resolved right away with the resolution value of `p`

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

Requirement [2.2.4](https://promisesaplus.com/#point-34), as pointed in [3.1](https://promisesaplus.com/#point-67) the handlers are called with a fresh stack, also, this makes the promise resolution consistent by ensuring that the observers are called in the future even if the executor/handlers are synchronous.

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

We can use any function that allows us to call a function after the event loop, this includes `setTimeout`, `setImmediate` and `requestAnimationFrame`

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

Only adopt the state of the nested promise if the promise is not in a REJECTED state.

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

On the `fulfill` method let's check that the fulfillment value is not equal to the promise itself, if so then throw a `TypeError` as mentioned in [2.3.1](https://promisesaplus.com/#point-48)

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

Related requirement [2.3.3.3](https://promisesaplus.com/#point-56), the handler's returned value may be a `thenable`, an object/function that has a `then` property that is accessible and that is a function, the `then` function is like a executor, it receives a `fulfill` and `reject` callbacks that should be used to transition the state of the thenable.

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

Let's modify the `fulfill` method and add the check for thenables, note that accessing a property is not always a safe operation (e.g. the property might be defined using a [`getter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) that fails), that's why we should wrap it in a try/catch.

Also, note that by the requirement [2.3.3.3](https://promisesaplus.com/#point-56) the thenable's `then` should be called with the thenable as `this`

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

That was it! What I learned from implementing it on my own was that a promise can be a rejection error, previously I thought that promises would never be something that an observer would receive, I thought that all the promises were unwrapped before sending them to the observer.

This is the final version of our tests and the promise implementation

{{< repl external="true" id="@mauriciopoppe/Implementing-Promises-from-Scratch-8" >}}

#### Running the A+ Promise compliance tests

This implementation passed all the 872 tests, cool!

>  872 passing (14s)


<div class="github-card__wrapper">
  <div class="github-widget" data-repo="mauriciopoppe/implementing-promises-from-scratch"></div>
  <script src="https://cdn.rawgit.com/hustcc/GitHub-Repo-Widget.js/cf58d16b/GithubRepoWidget.min.js"></script>
</div>

<style>
.github-card__wrapper {
  margin: 20px auto;
}
</style>

#### Improvements

- Add a task queue so that the execution of multiple handlers happens in a *batch* (it's not actually a batch, the way the event loop works is that multiple calls to an API like `setTimeout` will add multiple tasks to the task queue as well, however, if we send them in a *batch* all the handlers will be executed in a row in the next event loop)
- Add missing methods: `Promise.all`, `Promise.race` and the like
- Performance improvements, the creator of BlueBird has a [detailed document](https://github.com/petkaantonov/bluebird/wiki/Optimization-killers) with some optimization tips
- Async stack traces, see [`q`](https://github.com/kriskowal/q#long-stack-traces)

<script> document.body.classList.add('high-performance') </script>
