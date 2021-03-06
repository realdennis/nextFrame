import {
  nextFrame,
  nextFrameFactory,
  perFrameReducer,
  perFrameMapper
} from "../index";

it("nextFrame should promisify", async () => {
  expect(nextFrame()).resolves.toBeTruthy();
});

it("nextFrame should be cancel by cancelNextFrame generated by the same factory call", async () => {
  const { nextFrame: next, cancelNextFrame: cancel } = nextFrameFactory();
  const chunk = jest.fn();
  try {
    await next();
    chunk();
    await next();
    chunk();
    cancel(); // the below code will not work anymore
    await next();
    chunk();
    await next();
    chunk();
  } catch (e) {
    expect(chunk.mock.calls.length).toEqual(2);
    expect(e.currentFrame).toEqual(2);
  }
});

it("perFrameReducer works as expected", async () => {
  const chunk = jest.fn();
  await ([chunk, chunk, chunk].reduce(perFrameReducer) as unknown);
  expect(chunk.mock.calls.length).toEqual(3);
});

it("perFrameMapper works as expected", async () => {
  const chunk = jest.fn();
  const scheduledChunks = [chunk, chunk, chunk].map(perFrameMapper);
  expect(scheduledChunks[0]()).resolves.toEqual(undefined);
  expect(chunk.mock.calls.length).toEqual(1);
});
