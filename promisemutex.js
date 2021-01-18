// the returned function stores mulitple callbacks and processes them one after
// another -waiting for the first to complete before calling the next, useful
// for holding off execution of function bodies that add numerous calls to the 
// stack.

const promisemutexCallLimit = async mutexState => {
  const getPromise = mutexState.getPromiseArr.shift();

  await getPromise();

  if (mutexState.getPromiseArr.length) {
    return promisemutexCallLimit(mutexState);
  } else {
    mutexState.isActive = false;
  }
};

const promisemutexAdd = async (mutexState, getPromiseFn) => {
  mutexState.getPromiseArr.push(getPromiseFn);
  if (mutexState.isActive === false) {
    mutexState.isActive = true;
    return promisemutexCallLimit(mutexState);
  }
};

export default () => {
  const mutexState = {
    isActive : false,
    getPromiseArr : []
  };

  return async getPromiseFn => promisemutexAdd(mutexState, getPromiseFn);
};
