import test from 'ava';
import promisemutex from './promisemutex';

const promiseDelay = (fn, delay) => new Promise(resolve => {
  setTimeout(() => {
    fn();
    resolve();
  }, delay);
});

const resolveAfterSeconds = ss => promiseDelay(() => {}, ss * 1000);

test('should work with a nice little example', async t => {
  const mutex = promisemutex();
  const state = {};

  await mutex(async () => {
    await resolveAfterSeconds(4);
    state.firstPromiseEnded = Date.now();
  });

  await mutex(async () => {
    state.secondPromiseStarted = Date.now() + 1;
    await resolveAfterSeconds(1);
  });

  t.true(state.firstPromiseEnded < state.secondPromiseStarted);
});

test('should work with calls from alternating stacks', async t => {
  const mutex = promisemutex();
  const state = {};

  setTimeout(() => {
    mutex(async () => {
      await resolveAfterSeconds(4);
      state.firstPromiseEnded = Date.now();
    });
  });

  setTimeout(() => {
    mutex(async () => {
      state.secondPromiseStarted = Date.now() + 1;
      await resolveAfterSeconds(1);
    });
  });

  await promiseDelay(() => {
    t.true(state.firstPromiseEnded < state.secondPromiseStarted);
  }, 6000);
});

test('should work with promise.all', async t => {
  const mutex = promisemutex();
  const state = {};
  
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

  t.true(state.firstPromiseEnded < state.secondPromiseStarted);
});


test("should call a queue of promises, one after another", async t => {
  const mutex = promisemutex();
  var count = 0;

  await mutex(() => promiseDelay(() => {
    if (count === 0) count++;
  }, 200));

  await mutex(() => promiseDelay(() => {
    if (count === 1) count++;
  }, 300));

  await mutex(() => promiseDelay(() => {
    if (count === 2) count++;
  }, 100));

  await promiseDelay(() => {
    t.is(count, 3);
  }, 1000);
});
