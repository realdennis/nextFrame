const isFunction = (fn: unknown) => typeof fn === "function";

const nextFrameFactory = () => {
  let currentFrame = 0;
  let cancel = () => {};
  const signal = new Promise((_, reject) => {
    cancel = () => reject();
  });
  const next = () =>
    new Promise((resolve, reject) => {
      const rafID = window.requestAnimationFrame(() => {
        currentFrame++;
        resolve({ message: "Arrived", currentFrame });
      });
      signal.catch(() => {
        // clean up the effect and reject this `next` promise
        window.cancelAnimationFrame(rafID);
        reject({
          message: "canceled",
          currentFrame
        });
      });
    });
  return { cancelNextFrame: cancel, nextFrame: next };
};

const { nextFrame } = nextFrameFactory();

const _perFrameReducerFactory = () => {
  const _perFrameReducer = async (
    _prev: Promise<unknown> | Promise<() => Promise<unknown>>,
    next: () => unknown
  ) => {
    await nextFrame();
    const prev = await Promise.resolve(_prev);
    if (prev !== undefined) {
      await (prev as () => Promise<unknown>)();
    }
    isFunction(next) && next();
    // Just sync execute, we will wait frame in the start of next round
  };
  return _perFrameReducer as (a: unknown, b: unknown) => any; // work around
};
// _perFrameFactory is an work around for typescript asyn reduce
const perFrameReducer = _perFrameReducerFactory();

const perFrameMapper = (cb: () => unknown, idx: number) => async () => {
  for (let i = 0; i < idx; i++) {
    await nextFrame();
  }
  isFunction(cb) && cb();
};

export { nextFrame, nextFrameFactory, perFrameReducer, perFrameMapper };
