const isFunction = fn => typeof fn === "function";

export const nextFrameFactory = () => {
  let currentFrame = 0;
  let cancel;
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

export const { nextFrame } = nextFrameFactory();

export const perFrameReducer = async (_prev, next) => {
  await nextFrame();
  const prev = await Promise.resolve(_prev);
  prev !== undefined && (await prev());
  isFunction(next) && next();
};

export const perFrameMapper = (cb, idx) => async () => {
  for (let i = 0; i < idx; i++) {
    await nextFrame();
  }
  isFunction(cb) && cb();
};
