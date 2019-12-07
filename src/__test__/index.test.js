import "regenerator-runtime/runtime";
import { nextFrame, perFrameReducer, perFrameMapper } from "../index.js";

it("nextFrame should promisify", async () => {
  expect(nextFrame()).resolves.toBeTruthy();
});

it("perFrameReducer works as expected", async () => {
  const chunk = jest.fn();
  await [chunk,chunk,chunk].reduce(perFrameReducer);
  expect(chunk.mock.calls.length).toEqual(3);
});

it("perFrameMapper works as expected", async () => {
  const chunk = jest.fn();
  const scheduledChunks = [chunk,chunk,chunk].map(perFrameMapper);
  expect(scheduledChunks[0]()).resolves.toEqual(undefined)
  expect(chunk.mock.calls.length).toEqual(1);
});