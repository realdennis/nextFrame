const isFunction = fn => typeof fn === "function";

export const nextFrame = async () =>
  new Promise(resolve => window.requestAnimationFrame(resolve));

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
