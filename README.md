promisemutex
============
**(c)[Bumblehead][0]**

[![Build Status](https://travis-ci.org/iambumblehead/promisemutex.svg?branch=master)](https://travis-ci.org/iambumblehead/promisemutex)

Promises added to the mutex are handled sequentially.

``` javascript
import promisemutex from './promisemutex';

const mutex = promisemutex();

await Promise.all([
  mutex(async () => {
    await resolveAfterSeconds(4);
    state.firstPromiseEnded = Date.now();
  }),
  mutex(async () => {
    state.secondPromiseStarted = Date.now() + 1;
    await resolveAfterSeconds(1);
  })
]);
```

In the example, the second async function is called only after the first async function completes. This is useful in rare cases where async functions must be processed sequentially within concurrent stacks.



[0]: http://www.bumblehead.com "bumblehead"
